import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import { getConcept } from "../../services/conceptService";
import { useDataFlow } from "../../providers/FlowDataProvider";
import { useOrchestration } from "../../providers/OrchestrationProvider";

interface Props {
  onNext: any;
  setIsDataSourceVisible: any;
  setSectionName: any;
}

const ConceptMockData: React.FC<Props> = ({
  setIsDataSourceVisible,
  setSectionName
}) => {
  const [variablesData, setVariablesData] = useState<any>();
  const { conceptId, setConceptData } = useDataFlow();

    const {
      conceptData
    } = useOrchestration();

  const customColor = "#ffffff";

  const renderPills = (pills: string[]) => {
    return (
      <Stack direction="row" spacing={1}>
        {pills?.map((pill, index) => (
          <Chip
            key={index}
            label={pill}
            variant="outlined"
            sx={{
              borderColor: customColor,
              color: customColor,
            }}
          />
        ))}
      </Stack>
    );
  };

  const handleAddDataClick = (sectionName: string) => {
    setIsDataSourceVisible(true);
    setSectionName(sectionName);
  };

  useEffect(() => {
    const keys = conceptData && Object.keys(conceptData?.variableDict);
    setVariablesData(keys);
  }, [conceptData]);

  const filterByType = (type: string) => {
    return conceptData?.variableDict
      ? Object.keys(conceptData.variableDict).filter(
          (key) => conceptData.variableDict[key].type === type
        )
      : [];
  };

  return (
    <Box p={3} width={"100%"}>
      <Box>
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ color: customColor }}>
              Inbound
            </Typography>
            <Box display="flex" alignItems="center">
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  borderColor: customColor,
                  color: customColor,
                  "&:hover": {
                    backgroundColor: "gray",
                    color: "#fff",
                  },
                }}
                onClick={() => handleAddDataClick("Inbound")}
              >
                Add New Data Source
              </Button>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          {renderPills(filterByType("inbound"))}
        </Box>

        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ color: customColor }}>
              Outbound
            </Typography>
            <Box display="flex" alignItems="center">
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  borderColor: customColor,
                  color: customColor,
                  "&:hover": {
                    backgroundColor: "gray",
                    color: "#fff",
                  },
                }}
                onClick={() => handleAddDataClick("Outbound")}
              >
                Add New Data Source
              </Button>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          {renderPills(filterByType("outbound"))}
        </Box>

        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ color: customColor }}>
              Modal Output
            </Typography>
            <Box display="flex" alignItems="center">
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  borderColor: customColor,
                  color: customColor,
                  "&:hover": {
                    backgroundColor: "gray",
                    color: "#fff",
                  },
                }}
                onClick={() => handleAddDataClick("ModalOutput")}
              >
                Add New Data Source
              </Button>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          {renderPills(filterByType("modelOutput"))}
        </Box>

        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ color: customColor }}>
              Modal Input
            </Typography>
            <Box display="flex" alignItems="center">
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  borderColor: customColor,
                  color: customColor,
                  "&:hover": {
                    backgroundColor: "gray",
                    color: "#fff",
                  },
                }}
                onClick={() => handleAddDataClick("Internal")}
              >
                Add New Data Source
              </Button>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          {renderPills(filterByType("modalInput"))}
        </Box>
      </Box>
    </Box>
  );
};

export default ConceptMockData;
