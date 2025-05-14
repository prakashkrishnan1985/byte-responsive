import React, { useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useDataFlow } from "../../providers/FlowDataProvider";
import { useOrchestration } from "../../providers/OrchestrationProvider";

interface DynamicFormProps {
  json: { [key: string]: string | string[] };
  AddDataToConcept: any;
  selectedValues: string;
  setSelectedValue: any;
}

const ModalInput: React.FC<DynamicFormProps> = ({
  json = {},
  AddDataToConcept,
  selectedValues,
  setSelectedValue,
}) => {
  const { setModalInputData } = useDataFlow();
  const { conceptData } = useOrchestration();
  
  const [name, setName] = useState("");

  const handleChange = (event: any) => {
    console.log("event.target",event.target.value);
    setName(event.target?.name);
    setSelectedValue(event.target.value);
    setModalInputData((prev: any) => {
      return { [event.target?.name]: `$${event.target.value}$` };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    AddDataToConcept();
  };

  const filterByType = (type: string) => {
    return conceptData?.variableDict
      ? Object.keys(conceptData.variableDict).filter(
          (key) => conceptData.variableDict[key].type !== type
        )
      : [];
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: "black",
        padding: 3,
        borderRadius: 1,
        color: "white",
      }}
    >
      {Object.keys(json).map((key) => {
        const options = filterByType("modelOutput") || [];
        return (
          <Box key={key}>
            <Typography variant="h6" sx={{ marginBottom: 1, color: "white" }}>
              {key}
            </Typography>

            <Select
              value={selectedValues}
              onChange={handleChange}
              name={key}
              displayEmpty
              fullWidth
              renderValue={(selected) => {
                return selected;
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
              {options.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </Box>
        );
      })}

      <Button
        type="submit"
        variant="contained"
        sx={{
          marginTop: 2,
          backgroundColor: "white",
          color: "black",
          "&:hover": {
            backgroundColor: "lightgray",
          },
        }}
      >
        Save
      </Button>
    </Box>
  );
};

export default ModalInput;
