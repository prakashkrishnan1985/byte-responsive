// @ts-nocheck
import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  BackgroundVariant,
  Elements,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import PresentRoundedIcon from "@mui/icons-material/OndemandVideo";
import Sidebar from "./Sidebar";
import { DnDProvider, useDnD } from "../../providers/DnDContext";
import CustomNode from "./CustomNode";
import AlertDialog from "../ui/AlertDialog";
import TextNode from "./TextNode";
import { FaUndo } from "react-icons/fa";
import Lottie from "lottie-react";
import "../ui/styles/lottie.css";
import leafDropAnimation from "../ui/styles/animations/leafs-drop-animation.json";
import backgroundImage from "../../assets/ai-background-transparent.png";
import EditableTable from "../ui/EditableTable";
import { AnimatedSVGEdge } from "./AnimatedSVGEdge";
import { PutConcept } from "../../services/conceptService";
import "./index.css";
import { useDataFlow } from "../../providers/FlowDataProvider";
import { useOrchestration } from "../../providers/OrchestrationProvider";
import storageUtil from "../../utils/localStorageUtil";

const bgColors = ["#ffcc00", "#ff6699", "#66ccff", "#99ff66", "#ffccff"];

const ZIGZAG_DISTANCE = 262; // Distance between nodes
const ZIGZAG_OFFSET = 0; // Offset for zigzag effect

const initialNodes = [
  // {
  //   id: "1",
  //   type: "custom",
  //   data: {
  //     label: "Your App12",
  //     icon: <PresentRoundedIcon fontSize="14px" />,
  //     backgroundColor: "#B6C6CD",
  //   },
  //   position: {
  //     x: -230 + 1 * ZIGZAG_DISTANCE,
  //     y: 106 + (1 % 2) * ZIGZAG_OFFSET,
  //   },
  // },
];

