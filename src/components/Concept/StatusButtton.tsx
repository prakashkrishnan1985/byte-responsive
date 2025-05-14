import React, { useState } from "react";
import { Button, Stepper, Step, StepLabel } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BuildIcon from "@mui/icons-material/Build";

interface StatusButtonsProps {
  onProvisionClick: () => void;
  onCompletedClick: (setIsCompletedClicked: any) => void;
  onSaveClick: () => void;
}

const StatusButtons: React.FC<StatusButtonsProps> = ({
  onSaveClick,
  onProvisionClick,
  onCompletedClick,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isCompletedClicked, setIsCompletedClicked] = useState(false);

  const steps = ["Save", "Completed", "Provision"];

  const handleSaveClick = () => {
    onSaveClick();
    setActiveStep(1); 
  };

  const handleCompletedClick = () => {
    onCompletedClick(setIsCompletedClicked);
    setActiveStep(2); 
  };

  const handleProvisionClick = () => {
    onProvisionClick();
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  const getStepIcon = (step: number) => {
    if (activeStep > step) {
      return <CheckCircleIcon style={{ color: "green" }} />;
    } else if (activeStep === step) {
      return <AssignmentTurnedInIcon style={{ color: "white" }} />;
    } else {
      return <BuildIcon style={{ color: "white" }} />;
    }
  };

  return (
    <div
      style={{
        width: "600px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          backgroundColor: "transparent",
          color: "white",
          width: "600px",
        }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              icon={getStepIcon(index)}
              onClick={() => handleStepClick(index)}
              sx={{
                color:
                  activeStep > index
                    ? "green"
                    : activeStep === index
                    ? "white" 
                    : "white",
                cursor: "pointer",
                "& .MuiStepLabel-label.Mui-completed": {
                  color: "white",
                },
                "& .MuiStepLabel-label.Mui-active": {
                  color: "white",
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={handleSaveClick}
          sx={{ backgroundColor: "#2D6414" }}
          disabled={activeStep !== 0}
        >
          Save
        </Button>

        {activeStep === 1 && !isCompletedClicked && (
          <Button
            variant="contained"
            color="success"
            onClick={handleCompletedClick}
            sx={{ backgroundColor: "#2D6414" }}
          >
            Completed
          </Button>
        )}

        {activeStep === 2 && (
          <Button
            variant="contained"
            color="success"
            onClick={handleProvisionClick}
            sx={{ backgroundColor: "#2D6414" }}
          >
            PROVISION
          </Button>
        )}
      </div>
    </div>
  );
};

export default StatusButtons;
