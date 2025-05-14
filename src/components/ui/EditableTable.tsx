import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';

// Sample data to map to
const initialRows = [
  { id: 1, input: 'Input 1', output: 'Output 1' },
  { id: 2, input: 'Input 2', output: 'Output 2' },
  { id: 3, input: 'Input 3', output: 'Output 3' },
  { id: 4, input: 'Input 4', output: 'Output 4' },
  { id: 5, input: 'Input 5', output: 'Output 5' },
  { id: 6, input: 'Input 6', output: 'Output 6' },
  { id: 7, input: 'Input 7', output: 'Output 7' },
  { id: 8, input: 'Input 8', output: 'Output 8' },
  { id: 9, input: 'Input 9', output: 'Output 9' },
];

// Mapping message response to table data
const mapMessageToTableData = (messageResponse: any, category:any) => {
  // Ensure both modelPayload and modelResponse have the same length
  let rows;
  if(category===0){
   rows = messageResponse?.modelPayload?.map((payloadItem:any, index:number) => {
    const responseItem = messageResponse?.modelResponse[index];
    
    return {
      id: index + 1, // Unique ID for the row, based on the index
      input: JSON.stringify(payloadItem), // Convert input object to a string
      output: JSON.stringify(responseItem), // Convert output object to a string
    };
  });
}
  else{
    rows = messageResponse?.dataSources.outbound.payload?.map((payloadItem:any, index:number) => {
      const responseItem = messageResponse?.dataSources.outbound.outboundResponse[index];
      
      return {
        id: index + 1, // Unique ID for the row, based on the index
        input: JSON.stringify(payloadItem), // Convert input object to a string
        output: JSON.stringify(responseItem), // Convert output object to a string
      };
    });
  }

  return rows;
};
interface Props {
  isExpanded: boolean;
  setIsExpanded: any;
  messageResponse: any;
  category:any;
}

export default function EditableTable({ isExpanded, setIsExpanded, messageResponse, category }: Props) {
  const [rows, setRows] = useState(initialRows);


  useEffect(() => {
    const mappedData = mapMessageToTableData(messageResponse, category);
    setRows(mappedData); 
  }, [messageResponse, category]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div style={{ position: 'relative', width: '100%', zIndex: 10, fontSize: '16px' }}>
      <IconButton
        onClick={toggleExpand}
        sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
      >
        {isExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      </IconButton>
      <Paper sx={{ width: '100%', height: '100%' }}>
        <TableContainer sx={{ maxHeight: '100%' }}>
          <Table stickyHeader>
            <TableHead sx={{ backgroundColor: 'rgba(99, 48, 169, 1)'}}>
              <TableRow >
                <TableCell 
                  style={{ 
                    width: '50%', 
                    border: '1px solid rgba(224, 224, 224, 1)', 
                    fontWeight: 'bold' 
                  }}
                >
                  <TableSortLabel>Input</TableSortLabel>
                </TableCell>
                <TableCell 
                  style={{ 
                    width: '50%', 
                    border: '1px solid rgba(224, 224, 224, 1)', 
                    fontWeight: 'bold' 
                  }}
                >
                  <TableSortLabel>Output</TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ backgroundColor: 'rgba(15, 15, 15, 1)' }}>
              {rows?.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell 
                    style={{ 
                      border: '1px solid rgba(224, 224, 224, 1)', 
                      color: '#fff' 
                    }}
                  >
                    {row.input}
                  </TableCell>
                  <TableCell 
                    style={{ 
                      border: '1px solid rgba(224, 224, 224, 1)', 
                      color: '#fff' 
                    }}
                  >
                    {row.output}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
