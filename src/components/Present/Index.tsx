import React, { useEffect } from 'react';
import ConceptFlowTable from "../ConceptFlowTable/Index";
import { useDataFlow } from "../../providers/FlowDataProvider";
import { useWebSocket } from '../../Hooks/useWebSocket';

const Present = () => {

  const { persistetNodesData, setPersistetNodesData, conceptId, provision_Id } = useDataFlow();
  const { connect } = useWebSocket(conceptId);

  useEffect(()=>{
    connect();
  }, [])  

  return (
    <div>
      <ConceptFlowTable isDataRowsEnable={true} />
    </div>
  );
};

export default Present;
