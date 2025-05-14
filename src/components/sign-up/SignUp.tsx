import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Logo from "../../assets/SideBarLogo.svg";
// import RightSideImage from "../../assets/Right-side.svg";
import Content from "../sign-in-side/Content";
import storageUtil from "../../utils/localStorageUtil";
import {
  GoogleIcon,
  GitHubIcon,
  MicrosoftIcon,
} from "../sign-in-side/CustomIcons";
import { useNavigate } from "react-router-dom";
import {
  confirmSignUp,
  fetchUserAttributes,
  signInWithRedirect,
  signUp,
} from "aws-amplify/auth";

import {
  createTheme,
  ThemeProvider,
  styled,
  PaletteMode,
} from "@mui/material/styles";
import getSignUpTheme from "./theme/getSignUpTheme";
import TemplateFrame from "./TemplateFrame";
import ArrowUpwardIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowDownwardIcon from "@mui/icons-material/KeyboardArrowDown";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmSignUp from "./ConfirmSignUp";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  border: "none",
  background: "none",
  [theme.breakpoints.up("sm")]: {
    width: "480px",
  },
}));

export default function SignUp() {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const defaultTheme = createTheme({ palette: { mode } });
  const SignUpTheme = createTheme(getSignUpTheme(mode));
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState<string>("");
  const [confirmationCode, setConfirmationCode] = useState<any>("");
  const [userId, setUserId] = useState<any>("");
  const [stepSingUp, setStepSignUp] = useState<string>("signUp"); // 'signUp' | 'confirm'
  const [name, setName] = useState<string>(""); // State to store the name
  const navigate = useNavigate();

  React.useEffect(() => {
    const savedMode = localStorage.getItem("themeMode") as PaletteMode | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setMode(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const signUpWithGitHub = async () => {
    await signInWithRedirect({
      provider: {
        custom: "github",
      },
    });
  };

  const signUpWithGoogle = async () => {
    await signInWithRedirect({
      provider: {
        custom: "Google",
      },
    });
  };

  const signUpWithMicrosoft = async () => {
    await signInWithRedirect({
      provider: {
        custom: "github",
      },
    });
  };

  const handleNameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name") as string;
    if (name.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
    } else {
      setNameError(false);
      setNameErrorMessage("");
      setName(name);
      setStep(2);
    }
  };

  const handleEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    setEmail(email);
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
      setStep(3);
    }
  };

  const handlePasswordValidation = (password: string) => {
    if (password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      return false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
      return true;
    }
  };

  const handleConfirmPasswordValidation = (
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage("Passwords do not match.");
      return false;
    } else if (password.length < 1) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage("Confirm password should not be empty.");
      return false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage("");
      return true;
    }
  };

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get("password") as string;
    if (handlePasswordValidation(password)) {
      setNewPassword(password);
      setStep(4);
    }
  };

  const handleConfirmPasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const confirmPassword = data.get("confirmPassword") as string;
    if (handleConfirmPasswordValidation(newPassword, confirmPassword)) {
      setConfirmPassword(confirmPassword);
      setStep(5);
    }

    try {
      handleSignUp();
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error signing up:", err);
      setConfirmPassword(err.message || "An error occurred during sign-up");
    }
  };

  // Sign-Up Function
  const handleSignUp = async () => {
    try {
      const [givenName, familyName] = name.split(" ");

      const { userId } = await signUp({
        username: email,
        password: newPassword,
        options: {
          userAttributes: {
            given_name: givenName,
            family_name: familyName,
          },
        },
      });
      setUserId(String(userId));
      setStepSignUp("confirm"); // Move to confirmation step
    } catch (error) {
      console.error("Sign-up error:", error);
    }
  };

  return (
    <TemplateFrame
      toggleCustomTheme={toggleCustomTheme}
      showCustomTheme={showCustomTheme}
      mode={mode}
      toggleColorMode={toggleColorMode}
    >
      <ThemeProvider theme={showCustomTheme ? SignUpTheme : defaultTheme}>
        <CssBaseline enableColorScheme />
        <Stack
          direction="column"
          component="main"
          style={{
            // background: `url(${RightSideImage})`,
            backgroundRepeat: "no-repeat",
          }}
          sx={[
            {
              justifyContent: "space-between",
              height: { xs: "auto", md: "100%" },
            },
            (theme) => ({
              backgroundImage:
                "radial-gradient(ellipse at 70% 51%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
              backgroundSize: "cover",
              ...theme.applyStyles("dark", {
                backgroundImage:
                  "radial-gradient(at 70% 51%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
              }),
            }),
          ]}
        >
          <Stack
            direction={{ xs: "column-reverse", md: "row" }}
            sx={{
              justifyContent: "center",
              gap: { xs: 6, sm: 100 },
              p: 2,
              m: "auto",
            }}
          >
            <Content />
            <Card
              sx={{
                border: "none",
                background: "transparent",
                padding: 3,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  mt: "calc(var(--template-frame-height, 0px) + 4px)",
                  pl: 0,
                  mb: 5,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Box
                  component="img"
                  src={Logo}
                  alt="Description of the image"
                  sx={{
                    maxWidth: 345,
                    border: "none",
                    display: "flex",
                    pl: 16,
                  }}
                ></Box>
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    width: "100%",
                    position: "relative",
                    fontSize: "56px",
                    pt: 1,
                  }}
                >
                  Get Started
                </Typography>
                <Typography
                  component="body"
                  variant="body1"
                  sx={{
                    width: "100%",
                    fontSize: "18px",
                  }}
                >
                  Welcome to ByteSizedAI - Let's create your account!
                </Typography>
              </Box>
              {stepSingUp === "signUp" && (
                <>
                  {step === 1 && (
                    <Box
                      component="form"
                      onSubmit={handleNameSubmit}
                      noValidate
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <FormControl>
                        <FormLabel htmlFor="confirmPassword">
                          <Typography sx={{ fontSize: "18px"}}>
                            1. What is your full name?
                          </Typography>
                        </FormLabel>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TextField
                            error={nameError}
                            helperText={nameErrorMessage}
                            id="name"
                            type="name"
                            name="name"
                            placeholder="Type your answer here..."
                            autoComplete="name"
                            autoFocus
                            required
                            fullWidth
                            variant="standard"
                            color={nameError ? "error" : "primary"}
                            sx={{
                              border: "none",
                              "& .MuiFilledInput-root": {
                                border: "none",
                              },
                            }}
                            inputProps={{
                              border: "none",
                            }}
                          />
                          <Box
                            sx={{
                              ml: 2,
                              mt: 2,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              border: "1px solid white",
                              borderRadius: 25,
                              width: "34px",
                            }}
                          >
                            <IconButton
                              onClick={() => setStep(2)}
                              sx={{
                                backgroundColor: "transparent",
                                borderRadius: "50%",
                                border: "none",
                                width: "20px",
                                "& .MuiFilledInput-root": {
                                  border: "none",
                                  backgroundColor: "transparent",
                                },
                              }}
                            >
                              <ArrowDownwardIcon />
                            </IconButton>

                            <Box
                              sx={{
                                width: "34px",
                                height: "1px",
                                backgroundColor: "#fff",
                              }}
                            />

                            <IconButton
                              onClick={() => setStep(1)}
                              sx={{
                                backgroundColor: "transparent",
                                borderRadius: "50%",
                                border: "none",
                                width: "20px",
                                "& .MuiFilledInput-root": {
                                  border: "none",
                                  backgroundColor: "transparent",
                                },
                              }}
                            >
                              <ArrowUpwardIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </FormControl>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{
                            background: "#2D6414",
                            width: "102px",
                            borderRadius: "100px",
                          }}
                        >
                          Next
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {step === 2 && (
                    <Box
                      component="form"
                      onSubmit={handleEmailSubmit}
                      noValidate
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <FormControl>
                        <FormLabel htmlFor="confirmPassword">
                          <Typography sx={{ fontSize: "18px" }}>
                            2. Please tell us your email address.
                          </Typography>
                        </FormLabel>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TextField
                            error={emailError}
                            helperText={emailErrorMessage}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="standard"
                            color={emailError ? "error" : "primary"}
                            sx={{
                              border: "none",
                              "& .MuiFilledInput-root": {
                                border: "none",
                              },
                            }}
                            inputProps={{
                              border: "none",
                            }}
                          />
                          <Box
                            sx={{
                              ml: 2,
                              mt: 2,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              border: "1px solid white",
                              borderRadius: 25,
                              width: "34px",
                            }}
                          >
                            <IconButton
                              onClick={() => setStep(3)}
                              sx={{
                                backgroundColor: "transparent",
                                borderRadius: "50%",
                                border: "none",
                                width: "20px",
                                "& .MuiFilledInput-root": {
                                  border: "none",
                                  backgroundColor: "transparent",
                                },
                              }}
                            >
                              <ArrowDownwardIcon />
                            </IconButton>

                            <Box
                              sx={{
                                width: "34px",
                                height: "1px",
                                backgroundColor: "#fff",
                              }}
                            />

                            <IconButton
                              onClick={() => setStep(1)}
                              sx={{
                                backgroundColor: "transparent",
                                borderRadius: "50%",
                                border: "none",
                                width: "20px",
                                "& .MuiFilledInput-root": {
                                  border: "none",
                                  backgroundColor: "transparent",
                                },
                              }}
                            >
                              <ArrowUpwardIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </FormControl>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{
                            background: "#2D6414",
                            width: "102px",
                            borderRadius: "100px",
                          }}
                        >
                          Next
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {step === 3 && (
                    <Box
                      component="form"
                      onSubmit={handlePasswordSubmit}
                      noValidate
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <FormControl>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <FormLabel htmlFor="confirmPassword">
                            <Typography
                              sx={{ fontSize: "18px" }}
                            >
                              3. Now set up the strong password
                            </Typography>
                          </FormLabel>
                          <FormLabel htmlFor="password"></FormLabel>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TextField
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            autoFocus
                            required
                            fullWidth
                            variant="standard"
                            color={passwordError ? "error" : "primary"}
                            sx={{
                              border: "none",
                              "& .MuiFilledInput-root": {
                                border: "none",
                              },
                            }}
                            inputProps={{
                              border: "none",
                            }}
                          />
                          <Box
                            sx={{
                              ml: 2,
                              mt: 2,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              border: "1px solid white",
                              borderRadius: 25,
                              width: "34px",
                            }}
                          >
                            <IconButton
                              onClick={() => setStep(4)}
                              sx={{
                                backgroundColor: "transparent",
                                borderRadius: "50%",
                                padding: 2,
                                width: "20px",
                                border: "none",
                              }}
                            >
                              <ArrowDownwardIcon />
                            </IconButton>

                            <Box
                              sx={{
                                width: "34px",
                                height: "1px",
                                backgroundColor: "#fff",
                              }}
                            />

                            <IconButton
                              onClick={() => setStep(2)}
                              sx={{
                                backgroundColor: "transparent",
                                borderRadius: "50%",
                                padding: 2,
                                width: "20px",
                                border: "none",
                              }}
                            >
                              <ArrowUpwardIcon  />
                            </IconButton>
                          </Box>
                        </Box>
                      </FormControl>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{
                            background: "#2D6414",
                            width: "102px",
                            borderRadius: "100px",
                          }}
                        >
                          Next
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {step === 4 && (
                    <Box
                      component="form"
                      onSubmit={handleConfirmPasswordSubmit}
                      noValidate
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <FormControl>
                        <FormLabel htmlFor="confirmPassword">
                          <Typography sx={{ fontSize: "18px" }}>
                            4. Confirm your password.
                          </Typography>
                        </FormLabel>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TextField
                            error={confirmPasswordError}
                            helperText={confirmPasswordErrorMessage}
                            name="confirmPassword"
                            placeholder="••••••"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            autoFocus
                            required
                            fullWidth
                            variant="standard"
                            color={confirmPasswordError ? "error" : "primary"}
                            sx={{
                              border: "none",
                            }}
                          />
                          <Box
                            sx={{
                              ml: 2,
                              mt: 2,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              border: "1px solid white",
                              borderRadius: 25,
                              width: "34px",
                            }}
                          >
                            <IconButton
                              onClick={() => setStep(4)}
                              sx={{
                                backgroundColor: "transparent",
                                borderRadius: "50%",
                                border: "none",
                                width: "20px",
                                "& .MuiFilledInput-root": {
                                  border: "none",
                                  backgroundColor: "transparent",
                                },
                              }}
                            >
                              <ArrowDownwardIcon />
                            </IconButton>

                            <Box
                              sx={{
                                width: "34px",
                                height: "1px",
                                backgroundColor: "#fff",
                              }}
                            />

                            <IconButton
                              onClick={() => setStep(3)}
                              sx={{
                                backgroundColor: "transparent",
                                borderRadius: "50%",
                                border: "none",
                                width: "20px",
                                "& .MuiFilledInput-root": {
                                  border: "none",
                                  backgroundColor: "transparent",
                                },
                              }}
                            >
                              <ArrowUpwardIcon  />
                            </IconButton>
                          </Box>
                        </Box>
                      </FormControl>
                      <FormControlLabel
                        required
                        control={<Checkbox />}
                        label="I want product details and marketing updates"
                        sx={mode === "dark" ? {color: "#fff" } : {color:'black'}}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{
                            background: "#2D6414",
                            width: "102px",
                            borderRadius: "100px",
                            mt: 2,
                            p: 2,
                          }}
                        >
                          Save
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {step === 5 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h5" sx={{ marginBottom: 2 }}>
                        Congratulations! You have successfully registered with
                        the ByteSizedAI
                      </Typography>
                      <Button
                        onClick={() => navigate("/Login")}
                        variant="contained"
                        sx={{
                          background: "#2D6414",
                          width: "150px",
                          borderRadius: "100px",
                        }}
                      >
                        Go to Login
                      </Button>
                    </Box>
                  )}
                </>
              )}

              {stepSingUp === "confirm" && (
                <ConfirmSignUp
                  confirmSignUp={confirmSignUp}
                  setStepSignUp={setStepSignUp}
                  email={email}
                />
              )}

              {stepSingUp === "done" && (
                <p>Sign-up complete! You can now log in.</p>
              )}

              <Box sx={{ marginTop: "auto", paddingTop: 10 }}>
                <span style={{ display: "flex", justifyContent: "center" }}>
                  Or register with
                </span>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    type="button"
                    fullWidth
                    onClick={signUpWithGoogle}
                    startIcon={<GoogleIcon />}
                    sx={{ width: "10px" }}
                  />
                  <Button
                    type="button"
                    fullWidth
                    onClick={signUpWithGitHub}
                    startIcon={<GitHubIcon />}
                    sx={{ width: "10px" }}
                  />
                  <Button
                    type="button"
                    fullWidth
                    onClick={signUpWithMicrosoft}
                    startIcon={<MicrosoftIcon />}
                    sx={{ width: "10px" }}
                  />
                </Box>
                <Typography variant="body2" align="center">
                  Already have an account?{" "}
                  <Link href="./login" variant="body2">
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Card>
          </Stack>
        </Stack>
      </ThemeProvider>
    </TemplateFrame>
  );
}
