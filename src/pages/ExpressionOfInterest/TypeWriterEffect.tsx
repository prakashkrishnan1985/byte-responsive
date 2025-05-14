import React, { useState, useEffect, Children } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  customFontsize?: string;
  children?: any;
  isStrikeOutVisible?:boolean;
}

const TypeWriterEffect: React.FC<TypewriterProps> = ({
  children,
  text,
  speed = 100,
  customFontsize = "2rem",
  isStrikeOutVisible
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [isCursorVisible, setIsCursorVisible] = useState(true);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, speed);

      return () => clearTimeout(timeoutId);
    } else {
      setIsCursorVisible(false);
    }
  }, [index, text, speed]);

  useEffect(() => {
    if (index < text.length) {
      const cursorBlinkInterval = setInterval(() => {
        setIsCursorVisible((prev) => !prev);
      }, 500);

      return () => clearInterval(cursorBlinkInterval);
    }
  }, [index, text]);

  return (
    <div
      style={{
        width: "100%",
        wordWrap: "break-word",
        fontSize: customFontsize,
        overflow: "hidden",
        display: "inline-block",
        wordBreak: "break-word",
        whiteSpace: "normal",
      }}
    >
      <span
        style={
          isStrikeOutVisible
            ? {
                textDecoration: "line-through",
                color: "#25750b",
                textDecorationThickness: "4px",
              }
            : {}
        }
      >
        <span
          style={{
            color: "white",
          }}
        >
          {displayedText}
          {children}
        </span>
      </span>
      {isCursorVisible && (
        <span className="cursor" style={{ color: "#25750b" }}>
          |
        </span>
      )}
    </div>
  );
};

export default TypeWriterEffect;
