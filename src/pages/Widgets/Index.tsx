import React, { useState } from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, InputLabel, Input, TextField, Button, Grid } from '@mui/material';
import { useWidget } from '../../providers/WidgetsProvider';

const ModalChooseForm: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('chatWindow');
 
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const {  description, setDescription, name, setName } = useWidget();

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={12} sm={6}>
        <FormControl component="fieldset">
          <RadioGroup row value={selectedOption} onChange={handleOptionChange}>
            <FormControlLabel value="chatWindow" control={<Radio />} label="Chat Window" />
            <FormControlLabel value="customSearch" control={<Radio />} label="Custom Search" />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <InputLabel htmlFor="name">Name</InputLabel>
          </Grid>
          <Grid item xs={8}>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item>
            <Button variant="outlined">Cancel</Button>
          </Grid>
          <Grid item>
            <Button variant="contained">Done</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ModalChooseForm;
