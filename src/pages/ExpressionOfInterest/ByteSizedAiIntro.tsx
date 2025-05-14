import React, { useEffect, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Logo from "../../assets/logo.svg";
import TypeWriterEffect from "./TypeWriterEffect";

const ByteSizedAiIntro: React.FC = () => {
  const [showLogo, setShowLogo] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [strikeOutDelay, setStrikeOutDelay] = useState(false);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Tablet: "sm" to "md"
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  // Laptop: "md" to "lg"
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "lg"));

  useEffect(() => {
    const logoTimeoutWhatIf = setTimeout(() => {
      setShowWhatIf(true);
    }, 6000);

    const logoTimeout = setTimeout(() => {
      setShowLogo(true);
    }, 10000);

    const strikeTimeout = setTimeout(() => {
      setStrikeOutDelay(true);
    }, 12000);

    const messageTimeout = setTimeout(() => {
      setShowMessage(true);
    }, 14000);

    return () => {
      clearTimeout(logoTimeout);
      clearTimeout(messageTimeout);
      clearTimeout(logoTimeoutWhatIf);
      clearTimeout(strikeTimeout);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80%",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "inline-block",
            width: { xs: "21.5rem", sm: "46rem", md: "62.5rem", lg: "76.9rem", xl:'85.5rem' },
            padding:"0px 10px",
          }}
        >
              <TypeWriterEffect
                text="What if... enabling AI into your product stack is as easy as a
                few drag-and-drops ?"
                speed={50}
                customFontsize={isMobile ? "27px" : "40px"}
                isStrikeOutVisible={showLogo && strikeOutDelay}
              />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
            position: "relative",
            bottom: {md:"4rem", lg:"1.475rem", sm:"2.8rem",  xs:"0px"},
            width: "100%",
            padding: "4px",
          }}
        >
          {showWhatIf && (
            <Box
              sx={{
                position: "absolute",
                textAlign: "center",
                top: isMobile ? "37%" : "47%",
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  fontSize: { xs: "37px", sm: "30px", md: "40px" },
                  fontWeight: "500",
                  textAlign: "center",
                  width: { xs: "155px", md: "164px" },
                  position: "absolute",
                  transform: "translateY(-50%)",
                  right: { md: "59px", xs: "26px", sm: "31px", lg: "10px", xl:"71px" },
                  display: "inline",
                }}
              >
                <TypeWriterEffect
                  text="What if"
                  speed={180}
                  customFontsize={isMobile ? "27px" : "40px"}
                >
                  <>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </>
                </TypeWriterEffect>
              </Box>
              {/* <Typography
                variant="subtitle1"
              
                className="typewriter"
              >
                What if
              </Typography> */}
            </Box>
          )}

          {showLogo && (
            <Box
              component="img"
              src={Logo}
              alt="Logo"
              sx={{
                width: { xs: "209px", sm: "200px", md: "310px" },
                height: { xs: "49px", sm: "55px", md: "65px" },
                animation: "fadeIn 3s",
                position: "absolute",
                top: isMobile ? "36.7%" : "47%",
                transform: "translateY(-50%)",
                left: { md: "442px", xs: "140px", sm: "342px", lg: "606px", xl:'615px' }
              }}
            />
          )}
        </Box>

        {showMessage && (
          <Box
            sx={{
              position: "absolute",
              bottom: "20px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "25px", sm: "28px", md: "40px" },
                textAlign: "center",
                color: "white",
                fontWeight: 500,
                animation: "showTopText 1s",
                animationFillMode: "forwards",
                bottom: 0,
                transform: "translate(0, 100%)",
              }}
            >
              Enabling AI Innovation Like Never Before — We're Almost Here!
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ByteSizedAiIntro;
