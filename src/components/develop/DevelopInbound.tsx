import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  useTheme,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
} from "@mui/material";
import { ContentCopy as CopyIcon } from "@mui/icons-material";
import {
  generateSecretForConcept,
  generateToken,
} from "../../services/conceptService";
import { useDataFlow } from "../../providers/FlowDataProvider";
import { baseURL } from "../../services/axiosConfig";

const Develop: React.FC<any> = ({ nodeData }: { nodeData: any }) => {
  const theme = useTheme();
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [jsonData] = useState({
    name: "Booxhi",
    description: "Innovative platform",
    details: {
      version: "1.0",
      author: "Booxhi Team",
      mode: {
        type: "dark",
      },
    },
  });

  const [pathSuggestions, setPathSuggestions] = useState<string[]>([]);
  const [clientId, setClientId] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [generatedToken, setGeneratedToken] = useState<string>("");
  const [loadingSecret, setLoadingSecret] = useState<boolean>(false);
  const [loadingToken, setLoadingToken] = useState<boolean>(false);

  const handleNodeClick = (path: string) => {
    setSelectedPath(path);
  };

  const { conceptId, blogId } = useDataFlow();

  const renderJson = (obj: any, parentPath: string = ""): React.ReactNode => {
    return Object.keys(obj).map((key) => {
      const value = obj[key];
      const currentPath = parentPath ? `${parentPath}/${key}` : key;

      if (typeof value === "object" && value !== null) {
        return (
          <Box key={currentPath} sx={{ marginLeft: "20px", cursor: "pointer" }}>
            <Typography
              onClick={() => handleNodeClick(currentPath)}
              sx={{
                color: "white",
                "&:hover": { color: theme.palette.primary.main },
              }}
            >
              {key}:
            </Typography>
            <Box sx={{ paddingLeft: "15px" }}>
              {renderJson(value, currentPath)}
            </Box>
          </Box>
        );
      } else {
        return (
          <Typography
            key={currentPath}
            onClick={() => handleNodeClick(currentPath)}
            sx={{
              color: "white",
              cursor: "pointer",
              "&:hover": { color: theme.palette.primary.main },
            }}
          >
            {key}: {value}
          </Typography>
        );
      }
    });
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = e.target.value;
    setSelectedPath(newPath);

    if (newPath.endsWith("/")) {
      const segments = newPath.split("/").filter(Boolean);
      let suggestions: string[] = [];

      let currentObject: any = jsonData;
      for (const segment of segments) {
        if (currentObject && typeof currentObject === "object") {
          currentObject = currentObject[segment];
        }
      }

      if (currentObject && typeof currentObject === "object") {
        suggestions = Object.keys(currentObject);
      }

      setPathSuggestions(suggestions);
    } else {
      setPathSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedPath((prevPath) => `${prevPath}${suggestion}`);
    setPathSuggestions([]);
  };

  // Handle token generation
  const handleGenerateToken = async () => {
    const grantType = "client_credentials";
    setLoadingToken(true);

    try {
      // Call the generateToken API to get the token
      const response = await generateToken(clientId, clientSecret, grantType);

      // Assuming the token is in the response's data (modify according to your actual API response structure)
      const token = response;

      // Set the generated token in the state
      setGeneratedToken(token);
    } catch (error) {
      console.error("Error generating token:", error);
    } finally {
      setLoadingToken(false);
    }
  };

  // Handle secret generation
  const handleGenerateSecret = async (conceptId: string) => {
    setLoadingSecret(true);

    try {
      // Call the API to generate the secret for the provided conceptId
      const response = await generateSecretForConcept(conceptId);

      // Destructure client_id, client_secret, and state from the response
      const { client_id, client_secret } = response;

      // Save client_id, client_secret, and state to the state variables
      setClientId(client_id);
      setClientSecret(client_secret);

      // Optionally, you can also store these in localStorage if needed:
      localStorage.setItem("client_id", client_id);
      localStorage.setItem("client_secret", client_secret);
    } catch (error) {
      console.error("Error generating secret or token:", error);
    } finally {
      setLoadingSecret(false);
    }
  };

  return (
    <Box
      sx={{
        width: "1388px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        boxSizing: "border-box",
      }}
    >
      {/* Buttons in the same line with 50% width each */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            width: "48%",
            backgroundColor: "#2D6414",
            color: "white",
            textAlign: "center",
            padding: "10px 10px 0px 10px",
            height: "auto",
            borderRadius: "10px",
          }}
        >
          URL: https://api-services-dev.bytesized.com.au/v1/secrets/token
          <IconButton
            onClick={() =>
              handleCopy(
                "https://api-services-dev.bytesized.com.au/v1/secrets/token"
              )
            }
            sx={{ backgroundColor: "#2D6414", color: "white", ml: "10px" }}
          >
            <CopyIcon />
          </IconButton>
        </Box>

        <Button
          onClick={() => handleGenerateSecret(conceptId)}
          sx={{
            width: "48%",
            backgroundColor: "#2D6414",
            color: "white",
            textAlign: "center",
            height: "57px",
          }}
        >
          {loadingSecret ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Generate Secret"
          )}
        </Button>
      </Box>

      {/* Client ID and Client Secret Inputs */}
      <Box sx={{ marginTop: "20px" }}>
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
        >
          <TextField
            label="Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
                "& input": {
                  color: "white",
                },
              },
            }}
            variant="outlined"
          />
          <IconButton
            onClick={() => handleCopy(clientId)}
            sx={{ backgroundColor: "#2D6414", color: "white", ml: "10px" }}
          >
            <CopyIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Client Secret"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
                "& input": {
                  color: "white",
                },
              },
            }}
            variant="outlined"
          />
          <IconButton
            onClick={() => handleCopy(clientSecret)}
            sx={{ backgroundColor: "#2D6414", color: "white", ml: "10px" }}
          >
            <CopyIcon />
          </IconButton>
        </Box>

        {/* Generate Token Button */}
        <Box sx={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
          <Button
            onClick={handleGenerateToken}
            sx={{
              backgroundColor: "#2D6414",
              color: "white",
              textAlign: "center",
              height: "57px",
              width: "100%",
            }}
          >
            {loadingToken ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Generate Token"
            )}
          </Button>
        </Box>
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <Button
          sx={{
            width: "100%",
            backgroundColor: "black",
            color: "white",
            textAlign: "left",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
            fontSize: "1rem",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              textTransform: "none",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#ffffff",
              textShadow: "0px 0px 4px rgba(0, 0, 0, 0.8)",
            }}
          >
            {`${baseURL}/v1/execution/develop/${conceptId}`}
          </Typography>
          <IconButton sx={{ color: "white" }}>
            <CopyIcon />
          </IconButton>
        </Button>
      </Box>

      <Box mt={3}>
        <Typography variant="h6">Inbound Request</Typography>
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
          {nodeData?.requestTemplate
            ? JSON.stringify(nodeData?.requestTemplate, null, 2)
            : "no response"}
        </Paper>
      </Box>

      <Box mt={3}>
        <Typography variant="h6">Inbound Response</Typography>
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
          {nodeData?.responseTemplate
            ? JSON.stringify(nodeData?.responseTemplate, null, 2)
            : "no response"}
        </Paper>
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        {/* JSON Output and Selected Path Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "23px",
            marginTop: "20px",
          }}
        >
          {/* JSON Output */}
          <Box sx={{ width: "100%", overflowY: "auto", paddingRight: "10px" }}>
            <Box mt={3}>
              <Typography variant="h6">JSON Output</Typography>
              <Paper
                elevation={2}
                sx={{
                  padding: 2,
                  backgroundColor: "#f5f5f5",
                  height: "auto",
                  whiteSpace: "pre-wrap",
                  fontFamily: "monospace",
                  overflowY: "auto",
                }}
              >
                {generatedToken
                  ? JSON.stringify(generatedToken, null, 2)
                  : "No response yet"}
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Develop;
