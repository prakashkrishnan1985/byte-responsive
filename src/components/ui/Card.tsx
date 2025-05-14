import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import image from "../../assets/byteSizeAi.png";
import { useNavigate } from "react-router-dom";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));
interface props {
  title: string;
  description: string;
  live: boolean;
}
export default function ConceptCard(props: props) {
  const [expanded, setExpanded] = React.useState(false);
  const { title, description, live=false } = props;
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 268, margin: "12px" }} onClick={() => navigate(`/Conceptualize`)}>
      <CardHeader
        avatar={
          <Avatar className={`${live && 'circle'}`} sx={{ bgcolor: red[500], marginBottom:"20px" }} aria-label="recipe">
            <CardMedia
              component="img"
              height="60"
              image={image}
              alt="Paella dish"
            />
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={title}
        subheader="September 14, 2016"
      />
      <CardMedia component="img" height="140" image={image} alt="Paella dish" />
      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
