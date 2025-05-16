import React from "react";
import { Box, Grid, Typography, Container } from "@mui/material";
import RotatingImage from "../Sppiner/RotatingImage";

const features = [
  {
    id: "00",
    title: "Bring Your Own Application (BYOA)",
    description:
      "Our BYOA architecture helps you identify opportunities in your product stack to build AI agents that integrate seamlessly into your products.",
  },
  {
    id: "01",
    title: "Bring Your Own Application (BYOA)",
    description:
      "Our BYOA architecture helps you identify opportunities in your product stack to build AI agents that integrate seamlessly into your products.",
  },
  {
    id: "02",
    title: "Zero AI Code Integration",
    description:
      "ByteSizedAI Studio removes the need to write any AI-related code. It provides ready-to-use models that can be dragged and dropped to create AI agents with ease.",
  },
  {
    id: "03",
    title: "Fully Managed and Always Updated",
    description:
      "ByteSizedAI Studio takes care of managing and updating all deployed models, keeping them current and ensuring your business stays ahead in AI innovation.",
  },
  {
    id: "04",
    title: "Affordable and Scalable",
    description:
      "With a flexible pricing model based on usage, businesses can scale AI solutions without large investments in infrastructure or in-house expertise. Our clients have saved up to 74 percent on operational costs, making AI more accessible to everyone.",
  },
  {
    id: "05",
    title: "Built for Success",
    description:
      "ByteSizedAI solutions help you unlock the full potential of AI for your business. With an 80 percent higher success rate for launching new features, our tailored models consistently deliver meaningful results.",
  },
  {
    id: "06",
    title: "The Best Model for Every Task",
    description:
      "At ByteSizedAI, we offer a wide range of models, from advanced language models to highly efficient tools for specific tasks—ensuring a perfect match without adding unnecessary complexity.",
  },
];

const AboutPage = () => {
  return (
    // <Box sx={{ backgroundColor: "#000", color: "#fff", py: 8 }}>
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "900px",
        backgroundColor: "#000",
        color: "#fff",
        padding: 4,
        marginTop: "50px",
        maxWidth: {
          xs: "100%",
          sm: "1400px",
          md: "1400px",
          lg: "1300px",
          xl: "100%",
        },
        borderRadius: {
          xs: "0px",
          sm: "0px",
          md: "10px",
          lg: "10px",
          xl: "10px",
        },
      }}
      id="about"
    >
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography
            variant="body1"
            sx={{
              color: "#A020F0",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            About
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold", mt: 2 }}>
            REDEFINE AI <i>WITH BYTESIZED AI STUDIO</i>
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2, opacity: 0.8, color: "#fff" }}
          >
            Bring your vision to life with ByteSizedAI Studio, where
            cutting-edge AI aligns perfectly with your unique business goals.
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <RotatingImage height="220" />
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={{ xs: { mt: 2 }, sm: { mt: 6 } }}>
        {features.map((feature, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={feature.id}
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "48%", md: "24%" },
              marginLeft: index === 4 ? { xs: 0, md: "8rem" } : 0,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box
                sx={{
                  display: { xs: "flex", md: "block", sm: "flex" },
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "100%",
                  gap: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mt: 1,
                    display: { xs: "none", md: "block" },
                  }}
                >
                  {feature.id}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    opacity: 0.8,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      mr: 1,
                    }}
                  />
                  <Box
                    sx={{
                      flexGrow: 0.5,
                      height: "0.5px",
                      backgroundColor: "#323232",
                      mx: 0,
                    }}
                  />
                  <Box
                    sx={{
                      flexGrow: 0.5,
                      height: "0.5px",
                      backgroundColor: "#323232",
                      mx: 0,
                    }}
                  />
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    maxWidth: { md: "75%", sm: "100%" },
                    lineHeight: 1.1,
                    margin: { xs: "15px 0", sm: "0" },
                    minHeight: { md: "45px", sm: "0" },
                  }}
                >
                  {feature.title}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  opacity: 0.8,
                  mt: 1,
                  color: "#fff",
                  paddingLeft: { xs: "22px", sm: "0px" },
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
    // </Box>
  );
};

export default AboutPage;
