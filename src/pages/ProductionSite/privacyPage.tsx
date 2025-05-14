import React, { useState } from "react";
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Container, Grid, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/logo_sp.png";


const PrivacyPage: React.FC = () => {

  return (

    <Box sx={{ backgroundColor: "black", height: "auto" }} >
      <AppBar position="static" style={{ background: "black", paddingLeft: "20px", marginBottom: "20px", border: "none", boxShadow: "none" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
            ByteStackAI
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1, gap: 3 }}>
            <Typography variant="h6" sx={{ color: "white" }}> <a> ABOUT</a></Typography>
            <Typography variant="h6" sx={{ color: "white" }}>USECASES</Typography>
            <Typography variant="h6" sx={{ color: "white" }}>BLOG</Typography>
            <Typography variant="h6" sx={{ color: "white" }}>CONTACT</Typography>
            <Typography variant="h6" sx={{ color: "white" }}>FAQ</Typography>
          </Box>
          <Button style={{ color: 'white' }} sx={{ borderRadius: "30px", border: "2px solid #800080", marginLeft: "auto", marginRight: "40px", width: "130px" }}>Get in touch</Button>
        </Toolbar>
      </AppBar>
      <Box style={{ width: "700px", marginLeft: "40px" }} >
        <Typography style={{ color: "white", paddingBottom: "20px" }}>
          SUPPORT
        </Typography>
        <Typography variant="h4" style={{ color: "white", paddingBottom: "20px" }}>
          DETAILED PRIVACY POLITICS
        </Typography>
        <Box
          style={{ width: "550px", height: "8px", marginBottom: "20px" }}
          sx={{ backgroundColor: "#800080" }}
        >
        </Box>
        <Typography style={{ color: "white", paddingBottom: "20px" }}>
          ByteSized is a trade name used by ByteSized PVT LTD.
          This privacy policy will explain how we use the personal data we
          collect from you when you use this website.
        </Typography>

        <Typography variant="h5" style={{ color: "white", paddingBottom: "20px" }}>
          DATA
        </Typography>

        <Typography style={{ color: "white", paddingBottom: "5px" }}>
          What data do we collect?
        </Typography>
        <Typography style={{ color: "grey", paddingBottom: "20px" }}>
          Personal identification information (Name, email address, phone number, etc.)
        </Typography>

        <Typography style={{ color: "white", paddingBottom: "5px" }}>
          How do we collect your data?
        </Typography>
        <Typography style={{ color: "grey", paddingBottom: "20px" }}>
          You directly provide us with most of the data we collect.
        </Typography>
        <Typography style={{ color: "white", paddingBottom: "5px" }}>
          We collect data and process data when you:
        </Typography>
        <Box component="ul" sx={{ listStyleType: "disc", paddingLeft: "20px" }}>
          <Typography component="li" sx={{ color: "grey", "&::marker": { color: "#800080" } }}>
            Register online or place an order for any of our products or services.
          </Typography>
          <Typography component="li" sx={{ color: "grey", "&::marker": { color: "#800080" } }}>
            Voluntarily complete a customer survey or provide feedback on any of our message boards or via email.
          </Typography>
          <Typography component="li" sx={{ color: "grey", "&::marker": { color: "#800080" } }}>
            Use or view our website via your browser's cookies.
          </Typography>
        </Box>
        <Typography style={{ color: "white", paddingBottom: "5px" }}>
          We may also receive your data indirectly from the following sources:
        </Typography>
        <Box component="ul" sx={{ listStyleType: "disc", paddingLeft: "20px" }}>
          <Typography component="li" sx={{ color: "grey", "&::marker": { color: "#800080" } }}>
            Our carefully selected partners and service providers may process personal information
            about you on our behalf as described below.
          </Typography>

        </Box>
        <Typography style={{ color: "white", paddingBottom: "20px" }}>
          How will we use your data?        </Typography>

        <Typography style={{ color: "white", paddingBottom: "20px" }}>
          We collect your data so that we can:
        </Typography>
        <Box component="ul" sx={{ listStyleType: "disc", paddingLeft: "20px" }}>
          <Typography component="li" sx={{ color: "grey", "&::marker": { color: "#800080" } }}>
            Register online or place an order for any of our products or services.
          </Typography>
          <Typography component="li" sx={{ color: "grey", "&::marker": { color: "#800080" } }}>
            Voluntarily complete a customer survey or provide feedback on any of our message boards or via email.
          </Typography>
        </Box>
        <Typography style={{ color: "white", paddingBottom: "20px" }}>
          When we process your order, it may send your data to, and also use the resulting information from,
          credit reference agencies to prevent fraudulent purchases.
        </Typography>
        <Typography style={{ color: "white", paddingBottom: "20px" }}>
          How do we store your data?
        </Typography>
        <Typography style={{ color: "grey", paddingBottom: "20px" }}>
          We securely store your data on our dedicated servers.
          We will keep your data for a period compliant with local regulation
          . Once this time period has expired, we will delete your data.
        </Typography>

        <Typography variant="h5" style={{ color: "white", paddingBottom: "20px" }}>
          MARKETING
        </Typography>
        <Typography style={{ color: "white", paddingBottom: "5px" }}>
          We would like to send you information about products and services of ours that we
          think you might like, as well as those of our partner companies.
          If you have agreed to receive marketing information, you may always opt-out at a later date.
        </Typography>
        <Typography style={{ color: "grey", paddingBottom: "20px" }}>
          You have the right at any time to stop us from contacting you for marketing purposes.
        </Typography>
        <Typography style={{ color: "white", paddingBottom: "5px" }}>
          What are your data protection rights?
        </Typography>
        <Typography style={{ color: "grey", paddingBottom: "20px" }}>
          We would like to make sure you are fully aware of all of your data protection rights.
        </Typography>
        <Typography style={{ color: "white", paddingBottom: "20px" }}>
          Every user is entitled to the following:
        </Typography>
        <Box component="ul" sx={{ listStyleType: "disc", paddingLeft: "20px" }}>
          <Typography component="li" sx={{ font: "Helvetica Neue", color: "grey", "&::marker": { color: "#800080" } }}>
            <span style={{ color: "white" }}><b>The right to access:</b></span> You have the right to request us for copies of your
            personal data. We may charge you a small fee for this service. </Typography>

          <Typography component="li" sx={{ font: "Helvetica Neue", color: "grey", "&::marker": { color: "#800080" } }}>
            <span style={{ color: "white" }}><b>The right to rectification: </b></span> You have the right to request that we correct any information you believe is inaccurate.
            You also have the right to request us to complete information you believe is incomplete. </Typography>

          <Typography component="li" sx={{ font: "Helvetica Neue", color: "grey", "&::marker": { color: "#800080" } }}>
            <span style={{ color: "white" }}><b>The right to erasure: </b></span>You have the right to request that we
            erase your personal data, under certain conditions. </Typography>
          <Typography component="li" sx={{ font: "Helvetica Neue", color: "grey", "&::marker": { color: "#800080" } }}>
            <span style={{ color: "white" }}><b>The right to restrict processing: </b></span>You have the right to request that we restrict the processing of your
            personal data, under certain conditions. </Typography>
          <Typography component="li" sx={{ font: "Helvetica Neue", color: "grey", "&::marker": { color: "#800080" } }}>
            <span style={{ color: "white" }}><b>The right to object to processing: </b></span>You have the right to object to us processing of your personal data,
            under certain conditions. </Typography>
          <Typography component="li" sx={{ font: "Helvetica Neue", paddingBottom: "65px", color: "grey", "&::marker": { color: "#800080" } }}>
            <span style={{ color: "white" }}><b>The right to data portability: </b></span>You have the right to request that we transfer the data that we have collected
            to another organization, or directly to you, under certain conditions. </Typography>
        </Box>
        <Typography variant="h4" style={{ color: "white", paddingBottom: "42px", font: "Mulish" }}>
          COOKIES
        </Typography>
        <Typography variant="h5" style={{ color: "white", font: "Helvetica Neue", paddingBottom: "5px" }}>
          What are cookies?</Typography>
        <Typography style={{ color: "grey", font: "Helvetica Neue", paddingBottom: "20px" }}>
          Cookies are text files placed on your computer to collect standard Internet log information
          and visitor behaviour information. When you visit our websites,
          we may collect information from you automatically through cookies or similar technology.</Typography>
        <Typography variant="h5" style={{ color: "white", font: "Helvetica Neue", paddingBottom: "20px" }}>
          How do we use cookies?</Typography>
        <Typography variant="h5" style={{ color: "white", font: "Helvetica Neue", paddingBottom: "5px" }}>
          We use cookies in a range of ways to improve your experience on our website, including:</Typography>
        <Box component="ul" sx={{ listStyleType: "disc", paddingLeft: "20px" }}>
          <Typography component="li" sx={{ color: "grey", "&::marker": { color: "#800080" } }}>
            ⁠Keeping you signed in. </Typography>
          <Typography component="li" sx={{ color: "grey", paddingBottom: "30px", "&::marker": { color: "#800080" } }}>
            Understanding how you use our website.</Typography>
        </Box>
        <Typography variant="h5" style={{ color: "white", font: "Helvetica Neue", paddingBottom: "20px" }}>
          What types of cookies do we use?</Typography>
        <Typography style={{ color: "grey", font: "Helvetica Neue", paddingBottom: "30px" }}>
          There are some different types of cookies.</Typography>
        <Typography variant="h5" style={{ color: "white", font: "Helvetica Neue", paddingBottom: "20px" }}>
          However, our website uses:</Typography>

        <Box component="ul" sx={{ listStyleType: "disc", paddingLeft: "20px" }}>
          <Typography component="li" sx={{ font: "Helvetica Neue", color: "grey", "&::marker": { color: "#800080" } }}>
            <span style={{ color: "white" }}><b>Functionality:</b></span>We use these cookies to recognise you on our website and remember your previously selected preferences.
            These could include what language you prefer and location you are in. A mix of first-party and third-party cookies are used. </Typography>

          <Typography component="li" sx={{ font: "Helvetica Neue", paddingBottom: "65px", color: "grey", "&::marker": { color: "#800080" } }}>
            <span style={{ color: "white" }}><b>Advertising:  </b></span> We use these cookies to collect information about your visit to our
            website, the content you viewed, the links you followed and information about your browser, device, and your IP address. We sometimes share some limited aspects of this data with third parties for advertising purposes.
          </Typography>

        </Box>
        <Typography style={{ color: "grey", font: "Helvetica Neue", paddingBottom: "65px" }}>
          We may also share online data collected through cookies with our advertising partners. This means that when you visit
          another website, you may be shown advertising based on your browsing patterns on our website.</Typography>

        <Typography variant="h4" style={{ color: "white", paddingBottom: "65px", font: "Mulish" }}>
          Contact
        </Typography>

        <Typography style={{ color: "grey", paddingBottom: "42px", font: "Mulish" }}>
          If you have any questions, concerns, or complaints regarding this policy, we encourage you to contact
          us using the details below:
        </Typography>

        <Typography style={{ color: "white", paddingBottom: "42px", font: "Mulish" }}>
          contact@bytesized.com.au
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ width: "60%", textAlign: "left", marginLeft: "50px" }}>
            <Typography variant="h6" style={{ marginBottom: "10px", color: "#800080" }}>
              SHAPING THE FUTURE
            </Typography>

            <Typography variant="h4" style={{ marginBottom: "10px", color: "white" }}>
              WITH INTELLIGENT AI AGENTS
            </Typography>
            <Typography style={{ marginBottom: "20px", color: "grey" }}>
              Turn ideas into intelligent AI Agents that think, adapt, and execute—seamlessly with ByteSizedAI.
              The future isn’t just automated—it’s deterministic. Are you ready?
            </Typography>
            <Button style={{ color: 'white' }} sx={{ borderRadius: "30px", border: "2px solid #800080", marginLeft: "auto", marginRight: "40px", width: "130px", marginBottom: "40px" }}>Get in touch</Button>
          </Box>

          <Box
            sx={{ width: "40%", display: "flex", justifyContent: "flex-end" }}
          >
            <AppBar position="static" style={{ background: "black", paddingLeft: "250px", marginBottom: "20px", border: "none", boxShadow: "none" }}>
              <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>

                <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1, gap: 3 }}>
                  <Typography variant="h6" sx={{ color: "grey" }}> <a> ABOUT</a></Typography>
                  <Typography variant="h6" sx={{ color: "grey" }}>USECASES</Typography>
                  <Typography variant="h6" sx={{ color: "grey" }}>BLOG</Typography>
                  <Typography variant="h6" sx={{ color: "grey" }}>CONTACT</Typography>
                  <Typography variant="h6" sx={{ color: "grey" }}>FAQ</Typography>
                </Box>
              </Toolbar>

            </AppBar>
          </Box>

        </Box>

      </Box>

      <Box
        sx={{
          height: "320px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
        }}
      >

        <Box
          component="img"
          src={logo}
          alt="AI Design"
          sx={{ width: "450px", height: "450px", zIndex: 1 }}
        />

        <Typography
          variant="h1"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            textAlign: "center",
            color: "#FFFFFF14",
            fontSize: "250px",
            fontWeight: "bold",
            zIndex: 0,
          }}
        >
          AI STUDIO
        </Typography>
      </Box>

      <AppBar position="static" style={{ background: "black", paddingLeft: "20px", marginBottom: "20px", marginTop: "40px", border: "none", boxShadow: "none" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
            ByteStackAI
          </Typography>


          <Typography style={{ color: 'white', marginRight: "30px" }} >© 2025. All rights reserved.</Typography>
        </Toolbar>
      </AppBar>


    </Box>

  );
};

export default PrivacyPage;