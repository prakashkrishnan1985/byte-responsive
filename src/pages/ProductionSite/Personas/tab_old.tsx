import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IMG1 from "../../assets/Corespondent-con.png";
import IMG2 from "../../assets/Corespondent-con1.png";
import IMG3 from "../../assets/Corespondent-con2.png";
import "./tab.css";

const TwoTabComponent = () => {
  const [tabValue, setTabValue] = useState(0); // State for active tab

  // Handle tab change
  const handleTabChange = (event:any, newValue:any) => {
    setTabValue(newValue);
  };

  return (
    <Box     sx={{
        borderRadius: "10px",
        border: "1px solid #c1baba12"
        
        }}>
      {/* AppBar with Tabs */}
      <AppBar position="static" sx={{ boxShadow: "none", backgroundColor: '#00000000' }}>
        <Toolbar sx={{ backgroundColor: '#00000000' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Innovators"  />
            <Tab label="Developers" />
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Tab Content */}
      <Container sx={{ mt: 4 }}>
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
            <div className="container">
        <div className="section1">
            <div>
                 <img  src={IMG1} />
            </div>
            <div>
                <h2>Ideate</h2>
                <p>Revolutionise your workflow with ultimate Al optimisation today!Revolutionise your workflow with ultimate Al optimisation today!</p>
            </div>
        </div>

        <div className="section1">
           
            <div>
                 <img  src={IMG1} />
            </div>
            <div>
            <h2>Visualise</h2>
                <p>Revolutionise your workflow with ultimate Al optimisation today!Revolutionise your workflow with ultimate Al optimisation today!</p>
            </div>
         </div>

         <div className="section1">
           
           <div>
                <img  src={IMG1} />
           </div>
           <div>
           <h2>Brainstorm</h2>
               <p>Revolutionise your workflow with ultimate Al optimisation today!Revolutionise your workflow with ultimate Al optimisation today!</p>
           </div>
        </div>


      
    </div>
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <Grid container spacing={3}>
          <Grid item xs={12}>
          <div className="container">
      <div className="section1">
          <div>
               <img  src={IMG1} />
          </div>
          <div>
              <h2>Ideate</h2>
              <p>Revolutionise your workflow with ultimate Al optimisation today!Revolutionise your workflow with ultimate Al optimisation today!</p>
          </div>
      </div>

      <div className="section1">
         
          <div>
               <img  src={IMG1} />
          </div>
          <div>
          <h2>Visualise</h2>
              <p>Revolutionise your workflow with ultimate Al optimisation today!Revolutionise your workflow with ultimate Al optimisation today!</p>
          </div>
       </div>

       <div className="section1">
         
         <div>
              <img  src={IMG1} />
         </div>
         <div>
         <h2>Brainstorm</h2>
             <p>Revolutionise your workflow with ultimate Al optimisation today!Revolutionise your workflow with ultimate Al optimisation today!</p>
         </div>
      </div>


    
  </div>
          </Grid>
        </Grid>
        )}
      </Container>
    </Box>
  );
};

export default TwoTabComponent;