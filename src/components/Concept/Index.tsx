import { useEffect, useRef, useState } from "react";
import { useDataFlow } from "../../providers/FlowDataProvider";
import ConceptFlowTable from "../ConceptFlowTable/Index";
import DnDFlowCanvas from "../reactFlow/DnDFlowCanvas";
import Sidebar from "../reactFlow/Sidebar";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { Box, Button } from "@mui/material";
import Carousel, { CarouselSlideData } from "../ui/Carousel";
import {
  CompleteConcept,
  getAgentsModel,
  getUserApps,
  provisionConcept,
  SaveConcept,
  withProvisionConcept,
} from "../../services/conceptService";
import StatusButtons from "./StatusButtton";
import { toast } from "react-toastify";

const Concept: React.FC<any> = ({
  aiToolsJson,
  yourToolsJson,
  setYourTools,
  expanded,
  setMeterPercentage,
}) => {
  const { persistetNodesData, setPersistetNodesData, conceptId , setProvision_Id} =
    useDataFlow();
  const [aiToolExpanded, setAiToolExpanded] = useState<boolean>(true);
  const [nodeColor, setNodeColor] = useState<string>("");
  const targetSectionRef = useRef<HTMLDivElement | null>(null);
  const [agentsData, setAgentsData] = useState<any>();
  const [appsData, setAppsData] = useState<any[]>([]);

  const getUserAppDataFn = () => {
    getUserApps(conceptId).then((data: any) => {
      setAppsData((data as any)?.data);
    });
  };

  useEffect(() => {
    getAgentsModel(1).then((data) => {
      setAgentsData((data as any)?.data);
    });
  }, []);

  useEffect(() => {
    getUserAppDataFn();
  }, []);

  const handleSaveClick = async () => {
    try {
      const data = { concept_name: "string", description: "string" };
      const response = await SaveConcept(data);
      toast.success("Save successfully!");
    } catch (error) {
      toast.error(`Error during Save API call:${error}`);
      console.error("Error during Save API call:", error);
    }
  };

  const handleProvisionClick = async () => {
    try {
      const response = await provisionConcept(conceptId);
      toast.success("Provisioned successfully!");
      setProvision_Id((response as any)?.ref_id);
      const responseSocket:any = await withProvisionConcept((response as any)?.ref_id);  
    } catch (error) {
      toast.error(`Error during Draft API call:${error}`);
      console.error("Error during Draft API call:", error);
    }
  };

  const handleCompletedClick = async (setIsCompletedClicked:any) => {
    try {
      const response = await  CompleteConcept(conceptId);
      setIsCompletedClicked(true)
      toast.success("Marked Completed successfully!");
    } catch (error) {
      toast.error(`Error during Completed API call:${error}`);
      console.error("Error during Completed API call:", error);
    }
  };

  return (
    <Box
      justifyContent={"center"}
      alignItems={"center"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box display="flex" width={800} justifyContent={"center"} pr={6} position="relative" bottom={30}>
        <StatusButtons
          onSaveClick={handleSaveClick}
          onProvisionClick={handleProvisionClick}
          onCompletedClick={handleCompletedClick}
        />
      </Box>
      <div>
        <ConceptFlowTable
          isDataRowsEnable={false}
          aiToolsJson={aiToolsJson}
          yourToolsJson={yourToolsJson}
          setYourTools={setYourTools}
          appsData={appsData}
          isSideBarVisible
  />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginBottom: "80px",
          width:'100%',
          marginLeft:'25px'
        }}
        ref={targetSectionRef}
      >
        <div
          className="dndflow"
          style={{
            height: "100%",
            width: "92%",
            position: "relative",
            top: "25px",
            justifyContent:'center',
            alignContent:'center',
            paddingLeft:'12px'
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Sidebar
              cardData={agentsData}
              title="AI Tools"
              setNodeColor={setNodeColor}
              expanded={aiToolExpanded}
              setExpanded={setAiToolExpanded}
              setCardData={undefined}
              getUserAppDataFn={getUserAppDataFn}
            />
          </div>
        </div>
      </div>
    </Box>
  );
};

// Button styles (consistent for both buttons)
const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  fontSize: "16px",
  color: "white",
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
};

export default Concept;
