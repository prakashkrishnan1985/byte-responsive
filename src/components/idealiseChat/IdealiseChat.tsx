import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { styled } from "@mui/system";
import BackgroundImage from "../../assets/backgroundImage.png";
import Chat from "../../components/chatArea/Index";
import { useMyContext } from "../../providers/MyContext";
import Logo from "../../assets/logo.svg";
import { Description } from "@mui/icons-material";
import ChatInput from "../ui/ChatInput";

interface CardItem {
  title: string;
  description: string;
}

const tableData: CardItem[] = [
  {
    title: "Description",
    description:
      "Lorem ipsum dolor sit amet consectetur. Lectus congue nibh faucibus consequat quis congue aliquet elit et. 1",
  },
  {
    title: "Act 1",
    description:
      "Lorem ipsum dolor sit amet consectetur. Lectus congue nibh faucibus consequat quis congue aliquet elit et.",
  },
  {
    title: "act 2",
    description:
      "Lorem ipsum dolor sit amet consectetur. Lectus congue nibh faucibus consequat quis congue aliquet elit et. 3",
  },
  {
    title: "act 4",
    description:
      "Lorem ipsum dolor sit amet consectetur. Lectus congue nibh faucibus consequat quis congue aliquet elit et. 4",
  },
];

const PageContainer = styled(Box)<{ fullHeight?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(props) => (props.fullHeight ? "100%" : "100vh")};
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const CarouselContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
`;

const CarouselWrapper = styled(Box)`
  display: flex;
  transition: transform 0.8s ease-in-out;
  align-items: center;
  justify-content: center;
  width: fit-content;
`;

const SpotlightCard = styled(Card)<{ isFocused: boolean }>`
  background-color: #27351b;
  transition: transform 0.3s ease, opacity 0.3s ease;
  width: 337px;
  height: 248px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  position: relative;
  cursor: pointer;
  border-radius: 20px;
  padding: 20px;

  ${({ isFocused }) =>
    isFocused
      ? `transform: translateY(-20px); opacity: 1;`
      : `opacity: 0.5;`}
`;

const PreviewTable = styled("div")`
  background-color: transparent;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  height: 271px;
  z-index: 2;
  border-top: 2px solid #505050;
  transition: opacity 0.5s ease-in-out;
`;

const StyledButton = styled(Button)`
  background-color: #2d6414;
  color: white;
  margin-top: 10px;
  &:hover {
    background-color: #24511b;
  }
`;

const DownArrowIcon = styled(ArrowDownwardIcon)`
  color: white;
  margin-top: 30px;
  margin-bottom: 30px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const IndicatorsContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const IndicatorLine = styled("div")<{ isActive: boolean }>`
  width: 25px;
  height: ${({ isActive }) => (isActive ? "5px" : "3px")};
  background-color: ${({ isActive }) => (isActive ? "#27351B" : "#ccc")};
  margin: 0 5px;
  transition: background-color 0.3s ease, height 0.3s ease;
  cursor: pointer;
`;


const IdealiseChat: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputText, setInputText] = useState<string>("");
  const { messages, setMessages, previewData } = useMyContext();

  const cardData = previewData?.map((item: any) => ({
    title: item.heading,
    description: item.summary,
  }));

  const tableSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (previewData?.length > 0) {
      tableSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [previewData]);

  useEffect(() => {
    if (cardData?.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cardData.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [cardData]);

  const handleCardClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
  };

  const visibleCards = [
    cardData?.[(currentIndex + cardData.length - 1) % cardData.length],
    cardData?.[currentIndex],
    cardData?.[(currentIndex + 1) % cardData.length],
  ];

  return (
    <PageContainer fullHeight={previewData?.length > 0}>
       <Box
        component="img"
        src={Logo}
        alt="Logo"
        sx={{
          width: { xs: "209px", sm: "200px", md: "250px" },
          height: { xs: "49px", sm: "55px", md: "35px" },
          background: 'transparent',
          marginTop:"0px",
          position:'fixed',
          top:30
        }}
      />
      <Chat width={"100vw"} messages={messages} setMessages={setMessages} />
      <Box
          sx={{ padding: 1 }}
          style={{
            backgroundColor: 'rgba(52, 52, 52)',
            border: "1px solid white",
            borderRadius: "16px",
            cursor: 'pointer',
            width: "820px",
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom:'100px'
          }}
        >
        <ChatInput
          width="909px"
          inputText={inputText}
          setInputText={setInputText}
          setMessages={setMessages}
        />
      </Box>

      {previewData?.length > 0 ? (
        <>
          <CarouselContainer>
            <CarouselWrapper>
              {visibleCards?.map((item, index) => (
                <SpotlightCard
                  key={index}
                  isFocused={index === 1}
                  onClick={() => handleCardClick(index)}
                >
                  <CardContent>
                    <Typography variant="h6" style={{ color: "white" }}>
                      {item?.title}
                    </Typography>
                    <Typography variant="body2" gutterBottom style={{ color: "white" }}>
                      {item?.description}
                    </Typography>
                    <StyledButton endIcon={<ArrowForwardIcon />}>See Concept</StyledButton>
                  </CardContent>
                </SpotlightCard>
              ))}
            </CarouselWrapper>
          </CarouselContainer>

          <IndicatorsContainer>
            {cardData?.map((_:any, index:any) => (
              <IndicatorLine
                key={index}
                isActive={index === currentIndex}
                onClick={() => handleIndicatorClick(index)}
              />
            ))}
          </IndicatorsContainer>

          {/* Apply fade transition */}
          <PreviewTable ref={tableSectionRef}>
            <Table size="small" sx={{ borderCollapse: "collapse", width: "100%" }}>
              <TableBody>
                <TableRow>
                  {previewData[currentIndex]?.orchestration?.map((item: any, index: any) => (
                    <TableCell
                      key={index}
                      sx={{
                        borderRight: index < 3 ? "1px solid #505050" : "none",
                        textAlign: "center",
                        padding: 2,
                        verticalAlign: "middle",
                        backgroundColor: "transparent",
                        color: "white",
                        borderBottom: "none",
                        marginTop: "20px",
                      }}
                    >
                      <Typography variant="h6">{item?.stage}</Typography>
                      <Typography variant="body2">{item?.description}</Typography>
                      <DownArrowIcon />
                      <StyledButton variant="contained" style={{ marginTop: 5 }}>
                        Green Button
                      </StyledButton>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </PreviewTable>

          <div
            style={{
              borderBottom: "2px solid gray",
              width: "1044px",
              marginBottom: "100px",
            }}
          />
        </>
      ) : (
        <Typography variant="h5" style={{ color: "white", textAlign: "center" }}>
          No data available at the moment.
        </Typography>
      )}
    </PageContainer>
  );
};

export default IdealiseChat;
