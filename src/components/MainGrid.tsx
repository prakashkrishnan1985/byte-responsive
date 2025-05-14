import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Copyright from "./ui/Copyright";
import { useLocation } from "react-router-dom";
import CardDashBoard from "../pages/CardDashBoard";
import HorizontalNonLinearStepper from "./stepper/HorizontalNonLinearStepper";
import { FlowDataProvider, useDataFlow } from "../providers/FlowDataProvider";
import { ReactFlowProvider } from "@xyflow/react";
import { DnDProvider } from "../providers/DnDContext";

export default function MainGrid({ yourToolsJson, setYourTools, aiToolsJson }: any) {
  const location = useLocation();
  const { pathname } = location;
  const { conceptId} = useDataFlow();
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "100%" } }}>
      <Grid
        container
        spacing={2}
        columns={10}
        sx={{ mb: (theme) => theme.spacing(2), flexDirection:'column'}}
      >
        {pathname === `/Conceptualize/${conceptId}` && 
                <DnDProvider><ReactFlowProvider><HorizontalNonLinearStepper aiToolsJson={aiToolsJson} yourToolsJson={yourToolsJson} setYourTools={setYourTools}></HorizontalNonLinearStepper></ReactFlowProvider></DnDProvider>
        }
        {(pathname === "/Dashboard" || pathname === "/") && (
          <CardDashBoard aiToolsJson={aiToolsJson} ></CardDashBoard>
        )}
      </Grid>
      <Copyright className="copyright" />
    </Box>
  );
}