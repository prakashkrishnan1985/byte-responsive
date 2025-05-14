import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getConceptList } from "../../services/conceptService";
import backgroundImage from "../../assets/byteSize-bglogo.png";

interface Concept {
  conceptId: string;
  conceptName: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const HomePage: React.FC = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConcepts = async () => {
      const result: any = await getConceptList();
      if (result) {
        setConcepts(result.data);
      }
    };
    fetchConcepts();
  }, []);

  const handleCardClick = (conceptId: string) => {
    navigate(`/Conceptualize/${conceptId}`);
  };

  const handleCreateClick = () => {
    navigate("/landing"); // Navigate to your landing page
  };

  return (
    <Box
      style={{
        background: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "80px 40px 0 40px",
        color: "black",
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{
          // Remove vertical scroll and use the natural flow of the content
          // Ensure that the grid does not exceed the viewport height
          height: "auto",
        }}
      >
        {concepts.map((concept) => (
          <Grid item xs={12} sm={6} md={4} key={concept.conceptId}>
            <Card
              sx={{
                background: "#424242",
                color: "#f5f5f5",
                boxShadow: 5,
                borderRadius: 2,
                position: "relative",
                height: "auto",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 12,
                },
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onClick={() => handleCardClick(concept.conceptId)}
            >
              <CardContent sx={{ paddingBottom: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#ffffff" }}
                  gutterBottom
                >
                  {concept.conceptName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                  sx={{ color: "#e0e0e0" }}
                >
                  {concept.description}
                </Typography>

                <Typography
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "#333333",
                    color: "#ffffff",
                    padding: "5px 10px",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}
                >
                  {concept.status}
                </Typography>
              </CardContent>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 20px",
                  backgroundColor: "#333333",
                  borderBottomLeftRadius: "8px",
                  borderBottomRightRadius: "8px",
                }}
              >
                <Typography variant="body2" sx={{ color: "#e0e0e0" }}>
                  <strong>Created:</strong>{" "}
                  {new Date(concept.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: "#e0e0e0" }}>
                  <strong>Updated:</strong>{" "}
                  {new Date(concept.updatedAt).toLocaleString()}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}

        {/* Add the "Create your first AI application" card at the end */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: "#424242",
              color: "#f5f5f5",
              boxShadow: 5,
              borderRadius: 2,
              position: "relative",
              height: "100px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 3,
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 12,
              },
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onClick={handleCreateClick}
          >
            <Typography
              variant="body1"
              sx={{ color: "#ffffff", textAlign: "center" }}
            >
              Create your first AI application tailored for your business needs.
            </Typography>
            {/* Large Plus Button */}
            <Button
              variant="contained"
              sx={{
                fontSize: "3rem",
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                color: "#0288d1",
                narginTop: 2,
                boxShadow: 4,
                "&:hover": {
                  backgroundColor: "#ffffff",
                  boxShadow: 12,
                },
              }}
            >
              +
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
