import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import iconIdeate from "../../../assets/icons/brainstorm.svg";
import iconVisualize from "../../../assets/icons/visualize.svg";
import iconPitch from "../../../assets/icons/pitch.svg";
import iconIntegrate from "../../../assets/icons/integrate.svg";
import iconSimulate from "../../../assets/icons/simulate.svg";
import iconDeploy from "../../../assets/icons/deploy.svg";
import { LiaCoinsSolid } from "react-icons/lia";
import { SiCoinmarketcap } from "react-icons/si";
import { BsPeople } from "react-icons/bs";

import "./tab.css";

const TwoTabComponent = () => {
  const [tabValue, setTabValue] = useState(0); // State for active tab
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile screens
  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(0);

  // Handle tab change
  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  // Data for Innovators and Developers sections
  const innovatorsData = [
    {
      icon: iconIdeate,
      title: "Ideate",
      description:
        "Use ByteSizedAI to interact with AI and spark new ideas for your next big feature. Let AI be your creative partner in brainstorming innovative possibilities!",
    },
    {
      icon: iconVisualize,
      title: "Visualise",
      description:
        "Transform your ideas into tangible AI agent concepts by integrating with real, pretrained AI models. Experiment with logical flows and visualize how your AI solution could function in real-world scenarios!",
    },
    {
      icon: iconPitch,
      title: "Pitch",
      description:
        "Showcase your AI agent’s potential by simulating its real-world application—without needing AI expertise or coding. Demonstrate its capabilities effectively to your team and stakeholders!",
    },
  ];

  const developersData = [
    {
      icon: iconIntegrate,
      title: "Integrate",
      description:
        "Developers take over to bring the AI agent vision to life—without AI coding and with minimal API integrations, making implementation effortless!",
    },
    {
      icon: iconSimulate,
      title: "Simulate",
      description:
        "Test your AI agent’s performance by running simulations within your existing product stack. Ensure seamless functionality before deployment!",
    },
    {
      icon: iconDeploy,
      title: "Deploy",
      description:
        "Launch your AI agent to production with a single click. We handle infrastructure and AI management, keeping your agent up to date with minimal effort on your end!",
    },
  ];

  const AIdevelopersData = [
    {
      icon: <LiaCoinsSolid size="35" />,
      title: "Monetize",
      description:
        "Turn your AI models and agents into revenue-generating assets. Upload production-ready models to the ByteSizedAI Marketplace and earn every time they’re used—secure, plug-and-play deployments make it seamless.",
    },
    {
      icon: <SiCoinmarketcap size="35" />,
      title: "Leverage Marketplace",
      description:
        "Browse a growing library of trusted, reusable agents and models contributed by peers. Accelerate your build cycles by integrating battle-tested components instead of reinventing the wheel.",
    },
    {
      icon: <BsPeople size="35" />,
      title: "Community",
      description:
        "Join a thriving community of AI practitioners. Share insights, contribute open-source agents, and collaborate with innovators and developers shaping the future of modular AI. Together, we build faster and better.",
    },
  ];

  useEffect(() => {
    setExpandedAccordion(tabValue === 0 ? 0 : 100);
  }, [tabValue]);

  return (
    <Box
      sx={{
        borderRadius: "10px",
        border: "1px solid #c1baba12",
        width: "100%",
      }}
    >
      {/* AppBar with Tabs */}
      <AppBar
        position="static"
        sx={{
          boxShadow: "none",
          backgroundColor: "#00000000",
          color: "#800080",
        }}
      >
        <Toolbar
          sx={{
            backgroundColor: "#00000000",
            borderBottom: "1px solid #bdb7b773",
            minHeight: "48px!important",
          }}
        >
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Innovators" />
            <Tab label="Developers" />
            <Tab label="AI Developers" />
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Tab Content */}
      <Container sx={{ mt: 4 }}>
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {isMobile ? (
                innovatorsData.map((item, index) => (
                  <Accordion
                    key={index}
                    expanded={expandedAccordion === index}
                    onChange={() =>
                      setExpandedAccordion(
                        expandedAccordion === index ? null : index
                      )
                    }
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <img
                          src={item.icon}
                          alt={item.title}
                          style={{ width: "40px" }}
                        />
                        <Typography variant="h6">{item.title}</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{item.description}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                // Desktop: Grid Layout
                <div className="container">
                  {innovatorsData.map((item, index) => (
                    <div className="section1" key={index}>
                      <img src={item.icon} alt={item.title} />
                      <div>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {isMobile ? (
                developersData.map((item, index) => (
                  <Accordion
                    key={index}
                    expanded={expandedAccordion === index + 100}
                    onChange={() =>
                      setExpandedAccordion(
                        expandedAccordion === index + 100 ? null : index + 100
                      )
                    }
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <img
                          src={item.icon}
                          alt={item.title}
                          style={{ width: "40px" }}
                        />
                        <Typography variant="h6">{item.title}</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{item.description}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                // Desktop: Grid Layout
                <div className="container">
                  {developersData.map((item, index) => (
                    <div className="section1" key={index}>
                      <img src={item.icon} alt={item.title} />
                      <div>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Grid>
          </Grid>
        )}

        {tabValue === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {isMobile ? (
                AIdevelopersData.map((item: any, index) => (
                  <Accordion
                    key={index}
                    expanded={expandedAccordion === index + 100}
                    onChange={() =>
                      setExpandedAccordion(
                        expandedAccordion === index + 100 ? null : index + 100
                      )
                    }
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        {React.isValidElement(item.icon) ? (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {item.icon}
                          </Box>
                        ) : (
                          <img
                            src={item.icon}
                            alt={item.title}
                            style={{ width: "40px", height: "40px" }}
                          />
                        )}
                        <Typography variant="h6">{item.title}</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{item.description}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                // Desktop: Grid Layout
                <div className="container">
                  {AIdevelopersData.map((item: any, index) => (
                    <div className="section1" key={index}>
                      {React.isValidElement(item.icon) ? (
                        <Box
                          sx={{
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: { md: 2 },
                          }}
                        >
                          {item.icon}
                        </Box>
                      ) : (
                        <img
                          src={item.icon}
                          alt={item.title}
                          style={{ width: "40px", height: "40px" }}
                        />
                      )}
                      <div>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default TwoTabComponent;
