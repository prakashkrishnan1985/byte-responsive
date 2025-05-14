// api.ts
import axiosConfig from './axiosConfig'; // Import the axios instance
import { AxiosResponse } from 'axios';

interface SelectedField {
  agent_id: string;
  selected_choices: string[];
}

interface Payload {
  session_id: string;
  email_id?: string;
  agent_ids: string[];
  selected_fields: SelectedField[];
  id: string;
}

export type PayloadPostSubscription = {
  email_id: string;
  is_newsletter_subscribed: boolean;
  session_id: string;
  profession: string;
};

export type PayloadOnboardingStage = {
  email_id?: string;
  session_id: string;
}

export const updateUserAgents = async (payload: Payload): Promise<AxiosResponse> => {
  try {
    const response = await axiosConfig.put<any>('/v1/user-agents', payload);
    return response; 
  } catch (error) {
    console.error('Error updating user agents:', error);
    throw error;
  }
};

export const postSubscription = async (payload: PayloadPostSubscription) => {
  try {
    const response = await axiosConfig.post('/v1/user-onboarding', payload);
    return response;
  } catch (error) {
    console.error('Error during subscription:', error);
  }
};

export const getUserOnboardingStage = async (payload: PayloadOnboardingStage) => {
  try {

    const response = await axiosConfig.post('/v1/user-onboarding/stage', payload);
    
    return response;
  } catch (error) {
    console.error('Error getting user onboarding stage:', error);
    throw error;
  }
};

