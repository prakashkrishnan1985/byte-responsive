import { Box, Button, Grid, Typography } from "@mui/material";
import ConceptualizeIcon from "@mui/icons-material/GridViewRounded";
import PresentRoundedIcon from "@mui/icons-material/OndemandVideo";

export default function RightGrid({ aiToolsJson, setAiTools }: any) {
  const onAiToolCreateBtnClick = () => {
    const newNode = {
      title: "Generetive AI",
      desc: "Neque porro quisquam est quiatese dolorem ipsum quia dolor sitr amet",
      appName:"Your App",
      color: "#EDFFEF",
      icon: <ConceptualizeIcon />,
    };
    const newAiToolJson = [...aiToolsJson, newNode];
    setAiTools(newAiToolJson);
  };

  const onAiConceptCreateBtnClick = () => {
    const newNode = {
      title: "Voice To Text",
      desc: "Neque porro quisquam est quiatese dolorem ipsum quia dolor sitr amet",
      appName:"Voice to Text",
      color: "#FFF2EC",
      icon: <PresentRoundedIcon />,
    };
    const newAiToolJson = [...aiToolsJson, newNode];
    setAiTools(newAiToolJson);
  };

  return (
    <Grid
      container
      spacing={2}
      columns={4}
      sx={{ mt: (theme) => theme.spacing(0) }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: {
            sm: "100%",
            md: "1700px",
            height: "100vh",
            borderLeft: "1px solid var(--template-palette-divider)",
            overflow: "auto",
          },
        }}
      >
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Test Log section
        </Typography>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Details
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "30%",
            padding: "30px",
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={onAiToolCreateBtnClick}
            sx={{padding:"16px", background:"#377610"}}
          >
            Create New App
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={onAiConceptCreateBtnClick}
            sx={{padding:"16px", background:"#377610"}}
          >
            Create New AI Concept
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}
