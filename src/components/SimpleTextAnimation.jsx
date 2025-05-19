import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Threads from "./Threads";

function SimpleTextAnimation() {
  const phrases = ['RAG Retriever', 'Similarity Score', 'LLM', 'Agentic Actions'];
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        color: 'white',
        position: 'relative',
        zIndex: 2,
        marginBottom: '10vh' 
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold',
          margin: 0,
          marginRight: '1.5rem',
          color: 'white'
        }}>
          Deploying
        </h1>
        
        <div style={{ position: 'relative', height: '6rem', display: 'flex', alignItems: 'center' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                fontSize: '3rem',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                backgroundColor: '#9C27B0',
                color: 'white',
                padding: '0.5rem 2rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 15px rgba(156, 39, 176, 0.4)'
              }}
            >
              {phrases[currentIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
   
      <div style={{ 
        width: '100%', 
        height: '100%', 
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1
      }}>
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
          color={[0.6, 0.2, 0.8]} 
        />
      </div>
    </div>
  );
}

export default SimpleTextAnimation;