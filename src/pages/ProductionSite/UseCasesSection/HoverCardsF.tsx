// import React, { useState } from "react";
// import { Card, CardContent, Typography, Box } from "@mui/material";

// interface HeaderProps {
//   id:any;
//   width: any;
//   height: any;
//   backgroundImage: any;
//   frontText: any;
//   backText: any;
//   action?:any
// }

// const HoverCardF: React.FC<HeaderProps> = (props: HeaderProps) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const { id, width, height, backgroundImage, frontText, backText , action} = props;

//   return (
//     <Card
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       sx={{
//         width: `${width}px` || 580,
//         height: `${height}px` || 373,
//         display: "flex",
//         justifyContent: "start",
//         alignItems: "left",
//         backgroundColor: isHovered ? "#007BFF" : "#fff",
//         color: isHovered ? "#fff" : "#333",
//         transition: "background-color 0.3s ease, color 0.3s ease",
//         cursor: "pointer",
//         boxShadow: 3,
//         backgroundImage: `url(${backgroundImage})`,
//         backgroundSize: "cover",
//         borderRadius: "10px",
//       }}
//        onClick={()=>action({backText:backText, id:id})}
//     >
//       <CardContent>
//         <Typography
//           variant="h5"
//           component="div"
//           sx={{ color: "#fff", margin: "88px 60px 45px 4px" }}

//         >
//           {isHovered
//             ? frontText || "DYNAMIC DESCRIPTION"
//             : backText || "GENERATOR"}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// export default HoverCardF;

import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";

interface HeaderProps {
  id: any;
  width: any;
  height: any;
  frontBackgroundImage?: any;
  backgroundImage: any;
  article_name: any;
  article_description: any;
  flow: any;
  action?: any;
}

const HoverCardF: React.FC<HeaderProps> = (props: HeaderProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    id,
    width,
    height,
    frontBackgroundImage,
    backgroundImage,
    article_name,
    article_description,
    flow,
    action,
  } = props;

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: { xs: "95%", sm: "80%", md: `${width}px` },
        height: { xs: "auto", sm: "auto" },
        minHeight: `${height}px`,
        display: "flex",
        flexDirection: "column",
        backgroundColor: isHovered ? "#000" : "#fff",
        color: isHovered ? "#fff" : "#333",
        transition: "background-color 0.3s ease, color 0.3s ease",
        cursor: "pointer",
        boxShadow: 3,
        backgroundImage: isHovered
          ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${frontBackgroundImage})`
          : `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "10px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "16px",
          justifyContent: isHovered ? "space-between" : "center",
        }}
      >
        {/* Title - Always visible */}
        <Box
          sx={{
            flex: isHovered ? 0 : 1,
            display: "flex",
            alignItems: isHovered ? "flex-start" : "center",
            justifyContent: isHovered ? "flex-start" : "center",
            minHeight: isHovered ? "auto" : "100%",
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              color: "#fff",
              fontSize: { xs: "1.6rem", lg: "2.5rem" },
              fontWeight: "800",
              textTransform: "uppercase",
              textAlign: isHovered ? "left" : "center",
              wordBreak: "break-word",
              padding: isHovered ? "0" : "16px 0",
              lineHeight: "1.2",
            }}
          >
            {article_name || "GENERATOR"}
          </Typography>
        </Box>

        {isHovered && (
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              mb: 2,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <Typography
              variant="body1"
              component="div"
              sx={{
                color: "#fff",
                fontSize: { xs: "1.2rem", lg: "1.6rem" },
                lineHeight: "normal",
              }}
            >
              {article_description || "GENERATOR"}
            </Typography>
          </Box>
        )}

        {isHovered && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => action(props)}
              sx={{
                textTransform: "none",
                padding: 0,
                minWidth: "auto",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
                fontSize: { xs: "1.2rem", lg: "1.6rem" },
              }}
            >
              {"See Detail ->"}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default HoverCardF;
