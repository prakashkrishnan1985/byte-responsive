// @ts-nocheck
import React, { useState } from "react";
import { useDnD } from "../../providers/DnDContext";
import { Background } from "@xyflow/react";
import {
  Button,
  Box,
  TextField,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import PresentRoundedIcon from "@mui/icons-material/OndemandVideo";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import ExpandMore from "./ExpandMore";
import SustainabilityPresentation from "../ui/SustainabilityPresentation";
import { useDataFlow } from "../../providers/FlowDataProvider";
import { PostUserApps } from "../../services/conceptService";


export default ({
  cardData,
  setCardData,
  title,
  isButtonVisible = false,
  setNodeColor,
  setExpanded,
  expanded,
  getUserAppDataFn,
}) => {
  const {setType, setNodeData, setAllNodeData, allNodeData} = useDnD();
  const [open, setOpen] = useState<boolean>(false);
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [titleInput, setTitleInput] = useState<string>("");

  const { conceptId } = useDataFlow();


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onDragStart = (event, nodeType, color, sustainable, item) => {
    setType(nodeType);
    item["source"] = allNodeData.length;
    setNodeData(item);
    setAllNodeData([...allNodeData, item])
    event.dataTransfer.effectAllowed = "move";
    if (sustainable) {
      event.dataTransfer.setData("sustainable", sustainable);
    }
    setNodeColor(color);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = async () => {
    const payload = {
      concept_id: conceptId,
      title: titleInput,
      description: descriptionValue,
    };
    try {
      const response = await PostUserApps(payload);
      const newNode = {
        title: titleInput,
        desc: descriptionValue,
        appName: "Voice to Text",
        color: "#FFF2EC",
        icon: <PresentRoundedIcon />,
        sustainable: "34%",
      };
      const newAiToolJson = [...cardData, newNode];
      setCardData(newAiToolJson);
      getUserAppDataFn();
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  };

  const onAiToolCreateBtnClick = () => {
    handleClickOpen();
  };

  return (
    <div className="sidebar" style={{ color: "black" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "white",
          borderBottom: "1px solid white"
        }}
      >
        <div className="toolbox-title">{title}</div>
        <div className="toolbox-description">
         Ai Agents
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{ style: { backgroundColor: "black", padding: "10px" } }}
        >
          <DialogTitle sx={{ color: "white" }}>
            Describe your application
          </DialogTitle>
          <DialogContent>
            <p style={{ color: "white" }}>Let us know about the main purpose</p>
            <TextField
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              label="Title"
              variant="outlined"
              fullWidth
              sx={{
                marginBottom: "16px",
                input: {
                  color: "white",
                },
                fieldset: {
                  borderColor: "white",
                },
                "& .MuiOutlinedInput-root": {
                  color: "white",
                },
              }}
            />
            <TextField
              value={descriptionValue}
              onChange={(e) => setDescriptionValue(e.target.value)}
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              sx={{
                input: {
                  color: "white",
                },
                fieldset: {
                  borderColor: "white",
                },
                "& .MuiOutlinedInput-root": {
                  color: "white",
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{
                backgroundColor: "green",
                "&:hover": {
                  backgroundColor: "darkgreen",
                },
              }}
              fullWidth
            >
              Next
            </Button>
          </DialogActions>
        </Dialog>
        <Box
          ml={8}
          mt={1}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          {isButtonVisible && (
            <Button
              variant="contained"
              size="small"
              onClick={onAiToolCreateBtnClick}
              sx={{ background: "#377610" }}
            >
              New App
            </Button>
          )}
        </Box>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          color="white"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </div>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <aside>
          {cardData?.map((item, index) => (
            <div
              className="dndnode"
              onDragStart={(event) =>
                onDragStart(event, item.type, "#ffffff", "34%", item)
              }
              draggable
              style={{ backgroundColor: item.color, borderColor: item.color }}
            >
              <div style={{ display: "flex", gap: "90px" }}>
                <div className="icon">{item.icon}</div>
                <div
                  style={{ position: "relative", bottom: "7px", left: "4px" }}
                >
                  <SustainabilityPresentation
                    sustainabilityPercentage={item?.sustainable}
                  />
                </div>
              </div>
              <div className="title">{item.name}</div>
              {/* <div className="description">{item.description}</div> */}
            </div>
          ))}
        </aside>
      </Collapse>
    </div>
  );
};
