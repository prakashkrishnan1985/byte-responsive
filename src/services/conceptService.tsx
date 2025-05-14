import { toast } from "react-toastify";
import storageUtil from "../utils/localStorageUtil";
import axiosConfig from "./axiosConfig";
import { useDataFlow } from "../providers/FlowDataProvider";

interface userAgentsPayload {
  name: string;
  description: string;
  type: string;
  status: "running" | "stopped" | "paused";
  input: Record<string, unknown>;
  output: Record<string, unknown>;
}

interface userAppsPayload {
  concept_id: string;
  title: string;
  description?: string;
}

interface conceptPayload {
  concept_name: string;
  description: string;
}

interface saveConceptPayload {
  concept_name: string;
  description: string;
}

interface completeConceptPayload {
  concept_id: string;
}

// agents services
export const getAgentsModel = async (page: number) => {
  try {
    const response = await axiosConfig.get("/agents/models?page=1&per_page=10");
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

export const PostAgentsModel = async (payload: userAgentsPayload) => {
  try {
    const response = await axiosConfig.post("/agents/models", payload);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

export const PutAgentsModel = async (payload: userAgentsPayload) => {
  try {
    const response = await axiosConfig.put(`/agents/models`, payload);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

export const DeleteAgentsModel = async (id: string) => {
  try {
    const response = await axiosConfig.delete(`/agents/models/${id}`);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

//app services
export const getUserApps = async (id: string) => {
  try {
    const response = await axiosConfig.get(`apps/${id}`);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

export const PostUserApps = async (payload: userAppsPayload) => {
  try {
    const response = await axiosConfig.post("apps/create", payload);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

export const PutUserApps = async (payload: userAppsPayload, id: string) => {
  try {
    const response = await axiosConfig.put(`apps/${id}`, payload);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

export const DeleteUserApps = async (id: string) => {
  try {
    const response = await axiosConfig.delete(`/apps/${id}`);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

//Concepts
export const getConcept = async (conceptId: string) => {
  try {
    const response = await axiosConfig.get(`concepts/${conceptId}`);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

//Concepts
export const getConceptList = async () => {
  try {
    const response = await axiosConfig.get(`concepts/list`);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

export const PostConcept = async (payload: conceptPayload) => {
  try {
    const response = await axiosConfig.post("concepts/", payload);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

export const PutConcept = async (payload: any, id: string) => {
  try {
    const response = await axiosConfig.put(`concepts/${id}`, payload);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

export const PutConceptFields = async (payload: any, id: string) => {
  try {
    const response = await axiosConfig.put(`concepts/${id}/update`, payload);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};


export const DeleteConcept = async (id: string) => {
  try {
    const response = await axiosConfig.delete(`/concepts/${id}`);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

//concept Status
export const SaveConcept = async (payload: saveConceptPayload) => {
  try {
    const response = await axiosConfig.post(`/concepts/`, payload);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

export const CompleteConcept = async (concept_id: string) => {
  try {
    const response = await axiosConfig.get(`/concepts/complete/${concept_id}`);
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

export const provisionConcept = async (conceptId: string) => {
  try {
    const response = await axiosConfig.post(
      `/v1/orchestration/concept/${conceptId}`
    );
    return response;
  } catch (error) {
    console.error("Error in getting model agents:", error);
    throw error;
  }
};

export const withProvisionConcept = async (
  orchestration_provision_id: string
) => {
  return new Promise((resolve, reject) => {
    try {
      // Open a WebSocket connection
      const socket = new WebSocket(
        `wss://m1xdtcmhsj.execute-api.ap-southeast-2.amazonaws.com/development/?orchestration_provision_id=${orchestration_provision_id}`
      );

      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            action: "INITIAL_STATUS",
            orchestration_provision_id,
          })
        );

        console.log("WebSocket connection established and message sent.");
      };

      socket.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          console.log("Received response:", response);

          if (typeof response === "object" && response !== null) {
            for (const stage in response) {
              const { message } = response[stage];

              toast.info(`${stage}: ${message}`, {
                autoClose: 5000,
              });
            }

            resolve(response);
          } else {
            console.log("Received data is not an object:", response);
          }
        } catch (e) {
          console.error("Error parsing WebSocket response:", e);
        }
      };

      // Event listener for WebSocket errors
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
        socket.close();
      };

      // Event listener for when the WebSocket connection is closed
      socket.onclose = (event) => {
        console.log("WebSocket connection closed:", event);
      };
    } catch (error) {
      console.error("Error in WebSocket connection:", error);
      reject(error);
    }
  });
};

export const withPartialExecutionConcept = async (
  orchestration_provision_id: string
) => {
  return new Promise((resolve, reject) => {
    try {
      // Open a WebSocket connection
      const socket = new WebSocket(
        `wss://api-hosting-dev.bytesized.com.au/v1/partial_execution/${orchestration_provision_id}`
      );

      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            action: "INITIAL_STATUS",
            orchestration_provision_id,
          })
        );

        console.log("WebSocket connection established and message sent.");
      };

      socket.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
            console.log("Received response:", response);
        } catch (e) {
          console.error("Error parsing WebSocket response:", e);
        }
      };

      // Event listener for WebSocket errors
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
        socket.close();
      };

      // Event listener for when the WebSocket connection is closed
      socket.onclose = (event) => {
        console.log("WebSocket connection closed:", event);
      };
    } catch (error) {
      console.error("Error in WebSocket connection:", error);
      reject(error);
    }
  });
};

export const withCompleteExecutionConcept = async (
  orchestration_provision_id: string
) => {
  return new Promise((resolve, reject) => {
    try {
      // Open a WebSocket connection
      const socket = new WebSocket(
        `wss://api-hosting-dev.bytesized.com.au/v1/execution/${orchestration_provision_id}`
      );

      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            action: "INITIAL_STATUS",
            orchestration_provision_id,
          })
        );

        console.log("WebSocket connection established and message sent.");
      };

      socket.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
            console.log("Received response:", response);
        } catch (e) {
          console.error("Error parsing WebSocket response:", e);
        }
      };

      // Event listener for WebSocket errors
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
        socket.close();
      };

      // Event listener for when the WebSocket connection is closed
      socket.onclose = (event) => {
        console.log("WebSocket connection closed:", event);
      };
    } catch (error) {
      console.error("Error in WebSocket connection:", error);
      reject(error);
    }
  });
};

export const withChat = async (message: string) => {
  return new Promise((resolve, reject) => {
    try {
      const token: any = storageUtil.getItemSession("authToken");

      const socket = new WebSocket(
        "wss://api-hosting-dev.bytesized.com.au/usher"
      );

      socket.onopen = () => {
        // Send authentication token once the connection is open
        console.log("connection establied");
        socket.send(JSON.stringify({ type: "authenticate", token: token }));
        socket.send(
          JSON.stringify({
            query: message,
          })
        );
        console.log("WebSocket connection established and message sent.");
      };

      socket.onmessage = (event) => {
        let response = event.data;

        // Check if the response is a valid JSON string that represents an object
        try {
          response = JSON.parse(response);
          if (typeof response === "object" && response !== null) {
            console.log("Received response:", response);
            resolve(response);
          } else {
            console.log("Received data is not an object:", response);
            // Optionally handle the case when the data is not an object
          }
        } catch (e) {
          console.log("Error parsing response:", e);
          // Optionally handle the case when JSON parsing fails
        }
      };

      // Event listener for WebSocket errors
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
        socket.close();
      };

      // Event listener for when the WebSocket connection is closed
      socket.onclose = (event) => {
        console.log("WebSocket connection closed:", event);
      };
    } catch (error) {
      console.error("Error in WebSocket connection:", error);
      reject(error);
    }
  });
};

 
/*Develop screen apis*/

// Generate Secret for a Concept
export const generateSecretForConcept = async (conceptId: string): Promise<any> => {
  try {
    const response = await axiosConfig.post(`/v1/secrets/generate/${conceptId}`);
    return response;
  } catch (error) {
    console.error(`Error in generating secret for concept ${conceptId}:`, error);
    throw error;
  }
};

// Generate Token using client_id, client_secret, and grant_type
export const generateToken = async (
  clientId: string,
  clientSecret: string,
  grantType: string
): Promise<any> => {
  try {
    // Create FormData instance
    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', grantType);

    // Send POST request with FormData
    const response = await axiosConfig.post('/v1/secrets/token', formData,  { 'Content-Type': 'multipart/form-data' });

    return response;
  } catch (error) {
    console.error("Error in generating token:", error);
    throw error;
  }
};

// Get Auth Methods
// This function retrieves the authentication methods available for a specific concept.
export const getAuthMethods = async () => {
  try {
    const response = await axiosConfig.get(`/v1/client/auth/methods`);
    return response;
  } catch (error) {
    console.error("Error in getting auth methods:", error);
    throw error;
  }
};

// Get Auth Token
// This function retrieves the authentication token for a specific auth type and fields.
export const getAuthToken = async (authType: string, authFields: { [key: string]: string }) => {
  try {
    const payload: any = { auth_type: authType, ...authFields };

    const response = await axiosConfig.post(`/v1/client/auth/token`, payload);
    return response;
  } catch (error) {
    console.error("Error in getting auth token:", error);
    throw error;
  }
};
