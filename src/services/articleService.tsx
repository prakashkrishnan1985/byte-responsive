import axiosConfig from "./axiosConfig";

export interface InquiryPayload {
  email: string;
  user_type: 'blog_subscriber',
}


// article services
export const getArticlesById = async (id: string) => {
    try {
      const response = await axiosConfig.get(`/v1/articles/${id}`);
      return response;
    } catch (error) {
      console.error("Error in getting articles:", error);
      throw error;
    }
  };

  export const getArticlesList = async () => {
    try {
      const response = await axiosConfig.get(`/v1/articles/list/?per_page=40`);
      return response;
    } catch (error) {
      console.error("Error in getting articles list:", error);
      throw error;
    }
  };
  
  export const PostArticle = async (payload: any) => {
    try {
      const response = await axiosConfig.post("/v1/articles", payload);
      return response;
    } catch (error) {
      console.error("Error in posting articles:", error);
      throw error;
    }
  };
  
  export const PutArticle = async (payload: any) => {
    try {
      const response = await axiosConfig.put(`/v1/articles`, payload);
      return response;
    } catch (error) {
      console.error("Error in updating articles:", error);
      throw error;
    }
  };
  
  export const DeleteArticle = async (id: string) => {
    try {
      const response = await axiosConfig.delete(`/v1/articles/${id}`);
      return response;
    } catch (error) {
      console.error("Error in deleting article:", error);
      throw error;
    }
  };
  
  export const getSignedUrl = async (payload: any) => {
    try {

      const response = await axiosConfig.post('/v1/articles/upload_url', payload);
  
      return response;
    } catch (error) {
      console.error('Error on image upload:', error);
      throw error;
    }
  };

  export const postImage = async (url:string, payload:any)=>{
    try {
      const response = await axiosConfig.post(url, payload,  { 'Content-Type': 'multipart/form-data' });  
      return response;
    } catch (error) {
      console.error('Error on image upload:', error);
      throw error;
    }
  }
  

  export const postInquiry = async (payload: InquiryPayload) => {
    try {
      const response = await axiosConfig.post("/v1/inquiry", payload);
      return response;
    } catch (error) {
      console.error('Error on inquiry post:', error);
      throw error;
    }
  };
  
  