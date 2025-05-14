import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import {
  getAuthMethods,
  getAuthToken,
  PutConceptFields,
} from "../../services/conceptService";
import axios from "axios";
import { useDataFlow } from "../../providers/FlowDataProvider";

interface AuthMethod {
  auth_type: string;
  required_fields: string[];
}

interface PostmanUIProps {
  currentNodeId: string | undefined;
  nodeData:any;
}

const PostmanUI: React.FC<PostmanUIProps> = ({currentNodeId, nodeData}) => {
  const [method, setMethod] = useState<string>("POST");
  const [authType, setAuthType] = useState<string>("");
  const [apiUrl, setApiUrl] = useState<string>("");
  const [authFields, setAuthFields] = useState<{ [key: string]: string }>({});
  const [response, setResponse] = useState<string | null>(null);
  const [authMethods, setAuthMethods] = useState<AuthMethod[]>([]);
  const [authToken, setAuthToken] = useState<Object>({});
  const { conceptId, blogId } = useDataFlow();
  

  useEffect(() => {
    const fetchAuthMethods = async () => {
      try {
        const response: any = await getAuthMethods();
        setAuthMethods(response.supported_methods);
        if (response.supported_methods.length > 0) {
          setAuthType(response.supported_methods[0].auth_type);
        }
      } catch (error) {
        console.error("Error fetching auth methods", error);
      }
    };
    fetchAuthMethods();
  }, []);

  const handleAuthChange = (event: any) => {
    setAuthType(event.target.value as string);
    setAuthFields({});
  };

  const handleFieldChange = (field: string, value: string) => {
    setAuthFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendRequest = async () => {
    try {
      // Extract necessary authentication fields dynamically
      const authPayload: { [key: string]: string } = {};
      const requiredFields =
        authMethods.find((method) => method.auth_type === authType)
          ?.required_fields || [];

      requiredFields.forEach((field) => {
        if (authFields[field]) {
          authPayload[field] = authFields[field];
        }
      });

      // Fetch the authentication token
      const authTokenResponse: any = await getAuthToken(authType, authPayload);
      const authToken = authTokenResponse;

      // call another post api to send the authfields
      const authConfig = {
        nodeId: Number(currentNodeId),
        updateObject: {
          dataSources: {
            outbound: {
              authConfig: {
                ...authFields
              },
            },
          },
        },
      };

      const response = await PutConceptFields(authConfig, conceptId);

      console.log("Updated successfully", response);

      // Store and display the auth token
      setAuthToken(authToken);
      setResponse(authTokenResponse);
    } catch (error) {
      setResponse("Error fetching API");
      console.error("Error in sending request:", error);
    }
  };

  // Function to handle the API request
  const handleTestRequest = async () => {
    try {
      console.log(
        "(authToken as any)?.Authorization+++++",
        (authToken as any)?.Authorization
      );

      const requestOptions = {
        method,
        url: apiUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: (authToken as any)?.Authorization,
        },
      };

      // Make the API request with Axios
      const response = await axios(requestOptions);

      setResponse(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResponse("Error fetching API");
      console.error("Error in sending request:", error);
    }
  };

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2}>
            <FormControl fullWidth>
              <InputLabel>Method</InputLabel>
              <Select
                value={method}
                onChange={(e) => setMethod(e.target.value as string)}
              >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="API URL"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "#2D6414", padding: "14px" }}
              onClick={handleTestRequest}
            >
              Test
            </Button>
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="API URL"
              value={
                "https://api-services-dev.bytesized.com.au//v1/client/auth/token"
              }
              //   onChange={(e) => setApiUrl(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "#2D6414", padding: "14px" }}
              onClick={handleSendRequest}
            >
              Generate token
            </Button>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Typography variant="h6">Authorization</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Auth Type</InputLabel>
                <Select value={authType} onChange={handleAuthChange}>
                  {authMethods.map((auth) => (
                    <MenuItem key={auth.auth_type} value={auth.auth_type}>
                      {auth.auth_type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={2}>
                {authMethods
                  .find((auth) => auth.auth_type === authType)
                  ?.required_fields.map((field) => (
                    <Grid item xs={6} key={field}>
                      <TextField
                        fullWidth
                        label={field}
                        value={authFields[field] || ""}
                        onChange={(e) =>
                          handleFieldChange(field, e.target.value)
                        }
                      />
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <Typography variant="h6">OutBound Response</Typography>
          <Paper
            elevation={2}
            sx={{
              padding: 2,
              backgroundColor: "#f5f5f5",
              minHeight: 100,
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
            }}
          >
            {nodeData?.responseTemplate ? JSON.stringify(nodeData?.responseTemplate, null, 2) : "no response"}
          </Paper>
        </Box>

        <Box mt={3}>
          <Typography variant="h6">Response</Typography>
          <Paper
            elevation={2}
            sx={{
              padding: 2,
              backgroundColor: "#f5f5f5",
              minHeight: 100,
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
            }}
          >
            {response ? JSON.stringify(response, null, 2) : "No response yet"}
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
};

export default PostmanUI;
