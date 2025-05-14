import React, { useRef, useState, useEffect } from "react";
import "./RotatingImage.css";
import logo from "../../../assets/3d-element-small.png";

interface HeaderProps {
  height: string;
  loader?: any;
}

const RotatingImage: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { height, loader } = props;
  const imageRef = useRef<HTMLImageElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const rotationAngleRef = useRef(0); // Track the current rotation angle
  const animationFrameRef = useRef<number | null>(null);
  const rotationSpeedRef = useRef(5); // Initial rotation speed (degrees per frame)


  const rotateImage = () => {
    if (imageRef.current) {
      rotationAngleRef.current += 1; // Increment the rotation angle
      // if (rotationAngleRef.current >= 360) {
      //   rotationAngleRef.current = 0; // Reset after a full rotation
      // }
      imageRef.current.style.transform = `rotate(${rotationAngleRef.current}deg)`;
    }
    animationFrameRef.current = requestAnimationFrame(rotateImage);
  };

  const rotateSlowDownImage = () => {
    if (imageRef.current) {
      rotationAngleRef.current -= 1;
      imageRef.current.style.transform = `rotate(${rotationAngleRef.current}deg)`;
    }
    animationFrameRef.current = requestAnimationFrame(rotateImage);
  };

  useEffect(() => {
    if (isHovered) {
      // Start rotation on hover
      animationFrameRef.current = requestAnimationFrame(rotateImage);
    } else {
      // Stop rotation on mouse leave
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(false); // Start rotation
  };

  const handleMouseLeave = () => {
    // const clearT = setTimeout(() => {
    //   setIsHovered(false);
    //   // rotateSlowDownImage();
    //   clearTimeout(clearT);
    // }, 1000);
    setIsHovered(true);
  };

  useEffect(() => {
    handleMouseLeave();
    if (!loader) {
      handleMouseLeave();
    }
  }, [loader]);



  return (
    <div className="image-container">
      <img
        ref={imageRef}
        src={logo}
        alt="Rotating 3D Element"
        className="rotating-image"
        onMouseEnter={loader ? () => { return true } : handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        height={height || "380"}
      />
    </div>
  );
};

export default RotatingImage;
