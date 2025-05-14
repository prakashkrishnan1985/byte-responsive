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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
          height: { xs: "auto", sm: "300px", md: "480px", lg:'480px', xl:'480px' },
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
          pt: { xs: 0, sm: 0 },
          pb: { xs: 2, sm: 0 },
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
          {isMobile? <Box component="span" sx={{fontSize:'5rem'}}>AI CURATED</Box> : <Box component="span">AI CURATED&nbsp;</Box>}
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
            // position: isMobile ? "static" : "absolute", // Remove position for mobile
            // top: isMobile ? "auto" : "50%", // Adjust top for mobile
            // left: isMobile ? "auto" : "80%", // Adjust left for mobile
            // transform: isMobile ? "none" : "translate(-50%, -50%)", // Remove transform for mobile
            // width: "300px",
            // textAlign: "right",
            // color: "#800080",
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
              flexWrap: "wrap",
              color: "#000",
            }}
          >
            <span style={{paddingBottom: isMobile?'10px':'0px'}}>Build AI Agents&nbsp;&nbsp;</span>
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
          <div
            style={{
              marginTop: "0.4rem",
              fontSize: "0.9rem",
              fontWeight: "400",
              textAlign: "center",
              color: "#000",
            }}
          >
            {/* <DecryptedText
              text="Your products, your agents. Your AI"
              animateOn="view"
              revealDirection="center"
              speed={100}
            /> */}
          </div>
        </Typography>
        {/* Adjust image size for mobile */}
        {/* <Typography
          variant={isMobile ? "h4" : "h2"} // Adjust typography for mobile
          sx={{
            color: "black",
            font: "Mulish",
            size: isMobile ? "2rem" : "3.35rem", // Adjust font size for mobile
            marginTop: isMobile ? "15px" : "0px", // Adjust margin for mobile
          }}
        >
          <b>FOR YOU</b>
        </Typography> */}
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
            fontSize: { xs: "4rem", sm: "8rem", md: "14rem" },
            fontWeight: "bold",
            zIndex: -1,
            letterSpacing: { xs: "5px", sm: "10px" },
            whiteSpace: "nowrap",
          }}
        >
          AI STUDIO
        </Typography>
        {/* <Typography
          variant="h1"
          sx={{
            position: isMobile ? "static" : "absolute", // Remove position for mobile
            top: isMobile ? "auto" : "50%", // Adjust top for mobile
            left: isMobile ? "auto" : "50%", // Adjust left for mobile
            transform: isMobile ? "none" : "translate(-50%, -50%)", // Remove transform for mobile
            width: "100%",
            textAlign: "center",
            color: "#F5F1F9",
            fontSize: isMobile ? "4rem" : "14rem", // Adjust font size for mobile
            fontWeight: "bold",
            zIndex: isMobile ? "auto" : -1, // Adjust zIndex for mobile
            letterSpacing: isMobile ? "5px" : "10px", // Adjust letter spacing for mobile
          }}
        >
          AI STUDIO
        </Typography> */}
        <Typography
          sx={{
            position: isMobile ? "static" : "absolute",
            top: isMobile ? "auto" : "50%",
            left: isMobile ? "auto" : "80%",
            transform: isMobile ? "none" : "translate(-50%, -50%)",
            width: "300px",
            textAlign: "right",
            color: "#800080",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          {/* <Box
            sx={{ display: "flex", justifyContent: "flex-end", color: "#000" }}
          >
            <span>Build AI Agents&nbsp;</span>
            <RotatingText
              texts={[" in minutes", " zero code", " on prem", " on cloud"]}
              mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </Box> */}
          {/* <div
            style={{
              marginTop: "0.4rem",
              fontSize: "0.9rem",
              fontWeight: "400",
              textAlign: "center",
              color: "#000",
            }}
          >
            <DecryptedText
              text="Your products, your agents. Your AI"
              animateOn="view"
              revealDirection="center"
              speed={100}
            />
          </div> */}
        </Typography>
      </Box>
      <Box
        sx={{
          width: "auto",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          padding: { xs: 2, sm: 0 },
          gap: { xs: 4, sm: 0 },
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
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
            You’ve Seen AI Work{" "}
            <span style={{ color: "purple" }}>—Now Make AI Agents</span> Work
            for You
          </Typography>
          <Typography style={{ marginBottom: "10px" }}>
            AI Agents use AI to automate tasks, make decisions, and improve your
            product stack. With ByteSized AI Studio, drag and drop pre-trained
            models to create, adapt, and deploy tailored agents for your unique
            business needs.
          </Typography>
          <Typography style={{ marginBottom: "40px" }}>
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
              size={isMobile ? 100 : 160}
              name="Apply for Beta"
              defaultColor="#800080"
              actionEvent={actionEvent1}
              isMob={isMobile}
            />
            <MagneticCircleButton
              size={isMobile ? 80 : 125}
              name="INTERESTED AS AI DEV"
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
