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
} from "aws-amplify/auth";
import { useState } from "react";
import { Amplify } from "aws-amplify";
import storageUtil from "../../utils/localStorageUtil";
import ArrowUpwardIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowDownwardIcon from "@mui/icons-material/KeyboardArrowDown";
import { IconButton } from "@mui/material";

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

export default function ForgotPasswordCard() {
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNewPasswordValidation = (password: string) => {
    if (password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      return false;
    }
    setPasswordError(false);
    setPasswordErrorMessage("");
    return true;
  };

  const handleConfirmPasswordValidation = (
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage("Passwords do not match.");
      return false;
    }
    setConfirmPasswordError(false);
    setConfirmPasswordErrorMessage("");
    return true;
  };

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get("password") as string;

    if (handleNewPasswordValidation(password)) {
      setNewPassword(password);
      setStep(2); // Move to the confirm password step
    }
  };

  const handleConfirmPasswordSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const confirmPassword = data.get("confirmPassword") as string;

    if (handleConfirmPasswordValidation(newPassword, confirmPassword)) {
      setConfirmPassword(confirmPassword);
      setStep(3); // Password reset success message
    }
  };

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
          Reset Password
        </Typography>
        <Typography
          component="body"
          variant="body1"
          sx={{
            width: "100%",
            fontSize: "18px",
          }}
        >
          Keep you account safe! Choose a strong password!
        </Typography>
      </Box>

      {step === 1 && (
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
            <FormLabel htmlFor="password">
              <Typography sx={{ fontSize: "18px", color: "white" }}>
                1. Type your new password.
              </Typography>
              <Typography sx={{ ml: 2 }}>
                Must be at least 8 characters. (one uppercase, one number)
              </Typography>
            </FormLabel>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                autoFocus
                required
                fullWidth
                variant="standard"
                color={passwordError ? "error" : "primary"}
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
                  <ArrowDownwardIcon sx={{ color: "white" }} />
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
                  <ArrowUpwardIcon sx={{ color: "white" }} />
                </IconButton>
              </Box>
            </Box>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              background: "#2D6414",
              width: "102px",
              borderRadius: "100px",
              mt: 2,
            }}
          >
            Next
          </Button>
        </Box>
      )}

      {step === 2 && (
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
              <Typography sx={{ fontSize: "18px", color: "white" }}>
                2. Confirm your new password.
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
                  <ArrowDownwardIcon sx={{ color: "white" }} />
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
                  <ArrowUpwardIcon sx={{ color: "white" }} />
                </IconButton>
              </Box>
            </Box>
          </FormControl>

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
              color: "white",
            }}
          >
            Save
          </Button>
        </Box>
      )}

      {step === 3 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Password has been successfully reset!
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

      <Box sx={{ marginTop: "auto", paddingTop: 5 }}>
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
        <Typography variant="body2" align="center" mt={5}>
          Don't have an account?{" "}
          <Link onClick={() => navigate("/Login")} variant="body2">
            Login here
          </Link>
        </Typography>
      </Box>
    </Card>
  );
}
