import React, { useEffect, useState } from "react";
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
  Snackbar,
  SnackbarCloseReason,
  CircularProgress,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { BsArrowUpRight } from "react-icons/bs";
import { postInquiry, PayloadPostInquiry } from "./userAgentService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isValidPhoneNumber } from 'react-phone-number-input'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import './CallToActions.scss';

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
  const UserType = useSelector(
    (state: any) => state.documentsForGeneralConfigurationSlice.typeOfuser
  );

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    if (UserType === "Customer" && !role) {
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
        user_type: UserType.toLowerCase() || "",
        is_beta_user: isChecked ? true : false,
      };

      const payload: PayloadPostInquiry = payloadObj;
      setLoading(true);
      setError(null);
      try {
        const response: any = await postInquiry(payload);
        setSuccess(true);
        toast.success(
          "Thanks for reaching out! We’ve received your message and will be in touch shortly.",
          {
            className: "custom-toast-website",
          }
        );
        if (response?.message !== "") {
          setSuccess(true);
          setMessage(response?.message);
          setOpen(true);
        } else {
          <Alert severity="error">{"Failed to update"}</Alert>;
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
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleRoleChange = (e: any) => {
    setRole(e.target.value);
    setRoleError("");
  };
  useEffect(() => {
    if (UserType === "Customer") {
      setRole(UserType);
    }
  }, [UserType]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        color: "white",
        textAlign: "center",
        padding: isMobile ? "10px" : "20px",
        maxWidth: "100%",
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
        fontWeight={700}
        fontSize={30}
      >
        {UserType === "Customer"
          ? "Join the ByteSizedAI Beta Program"
          : "Contribute AI Agents to the ByteSizedAI Marketplace"}
      </Typography>
      <Typography
        variant="h4"
        gutterBottom
        color="white"
        pt={isMobile ? "25px" : "-10px"}
        fontWeight={400}
        fontSize={30}
      >
        {UserType === "Customer"
          ? "Be one of 10 teams to turn ideas into production-ready AI agents — in minutes, not months."
          : "Plug your agents into real-world stacks. Get discovered. Get rewarded."}
      </Typography>
      <Typography
        variant="h4"
        gutterBottom
        color="white"
        pt={isMobile ? "10px" : "-10px"}
        fontWeight={300}
        fontSize={21}
      >
        {UserType === "Customer"
          ? "Selected teams will be chosen based on ambition, clarity of use case, and potential for real-world AI adoption."
          : ""}
      </Typography>
      <Box sx={{ margin: isMobile ? "0 20px" : "0 20%" }}>
        <Box
          pl={isMobile ? 0 : 10}
          pr={isMobile ? 0 : 10}
          sx={{
            justifyContent: "center",
            width: "100%",
            padding: 0,
            "& > *": {
              marginBottom: isMobile ? "16px" : "24px !important",
            },
          }}
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
            style={{ width: "100%", backgroundColor: "transparent" }}
            slotProps={{
              input: { style: { color: "white" } },
              inputLabel: { style: { color: "white" } },
            }}
            sx={{
              "& .MuiInput-underline:before": { borderBottomColor: "#A020F0" },
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
            style={{ width: "100%", backgroundColor: "transparent" }}
            slotProps={{
              input: { style: { color: "white" } },
              inputLabel: { style: { color: "white" } },
            }}
            sx={{
              "& .MuiInput-underline:before": { borderBottomColor: "#A020F0" },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "#A020F0",
              },
            }}
          />

          <FormControl variant="standard" fullWidth>
            <PhoneInput
              placeholder="Enter your mobile number"
              defaultCountry="US"
              value={mobile}
              onChange={(value) => setMobile(value || "")}
              className="custom-phone-input"
            />
            {mobile && !isValidPhoneNumber(mobile) && (
              <p style={{ color: "#d32f2f", fontSize: "0.75rem", textAlign:'left' }}>
                Please enter a valid mobile number
              </p>
            )}
          </FormControl>

          {UserType === "Customer" && (
            <FormControl variant="standard" fullWidth>
              <InputLabel
                id="role-select-label"
                style={{
                  color: "white",
                  textAlign: "left",
                  fontSize: "1.4rem",
                }}
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
                  border: "none",
                  "& .MuiSelect-icon": { color: "white" },
                  "&.Mui-focused": {
                    borderBottom: "1px solid #A020F0 !important",
                    outline: "none",
                  },
                  textAlign: "left",
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
                  style={{ marginTop: "5px", fontSize: "0.75rem" }}
                >
                  {roleError}
                </Typography>
              )}
            </FormControl>
          )}

          <FormControl variant="standard" fullWidth>
            <TextField
              name="detail"
              label={
                UserType === "Customer"
                  ? "Tell us how you would like to use bytesizedAI"
                  : "What would your AI model do?"
              }
              variant="standard"
              value={detail}
              onChange={handleDetailChange}
              fullWidth
              multiline
              rows={4}
              InputProps={{
                style: { color: "white" },
                disableUnderline: true,
              }}
              InputLabelProps={{ style: { color: "white", padding: "5px" } }}
              sx={{
                "& .MuiInputBase-root": {
                  border: "1px solid #A020F0",
                  borderRadius: "4px",
                  padding: "8px",
                },
                "& .MuiInputBase-root:hover": {
                  borderColor: "#BA55D3",
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
            width: "100%",
            alignItems: "center",
          }}
          pl={isMobile ? 0 : 1}
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
          {loading ? (
            <CircularProgress
              size={24}
              sx={{ color: "#fff", marginRight: { xs: "0px", md: "10px" } }}
            />
          ) : (
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
          )}
        </Box>
      </Box>
      {/* <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={message}
      /> */}
    </Container>
  );
};

export default CallToActions;
