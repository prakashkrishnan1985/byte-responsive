// OrchestrationProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useDataFlow } from "./FlowDataProvider";
import {
  getConcept,
  PostConcept,
  PutConcept,
} from "../services/conceptService";
import { useNavigate } from "react-router-dom";
import storageUtil from "../utils/localStorageUtil";
import { toast } from "react-toastify";

export interface VariableObject {
  source: number;
  keyPath: string;
  values: [any];
  type: string;
}

// Define the types for the concept
interface Concept {
  conceptId: string;
  conceptName: string;
  description: string;
  status: string;
  variableDict: { [key: string]: any };
  conceptTable: any[];
  createdAt: string;
  updatedAt: string;
}

interface OrchestrationContextType {
  createConcept: (
    conceptName: string,
    description: string,
    conceptTable?: any[],
    variableDict?: { [key: string]: any }
  ) => void; // function to create the concept
  updateConcept: (
    conceptName?: string,
    description?: string,
    node?: any,
    variableName?: string,
    variableObj?: { [key: string]: any },
    nodeIdx?: number
  ) => void; // function to update the concept
  addNode: (node: any, nodeIdx: number) => void; // function to add a node to the concept
  loadConceptData: (conceptId: string) => void; // function to load the concept data from the backend
  resetConcept: (conceptId: string) => void;
  updateInboundDataInNode: (
    nodeIdx: number,
    applicationName: string,
    applicationDescription: string,
    variableKey: string,
    variableObj: { [key: string]: string },
    values: string[] | null,
    DataSourceFormData: any
  ) => void; // Function to update inbound data
  addOutputDataInNode: (nodeIdx: number, variableKeys: string[]) => void; // function to add output data
  updateInputDataInNode: (
    updatedResponseTemplate: { [key: string]: string },
    nodeIdx: number
  ) => void; // function to update input data
  updateOutboundDataInNode: (
    nodeIdx: number,
    applicationName?: string,
    applicationDescription?: string,
    requestTemplate?: any,
    responseVariableKeys?: string[],
    authConfig?: object,
    endpoint?: string,
    endpointMethod?: string
  ) => void; // function to update outbound data
  updateDataSourceInConcept: (nodeIdx: any, DataSourceFormData: any) => void;
  updateVariableDictInConcept: (nodeIdx: any, variableDict: any) => void;
  saveConcept: () => void;
  fetchConceptData: () => void;
  conceptData: Concept | null;
  nodeDelete: (nodeIdx: number, source:number) => void;
}

const OrchestrationContext = createContext<
  OrchestrationContextType | undefined
>(undefined);

interface OrchestrationProviderProps {
  children: ReactNode;
}

const initialDataSourceFormData = {
  inbound: {
    seq: 1,
    applicationName: "",
    applicationDescription: "",
    variables: {},
  },
  outbound: {
    seq: 2,
    applicationName: "",
    applicationDescription: "",
    variables: [],
    endpoint: null,
    authConfig: null,
    requestTemplate: {},
    response: {},
  },
  modelInput: {
    seq: 3,
    actualValue: [],
    variables: {},
  },
  modelOutput: {
    seq: 4,
    actualValue: [],
    variables: [],
  },
};

let nodeVariables: any = {};
// {
//   1 = [variable_key1, variable_key2]
//   2 = [variable_key1, variable_key2]
//   3 = [variable_key3, variable_key4]
//   4 = [variable_key5, variable_key6]
// }
let variableNodes: any = {};
// {
//   variable_key = [node_id1, node_3],
//   variable_key = [node_id1, node_3],
//   variable_key = [node_id1, node_3],
//   variable_key = [node_id1, node_3],
//   variable_key = [node_id1, node_3],
// }
let conceptObject: any = [];
let variableDict: any = [];