const initialRows = [
  { input: "Input 1", output: "Output 1" },
  { input: "Input 2", output: "Output 2" },
  { input: "Input 3", output: "Output 3" },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const MAX_NODES = 5;
const initialElements: Elements = [];

const DnDFlow = ({
  aiToolsJson,
  yourToolsJson,
  setYourTools,
  controlButtonExpander,
  isSideBarVisible = false,
  disabled,
  setPersistetNodesData,
  persistetNodesData,
  handleOpenNewPopup,
  nodeId,
}) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(persistetNodesData);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [aiToolExpanded, setAiToolExpanded] = useState<boolean>(true);
  const [youAppExpanded, setYouAppExpanded] = useState<boolean>(true);
  const { screenToFlowPosition } = useReactFlow();
  const [expanded, setExpanded] = React.useState(false);
  const [nodeColor, setNodeColor] = useState<string>("");
  const [openDialoge, setOpenDialog] = useState<boolean>(false);
  const reactFlowRef = useRef(null);
  const [elements, setElements] = useState<Elements>(initialElements);
  const [isEditing, setIsEditing] = useState(false);
  const [initialPositions, setInitialPositions] = useState(
    initialNodes.map((node) => node.position)
  );
  const lottieRef = React.useRef<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { type, nodeData, setNodeData, allNodeData } = useDnD();
  const { conceptId, cardsMappedData, message } = useDataFlow();
  const { conceptData, createConcept, addNode, nodeDelete } =
    useOrchestration();

  // Load saved data from localStorage when component mounts
  useEffect(() => {
    try {
      const savedNodes = localStorage.getItem(conceptId);
      if (savedNodes) {
        const parsedNodes = JSON.parse(savedNodes);
        setNodes(parsedNodes);
      }
    } catch (error) {
      console.error("Error parsing nodes from localStorage:", error);
    }
  }, [setNodes]);

  // Persist nodes state to localStorage whenever nodes change
  useEffect(() => {
    try {
      if (nodes.length > 0)
        localStorage.setItem(conceptId, JSON.stringify(nodes));
      //  }
    } catch (error) {
      console.error("Error saving nodes to localStorage:", error);
    }
  }, [nodes]);

  const revertPositions = useCallback(() => {
    setNodes((nds) =>
      nds.map((node, index) => ({
        ...node,
        position: initialPositions[index] || node.position,
      }))
    );
  }, [initialPositions, setNodes]);


  const onConnect = useCallback(
    (params) => {
      const targetNode = nodes.find((node) => node.id === params.target);
      const sourceNode = nodes.find((node) => node.id === params.source);

      if (!targetNode || !sourceNode) return;

      const targetPosition = {
        x: targetNode.position.x + targetNode.width / 2, // Center of target node
        y: targetNode.position.y + targetNode.height, // Bottom of target node
      };

      // Calculate source position
      const sourcePosition = {
        x: sourceNode.position.x + sourceNode.width / 2, // Center of source node
        y: sourceNode.position.y, // Top of source node
      };

      setEdges((eds) =>
        addEdge({ ...params, sourcePosition, targetPosition }, eds)
      );
    },
    [nodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (nodes.length >= MAX_NODES) {
        setOpenDialog(true);
        return;
      }

      if (!type) {
        return;
      }

      const newNodeIndex = nodes.length;
      const fixedX = 20 + newNodeIndex * 350; // Fixed horizontal spacing
      const fixedY = 10; // Fixed vertical position

      const newNode = {
        id: getId(),
        type: "custom",
        position: { x: fixedX, y: fixedY }, // Ensuring fixed position
        data: {
          label: `${nodeData?.name} Node`,
          backgroundColor: nodeColor,
          handleOpenNewPopup: handleOpenNewPopup,
          id: nodeData.id,
          nodeIndex: newNodeIndex,
        },
      };

      if (event.dataTransfer.getData("sustainable")) {
        const sustainablePercetage = event.dataTransfer.getData("sustainable");
        if (lottieRef.current) {
          lottieRef.current.stop();
          lottieRef.current.play();
        }
      }

      setInitialPositions((prev) => [...prev, { x: fixedX, y: fixedY }]);
      setNodes((nds) => nds.concat(newNode));

      addNode(nodeData, newNodeIndex);
    },
    [type, setNodes, nodes.length, nodeColor, nodeData]
  );

  useEffect(() => {
    if (nodeData.id === message?.nodeId) {
      setNodeColor("#6330a9");
    }
  }, []);

  useEffect(() => {
    if (aiToolExpanded || youAppExpanded) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [aiToolExpanded, youAppExpanded]);

  const onDeleteNode = useCallback(
    (id, index, e) => {
      const nodeId = nodes?.find((node) => node.id === id).data.id;
      nodeDelete(index, nodeId);
      setNodes((els) => els.filter((el) => el.id !== id));
    },
    [setNodes, conceptData]
  );

  // Function to toggle editing
  const toggleEdit = (id) => {
    setNodes((els) =>
      els.map((el) =>
        el.id === id
          ? { ...el, data: { ...el.data, isEditing: !el.data.isEditing } }
          : el
      )
    );
  };

  const markEditDone = (id) => {
    setNodes((els) =>
      els.map((el) =>
        el.id === id ? { ...el, data: { ...el.data, isEditing: false } } : el
      )
    );
  };

  // Function to change the label
  const changeLabel = (id, newLabel) => {
    setNodes((els) =>
      els.map((el) =>
        el.id === id
          ? { ...el, data: { ...el.data, label: newLabel, isEditing: true } }
          : el
      )
    );
  };

  const updatedElements = nodes.map((el, index) => ({
    ...el,
    data: {
      ...el.data,
      onDelete: () => onDeleteNode(el?.id, index),
      onEdit: () => toggleEdit(el.id),
      onLabelChange: (newLabel) => changeLabel(el.id, newLabel),
      markEditDone: () => markEditDone(el?.id),
    },
  }));

  const addTextNode = () => {
    const newNode = {
      id: `node_${nodes.length + 1}`,
      type: "textNode",
      // position: { x: Math.random() * 1000, y: Math.random() * 250 },
      position: { x: Math.random() * 600, y: 150 },
      data: {
        title: "Text Header",
        description: "Description",
        onUpdate: (id: string, title: string, description: string) => {
          setNodes((prev) =>
            prev.map((el) =>
              el.id === id
                ? { ...el, data: { ...el.data, title, description } }
                : el
            )
          );
        },
      },
    };

    setNodes((prev) => [...prev, newNode]);
  };

  const flowStyle = {
    background: `url('ai-background-transparent.png') no-repeat center center`,
    backgroundSize: "cover",
    height: "100%",
    width: "100%",
    position: "relative",
  };

  useEffect(() => {
    if (!isSideBarVisible) {
      const newEdges = nodes
        .map((node, index) => {
          if (index < nodes.length - 1) {
            if (index === 0)
              return {
                id: `e${node.id}-${nodes[index + 1].id}`,
                source: node.id,
                target: nodes[index + 1].id,
              };
            else
              return {
                id: `e${node.id}-${nodes[index + 1].id}`,
                source: node.id,
                target: nodes[index + 1].id,
                animated: true,
                type: "animatedSvg",
              };
          }
          return null;
        })
        .filter((edge) => edge !== null);

      setEdges(newEdges);
    }
  }, [isSideBarVisible]);

  const edgeTypes = {
    animatedSvg: AnimatedSVGEdge,
  };

  return (
    <div className="dndflow" style={flowStyle}>
      <AlertDialog
        openDialog={openDialoge}
        title="Max Limit Alert!"
        content="you can not have more than 5 nodes"
      ></AlertDialog>
      <div className="lottie-container">
        <Lottie
          lottieRef={lottieRef}
          animationData={leafDropAnimation}
          loop={false}
          autoplay={false}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div
        className="reactflow-wrapper"
        style={{
          height: !isExpanded
            ? isSideBarVisible
              ? !expanded
                ? controlButtonExpander
                  ? "28vh"
                  : "42vh"
                : controlButtonExpander
                ? "21vh"
                : "22vh"
              : controlButtonExpander
              ? "14vh"
              : "23vh"
            : "0vh",
        }}
        ref={reactFlowWrapper}
      >
        <ReactFlow
          ref={reactFlowRef}
          nodes={updatedElements}
          edges={edges}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={{
            height: !expanded
              ? controlButtonExpander
                ? "68vh"
                : "78vh"
              : controlButtonExpander
              ? "51vh"
              : "56vh",
            overflow: "visible",
            color: "black",
          }}
          nodeTypes={{
            custom: CustomNode,
            textNode: TextNode,
          }}
          edgesUpdatable={!disabled}
          edgesFocusable={!disabled}
          nodesDraggable={!disabled}
          nodesConnectable={!disabled}
          nodesFocusable={!disabled}
          // draggable={!disabled}
          panOnDrag={!disabled}
          elementsSelectable={!disabled}
          // Optional if you also want to lock zooming
          zoomOnDoubleClick={!disabled}
          minZoom={disabled ? 1 : 0.5}
          maxZoom={disabled ? 1 : 3}
        >
          {isSideBarVisible && (
            <Controls>
              <button
                onClick={addTextNode}
                className="react-flow__controls-button"
              >
                T
              </button>
              <button
                className="react-flow__controls-button"
                onClick={revertPositions}
              >
                <FaUndo size={10} />
              </button>
            </Controls>
          )}
          <Background color="#ccc" variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ({
  aiToolsJson,
  yourToolsJson,
  setYourTools,
  controlButtonExpander,
  isSideBarVisible,
  disabled,
  setPersistetNodesData,
  persistetNodesData,
  handleOpenNewPopup,
  nodeId,
}) => (
  <DnDFlow
    aiToolsJson={aiToolsJson}
    yourToolsJson={yourToolsJson}
    setYourTools={setYourTools}
    controlButtonExpander={controlButtonExpander}
    isSideBarVisible={isSideBarVisible}
    disabled={disabled}
    setPersistetNodesData={setPersistetNodesData}
    persistetNodesData={persistetNodesData}
    handleOpenNewPopup={handleOpenNewPopup}
    nodeId={nodeId}
  />
);
