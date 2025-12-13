import CryptoJS from "crypto-js";

function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, import.meta.env.VITE_SALT).toString();
}


// 自定义fetch封装
export async function customFetch(url: string, options?: RequestInit): Promise<globalThis.Response> {
  const newOptions = { ...options };
  
  // 如果是POST且URL包含sqlBase，加密请求体
  if (options?.method === 'POST' && url.includes('sqlBase')) {
    const body = options.body;
    if (typeof body === 'string') {
      newOptions.body = encryptData(body);
    }
  }
  
  return fetch(url, newOptions);
}

// 默认导出原生的fetch
export default customFetch;
