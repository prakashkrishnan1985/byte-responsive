import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import EnergySavingIcon from "@mui/icons-material/EnergySavingsLeafOutlined";
import ExpandMore from "../reactFlow/ExpandMore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Collapse, ToggleButton } from "@mui/material";
import CommentSectionWrapper from "../comment-section/commentSectionWrapper/CommentSectionWrapper";
import VerticalToggleButtons from "../ui/VerticalButton";
import Meter from "../meter/Meter";
import DnDFlowCanvas from "../reactFlow/DnDFlowCanvas";
import SustainabilityReports from "../ui/SustainabilityReports";
import { StepIconProps } from '@mui/material/StepIcon';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel'
import StepLabel from '@mui/material/StepLabel';
import { styled } from '@mui/material/styles';
import ConceptFlowTable from "../ConceptFlowTable/Index";
import { useDataFlow } from "../../providers/FlowDataProvider";
import Concept from "../Concept/Index";
import Develop from "../develop/Develop";
import Present from "../Present/Index";
import ChatConcept from "../ChatConcept/Index";
import storageUtil from "../../utils/localStorageUtil";
import Simulate from "../simulate/Index";


const steps = ["Concept", "Present", "Develop", "Simulate"];

interface Props {
  aiToolsJson: any;
  yourToolsJson: any;
  setYourTools: any;
}

export default function HorizontalNonLinearStepper({
  aiToolsJson,
  yourToolsJson,
  setYourTools,
}: Props) {
  const [expanded, setExpanded] = React.useState(true);
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [isCommentOpen, setIsCommentOpen] = React.useState(false);
  const [meterPercentage, setMeterPercentage] = React.useState(0);
  const [view, setView] = React.useState("list");
  const [isSustaibilityReportOpen, setIsSustaibilityReportOpen] = React.useState(false);
  const {persistetNodesData, setPersistetNodesData}= useDataFlow()
  const { conceptId } = useDataFlow();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    setCompleted({
      ...completed,
      [activeStep]: true,
    });
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
  'linear-gradient(95deg, rgb(76, 175, 80) 0%, rgb(255, 255, 0) 100%)',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: '#eaeaf0',
      borderRadius: 1
    },
  }));
  

  const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme }) => ({
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700],
    }),
    variants: [
      {
        props: ({ ownerState }) => ownerState.active,
        style: {
          backgroundImage: 'linear-gradient(135deg, #FFA8A8 10%, #FCFF00 100%)',    
          boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        },
      },
      {
        props: ({ ownerState }) => ownerState.completed,
        style: {    
          backgroundImage:
          'linear-gradient(135deg, #12CBC4 10%, #C4E538 100%)',      
                },
      },
    ],
  }));
  
  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;
  
    const icons: { [index: string]: React.ReactElement<unknown> } = {
      1: <SettingsIcon />,
      2: <GroupAddIcon />,
      3: <VideoLabelIcon />,
      4: <GroupAddIcon />,
      5: <VideoLabelIcon />,
    };
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }
  
  const onCommentIocnClick = () => {
    setIsCommentOpen((flag) => !flag);
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: string
  ) => {
    setView(nextView);
    setIsCommentOpen(false);
    setIsSustaibilityReportOpen(false)
    if (nextView === "list") onCommentIocnClick();
    if(nextView==="module"){
      setIsSustaibilityReportOpen((flag)=>!flag)
    }
  };

  let token = storageUtil.getItemSession("authToken");

  // const onClose = ()={
  //   setIsCommentOpen(true)
  // }

  return (
    <Box sx={{ width: "100%", background:'black', color:'white' }}>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 1 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button onClick={handleNext} sx={{ mr: 1 }}>
            Next
          </Button>
          {activeStep !== steps.length &&
            (completed[activeStep] ? (
              <Typography variant="caption" sx={{ display: "inline-block" }}>
                Step {activeStep + 1} already completed
              </Typography>
            ) : (
              <Button onClick={handleComplete}>
                {completedSteps() === totalSteps() - 1
                  ? "Finish"
                  : "Complete Step"}
              </Button>
            ))}
        </Box>
        <Stepper
          nonLinear
          activeStep={activeStep}
          style={{ paddingTop: "15px" }}
          connector={<ColorlibConnector />}
        >
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}   sx={{
              '& .MuiStepLabel-label.Mui-active': { color: 'white' },
            }}>
              <StepLabel StepIconComponent={ColorlibStepIcon} color="inherit" onClick={handleStep(index)}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Collapse>
      <div>
        <Box display="flex" alignItems="center" px={1}>
          {" "}
          {/* Flex container */}
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Box>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div
              style={{
                position: "absolute",
                right: "0",
                zIndex: "10",
                top: "200px",
              }}
            >
              <VerticalToggleButtons view={view}>
                <ToggleButton
                  value="list"
                  aria-label="list"
                  onClick={(e) => handleChange(e, "list")}
                >
                  <ChatOutlinedIcon />
                </ToggleButton>
                <ToggleButton
                  value="module"
                  aria-label="module"
                  onClick={(e) => handleChange(e, "module")}
                >
                  <ViewModuleIcon />
                </ToggleButton>
                <ToggleButton
                  value="quilt"
                  aria-label="quilt"
                  onClick={(e) => handleChange(e, "quilt")}
                >
                  <EnergySavingIcon />
                </ToggleButton>
              </VerticalToggleButtons>
            </div>
            {isCommentOpen && (
              <div
                style={{
                  width: "485px",
                  position: "fixed",
                  padding: "0px 0px 15px 0px",
                  zIndex: "10",
                  display: "flex",
                  right: "0",
                  top: "0",
                  borderRadius: "10px",
                  backgroundColor: "#dddddd80",
                }}
              >
                {/* <CommentSectionWrapper /> */}
                <ChatConcept  conceptId={conceptId} token={token as any} onClose={onCommentIocnClick}/>
              </div>
            )}
             {isSustaibilityReportOpen && (
              <div
                style={{
                  width: "485px",
                  position: "fixed",
                  padding: "0px 0px 15px 0px",
                  zIndex: "10",
                  display: "flex",
                  right: "0",
                  top: "0",
                  borderRadius: "10px",
                  backgroundColor: "#dddddd80",
                }}
              >
                <SustainabilityReports />
              </div>
            )}
            {/* <Box ml={2}>
              <Meter value={meterPercentage} />
            </Box> */}
            {activeStep == 0 && (
              <Concept
                aiToolsJson={aiToolsJson}
                yourToolsJson={yourToolsJson}
                setYourTools={setYourTools}
                controlButtonExpander={expanded}
                setMeterPercentage={setMeterPercentage}
                isSideBarVisible={false}
                disabled={false}
              ></Concept>
            )}
            {/* {activeStep == 1 && (
                <DnDFlowCanvas
                aiToolsJson={aiToolsJson}
                yourToolsJson={yourToolsJson}
                setYourTools={setYourTools}
                controlButtonExpander={expanded}
                // setMeterPercentage={setMeterPercentage}
                isSideBarVisible={false}
                disabled={true}
                setPersistetNodesData={setPersistetNodesData}
                persistetNodesData={persistetNodesData}
              ></DnDFlowCanvas>
            )} */}
            {activeStep == 1 && <Present/>}
            {activeStep == 2 && <Develop/>}
            {activeStep == 3 && <Simulate/>}
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
