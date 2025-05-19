import React, { useState, useEffect } from "react";
import "./index.scss";
import { Typography, Box, useMediaQuery } from "@mui/material";
import Logo from "../../assets/logo.svg";
import Countdown from "./Countdown";
import CallToActions from "./CallToActions";
import ByteIcon from "./ByteIcon";
import TypeWriter from "./TypeWriter";
import DragAndDropPage from "./DragAndDrop";
import axiosConfig from "../../services/axiosConfig";
import { AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";
import { getUserOnboardingStage } from "../../services/userAgentService";
import { getSessionId, setSessionId } from "../../utils/sessionUtils";
import BackButton from "./BackButton";
import { getIconFromRegistry } from "./Icons";
import storageUtil from "../../utils/localStorageUtil";
import ByteSizedAIintroWrapper from "./ByteSizedAIintroWrapper";
import Survey from "./Survey";
import Loader from "../../components/ui/Loader";
import TypeWriterEffect from "./TypeWriterEffect";
import theme from "../../components/theme/theme";

// Generate the session ID on the frontend
const generateSessionId = () => {
  return uuidv4();
};

interface CarouselSlideData {
  content: string;
}

type Agent = {
  agent_name: string;
  tooltip: string;
  category: string;
  use_cases: string[];
  position: number;
  icon_link: string;
  description: string;
  _id: string;
};

type CategoryMap = {
  [category: string]: {
    id: string;
    agent_name: string;
    category: string;
    description: string;
    icon_link: string;
    position: number;
    tooltip: string;
    use_cases: string[];
    icon: React.ReactElement | null; // Changed from JSX.Element to React.ReactElement
  }[];
};

interface SelectedField {
  agent_id: string;
  selected_choices: string;
}

interface Payload {
  session_id: string;
  email_id?: string;
  agent_ids: string[];
}

type UserAgentUpdateResponse = {
  session_id: string;
  user_id: string | null;
  email_id: string | null;
  agent_ids: string[];
  selected_fields: SelectedField[];
  _id: string;
};

export enum AppStage {
  STAGE_ONE = "first_page",
  STAGE_TWO = "agent_confirmation_page",
  STAGE_THREE = "agent_option_page",
  STAGE_FOUR = "eoi_intro_page",
}

const ExpressionOfInterest: React.FC = () => {
  const [currentDiv, setCurrentDiv] = useState<number>(0);
  const [nextClick, setNextClick] = useState<boolean>(false);
  const [list, setList] = useState<any[]>([]);
  const [showCallToAction, setCallToAction] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [questionsList, setQuestionsList] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [selectedAgents, setSelectedAgent] = useState([]);
  const [userAgentSelectionId, setUserAgentSelectionId] = useState("");
  const [sessionId, setSessionIdState] = useState<string>(() => {
    const storedSessionId = getSessionId();
    if (storedSessionId) {
      return storedSessionId;
    }
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    return newSessionId;
  });
  const [mappedAgentsData, setMappedAgentsData] = useState<any>({});
  const [currentStage, setCurrentStage] = useState<any>(AppStage.STAGE_ONE);
  const [showImressiveChoice, setImpressiveChoice] = useState(true);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const stages = [
    AppStage.STAGE_ONE,
    AppStage.STAGE_TWO,
    AppStage.STAGE_THREE,
    AppStage.STAGE_FOUR,
  ];

  const handleBackButtonClick = () => {
    const currentStageIndex = stages.indexOf(currentStage);
    if (currentStageIndex > 0) {
      setCurrentStage((prevStage: any) => {
        if (prevStage === AppStage.STAGE_THREE) {
          setImpressiveChoice(false);
        }
        return stages[currentStageIndex - 1];
      });
    }
  };

  const isBackButtonVisible = currentStage !== AppStage.STAGE_ONE;

  useEffect(() => {
    const getAgentsData = async () => {
      const payload = {
        offset: 0,
        limit: 50,
        sortBy: "position",
        sortOrder: 1,
        filters: "learning_based",
      };
      try {
        const result = await axiosConfig.post("/v1/agents/get", payload);
        setData(result);
      } catch (err: any) {
        setError(err?.message);
      }
    };

    const getUserOnboardingStages = async () => {
      const payload = {
        session_id: sessionId,
      };
      setLoading(true)
      try {
        const result = await getUserOnboardingStage(payload);
        if ((result as any)?.stage !== AppStage.STAGE_ONE) {
          setCurrentDiv(4);
        }
        else{
          setCurrentDiv(0)
        }
        setCurrentStage((result as any).stage);
      } catch (err: any) {
        setError(err?.message);
      } finally {
        setLoading(false);
      }
    };

    getAgentsData();
    getUserOnboardingStages();
  }, [sessionId]);

  const mapItemsToCategories = (items: Agent[]): CategoryMap => {
    return items?.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push({
        id: item._id,
        agent_name: item.agent_name,
        category: item.category,
        description: item.description,
        icon_link: item.icon_link,
        position: item.position,
        tooltip: item.tooltip,
        use_cases: item.use_cases,
        icon: getIconFromRegistry(item.icon_link, 18, "#FFFFFF"),
      });
      return acc;
    }, {} as CategoryMap);
  };

  useEffect(() => {
    const storedMappedAgentsData =
      storageUtil.getItemSession("mappedAgentsData");
    if (
      storedMappedAgentsData &&
      Object.keys(storedMappedAgentsData as any).length !== 0
    ) {
      setMappedAgentsData(storedMappedAgentsData);
    } else {
      const mappedData = mapItemsToCategories(data?.items);
      setMappedAgentsData(mappedData);
      storageUtil.setItemSession("mappedAgentsData", mappedData);
    }
  }, [data]);

  useEffect(() => {
    if (mappedAgentsData) {
      storageUtil.setItemSession("mappedAgentsData", mappedAgentsData);
    }
  }, [mappedAgentsData]);

  const mapAgentDataToCarouselSlides = (
    agentData: CategoryMap
  ): CarouselSlideData[] => {
    return (
      agentData &&
      Object.keys(agentData).map((category) => ({
        content: category,
      }))
    );
  };

  const carouselSlidesData = mapAgentDataToCarouselSlides(mappedAgentsData);

  const divs: React.ReactElement[] = [ // Changed from JSX.Element[] to React.ReactElement[]
    <div key="1" className="eoi-page">
      <div className="logo">
        <Box
          component="img"
          src={Logo}
          alt="Description of the image"
          sx={{
            width: "100%",
            maxWidth: { xs: "300px", sm: "450px", md: "625px" },
            height: "auto",
          }}
        />
      </div>
      <div className="">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="subtitle1"
            sx={{
              display: "inline-block",
              fontSize: {
                xs: "18px",
                sm: "30px",
                md: "38px",
              },
              paddingLeft: {
                xs: "55px",
                sm: "30px",
                md: "82px",
              },
              textShadow: "0 0 15px #fff, 0 0 25px #ffcc00, 0 0 35px #ff9900",
            }}
            className="animated-text"
          >
            <span className="word">Powered</span>
            <span className="word"> by</span>
            <span className="word"> Byte</span>
          </Typography>
          <Box className="word" sx={{ paddingLeft: "10px" }}>
            <ByteIcon size={48} />
          </Box>
        </Box>
      </div>
    </div>,
    <div key="2"></div>,
    <div key="3" className="eoi-page">
      <Countdown />
    </div>,
    <div key="4" className="eoi-page">
      <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
        <Box sx={{ position: "absolute" }}>
          <ByteIcon size={72} />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            paddingLeft: { xs: "40px", sm: "80px" },
            fontSize: { xs: "14px", sm: "18px" },
            width: { xs: "21.5rem", sm: "39rem", md: "48.0rem", lg: "50.5rem" },
          }}
        >
          <TypeWriterEffect
                text=" How about we explore ways to make AI work for you?"
                speed={50}
                customFontsize={isMobile ? "18px" : "33px"}
              />
        </Box>
      </Box>
    </div>,
  ];

  const [uiScreens, setUiScrees] = useState<any>(divs);

  useEffect(() => {
    let timer: any;
  
    if (!loading) {
      if (currentDiv === 0) {
        setTimeout(() => {
          setCurrentDiv((prev) => prev + 1);
        }, 6000);
      } else {
        timer = setInterval(() => {
          setCurrentDiv((prev) => {
            if (prev <= uiScreens.length - 1) {
              return prev + 1;
            } else {
              clearInterval(timer);
              return prev;
            }
          });
        }, 4000);
      }
    }
  
    return () => clearInterval(timer);
  }, [loading, uiScreens.length, currentDiv]);
  
  

  useEffect(() => {
    const mappedOptionsList = list.map((item) => {
      return {
        title: item?.agent_name,
        options: item?.use_cases,
        agent_id: item?.id,
        tooltipText: item?.tooltip,
        icon: getIconFromRegistry(item.icon_link, 18, "#FFFFFF"),
      };
    });

    const selectedAgentsIds = list.map((item) => item.id);
    setQuestionsList(mappedOptionsList as any);
    setSelectedAgent(selectedAgentsIds as any);
  }, [list]);

  const updateUserAgents = async (
    payload: Payload
  ): Promise<AxiosResponse<any>> => {
    try {
      const response = await axiosConfig.post<any>("/v1/user-agents", payload);
      return response;
    } catch (error) {
      console.error("Error updating user agents:", error);
      throw error;
    }
  };

  const handleNextBtnClick = async () => {
    setNextClick(true);

    const payload = {
      session_id: sessionId,
      agent_ids: selectedAgents,
    };

    setError(null);
    setCurrentStage(AppStage.STAGE_TWO);

    storageUtil.setItemSession("survey", JSON.stringify(questionsList));

    try {
      const response = await updateUserAgents(payload);
      setUserAgentSelectionId((response as any)?._id);
      storageUtil.setItemSession("db_id", (response as any)?._id);
      setSuccess(true);
    } catch (error) {
      setError("Failed to update user agents");
    } finally {
    }
  };

  const handleGoBtnClick = () => {
    setCallToAction(false);
    setCurrentStage(AppStage.STAGE_FOUR);
  };

  let showForm = currentDiv === uiScreens.length;

  const sentences = [
      <TypeWriterEffect
      text="Let's get started…"
      speed={50}
      customFontsize={isMobile ? "18px" : "33px"}
    />
    ,
  ];

  if (
    currentDiv == 1 &&
    currentStage === AppStage.STAGE_ONE &&
    !showForm &&
    !loading
  ) {
    return <TypeWriter sentences={sentences} />;
  }


  return (
    <>
      {!loading ? (
        <div>
          {!showForm && uiScreens[currentDiv]}
          {showForm && (
            <Box
              className="eoi-page"
              sx={{ flexDirection: { xs: "row", md: "column" } }}
            >
              {currentStage !== AppStage.STAGE_FOUR && (
                <BackButton
                  onClick={handleBackButtonClick}
                  isVisible={isBackButtonVisible}
                />
              )}
              {currentStage === AppStage.STAGE_ONE && (
                <DragAndDropPage
                  carouselSlidesData={carouselSlidesData}
                  handleNextBtnClick={handleNextBtnClick}
                  mappedAgentsData={mappedAgentsData}
                  setMappedAgentsData={setMappedAgentsData}
                  setQuestionsList={setQuestionsList}
                  setSelectedAgent={setSelectedAgent}
                  setList={setList}
                  list={list}
                />
              )}
              {currentStage === AppStage.STAGE_TWO && (
                <Survey
                  list={questionsList}
                  setCallToAction={setCallToAction}
                  selectedAgents={selectedAgents}
                  sessionId={sessionId}
                  userAgentSelectionId={userAgentSelectionId}
                  setCurrentStage={setCurrentStage}
                  showImressiveChoice={showImressiveChoice}
                />
              )}
              {currentStage === AppStage.STAGE_THREE && (
                <CallToActions
                  handleGoBtnClick={handleGoBtnClick}
                  sessionId={sessionId}
                />
              )}
              {currentStage === AppStage.STAGE_FOUR && (
                <ByteSizedAIintroWrapper />
              )}
            </Box>
          )}
        </div>
      ) : (
        <div className="eoi-page">
          <Loader />
        </div>
      )}
    </>
  );
};

export default ExpressionOfInterest;