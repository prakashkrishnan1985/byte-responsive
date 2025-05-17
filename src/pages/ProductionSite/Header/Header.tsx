import React, { useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import RotatingImage from "../Sppiner/RotatingImage";
import MagneticCircleButton from "../MagnetBtn/MagneticCircleButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import RotatingText from "./RotatingText";
import DecryptedText from "./DecryptedText";
import { setTypeOfUser } from "../../../store/slice/documentsForGeneralConfigurationSlice";
import TrueFocus from "./TrueFocus";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();

  // Use MUI's useTheme and useMediaQuery for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const actionEvent1 = async () => {
    await dispatch(setTypeOfUser("Customer"));
    navigate("/beta");
  };
  const actionEvent2 = async () => {
    await dispatch(setTypeOfUser("Developer"));
    navigate("/calltoactions");
  };
  return (
    <>
      <Box
        sx={{
          height: {
            xs: "auto",
          },
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
          pb: { xs: 2, sm: 0 },
          paddingX: { xs: 0, md: 6 },
          marginTop: "8rem",
        }}
      >
        <Typography
          variant={isMobile ? "h4" : "h2"}
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row", // Stack vertically on mobile
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            font: "Mulish",
            fontWeight: "bold",
            paddingBottom: { xs: "1rem", sm: "3rem" },
            marginBottom: isMobile ? "10px" : "5px",
            fontSize: isMobile ? "2rem" : "4.75rem",
            textAlign: "center",
            px: { xs: 2, sm: 0 },
            gap: isMobile ? "0.5rem" : 0, // Add spacing for stacked items
          }}
        >
          {isMobile ? (
            <Box component="span" sx={{ fontSize: "5rem" }}>
              AI CURATED
            </Box>
          ) : (
            <Box component="span">AI CURATED&nbsp;</Box>
          )}
          <Box component="span">
            <TrueFocus
              sentence="BY&nbsp;YOU FOR&nbsp;YOU"
              manualMode={false}
              blurAmount={5}
              borderColor="purple"
              animationDuration={2}
              pauseBetweenAnimations={1}
            />
          </Box>
        </Typography>

        <Typography
          sx={{
            fontSize: isMobile ? "1.5rem" : "2.5rem",
            fontWeight: "bold",
            textAlign: isMobile ? "center" : "right",
            px: { xs: 2, sm: 0 },
            mb: { xs: 2, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: isMobile ? "center" : "flex-end",
              gap: "0.5rem",
              flexWrap: "wrap",
              color: "#000",
            }}
          >
            <span>Build AI Agents</span>

            <RotatingText
              texts={[" in minutes", " zero code", " on prem", " on cloud"]}
              mainClassName="flex justify-center items-center px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 rounded-lg text-center w-full"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </Box>
        </Typography>
        <Typography
          variant="h1"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            textAlign: "center",
            color: "#F5F1F9",
            fontSize: { xs: "4rem", sm: "6rem", md: "12rem", lg: "14rem" },
            fontWeight: "bold",
            zIndex: -1,
            letterSpacing: { xs: "5px", sm: "10px" },
            whiteSpace: "nowrap",
          }}
        >
          AI STUDIO
        </Typography>
      </Box>
      <Box
        sx={{
          width: "auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          paddingX: "20px",
          paddingTop: { xs: 6, sm: 8, md: 10, lg: 24 },
          gap: { xs: 4, sm: 0 },
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: isMobile ? "100%" : "30%",
            textAlign: isMobile ? "center" : "left",
            marginLeft: isMobile ? "0" : "30px",
            marginTop: isMobile ? "0" : "-11rem",
            padding: isMobile ? "10px" : "0",
          }}
        >
          <Typography
            variant="h6"
            style={{
              marginBottom: "10px",
              fontSize: isMobile ? "1.5rem" : "2.5rem",
            }}
          >
            You’ve Seen AI Work{" "}
            <span style={{ color: "purple" }}>—Now Make AI Agents</span> Work
            for You
          </Typography>
          <Typography
            style={{
              marginBottom: "10px",
              fontSize: isMobile ? "1.5rem" : "2rem",
            }}
          >
            AI Agents use AI to automate tasks, make decisions, and improve your
            product stack. With ByteSized AI Studio, drag and drop pre-trained
            models to create, adapt, and deploy tailored agents for your unique
            business needs.
          </Typography>
          <Typography
            style={{
              marginBottom: "40px",
              fontSize: isMobile ? "1.5rem" : "2rem",
            }}
          >
            Forget one-size-fits-all solutions; these agents work the way you
            do, empowering your vision. Let’s build smarter, together!
          </Typography>
        </Box>

        <Box
          sx={{
            width: isMobile ? "100%" : "60%",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "flex-end",
            alignItems: isMobile ? "center" : "flex-end",
            gap: isMobile ? "10px" : "0",
            padding: isMobile ? "10px" : "0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "row" : "row",
              gap: isMobile ? "10px" : "0",
            }}
          >
            <MagneticCircleButton
              size={isMobile ? 120 : 320}
              name="Apply for Beta"
              defaultColor="#800080"
              actionEvent={actionEvent1}
              isMob={isMobile}
            />
            <MagneticCircleButton
              size={isMobile ? 80 : 200}
              name="Interested as AI Dev"
              defaultColor="#000000"
              actionEvent={actionEvent2}
              isMob={isMobile}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Header;
