import { Tooltip } from "@mui/material";
import { Chip, styled, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React from "react";
import { Draggable } from "react-beautiful-dnd";

interface ItemProps {
  text: string;
  index: number;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  id: string;
  tooltipText: string;
}

const DraggableList: React.FC<ItemProps> = ({ text, index, icon, id, tooltipText }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided: any) => (
        <Tooltip
          title={tooltipText}
          slotProps={{
            tooltip: {
              sx: {
                color: "#fff",
                backgroundColor: "black",
                border: "2px solid, #7bff004a",
                padding:'10px 0px 10px 10px',
                fontSize:'12px',
                borderRadius:'10px'
              },
            },
          }}
          arrow
        >
          <Chip
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            label={text}
            icon={icon}
            variant="outlined"
            sx={{
              margin: "8px",
              cursor: "grab",
              color: "white",
              background: "#7bff0033",
              border: "2px solid, #7bff004a",
              padding: {xs:"20px 40px", md:'20px 0px'},
              fontSize:{xs:'16px'},
            }}
          />
        </Tooltip>
      )}
    </Draggable>
  );
};

export default DraggableList;
