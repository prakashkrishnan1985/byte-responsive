import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Container,
  CircularProgress,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { toast } from "react-toastify";
import { postInquiry } from "../CallOfAction/userAgentService";
import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
} from "react-phone-number-input";
import { BorderBottom } from "@mui/icons-material";

interface InquiryPayload {
  name: string;
  email: string;
  message: string;
  user_type: "contact_form" | "";
  setFormData?: string;
  mobile?: string;
}

const ContactForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InquiryPayload>({
    name: "",
    email: "",
    message: "",
    user_type: "contact_form",
    setFormData: "",
    mobile: "",
  });
  const [mobile, setMobile] = useState<string>("");

  const handleChange =
    (field: keyof InquiryPayload) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await postInquiry(formData);
      toast.success(
        "Thanks for reaching out! We’ve received your message and will be in touch shortly.",
        {
          className: "custom-toast-website",
        }
      );
      setFormData({
        name: "",
        email: "",
        message: "",
        user_type: "",
        mobile: "",
      });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mobile) {
      setFormData((prev) => ({ ...prev, mobile }));
    } else {
      setFormData((prev) => ({ ...prev, mobile: "" }));
    }
  }, [mobile]);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: { xs: "auto", sm: "100%" },
        backgroundColor: "transparent",
        marginTop: "50px",
        padding: "20px !important",
        width: "100%",
        maxWidth: "2400px !important",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "500",
          marginBottom: 2,
          fontSize: { xs: "1.8rem", lg: "3rem" },
          color: "#800080",
        }}
        id="contact"
      >
        CONTACT
      </Typography>
      <Typography
        sx={{
          marginBottom: 2,
          color: "#333",
          textAlign: "center",
          textTransform: "uppercase",
          fontStyle: "italic",
          width: "100%",
          mx: "auto",
          lineHeight: 1.2,
          fontSize: { xs: "1.5rem", lg: "2.8rem" },
          wordWrap: "break-word",
          // overflowWrap: "break-word",
        }}
      >
        <span style={{ fontWeight: "800", fontStyle: "normal" }}>
          Let’s turn your vision
        </span>
        <br />
        <span>into something</span>
        <br />
        <span>unforgettable!</span>
      </Typography>

      <Typography
        variant="body1"
        sx={{
          marginBottom: 4,
          color: "#666",
          textAlign: "center",
          fontSize: { xs: "1.3rem", lg: "2rem" },
        }}
      >
        Complete this form with your details and we'll get back to you!
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: { xs: "90%", lg: "70%" },
          backgroundColor: "#000",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            marginBottom: 2,
            color: "#fff",
            fontSize: { xs: "1.3rem", lg: "2.5rem" },
          }}
        >
          CONTACT INFO
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              variant="standard"
              required
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange("name")}
              InputProps={{
                style: {
                  color: "#8F8F8F",
                  fontSize: isMobile ? "1.3rem" : "1.8rem",
                },
              }}
              InputLabelProps={{
                style: {
                  color: "#ffffff",
                  fontSize: isMobile ? "1.3rem" : "1.8rem",
                },
              }}
              sx={{
                "& .MuiInput-underline:before": { borderBottomColor: "gray" },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "white",
                },
                "& .MuiInput-underline:after": { borderBottomColor: "white" },
                "& .MuiInputBase-input::placeholder": {
                  color: "#ccc",
                  opacity: 1,
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              variant="standard"
              required
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange("email")}
              InputProps={{
                style: {
                  color: "#8F8F8F",
                  fontSize: isMobile ? "1.3rem" : "1.8rem",
                },
              }}
              InputLabelProps={{
                style: {
                  color: "#ffffff",
                  fontSize: isMobile ? "1.3rem" : "1.8rem",
                },
              }}
              sx={{
                "& .MuiInput-underline:before": { borderBottomColor: "gray" },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "white",
                },
                "& .MuiInput-underline:after": { borderBottomColor: "white" },
                "& .MuiInputBase-input::placeholder": {
                  color: "#ccc",
                  opacity: 1,
                },
              }}
            />
          </Grid>
        </Grid>

        <FormControl variant="standard" fullWidth sx={{ marginTop: 4 }}>
          <PhoneInputWithCountrySelect
            placeholder="Enter your mobile number"
            defaultCountry="US"
            value={mobile}
            onChange={(value) => {
              setMobile(value || "");
            }}
            className="custom-phone-input"
            style={{
              borderBottom: "1px solid gray",
              fontSize: isMobile ? "1.3rem" : "1.5rem",
            }}
            numberInputProps={{
              style: {
                color: "#ffffff",
                fontSize: isMobile ? "1.3rem" : "1.5rem",
              },
            }}
          />
          {mobile && !isValidPhoneNumber(mobile) && (
            <p
              style={{
                color: "#d32f2f",
                textAlign: "left",
                fontSize: isMobile ? "1rem" : "1.5rem",
              }}
            >
              Please enter a valid mobile number
            </p>
          )}
        </FormControl>

        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            marginTop: 4,
            marginBottom: 2,
            color: "#fff",
            fontSize: isMobile ? "1.3rem" : "1.8rem",
          }}
        >
          HOW CAN WE ASSIST YOU?
        </Typography>

        <TextField
          fullWidth
          label="TELL US WHAT YOU NEED HELP WITH..."
          placeholder="some text..."
          multiline
          rows={4}
          required
          variant="outlined"
          value={formData.message}
          onChange={handleChange("message")}
          sx={{ backgroundColor: "#1E1E1E", borderRadius: "4px" }}
          InputProps={{
            style: {
              backgroundColor: "#1E1E1E",
              color: "#8F8F8F",
              fontSize: isMobile ? "1.3rem" : "1.8rem",
            },
          }}
          InputLabelProps={{
            style: {
              color: "#ffffff",
              fontSize: isMobile ? "1.3rem" : "1.8rem",
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            borderRadius: 28,
            marginTop: 4,
            padding: 2,
            backgroundColor: "#800080",
            "&:hover": { backgroundColor: "#800080" },
            position: "relative",
            fontSize: isMobile ? "1.3rem" : "1.5rem",
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "GET IN TOUCH"
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default ContactForm;
