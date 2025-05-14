import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Logo from "../../assets/SideBarLogo.svg";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import {
  GoogleIcon,
  FacebookIcon,
  SitemarkIcon,
  GitHubIcon,
  MicrosoftIcon,
} from "./CustomIcons";
import { useNavigate } from "react-router-dom";
import useAuth from "../../providers/AuthProvider";
import { get } from "aws-amplify/api";
import {
  fetchAuthSession,
  fetchUserAttributes,
  signInWithRedirect,
  signIn,
} from "aws-amplify/auth";
import { useState } from "react";
import { Amplify } from "aws-amplify";
import storageUtil from "../../utils/localStorageUtil";
import ArrowUpwardIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowDownwardIcon from "@mui/icons-material/KeyboardArrowDown";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-southeast-2_ZXLCF5Jqb",
      userPoolClientId: "6flrt9t3s4evitdca5b0s0p0c",
      // identityPoolId: 'ap-southeast-2:eb1caa57-b2de-45ec-a34b-01c60649f47a',
      // allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        // below are all defaults, for the sake of the demo
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
        requireUppercase: true,
      },
      userAttributes: {
        email: {
          required: true,
        },
      },
      signUpVerificationMethod: "code",
      loginWith: {
        oauth: {
          domain:
            "ap-southeast-2zxlcf5jqb.auth.ap-southeast-2.amazoncognito.com",
          scopes: [
            "email",
            "profile",
            "openid",
            "phone",
            "aws.cognito.signin.user.admin",
          ],
          redirectSignIn: [
            "http://localhost:3000/Landing",
            "https://dev.bytesized.com.au/Landing",
            "https://bytesized.com.au/Landing",
          ],
          redirectSignOut: [
            "http://localhost:3000",
            "https://dev.bytesized.com.au",
            "https://bytesized.com.au",
          ],
          responseType: "token",
        },
      },
    },
  },
});

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

export default function SignInCard() {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState<any>({ username: "", password: "" });

  const signInWithGitHub = async () => {
    await signInWithRedirect({
      provider: {
        custom: "github",
      },
    });
  };

  const signInWithGoogle = async () => {
    await signInWithRedirect({
      provider: {
        custom: "Google",
      },
    });
  };

  const signInWithMicrosoft = async () => {
    await signInWithRedirect({
      provider: {
        custom: "github",
      },
    });
  };

  const handleClickOpen = () => {
    navigate("/forgotpassword");
    setOpen(true);
  };

  const handleEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;

    setUserInfo({ ...userInfo, username: email });

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
      setStep(2);
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

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get("password") as string;
    setUserInfo({ ...userInfo, password: password });
    storageUtil.setItemLocal("password", password);
  
    if (handlePasswordValidation(password)) {
      const loadingToast = toast.loading("Logging in..");
      try {
        // Attempt to sign in the user with email and password
        const user = await signIn({ ...userInfo, password: password });
        
        // Dismiss the loading toast
        toast.dismiss(loadingToast);
        
        // Show the success toast
        toast.success(`Login successful`);
        navigate("/HomePage");
      }catch (err: any) {
        // Dismiss the loading toast
        toast.dismiss(loadingToast);
              if (err?.name === 'UserAlreadyAuthenticatedException') {
          console.error("User is already authenticated:", err);
          toast.error("You are already signed in.");
        }
        else if (err?.name === 'NotAuthorizedException') {
          console.error("Incorrect username or password:", err);
          toast.error("Incorrect username or password.");
        }
        else {
          console.error("Error logging in", err);
          toast.error("Failed to log in");
        }
      
        // Set a general error message for the user
        setError("Failed to login. Please check your credentials.");
      }
    }
  };

  return (
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
          Sign In
        </Typography>
        <Typography
          component="body"
          variant="body1"
          sx={{
            width: "100%",
            fontSize: "18px",
          }}
        >
          Please enter your details.
        </Typography>
      </Box>

      {step === 1 && (
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
            <FormLabel htmlFor="email">
              1. What is your email address?
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
                  border: "1px solid",
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
              <FormLabel htmlFor="password">2. Type your password.</FormLabel>
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
                  border: "1px solid",
                  borderRadius: 25,
                  width: "34px",
                }}
              >
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
                    padding: 2,
                    width: "20px",
                    border: "none",
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
              variant="contained"
              sx={{
                background: "#2D6414",
                width: "102px",
                borderRadius: "100px",
              }}
            >
              Sign in
            </Button>
            <Box sx={{ mr: 10 }}>
              <Link
                component="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: "baseline" }}
              >
                Forgot your password?
              </Link>
            </Box>
          </Box>
        </Box>
      )}

      <Box sx={{ marginTop: "auto", paddingTop: 10 }}>
        <span style={{ display: "flex", justifyContent: "center" }}>
          or sign in with
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
            onClick={signInWithGoogle}
            startIcon={<GoogleIcon />}
            sx={{ width: "10px" }}
          />
          <Button
            type="button"
            fullWidth
            onClick={signInWithGitHub}
            startIcon={<GitHubIcon />}
            sx={{ width: "10px" }}
          />
          <Button
            type="button"
            fullWidth
            onClick={signInWithMicrosoft}
            startIcon={<MicrosoftIcon />}
            sx={{ width: "10px" }}
          />
        </Box>
        <Typography variant="body2" align="center">
          Don't have an account?{" "}
          <Link href="/Signup" variant="body2">
            Register here
          </Link>
        </Typography>
      </Box>
    </Card>
  );
}
