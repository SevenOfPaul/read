import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ImageUploadConfig, ImageUploadResponse } from "../../types/upload";
import { customFetch } from "../../lib/fetch";

// 图片服务配置
const imageConfig: ImageUploadConfig = {
  uploadUrl: import.meta.env.VITE_IMAGE_UPLOAD_URL,
  authToken:'imgbed_1TODpqhCd9bxbd20FfOnSJprfWwHrbD3',
  maxRetries: 3,
  timeout: 30000,
  delay: 1000
};

// 带超时的fetch请求
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), imageConfig.timeout);

  try {
    const response = await customFetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// 生成文件名
function generateFileName(bookName: string, file: File): string {
  const cleanBookName = bookName;
  return `${cleanBookName}.jpg`;
}

// 延迟函数
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}




// 上传新图片
export async function uploadImage(file: File, bookName: string): Promise<string> {
  const maxRetries = imageConfig.maxRetries;
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // 构建上传URL
      const uploadUrl = `${imageConfig.uploadUrl}?authCode=${imageConfig.authToken}&uploadChannel=cfr2&uploadNameType=origin`;
      
      // 创建FormData
      const formData = new FormData();
      const fileName = generateFileName(bookName, file);
      const blob = new Blob([await file.arrayBuffer()]);
      formData.append('file', blob, fileName);

      // 发送上传请求
      const response = await fetchWithTimeout(uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`上传失败: ${response.status} ${response.statusText}`);
      }

      const uploadData: ImageUploadResponse[] = await response.json();
      
      if (uploadData && uploadData.length > 0 && uploadData[0].src) {
        return uploadData[0].src;
      } else {
        throw new Error('上传响应格式不正确');
      }
      
    } catch (error) {
      console.error(`第 ${attempt} 次上传尝试失败:`, error);
      lastError = error as Error;
      
      // 如果不是最后一次尝试，等待后重试
      if (attempt < maxRetries) {
        await delay(imageConfig.delay * attempt);
      }
    }
  }

  throw lastError || new Error('图片上传失败');
}


// 使用React Query上传图片
export function useUploadImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, bookName }: { file: File; bookName: string }) => uploadImage(file, bookName),
    onSuccess: (data, variables) => {
      // 上传成功后更新缓存
      queryClient.setQueryData(['bookImage', variables.bookName], data);
    },
    onError: (error, variables) => {
      console.error('图片上传失败:', error);
    }
  });
}
