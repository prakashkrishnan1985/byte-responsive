// import React, { useState, useEffect } from 'react';

// const BackgroundImage = () => {
//   const [clockwiseRotation, setClockwiseRotation] = useState(0); // State for clockwise rotation
//   const [antiClockwiseRotation, setAntiClockwiseRotation] = useState(0); // State for anti-clockwise rotation

//   // Rotate the paths using useEffect and setInterval
//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Update clockwise rotation (increment by 1 degree)
//       setClockwiseRotation((prev) => (prev + 1) % 360);

//       // Update anti-clockwise rotation (decrement by 1 degree)
//       setAntiClockwiseRotation((prev) => (prev - 1 + 360) % 360);
//     }, 20); // Adjust the interval for faster/slower rotation

//     // Cleanup interval on component unmount
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//       <svg xmlns="http://www.w3.org/2000/svg" width="800" height="538" viewBox="0 0 1600 1076" fill="none">
//         {/* Define the blur filter */}
//         <defs>
//           <filter id="blurFilter">
//             <feGaussianBlur in="SourceGraphic" stdDeviation="30" /> {/* 30% blur */}
//           </filter>
//           <clipPath id="clip0_1556_1152">
//             <rect width="1600" height="1141" fill="white" />
//           </clipPath>
//         </defs>

//         {/* Apply rotation and blur to the group */}
//         <g clipPath="url(#clip0_1556_1152)">
//           {/* First path with clockwise rotation */}
//           <path
//             opacity="0.2"
//             d="M1490.27 773.81C1246.16 788.343 1405.82 464.944 1405.82 464.944C1405.82 464.944 1490.2 368.996 1390.68 290.098C1158.97 106.399 1066.85 248.41 1085.56 379.368C1104.27 510.326 971.663 495.098 971.663 495.098C873.115 480.727 909.17 611.381 991.765 683.59C1274.6 930.859 837.775 860.039 961.547 904.479C1085.32 948.92 1142.72 915.328 1142.72 915.328C1370.66 657.072 1264.72 756.347 1373.91 890.673C1445.84 840.26 1860.92 751.744 1490.27 773.81Z"
//             fill="#BA00D3"
//             fillOpacity="0.8"
//             transform={`rotate(${clockwiseRotation} 800 538)`} // Apply clockwise rotation
//             filter="url(#blurFilter)" // Apply blur
//           />

//           {/* Second path with anti-clockwise rotation */}
//           <path
//             opacity="0.4"
//             d="M553.054 875.149C822.958 964.24 1042.62 939.334 1032.37 907.79C1063.83 870.379 919.135 880.195 982.34 701.523C1061.35 478.183 889.144 670.043 793.886 734.712C698.629 799.381 594.738 567.892 559.805 460.72C536.222 377.303 449.261 213.8 290.087 227.118C91.118 243.765 -309.487 133.451 -300.394 248.268C-291.301 363.085 -366.382 353.998 -85.1091 435.939C196.164 517.88 297.125 484.982 231.162 622.495C178.392 732.506 165.898 665.13 150.388 671.061C119.935 878.939 215.674 763.785 553.054 875.149Z"
//             fill="#8700FF"
//             fillOpacity="0.8"
//             transform={`rotate(${antiClockwiseRotation} 800 538)`} // Apply anti-clockwise rotation
//             filter="url(#blurFilter)" // Apply blur
//           />

//           {/* White rectangle with blur */}
//           <rect width="1600" height="1141" fill="white" fillOpacity="0.11" style={{ filter: 'blur(97px)' }} />
//         </g>
//       </svg>
//     </div>
//   );
// };

// export default BackgroundImage;

import React, { useState, useEffect } from "react";

