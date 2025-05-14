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
  padding: "0px 16px",
  display: "flex",
  flexDirection: "row",
  marginTop: theme.spacing(1),

  "& h2": {
    margin: 0,
    padding: "0 16px",
  },

  [theme.breakpoints.down("sm")]: {
    // padding: "0px 0px", 
  },
}));

interface StyledListProps {
  listCount: number;
}

const StyledList = styled("div")<StyledListProps>(({ theme, listCount }) => ({
  borderRadius: 25,
  display: "flex",
  flexWrap: "wrap",
  minWidth: "33.125rem",
  height: "200px",
  marginTop: 8,
  border: "5px solid white",
  borderTop: listCount === 4 ? "5px solid white" : "none",
  justifyContent: "space-between",
  padding: "30px 20px",
  boxSizing: "border-box",
  textAlign: "center",

  [theme.breakpoints.down("lg")]: {
    width: "100%",
    padding: "30px 40px",
  },

  [theme.breakpoints.down("md")]: {
    width: "100%",
    padding: "30px 20px",
  },

  [theme.breakpoints.down("sm")]: {
    minWidth: "22.0rem",
    minHeight:'120px',
    height:'auto',
    flexDirection: "row",
    padding: "15px 20px",
  },
}));

const DraggableItem = styled("div")({
  flex: "0 0 calc(50% - 8px)",
  margin: "4px 8px 0px 0px",
  boxSizing: "border-box",

  "@media (max-width: 900px)": {
    flex: "0 0 calc(33.333% - 8px)",
  },

  "@media (max-width: 600px)": {
    flex: "0 0 100%",
    margin: "4px 0", 
  },
});

const DropBucket: React.FC<ColumnProps> = ({ col: { list, id } }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <StyledColumn>
          <StyledList
            {...provided.droppableProps}
            listCount={list?.length}
            ref={provided.innerRef}
          >
            {list?.map((item: any, index: any) => (
              <DraggableItem key={item?.id}>
                <DraggableList
                  id={item?.id}
                  text={item?.agent_name}
                  index={index}
                  icon={item?.icon}
                  tooltipText={item?.tooltip}
                />
              </DraggableItem>
            ))}
            {provided.placeholder}
          </StyledList>
        </StyledColumn>
      )}
    </Droppable>
  );
};

export default DropBucket;
