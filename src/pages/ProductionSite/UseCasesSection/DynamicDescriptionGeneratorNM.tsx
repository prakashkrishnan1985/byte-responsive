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

const DynamicDescriptionGeneratorNM: React.FC = () => {
  const ref = useRef(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [content, setContent]: any = useState({});
  const handleEvent = (item: any) => {
    console.log(item, "itemitem");
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
      const response = await fetch(
        "https://api-services-dev.bytesized.com.au/v1/website/sections/list"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      const tempData: any = groupBySectionHeader(result);
      const allArticles = tempData.flatMap((section: any) => section.articles);
      const first8Articles = allArticles.slice(0, 8);
      const modifyData = first8Articles.map((item: any, index: any) => {
        return { ...item, ...cards[index] };
      });
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
    if (data.length === 0) {
      fetchData();
    }
    console.log(data, "response");
  }, [data]);

  return (
    <>
      <Box ref={ref}>
        <Box
          sx={{
            width: { xs: "90%", sm: "70%", md: "60%", lg: "50%" },
            margin: "auto",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#000",
              textAlign: "center",
              textTransform: "uppercase",
              fontStyle: "italic",
              fontSize: { xs: "20px", sm: "28px", md: "36px", lg: "48px" },
              fontWeight: 800,
              padding: { xs: "5px 10px", sm: "7px 15px", md: "10px 20px" },
              borderRadius: "10px",
            }}
          >
            <span style={{ fontWeight: "800", fontStyle: "normal" }}>
              Build and Deploy{" "}
            </span>
            AI Agents Effortlessly
          </Typography>
        </Box>

        {/* Cards Section */}
        <Box sx={{ zIndex: 2 }}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{
              width: "100%",
              marginTop: { xs: "1rem", sm: "7rem", md: "10rem" },
              marginBottom: { xs: "3rem", sm: "4rem", md: "5rem" },
              marginLeft: { xs: "-8px", sm: "-10px", md: "-15px" },
            }}
          >
            {data.map((card: any, index: any) => (
              <Grid
                item
                key={card?.id + index}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <HoverCardF {...card} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: { xs: "2rem", sm: "3rem", md: "4rem" },
            marginBottom: { xs: "2rem", sm: "3rem", md: "4rem" },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#000",
              textAlign: "center",
              textTransform: "uppercase",
              fontStyle: "italic",
              fontSize: { xs: "18px", sm: "24px", md: "32px", lg: "40px" },
              fontWeight: 800,
              background: "transparent",
              padding: { xs: "5px 10px", sm: "7px 15px", md: "10px 20px" },
              borderRadius: "10px",
            }}
          >
            What Do You Want to Create Today?
            <Box>
              <Typography
                variant="h6"
                color="primary"
                component="a"
                href="/usecases"
                style={{ textDecoration: "none" }}
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.3rem",
                    md: "1.6rem",
                    lg: "2rem",
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
          </Typography>
        </Box>
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

export default DynamicDescriptionGeneratorNM;
