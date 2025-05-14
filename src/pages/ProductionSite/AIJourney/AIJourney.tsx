import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AI from "../../../assets/ai_studio.png";
import Nav from "../NavBar/Nav";
import RotatingImage from "../Sppiner/RotatingImage";
import { setTypeOfUser } from "../../../store/slice/documentsForGeneralConfigurationSlice";


const AIJourney = () => {

  const dispatch = useDispatch();
  const navigate= useNavigate();
    const actionEvent1 = async ()  => {
      await dispatch(setTypeOfUser("Customer"));
      navigate("/calltoactions");
      window.scrollTo(0, 0);
    }
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
          minHeight:"50vh"
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ color: "#800080", fontWeight: "bold", textTransform: "uppercase", fontSize: "2.6rem" }}>
              SHAPING THE FUTURE
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1 }}>
              WITH  AI AGENTS THAT ACTUALLY <i>MAKE SENSE</i> 
             
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, opacity: 0.8 , color: "#fff"}}>
              Turn ideas into intelligent AI Agents that think, adapt, and execute—seamlessly with ByteSizedAI.
              The future isn’t just automated—it’s deterministic. Are you ready?
            </Typography>
            <Button
              variant="outlined"
              sx={{
                mt: 3,
                color: "#fff",
                borderColor: "#A020F0",
                borderRadius: "20px",
                padding: "10px 20px",
                transform:"uppercase",
              }}
              onClick={actionEvent1 }
            >
              CREATE AI THAT WORKS
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <AppBar
              position="static"
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                marginLeft: "10rem",
                marginBottom : "4rem",
              }}
            >
              <Toolbar sx={{ justifyContent: "flex-end", display: "flex" }}>
                <Nav color="white" />
              </Toolbar>
            </AppBar>
          </Grid>
        </Grid>
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
