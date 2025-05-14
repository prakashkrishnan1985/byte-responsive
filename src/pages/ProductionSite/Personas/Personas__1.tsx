import React, { useState, useEffect } from "react";
import IMG from "../../assets/bg-blur_1.svg";
import IMG1 from "../../assets/bg-blur.png";
import IMG3 from "../../assets/noaicodeneeded.png";
import TwoTabComponent from "./tab";
import RotatingImage from "../Sppiner/RotatingImage";
import "./personas.css";

const MovingBackground: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0);

  // Handle mouse movement
  const handleMouseMove = (e: any) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate the angle between the cursor and the center
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const newAngle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI; // Convert radians to degrees

    setAngle(newAngle);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prevAngle) => (prevAngle + 1) % 360);
    }, 10);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div id="about">
      <div
        style={{
          width: "689px",
        }}
      >
        <div>
          <div className="section-PERSONAS">PERSONAS</div>
          <div
            id="All"
            style={{
              display: "flex",
              position: "absolute",
              padding: "20px 10px",
              margin: "2rem 20px",
              zIndex: 2,
            }}
          >
            <div id="right" style={{ width: "50%" }}>
              <div className="title">
                <span>Only one tool </span> <i>for all the tasks</i>
              </div>
              <div className="fullText">
                Who is ByteSized for? Both innovators and developers, you can do
                lorem ipsum dolor Sit amet consectetur. Urna mi arcu vivamus
                sagittis volutpat tristique. Sit viverra nunc mollis proin
                nascetur porta tristique sed blandit. Sodales sed
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <RotatingImage height="280" />
              </div>
            </div>
            <div id="left" style={{ width: "50%" }}>
              <div
                style={{
                  background: "#0000001A",
                  padding: "30px",
                  borderRadius: "10px",
                }}
              >
                <div style={{ background: "#FFFFFF33" }}>
                  {/* background: '#0000001A' */}
                  <TwoTabComponent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100vw",
          height: "90vh",
          overflow: "hidden",
          position: "relative",
          backgroundImage: `url(${IMG1})`,
          backgroundRepeat: "no-repeat",
          filter: "blur(1rem)",
        }}
        //   onMouseMove={handleMouseMove}
      >
        <div
          style={{
            width: "100%", // Slightly larger to allow movement
            height: "100%",
            backgroundImage: `url(${IMG})`, // Replace with your image URL
            //   backgroundPosition: `${50 + position.x}% ${50 + position.y}%`, // Move on X and Y axes
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            transform: `rotate(${angle}deg)`, // Rotate the background image
            transition: "transform 3.6s ease-out", // Smooth transition
            opacity: 0.2,
          }}
        ></div>
      </div>
      <div
        style={{
          position: "relative",
          bottom: "150px",
          width: "100%",
          padding: "10px",
          margin: "20px",
        }}
      >
        <img src={IMG3} width="100%" />
      </div>
    </div>
  );
};

export default MovingBackground;
