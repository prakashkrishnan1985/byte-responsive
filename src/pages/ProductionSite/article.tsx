import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Card,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDataFlow } from "../../providers/FlowDataProvider";
import {
  getArticlesById,
  getArticlesList,
} from "../../services/articleService";
import { useParams } from "react-router-dom";
import { formatDate } from "../../utils/commonUtils";
import SimilarTopics from "./SimilarTopics";
import { useNavigate } from "react-router-dom";

export interface Blog {
  id: string;
  title: string;
  description: string;
  tags: string;
  updated_at: string;
  author: string;
  article_img: string;
  reading_time_minutes: string;
}

const ArticlePage: React.FC = () => {
  // const { blogId } = useDataFlow();
  const [blog, setBlog] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Check if mobile screen
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const { blogId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    const fetchBlog = async () => {
      try {
        const response = await getArticlesById(blogId as any);
        setBlog(response as any);
      } catch (error) {
        console.error("Error fetching blog", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getArticlesList();
        setBlogs((response as any).data);
      } catch (error) {
        console.error("Error fetching blog data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
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
    );
  }

  return (
    <Box sx={{ backgroundColor: "black", height: "auto", overflow: "hidden" }}>
      <AppBar
        position="static"
        sx={{
          background: "black",
          paddingLeft: "20px",
          marginBottom: "20px",
          border: "none",
          boxShadow: "none",
        }}
      ></AppBar>

      <Card
        sx={{
          background:
            "linear-gradient(261.49deg, #3E3E3E 0%, #101010 31.14%, #000000 52.18%, #101010 76.66%, #3E3E3E 99.88%)",
          marginLeft: isMobile ? "16px" : "50px",
          marginRight: isMobile ? "16px" : "50px",
          marginTop: isMobile ? "16px" : "30px",
          borderRadius: "12px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
          padding: isMobile ? "20px" : "0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            paddingTop: isMobile ? "0" : "30px",
            paddingRight: isMobile ? "0" : "14px",
            paddingBottom: "20px",
            paddingLeft: isMobile ? "0" : "52px",
            flexWrap: "wrap",
            justifyContent: "flex-start",
          }}
        >
          {blog?.tags.split(",").map((tag: string, index: number) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "#f4f4f4",
                color: "#111",
                padding: isMobile ? "6px 10px" : "8px 12px",
                borderRadius: "4px",
                fontSize: isMobile ? "1rem" : "1rem",
                fontWeight: 500,
                letterSpacing: "0.5px",
                lineHeight: 1.4,
              }}
            >
              {tag}
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: isMobile ? "20px" : "0",
            paddingBottom: "20px",
          }}
        >
          <Box
            sx={{
              width: isMobile ? "100%" : "75%",
              textAlign: isMobile ? "left" : "left",
              marginLeft: isMobile ? "0" : "50px",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: isMobile ? "1.2rem" : "2rem",
                lineHeight: 1.4,
                marginBottom: "12px",
              }}
            >
              {blog?.title}
            </Typography>

            <Typography
              sx={{
                color: "#dddddd",
                fontSize: isMobile ? "1rem" : "1.2rem",
                fontWeight: 400,
                lineHeight: 1.7,
                marginBottom: "12px",
              }}
            >
              {blog?.description}
            </Typography>

            <Typography
              sx={{
                color: "#bbbbbb",
                fontSize: isMobile ? "1rem" : "1.2rem",
              }}
            >
              {blog?.reading_time_minutes} mins read &emsp;{" "}
              {formatDate(blog?.updated_at)}
            </Typography>
          </Box>

          <Box
            sx={{
              width: isMobile ? "100%" : "25%",
              textAlign: isMobile ? "left" : "left",
              marginLeft: {
                xs: "0",
                md: "152px",
                lg: "152px",
                xl: "300px",
              },
            }}
          >
            <Typography
              sx={{
                color: "#aaaaaa",
                fontSize: isMobile ? "0.9rem" : "1.2rem",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Written by
            </Typography>
            <Typography
              sx={{
                color: "#ffffff",
                fontSize: isMobile ? "0.9rem" : "1.2rem",
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              {blog?.author
                ?.split(" ")
                .map(
                  (word: string) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            </Typography>
          </Box>
        </Box>
      </Card>

      <Box sx={{ flexGrow: 1 }}>
        <div
          dangerouslySetInnerHTML={{
            __html: blog?.markup,
          }}
        />
      </Box>
      <SimilarTopics
        blogList={blogs}
        onCardClick={(id) => navigate(`/blog/${id}`)}
      />
    </Box>
  );
};

export default ArticlePage;
