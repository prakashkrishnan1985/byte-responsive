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

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if mobile screen

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
        padding: { xs: "20px 0px", sm: "100px 50px" },
        marginLeft: "auto",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "100%", lg: "100%", xl: "100%" },
          height: { xs: "auto", sm: "422px" },
          flexDirection: { xs: "column", sm: "row" },
          background:
            "linear-gradient(261.49deg, #3E3E3E 0%, #101010 31.14%, #000000 52.18%, #101010 76.66%, #3E3E3E 99.88%)",
          position: "relative",
          bottom: { xs: 0, sm: "60px" },
          borderRadius: "6px",
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
              minHeight: isMobile ? "auto" : "500px", 
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
                alt="blog image"
                style={{
                  width: "100%",
                  height: "276px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
            </Box>

            {/* Text Section */}
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
                marginLeft: { xs: 0, sm: "6%" },
                padding: {
                  xs: "10px 30px 0px 10px",
                  md: "0px 0px",
                  lg: "0px 0px",
                  xl: "0px 0px",
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "26px", sm: "42px" },
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
                  fontSize: "18px",
                }}
              >
                {blogs[currentIndex]?.reading_time_minutes} mins read
              </Typography>
            </Box>

            {/* CTA Button */}
            <Box
              sx={{
                position: "absolute",
                bottom: { xs: "0px", sm: "20px" },
                right: "20px",
                display: { xs: "flex", sm: "flex" },
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => handleCardClick(blogs[currentIndex]?.id)}
            >
              <Typography sx={{ fontSize: "16px", color: "white" }}>
                Go to Article
              </Typography>
              <IoArrowForwardOutline
                style={{ color: "white", marginLeft: "8px" }}
              />
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>

      <Typography
        variant="body1"
        sx={{
          fontWeight: "600",
          padding: { xs: "20px 0px", lg: "0px 0px", xl: "0px 0px" },
          position: "relative",
          left: { xs: "10px", sm: "45px", lg: "0px", xl: "0px" },
          height: "10px",
          fontSize: { xs: "16px", sm: "20px", lg: "24px", xl: "32px" },
        }}
      >
        Topics
      </Typography>

      <Box
        sx={{
          marginBottom: "50px",
          marginTop: { xs: "0px", sm: "65px" },
          padding: { xs: "0px 10px", sm: "0px", lg: "0px 5px" },
          alignItems: { xs: "center" },
        }}
      >
        {/* Tag Filter Section */}
        <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Box
            onClick={() => setSelectedTag(null)}
            sx={{
              backgroundColor: selectedTag === null ? "#800080" : "black",
              color: "white",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "14px",
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
                fontSize: "14px",
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

      <Grid
        item
        xs={12}
        container
        spacing={isMobile ? undefined : 1}
        justifyContent={isMobile ? "flex-start" : "center"}
        sx={{
          marginLeft: { xs: 0, sm: "auto" },
          marginRight: { xs: 0, sm: "auto" },
          paddingRight: { xs: "25px", sm: "0px", lg: "0px", xl: "0px" },
          paddingLeft: { xs: "10px !important", sm: "60px !important" },
          maxWidth: { sm: "1200px", lg: "1400px", md: "1200px", xl: "1600px" },
        }}
      >
        {filteredBlogs.map((blog, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            key={blog.id}
            sx={{ marginBottom: { sm: "70px", xs: "4px" } }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                cursor: "pointer",
                width: { xs: "100%", sm: "568px", lg: "568px", xl: "700px" },
                height: { xs: "auto", sm: "150px" },
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
                  padding: { xs: "0px", sm: "16px 60px 16px 16px" },
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
                    fontSize: { xs: "1rem", sm: "1.5rem" },
                    textAlign: "left",
                    fontWeight: 700,
                  }}
                >
                  {blog.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ paddingTop: "15px", color: "black" }}
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
                  alt={blog.title}
                  // sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            </Card>
            {/* Separator for Mobile Only */}
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
      </Grid>

      <Box
        sx={{
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
          paddingTop: "50px",
        }}
      >
        <Box
          sx={{
            width: { xs: "90%", sm: "744px" },
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
              fontSize: { xs: "24px", sm: "32px" },
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
            sx={{ fontSize: "16px", textAlign: "center" }}
          >
            We’re here to deliver value straight to your inbox every two weeks.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: "rgba(214, 214, 214, 1)",
              width: { xs: "100%", sm: "400px" },
              height: "20px",
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
                fontSize: "16px",
                flex: 1,
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
