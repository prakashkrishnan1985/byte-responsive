import React, { useState } from "react";
import IMG1 from "../../assets/coding-3d-icon-Photoroom2.png";

import "./cards.css";

const Cards1: React.FC = () => {
  
    return (
     <>
           <section className="hero">
            <div className="icon">
                <img src={IMG1} />
            </div>
            <div className="container">
              <div className="rightAlign">
                <div className="title">BUILD, DON'T CONSULT</div>
              </div>

              <p className="subtext">BYRGSTROt Al Studio puts the power in your hands to create Al agents that are uniquely yours. No need for consultants—just tools that fit your vision, just like writing your own code.</p>
              <div className="sub-title">innovation for success</div>
            </div>
          </section> 
        
        
      </>
    );
  };
  
  export default Cards1;
  