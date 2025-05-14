import axiosConfig from './axiosConfig';
import { AxiosResponse } from 'axios';

export interface PayloadUpdateWidget {
  description?: string;
  header_title?: string;
  widget_type: string;
  ai_type: string;
  intial_message?: string;
  color_code: string;
  opacity?: number;
  website_domain: string;
  script: string;
  widget_id: string;
  image_url?: string;
}

export type PayloadCreateWidegt = {
  name: string;
  description: string;
};

export interface PayloadSignedUrl{
  type: string;
  widget_id: string;
}

export const createWidget = async (payload: PayloadCreateWidegt) => {
    try {
      const response = await axiosConfig.post('/v1/widget', payload);
      return response;
    } catch (error) {
      console.error('Error during subscription:', error);
    }
  };

export const updateWidget = async (payload: PayloadUpdateWidget): Promise<AxiosResponse> => {
  try {
    const response = await axiosConfig.put<any>('/v1/widget', payload);
    return response; 
  } catch (error) {
    console.error('Error updating user agents:', error);
    throw error;
  }
};


export const getWidgetById = async (id:string) => {
  try {
    const response = await axiosConfig.get(`/v1/widget/${id}`);  
    return response;
  } catch (error) {
    console.error('Error getting user onboarding stage:', error);
    throw error;
  }
};

export const getSignedUrl = async (payload:PayloadSignedUrl)=>{
  try {
    const response = await axiosConfig.post(`/v1/widget/upload_url`, payload);  
    return response;
  } catch (error) {
    console.error('Error getting user onboarding stage:', error);
    throw error;
  }
}

export const postImage = async (url:string, payload:any)=>{
  try {
    const response = await axiosConfig.post(url, payload);  
    return response;
  } catch (error) {
    console.error('Error on image upload:', error);
    throw error;
  }
}


