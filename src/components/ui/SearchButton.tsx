import FaceRetouchingNaturalRoundedIcon from "@mui/icons-material/FaceRetouchingNaturalRounded";
import { useKBar } from "kbar";
import "./styles/searchButton.css";
import { useMyContext } from "../../providers/MyContext";

const SearchButton = () => {
  const { query } = useKBar();
  const { setIsTakeInput } = useMyContext();

  const onFaceRetouchIconClick = () => {
    setIsTakeInput(false);
    query.toggle();
  };
  
  return (
    <button className="chatbot__button" onClick={onFaceRetouchIconClick}>
      <FaceRetouchingNaturalRoundedIcon />
    </button>
  );
};

export default SearchButton;
