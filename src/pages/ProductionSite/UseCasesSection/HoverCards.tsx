import { CardContent, Typography, Box, Link, Button } from "@mui/material";

interface HeaderProps {
  id: string | number; // Assuming id is a string or number
  backgroundImage: string; // Assuming it's a URL string
  action: any;
  article_description: string;
  article_name: string;
  flow?: string; // Optional prop
  header?: string; // Optional prop
  sub_header?: string; // Optional prop
}

const HoverCard: React.FC<HeaderProps> = (props) => {
  const {
    id,
    backgroundImage,
    action,
    article_name,
    article_description,
  } = props;

  const width = 500; // Fixed width
  const height = 250; // Fixed height
  const mobileHeight = 220; // Mobile height

  return (
    <Box
      sx={{
        width: `${width}px`,
        height: {xs:`${mobileHeight}px`, sm:`${height}px`},
        perspective: "1000px", // Adds perspective for the 3D effect
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d", // Ensures 3D transform works
          // transition: "transform 0.6s", // Smooth transition for the flip
          "&:hover": {
            transform: "rotateY(180deg)", // Flip the card on hover
          },
        }}

      >
        {/* Front Side */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden", // Hides the back side when not flipped
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            color: "#333",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              sx={{
              color: "#fff",
              margin: { xs: "0", sm: "0", md: "90px 20px 45px 4px" }, // Margin for desktop only
              fontWeight: "800",
              textTransform: "uppercase",
              textAlign: "center",
              }}
            >
              {article_name || "DYNAMIC DESCRIPTION"}
            </Typography>
          </CardContent>
        </Box>

        {/* Back Side */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            display: "flex",
            justifyContent: "start",
            alignItems: "left",
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "10px",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              sx={{ color: "#fff",
                 margin: { xs: "0", sm: "0", md: "20px 25px 10px 4px" }, // Margin for desktop only
                 fontSize: "1rem", fontWeight: "800", textTransform: "uppercase" , textAlign:"left"}}
            >
              {article_name || "GENERATOR"}
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{
              color: { xs: "#fff", sm: "#fff", md: "#fff" }, // Ensures font color is white for all devices
              margin: "10px 10px 10px 4px",
              fontSize: "0.9rem",
              lineHeight: "normal",
              textAlign: "left",
              }}
            >
              {article_description || "GENERATOR"}
            </Typography>
            <Typography variant="h6" sx={{
              margin: 2, justifyContent: 'end',
              display: 'flex'
            }}>
              <Button
                onClick={() => action(props)}
                rel="noopener noreferrer"
                sx={{
                  textTransform: "none",
                  padding: 0,
                  minWidth: "auto",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                {"See Detail ->"}
              </Button>
            </Typography>
          </CardContent>
        </Box>
      </Box>
    </Box>
  );
};

export default HoverCard;