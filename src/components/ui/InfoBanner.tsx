import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Search from "./Search";
import PresentRoundedIcon from "@mui/icons-material/OndemandVideo";

export default function InfoBanner() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      <PresentRoundedIcon />
      <Typography component="h2" variant="h6" sx={{ mb: 2, color: "#377610" }}>
        It's sunny day
      </Typography>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Search />
      </Stack>
    </Stack>
  );
}
