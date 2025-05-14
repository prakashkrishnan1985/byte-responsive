import React, { Suspense, useEffect, useRef, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import MovingBackground from "./Personas/Personas";
import Header from "./Header/Header";
import CardContainer from "./Cards/CafrdContainer";
import BackgroundImage from "./Personas/BackImage";
import DynamicDescriptionGeneratorNM from "./UseCasesSection/DynamicDescriptionGeneratorNM";
import theme from "../../components/theme/theme";
const BackgroundBox = React.lazy(() => import("./Personas/BackgroundBox"));
const DynamicDescriptionGenerator = React.lazy(
  () => import("./UseCasesSection/DynamicDescriptionGenerator")
);
const Cards1 = React.lazy(() => import("./Cards/Cards1"));
const Cards2 = React.lazy(() => import("./Cards/Cards2"));
const Cards3 = React.lazy(() => import("./Cards/Cards3"));
const ContactForm = React.lazy(() => import("./Contact/ContactForm"));
const CalendarEmbed = React.lazy(() => import("./Calendar/Calendar"));
const AboutPage = React.lazy(() => import("./AboutPage/AboutPage"));
interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is ByteStackAI?",
    answer:
      "ByteSizedAI is an AI Studio that enables businesses to create bespoke AI agents using pre-trained models. With our drag-and-drop functionality and Bring Your Own Application (BYOA) architecture, you can seamlessly enhance your product stack with AI capabilities without writing a single line of AI code.",
  },
  {
    question: "What is BYOA (Bring Your Own Application)?",
    answer:
      "BYOA is ByteSizedAI’s unique approach that allows you to identify opportunities within your existing product stack and build AI agents tailored to your needs. Using our Studio, you can drag and drop pre-trained models to create AI agents that integrate effortlessly into your ecosystem.",
  },
  {
    question: "Do I need coding expertise to use ByteStackAI?",
    answer:
      "Not at all! ByteSizedAI Studio is a zero-AI-code platform, meaning you don’t need prior coding knowledge to build or deploy AI agents. The drag-and-drop interface makes it easy for anyone to use.",
  },
  {
    question: "What types of AI models are available in ByteStackAI Studio?",
    answer:
      "Our Studio offers a diverse library of models, including powerful Large Language Models (LLMs) and efficient task-specific models. You can choose the right model for your use case, whether it’s text summarization, sentiment analysis, image recognition, or beyond.",
  },
  {
    question: "Can I use ByteStackAI with my existing product stack?",
    answer:
      "Yes, ByteSizedAI is designed to seamlessly integrate with your existing product stack. Our bespoke AI agents are built to enhance your current systems, making integration smooth and efficient.",
  },
  {
    question: "How long does it take to deploy an AI agent?",
    answer:
      "With ByteSizedAI, you can build and deploy AI agents in just 3–7 days, drastically reducing the time compared to traditional AI development, which can take months.",
  },
  {
    question: "Is ByteStackAI scalable?",
    answer:
      "Absolutely! ByteSizedAI’s pay-per-use model ensures cost-effective scalability. You can start small and scale up as your needs grow without investing heavily in infrastructure or expertise.",
  },
  {
    question: "How does ByteStackAI ensure its models stay up-to-date?",
    answer:
      "All deployed models in ByteSizedAI Studio are fully managed and continuously updated to remain cutting-edge, ensuring that your AI agents always perform at their best.",
  },
  {
    question: "What kind of results can I expect with ByteStackAI?",
    answer:
      "ByteSizedAI solutions are designed for success, offering up to an 80% higher success rate for feature rollouts. Additionally, businesses can save up to 74% on operational costs by leveraging our platform.",
  },
  {
    question: "Can I combine multiple models to create a complex workflow?",
    answer:
      "Yes! ByteSizedAI Studio enables you to combine multiple pre-trained models to build AI agents that address complex workflows or unique use cases, tailored to your specific business goals.",
  },
  {
    question: "How does ByteSizedAI compare LLMs with task-specific models?",
    answer:
      "While LLMs are powerful for versatile, general-purpose tasks, task-specific models are efficient for targeted use cases. ByteSizedAI provides both options, helping you choose the right tool for the job without overcomplicating your workflows.",
  },
  {
    question: "What industries can benefit from ByteSizedAI?",
    answer:
      "ByteSizedAI’s flexibility makes it suitable for a wide range of industries, including e-commerce, healthcare, finance, logistics, and more. If your business needs AI, ByteSizedAI can help you build the perfect solution",
  },
];

