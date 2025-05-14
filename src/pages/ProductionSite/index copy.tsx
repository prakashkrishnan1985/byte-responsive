import React, { useState } from "react";
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Container, Grid, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import logo from "../../assets/logo_sp.png";
import { Background } from "@xyflow/react";
import RotatingImage from "./Sppiner/RotatingImage";
import MagneticCircleButton from "./MagnetBtn/MagneticCircleButton";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  { question: "What is ByteStackAI?", answer: "ByteSizedAI is an AI Studio that enables businesses to create bespoke AI agents using pre-trained models. With our drag-and-drop functionality and Bring Your Own Application (BYOA) architecture, you can seamlessly enhance your product stack with AI capabilities without writing a single line of AI code." },
  { question: "What is BYOA (Bring Your Own Application)?", answer: "BYOA is ByteSizedAI’s unique approach that allows you to identify opportunities within your existing product stack and build AI agents tailored to your needs. Using our Studio, you can drag and drop pre-trained models to create AI agents that integrate effortlessly into your ecosystem." },
  { question: "Do I need coding expertise to use ByteStackAI?", answer: "Not at all! ByteSizedAI Studio is a zero-AI-code platform, meaning you don’t need prior coding knowledge to build or deploy AI agents. The drag-and-drop interface makes it easy for anyone to use." },
  { question: "What types of AI models are available in ByteStackAI Studio?", answer: "Our Studio offers a diverse library of models, including powerful Large Language Models (LLMs) and efficient task-specific models. You can choose the right model for your use case, whether it’s text summarization, sentiment analysis, image recognition, or beyond." },
  { question: "Can I use ByteStackAI with my existing product stack?", answer: "Yes, ByteSizedAI is designed to seamlessly integrate with your existing product stack. Our bespoke AI agents are built to enhance your current systems, making integration smooth and efficient." },
  { question: "How long does it take to deploy an AI agent?", answer: "With ByteSizedAI, you can build and deploy AI agents in just 3–7 days, drastically reducing the time compared to traditional AI development, which can take months." },
  { question: "Is ByteStackAI scalable?", answer: "Absolutely! ByteSizedAI’s pay-per-use model ensures cost-effective scalability. You can start small and scale up as your needs grow without investing heavily in infrastructure or expertise." },
  { question: "How does ByteStackAI ensure its models stay up-to-date?", answer: "All deployed models in ByteSizedAI Studio are fully managed and continuously updated to remain cutting-edge, ensuring that your AI agents always perform at their best." },
  { question: "What kind of results can I expect with ByteStackAI?", answer: "ByteSizedAI solutions are designed for success, offering up to an 80% higher success rate for feature rollouts. Additionally, businesses can save up to 74% on operational costs by leveraging our platform." },
  { question: "Can I combine multiple models to create a complex workflow?", answer: "Yes! ByteSizedAI Studio enables you to combine multiple pre-trained models to build AI agents that address complex workflows or unique use cases, tailored to your specific business goals." },
  { question: "How does ByteSizedAI compare LLMs with task-specific models?", answer: "While LLMs are powerful for versatile, general-purpose tasks, task-specific models are efficient for targeted use cases. ByteSizedAI provides both options, helping you choose the right tool for the job without overcomplicating your workflows." },
  { question: "What industries can benefit from ByteSizedAI?", answer: "ByteSizedAI’s flexibility makes it suitable for a wide range of industries, including e-commerce, healthcare, finance, logistics, and more. If your business needs AI, ByteSizedAI can help you build the perfect solution" }

];

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <AppBar position="static" style={{ background: "white", paddingLeft: "20px", marginBottom: "20px", border: "none", boxShadow: "none", paddingBottom: "120px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>

          <Typography variant="h6" sx={{ color: "black", fontWeight: "bold" }}>
            ByteStackAI
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1, gap: 3 }}>
            <Typography variant="h6" sx={{ color: "black" }}>ABOUT</Typography>
            <Typography variant="h6" sx={{ color: "black" }}>USECASES</Typography>
            <Typography variant="h6" sx={{ color: "black" }}>BLOG</Typography>
            <Typography variant="h6" sx={{ color: "black" }}>CONTACT</Typography>
            <Typography variant="h6" sx={{ color: "black" }}>FAQ</Typography>
          </Box>
          <Button style={{ color: 'black' }} sx={{ borderRadius: "30px", border: "2px solid black", marginLeft: "auto", marginRight: "40px", width: "130px" }}>Get in touch</Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          height: "480px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Typography variant="h2" sx={{ color: "black", font: "Mulish", size: "3.35rem", marginBottom: "-25px" }}>
          <b> AI CURATED <i>BY YOU</i></b>
        </Typography>
        {/* <RotatingImage /> */}
        <Typography variant="h2" sx={{ color: "black", font: "Mulish", size: "3.35rem", marginTop: "-25px" }}>
          <b>FOR YOU</b>
        </Typography>
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
            fontSize: "230px",
            fontWeight: "bold",
            zIndex: -1,
          }}
        >
          AI STUDIO
        </Typography>



      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ width: "30%", textAlign: "left", marginLeft: "30px" }}>
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
            You’ve Seen AI Work <span style={{ color: "purple" }}>—Now Make AI Agents</span> Work for You
          </Typography>

          <Typography style={{ marginBottom: "10px" }}>
            AI Agents use AI to automate tasks, make decisions, and
            improve your product stack. With ByteSized AI Studio,
            drag and drop pre-trained models to create, adapt, and deploy
            tailored agents for your unique business needs.
          </Typography>
          <Typography style={{ marginBottom: "40px" }}>
            Forget one-size-fits-all solutions; these agents work the way
            you do, empowering your vision. Let’s build smarter, together!
          </Typography>
        </Box>

        <Box
          sx={{ width: "60%", display: "flex", justifyContent: "flex-end" }}
        >

          <MagneticCircleButton size={145} name="EXPRESS INTEREST" defaultColor="#800080" />
          <MagneticCircleButton size={120} name="INTERESTED AS AI DEV" defaultColor="#000000" />
        </Box>
      </Box>


    </Box>

  );
};


const ProductionSite: React.FC = () => {
  const [expanded, setExpanded] = useState<number | false>(false);

  const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (

    <Container maxWidth="lg" sx={{ py: 5 }}>

      <Navbar />
      <Grid container spacing={5} md={8} sx={{ mt: 5 }} xs={12}>
        <Grid item xs={12} md={4}>
          <Typography variant="h4" fontWeight="bold">
            YOUR QUESTIONS, <span style={{ fontStyle: "italic" }}>ANSWERED</span>
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, color: "gray" }}>
            Revolutionize your workflow with ultra-fast AI optimization today! ByteStackAI enhances your workflow with AI capabilities.
          </Typography>
        </Grid>

        <Grid item xs={8} md={6} display="flex" justifyContent="center" alignItems="center">
          {faqs.map((faq, index) => (
            <Accordion key={index} expanded={expanded === index} onChange={handleChange(index)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductionSite;

