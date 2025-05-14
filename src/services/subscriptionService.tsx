import axiosConfig from "./axiosConfig";

// pricing tier service
export const getPricingTiers = async () => {
    try {
      const response = await axiosConfig.get(`/v1/payment/pricing-tiers`);
      return response;
    } catch (error) {
      console.error("Error in getting pricing tiers:", error);
      throw error;
    }
  };

// customer service
export const createCustomer = async () => {
    try {
      const response = await axiosConfig.post('/v1/payment/customer');
      return response;
    } catch (error) {
      console.error("Error in creating customer:", error);
      throw error;
    }
  };
  

// checkout session service
export const createCheckoutSession = async (priceId: string) => {
    try {
      const response = await axiosConfig.post('/v1/payment/create-checkout-session', {
        priceId: priceId,
      });
      return response;
    } catch (error) {
      console.error("Error in creating checkout session:", error);
      throw error;
    }
  };
  
// subscription status service
export const getSubscriptionStatus = async () => {
    try {
      const response = await axiosConfig.get(`/v1/payment/subscription-status`);
      return response;
    } catch (error) {
      console.error("Error in getting subscription status:", error);
      throw error;
    }
  };


// add credits service
export const addCredits = async (amount: number, feature: string): Promise<any> => {
    try {
      const response = await axiosConfig.post('/v1/payment/credits/add', {
        amount: amount,
        feature: feature
      });
      return response;
    } catch (error) {
      console.error("Error in adding credits:", error);
      throw error;
    }
  };  


// use credits service
export const usingCredits = async (amount: number, feature: string, description: string): Promise<any> => {
    try {
      const response = await axiosConfig.post('/v1/payment/credits/use', {
        amount: amount,
        feature: feature,
        description: description
      });
      return response;
    } catch (error) {
      console.error("Error in using credits:", error);
      throw error;
    }
  };

// get credits service
export const getCredits = async (): Promise<any> => {
    try {
      const response = await axiosConfig.get('/v1/payment/credits');
      return response;
    } catch (error) {
      console.error("Error in getting credits:", error);
      throw error;
    }
  };

// get credits history service
export const getCreditsHistory = async (limit: number): Promise<any> => {
    try {
      const response = await axiosConfig.get(`/v1/payment/credits/history?limit=${100}`);
      return response;
    } catch (error) {
      console.error("Error in getting credits history:", error);
      throw error;
    }
  };

// purchase credits service
export const purchaseCredits = async (
  priceId: string,
  purchaseType: 'recurring' | 'one-time'
): Promise<any> => {
  try {
    const response = await axiosConfig.post(`/v1/payment/purchase-credits`, {
      priceId,
      isRecurring: purchaseType === 'recurring',
    });
    return response;
  } catch (error) {
    console.error("Error in using credits:", error);
    throw error;
  }
};

  
  