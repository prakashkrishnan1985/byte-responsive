import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import storageUtil from "../utils/localStorageUtil";

// Define the shape of your context state
interface FlowDataContextType {
  persistetNodesData: any;
  setPersistetNodesData: React.Dispatch<React.SetStateAction<any>>;
  conceptId: string;
  setConceptId: React.Dispatch<React.SetStateAction<string>>;
  cardsMappedData: any;
  setCardsMappedData: React.Dispatch<React.SetStateAction<any>>;
  conceptData: any;
  setConceptData: React.Dispatch<React.SetStateAction<any>>;
  modalOutputData: any;
  setModalOutputData: any;
  modalInputData:any;
  setModalInputData:any;
  provision_Id:any;
  setProvision_Id:any;
  partialExecutionData:any;
  setPartialExecutionData:any;
  socket:any;
  setSocket: any;
  message:any;
  setMessage:any;
  modalOutputIdBy:any;
  setModalOutputIdBy:any;
  blogId:string;
  setBlogId:React.Dispatch<React.SetStateAction<string>>;
  conceptDataAgentBy: any;
  setConceptDataAgentBy:any;
}

// Create the context with a default value (undefined)
const FlowDataProviderContext = createContext<FlowDataContextType | undefined>(undefined);

// Define the provider props
interface FlpwDataProviderProps {
  children: ReactNode;
}

interface WebSocketResponse {
  action: string;
  data: any;
}


// Create the provider component
export const FlowDataProvider: React.FC<FlpwDataProviderProps> = ({ children }) => {
const [persistetNodesData, setPersistetNodesData] = React.useState([])
const [cardsMappedData, setCardsMappedData] = React.useState({})
const [conceptId, setConceptId] = useState<string>(
  storageUtil.getItemLocal('conceptId') || ''
);
const [conceptData, setConceptData] = useState<any>(null);
const [modalOutputData, setModalOutputData] = useState<string>("");
const [modalInputData, setModalInputData] = useState<any>({});
const [provision_Id, setProvision_Id] = useState<string>("");
const [partialExecutionData, setPartialExecutionData] = useState<any>({});
const [socket, setSocket] = useState<WebSocket | null>(null);
const [message, setMessage] = useState<WebSocketResponse | null>(null);
const [blogId, setBlogId] = useState<string>("");
const [conceptDataAgentBy, setConceptDataAgentBy] = useState<any>({});
const [modalOutputIdBy, setModalOutputIdBy] = useState<any | null>({});



  return (
    <FlowDataProviderContext.Provider
      value={{
        persistetNodesData,
        setPersistetNodesData,
        conceptId,
        setConceptId,
        cardsMappedData,
        setCardsMappedData,
        conceptData,
        setConceptData,
        modalOutputData,
        setModalOutputData,
        modalInputData,
        setModalInputData,
        provision_Id,
        setProvision_Id,
        partialExecutionData,
        setPartialExecutionData,
        socket,
        setSocket,
        message,
        setMessage,
        blogId,
        setBlogId,
        conceptDataAgentBy,
        setConceptDataAgentBy,
        modalOutputIdBy,
        setModalOutputIdBy
      }}
    >
      {children}
    </FlowDataProviderContext.Provider>
  );
};

// Custom hook to use the context
export const useDataFlow = (): FlowDataContextType => {
  const context = useContext(FlowDataProviderContext);

  if (!context) {
    throw new Error("FlowDataProviderContext must be used within a MyProvider");
  }

  return context;
};
