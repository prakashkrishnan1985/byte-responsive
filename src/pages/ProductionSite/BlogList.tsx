import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  CardMedia,
  Grid,
  Box,
  CircularProgress,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getArticlesList,
  InquiryPayload,
  postInquiry,
} from "../../services/articleService";
import { useDataFlow } from "../../providers/FlowDataProvider";
import "./index.scss";
import { IoArrowForwardOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import theme from "../../components/theme/theme";

interface Blog {
  id: string;
  title: string;
  description: string;
  tags: string;
  updated_at: string;
  author: string;
  article_img: string;
  reading_time_minutes: string;
}

const BlogList: React.FC = () => {
  const { setBlogId } = useDataFlow();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const isMobile = useMediaQuery(theme.breakpoints.down("lg")); // Check if mobile screen

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs?.length);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page load
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

  const handleCardClick = (id: string) => {
    setBlogId(id);
    navigate(`/blog/${id}`);
  };

  const filteredBlogs = selectedTag
    ? blogs.filter((blog) => blog.tags.includes(selectedTag))
    : blogs;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: InquiryPayload = {
      email,
      user_type: "blog_subscriber",
    };

    setStatus("loading");

    try {
      const res: any = await postInquiry(payload);
      setStatus("success");
      toast.success("Email submitted successfully!", {
        className: "custom-toast-website",
      });
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
      setStatus("idle");
    }
  };

  const allTags = Array.from(
    new Set(
      blogs.flatMap((blog: any) =>
        blog?.tags ? blog.tags.split(",").map((tag: string) => tag.trim()) : []
      )
    )
  );

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
    <Grid
      container
      spacing={2}
      sx={{
        backgroundColor: "#fff",
        padding: { xs: "10px 0px", sm: "80px 10px", xl: "100px 50px" },
        marginLeft: "auto",
        width: "100%",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "100%", lg: "100%", xl: "100%" },
          height: { xs: "auto", sm: "auto" },
          flexDirection: { xs: "column", sm: "row" },
          background:
            "linear-gradient(261.49deg, #3E3E3E 0%, #101010 31.14%, #000000 52.18%, #101010 76.66%, #3E3E3E 99.88%)",
          position: "relative",
          bottom: { xs: 0, sm: "60px" },
          borderRadius: isMobile ? "6px" : "6px",
          display: "flex",
          gap: { xs: "30px", sm: "115px" },
          padding: { xs: "0px 0px px 0px", sm: "0px 20px 20px 20px" },
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.6 }}
            style={{
              display: "flex",
              width: "100%",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
              minHeight: isMobile ? "500px" : "500px",
              position: "relative",
            }}
          >
            {/* Image Section */}
            <Box
              sx={{
                width: { xs: "100%", sm: "460px" },
                height: { xs: "280px", sm: "380px" },
                position: "relative",
                borderRadius: "6px",
                overflow: "hidden",
                padding: { xs: "0px", sm: "20px 20px 0px 20px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bottom: { xs: "10px", sm: "0px" },
              }}
            >
              <img
                src={blogs[currentIndex]?.article_img}
                alt="blog"
                style={{
                  width: "100%",
                  height: "276px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", sm: "flex-start" },
                justifyContent: { xs: "center", sm: "center" },
                textAlign: { xs: "center", sm: "left" },
                height: { xs: "auto", sm: "380px" },
                overflow: "hidden",
                marginLeft: { xs: 0, md: "6%" },
                padding: {
                  xs: "10px 30px 40px 10px",
                  md: "0px 0px",
                  lg: "0px 0px",
                  xl: "0px 0px",
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                  lineHeight: "110%",
                  letterSpacing: "-1%",
                  color: "white",
                }}
              >
                {blogs[currentIndex]?.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  marginTop: "10px",
                  textAlign: { xs: "left", sm: "left" },
                  alignSelf: { xs: "flex-start", sm: "flex-start" },
                  fontSize: "1.3rem",
                  display: { xs: "none", lg: "block" },
                }}
              >
                {blogs[currentIndex]?.reading_time_minutes} mins read
              </Typography>
            </Box>

            <Box
              sx={{
                position: "absolute",
                bottom: { xs: "20px", sm: "0px", md: "20px" },
                display: { xs: "flex", md: "flex" },
                alignItems: "center",
                cursor: "pointer",
                width: "100%",
                justifyContent: { xs: "space-between", lg: "end" },
              }}
              onClick={() => handleCardClick(blogs[currentIndex]?.id)}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  textAlign: { xs: "left", sm: "left" },
                  alignSelf: { xs: "flex-start", sm: "flex-start" },
                  fontSize: "1.3rem",
                  display: { xs: "flex", lg: "none" },
                  justifyContent: "start",
                  alignItems: "center",
                  paddingLeft: "10px",
                }}
              >
                {blogs[currentIndex]?.reading_time_minutes} mins read
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.3rem",
                  color: "white",
                  display: "flex",
                  justifyContent: { xs: "start", lg: "end" },
                  alignItems: "center",
                }}
              >
                Go to Article
                <IoArrowForwardOutline
                  style={{ color: "white", marginLeft: "8px" }}
                />
              </Typography>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>

      <Box
        sx={{
          marginBottom: "50px",
          marginTop: { xs: "10px", sm: "10px" },
          padding: { xs: "0px 10px", sm: "0px", lg: "0px 5px" },
          alignItems: { xs: "center" },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "600",
            padding: { xs: "20px 0px 0px 0", lg: "0px 0px", xl: "0px 0px" },
            position: "relative",
            fontSize: { xs: "2rem" },
            textAlign: { xs: "center", lg: "left" },
          }}
        >
          Topics
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginTop: "20px",
            justifyContent: { xs: "center", lg: "start" },
          }}
        >
          <Box
            onClick={() => setSelectedTag(null)}
            sx={{
              backgroundColor: selectedTag === null ? "#800080" : "black",
              color: "white",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: { xs: "1.3rem", md: "1.8rem" },
              cursor: "pointer",
            }}
          >
            Show All
          </Box>

          {allTags.map((tag: string, index: number) => (
            <Box
              key={index}
              onClick={() => setSelectedTag(tag)}
              sx={{
                backgroundColor: selectedTag === tag ? "#800080" : "black",
                color: "white",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: { xs: "1.3rem", md: "1.8rem" },
                maxWidth: "150px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
              }}
            >
              {tag}
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: { sm: "1200px", lg: "1400px", md: "1200px", xl: "100%" },
          display: "flex",
          justifyContent: "space-between",
          margin: "auto",
          padding: { xs: "1rem !important", sm: "0 !important" },
          width: "100%",
          flexFlow: "wrap",
          gap: "2rem",
        }}
      >
        {filteredBlogs.map((blog, index) => (
          <Grid
            item
            xs={12}
            md={6}
            key={blog.id}
            sx={{
              padding: "0 !important",
              maxWidth: { xs: "100%", md: "44%" },
            }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                cursor: "pointer",
                height: { xs: "auto", md: "auto" },
                borderRadius: "5px",
                transition: "transform 0.3s, box-shadow 0.3s",
                boxShadow: "none",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                },
              }}
              onClick={() => handleCardClick(blog.id)}
            >
              <Box
                sx={{
                  flex: 1,
                  padding: { xs: "0px", md: "16px 60px 16px 16px" },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "black",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: { xs: "1.5rem", md: "2rem" },
                    textAlign: "left",
                    fontWeight: 700,
                  }}
                >
                  {blog.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    paddingTop: "15px",
                    color: "black",
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                  }}
                >
                  {blog?.reading_time_minutes} mins read
                </Typography>
              </Box>
              <Box
                sx={{
                  width: { xs: "100%", md: "50%" },
                  height: { xs: "200px", md: "atuo" },
                  objectFit: "cover",
                }}
              >
                <CardMedia
                  component="img"
                  image={blog?.article_img}
                  alt={blog.title}
                  sx={{
                    width: "100%",
                    objectFit: "cover",
                    height: "276px",
                  }}
                />
              </Box>
            </Card>
            {isMobile && index < filteredBlogs.length - 1 && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    borderTop: "2px solid #ccc",
                    width: "100%",
                    margin: "20px 0",
                  }}
                />
              </Grid>
            )}
          </Grid>
        ))}
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
          paddingTop: "50px",
        }}
      >
        <Box
          sx={{
            width: { xs: "90%", sm: "100%" },
            minHeight: "172px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem" },
              fontWeight: "600",
              textAlign: "center",
              letterSpacing: "2px",
            }}
          >
            <b style={{ textTransform: "uppercase" }}>Boring emails?</b>{" "}
            <i>Not our style.</i>
          </Typography>

          <Typography
            variant="body2"
            sx={{ fontSize: { xs: "1.3rem", md: "2rem" }, textAlign: "center" }}
          >
            We’re here to deliver value straight to your inbox every two weeks.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: "rgba(214, 214, 214, 1)",
              width: { xs: "100%", sm: "600px", md: "40%" },
              borderRadius: "4px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "success"}
              placeholder="Enter your email"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "1.2rem",
                flex: 1,
                padding: "5px",
              }}
            />
            <IconButton
              type="submit"
              sx={{
                color: "black",
                padding: 0,
                marginLeft: "10px",
                backgroundColor:
                  status === "loading" ? "#800080" : "transparent",
                "&:hover": {
                  backgroundColor: "#800080",
                },
              }}
            >
              <IoArrowForwardOutline />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default BlogList;
