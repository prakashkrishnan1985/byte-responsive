import React, { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import './Countdown.css';

const Countdown = () => {
  const [currentNumber, setCurrentNumber] = useState(3);

  const renderTime = ({ remainingTime }:{remainingTime:any}) => {
    if(remainingTime == 0){
      return
    }

    return (
      <div className="timer">
        <div className="background"></div>
        <div className="value">{remainingTime}</div>
      </div>
    );
  };

  return (
    <div className="eoi-page">
      <CountdownCircleTimer
        isPlaying
        duration={3}
        colors={["#25750b", "#25750b", "#25750b"]}
        colorsTime={[3, 2, 1]}
        onComplete={() => ({ shouldRepeat: true, delay: 1 })}
        trailColor={"#000000"}
        strokeWidth={5}
        size={250}
      >
        {renderTime}
      </CountdownCircleTimer>
    </div>
  );
};

export default Countdown;
