import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import storageUtil from "../utils/localStorageUtil";

// export const baseURL = 'https://sp8i2ylyxd.execute-api.ap-southeast-2.amazonaws.com/development';
// export const baseURL = 'https://ied1p42ph8.execute-api.ap-southeast-2.amazonaws.com/development';
export const baseURL = "https://api-services.bytesized.com.au";

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {


    //ToDO: Refactor this code
    const excludedUrl = 'https://byte-sized-eoi-ui-development.s3.amazonaws.com/';

    if (config.url && config.url.startsWith(excludedUrl)) {
      return config;
    }

    let token: any = storageUtil.getItemSession("authToken");
    if (token) {
      config.headers["Authorization"] = `${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


type ApiResponse<T = any> = AxiosResponse<T>;

const request = async <T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any,
  headers?: Record<string, string>
): Promise<T> => {
  try {
    const response: ApiResponse<T> = await api({
      method,
      url,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    throw error;
  }
};

// GET method
const get = async <T>(url: string): Promise<T> => {
  return request<T>("get", url);
};

// POST method
const post = async <T>(url: string, data?: any, p0?:  { 'Content-Type': string; }): Promise<T> => {
  return request<T>("post", url, data, p0);
};

// PUT method
const put = async <T>(url: string, data: any): Promise<T> => {
  return request<T>("put", url, data);
};

// DELETE method
const del = async <T>(url: string): Promise<T> => {
  return request<T>("delete", url);
};

export default {
  get,
  post,
  put,
  delete: del,
};
