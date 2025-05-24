// @ts-nocheck
import {
  Link,
  Routes,
  Route,
  Router,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import CardDashBoard from "./pages/CardDashBoard";
import SignInSide from "./components/sign-in-side/SignInSide";
import Login from "./login/page";
import SignUp from "./components/sign-up/SignUp";
import SearchButton from "../src/components/ui/SearchButton";
import Profile from "./components/profile/Index";
import { useEffect, useState } from "react";
import KbarSearch from "./components/kbarsearch/kbarSearch";
import { KBarProvider, useKBar, useRegisterActions } from "kbar";
import { useMyContext } from "./providers/MyContext";
import ExpressionOfInterest from "./pages/ExpressionOfInterest/index";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../src/components/theme/theme";
import LandingPage from "./pages/LadingPage/Index";
import ModalChooseForm from "./pages/Widgets/ModalChooseForm";
import ChatWidget from "./pages/Widgets/ChatWidget";
import SpotlightSearchWidget from "./pages/Widgets/SpotlightSearchWidget";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./components/ui/styles/Global.scss";
import Documentation from "./pages/Documentation/index";
import ProtectedRoute from "./routes/ProtectedRoute";
import DesktopOnlyView from "./components/desktopOnlyView/DesktopOnlyView";
import ForgotPassword from "./components/sign-in-side/ForgotPassword";
import IdealiseChat from "./components/idealiseChat/IdealiseChat";
import Develop from "./components/develop/Develop";
import ProductionSite from "./pages/ProductionSite/index";
import UseCaseSite from "./pages/ProductionSite/UseCasePage/index";
import PrivacyPage from "./pages/ProductionSite/privacyPage";
import Privacy from "./pages/ProductionSite/privacy/privacy";
import ArticlePage from "./pages/ProductionSite/article";
import Navbar from "./pages/ProductionSite/NavBar/NavBar";
import AIJourney from "./pages/ProductionSite/AIJourney/AIJourney";
import { useDataFlow } from "./providers/FlowDataProvider";
import ParallaxScroll from "./pages/test/test";
import AddBlog from "./pages/ProductionSite/AddBlog";
import BlogList from "./pages/ProductionSite/BlogList";
import HomePage from "./pages/HomePage/Index";
import CallToActions from "./pages/ProductionSite/CallOfAction/CallToActions";
import StripeProvider from "./components/Stripe/StripeProvider";
import Success from "./components/Stripe/Success";
import Checkout from "./components/Stripe/Checkout";
import SubscriptionPlans from "./components/Stripe/SubscriptionPlans";
import PricingPlans from "./components/Stripe/PricingPlan";
import CreditAdminDashboard from "./components/StripeDashboard/CreditAdminDashboard";
import CreditDashboard from "./components/StripeDashboard/CreditDashboard";
import CreditUsageHistory from "./components/Stripe/CreditUsageHistory";
import PurchaseCreditsPage from "./components/Stripe/PurchaseCreditsPage";
import { ROUTES } from "./constants/Routes";
import AutoFaceCapture from "./pages/components/AutoFaceCapture"
import LeadCaptureScreen from "./pages/components/LeadCaptureScreen";
import DEMOSITE from "./pages/ProductionSite/Demo/components/LeadCaptureScreen"
import LOCALDEMO from "./pages/local-demo/LocalLeadCaptureScreen"

{/* <Route path="/" element={<AutoFaceCapture />} /> */}

function normalizePath(pathname) {
  return pathname.toLowerCase();
}

const actionsInit = [
  {
    id: "login",
    name: "Login",
    shortcut: ["L"],
    keywords: "sign up",
    perform: () => (window.location.pathname = "Login"),
    section: "Actions",
  },
  {
    id: "Concpetualize",
    name: "Concpetualize",
    shortcut: ["cp"],
    keywords: "concept",
    perform: () => (window.location.pathname = "Conceptualize"),
    section: "Actions",
  },

  {
    id: "more-resources",
    name: "More resources",
    shortcut: ["M"],
    keywords: "More resources",
    perform: () => (window.location.pathname = "Login"),
    section: "Other Links",
  },
  {
    id: "tutotrials",
    name: "Tutotrials",
    shortcut: ["T"],
    keywords: "tutotrials",
    perform: () => (window.location.pathname = "Conceptualize"),
    section: "Other Links",
  },
];

const actionsForInputTitle = [
  {
    id: "input-box-concept-title",
    name: "What is an Concept ?",
    shortcut: ["CN"],
    keywords: "What is a Concpetualization",
    perform: () => (window.location.pathname = "Login"),
    // section: "Input Description",
    data: "An AI concept enables users to create, train, and deploy AI applications with ease.",
  },
];

const actionsForInputDescription = [
  {
    id: "input-box-concept-description",
    name: "What is a Concept description?",
    shortcut: ["CN"],
    keywords: "What is an Concpetualization",
    perform: () => (window.location.pathname = "Login"),
    // section: "Input Description 2",
    data: "An AI concept is a fundamental framework that empowers users to easily create, train, and deploy artificial intelligence applications. It encompasses key elements that facilitate the development process, including",
  },
];

const apiResponse = {
  query: "What is an AI Concept",
  relevantResponses: {
    type: "text",
    response: "An AI Concept is bleh bleh",
  },
  closeMatches: ["", "", ""],
  referenceMaterial: [
    {
      type: "text",
      title: "Need help?",
    },
    {
      type: "text",
      title: "How to creart steps?",
    },
    {
      type: "image",
      title: "Need Help",
      url: "https://picsum.photos/id/2/200/300",
      thumbnailUrl: "https://picsum.photos/id/1/200/300",
    },
    {
      type: "image",
      title: "Steps to complete flow",
      url: "https://picsum.photos/id/4/200/300",
      thumbnailUrl: "https://picsum.photos/id/10/200/300",
    },
    {
      type: "video",
      title: "Step to create flow in byte ui",
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "https://picsum.photos/id/7/200/300",
    },
    {
      type: "video",
      title: "How to create new concept?",
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "https://picsum.photos/id/13/200/300",
    },
  ],
};

const mapApiResponseToActions = (response: any) => {
  const actions = [...actionsInit];

  actions.push({
    id: "relevantResponse",
    name: response.relevantResponses.response,
    icon: null,
    hasMedia: false,
    section: "Search Result",
    type: response.relevantResponses.type,
    perform: () => {
      console.log("Performing relevant response action");
    
    },
  });


  response.referenceMaterial.forEach((item: any) => {
    actions.push({
      id: item.url,
      name: `${item.title}`,
      icon:
        item.type === "image" || item.type === "video" ? (
          <img
            src={item.thumbnailUrl}
            alt="Thumbnail"
            style={{ width: "100px", height: "100px" }}
          />
        ) : null,
      hasMedia: item.type === "image" || item.type === "video",
      section: "Reference Material",
      type: item?.type,
      url: item.url,
      perform: () => {
        console.log(`Opening ${item.type} at ${item.url}`);
       
      },
    });
  });

  return actions;
};


const actions = mapApiResponseToActions(apiResponse);

function App() {
  const [pills, setPills] = useState([]);
  const [actionsData, setActionsData] = useState(actions);
  const { query } = useKBar();

  const { isTakeInput, isDescriptionMode, isGoButtonEnable } = useMyContext();

  useEffect(() => {
    if (isTakeInput) {
      setActionsData(actionsForInputTitle);

      if (isDescriptionMode) {
        setActionsData(actionsForInputDescription);
      }
      if (isGoButtonEnable) {
        setActionsData(actions);
      }
    } else {
      setActionsData(actions);
    }
  }, [isTakeInput, query, isDescriptionMode]);

  const location = useLocation();
  const { pathname } = location;
  const { conceptId, blogId } = useDataFlow();
  const normalizedPath = normalizePath(location.pathname);

  console.log("pathname", pathname);

  return (
    <ThemeProvider theme={theme}>
      {(normalizedPath === ROUTES.HOME ||
        normalizedPath === ROUTES.ARTICLE ||
        normalizedPath === ROUTES.USE_CASES_PAGE ||
        normalizedPath === ROUTES.PRIVACY_PAGE ||
        normalizedPath === ROUTES.PRIVACY ||
        normalizedPath === ROUTES.TEST ||
        normalizedPath === ROUTES.ADD_BLOG ||
        normalizedPath === ROUTES.CALL_TO_ACTIONS ||
        normalizedPath === ROUTES.BETA ||
        normalizedPath === ROUTES.BLOGS ||
        normalizedPath.startsWith("/blog/")) && <Navbar />}

      <KBarProvider>
        <KbarWrapper actions={actionsData} />
        <ToastContainer />
        <div className="App">
          <KbarSearch pills={pills} setPills={setPills} />

          <Routes>
            <Route path={ROUTES.HOME} element={<ProductionSite />} />
            <Route path={ROUTES.USE_CASES_PAGE} element={<UseCaseSite />} />
            <Route path={ROUTES.PRIVACY_PAGE} element={<PrivacyPage />} />
            <Route path={ROUTES.BLOG_DETAIL} element={<ArticlePage />} />
            <Route path={ROUTES.BLOGS} element={<BlogList />} />
            <Route path={ROUTES.PRIVACY} element={<Privacy />} />
            <Route path={ROUTES.ARTICLE} element={<ArticlePage />} />
            <Route path={ROUTES.CALL_TO_ACTIONS} element={<CallToActions />} />
            <Route path={ROUTES.BETA} element={<CallToActions />} />
            <Route path={ROUTES.LEADCAPTURESCREEN} element={<LeadCaptureScreen />} />
            <Route path={ROUTES.DEMOSITE} element={<DEMOSITE />} />
            <Route path={ROUTES.LOCALDEMO} element={<LOCALDEMO />} />
          </Routes>

          {pathname != "/eoi" &&
            pathname != "/" &&
            pathname != "/Landing" &&
            pathname != "/chat-widget" &&
            pathname != "/Widgets" &&
            pathname != "/search-widget" && <SearchButton />}
        </div>
      </KBarProvider>
      {(normalizedPath === ROUTES.HOME ||
        normalizedPath === ROUTES.ARTICLE ||
        normalizedPath === ROUTES.USE_CASES_PAGE ||
        normalizedPath === ROUTES.PRIVACY_PAGE ||
        normalizedPath === ROUTES.PRIVACY ||
        normalizedPath === ROUTES.TEST ||
        normalizedPath === ROUTES.ADD_BLOG ||
        normalizedPath === ROUTES.CALL_TO_ACTIONS ||
        normalizedPath === ROUTES.BETA ||
        normalizedPath === ROUTES.BLOGS ||
        normalizedPath.startsWith("/blog/")) && <AIJourney />}
    </ThemeProvider>
  );
}

function KbarWrapper({ actions }) {
  // Register actions using useRegisterActions
  useRegisterActions(actions, [actions]);

  return null; // No UI for this component
}

export default App;
