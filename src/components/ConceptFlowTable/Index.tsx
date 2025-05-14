import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { v4 as uuidv4 } from "uuid";
import DnDFlowCanvas from "../reactFlow/DnDFlowCanvas";
import { useDataFlow } from "../../providers/FlowDataProvider";
import "../reactFlow/index.css";
import Carousel, { CarouselSlideData } from "../ui/Carousel";
import "./index.scss";
import { useDnD } from "../../providers/DnDContext";
import Popup from "./Popup";
import ExecutionControl from "../develop/ExecutionControl";
import { withPartialExecutionConcept } from "../../services/conceptService";
import EditableTable from "../ui/EditableTable";
import { toast } from "react-toastify";
import { useWebSocket } from "../../Hooks/useWebSocket";
import { useCompleteExecution } from "../../Hooks/useCompleteExecution";
import { useOrchestration } from "../../providers/OrchestrationProvider";

export enum SectionName {
  Inbound = "Inbound",
  Internal = "Internal",
  ModalOutput = "ModalOutput",
  Outbound = "Outbound",
}

const StyledTableContainer = styled(TableContainer)({
  height: "auto",
  overflowY: "auto",
  backgroundColor: "#222",
});

const StyledTableCell = styled(TableCell)({
  border: "1px solid #444",
  padding: "16px",
  color: "white",
  backgroundColor: "#333",
});

interface Row {
  value: string;
  selected: boolean;
  pills: string[];
}

interface Header {
  header: string;
  rows: Row[];
}

interface MappedData {
  [key: string]: {
    source?: number;
    keyPath?: string;
    values: Array<any>;
    type?: string;
  };
}

const initialRows = [
  { input: "Input 1", output: "Output 1" },
  { input: "Input 2", output: "Output 2" },
  { input: "Input 3", output: "Output 3" },
];

