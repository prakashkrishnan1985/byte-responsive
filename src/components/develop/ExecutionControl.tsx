import React, { useState } from "react";
import { IconButton, CircularProgress, Box } from "@mui/material";
import { PlayArrow, ArrowBack, ArrowForward } from "@mui/icons-material";

interface ExecutionControlProps {
  onPartialExecute: () => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onFullExecute: () => void;
}

const ExecutionControl: React.FC<ExecutionControlProps> = ({
  onPartialExecute,
  onGoBack,
  onGoForward,
  onFullExecute,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handlePartialExecution = () => {
    setLoading(true);
    onPartialExecute();
    setTimeout(() => {
      setLoading(false); 
    }, 2000);
  };

  return (
    <div className="execution-control">
      <IconButton
        onClick={handlePartialExecution}
        title="Partial Execution"
        sx={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: "rgba(80, 80, 80, 1)", 
          position: "relative", 
          "&:hover": {
            backgroundColor: "#666",
          },
        }}
      >
        {loading ? (
          <CircularProgress
            size={40}
            thickness={4}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ) : (
          <PlayArrow sx={{ color: "white", fontSize: 30 }} />
        )}
      </IconButton>

      <IconButton
        onClick={onGoBack}
        title="Go Back"
        sx={{
          width: 50,
          height: 50,
          borderRadius: "50%", 
          backgroundColor: "rgba(80, 80, 80, 1)", 
          "&:hover": {
            backgroundColor: "#666", 
          },
        }}
      >
        <ArrowBack sx={{ color: "white", fontSize: 30 }} />
      </IconButton>

      <IconButton
        onClick={onGoForward}
        title="Go Forward"
        sx={{
          width: 50,
          height: 50,
          borderRadius: "50%", 
          backgroundColor: "rgba(80, 80, 80, 1)",
          "&:hover": {
            backgroundColor: "#666", 
          },
        }}
      >
        <ArrowForward sx={{ color: "white", fontSize: 30 }} />
      </IconButton>

      <IconButton
        onClick={onFullExecute}
        title="Full Execution"
        sx={{
          width: 50,
          height: 50,
          borderRadius: "50%", 
          backgroundColor: "rgba(80, 80, 80, 1)", 
          position: "relative",
          "&:hover": {
            backgroundColor: "#666", 
          },
        }}
      >

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "4px solid rgba(80, 80, 80, 1)",
            borderRadius: "50%",
            padding: "6px", 
          }}
        >
          <PlayArrow sx={{ color: "white", fontSize: 30 }} />
        </Box>
      </IconButton>
    </div>
  );
};

export default ExecutionControl;
