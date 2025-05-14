import React, { useState } from "react";
import IMG3 from "../../../assets/Puzzle piece-Photoroom1.png";
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
            <div className="title_">
              MONETIZE OR OPEN SOURCE WITH THE MARKETPLACE
            </div>
          </div>
          <p className="fullText">
            AI developers can contribute modular agents and production-ready
            models to the ByteSizedAI Marketplace—either to monetize or open
            source. Help teams move faster with reusable components, and grow a
            trusted community of builders.
          </p>
          <div className="bottomText">REUSABLE. RELIABLE. REWARDED.</div>
        </div>
      </section>
    </>
  );
};

export default Cards3;
