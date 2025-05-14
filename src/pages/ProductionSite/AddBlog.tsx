import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Card } from "@mui/material";
import AddBlogForm from "./AddBlogForm";
import { getArticlesById, getArticlesList } from "../../services/articleService";

const AddBlog: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  // useEffect(() => {
  //   const fetchArticles = async () => {
  //     const response:any = await getArticlesList()
  //     const data = await response?.json();
  //     setArticles(data.data); 
  //   };

  //   fetchArticles();
  // }, []);

  // Toggle form visibility
  const handleAddArticleClick = () => {
    setShowForm(!showForm);
  };

  return (
    <Box sx={{ backgroundColor: "black", padding: "20px" }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: "white", marginBottom: "20px", textAlign: 'center' }}>
          Blog Articles
        </Typography>

        <Button onClick={handleAddArticleClick} sx={{ marginBottom: "20px", background: '#800080' }} variant="contained">
          Add New Article
        </Button>
      </Box>

      {showForm && <AddBlogForm setShowForm={setShowForm} />}

      <div>
        {articles.map((article) => (
          <Card
            key={article.id}
            sx={{
              marginBottom: "20px",
              backgroundColor: "#3E3E3E",
              padding: "20px",
            }}
          >
            <Typography variant="h5" sx={{ color: "white" }}>
              {article.title}
            </Typography>
            <Typography sx={{ color: "white" }}>
              {article.description}
            </Typography>
            <Typography sx={{ color: "white" }}>
              {article.updated_at}
            </Typography>
          </Card>
        ))}
      </div>
    </Box>
  );
};

export default AddBlog;
