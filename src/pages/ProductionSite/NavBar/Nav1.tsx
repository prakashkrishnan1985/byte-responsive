import React, { useState } from "react";
import { Box, Typography, useMediaQuery, useTheme, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setsServiceNameState } from "../../../store/slice/documentsForGeneralConfigurationSlice";



interface NavProps {
  color: any;
}

const Nav: React.FC<NavProps> = (props: NavProps) => {
  const { color } = props;
  const [selected, setSelected] = useState("ABOUT"); // State to track the selected item
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null); // State to control the mobile menu
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const getSelectedNavOption = useSelector((state: any) => state.documentsForGeneralConfigurationSlice.serviceNameState);
  // Use MUI's useTheme and useMediaQuery for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    let path = "/ProductPage"; // Default path
    if (item === "PRIVACY") {
      path = "/privacy";
    } else if (item === "USECASES") {
      path = "/usecases";
    }

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
    if (path === "/ProductPage" && item !== "HOME") {
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
    return ['HOME', "ABOUT", "USECASES", "BLOG", "CONTACT", "FAQ", 'PRIVACY'].map((item) => (
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
            backgroundColor: getSelectedNavOption === item ? "#800080" : "transparent", // Show underline if selected
            transition: "background-color 0.3s ease",
          },
          "&:hover::after": {
            backgroundColor: "#800080", // Show underline on hover
          },
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
            justifyContent: "center",
            flexGrow: 1,
            gap: 3,
            paddingRight: "5rem",
            marginBottom: "1.1rem"

          }}
        >
          {renderNavItems()}
        </Box>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <>

          <IconButton
            sx={{ color: color, top: "0", right: "45px", position: "absolute" }}
            onClick={mobileMenuAnchor ? handleMobileMenuClose : handleMobileMenuOpen} // Toggle the mobile menu on click
          >
            {mobileMenuAnchor ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose} // Close the mobile menu
            sx={{
              "& .MuiPaper-root": {
                width: "99vw", // Set width to 100% of the viewport width
                maxWidth: "100vw", // Ensure max width is also 100% of the viewport width
                height: "100vh", // Set height to 100% of the viewport height
                backgroundColor: theme.palette.background.paper,
              },
            }}
          >
            {['HOME', "ABOUT", "USECASES", "BLOG", "CONTACT", "FAQ", 'PRIVACY'].map((item) => (
              <MenuItem
                key={item}
                onClick={(e: any) => {
                  e.preventDefault();
                  handleClick(item);
                }}
                style={{ width: "100%", textAlign: "center", color: "#000" }}
                sx={{
                  color: getSelectedNavOption === item ? "#800080" : color,
                  fontWeight: getSelectedNavOption === item ? "bold" : "normal",
                }}
              >
                {item}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </>
  );
};

export default Nav;