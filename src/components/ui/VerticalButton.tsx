import * as React from 'react';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import EnergySavingIcon from '@mui/icons-material/EnergySavingsLeafOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function VerticalToggleButtons({view, children}:any) {
  return (
    <ToggleButtonGroup
      orientation="vertical"
      value={view}
      exclusive
    >
    {children.map((item: any)=>item)}
    </ToggleButtonGroup>
  );
}
