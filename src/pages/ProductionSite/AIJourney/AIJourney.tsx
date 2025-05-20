import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  MenuItem,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AI from "../../../assets/ai_studio.png";
import Nav from "../NavBar/Nav";
import RotatingImage from "../Sppiner/RotatingImage";
import { setTypeOfUser } from "../../../store/slice/documentsForGeneralConfigurationSlice";
import { setsServiceNameState } from "../../../store/slice/documentsForGeneralConfigurationSlice";
const AIJourney = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const actionEvent1 = async () => {
    await dispatch(setTypeOfUser("Customer"));
    navigate("/calltoactions");
    window.scrollTo(0, 0);
  };
  const [selected, setSelected] = useState("ABOUT"); // State to track the selected item

  const handleClick = (item: string) => {
    setSelected(item); // Update the selected item
    dispatch(setsServiceNameState(item));

    // Determine the path to navigate based on the item clicked
    let path = "/"; // Default path
    if (item === "PRIVACY") {
      path = "/privacy";
    } else if (item === "USECASES") {
      path = "/usecases";
    } else if (item === "BLOGS") {
      path = "/blogs";
    }
    // else if (item === "ADD BLOG") {
    //   path = "/AddBlog";
    // }

    // Navigate to the determined path
    navigate(path);

    // Scroll to the top of the page if "PRIVACY" is clicked
    if (item === "PRIVACY") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (item === "USECASES") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (item === "HOME") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // If on the ProductPage, scroll to the corresponding section
    if (path === "/" && item !== "HOME") {
      const clearT = setTimeout(() => {
        document.getElementById(item.toLowerCase())?.scrollIntoView({
          behavior: "smooth",
        });
        clearTimeout(clearT);
      }, 1);
    }
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const navItems = [
    {
      name: "HOME",
    },
    {
      name: "ABOUT",
    },
    {
      name: "USECASES",
    },
    {
      name: "BLOGS",
    },
    {
      name: "CONTACT",
    },
    {
      name: "FAQ",
    },
    {
      name: "PRIVACY",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        // minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "0 auto",
        margin: 0,
      }}
    >
      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexGrow: 1,
          mt: 1,
          p: 2,
          margin: "0 auto",
          minHeight: "50vh",
          width: "100%",
          maxWidth: "100% !important",
        }}
      >
        <Box
          sx={{
            display: {
              xs: "block",
              lg: "flex",
            },
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            gap: "2rem",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", lg: "50%" },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#800080",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: { xs: "2rem", lg: "5rem" },
              }}
            >
              SHAPING THE FUTURE
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mt: 1,
                fontSize: { xs: "1.5rem", lg: "3rem" },
              }}
            >
              WITH AI AGENTS THAT ACTUALLY <i>MAKE SENSE</i>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                opacity: 0.8,
                color: "#fff",
                fontSize: { xs: "1rem", lg: "2rem" },
              }}
            >
              Turn ideas into intelligent AI Agents that think, adapt, and
              execute—seamlessly with ByteSizedAI. The future isn’t just
              automated—it’s deterministic. Are you ready?
            </Typography>
            <Button
              variant="outlined"
              sx={{
                mt: 3,
                color: "#fff",
                borderColor: "#A020F0",
                borderRadius: "20px",
                padding: "10px 20px",
                transform: "uppercase",
                fontSize: { xs: "1rem", lg: "2rem" },
              }}
              onClick={actionEvent1}
            >
              CREATE AI THAT WORKS
            </Button>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", lg: "45%" },
              display: { xs: "flex", lg: "flex" },
              justifyContent: { xs: "center", lg: "flex-start" },
              flexFlow: "wrap",
              alignItems: "center",
              gap: "2rem",
              paddingTop: { xs: "50px", lg: 0 },
            }}
          >
            {navItems.map((item, index) => (
              <Typography
                onClick={(e: any) => {
                  e.preventDefault();
                  handleClick(item.name);
                }}
                sx={{
                  cursor: "pointer",
                  fontSize: {
                    xs: "1rem",
                    md: "1.2rem",
                    xl: "1.7rem",
                  },
                  ":hover": {
                    color: "#800080",
                  },
                }}
              >
                {item.name}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Image Section */}
      {/* <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <img src={AI} alt="AI Studio" style={{ maxWidth: "90%", height: "auto" }} />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <RotatingImage height="270" />
        </Box>
      </Box> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: 2,
          position: "relative",
        }}
      >
        <img
          src={AI}
          alt="AI Studio"
          style={{ maxWidth: "90%", height: "auto", position: "absolute" }}
        />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <RotatingImage height="270" />
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: 2,
          backgroundColor: "#000",
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "#A020F0", fontWeight: "bold" }}
        >
          ByteSizedAI
        </Typography>
        <Typography variant="body2">
          &copy; 2025. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AIJourney;
