import { Box } from "@mui/material";
import React from 'react';
import { FaLeaf, FaRecycle, FaWater, FaSolarPanel, FaTimes } from 'react-icons/fa';
import './styles/sustainabilityReport.css';

const SustainabilityReports = () => {
  const [isVisible, setIsVisible] = React.useState(true);
  const items = [
    { icon: <FaLeaf />, number: '120', text: 'Trees Planted' },
    { icon: <FaRecycle />, number: '1500', text: 'Recycled Items' },
    { icon: <FaWater />, number: '300', text: 'Liters of Water Saved' },
    { icon: <FaSolarPanel />, number: '500', text: 'Solar Panels Installed' },
  ];

  if (!isVisible) return null;


  return (
    <div className="sustainability-report">
        <button className="close-button" onClick={() => setIsVisible(false)} style={{position:'absolute', right:"45px", top:"20px", outline:'none', border:'none', background:'transparent'}}>
        <FaTimes />
      </button>
      <h2 style={{textAlign:'left', position:'relative', left:"34px"}}>Sustainability Report</h2>
      <div className="report-items">
        {items.map((item, index) => (
          <div className="report-item" key={index}>
            <div className="icon">{item.icon}</div>
            <div className="info">
              <h2>{item.number}</h2>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SustainabilityReports;
