import React, { useState } from "react";
import IMG1 from "../../../assets/coding-3d-icon-Photoroom2.png";

import "./cards.css";

const Cards1: React.FC = () => {

  return (
    <>
      <section className="hero">
        <div className="icon">
          <img src={IMG1} alt="Coding Icon" />
        </div>
        <div className="container">
          <div className="rightAlign">
            <div className="title_">BUILD, DON'T CONSULT</div>
          </div>
          <p className="subtext">BYTESIZED AI Studio puts the power in your hands to create AI agents that are uniquely yours. No need for consultants—just tools that fit your vision, just like writing your own code.</p>
          <div className="sub-title">innovation for success</div>
        </div>
      </section>


    </>
  );
};

export default Cards1;
