import CryptoJS from "crypto-js";

function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, import.meta.env.VITE_SALT).toString();
}


// 自定义fetch封装
export async function customFetch(url: string, options?: RequestInit): Promise<globalThis.Response> {
  
  // 如果是POST且URL包含sqlBase，加密请求体
  if (options?.method === 'POST' && url.includes('sqlBase')&&typeof options.body === 'string') {
    const body=JSON.parse(options.body);
    for(let key of Object.keys(body)){
      body[key] = encryptData(body[key]);
    } 
     options.body=JSON.stringify(body);
  }
  
  return fetch(url, options);
}

// 默认导出原生的fetch
export default customFetch;
