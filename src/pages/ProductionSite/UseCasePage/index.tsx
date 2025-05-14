import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import AIOptimization from "../AIOptimization/AIOptimization";
import RotatingImage from "../Sppiner/RotatingImage";
import WritingRelatedFlow from "./WritingRelatedFlow";
import PictureRelatedFlows from "./PictureRelatedFlows";
import SpeachRelatedFlows from "./SpeachRelatedFlows";
import PictureRelatedFlows2 from "./PictureRelatedFlows2";
import ContactForm from "../Contact/ContactForm";
import PopupModal from "../DialogBox/DialogBox";
import { sortByKey } from "../../../utils/commonUtils";

const UseCaseSite = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const sortedTempData: any = sortByKey(tempData, "section_header");
      setData(sortedTempData);
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
        // Initialize the group with section_header, section_description, and id
        grouped[key] = {
          section_header: key,
          section_description: entry.section_description, // Add section_description
          id: entry.id, // Add id of the entry
          articles: [],
        };
      }
      // Add the entry's id to each article and merge them into the group
      const articlesWithId = entry.articles.map((article: any) => ({
        ...article,
        id: entry.id, // Add the id to each article
      }));
      grouped[key].articles.push(...articlesWithId);
    });

    return Object.values(grouped);
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {data.length === 0 ? (
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
      ) : (
        <Container
          sx={{
            textAlign: "center",
            py: { xs: 4, lg: 6, xl: 8 },
            position: "relative",
            maxWidth: "100% !important",
            px: { xs: 2, sm: 4, lg: 10, xl: 10 },
          }}
        >
          <Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{
                maxWidth: {
                  xs: "100%",
                  md: "100%",
                  lg: "100%",
                  xl: "70%",
                },
                margin: "0 auto",
              }}
            >
              <AIOptimization />
            </Box>
            <Box
              sx={{
                position: { xs: "static", md: "absolute" },
                top: {
                  xs: "auto",
                  md: "calc(100vh - 600px)",
                  lg: "calc(100vh - 15%)",
                  xl: "calc(100vh - 18%)",
                },
                right: {
                  xs: "auto",
                  md: "15rem",
                  lg: "20rem",
                  xl: "30rem",
                },
                zIndex: { xs: "auto", md: 0 },
              }}
            >
              <RotatingImage height="220" />
            </Box>
          </Box>

          {data.map((item: any) => (
            <WritingRelatedFlow item={item} />
          ))}

          <ContactForm />
        </Container>
      )}
    </>
  );
};

export default UseCaseSite;
