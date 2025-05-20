import React, { useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setsServiceNameState } from "../../../store/slice/documentsForGeneralConfigurationSlice";
import logo from "../../../assets/logo/ByteSizedAI.png";

interface NavProps {
  color: any;
}

const Nav: React.FC<NavProps> = (props: NavProps) => {
  const { color } = props;
  const [selected, setSelected] = useState("ABOUT"); // State to track the selected item
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  ); // State to control the mobile menu
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const getSelectedNavOption = useSelector(
    (state: any) => state.documentsForGeneralConfigurationSlice.serviceNameState
  );
  // Use MUI's useTheme and useMediaQuery for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Open mobile menu
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  // Close mobile menu
  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  // Handle click on a navigation item
  const handleClick = (item: string) => {
    setSelected(item); // Update the selected item
    dispatch(setsServiceNameState(item));
    // Determine the path to navigate based on the item clicked
    let path = "/"; // Default path
    if (item === "PRIVACY") {
      path = "/privacy";
    } else if (item === "USECASES") {
      path = "/usecases";
    } else if (item === "BLOGS") {
      path = "/blogs";
    }
    // else if (item === "ADD BLOG") {
    //   path = "/AddBlog";
    // }

    // Navigate to the determined path
    navigate(path);

    // Scroll to the top of the page if "PRIVACY" is clicked
    if (item === "PRIVACY") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (item === "USECASES") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (item === "HOME") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // If on the ProductPage, scroll to the corresponding section
    if (path === "/" && item !== "HOME") {
      const clearT = setTimeout(() => {
        document.getElementById(item.toLowerCase())?.scrollIntoView({
          behavior: "smooth",
        });
        clearTimeout(clearT);
      }, 1);
    }

    // Close the mobile menu after clicking a menu item
    if (isMobile) {
      handleMobileMenuClose();
    }
  };

  // Render the navigation items
  const renderNavItems = () => {
    return [
      "HOME",
      "ABOUT",
      "USECASES",
      "BLOGS",
      "CONTACT",
      "FAQ",
      "PRIVACY",
    ].map((item) => (
      <Typography
        key={item}
        component="a"
        href={`#${item.toLowerCase()}`}
        sx={{
          color: color,
          cursor: "pointer",
          position: "relative",
          textDecoration: "none",
          "&::after": {
            content: '""',
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "-5px", // Adjust this value to control the gap between text and underline
            height: "2px",
            backgroundColor:
              getSelectedNavOption === item ? "#800080" : "transparent", // Show underline if selected
            transition: "background-color 0.3s ease",
          },
          "&:hover::after": {
            backgroundColor: "#800080", // Show underline on hover
          },
          fontSize: "1.5rem",
        }}
        onClick={(e: any) => {
          e.preventDefault();
          handleClick(item);
        }}
      >
        {item}
      </Typography>
    ));
  };

  return (
    <>
      {/* Desktop Navigation */}
      {!isMobile && (
        <Box
          sx={{
            display: "flex",
            gap: 3,
            padding: "0 0",
            width: "100%",
            justifyContent: "center",
          }}
        >
          {renderNavItems()}
        </Box>
      )}

      {isMobile && (
        <div>
          <IconButton
            sx={{ color: color, position: "relative" }}
            onClick={
              mobileMenuAnchor ? handleMobileMenuClose : handleMobileMenuOpen
            } // Toggle the mobile menu on click
          >
            {mobileMenuAnchor ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose} // Close the mobile menu
            sx={{
              "& .MuiPaper-root": {
                width: "100vw",
                maxWidth: "100vw",
                height: "100vh",
                maxHeight: "100vh",
                backgroundColor: theme.palette.background.paper,
                margin: 0,
                top: "0 !important",
                left: "0 !important",
                padding: 0,
                overflow: "hidden", // Remove scroll
                borderRadius: "0",
              },
              "& .MuiBackdrop-root": {
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Gray background behind the popup
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh", // Cover the entire screen height
                width: "100vw", // Cover the entire screen width
                position: "relative",
                padding: "0.5rem", // Add padding around the content
                marginTop: "0", // Remove margin from the top
                left: 0,
                right: 0,
                overflow: "hidden", // Remove scroll
                backgroundColor: "transparent",
                borderRadius: "0", // Remove border radius
              }}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  top: "1rem", // Adjusted position for close button
                  right: "1.6rem",
                  color: color,
                }}
                onClick={handleMobileMenuClose}
              >
                <CloseIcon />
              </IconButton>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  marginBottom: "3rem",
                }}
              >
                <img
                  src={logo}
                  alt=""
                  height="70"
                  style={{ margin: "auto 0" }}
                />
              </Box>
              {[
                "HOME",
                "ABOUT",
                "USECASES",
                "BLOGS",
                "CONTACT",
                "FAQ",
                "PRIVACY",
              ].map((item, index, array) => (
                <MenuItem
                  key={item}
                  onClick={(e: any) => {
                    e.preventDefault();
                    handleClick(item);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    color: "#000",
                    justifyContent: "center",
                  }} // Center the text}}
                  sx={{
                    color: getSelectedNavOption === item ? "#800080" : color,
                    fontWeight:
                      getSelectedNavOption === item ? "bold" : "normal",
                    borderBottom:
                      index !== array.length - 1 ? "1px solid #e0e0e0" : "none", // Add bottom border except for the last item
                    padding: "1rem", // Add padding to each menu item
                  }}
                >
                  {item}
                </MenuItem>
              ))}
            </Box>
          </Menu>
        </div>
      )}
    </>
  );
};

export default Nav;
