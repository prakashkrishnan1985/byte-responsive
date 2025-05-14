import {
  Box,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import CopyIcon from "@mui/icons-material/FileCopy";
import { PutConcept } from "../../services/conceptService";
import { useDataFlow } from "../../providers/FlowDataProvider";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
interface Props {
  nodeData: any;
  AddDataToConcept: any;
  selectedPath: string;
  setSelectedPath: any;
}

interface ModalOutputVarPillsProps {
  data: { name: string; keyPath: string }[];
  handleNodeClick: (keyPath: string) => void;
}

const ModalOutputVarPills: React.FC<ModalOutputVarPillsProps> = ({
  data,
  handleNodeClick,
}) => {
  
  return (
    <div>
      {data?.map((item) => (
        <Chip
          key={item.name}
          label={item.name}
          // onClick={handleNodeClick}
          color="default"
          sx={{
            margin: "10px 15px 10px 0px",
            cursor: "pointer",
            backgroundColor: "black",
            color: "white",
            borderRadius: "16px",
            border: "2px solid #8A2BE2",
            "&:hover": {
              backgroundColor: "black",
              borderColor: "#6A0DAD",
            },
          }}
        />
      ))}
    </div>
  );
};

const ModalOutput = ({
  nodeData,
  AddDataToConcept,
  selectedPath,
  setSelectedPath,
}: Props) => {
  const theme = useTheme();
  const [jsonData] = useState(nodeData?.responseTemplate);
  const [pathSuggestions, setPathSuggestions] = useState<string[]>([]);
  const [varName, setVarname] = useState<any>({ name: "", keyPath: "" });

  const handleNodeClick = (path: string) => {
    setVarname((prev: any) => {
      return { ...prev, keyPath: path };
    });
  };

  const { modalOutputData, setModalOutputData } = useDataFlow();

  const renderJson = (obj: any, parentPath: string = ""): React.ReactNode => {
    return Object.keys(obj).map((key) => {
      const value = obj[key];
      const currentPath = parentPath ? `${parentPath}.${key}` : key;

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
              <Chip
                label={key}
                onClick={() => handleNodeClick(currentPath)}
                color="default"
                sx={{
                  marginRight: "8px",
                  cursor: "pointer",
                  backgroundColor: "#6A0DAD",
                  color: "white",
                  borderRadius: "16px",
                  "&:hover": {
                    backgroundColor: "#A0A0A0",
                  },
                  marginBottom: "10px",
                }}
              />
              <SubdirectoryArrowRightIcon
                sx={{
                  color: "white",
                  marginX: "8px",
                  position: "absolute",
                  marginTop: "10px",
                }}
              />
            </Typography>
            <Box sx={{ paddingLeft: "15px" }}>
              {renderJson(value, currentPath)}
            </Box>
          </Box>
        );
      } else {
        return (
          <Box
            key={currentPath}
            sx={{ marginBottom: "8px", display: "flex", alignItems: "center" }}
          >
            <Chip
              label={key}
              onClick={() => handleNodeClick(currentPath)}
              color="default"
              sx={{
                marginRight: "8px",
                cursor: "pointer",
                backgroundColor: "##616161",
                color: "white",
                borderRadius: "16px",
                "&:hover": {
                  backgroundColor: "#A0A0A0",
                },
              }}
            />
            <ArrowForwardIcon sx={{ color: "white", marginX: "8px" }} />
            <Chip
              label={value}
              onClick={() => handleNodeClick(currentPath)}
              color="default"
              sx={{
                cursor: "pointer",
                backgroundColor: "black",
                color: "white",
                borderRadius: "16px",
                border: "2px solid #8A2BE2",
                "&:hover": {
                  backgroundColor: "black",
                  borderColor: "#6A0DAD",
                },
              }}
            />
          </Box>
        );
      }
    });
  };
  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = e.target.value;
    setSelectedPath(newPath);

    if (newPath.endsWith(".")) {
      const segments = newPath.split(".").filter(Boolean);
      let currentObject: any = jsonData;
      for (const segment of segments) {
        if (currentObject && typeof currentObject === "object") {
          currentObject = currentObject[segment];
        }
      }

      if (currentObject && typeof currentObject === "object") {
        setPathSuggestions(Object.keys(currentObject));
      }
    } else {
      setPathSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedPath((prevPath: any) => `${prevPath}${suggestion}`);
    setPathSuggestions([]);
  };

  const handleVariableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVarname((prev: any) => {
      return { ...prev, name: e.target.value };
    });
  };

  const handleSaveVariableName = () => {
    setModalOutputData([...modalOutputData, varName]);
    setVarname({ name: "", keyPath: "" });
  };

  const handleSaveConcept = () => {
    AddDataToConcept();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          marginTop: "20px",
          maxHeight: "600px",
          width: "100%",
          backgroundColor: "rgba(169, 169, 169, 0.3)",
          borderRadius: "5px",
          border: "1px solid white",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ width: "50%", overflowY: "auto", paddingRight: "10px" }}>
          <Typography variant="h6">JSON Output</Typography>
          <Box
            sx={{
              padding: "10px",
              backgroundColor: "#2E2E2E",
              borderRadius: "5px",
            }}
          >
            {renderJson(jsonData)}
          </Box>
        </Box>

        <Box sx={{ width: "50%", paddingLeft: "10px" }}>
          <Typography variant="h6">Variable Name</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={varName.name}
            onChange={handleVariableNameChange}
            sx={{
              marginBottom: "10px",
              backgroundColor: "transparent",
              borderRadius: "4px",
              padding: "10px",
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
            label="Enter Variable Name"
          />

          <Typography variant="h6">Selected Path</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={varName.keyPath}
            onChange={handlePathChange}
            sx={{
              marginBottom: "10px",
              backgroundColor: "transparent",
              borderRadius: "4px",
              padding: "10px",
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
          />
          {pathSuggestions.length > 0 && (
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "4px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                maxHeight: "200px",
                overflowY: "auto",
                marginTop: "10px",
              }}
            >
              <List>
                {pathSuggestions.map((suggestion) => (
                  <ListItem
                    component={"button"}
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveVariableName}
            sx={{ ml: "20px", backgroundColor: "#2D6414", color: "white" }}
          >
            Save Variable Name
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveConcept}
            sx={{ ml: "20px", backgroundColor: "#2D6414", color: "white" }}
          >
            Save Concept
          </Button>
        </Box>
      </Box>
      <Box mt={2}>
        <ModalOutputVarPills
          data={modalOutputData || []}
          handleNodeClick={() => {
            console.log("pill clicked");
          }}
        />
      </Box>
    </>
  );
};

export default ModalOutput;