const BackgroundImage = () => {
  const [rotation1, setRotation1] = useState(0); // Rotation for the first SVG
  const [rotation2, setRotation2] = useState(0); // Rotation for the second SVG
  const [swap, setSwap] = useState(false); // State to toggle swapping

  // Rotate the SVGs and swap their positions periodically
  useEffect(() => {
    const rotateInterval = setInterval(() => {
      // Rotate the first SVG clockwise
      setRotation1((prev) => (prev + 1) % 360);

      // Rotate the second SVG counter-clockwise
      setRotation2((prev) => (prev - 1 + 360) % 360);
    }, 20); // Adjust rotation speed

    const swapInterval = setInterval(() => {
      // Toggle the swap state every 5 seconds
      setSwap((prev) => !prev);
    }, 50); // Swap every 5 seconds

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(rotateInterval);
      clearInterval(swapInterval);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "transparent", // Transparent background
        position: "relative",
        filter: "blur(20px)", // Apply blur to the background
      }}
    >
      {/* First SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1600 1076"
        style={{
          width: "100%",
          height: "auto",
          position: "absolute",
          transform: `rotate(${rotation1}deg)`,
          transition: "transform 0.5s ease-in-out",
          zIndex: swap ? 2 : 1, // Swap z-index based on state
        }}
      >
        <g clipPath="url(#clip0_1556_1152)">
          <path
            opacity="0.4"
            d="M1490.27 773.81C1246.16 788.343 1405.82 464.944 1405.82 464.944C1405.82 464.944 1490.2 368.996 1390.68 290.098C1158.97 106.399 1066.85 248.41 1085.56 379.368C1104.27 510.326 971.663 495.098 971.663 495.098C873.115 480.727 909.17 611.381 991.765 683.59C1274.6 930.859 837.775 860.039 961.547 904.479C1085.32 948.92 1142.72 915.328 1142.72 915.328C1370.66 657.072 1264.72 756.347 1373.91 890.673C1445.84 840.26 1860.92 751.744 1490.27 773.81Z"
            fill="#BA00D3"
            fillOpacity="0.8"
          />
          <path
            opacity="0.4"
            d="M553.054 875.149C822.958 964.24 1042.62 939.334 1032.37 907.79C1063.83 870.379 919.135 880.195 982.34 701.523C1061.35 478.183 889.144 670.043 793.886 734.712C698.629 799.381 594.738 567.892 559.805 460.72C536.222 377.303 449.261 213.8 290.087 227.118C91.118 243.765 -309.487 133.451 -300.394 248.268C-291.301 363.085 -366.382 353.998 -85.1091 435.939C196.164 517.88 297.125 484.982 231.162 622.495C178.392 732.506 165.898 665.13 150.388 671.061C119.935 878.939 215.674 763.785 553.054 875.149Z"
            fill="#8700FF"
            fillOpacity="0.8"
          />
        </g>
        <defs>
          <clipPath id="clip0_1556_1152">
            <rect width="1600" height="1141" fill="white" />
          </clipPath>
        </defs>
      </svg>

      {/* Second SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1037 742"
        style={{
          width: "50%",
          height: "auto",
          position: "absolute",
          transform: `rotate(${rotation2}deg)`,
          transition: "transform 0.5s ease-in-out",
          zIndex: swap ? 1 : 2, // Swap z-index based on state
        }}
      >
        <path
          opacity="0.4"
          d="M553.054 680.149C822.958 769.24 1042.62 744.334 1032.37 712.79C1063.83 675.379 919.135 685.195 982.34 506.523C1061.35 283.183 889.144 475.043 793.886 539.712C698.629 604.381 594.738 372.892 559.805 265.72C536.222 182.303 449.261 18.8001 290.087 32.1176C91.118 48.7647 -309.487 -61.549 -300.394 53.268C-291.301 168.085 -366.382 158.998 -85.1091 240.939C196.164 322.88 297.125 289.982 231.162 427.495C178.392 537.506 165.898 470.13 150.388 476.061C119.935 683.939 215.674 568.785 553.054 680.149Z"
          fill="#8700FF"
          fillOpacity="0.8"
        />
      </svg>
    </div>
  );
};

export default BackgroundImage;

// export default BackgroundImage;
