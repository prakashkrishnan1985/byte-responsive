import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import HoverCardF from "./HoverCardsF";
import C1 from "../../../assets/cards-template/bent-light.png";
import C2 from "../../../assets/cards-template/glossy-purple.png";
import C3 from "../../../assets/cards-template/shape-glossy.png";
import C4 from "../../../assets/cards-template/purple-roundy.png";
import C5 from "../../../assets/cards-template/blue-panes.png";
import C6 from "../../../assets/cards-template/crystal-clear.png";
import C7 from "../../../assets/cards-template/glass-purple.png";

import PopupModal from "../DialogBox/DialogBox";

const DynamicDescriptionGenerator: React.FC = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Parallax effect: Text stops at the center, cards move upwards
  const yText = useTransform(scrollYProgress, [0, 0.8, 0.5], ["30%", "40%", "90%"]);
  const yCards = useTransform(scrollYProgress, [0.4, 1], ["30%", "-20%"]); // Adjusted for slower scrolling

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [content, setContent]: any = useState({});
  const handleEvent = (item: any) => {
    console.log(item, 'itemitem');
    setContent(() => item);
    setOpen(true);
  };
  const cards = [
    { backgroundImage: C1, width: "580", height: "373", action: handleEvent },
    { backgroundImage: C2, width: "498", height: "304", action: handleEvent },
    { backgroundImage: C3, width: "580", height: "373", action: handleEvent },
    { backgroundImage: C4, width: "580", height: "373", action: handleEvent },
    { backgroundImage: C5, width: "498", height: "304", action: handleEvent },
    { backgroundImage: C6, width: "580", height: "373", action: handleEvent },
    { backgroundImage: C1, width: "580", height: "373", action: handleEvent },
    { backgroundImage: C7, width: "498", height: "304", action: handleEvent },
  ];
  const fetchData = async () => {
    try {
      const response = await fetch('https://api-services-dev.bytesized.com.au/v1/website/sections/list');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      const tempData: any = groupBySectionHeader(result);
      const allArticles = tempData.flatMap((section: any) => section.articles);
      const first8Articles = allArticles.slice(0, 8);
      const modifyData = first8Articles.map((item: any, index: any) => { return { ...item, ...cards[index] } });
      setData(modifyData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  function groupBySectionHeader(data: any) {
    const grouped: any = {};

    data.forEach((entry: any) => {
      const key = entry.section_header;
      if (!grouped[key]) {
        grouped[key] = {
          section_header: key,
          section_description: entry.section_description,
          id: entry.id,
          articles: []
        };
      }
      const articlesWithId = entry.articles.map((article: any) => ({
        ...article,
        id: entry.id
      }));
      grouped[key].articles.push(...articlesWithId);
    });

    return Object.values(grouped);
  }

  useEffect(() => {
    if (data.length === 0) {
      fetchData();
    }
    console.log(data, 'response');
  }, [data]);

  return (
    <>
      <Box
        ref={ref}
        sx={{
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Centered Text with Parallax Effect */}
        <motion.div
          style={{ y: yText, position: "absolute", top: "5%", left: "35%", transform: "translate(-50%, -50%)", zIndex: 1, width: "535px" }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#000",
              textAlign: "center",
              textTransform: "uppercase",
              fontStyle: "italic",
              fontSize: "52px",
              fontWeight: 800,
              background: "rgba(255, 255, 255, 0.7)",
              padding: "10px 20px",
              borderRadius: "10px",
            }}
          >
            <span style={{ fontWeight: "800", fontStyle: "normal" }}>Build and Deploy </span>
            AI Agents Effortlessly
          </Typography>
        </motion.div>
        <motion.div
          style={{ y: yText, position: "absolute", top: "80%", left: "1%", transform: "translate(-50%, -50%)", zIndex: 1, width: "100%" }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#000",
              textAlign: "center",
              textTransform: "uppercase",
              fontStyle: "italic",
              fontSize: "52px",
              fontWeight: 800,
              background: "rgba(255, 255, 255, 0.7)",
              padding: "10px 30px",
              borderRadius: "10px",
            }}
          >
            {/* what are you interested in? */}
            What Do You Want to Create Today?
            <Box>
              <Typography
                variant="h6"
                color="primary"
                component="a"
                href="/usecases"
                style={{ textDecoration: "none" }}
                sx={{
                  fontSize: "2.2rem",
                  color: "#800080",
                  textAlign: "center",
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                See More...
              </Typography>
            </Box>
          </Typography>
        </motion.div>

        {/* Cards Section */}
        <motion.div style={{ y: yCards, zIndex: 2 }}>
          <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: "xl", marginTop: "30vh" }}>
            {data.map((card: any, index: any) => (
              <Grid item key={card?.id + index} xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <motion.div
                  initial={{ opacity: 1, y: 40 }}
                  whileInView={{ opacity: 1, y: 1 }}
                  transition={{ delay: index * 50, duration: 90000 }}
                  viewport={{ once: false }}
                >
                  <HoverCardF {...card} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

      </Box>
      <PopupModal title="Test" content={content} setOpen={setOpen} open={open} />
    </>
  );
};

export default DynamicDescriptionGenerator;