import { Handle, Position } from "@xyflow/react";
import React, { useState } from "react";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import PresentRoundedIcon from "@mui/icons-material/OndemandVideo";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { Button } from "@mui/material";

const CustomNode = ({ data }: any) => {
  const {
    label,
    onEdit,
    isEditing,
    onLabelChange,
    markEditDone,
    handleOpenNewPopup,
    id,
    nodeIndex,
    onDelete,
  } = data;

  const handleBtnClick = (e: React.MouseEvent) => {
    handleOpenNewPopup(nodeIndex);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop the click event from bubbling up to the div
    onDelete(); // Trigger the onDelete function
  };

  return (
    <div
      style={{
        backgroundColor: data.backgroundColor || "#fff",
        borderRadius: "8px",
        padding: "12px",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 1px 5px rgba(0, 0, 0, 0.3)",
        pointerEvents: "auto",
      }}
      onClick={handleBtnClick}
    >
      <PresentRoundedIcon />
      <span style={{ fontSize: "14px", padding: "3px 5px 5px 5px" }}>
        {data.label}
      </span>
      <Button onClick={handleDeleteClick} style={{ marginLeft: "auto" }}>
        <DeleteIcon />
      </Button>
    </div>
  );
};

export default CustomNode;
