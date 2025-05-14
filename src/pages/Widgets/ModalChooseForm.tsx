import React, { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Input,
  TextField,
  Button,
  Grid,
  Box,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useWidget } from "../../providers/WidgetsProvider";
import {
  createWidget,
  getSignedUrl,
  PayloadCreateWidegt,
  PayloadSignedUrl,
} from "../../services/widgetsService";
import { toast } from "react-toastify";

const ModalChooseForm: React.FC = () => {
  const navigate = useNavigate();
  const { name, setName, description, setDescription, setWidgetId } = useWidget();  // use state error validation

  const [errors,setErrors]=useState({name: '',description:''});

  const {
    selectedOption,
    setSelectedOption,
    setUploadImgUrl,
    setImgConfigPayload,
    scriptConfigPayload,
    setScriptConfigPayload,
    setUploadScriptUrl,
  } = useWidget();

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const getS3SingnedUrlForImage = async (payload: PayloadSignedUrl) => {
    try {
      const response = await getSignedUrl(payload);
      if (response) {
        setUploadImgUrl((response as any).url);
        setImgConfigPayload((response as any).fields);
      }
    } catch (error) {
      console.error("Error during widget creation:", error);
    }
  };

  const getS3SingnedUrlForScript = async (payload: PayloadSignedUrl) => {
    try {
      const response = await getSignedUrl(payload);
      if (response) {
        setUploadScriptUrl((response as any).url);
        setScriptConfigPayload((response as any).fields);
      }
    } catch (error) {
      console.error("Error during widget creation:", error);
    }
  };

  
  const handleDoneClick = async () => {

    const validation:{name:string; description:string}={
      name:'',
      description:'',
     }
     if(!name.trim()){
      validation.name='Please provide the name.'
     }
  
     if(!description.trim()){
      validation.description='Please provide the description.'
     }
  
  
     // Proceed after the validation
      if(!validation.name && !validation.description){
      

    
    const payload: PayloadCreateWidegt = {
      name: name,
      description: description,
    };
    const loadingToast = toast.loading("Saving your data...");
    try {
      const response = await createWidget(payload);
      if (response) {
        toast.dismiss(loadingToast);
        toast.success("Widget created successfully!");
        setWidgetId((response as any).widget_id);
        setName((response as any).name);
        const signedUrlPayloadForImg = {
          type: "png",
          widget_id: (response as any).widget_id,
        };
        const signedUrlPayloadForScript = {
          type: "html",
          widget_id: (response as any).widget_id,
        };
        getS3SingnedUrlForImage(signedUrlPayloadForImg);
        getS3SingnedUrlForScript(signedUrlPayloadForScript);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to create widget");
      console.error("Error during widget creation:", error);
    }
    if (selectedOption === "chatWindow") {
      navigate("/chat-widget");
    }
    if (selectedOption === "customSearch") {
      navigate("/search-widget");
    }}
    else{
      setErrors(validation);
  
    };
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      <Grid
        container
        spacing={3}
        direction="column"
        sx={{
          width: '60%', 
          padding: 3,
          boxSizing: 'border-box',
          borderRadius: '8px',
          border: "1px solid black"
        }}
      >
        <Grid item>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup row value={selectedOption} onChange={handleOptionChange} sx={{ justifyContent: 'center' }}>
              <FormControlLabel value="chatWindow" control={<Radio sx={{ '&.Mui-checked': { color: '#7BFF00' } }}/>} label="Chat Window" />
              <FormControlLabel value="customSearch" control={<Radio sx={{ '&.Mui-checked': { color: '#7BFF00' } }} />} label="Custom Search" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <InputLabel htmlFor="name">Name</InputLabel>
            </Grid>
            <Grid item xs={12}>
              <Input
                id="name"
                value={name}
                onChange={(e) =>{
                  setName(e.target.value);
                  setErrors((prevErrors)=>({...prevErrors,name:''}))
                 }}
                fullWidth
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px',
                }}
              />
               {errors.name &&(
                <Typography variant='body2' color='error'>
                  {errors.name}
                </Typography>
               )}

              
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <TextField
            label="Description"
            value={description}
            onChange={(e) =>{
              setDescription(e.target.value);
              setErrors((prevErrors)=>({...prevErrors,description:''}))
             }}
            fullWidth
            multiline
            rows={4}
            sx={{
              marginTop: 2,
            }}
          />
           {errors.description &&(
                <Typography variant='body2' color='error'>
                  {errors.description}
                </Typography>
          )}
        </Grid>

        <Grid item>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#7BFF00",
                  color: "#000000",
                  "&:hover": {
                    borderColor: "#7BFF00",
                    backgroundColor: "#7BFF00",
                    color: "white",
                  },
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color='success' sx={{
                  borderColor: '#7BFF00',
                  color: '#ffffff',
                  '&:hover': {
                    borderColor: '#7BFF00',
                    backgroundColor: '#7BFF00', 
                    color: 'white', 
                  },
                }}
                onClick={handleDoneClick}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ModalChooseForm;