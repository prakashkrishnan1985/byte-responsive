import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Search from "./Search";

export default function Header() {
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
      <Typography component="h2" variant="h6" sx={{ mb: 2, color: "#377610" }}>
        Welcome back Mathew!
      </Typography>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Search />
      </Stack>
    </Stack>
  );
}
