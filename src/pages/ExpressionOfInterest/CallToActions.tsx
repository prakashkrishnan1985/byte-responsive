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
} from "@mui/material";
import { BsArrowUpRight } from "react-icons/bs";
import {
  postSubscription,
  PayloadPostSubscription,
} from "../../services/userAgentService";

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

const CallToActions: React.FC<any> = ({ handleGoBtnClick, sessionId }) => {
  const [email, setEmail] = useState<string>("");
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [roleError, setRoleError] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(false);
  };

  const handleRoleChange = (e: any) => {
    setSelectedRole(e.target.value as string);
    setRoleError(false);
  };

  const handleSubmit = async () => {
    if (validateEmail(email) && selectedRole) {
      setEmailError(false);
      setRoleError(false);
      handleGoBtnClick();
      const payload: PayloadPostSubscription = {
        email_id: email,
        is_newsletter_subscribed: isChecked,
        session_id: sessionId,
        profession: selectedRole,
      };
      setLoading(true);
      setError(null);
      try {
        const response = await postSubscription(payload);
        setSuccess(true);
      } catch (error) {
        setError("Failed to update user agents");
      } finally {
        setLoading(false);
      }
    } else {
      if (!selectedRole) {
        setRoleError(true);
      }
      if (!validateEmail(email)) {
        setEmailError(true);
      }
    }
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
        maxWidth: isMobile ? "100%" : "875px",
        marginTop: 0,
      }}
    >
      <Typography
          variant="h4"
          style={{
            fontSize: isMobile ? "18px" : "46px",
            fontWeight:'500',
            position:'absolute',
            top: isMobile?"218px":"100px",
            display:'flex',
            alignSelf:'center',
            padding:isMobile?'2px':'0px'
          }}
        >
          Your vision is in good hands — ByteSizedAI can <br/>bring it to life!
      </Typography>
      <Box style={{ textAlign: "center", marginBottom: "10px", marginTop:"80px" }}>
        <Box sx={{ position: "relative", top: "5px" }}>
          <Typography variant="body1" fontSize={isMobile ? "18px" : "30px"} pt={isMobile?'60px':"100px"}>
            <span className="text-bold">Sign up</span> now to <span className="text-bold">express your interest</span> and <span className="text-bold">stay updated</span> for exciting offers when we launch!
          </Typography>
        </Box>
      </Box>

      <Box pl={isMobile ? 0 : 10} pr={isMobile ? 0 : 10} pt={1}>
        <TextField
          label="Enter your email"
          variant="standard"
          value={email}
          onChange={handleEmailChange}
          error={emailError}
          helperText={emailError ? "Please enter a valid email" : ""}
          fullWidth
          style={{
            marginBottom: "20px",
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
              borderBottomColor: "#72FF13",
            },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "#72FF13",
            },
          }}
        />
        <FormControl
          variant="standard"
          fullWidth
          style={{ marginBottom: "20px", width: isMobile ? "100%" : "100%", marginTop: isMobile?'0px':'30px' }}
        >
          <InputLabel
            id="role-select-label"
            style={{ color: "white", textAlign: "left", paddingLeft: "0px" }}
          >
            Select your role
          </InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={selectedRole}
            onChange={handleRoleChange}
            label="Select your role"
            sx={{
              color: "white",
              borderBottom: "1px solid #72FF13 !important",
              textAlign: "left",
              border: "none",
              "& .MuiSelect-icon": {
                color: "white",
              },
              '&.Mui-focused': {
                borderBottom: "1px solid #72FF13 !important",
                outline: 'none',
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
              Please select a role
            </Typography>
          )}
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
              sx={{ color: "white" }}
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
    </Container>
  );
};

export default CallToActions;
