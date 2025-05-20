import { createTheme } from "@mui/material/styles";

// Create a theme with customized typography
const theme = createTheme({
  typography: {
    fontFamily: "'LilGrotesk', sans-serif",
    h1: {
      fontFamily: "'LilGrotesk', sans-serif",
    },
    h2: {
      fontFamily: "'LilGrotesk', sans-serif",
    },
    h3: {
      fontFamily: "'LilGrotesk', sans-serif",
    },
    h4: {
      fontFamily: "'LilGrotesk', sans-serif",
    },
    h5: {
      fontFamily: "'LilGrotesk', sans-serif",
    },
    h6: {
      fontFamily: "'LilGrotesk', sans-serif",
    },
    body1: {
      fontFamily: "'LilGrotesk', sans-serif",
    },
    body2: {
      fontFamily: "'LilGrotesk', sans-serif",
    },
    button: {
      fontFamily: "'LilGrotesk', sans-serif",
    },
    subtitle1: {
      fontFamily: "'LilGrotesk', sans-serif",
    },
    subtitle2: {
      fontFamily: "'LilGrotesk', sans-serif",
    },
    caption: {
      fontFamily: "'LilGrotesk', sans-serif",
    },
    overline: {
      fontFamily: "'LilGrotesk', sans-serif",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'LilGrotesk', sans-serif",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "'LilGrotesk', sans-serif",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: "'LilGrotesk', sans-serif",
        },
      },
    },
  },

  palette: {
    primary: {
      main: "#800080",
    },
    // secondary: {
    //   main: '#dc004e',
    // },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
