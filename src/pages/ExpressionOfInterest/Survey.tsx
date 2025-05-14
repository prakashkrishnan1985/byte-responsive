import React, { useState, useEffect } from 'react';
import Questionnaire from './Questionnaire'; 
import ImpressiveChoice from './ImpressiveChoice';

const ByteSizedAIintroWrapper: React.FC<any> = (props:any) => {
  const [showImressiveChoice, setImpressiveChoice] = useState(props.showImressiveChoice); 
  const [showSurvey, setShowSurvey] = useState(false);

  const timer = props.showImressiveChoice ? 4000: 0;

  useEffect(() => {
    const meetByteScreenTimeout = setTimeout(() => {
      setImpressiveChoice(false); 
      setShowSurvey(true); 
    }, timer);

    return () => {
      clearTimeout(meetByteScreenTimeout);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', overflowX: 'hidden' }}>
      {showImressiveChoice && <ImpressiveChoice />}
      {showSurvey && <Questionnaire
            {...props}
            />}
    </div>
  );
};

export default ByteSizedAIintroWrapper;
