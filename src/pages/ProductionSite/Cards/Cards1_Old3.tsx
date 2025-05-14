import React, { useState } from "react";
import IMG3 from "../../assets/Puzzle piece-Photoroom1.png";
import "./cards.css";

const Cards3: React.FC = () => {
  
    return (
     <>
         <section className="languages">
         <div className="icon">
                <img src={IMG3} />
            </div>
            <div className="container">
              <div className="rightAlign">
                <div className="title">Millions of Possibilities, to your Expertise</div>
              </div>
              <p>Combine pre-trained models with drag-and-drop simplicity to build custom AI agents. No AI expertise needed—just endless possibilities for automation, analysis, and innovation.</p>
              <div className="bottomText">+17 code languages</div>
            </div>
          </section>
      </>
    );
  };
  
  export default Cards3;
  