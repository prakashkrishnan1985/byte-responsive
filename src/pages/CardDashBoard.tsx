import ConceptCard from "../components/ui/Card";
import { Box, Button, Divider, Grid2, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useKBar } from "kbar";
import { useMyContext } from "../providers/MyContext";

const cardData = [
  {
    title: "Transformative Data Engine1",
    description:
      "Unlock the power of your data with our AI Concept Application! This innovative tool seamlessly translates data",
  },
  {
    title: "Transformative Data Engine2",
    description:
      "Unlock the power of your data with our AI Concept Application! This innovative tool seamlessly translates data",
  },
  {
    title: "Transformative Data Engine3",
    description:
      "Unlock the power of your data with our AI Concept Application! This innovative tool seamlessly translates data",
  },
  {
    title: "Transformative Data Engine4",
    description:
      "Unlock the power of your data with our AI Concept Application! This innovative tool seamlessly translates data",
  },
  {
    title: "Transformative Data Engine5",
    description:
      "Unlock the power of your data with our AI Concept Application! This innovative tool seamlessly translates data",
  },
];

export default function CardDashBoard({
  disableCustomTheme,
}: any) {

  const navigate = useNavigate();

  const { query } = useKBar((state) => ({
    disabled: state.disabled,
  }));


  const { setIsTakeInput } = useMyContext();

  const onAiConceptCreateBtnClick = () => {
      setIsTakeInput(true);
      query.toggle();
      //navigate(`/Conceptualize`)
  }

  return (
    <>
      <>
        <Grid2 sx={{display:'flex', width:'100%', justifyContent:'flex-end'}} mt={2}>
        <Button
          variant="contained"
          size="medium"
          onClick={onAiConceptCreateBtnClick}
          sx={{ padding: "8px", background: "#377610", marginLeft:"8px"  }}
        >
          Create New AI Concept
        </Button>
        </Grid2>
        <Typography ml={2} variant="h6" sx={{ color: "text.secondary" }}>
          Live
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            padding: "10px, 10px, 10px, 10px",
          }}
        >
          {cardData.map((item) => (
            <ConceptCard {...item} live={true}></ConceptCard>
          ))}
        </Box>
        <Divider />
      </>
      <>
        <Typography ml={2} variant="h6" sx={{ color: "text.secondary" }}>
          Draft
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            padding: "10px, 10px, 10px, 10px",
          }}
        >
          {cardData.map((item) => (
            <ConceptCard {...item} live={false}></ConceptCard>
          ))}
        </Box>
        <Divider />
      </>
    </>
  );
}
