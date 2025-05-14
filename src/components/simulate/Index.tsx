import React, {useEffect} from 'react';
import { Box } from '@mui/material';
import ConceptFlowTable from '../ConceptFlowTable/Index';
import { useDataFlow } from '../../providers/FlowDataProvider';

const Simulate = () => {

    const { persistetNodesData, setPersistetNodesData, conceptId, provision_Id } = useDataFlow();
  
    useEffect(()=>{
    }, [])  
  
    return (
      <div>
        <ConceptFlowTable isDataRowsEnable={true} isDataSimulate={false}/>
      </div>
    );
  };
  
  export default Simulate;

