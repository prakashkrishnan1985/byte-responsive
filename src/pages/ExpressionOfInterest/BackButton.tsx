import React from "react";
import { IconButton } from "@mui/material";
import { BsArrowLeft } from "react-icons/bs";

interface BackButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, isVisible }) => {
  if (!isVisible) return null;

  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: { xs: 1, md: 20 }, 
        left: { xs: 7, md: 20 },
        zIndex: 10,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        color: "#fff",
        padding: "8px",
      }}
    >
      <BsArrowLeft size={24} />
    </IconButton>
  );
};

export default BackButton;
