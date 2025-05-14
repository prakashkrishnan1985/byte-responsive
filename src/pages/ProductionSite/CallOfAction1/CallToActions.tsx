import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  Grid,
  RadioGroup,
  Radio,
  SelectChangeEvent,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { BsArrowUpRight } from "react-icons/bs";
import { postInquiry, PayloadPostInquiry } from "./userAgentService";

const rolesItems = [
  "Business Analyst",
  "Content Creator",
  "Customer Support",
  "Cybersecurity Analyst",
  "Data Scientist",
  "Software Engineer",
  "Educator",
  "Entertainer",
  "Researcher or Scientist",
  "Financial Advisor",
  "Government Employee",
  "Healthcare Professional",
  "Human Resources Professional",
  "Journalist",
  "Legal Professional",
  "Manufacturing Engineer",
  "Marketing or Sales",
  "Operations Manager",
  "Product Manager",
  "Quality Control Specialist",
  "Real Estate Professional",
  "Risk Analyst",
  "Supply Chain",
  "Other",
];

const CallToActions: React.FC<any> = ({ handleGoBtnClick, sessionId }: any) => {
  const [email, setEmail] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [roleError, setRoleError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [detailError, setDetailError] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    if (!validateEmail(email)) {
      setEmailError(true);
      isValid = false;
    }
    if (!detail) {
      setDetailError(true);
      isValid = false;
    }
    if (!role) {
      setRoleError("Please select a role");
      isValid = false;
    }
    return isValid;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(false);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setEmailError(false);
      setDetailError(false);
      setRoleError("");
      const payloadObj = {
        name: name,
        email: email,
        profession: role,
        contact_number: mobile,
        query: detail,
        user_type: "customer",
      };

      const payload: PayloadPostInquiry = payloadObj;
      setLoading(true);
      setError(null);
      try {
        const response: any = await postInquiry(payload);
        setSuccess(true);
        if (response?.message !== "") {
          setSuccess(true);
          setMessage(response?.message);
          setOpen(true);
        } else {
          <Alert severity="error">{'Failed to update'}</Alert>;
        }
        setName("");
        setEmail("");
        setRole("");
        setDetail("");
        setMobile("");
        setIsChecked(false);
      } catch (error) {
        setError("Failed to update user agents");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      setMobile(value);
    } else if (name === "detail") {
      setDetail(value);
      setDetailError(false);
    } else if (name === "name") {
      setName(value);
    }
  };
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    setRole(e.target.value);
    setRoleError("");
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        color: "white",
        textAlign: "center",
        padding: isMobile ? "10px" : "20px",
        maxWidth: isMobile ? "100%" : "100%",
        marginTop: 0,
        backgroundColor: "#000",
        fontFamily: "LilGrotesk, sans-serif",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        color="white"
        pt={isMobile ? "25px" : "-10px"}
        fontWeight={600}
        fontSize={30}
      >
        Harness the power of AI with ByteSizedAI—effortlessly integrating into
        your workflow with drag-and-drop ease to enhance your product stack, all
        without AI expertise.
      </Typography>
      <Box
        sx={{
          margin: "0 20%",
        }}
      >
        <Box
          pl={isMobile ? 0 : 10}
          pr={isMobile ? 0 : 10}
          sx={{ justifyContent: "center", width: "100%", padding: 0 }}
        >
          <TextField
            label="Enter your Name"
            name="name"
            variant="standard"
            value={name}
            onChange={handleDetailChange}
            error={emailError}
            helperText={emailError ? "Please enter name" : ""}
            fullWidth
            style={{
              marginBottom: "0px",
              width: isMobile ? "100%" : "100%",
              backgroundColor: "transparent",
            }}
            slotProps={{
              input: {
                style: {
                  color: "white",
                },
              },
              inputLabel: {
                style: {
                  color: "white",
                },
              },
            }}
            sx={{
              "& .MuiInput-underline:before": {
                borderBottomColor: "#A020F0",
              },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "#A020F0",
              },
            }}
          />
          <TextField
            label="Enter your email"
            variant="standard"
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            helperText={emailError ? "Please enter a valid email" : ""}
            fullWidth
            style={{
              marginBottom: "0px",
              width: isMobile ? "100%" : "100%",
              backgroundColor: "transparent",
            }}
            slotProps={{
              input: {
                style: {
                  color: "white",
                },
              },
              inputLabel: {
                style: {
                  color: "white",
                },
              },
            }}
            sx={{
              "& .MuiInput-underline:before": {
                borderBottomColor: "#A020F0",
              },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "#A020F0",
              },
            }}
          />
          <FormControl
            variant="standard"
            fullWidth
            style={{
              marginBottom: "10px",
              width: isMobile ? "100%" : "100%",
              marginTop: isMobile ? "0px" : "30px",
            }}
          >
            <InputLabel
              id="role-select-label"
              style={{ color: "white", textAlign: "left", paddingLeft: "0px" }}
            >
              Select your Profession
            </InputLabel>

            <Select
              name="role"
              labelId="role-select-label"
              id="role-select"
              value={role}
              onChange={handleRoleChange}
              label="Select your role"
              sx={{
                color: "white",
                borderBottom: "1px solid #A020F0 !important",
                textAlign: "left",
                border: "none",
                "& .MuiSelect-icon": {
                  color: "white",
                },
                "&.Mui-focused": {
                  borderBottom: "1px solid #A020F0 !important",
                  outline: "none",
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: "#333",
                    color: "white",
                  },
                },
              }}
            >
              {rolesItems.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>

            {roleError && (
              <Typography
                variant="body2"
                color="error"
                style={{
                  marginTop: "5px",
                  textAlign: "left",
                  paddingLeft: "0px",
                  fontSize: "0.75rem",
                }}
              >
                {roleError}
              </Typography>
            )}

            <TextField
              name="detail"
              label=" Describe your model"
              variant="standard"
              value={detail}
              onChange={handleDetailChange}
              fullWidth
              multiline
              rows={4}
              style={{
                marginBottom: "0px",
                width: isMobile ? "100%" : "100%",
                backgroundColor: "transparent",
              }}
              InputProps={{
                style: {
                  color: "white",
                },
              }}
              InputLabelProps={{
                style: {
                  color: "white",
                },
              }}
              sx={{
                "& .MuiInput-underline:before": {
                  borderBottomColor: "#A020F0",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "#A020F0",
                },
              }}
            />
          </FormControl>

            <FormControl
            variant="standard"
            fullWidth
            style={{
              marginBottom: "10px",
              width: isMobile ? "100%" : "100%",
              marginTop: isMobile ? "0px" : "30px",
            }}
            >
            <TextField
              name="mobile"
              type="number"
              label="Enter your mobile number"
              variant="standard"
              value={mobile}
              onChange={handleDetailChange}
              error={mobile !== '' && mobile.length !== 10}
              helperText={
              mobile !== '' && mobile.length !== 10
                ? "Please enter a valid 10-digit mobile number"
                : ""
              }
              fullWidth
              style={{
              marginBottom: "0px",
              width: isMobile ? "100%" : "100%",
              backgroundColor: "transparent",
              }}
              InputProps={{
              style: {
                color: "white",
              },
              }}
              InputLabelProps={{
              style: {
                color: "white",
              },
              }}
              sx={{
              "& .MuiInput-underline:before": {
                borderBottomColor: "#A020F0",
              },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "#A020F0",
              },
              }}
            />
            </FormControl>
        </Box>

        <Box
          style={{
            textAlign: "left",
            marginTop: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: isMobile ? "100%" : "81%",
            alignItems: "center",
          }}
          pl={isMobile ? 0 : 10}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                sx={{ color: "white", "&.Mui-checked": { color: "#72FF13" } }}
              />
            }
            label={
              <span style={{ color: "white" }}>Sign in for early access!</span>
            }
          />
          <Button
            onClick={handleSubmit}
            style={{
              color: "white",
              minWidth: "auto",
              padding: "6px",
              backgroundColor: "transparent",
              boxShadow: "none",
              marginRight: "0px",
            }}
          >
            Go
            <BsArrowUpRight style={{ marginLeft: "8px", fontSize: "16px" }} />
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={message}
      />
    </Container>
  );
};

export default CallToActions;
