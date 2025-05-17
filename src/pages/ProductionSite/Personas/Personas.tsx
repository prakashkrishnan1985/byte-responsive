import React, { useState, useEffect } from "react";
import IMG from "../../../assets/bg-blur_1.svg";
import IMG1 from "../../../assets/bg-blur.png";
import IMG3 from "../../../assets/noaicodeneeded.png";
import TwoTabComponent from "./tab";
import RotatingImage from "../Sppiner/RotatingImage";
import "./personas.css";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
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
    <Box
      id="parsonas"
      sx={{
        position: "relative",
      }}
    >
      <Box>
        <Box sx={{ position: "relative" }}>
          <Typography
            sx={{
              marginTop: { xs: "0rem", md: "4rem" },
              color: "#800080",
              fontSize: { xs: "2rem", lg: "3rem" },
              fontWeight: "500",
              textAlign: {
                xs: "center",
                md: "left",
              },
              paddingX: "20px",
            }}
          >
            PERSONAS
          </Typography>
          <Box
            id="All"
            sx={{
              display: "flex",
              position: "relative",
              padding: { xs: "0" },
              zIndex: 2,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              spacing={3}
              sx={{
                width: "100%",
                margin: "0 !important",
              }}
            >
              <Grid
                item
                xs={12}
                md={6}
                lg={6}
                sx={{
                  padding: "0 !important",
                }}
              >
                <Box
                  id="right"
                  sx={{
                    width: "100%",
                    paddingX: "20px",
                  }}
                >
                  <Typography
                    sx={{
                      paddingY: "5px",
                      fontSize: { xs: "1.5rem", lg: "3rem" },
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                      }}
                    >
                      BUILD AI YOUR WAY{" "}
                    </span>{" "}
                    <i>Your Infra or Cloud. ByteSized Agents Works Anywhere.</i>
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "1.5rem", lg: "2.5rem" },
                      paddingTop: "20px",
                    }}
                  >
                    ByteSizedAI gives you the power to create and deploy
                    AI-driven solutions wherever you need them — whether your
                    agents are running on-premises, in the cloud, or seamlessly
                    transitioning between both. From innovative brainstorming to
                    robust deployment, ByteSizedAI adapts to your needs, helping
                    you unlock new possibilities without limitations.
                  </Typography>
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
                spacing={0}
                sx={{
                  padding: {
                    xs: "20px 0 !important",
                    sm: "20px 20px !important",
                  },
                  margin: "0 !important",
                }}
              >
                <div
                  style={{
                    background: "#0000001A",
                    borderRadius: "10px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    padding: "20px",
                    overflow: "hidden",
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
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      {/* Background image section */}
      <Box
        sx={{
          height: { xs: "90vh", sm: "90vh" },
          position: { xs: "fixed", sm: "absolute" }, // fixed only on mobile
          top: 0,
          left: 0,
          backgroundImage: `url(${IMG1})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "blur(1rem)",
          zIndex: -1,
          pointerEvents: "none",
          width: "100%",
          overflow: "hidden",
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
      {/* Next content (noaicodeneeded image) */}
      <Box
        sx={{
          position: {
            xs: "relative",
            width: "100%",
          },
          top: {
            xs: "150px",
          },
          padding: "20px",
          display: {
            xs: "none",
            lg: "block",
          },
        }}
      >
        <img src={IMG3} width="100%" />
      </Box>
    </Box>
  );
};

export default MovingBackground;