const ProductionSite: React.FC = () => {
  const [expanded, setExpanded] = useState<number | false>(false);
  const [widthSize, setWidthSize] = useState<number>(600);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  const textSectionRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleResize = () => {
      console.log("textSectionRef", window.innerWidth);
      setWidthSize(window.innerWidth);
    };

    handleResize(); // Set initial width
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // useEffect(() => {
  //   const moveWidgetToTop = () => {
  //     const timeoutId = setTimeout(() => {
  //       const widget: any = document.querySelector(
  //         "elevenlabs-convai"
  //       ) as HTMLElement;
  //       if (widget) {
  //         widget.style.position = "fixed";
  //         widget.style.zIndex = "9999"; // Ensure it's on top of other elements

  //         const updateWidgetPosition = () => {
  //           if (window.innerWidth > 800) {
  //             // Desktop
  //             widget.style.top = "-35px"; // Move it to the top
  //             widget.style.right = "10px";
  //             widget.style.bottom = "";
  //             widget.style.left = "";
  //             widget.style.transform = "";
  //           } else {
  //             // Other than desktop
  //             widget.style.top = "";
  //             widget.style.right = "";
  //             widget.style.bottom = "10px";
  //             widget.style.left = "80%"; // Move it to the bottom center
  //             widget.style.transform = "translateX(-50%)"; // Center align horizontally
  //           }
  //         };

  //         updateWidgetPosition();
  //         window.addEventListener("resize", updateWidgetPosition);

  //         return () => {
  //           window.removeEventListener("resize", updateWidgetPosition);
  //         };
  //       }
  //       clearTimeout(timeoutId);
  //     }, 2000); // Delay to ensure the widget is fully loaded
  //   };

  //   moveWidgetToTop();
  // }, []);

  return (
<Container
  maxWidth={false}
  disableGutters
  sx={{
    // width: "100vw", // full viewport width
    py: 5,
    p: 0,
    m: 0,
  }}
>
      <Header />
      <CardContainer />
      <div>
        <MovingBackground />
      </div>
      <div>
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          {widthSize < 800 ? (
            <DynamicDescriptionGeneratorNM />
          ) : (
            <DynamicDescriptionGenerator />
          )}
        </Suspense>
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          <AboutPage />
        </Suspense>
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          <ContactForm />
        </Suspense>
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          <CalendarEmbed />
        </Suspense>

        {/* <HoverCard /> */}
      </div>
      <Box id="faq">
      <Box
          sx={{ color: "#800080", fontSize: "18px", fontWeight: "500",
            alignSelf: "flex-start",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: { xs: "relative", md: "relative" },
            top:{xs:'0px',md:'0'},
            left: { xs: "0px", md: "0px" },
            padding: {xs:"20px 16px 10px 20px", md:"60px 16px 0px 0px", lg:"60px 16px 0px 19px", xl:"30px 16px 30px 20px"},
            }}
        >
          FAQ
      </Box>
      <Box >
        <BackgroundBox blur="1rem" opacity={0.2} rotate={10}>
          <Grid container spacing={isMobile? 0: 5}>
            <Grid item xs={12} md={6} ref={textSectionRef}>
              <Box
                sx={{
                  top: 0,
                  alignSelf: "flex-start",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "16px",
                  position: { xs: "relative", md: "sticky" },
                  marginLeft: { xs: "0px", md: "0px" },
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  YOUR QUESTIONS,{" "}
                  <span style={{ fontStyle: "italic" }}>ANSWERED</span>
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, color: "#000000" }}>
                  Revolutionize your product with ultra-fast AI optimization
                  today! ByteStackAI enhances your product with AI capabilities.
                </Typography>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                background: "transparent",
                overflow: { xs: "scroll", md: "visible" },
                height: { xs: "100vh", md: "auto" },
                marginLeft: { xs: "0px", md: "0px" },
              }}
            >
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  expanded={expanded === index}
                  onChange={handleChange(index)}
                  sx={{ background: "transparent" }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: "#000" }}>{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
        </BackgroundBox>
      </Box>
    </Box>
    </Container>
  );
};

export default ProductionSite;