const ConceptFlowTable: React.FC<any> = ({
  isDataRowsEnable = true,
  aiToolsJson = [],
  yourToolsJson = [],
  setYourTools = () => {},
  isSideBarVisible = false,
  appData = {},
  isDataSimulate=false
}) => {
  const {
    persistetNodesData,
    setPersistetNodesData,
    cardsMappedData,
    setCardsMappedData,
    conceptId,
    provision_Id,
  } = useDataFlow();
  const [actCount, setActCount] = useState(1);
  const [category, setCategory] = useState("");

  const carouselSlidesData: CarouselSlideData[] = [
    { content: `act ${actCount}` },
    { content: `act ${actCount} - outBound` },
  ];

  const carouselSlidesDataIndex = carouselSlidesData.findIndex(
    (item, index) => {
      if (item.content == category) {
        return true;
      }
      return false;
    }
  );

  const { setType, allNodeData } = useDnD();
  const [openPopup, setOpenPopup] = useState(false);
  const [inputsData, setInputData] = useState<any>([
    {
      header: "Description",
      rows: [
        {
          value: "",
          selected: false,
          pills: ["sample description"],
        },
      ],
    },
    {
      header: "Description",
      rows: [
        {
          value: "",
          selected: false,
          pills: [""],
        },
      ],
    },
    {
      header: "Description",
      rows: [
        {
          value: "",
          selected: false,
          pills: [""],
        },
      ],
    },
    {
      header: "Description",
      rows: [
        {
          value: "",
          selected: false,
          pills: [""],
        },
      ],
    },
  ]);
  const [cardsInputData, setCardsInputData] = useState([]);
  const [nodeId, setNodeId] = useState<string>("");
  const [sectionName, setSectionName] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { message, error, sendMessage, connect, disconnect } =
    useWebSocket(conceptId);
  const { connectFullExecution, sendMessageFullExecution } =
    useCompleteExecution(conceptId);
  const [responseMessage, setResponseMessage] = useState<any | null>(null);
  const [nodeIndex, setNodeIndex] = useState(0);
  const { modalOutputIdBy } = useDataFlow();
  const { fetchConceptData } = useOrchestration();

  const nodeIds = allNodeData?.map((item: any) => item.id);

  const handleOpenNewPopup = (id: string) => {
    setOpenPopup(true);
    setNodeId(id);
  };

  useEffect(() => {
    fetchConceptData();
  }, []);

  useEffect(() => {
    const mapStateToVariableFormat = (headers: Header[]): MappedData => {
      const result: MappedData = {};

      headers.forEach((header) => {
        const values = header.rows.map((row, index) => row.pills);

        result[header.header] = {
          source: 1,
          keyPath: "",
          values,
          type: sectionName?.toLowerCase(),
        };
      });

      return result;
    };

    const mappedData = mapStateToVariableFormat(cardsInputData);
    if (Object.keys(mappedData).length !== 0)
      setCardsMappedData({
        ...cardsMappedData,
        [sectionName]: { ...cardsMappedData[sectionName], ...mappedData },
      });
  }, [cardsInputData]);

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handlePartialExecution = async () => {
    handleSendMessage();
  };

  const handleGoBack = () => {
    if (nodeIndex > 0) {
      setNodeIndex((prevIndex: number) => prevIndex - 1);
    } else {
      console.log("No more IDs to display!");
    }
    const responseMessage =
      modalOutputIdBy[nodeIds[nodeIndex]] &&
      modalOutputIdBy[nodeIds[nodeIndex]].length > 0
        ? modalOutputIdBy[nodeIds[nodeIndex]][0]
        : {};

    console.log("Going back...", responseMessage);

    setResponseMessage(responseMessage);
    console.log("Going back...");
  };

  const handleGoForward = () => {
    if (nodeIndex < nodeIds.length) {
      setNodeIndex((prevIndex: number) => prevIndex + 1);
    } else {
      console.log(
        "No more IDs to display!",
        modalOutputIdBy[nodeIds[nodeIndex]]
      );
    }
    const responseMessage =
      modalOutputIdBy[nodeIds[nodeIndex]] &&
      modalOutputIdBy[nodeIds[nodeIndex]].length > 0
        ? modalOutputIdBy[nodeIds[nodeIndex]][0]
        : {};
    console.log("Going forward...", responseMessage);
    setResponseMessage(responseMessage);
  };

  const handleFullExecution = () => {
    connectFullExecution();
    handleSendMessageFullExecution();
  };

  useEffect(() => {
    if (message) {
      setResponseMessage(message);
    }
  }, [message]);

  const handleSendMessage = () => {
    if (sendMessage) {
      sendMessage("run");
      setActCount((actState) => actState++);
    }
  };

  const handleSendMessageFullExecution = () => {
    if (sendMessageFullExecution) {
      sendMessageFullExecution("run");
      setActCount((actState) => actState++);
    }
  };

  console.log({ responseMessage });

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="90vw"
      sx={{ backgroundColor: "black", color: "white" }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {isDataRowsEnable && isDataSimulate && (
          <ExecutionControl
            onPartialExecute={handlePartialExecution}
            onGoBack={handleGoBack}
            onGoForward={handleGoForward}
            onFullExecute={handleFullExecution}
          />
        )}
      </Box>
      <Box flex={1} p={2} sx={{ display: "flex" }}>
        {isDataRowsEnable && isDataSimulate && (
          <div
            style={{
              writingMode: "vertical-lr",
              fontSize: "180%",
              marginRight: "20px",
              display: "flex",
              justifyContent: "space-evenly",
              marginBottom: "160px",
            }}
          >
            <Typography variant="h5">Role</Typography>
            <Typography variant="h5">Input</Typography>
            <Typography variant="h5">Output</Typography>
          </div>
        )}

        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell
                  style={{ backgroundColor: "#2D6414", color: "white" }}
                >
                  Description
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: "#2D6414", color: "white" }}
                >
                  Act1
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: "#2D6414", color: "white" }}
                >
                  Act2
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: "#2D6414", color: "white" }}
                >
                  Act3
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: "#2D6414", color: "white" }}
                >
                  Act4
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <StyledTableCell>
                  <div>
                    <Typography variant="body1" paragraph>
                    {persistetNodesData?.[0]?.name ?? persistetNodesData?.[0]?.nodeName}
                    </Typography>
                  </div>
                </StyledTableCell>

                <StyledTableCell>
                  <Typography variant="body1" paragraph>
                    {persistetNodesData?.[1]?.name ?? persistetNodesData?.[1]?.nodeName}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="body1" paragraph>
                  {persistetNodesData?.[2]?.name ?? persistetNodesData?.[2]?.nodeName}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="body1" paragraph>
                  {persistetNodesData?.[3]?.name ?? persistetNodesData?.[3]?.nodeName}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="body1" paragraph>
                  {persistetNodesData?.[4]?.name ?? persistetNodesData?.[4]?.nodeName}
                  </Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow></TableRow>

              <TableRow style={{ borderTop: "none" }}>
                <StyledTableCell colSpan={5}>
                  <Box flex={1} p={2}>
                    <DnDFlowCanvas
                      aiToolsJson={aiToolsJson}
                      yourToolsJson={yourToolsJson}
                      setYourTools={setYourTools}
                      controlButtonExpander={false}
                      isSideBarVisible={isSideBarVisible}
                      disabled={true}
                      setPersistetNodesData={setPersistetNodesData}
                      persistetNodesData={persistetNodesData}
                      handleOpenNewPopup={handleOpenNewPopup}
                      nodeId={nodeId}
                    ></DnDFlowCanvas>
                  </Box>
                  <div
                    style={{
                      position: "relative",
                      zIndex: 0,
                    }}
                  >
                    <Popup
                      open={openPopup}
                      onClose={handleClosePopup}
                      setInputData={setInputData}
                      setCardsInputData={setCardsInputData}
                      nodeId={nodeId}
                      sectionName={sectionName}
                      setSectionName={setSectionName}
                    />
                  </div>
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
          {isDataRowsEnable && isDataSimulate &&(
            <>
              <div className="carousel-container">
                <Carousel
                  slides={carouselSlidesData}
                  setCategory={setCategory}
                />
              </div>
              <Box mt={10}>
                <EditableTable
                  isExpanded={isExpanded}
                  setIsExpanded={setIsExpanded}
                  messageResponse={responseMessage}
                  category={carouselSlidesDataIndex}
                />
              </Box>
            </>
          )}
        </StyledTableContainer>
      </Box>
    </Box>
  );
};

export default ConceptFlowTable;