export const OrchestrationProvider: React.FC<OrchestrationProviderProps> = ({
  children,
}) => {
  const [conceptData, setConceptData] = useState<any>(null);
  const { setConceptId, conceptId, modalInputData, modalOutputData } =
    useDataFlow();

  const navigate = useNavigate();

  const createConcept = async (
    conceptName: string,
    description: string,
    conceptTable: any[] = [],
    variableDict: { [key: string]: any } = {}
  ): Promise<void> => {
    let response;
    try {
      const payload = {
        concept_name: conceptName,
        description,
      };
      response = await PostConcept(payload);
      storageUtil.setItemLocal("conceptId", (response as any).conceptId);
      setConceptId((response as any).conceptId);
    } catch (error) {
      console.log(error);
    } finally {
      navigate(`/Conceptualize/${(response as any).conceptId}`);
    }
    const newConcept: Concept = {
      conceptId: (response as any).conceptId,
      conceptName,
      description,
      status: "draft",
      variableDict,
      conceptTable,
      createdAt: "",
      updatedAt: "",
    };
    setConceptData(newConcept);
  };

  const updateConcept = (
    conceptName: string | null = null,
    description: string | null = null,
    node: any = null,
    variableName: string | null = null,
    variableObj: { [key: string]: any } | null = null,
    nodeIdx: number = -1
  ): void => {
    if (conceptData) {
      if (conceptName) conceptData.conceptName = conceptName;
      if (description) conceptData.description = description;

      if (node && nodeIdx >= 0 && nodeIdx < conceptData.conceptTable.length) {
        conceptData.conceptTable[nodeIdx] = {
          ...conceptData.conceptTable[nodeIdx],
          ...node,
        };
      }

      if (variableName && variableObj) {
        conceptData.variableDict[variableName] = variableObj;
      }

      setConceptData({ ...conceptData });
    }
  };

  const addNode = useCallback(
    (node: any, nodeIdx: number): void => {
      console.log('addNode+++++');
      if (conceptData) {
        const newNodeData = {
          nodeId: node?.id,
          nodeName: node?.name,
          nodeType: node?.type,
          description: node?.description,
          type: node?.type,
          source: (node?.source).toString(),
          endpoint: "",
          requestTemplate: node?.payloadTemplate,
          responseTemplate: node?.responseTemplate,
          authConfig: {
            authType: "oauth",
            clientId: "client_id",
            clientSecret: "client_secret",
            key_path: "authConfig.clientId",
            tokenUrl: "https://auth.example.com/token",
          },
        };
        const updatedNode = {
          ...newNodeData,
          dataSources: initialDataSourceFormData,
        };

        console.log("node++++", node);

        conceptData.conceptTable[nodeIdx] = updatedNode;

        updateConcept(null, null, updatedNode, null, null, nodeIdx);
      }
    },
    [conceptData, updateConcept]
  );

  const loadConceptData = (conceptId: string): void => {
    fetch(`/api/concept/${conceptId}`)
      .then((response) => response.json())
      .then((data) => {
        const concept: Concept = {
          conceptId: data.conceptId,
          conceptName: data.conceptName,
          description: data.description,
          status: data.status,
          variableDict: data.variableDict,
          conceptTable: data.conceptTable,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };

        //setConceptData(concept);
      })
      .catch((error) => {
        console.error("Error loading concept data:", error);
      });
  };

  const updateDataSourceInConcept = (nodeIdx: any, DataSourceFormData: any) => {
    if (
      conceptData &&
      nodeIdx >= 0 &&
      nodeIdx < conceptData.conceptTable.length
    ) {
      const node = conceptData.conceptTable[nodeIdx];
      node.dataSources = { ...node.dataSources, ...DataSourceFormData };
    }
  };

  const updateVariableDictInConcept = (nodeIdx: any, variableDict: any) => {
    if (
      conceptData &&
      nodeIdx >= 0 &&
      nodeIdx < conceptData.conceptTable.length
    ) {
      conceptData.variableDict = {
        ...conceptData.variableDict,
        ...variableDict,
      };
    }
  };

  const saveConcept = async () => {
    const loadingToast = toast.loading("Saving your data...", {
      className: "custom-toast-website",
    });
    try {
      const response = await PutConcept(conceptData, conceptId);
      toast.success("Saved successfully!");
      toast.dismiss(loadingToast);
    } catch (error: any) {
      const loadingToast = toast.error(error, {
        className: "custom-toast",
      });
      toast.dismiss(loadingToast);
    }
  };

  const fetchConceptData = async () => {
    try {
      const response = await getConcept(conceptId);
      setConceptData(response as any);
    } catch (error) {
      console.error("Error fetching concept data:", error);
    }
  };

  console.log("conceptData", conceptData);

  const updateInboundDataInNode = (
    nodeIdx: number,
    applicationName: string,
    applicationDescription: string,
    variableKey: string,
    variableObj: { [key: string]: string },
    values: string[] | null,
    DataSourceFormData: any
  ): void => {
    if (
      conceptData &&
      nodeIdx >= 0 &&
      nodeIdx < conceptData.conceptTable.length
    ) {
      const node = conceptData.conceptTable[nodeIdx];

      const inboundData = {
        seq: 1,
        applicationName,
        applicationDescription,
        variables: {
          [variableKey]: `$${variableKey}$`,
        },
      };

      node.dataSources.inbound = inboundData;

      if (variableKey && variableObj) {
        conceptData.variableDict[variableKey] = variableObj;
      }

      //setConceptData({ ...conceptData });
    }
  };

  const addOutputDataInNode = (
    nodeIdx: number,
    variableKeys: string[]
  ): void => {
    if (
      conceptData &&
      nodeIdx >= 0 &&
      nodeIdx < conceptData.conceptTable.length
    ) {
      const node = conceptData.conceptTable[nodeIdx];

      const modelOutputData = {
        seq: 3,
        variables: variableKeys,
      };

      node.dataSources.modelOutput = modelOutputData;

      //setConceptData({ ...conceptData });
    }
  };

  const updateInputDataInNode = (
    updatedResponseTemplate: { [key: string]: string },
    nodeIdx: number
  ): void => {
    if (
      conceptData &&
      nodeIdx >= 0 &&
      nodeIdx < conceptData.conceptTable.length
    ) {
      const node = conceptData.conceptTable[nodeIdx];

      const modelInputData = {
        seq: 2,
        variables: updatedResponseTemplate,
      };

      node.dataSources.modelInput = modelInputData;

      //setConceptData({ ...conceptData });
    }
  };

  const updateOutboundDataInNode = (
    nodeIdx: number,
    applicationName: string = "",
    applicationDescription: string = "",
    requestTemplate: any = null,
    responseVariableKeys: string[] = [],
    authConfig: object = {},
    endpoint: string = "",
    endpointMethod: string = "get"
  ): void => {
    if (
      conceptData &&
      nodeIdx >= 0 &&
      nodeIdx < conceptData.conceptTable.length
    ) {
      const node = conceptData.conceptTable[nodeIdx];

      const outboundObj = {
        seq: 4,
        applicationName,
        applicationDescription,
        authConfig,
        requestTemplate,
        response: responseVariableKeys, // These could represent your response structure
        endpoint,
        endpointMethod,
      };

      node.dataSources.outbound = outboundObj;

      // Loop through the response variable keys and update variables
      responseVariableKeys.forEach((variableKey) => {
        const modelType = "response"; // Example value, adjust as necessary
        const values: string[] = []; // Define how these values should be populated
        updateVariablesDic(variableKey, nodeIdx, "", values, modelType); // Assuming updateVariables exists
      });

      setConceptData({ ...conceptData });
    }
  };

  // Helper function to update or add variables in the variableDict
  const updateVariablesDic = (
    variableKey: string,
    nodeIdx: number,
    keyPath: string,
    values: any[], // New values to update for the variable
    modelType: string
  ): void => {
    if (conceptData) {
      let updatedVariable = conceptData.variableDict[variableKey];

      // If the variable doesn't exist, create a new one
      if (!updatedVariable) {
        updatedVariable = {
          source: nodeIdx, // Default source (you can modify this based on your logic)
          keyPath: keyPath || "", // Use the passed keyPath or empty string if not provided
          type: modelType, // Set the type of the variable (inbound, outbound, etc.)
          values: values, // Assign the provided values
        };
      } else {
        // If the variable exists, update its properties
        if (keyPath !== "") {
          updatedVariable.keyPath = keyPath;
        }
        updatedVariable.values = values;
        updatedVariable.type = modelType;
      }

      // Update the variable in the variableDict
      conceptData.variableDict[variableKey] = updatedVariable;

      // Set the updated concept data back to state
      setConceptData({ ...conceptData });
    }
  };

  const resetConcept = (conceptId: string): void => {
    fetch(`/api/resetConcept/${conceptId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conceptId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Concept reset successfully on backend:", data);
      })
      .catch((error) => {
        console.error("Error resetting concept on backend:", error);
      });

    setConceptData(null);
  };

  const updateVariables = (
    variableDict: any,
    variableKey: string,
    nodeIdx: number,
    values: [string],
    keyPath: string = "",
    modelType: string
  ) => {
    const variableObj: VariableObject = {
      source: nodeIdx,
      keyPath: keyPath,
      values: values,
      type: modelType,
    };
    return (variableDict[variableKey] = variableObj);
  };

  const updateDataSource = (
    conceptObject: any,
    nodeIdx: number,
    sourceType: string,
    dataObject: any
  ) => {
    conceptObject[nodeIdx]["dataSources"][sourceType] = dataObject;
    return conceptObject;
  };

  const updateVariablesNodes = (
    variableNodes: any,
    variableKey: string,
    nodeIdx: number,
    type: string = "add"
  ) => {
    if (type === "add") {
      variableNodes[variableKey].push(nodeIdx);
    } else {
      variableNodes[variableKey] = variableNodes[variableKey].filter(
        (item: number) => item !== nodeIdx
      );
    }
    return variableNodes;
  };

  const updateNodeVariables = (
    nodeVariables: any,
    variableKey: string,
    nodeIdx: number,
    type: string = "add"
  ) => {
    if (type === "add") {
      nodeVariables[nodeIdx].push(nodeIdx);
    } else {
      nodeVariables[nodeIdx] = nodeVariables[nodeIdx].filter(
        (item: string) => item !== variableKey
      );
    }
    return nodeVariables;
  };

  const deleteVariablesByNodeId = (nodeIdx: number) => {
    const currentNodeVariables = nodeVariables[nodeIdx];
    currentNodeVariables.forEach((key: string) => {
      delete variableDict[key];
    });
    return variableDict;
  };

  console.log("conceptData line 564", conceptData);

  const nodeDelete = (nodeIndex: number) => { 
    
    console.log('Before Deletion:', conceptData?.conceptTable);

    const updatedConceptTable = conceptData?.conceptTable.filter(
        (_: any, index: number) => index !== nodeIndex
    );

    console.log('After Deletion:', updatedConceptTable);

    // Update the state with the modified conceptTable
    setConceptData({ ...conceptData, conceptTable: updatedConceptTable });
};

  // const nodeDelete = (nodeIdx: number) => {
  //   if (checkNodeVariableUsage(nodeIdx)) {
  //     // delete_variables
  //     variableDict = deleteVariablesByNodeId(nodeIdx);

  //     //update node id
  //     for (let i = nodeIdx + 1; i < conceptObject.length; i++) {
  //       conceptObject[i]["nodeId"]--;
  //     }
  //     // shift node indexes
  //     let indexToRemove = nodeIdx;
  //     if (indexToRemove >= 0 && indexToRemove < conceptObject.length) {
  //       conceptObject.splice(indexToRemove, 1);
  //     }
  //     // shift variable source
  //     variableDict = shiftAllVariableSources(variableDict, nodeIdx);
  //     nodeVariables = shiftNodeVariables(nodeVariables, nodeIdx);
  //     variableNodes = shiftVariableNodes(variableNodes, nodeIdx);
  //   }
  //   return "You can't delete node!";
  // };

  const shiftAllVariableSources = (variableDict: any, nodeIdx: number) => {
    const allVariable = [];
    for (let i = nodeIdx + 1; i < conceptObject.length; i++) {
      allVariable.push(...nodeVariables[i]);
    }
    allVariable.forEach((key) => {
      variableDict[key]["source"] = variableDict[key]["source"] - 1;
    });
    return variableDict;
  };

  const shiftNodeVariables = (nodeVariables: any, nodeIdx: number) => {
    for (let i = nodeIdx; i < conceptObject.length; i++) {
      nodeVariables[nodeIdx] = nodeVariables[nodeIdx + 1];
    }
    return nodeVariables;
  };

  const shiftVariableNodes = (variableNodes: any, nodeIdx: number) => {
    Object.keys(variableNodes).forEach((key) => {
      if (nodeIdx in variableNodes[key]) {
        variableNodes[key] = variableNodes[key].filter(
          (item: number) => item !== nodeIdx
        );
      }
    });
    return variableNodes;
  };

  const checkNodeVariableUsage = (nodeIdx: number) => {
    const currentNodeVariables: [string] = nodeVariables[nodeIdx];
    const conceptLen = conceptObject.length;
    for (let i = nodeIdx + 1; i < conceptLen; i++) {
      const arrayTwo = nodeVariables[i];
      const hasValue = currentNodeVariables.some((item) =>
        arrayTwo.includes(item)
      );
      if (hasValue) {
        return !hasValue;
      }
    }
    return true;
  };

  return (
    <OrchestrationContext.Provider
      value={{
        createConcept,
        updateConcept,
        addNode,
        loadConceptData,
        resetConcept,
        updateInboundDataInNode,
        addOutputDataInNode,
        updateInputDataInNode,
        updateOutboundDataInNode,
        updateDataSourceInConcept,
        updateVariableDictInConcept,
        fetchConceptData,
        saveConcept,
        conceptData,
        nodeDelete,
      }}
    >
      {children}
    </OrchestrationContext.Provider>
  );
};

export const useOrchestration = (): OrchestrationContextType => {
  const context = useContext(OrchestrationContext);
  if (!context) {
    throw new Error(
      "useOrchestration must be used within an OrchestrationProvider"
    );
  }
  return context;
};
