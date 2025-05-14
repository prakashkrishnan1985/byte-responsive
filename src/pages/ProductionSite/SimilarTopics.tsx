import React, { useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  Card,
  CardMedia,
} from "@mui/material";
import { IoArrowForwardOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { Blog } from "./article";

interface SimilarTopicsProps {
  blogList: Blog[];
  onCardClick: (id: string) => void;
}

const SimilarTopics: React.FC<SimilarTopicsProps> = ({
  blogList,
  onCardClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % blogList.length);
  };

  const visibleCardsCount = isMobile ? 1 : 3;

  return (
    <Box
      sx={{
        width: { xs: "95%", sm: "1331px", md:"90%" },
        height: { xs: "auto", sm: "auto" },
        background:
          "linear-gradient(261.49deg, #3E3E3E 0%, #101010 31.14%, #000000 52.18%, #101010 76.66%, #3E3E3E 99.88%)",
        borderRadius: "6px",
        padding: { xs: "10px", sm: "30px" },
        overflow: "hidden",
        position: "relative",
        marginTop: "60px",
        marginBottom: "60px",
        marginLeft: { sm: "60px", md:"3%" },
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "white",
          fontSize: { xs: "20px", sm: "28px" },
          fontWeight: 600,
        }}
      >
        Similar Topics
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          overflow: "hidden",
          gap: isMobile ? "0px" : "30px",
          paddingBottom: "40px",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (isMobile ? "-m" : "-d")}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "flex",
              gap: isMobile ? "0px" : "20px",
              width: "100%",
            }}
          >
            {[...Array(visibleCardsCount)].map((_, offset) => {
              const index = (currentIndex + offset) % blogList.length;
              const blog = blogList[index];

              return (
                <Card
                  key={blog?.id}
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    cursor: "pointer",
                    width: isMobile ? "100%" : "568px",
                    height: isMobile ? "auto" : "210px",
                    borderRadius: "5px",
                    boxShadow: "none",
                    flex: "0 0 auto",
                    backgroundColor: "#000",
                    overflow: "hidden",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                  onClick={() => onCardClick(blog.id)}
                >
                  <Box
                    sx={{
                      flex: 1,
                      padding: { xs: "15px", sm: "16px 60px 16px 16px" },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      width: { xs: "100%", sm: "50%" },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: { xs: "1rem", sm: "1.2rem" },
                        textAlign: "left",
                        paddingRight: { xs: "10px", sm: "0xp" },
                      }}
                    >
                      {blog?.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ paddingTop: "15px", color: "white" }}
                    >
                      {blog?.reading_time_minutes} mins read
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: { xs: "100%", sm: "50%" },
                      height: { xs: "200px", sm: "210px" },
                      objectFit: "cover",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={blog?.article_img}
                      alt={blog?.title}
                      sx={{ height: "100%", width: "100%", objectFit: "cover" }}
                    />
                  </Box>
                </Card>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          gap: "10px",
        }}
        onClick={handleNext}
      >
        <Typography sx={{ color: "white", fontSize: "16px" }}>
          {currentIndex + 1}/{blogList.length}
        </Typography>
        <IoArrowForwardOutline style={{ color: "white", fontSize: "24px" }} />
      </Box>
    </Box>
  );
};

export default SimilarTopics;
