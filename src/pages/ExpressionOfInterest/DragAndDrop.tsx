import React, { useEffect, useState } from "react";
import { Box, Slide, Typography } from "@mui/material";
import { BsArrowUpRight } from "react-icons/bs";
import Carousel from "../../components/ui/Carousel";
import ByteIcon from "./ByteIcon";
import DragDropList from "../../components/dragDropList/index";

type DragAndDropPageProps = {
  carouselSlidesData: any[];
  mappedAgentsData: any;
  setMappedAgentsData: any;
  handleNextBtnClick: () => void;
  setQuestionsList: any;
  setSelectedAgent: any;
  list: any;
  setList: any;
};

const DragAndDropPage: React.FC<DragAndDropPageProps> = ({
  carouselSlidesData,
  mappedAgentsData,
  setMappedAgentsData,
  handleNextBtnClick,
  list,
  setList
}) => {
  const [category, setCategory] = useState<string>(
    carouselSlidesData[0]?.content
  );

  const clickNextBtn = () => {
    handleNextBtnClick();
  };

  return (
    <div className="drag-and-drop-page">
      <Box className="text-center" sx={{paddingTop:{xs:"10px", md:"12px"}}}>
        <ByteIcon size={52} />
        <Typography
          variant="h4"
          sx={{
            display: "inline",
            fontSize: { xs: "18px", sm: "33px" },
            paddingLeft: {xs:"1px", sm:'10px', md:"10px"},
            textAlign: "center",
            width: {xs:"329px", md:"100%"},
            marginTop: { xs: "10px", sm: "0" }
          }}
        >
      Which AI model or agent would you like to use to build impactful features?
        </Typography>
      </Box>
      <Typography
          variant="subtitle1"
          sx={{
            display: "inline-block",
            paddingTop: "10px",
            fontSize: {
              xs: "12px",  
              sm: "14px", 
              md: "20px", 
            },
            textAlign: "center",
            marginTop: "10px",
            width: { xs: "99%", md: "100%" },
          }}
        >
      Drag and drop up to 4 models or agents into the box to continue. Changed your mind? Simply drag them back out!
        </Typography>
      <div className="carousel-container">
        <Carousel slides={carouselSlidesData} setCategory={setCategory} />
      </div>
      <div className="drag-drop-list">
        <DragDropList
          list={setList}
          mappedAgentsData={mappedAgentsData}
          setMappedAgentsData={setMappedAgentsData}
          category={category}
        />
      </div>
      <div className="left-size-text">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
        </Box>
      </div>
      {list.length === 4 && (
        <div
          onClick={clickNextBtn}
          className="next-button1"
        >
          Next <BsArrowUpRight />
        </div>
      )}
    </div>
  );
};

export default DragAndDropPage;
