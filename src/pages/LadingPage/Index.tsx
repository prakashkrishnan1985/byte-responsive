import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Icon,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { Home, AccessAlarm, Info } from "@mui/icons-material";
import ByteIcon from "../ExpressionOfInterest/ByteIcon";
import Logo from "../../assets/logo.svg";
import ChatInput from "../../components/ui/ChatInput";
import Chat from "../../components/chatArea/Index";
import { useNavigate } from "react-router-dom";
import { PostConcept, withChat } from "../../services/conceptService";
import { useDataFlow } from "../../providers/FlowDataProvider";
import backgroundImage from "../../assets/byteSize-bglogo.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { fetchAuthSession } from "aws-amplify/auth";
import { useMyContext } from "../../providers/MyContext";
import storageUtil from "../../utils/localStorageUtil";
import { toast } from "react-toastify";
import { useOrchestration } from "../../providers/OrchestrationProvider";

const LandingPage: React.FC = () => {
  const [showChatInput, setShowChatInput] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);

  const navigate = useNavigate();

  const theme = useTheme();
  // Mobile: "sm"
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Tablet: "sm" to "md"
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  // Laptop: "md" to "lg"
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const { setConceptId, conceptId } = useDataFlow();
  const {  conceptData, createConcept } =
    useOrchestration();

  const handleNeedHelp = async () => {
    createConcept("Concept1", "testing concept description");
    setShowChatInput(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseEnter1 = () => {
    setIsHovered1(true);
  };

  const handleMouseLeave1 = () => {
    setIsHovered1(false);
  };

  const handleICanDoIt = () => {
    setShowChatInput(false);
  };

  const handleNewUser = () => {
    setShowChatInput(true);
  };

  const { messages, setMessages } = useMyContext();

  return (
    <Box
      style={{
        background: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 1,
        background: "white",
        color: "black",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={Logo}
        alt="Logo"
        sx={{
          width: { xs: "209px", sm: "200px", md: "250px" },
          height: { xs: "49px", sm: "55px", md: "35px" },
          background: "transparent",
        }}
      />
      <Box
        className="text-center"
        sx={{
          paddingBottom: { xs: "10px", md: "25px" },
          display: "flex",
          justifyContent: "center",
          width: "70%",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          textAlign="center"
          pt={6}
          style={{ color: "white" }}
        >
          Bring{" "}
          <span style={{ color: "white", fontWeight: "bold" }}>
            Your AI Vision
          </span>{" "}
          to life with ByteSizedAI! Tailored for
          <span style={{ color: "white", fontWeight: "bold" }}>
            {" "}
            your business needs!
          </span>
        </Typography>
      </Box>
      <Box
        className="text-center"
        sx={{ paddingTop: { xs: "10px", md: "0px" } }}
      >
        <ByteIcon size={40} />
        <Typography
          variant="h4"
          style={{ color: "white" }}
          sx={{
            display: "inline",
            fontSize: { xs: "10px", sm: "22px" },
            paddingLeft: { xs: "1px", sm: "10px", md: "10px" },
            textAlign: "center",
            width: { xs: "329px", md: "100%" },
            marginTop: { xs: "10px", sm: "0" },
          }}
        >
          Select the option that's right for you!
        </Typography>
      </Box>

      <Grid
        container
        spacing={4}
        ml={3}
        style={{ paddingTop: "40px" }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={4}>
          <Paper
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{ padding: 3 }}
            style={{
              backgroundColor: isHovered
                ? "rgba(11, 29, 19, 0.9)"
                : "rgba(52, 52, 52, 0.8)",
              border: "1px solid white",
              borderRadius: "16px",
              cursor: "pointer",
              justifyContent: "center",
              textAlign: "center",
              height: "200px",
              width: "370px",
            }}
            onClick={handleNewUser}
          >
            <Button variant="contained" color="success">
              {" "}
              Beginner level
            </Button>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              justifyContent="center"
            >
              {/* <Icon sx={{ color: 'white' }}>
                <Home />
              </Icon> */}
              <Typography
                variant="h4"
                style={{ color: "white", fontWeight: "bold" }}
                sx={{ padding: 2 }}
              >
                Just starting out?
              </Typography>
            </Stack>
            <Typography variant="body2" paragraph style={{ color: "white" }}>
              No worries! Get step-by-step support from Byte to build your AI
              system with confidence
            </Typography>
            <Link
              href="#"
              sx={{
                color: "white",
                textDecoration: "underline",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Start Now <ArrowForwardIcon />
            </Link>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            onMouseEnter={handleMouseEnter1}
            onMouseLeave={handleMouseLeave1}
            sx={{ padding: 3 }}
            style={{
              backgroundColor: isHovered1
                ? "rgba(11, 29, 19, 0.9)"
                : "rgba(52, 52, 52, 0.8)",
              border: "1px solid white",
              borderRadius: "16px",
              cursor: "pointer",
              justifyContent: "center",
              textAlign: "center",
              height: "200px",
              width: "370px",
            }}
            onClick={handleNeedHelp}
          >
            <Button variant="contained" color="success">
              {" "}
              Intermediate level
            </Button>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              justifyContent="center"
            >
              <Typography
                variant="h4"
                style={{ color: "lightgray", fontWeight: "bold" }}
                sx={{ padding: 2 }}
              >
                Need a helping hand?
              </Typography>
            </Stack>
            <Typography variant="body2" paragraph style={{ color: "white" }}>
              Let Byte create a tailored workflow to turn your idea into a clear
              plan with expert solution.
            </Typography>
            <Link
              href="#"
              sx={{
                color: "white",
                textDecoration: "underline",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Start Now
              <ArrowForwardIcon />
            </Link>
          </Paper>
        </Grid>
      </Grid>

      <Box
        className="text-center"
        sx={{ paddingTop: { xs: "10px", md: "25px" } }}
      >
        {" "}
        <Typography
          variant="h4"
          style={{ color: "white" }}
          sx={{
            display: "inline",
            fontSize: { xs: "10px", sm: "22px" },
            paddingLeft: { xs: "1px", sm: "10px", md: "10px" },
            textAlign: "center",
            width: { xs: "329px", md: "100%" },
            marginTop: { xs: "10px", sm: "0" },
          }}
        >
          Write your concept.
        </Typography>
      </Box>
      <Box
        className="text-right"
        sx={{
          paddingBottom: { xs: "10px", md: "25px" },
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          style={{ color: "white" }}
          sx={{
            display: "inline",
            fontSize: { xs: "10px", sm: "22px" },
            paddingLeft: { xs: "1px", sm: "10px", md: "10px" },
            textAlign: "right",
            width: { xs: "329px", md: "100%" },
            marginTop: { xs: "10px", sm: "0" },
          }}
        >
          <Link
            href="#"
            sx={{
              color: "white",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {" "}
            Skip & Create
            <ArrowForwardIcon />
          </Link>
        </Typography>
      </Box>
      <Grid item xs={12} sm={4}>
        {showChatInput && (
          <Box
            sx={{ padding: 1, mt: -4 }}
            style={{
              backgroundColor: "rgba(52, 52, 52)",
              border: "1px solid white",
              borderRadius: "16px",
              cursor: "pointer",
              width: "820px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ChatInput
              width="909px"
              inputText={inputText}
              setInputText={setInputText}
              setMessages={setMessages}
            />
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default LandingPage;
