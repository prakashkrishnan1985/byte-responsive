// @ts-nocheck
import React, { useEffect, useState } from "react";
import Column from "./Column";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { styled } from "@mui/material";
import DropBucket from "./DropBucket";
import { Typography } from "@mui/material";
import storageUtil from "../../utils/localStorageUtil";  // Ensure this utility has `getItemSession` and `setItemSession`

const StyledColumns = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  margin: "0 auto",
  width: "56.25rem",
  
  [theme.breakpoints.down("lg")]: {
    width: "100%", 
    // padding: "0 16px",
  },

  [theme.breakpoints.down("md")]: {
    width: "100%",
    // padding: "0 8px",
  },

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    width: "100%",
    // padding: "0 8px",
  },
}));

const DragDropList = ({ list, mappedAgentsData, setMappedAgentsData, category }) => {
  const storedMappedAgentsData = storageUtil.getItemSession('mappedAgentsData');
  const storedColumnData = storageUtil.getItemSession('column');
  const initialColumns = {
    todo: {
      id: "todo",
      list: (storedMappedAgentsData && storedMappedAgentsData[category] && storedMappedAgentsData[category].todo) 
        ? storedMappedAgentsData[category].todo
        : mappedAgentsData[category],
    },
    doing: {
      id: "doing",
      list: (storedColumnData && storedColumnData.doing) 
        ? storedColumnData?.doing
        : [],
    },
  };

  const [columns, setColumns] = useState(initialColumns);
  const [error, setError] = useState<string | null>(null);

  const onDragEnd = ({ source, destination }: DropResult) => {
    // Ensure we have a valid destination
    if (destination === undefined || destination === null) return null;

    // If the item is dropped at the same place, do nothing
    if (source.droppableId === destination.droppableId && destination.index === source.index) return null;

    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    // If start and end columns are the same, reorder the items within the same column
    if (start === end) {
      const newList = start.list.filter((_: any, idx: number) => idx !== source.index);
      newList.splice(destination.index, 0, start.list[source.index]);

      const newCol = {
        id: start.id,
        list: newList,
      };

      setColumns((state) => ({ ...state, [newCol.id]: newCol }));
      return null;
    } else {
      const newStartList = start.list.filter((_: any, idx: number) => idx !== source.index);
      const newStartCol = {
        id: start.id,
        list: newStartList,
      };

      const newEndList = [...end.list];

      if (destination.droppableId === "doing" && newEndList.length >= 4) {
        setError("You can only have up to 4 agents");
        return null;
      } else {
        setError(null);
      }

      newEndList.splice(destination.index, 0, start.list[source.index]);

      const newEndCol = {
        id: end.id,
        list: newEndList,
      };

      setColumns((state) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      }));
      return null;
    }
  };

  useEffect(() => {
    storageUtil.setItemSession('column', {
      doing: [...columns.doing.list]
    });

    list([...columns.doing.list]);

    // Update the todo list 
    setMappedAgentsData({ 
      ...mappedAgentsData, 
      [category]: [...columns.todo.list] 
    });
  }, [columns]);

  useEffect(() => {
    // change the the carousel data if category change
    setColumns((prevState) => ({
      ...prevState,
      todo: {
        ...prevState.todo,
        list: mappedAgentsData[category],
      },
    }));
  }, [category]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StyledColumns>
        <Column col={Object.values(columns)[0]} />
        <DropBucket col={Object.values(columns)[1]} />
        {error && (
          <Typography
            variant="subtitle1"
            sx={{
              display: "inline-block",
              paddingTop: "10px",
              fontSize: {
                xs: "10px",
                sm: "12px",
                md: "16px",
              },
              color: "error.main",
            }}
          >
            {error}
          </Typography>
        )}
      </StyledColumns>
    </DragDropContext>
  );
};

export default DragDropList;
