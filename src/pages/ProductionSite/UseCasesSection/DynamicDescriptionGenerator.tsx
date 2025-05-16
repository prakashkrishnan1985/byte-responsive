import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Skeleton,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
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
import theme from "../../../components/theme/theme";

const DynamicDescriptionGenerator: React.FC = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // const yText = useTransform(scrollYProgress, [0, 0.7], ["-600%", "80%"]); // ↓ reduce from "230%" to "150%"
  const yyText = useTransform(scrollYProgress, [0, 1], ["20%", "280%"]);
  const yCards = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [content, setContent]: any = useState({});

  const handleEvent = (item: any) => {
    setContent(() => item);
    setOpen(true);
  };
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Tablet: "sm" to "md"
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  // Laptop: "md" to "lg"
  const isExtendedMonitor = useMediaQuery("(min-width:1919px)");

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
      const response = await fetch(
        "https://api-services-dev.bytesized.com.au/v1/website/sections/list"
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      const tempData: any = groupBySectionHeader(result);
      const allArticles = tempData.flatMap((section: any) => section.articles);
      console.log("allArticles", allArticles);
      const first8Articles = allArticles.slice(0, 8);
      const modifyData = first8Articles.map((item: any, index: any) => ({
        ...item,
        ...cards[index],
      }));

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
          articles: [],
        };
      }
      const articlesWithId = entry.articles.map((article: any) => ({
        ...article,
        id: entry.id,
      }));
      grouped[key].articles.push(...articlesWithId);
    });

    return Object.values(grouped);
  }

  useEffect(() => {
    if (data.length === 0) fetchData();
  }, [data]);

  const CardPlaceholder = ({
    width,
    height,
  }: {
    width: string;
    height: string;
  }) => (
    <Box
      sx={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "16px",
          backgroundColor: "#e0e0e0",
          backgroundImage: `url(${C1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <CircularProgress />
      </Box>
    </Box>
  );

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
          margin: "0 !important",
        }}
      >
        {/* Parallax Header Text */}
        {/* <motion.div
          style={{
            y: yText,
            position: "absolute",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            width: "50%",
          }}
        > */}
        <Typography
          variant="h5"
          sx={{
            color: "#000",
            textAlign: "center",
            textTransform: "uppercase",
            fontStyle: "italic",
            fontSize: { xs: "24px", sm: "32px", md: "40px", lg: "52px" },
            fontWeight: 800,
            background: "rgba(255, 255, 255, 0.7)",
            padding: { xs: "5px 10px", sm: "7px 15px", md: "10px 20px" },
            borderRadius: "10px",
          }}
        >
          <span style={{ fontWeight: "800", fontStyle: "normal" }}>
            Build and Deploy{" "}
          </span>
          AI Agents Effortlessly
        </Typography>
        {/* </motion.div> */}

        {/* Subheading */}
        {/* <motion.div
          style={{
            y: yyText,
            position: "absolute",
            top: isExtendedMonitor
              ? `${window.innerWidth < 500 ? 75 : 40}%`
              : `${window.innerWidth < 500 ? 75 : 63}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        > */}

        {/* </motion.div> */}

        {/* Cards Section */}
        {/* <motion.div style={{ y: yCards, zIndex: 2 }}> */}
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{
            width: "100%",
            paddingTop: "0 !important",
            margin: "0 !important",
          }}
        >
          {(loading ? cards : data).map((card: any, index: any) => (
            <Grid
              item
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px 20px !important",
              }}
            >
              <motion.div
                initial={{ opacity: 1, y: 40 }}
                whileInView={{ opacity: 1, y: 1 }}
                transition={{ delay: index * 0.5, duration: 5 }}
                viewport={{ once: false }}
              >
                {loading ? (
                  <CardPlaceholder width={card.width} height={card.height} />
                ) : (
                  <HoverCardF {...card} />
                )}
              </motion.div>
            </Grid>
          ))}
        </Grid>
        {/* </motion.div> */}
      </Box>

      <Typography
        variant="h5"
        sx={{
          color: "#000",
          textAlign: "center",
          textTransform: "uppercase",
          fontStyle: "italic",
          fontSize: { xs: "24px", sm: "32px", md: "40px", lg: "52px" },
          fontWeight: 800,
          background: "transparent",
          borderRadius: "10px",
          width: "100%",
          overflow: "hidden",
          paddingTop: "50px",
        }}
      >
        What Do You Want to Create Today?
      </Typography>

      <Box>
        <Typography
          variant="h6"
          color="primary"
          component="a"
          href="/usecases"
          style={{ textDecoration: "none" }}
          sx={{
            fontSize: {
              xs: "1.2rem",
              sm: "1.5rem",
              md: "1.8rem",
              lg: "2.2rem",
            },
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

      <PopupModal
        title="Test"
        content={content}
        setOpen={setOpen}
        open={open}
      />
    </>
  );
};

export default DynamicDescriptionGenerator;
