import React from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';

const ArrowEdge: React.FC<EdgeProps> = ({ id, sourceX, sourceY, targetX, targetY, style }) => {
  const [path] = getBezierPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <path
        id={id}
        style={style}
        d={path}
        className="react-flow__edge-path"
      />
      {/* Arrowhead */}
      <svg
        width="20"
        height="20"
        style={{ position: 'absolute', left: targetX-30, top: targetY - 10, border:"1px solid red" }}
      >
        <polygon
          points="10,10 0,5 0,15" // Right-opening arrow
          fill="black" // Change to your desired arrow color
          transform={`translate(${targetX - 5}, ${targetY - 10})`}
        />
      </svg>
    </>
  );
};

export default ArrowEdge;
