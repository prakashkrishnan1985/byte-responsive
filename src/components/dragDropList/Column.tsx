import React from "react";
import DraggableList from "./DraggableList";
import { Droppable } from "react-beautiful-dnd";
import { styled } from "@mui/material";

interface ColumnProps {
  col: {
    id: string;
    list: any;
  };
}

const StyledColumn = styled("div")(({ theme }) => ({
  padding: "24px 16px",
  display: "flex",
  flexDirection: "row",

  "& h2": {
    margin: 0,
    padding: "0 16px",
  },

  [theme.breakpoints.down("sm")]: {
    padding: "16px", 
    flexDirection: "column", 
    alignItems:'center'
  },
}));

const StyledList = styled("div")(({ theme }) => ({
  borderRadius: 8,
  padding: 0,
  display: "flex",
  flexDirection: "row",
  flexGrow: 1,
  width: "835px",
  flexWrap: "wrap",
  marginTop: 0,
  color: "white",
  justifyContent: "center",

  [theme.breakpoints.down("lg")]: {
    width: "100%", 
    padding: "16px",
  },

  [theme.breakpoints.down("md")]: {
    width: "100%",
    padding: "12px", 
  },

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    padding: "0px 8px",
    justifyContent: "flex-start",
  },
}));

const Column: React.FC<ColumnProps> = ({ col: { list, id } }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <StyledColumn>
          <StyledList {...provided.droppableProps} ref={provided.innerRef}>
            {list?.map((item: any, index: any) => (
              <DraggableList
                key={item?.id}
                id={item?.id}
                text={item?.agent_name}
                index={index}
                icon={item?.icon}
                tooltipText={item?.tooltip}
              />
            ))}
            {provided.placeholder}
          </StyledList>
        </StyledColumn>
      )}
    </Droppable>
  );
};

export default Column;
