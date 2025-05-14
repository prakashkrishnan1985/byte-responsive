import React, { useState, useEffect } from 'react';
import MeetByteScreen from './MeetByteScreen'; 
import ByteSizedAiIntro from './ByteSizedAiIntro';

const ByteSizedAIintroWrapper: React.FC = () => {
  const [showByteSizedAiIntro, setShowByteSizedAiIntro] = useState(false);

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      {<ByteSizedAiIntro />}
    </div>
  );
};

export default ByteSizedAIintroWrapper;
