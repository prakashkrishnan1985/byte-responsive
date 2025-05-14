import React, { useState, useEffect } from "react";
import IMG from "../../../assets/bg-blur_1.svg";
import IMG1 from "../../../assets/bg-blur.png";
import IMG3 from "../../../assets/noaicodeneeded.png";
import TwoTabComponent from "./tab";
import RotatingImage from "../Sppiner/RotatingImage";
import "./personas.css";
import { Box, Grid, useMediaQuery } from "@mui/material";
import theme from "../../../components/theme/theme";

const MovingBackground: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prevAngle) => (prevAngle + 1) % 360);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box id="parsonas">
      <Box sx={{ width: "689px" }}>
        <Box>
          <Box
            className="section-PERSONAS"
            sx={{
              marginTop: { xs: "0rem", md: "4rem" },
              padding: { xs: "0px 0px 0px 25px", md: "42px 0px 0px 32px" },
            }}
          >
            PERSONAS
          </Box>
          <Box
            id="All"
            sx={{
              display: "flex",
              position: "absolute",
              padding: { xs: "0", md: "20px 10px" },
              margin: { xs: "0", md: "0rem 20px" },
              zIndex: 2,
            }}
          >
            <Grid
              container
              spacing={3}
              sx={{ width: "100%", paddingLeft: { xs: "24px", sm: "0px" } }}
            >
              <Grid item xs={12} md={6} lg={6}>
                <Box id="right" sx={{ width: "100%" }}>
                  <div className="title2">
                    <span style={{ fontWeight: "600" }}>
                      BUILD AI YOUR WAY{" "}
                    </span>{" "}
                    <i>Your Infra or Cloud. ByteSized Agents Works Anywhere.</i>
                  </div>
                  <div className="fullText">
                    ByteSizedAI gives you the power to create and deploy
                    AI-driven solutions wherever you need them — whether your
                    agents are running on-premises, in the cloud, or seamlessly
                    transitioning between both. From innovative brainstorming to
                    robust deployment, ByteSizedAI adapts to your needs, helping
                    you unlock new possibilities without limitations.
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <RotatingImage height="290" />
                  </div>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                lg={6}
                sx={{
                  width: { xs: "100vw", md: "auto" },
                  padding: 0,
                  margin: 0,
                  maxWidth:{xs:"93vw !important", md:"auto"},
                  // paddingLeft: {xs:"0px !important", sm:'auto'},
                  // paddingRight: "-24px !important",
                }}
                spacing={0}
              >
                <Box
                  id="left"
                  sx={{
                    width: { sm: "100%", md: "100%", padding: 0, margin: 0 },
                  }}
                >
                  <div
                    style={{
                      background: "#0000001A",
                      padding: isMobile ? "0px 0px 30px 0px" : "30px",
                      borderRadius: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        background: "#FFFFFF33",
                        paddingRight: { xs: "0px", sm: "0" },
                      }}
                    >
                      <TwoTabComponent />
                    </Box>
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      {/* Background image section */}
      <Box
        sx={{
          width: "100vw",
          height: { xs: "90vh", sm: "90vh" },
          position: { xs: "fixed", sm: "relative" }, // fixed only on mobile
          top: 0,
          left: 0,
          backgroundImage: `url(${IMG1})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "blur(1rem)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${IMG})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            transform: `rotate(${angle}deg)`,
            transition: "transform 3.6s ease-out",
            opacity: 0.2,
          }}
        />
      </Box>

      {/* Spacer for mobile to offset fixed background */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          height: { xs: "75vh", sm: "90vh", md: "90vh" },
        }}
      />

      {/* Next content (noaicodeneeded image) */}
      <Box
        sx={{
          position: "relative",
          bottom: {xs:"150px", sm:"150px", md:"150px", lg:"120px", xl:"280px"},
          width: {xs:"100%", sm:"80%", md:"80%", lg:"80%", xl:"80%"},
          
          padding: {xs:"10px", sm:"0 100px", md:"0 100px", lg:"0 130px", xl:"0 280px"},
          margin: "20px",
        }}
      >
        <img src={IMG3} width="100%" />
      </Box>
    </Box>
  );
};

export default MovingBackground;
