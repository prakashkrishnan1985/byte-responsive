import React from "react";
import { Box, Typography } from "@mui/material";
import styles from "./style.module.css";

const Privacy: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "black",
        minHeight: "100vh",
        padding: { 
          xs: "0 1rem", 
          sm: "0 2rem", 
          md: "0 4rem", 
          lg: "0 8rem",
          xl: "0 12rem" 
        },
      }}
    >
      <Box
        sx={{
          maxWidth: {xs:"1200px", sm:"1200px", md:"1400px", lg:"1300px", xl:"1600px"},
          margin: "0 auto",
          padding: { xs: "20px 0", md: "40px 0" },
        }}
      >
        <Box sx={{ textAlign: "left", marginBottom: { xs: "30px", md: "40px" } }}>
          <Typography
            variant="h2"
            sx={{
              color: "white",
              textAlign: "left",
              fontSize: { 
                xs: "2rem", 
                md: "2.2rem", 
                lg: "2.5rem", 
                xl: "2.7rem" 
              },
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Privacy Policy
          </Typography>
          <Typography
            sx={{
              color: "grey",
              fontSize: "1rem",
              marginBottom: "10px",
            }}
          >
            Last updated: 10 April 2025
          </Typography>
          <Box
            sx={{
              height: "6px",
              marginBottom: "20px",
              marginLeft: "0",
              marginRight: "auto",
              width: { 
                xs: "343px", 
                md: "400px", 
                lg: "450px", 
                xl: "500px" 
              },
              background: "linear-gradient(90deg, #6700C3 0%, #7C21CE 47.83%, #C079FF 100%)",
              borderRadius: '2px'
            }}
          ></Box>
        </Box>

        <Typography
          sx={{
            color: "white",
            paddingBottom: { xs: "30px", md: "40px" },
            fontSize: "1.2rem",
            lineHeight: "1.6",
          }}
        >
          ByteSizedAI is a trade name used by ByteSized Technologies Pty Ltd.
          This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you use our website and services.{" "}
        </Typography>

        {/* 1. What Data Do We Collect? */}
        <Box sx={{ marginBottom: { xs: "30px", md: "40px" } }}>
          <Typography
            variant="h5"
            className={`${styles.typographSub}`}
            sx={{ 
              textAlign: "left",
              fontSize: { 
                xs: "1.5rem", 
                md: "1.6rem", 
                lg: "1.7rem", 
                xl: "1.8rem" 
              }
            }}
          >
            1. What Data Do We Collect?
          </Typography>
          <Typography
            sx={{
              color: "white",
              paddingBottom: "15px",
              fontSize: "1.2rem",
            }}
          >
            We collect the following types of personal data:
          </Typography>
          <Box
            component="ul"
            sx={{ listStyleType: "disc", paddingLeft: "20px" }}
          >
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              <b>Personal Identification Information:</b> Name, email address,
              phone number, etc.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              <b>Device and Usage Information:</b> IP address, browser type,
              device identifiers.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
              }}
            >
              <b>Cookies and Tracking Data:</b> Information collected via
              cookies and similar technologies.
            </Typography>
          </Box>
        </Box>

        {/* 2. How Do We Collect Your Data? */}
        <Box sx={{ marginBottom: { xs: "30px", md: "40px" } }}>
          <Typography
            variant="h5"
            className={`${styles.typographSub}`}
            sx={{ 
              textAlign: "left",
              fontSize: { 
                xs: "1.5rem", 
                md: "1.6rem", 
                lg: "1.7rem", 
                xl: "1.8rem" 
              }
            }}
          >
            2. How Do We Collect Your Data?
          </Typography>
          <Typography
            sx={{
              color: "white",
              paddingBottom: "15px",
              fontSize: "1.2rem",
            }}
          >
            You provide data to us directly when you:
          </Typography>
          <Box
            component="ul"
            sx={{ listStyleType: "disc", paddingLeft: "20px" }}
          >
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              Register online or place an order for our products or services.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              Complete a customer survey or provide feedback via email or our
              message boards.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
              }}
            >
              Use or view our website through your browser's cookies.
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "white",
              padding: "15px 0 10px",
              fontSize: "1.2rem",
            }}
          >
            We may also receive your data indirectly from:
          </Typography>
          <Box
            component="ul"
            sx={{ listStyleType: "disc", paddingLeft: "20px" }}
          >
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
              }}
            >
              Carefully selected partners and service providers processing
              personal information on our behalf.
            </Typography>
          </Box>
        </Box>

        {/* 3. How Will We Use Your Data? */}
        <Box sx={{ marginBottom: { xs: "30px", md: "40px" } }}>
          <Typography
            variant="h5"
            className={`${styles.typographSub}`}
            sx={{ 
              textAlign: "left",
              fontSize: { 
                xs: "1.5rem", 
                md: "1.6rem", 
                lg: "1.7rem", 
                xl: "1.8rem" 
              }
            }}
          >
            3. How Will We Use Your Data?
          </Typography>
          <Typography
            sx={{
              color: "white",
              paddingBottom: "15px",
              fontSize: "1.2rem",
            }}
          >
            We collect your data to:
          </Typography>
          <Box
            component="ul"
            sx={{ listStyleType: "disc", paddingLeft: "20px" }}
          >
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              Process your order and manage your account.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              Improve the user experience and personalize your interaction with
              our website.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              Email you with special offers or updates on products and services
              we think you'll like (only if you've opted in).
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
              }}
            >
              Conduct analytics and improve our services.
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "white",
              padding: "15px 0",
              fontSize: "1.2rem",
              lineHeight: "1.6",
            }}
          >
            In processing your orders, we may share your data with credit
            reference agencies to prevent fraudulent transactions.
          </Typography>
        </Box>

        {/* 4. How Do We Store Your Data? */}
        <Box sx={{ marginBottom: { xs: "30px", md: "40px" } }}>
          <Typography
            variant="h5"
            className={`${styles.typographSub}`}
            sx={{ 
              textAlign: "left",
              fontSize: { 
                xs: "1.5rem", 
                md: "1.6rem", 
                lg: "1.7rem", 
                xl: "1.8rem" 
              }
            }}
          >
            4. How Do We Store Your Data?
          </Typography>
          <Typography
            sx={{
              color: "white",
              paddingBottom: "15px",
              fontSize: "1.2rem",
              lineHeight: "1.6",
            }}
          >
            Your data is securely stored on our dedicated servers with
            appropriate technical and organizational safeguards.
          </Typography>
          <Typography
            sx={{ 
              color: "grey", 
              fontSize: "1.2rem", 
              lineHeight: "1.6" 
            }}
          >
            We will retain your personal data only as long as necessary to
            comply with legal, accounting, or regulatory obligations. After this
            period, your data will be securely deleted.
          </Typography>
        </Box>

        {/* 5. Marketing */}
        <Box sx={{ marginBottom: { xs: "30px", md: "40px" } }}>
          <Typography
            variant="h5"
            className={`${styles.typographSub}`}
            sx={{ 
              textAlign: "left",
              fontSize: { 
                xs: "1.5rem", 
                md: "1.6rem", 
                lg: "1.7rem", 
                xl: "1.8rem" 
              }
            }}
          >
            5. Marketing
          </Typography>
          <Typography
            sx={{
              color: "white",
              paddingBottom: "15px",
              fontSize: "1.2rem",
              lineHeight: "1.6",
            }}
          >
            We would like to send you updates about our products and services,
            and occasionally those of our trusted partners.
          </Typography>
          <Box
            component="ul"
            sx={{ listStyleType: "disc", paddingLeft: "20px" }}
          >
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              If you have opted in, you can always opt out later.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
              }}
            >
              You have the right to stop us from contacting you for marketing at
              any time by clicking "unsubscribe" in our emails or by contacting
              us directly.
            </Typography>
          </Box>
        </Box>

        {/* 6. What Are Your Data Protection Rights? */}
        <Box sx={{ marginBottom: { xs: "30px", md: "40px" } }}>
          <Typography
            variant="h5"
            className={`${styles.typographSub}`}
            sx={{ 
              textAlign: "left",
              fontSize: { 
                xs: "1.5rem", 
                md: "1.6rem", 
                lg: "1.7rem", 
                xl: "1.8rem" 
              }
            }}
          >
            6. What Are Your Data Protection Rights?
          </Typography>
          <Typography
            sx={{
              color: "white",
              paddingBottom: "15px",
              fontSize: "1.2rem",
              lineHeight: "1.6",
            }}
          >
            You have the following rights regarding your personal data:
          </Typography>
          <Box
            component="ul"
            sx={{ listStyleType: "disc", paddingLeft: "20px" }}
          >
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              <b>Right to Access</b> – Request copies of your personal data (a
              small fee may apply).
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              <b>Right to Rectification</b> – Request correction of inaccurate
              or incomplete data.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              <b>Right to Erasure</b> – Request to delete your personal data,
              under certain conditions.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              <b>Right to Restrict Processing</b> – Request restriction of
              processing under certain conditions.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              <b>Right to Object to Processing</b> – Object to our processing of
              your data, under certain conditions.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
              }}
            >
              <b>Right to Data Portability</b> – Request transfer of your data
              to another organization or directly to you.
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "white",
              padding: "15px 0",
              fontSize: "1.2rem",
              lineHeight: "1.6",
            }}
          >
            To exercise any of these rights, please contact us (see Section 10
            below).
          </Typography>
        </Box>

        {/* 7. Cookies */}
        <Box sx={{ marginBottom: { xs: "30px", md: "40px" } }}>
          <Typography
            variant="h5"
            className={`${styles.typographSub}`}
            sx={{ 
              textAlign: "left",
              fontSize: { 
                xs: "1.5rem", 
                md: "1.6rem", 
                lg: "1.7rem", 
                xl: "1.8rem" 
              }
            }}
          >
            7. Cookies
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              paddingBottom: "10px",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            What Are Cookies?
          </Typography>
          <Typography
            sx={{
              color: "grey",
              paddingBottom: "15px",
              fontSize: "1.2rem",
              lineHeight: "1.6",
            }}
          >
            Cookies are small text files placed on your device to collect
            standard internet log and visitor behavior information.
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "white",
              paddingBottom: "10px",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            How Do We Use Cookies?
          </Typography>
          <Typography
            sx={{
              color: "grey",
              paddingBottom: "10px",
              fontSize: "1.2rem",
              lineHeight: "1.6",
            }}
          >
            We use cookies to:
          </Typography>
          <Box
            component="ul"
            sx={{ listStyleType: "disc", paddingLeft: "20px" }}
          >
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              Keep you signed in.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              Understand how you interact with our site.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              Personalize content and remember your preferences (language,
              location).
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
              }}
            >
              Provide relevant advertising.
            </Typography>
          </Box>

          <Typography
            variant="h6"
            sx={{
              color: "white",
              padding: "15px 0 10px",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Types of Cookies We Use:
          </Typography>
          <Box
            component="ul"
            sx={{ listStyleType: "disc", paddingLeft: "20px" }}
          >
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              <b>Functionality Cookies</b> – Recognize you and remember your
              preferences.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
              }}
            >
              <b>Advertising Cookies</b> – Collect information about your visit,
              including pages viewed and links followed. This information may be
              shared with third-party advertising partners.
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "grey",
              padding: "15px 0",
              fontSize: "1.2rem",
              lineHeight: "1.6",
            }}
          >
            You can set your browser to not accept cookies. However, some
            website features may not function properly without them.
          </Typography>
        </Box>

        {/* 8. Sharing Your Information */}
        <Box sx={{ marginBottom: { xs: "30px", md: "40px" } }}>
          <Typography
            variant="h5"
            className={`${styles.typographSub}`}
            sx={{ 
              textAlign: "left",
              fontSize: { 
                xs: "1.5rem", 
                md: "1.6rem", 
                lg: "1.7rem", 
                xl: "1.8rem" 
              }
            }}
          >
            8. Sharing Your Information
          </Typography>
          <Typography
            sx={{
              color: "white",
              paddingBottom: "15px",
              fontSize: "1.2rem",
              lineHeight: "1.6",
            }}
          >
            We may share your personal data with:
          </Typography>
          <Box
            component="ul"
            sx={{ listStyleType: "disc", paddingLeft: "20px" }}
          >
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              Service providers and partners who support our business
              operations.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
            >
              Legal authorities, when required to comply with legal obligations.
            </Typography>
            <Typography
              component="li"
              sx={{
                color: "grey",
                "&::marker": { color: "#800080" },
                fontSize: "1.2rem",
              }}
            >
              Advertisers, but only anonymized or aggregated data unless you've
              consented otherwise.
            </Typography>
          </Box>
        </Box>

        {/* 9. Changes to Our Privacy Policy */}
        <Box sx={{ marginBottom: { xs: "30px", md: "40px" } }}>
          <Typography
            variant="h5"
            className={`${styles.typographSub}`}
            sx={{ 
              textAlign: "left",
              fontSize: { 
                xs: "1.5rem", 
                md: "1.6rem", 
                lg: "1.7rem", 
                xl: "1.8rem" 
              }
            }}
          >
            9. Changes to Our Privacy Policy
          </Typography>
          <Typography
            sx={{
              color: "white",
              paddingBottom: "15px",
              fontSize: "1.2rem",
              lineHeight: "1.6",
            }}
          >
            We may update this Privacy Policy from time to time. We encourage
            you to review it regularly. Any changes will be posted on this page
            with an updated "Last updated" date.
          </Typography>
        </Box>

        {/* 10. Contact Us */}
        <Box sx={{ marginBottom: { xs: "50px", md: "60px" } }}>
          <Typography
            variant="h5"
            className={`${styles.typographSub}`}
            sx={{ 
              textAlign: "left",
              fontSize: { 
                xs: "1.5rem", 
                md: "1.6rem", 
                lg: "1.7rem", 
                xl: "1.8rem" 
              }
            }}
          >
            10. Contact Us
          </Typography>
          <Typography
            sx={{
              color: "white",
              paddingBottom: "15px",
              fontSize: "1.2rem",
              lineHeight: "1.6",
            }}
          >
            If you have any questions, concerns, or complaints regarding this
            Privacy Policy or your personal data, please contact us:
          </Typography>
          <Typography
            sx={{
              color: "grey",
              fontSize: "1.2rem",
              lineHeight: "1.6",
              marginBottom: "10px",
            }}
          >
            ByteSized Technologies Pty Ltd
            <br />
            Victoria Melbourne
            <br />
            Email: contact@bytesized.com.au
            <br />
            Phone: +61 484919292
            <br />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Privacy;