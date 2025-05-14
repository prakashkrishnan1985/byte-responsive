import React, { useState } from "react";
import IMG2 from "../../../assets/Trophy-minimal-Photoroom1.png";
import "./cards.css";

const Cards1: React.FC = () => {

  return (
    <>


      <section className="features">
        <div className="icon">
          <img src={IMG2} />
        </div>
        <div className="container">
          <div>
            <div className="rightAlign">
              <div className="title_">YOUR AGENTS, YOUR EXPERTISE </div>
            </div>
            <p>Build agents designed for your product stack and workflows. They're yours to own, integrating seamlessly into your unique business ecosystem.</p>
          </div>
          <div>
            <p className="subtext">
              Built for Your Stack, Owned by You
            </p>
          </div>
        </div>
      </section>


    </>
  );
};

export default Cards1;
