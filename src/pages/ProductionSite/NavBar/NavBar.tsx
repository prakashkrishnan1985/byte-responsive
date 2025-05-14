import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
} from "@mui/material";
import logoWithText from "../../assets/logo-black.png";
import { useNavigate, useLocation } from "react-router-dom";
import GetInTouch from "./GetInTouch";
import Nav from "./Nav";
import HomeLogo from "./HomeLogo";
import theme from "../../../components/theme/theme";
const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const widgetRef = useRef<HTMLDivElement | null>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if mobile screen
  const headerColor = isMobile ? "#bb86fc0a" : "white"; // Set color based on screen size

  useEffect(() => {
    const WIDGET_TAG = "elevenlabs-convai";
    const SCRIPT_SRC = "https://elevenlabs.io/convai-widget/index.js";
    const AGENT_ID = "6CYNuHj5DQqnC2P7IFt1";

    const styleWidget = () => {
      const interval = setInterval(() => {
        const widget: any = document.querySelector(WIDGET_TAG);
        if (widget?.shadowRoot) {
          const poweredBy = widget.shadowRoot.querySelector(
            '[class^="_poweredBy"]'
          );
          if (poweredBy) {
            poweredBy.remove();
            clearInterval(interval);
          }
          // Move the host element to the top of the page
          // If internal container exists inside shadowRoot, move that too
          const innerContainer = widget.shadowRoot.querySelector(
            '[class*="container"], [class*="Container"], div'
          );
          const el = innerContainer as HTMLElement;

          if (isMobile && innerContainer) {
            el.style.display = "none";

            window.addEventListener("scroll", () => {
              if (window.scrollY >= window.innerHeight) {
                el.style.position = "fixed";
                el.style.left = "50%";
                el.style.transform = "translateX(-50%)";
                el.style.zIndex = "9999";
                el.style.bottom = "0px";
                el.style.display = "block";
              } else {
                el.style.display = "none";
              }
            });
          } else {
            widget.style.position = "fixed";
            widget.style.top = "0";
            widget.style.bottom = "auto";
            widget.style.right = "0";
            widget.style.left = "auto";
            widget.style.zIndex = "9999";
            if (innerContainer) {
              el.style.position = "fixed";
              el.style.top = "-40px";
              el.style.bottom = "auto";
              el.style.right = "20px";
              el.style.left = "auto";
              el.style.zIndex = "9999";
            }
          }
        }
      }, 500);
    };

    if (customElements.get(WIDGET_TAG)) {
      styleWidget();
      return;
    }

    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.type = "text/javascript";

      script.onload = () => {
        const waitForDefinition = setInterval(() => {
          if (customElements.get(WIDGET_TAG)) {
            const widget = document.createElement(WIDGET_TAG);
            widget.setAttribute("agent-id", AGENT_ID);
            document.body.appendChild(widget);
            styleWidget();
            clearInterval(waitForDefinition);
          }
        }, 100);
      };

      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      <Box>
        <AppBar
          position="static"
          style={{
            background:
              location.pathname === "/privacy" ||
              location.pathname === "/calltoactions" ||
              location.pathname === "/beta" ||
              location.pathname.startsWith("/blog/")
                ? "#000"
                : headerColor,
            paddingLeft: "20px",
            border: "none",
            boxShadow: "none",
            padding: "10px 0",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <HomeLogo />
            <Nav
              color={
                location.pathname === "/privacy" ||
                location.pathname === "/calltoactions" ||
                location.pathname === "/beta" ||
                location.pathname.startsWith("/blog/")
                  ? "#fff"
                  : "black"
              }
            />
            {/* <GetInTouch /> */}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Navbar;
