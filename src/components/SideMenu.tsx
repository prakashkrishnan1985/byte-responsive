import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import OptionsMenu from "./ui/OptionsMenu";
import { useNavigate } from "react-router-dom";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Logo from "../assets/SideBarLogo.svg";

const drawerWidth = 85;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  const navigate = useNavigate();
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "black",
          color:'white'
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 2.5,
        }}
      >
        <Box
          component="img"
          src={Logo}
          alt="Description of the image"
          sx={{
            maxWidth: 345,
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></Box>
      </Box>
      <Box component="div" mt={"100px"}>
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 3,
          gap: 1,
          alignItems: "center",
          position: "fixed",
          bottom: "0",
        }}
      >
        <LogoutRoundedIcon
          fontSize="small"
          onClick={() => navigate(`/Profile`)}
          style={{ cursor: "pointer" }}
        />
        {/* <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            Mathew Perry
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            perry@email.com
          </Typography>
        </Box> */}
        {/* <OptionsMenu /> */}
      </Stack>
    </Drawer>
  );
}
