import React, { useState } from "react";
import { Button, Box, Select, MenuItem, TextField } from "@mui/material";
import { useDataFlow } from "../../providers/FlowDataProvider";
import { useOrchestration } from "../../providers/OrchestrationProvider";

interface DataSourceFormProps {
  onNext: () => void;
  sectionName: string;
  DataSourceFormData: any;
  setDataSourceFormData: any;
  requestVariable: any;
  setRequestVariable: any;
}

const DataSourceForm: React.FC<DataSourceFormProps> = ({
  onNext,
  sectionName,
  DataSourceFormData,
  setDataSourceFormData,
  requestVariable,
  setRequestVariable,
}) => {
  const { conceptData } = useOrchestration();
  const variableNames = conceptData && Object.keys(conceptData?.variableDict);

  const handleInputChange = (section: string, field: string, value: string) => {
    setDataSourceFormData((prevState: any) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value,
        nodeType: section,
      },
    }));
  };

  const handleChange = (event: any) => {
    setRequestVariable(event.target.value);
    handleInputChange("outbound", "variables", event.target.value);
  };

  return (
    <Box
      sx={{
        background: "transparent",
        color: "white",
        // padding: "20px",
        width: "100%",
        borderRadius: "10px",
        position: "relative",
        height: "auto",
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      {/* Conditional fields based on sectionName */}
      {sectionName === "Inbound" && (
        <>
          <TextField
            label="Source Application Name"
            value={DataSourceFormData.inbound?.applicationName}
            onChange={(e) =>
              handleInputChange("inbound", "applicationName", e.target.value)
            }
            fullWidth
            margin="normal"
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
                color: "white",
              },
            }}
          />
          <TextField
            label="Application Description"
            value={DataSourceFormData.inbound?.applicationDescription}
            onChange={(e) =>
              handleInputChange(
                "inbound",
                "applicationDescription",
                e.target.value
              )
            }
            fullWidth
            margin="normal"
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
                color: "white",
              },
            }}
          />
        </>
      )}

      {sectionName === "Outbound" && (
        <>
          <Select
            value={requestVariable}
            onChange={handleChange}
            displayEmpty
            fullWidth
            multiple
            renderValue={(selected) => {
              if (Array.isArray(selected)) {
                return selected.join(", ");
              }
              return "";
            }}
            sx={{
              color: "white",
              border: "2px solid white",
              marginBottom: "16px",
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
                color: "white",
              },
            }}
          >
            {variableNames?.map((key: any) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Source Application Name"
            value={DataSourceFormData?.outbound?.applicationName}
            onChange={(e) =>
              handleInputChange("outbound", "applicationName", e.target.value)
            }
            fullWidth
            margin="normal"
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
                color: "white",
              },
            }}
          />
          <TextField
            label="Application Description"
            value={DataSourceFormData?.outbound?.applicationDescription}
            onChange={(e) =>
              handleInputChange(
                "outbound",
                "applicationDescription",
                e.target.value
              )
            }
            fullWidth
            margin="normal"
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
                color: "white",
              },
            }}
          />
        </>
      )}

      {(sectionName === "Internal" || sectionName === "ModalOutput") && (
        <>
          <TextField
            label="Source Application Name"
            value={DataSourceFormData.modelInput.applicationName}
            onChange={(e) =>
              handleInputChange(
                "intraNodeInput",
                "applicationName",
                e.target.value
              )
            }
            fullWidth
            margin="normal"
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
                color: "white",
              },
            }}
          />
          <TextField
            label="Application Description"
            value={DataSourceFormData.modelInput.applicationDescription}
            onChange={(e) =>
              handleInputChange(
                "intraNodeInput",
                "applicationDescription",
                e.target.value
              )
            }
            fullWidth
            margin="normal"
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
                color: "white",
              },
            }}
          />
        </>
      )}
    </Box>
  );
};

export default DataSourceForm;
