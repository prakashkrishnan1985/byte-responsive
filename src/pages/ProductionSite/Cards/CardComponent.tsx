import { Box, Typography } from "@mui/material";

interface CardProps {
  title: string;
  description: string;
  subTitle: string;
  imageSrc: string;
}

const CardComponent = ({ title, description, imageSrc }: CardProps) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: { xs: "start", sm: "center", md: "start" },
          alignItems: { xs: "center", sm: "center" },
          gap: 2,
          paddingTop: { xs: 2 },
          background:
            "linear-gradient(261.82deg, #000000 5.01%, #666666 99.55%)",
          borderRadius: "10px",
          color: "white",
          padding: "2rem",
          wordBreak: "break-word",
          maxWidth: {
            xs: "100%",
            md: "30%",
          },
          height: { xs: "512px", sm: "266px", lg: "340px" },
        }}
      >
        <div
          style={{
            width: "222px",
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={imageSrc}
            alt="icon"
            style={{
              width: "122px",
              objectFit: "contain",
            }}
          />
        </div>
        <div>
          <Typography variant="h6" sx={{ fontSize: "28px", fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography>{description}</Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              marginTop: "1rem",
              color: "white",
              textTransform: "uppercase",
            }}
          >
            {}
          </Typography>
        </div>
      </Box>
    </>
  );
};

export default CardComponent;
