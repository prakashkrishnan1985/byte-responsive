import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MainGrid from "../components/MainGrid";
import AppTheme from "../components/theme/AppTheme";
import Header from "../components/ui/Header";
import Grid from "@mui/material/Grid2";
import DevelopIcon from "@mui/icons-material/DynamicFeed";
import { useLocation, useNavigate } from "react-router-dom";
import SideMenu from "../components/SideMenu";
const aiToolsJson = [
  {
    title: "Sentiment Analysis",
    desc: "Neque porro quisquam est quiatese dolorem ipsum quia dolor sitr amet",
    appName: "Sentiment Analysis",
    color: "#EDFFEF",
    icon: <DevelopIcon />,
  },
  {
    title: "Sentiment Analysis",
    desc: "Neque porro quisquam est quiatese dolorem ipsum quia dolor sitr amet",
    appName: "Sentiment Analysis",
    color: "#FFF2EC",
    icon: <DevelopIcon />,
    sustainable: 5,
  },
  {
    title: "Sentiment Analysis",
    desc: "Neque porro quisquam est quiatese dolorem ipsum quia dolor sitr amet",
    appName: "Sentiment Analysis",
    color: "#F4F2FF",
    icon: <DevelopIcon />,
    sustainable: 24,
  },
];

const yourToolsJson = [
  {
    title: "New App",
    desc: "Neque porro quisquam est quiatese dolorem ipsum quia dolor sitr amet",
    appName: "Sentiment Analysis",
    color: "#F4F2FF",
    icon: <DevelopIcon />,
  },
];

export default function Dashboard(props:any) {

  const [yourTools, setYourTools] = useState(yourToolsJson);
  const location = useLocation();
  console.log('location+++', location);
  const navigate = useNavigate();

  const { pathname } = location;
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", width:'100%' }}>
        <SideMenu />
          {/* <Grid> */}
            {/* <Box
              component="main"
              sx={(theme) => ({
                flexGrow: 1,
                // backgroundColor: theme.vars
                //   ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                //   : alpha(theme.palette.background.default, 1),
                // overflow: "hidden",
              })}
            > */}
              <Box mt={0} sx={{width:"100vw"}}>
                {(pathname === "/Dashboard" || pathname === "/") &&
                <Header />}
                <MainGrid yourToolsJson={yourTools} setYourTools={setYourTools} aiToolsJson={aiToolsJson} />
              </Box>
            {/* </Box> */}
        {/* </Grid> */}
      </Box>
    </AppTheme>
  );
}
