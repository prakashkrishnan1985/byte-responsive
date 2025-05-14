import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import ConceptualizeIcon from "@mui/icons-material/GridViewRounded";
import PresentRoundedIcon from "@mui/icons-material/OndemandVideo";
import DevelopIcon from "@mui/icons-material/DynamicFeed";
import RepeatIcon from "@mui/icons-material/Repeat";
import DeployIcon from "@mui/icons-material/PublishOutlined";
import MonitorIcon from "@mui/icons-material/Monitor";
import { useNavigate } from 'react-router-dom';

const mainListItems = [
  { text: "Dashboard", icon: <ConceptualizeIcon /> },
  { text: "Evangelize", icon: <PresentRoundedIcon /> },
  { text: "Develop", icon: <DevelopIcon /> },
  { text: "Monitor", icon: <MonitorIcon /> },
];

export default function MenuContent() {
  const navigate = useNavigate();
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block", py:2 }}>
            <ListItemButton onClick={() => navigate(`/${item.text}`)} selected={index === 0}>
              <ListItemIcon sx={{color:'white'}}>{item.icon}</ListItemIcon>
              {/* <ListItemText primary={item.text} /> */}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
