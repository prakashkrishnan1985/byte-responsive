import React, { useRef, useEffect } from 'react';
// import './CircleButton.css'; // Import the CSS file

const CircleButton = ({ size = 100, name = "Hover Me", shadowColor = "#fff", defaultColor = "#007bff",  borderColor = "#fff" , actionEvent, isMob}:any) => {
  const buttonRef:any  = useRef(null);

  useEffect(() => {
    const button :any = buttonRef.current;

    const handleMouseMove = (e:any) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const maxDistance = 150; // Adjust this value to control the attraction range

      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        const offsetX = distanceX * force ; // Adjust the multiplier for strength
        const offsetY = distanceY * force ;

        button.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      } else {
        button.style.transform = 'translate(0, 0)';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="circle-button-container" style={{height: isMob ? "100px" : "245px", width: isMob ? "100px" : "245px"}}>
      <button
        ref={buttonRef}
        className=" circle-button"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: defaultColor,
          border: `2px solid ${borderColor}`,
          // boxShadow: `0 4px 6px ${shadowColor}`,
         fontSize: `${size / 150}rem`,
          
        }}
        onClick={actionEvent}
      >
        {name}
      </button>
    </div>
  );
};

export default CircleButton;