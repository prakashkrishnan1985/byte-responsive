import {
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useKBar,
  useRegisterActions,
} from "kbar";
import RenderResults from "./RenderResults";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { useMyContext } from "../../providers/MyContext";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LinearProgress from "@mui/material/LinearProgress";

import "./KbarSearch.css";

interface Concept {
  name: string;
  description: string;
}

interface KbarSearchProps {
  pills: Concept[];
  setPills: Dispatch<SetStateAction<Concept[]>>;
}

export default function KbarSearch({ pills, setPills }: KbarSearchProps) {
  const {
    isTakeInput,
    setIsTakeInput,
    isDescriptionMode,
    setIsDescriptionMode,
    isGoButtonEnable,
    setIsGoButtonEnable,
  } = useMyContext();
  const [inputValue, setInputValue] = useState("");
  const [isTitleMode, setIsTitleMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [currentConcept, setCurrentConcept] = useState<Concept>({
    name: "",
    description: "",
  });

  const [customPlaceHolder, setCustomPlaceHolder] = useState(
    isTakeInput ? "Search something" : "enter concept title..."
  );

  const { query } = useKBar();

  const navigate = useNavigate();

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim()) {
      if (!isDescriptionMode) {
        // If in concept name mode, save the name and switch to description mode
        setCurrentConcept({ ...currentConcept, name: inputValue });
        setInputValue(""); // Clear the input
        setIsDescriptionMode(true); // Switch to description mode
        query.toggle();
        setTimeout(() => {
          query.toggle(); // Reopen KBar
          query.setSearch(""); // Clear the search input
        }, 400);
        setCustomPlaceHolder("enter description...");
      } else {
        // If in description mode, save the description and reset to concept name mode
        setCurrentConcept({ ...currentConcept, description: inputValue }); // Reset current concept
        setInputValue(""); // Clear the input
        setIsDescriptionMode(false); // Switch back to concept name mode
        query.setSearch(""); // Clear search
        setIsTitleMode(true);
        setIsGoButtonEnable(true);
        query.toggle(); // close KBar
        setTimeout(() => {
          query.toggle(); // Reopen KBar
          query.setSearch(""); // Clear the search input
        }, 400);
        setCustomPlaceHolder(
          "to create a new concept please click on the create new concept button..."
        );
        //query.toggle(); // Reopen KBar
      }
    }
    if (isGoButtonEnable) {
      setIsLoading(true)
      setTimeout(()=>{
        navigate(`/Conceptualize`);
        setIsTakeInput(false);
        setPills([]);
        query.toggle();
      },1300)
    }
  };

  useEffect(() => {
    setPills([currentConcept]);
  }, [currentConcept]);

  return (
    <KBarPortal>
      <KBarPositioner>
        <KBarAnimator
          className="command-search-container"
          style={{
            backgroundColor: "rgb(0, 0, 0, 0.12)",
            maxWidth: "800px",
            width: "100%",
            color: "rgb(11, 14, 20)",
            borderRadius: "8px",
            overflow: "hidden",
            backdropFilter: "saturate(300%) blur(25px)",
            opacity: 0,
            transform: " scale(0.99)",
            pointerEvents: "auto",
          }}
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{ display: "flex", alignItems: "center" }}
          >
            <KBarSearch
              placeholder="Type something..."
              value={inputValue}
              defaultPlaceholder={customPlaceHolder}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {/* <div className="placeholder-container">
             { isGoButtonEnable && <KeyboardArrowRightIcon className="hand-icon" />}
            </div> */}
            {isTakeInput && (
              <Button
                type="submit"
                className={isGoButtonEnable ? "hand-icon" : ""}
                style={{
                  padding: "8px 12px",
                  color: "black",
                  border: "none",
                  borderRadius: "30px",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                  backgroundColor: "var(--colors-command)",
                }}
              >
                {/* <ArrowCircleRightIcon sx={{ fontSize: "32px" }} /> */}
                {!isGoButtonEnable?<ArrowCircleRightIcon sx={{ fontSize: "32px" }} />:<span style={{background:'black', color:'white', borderRadius:"25px", fontSize:'10px', width:'150px', padding:"8px 12px"}}>Create Concept</span>}
              </Button>
            )}
          </form>
         {isLoading && <Box mt={"2px"} sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>}
          <RenderResults pills={pills} />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}
