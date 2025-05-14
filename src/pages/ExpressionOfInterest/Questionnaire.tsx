import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Box,
  Chip,
  Typography,
  Tooltip,
} from "@mui/material";
import { BsArrowUpRight } from "react-icons/bs";
import { updateUserAgents } from "../../services/userAgentService";
import { AppStage } from ".";
import storageUtil from "../../utils/localStorageUtil";
import Loader from "../../components/ui/Loader";

const Questionnaire: React.FC<any> = ({
  list,
  setCallToAction,
  selectedAgents,
  sessionId,
  userAgentSelectionId,
  setCurrentStage,
}: {
  list: any[];
  setCallToAction: any;
  selectedAgents: any;
  sessionId: string;
  userAgentSelectionId: string;
  setCurrentStage: any;
}) => {
  const [otherInputs, setOtherInputs] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>( {});
  const [userSelection, setUserSelection] = useState<any[]>(list);
  const initialAnswers = userSelection.reduce((acc: any, item: any) => {
    acc[item.agent_id] = [];
    return acc;
  }, {} as { [key: string]: string[] });

  const [answers, setAnswers] = useState<{ [key: string]: string[] }>(() => {
    const savedAnswers = storageUtil.getItemSession("surveyAnswers");
    if (savedAnswers) {
      return savedAnswers; 
    }
    return initialAnswers;
  });

  useEffect(() => {
    // Retrieve saved answers from session storage if available
    const savedAnswers = storageUtil.getItemSession("surveyAnswers");
    if (savedAnswers) {
      setAnswers(savedAnswers as any);
    }

    if (list && list.length > 0) {
      setUserSelection(list);
    } else {
      const savedChoices = storageUtil.getItemSession("survey");
      if (savedChoices) {
        setUserSelection(savedChoices as any[]);
      }
    }
  }, [list]);

  const handleCheckboxChange = (agent_id: string, option: string) => {
    const newAnswers = { ...answers };
    const selectedOptions = newAnswers[agent_id];

    if (option === "Other" && selectedOptions?.includes("Other")) {
      newAnswers[agent_id] = selectedOptions?.filter((item: string) => item !== "Other");
    } else if (selectedOptions?.includes(option)) {
      newAnswers[agent_id] = selectedOptions?.filter((item: string) => item !== option);
    } else {
      newAnswers[agent_id]?.push(option);
    }

    if (!newAnswers[agent_id]?.includes("Other")) {
      const newOtherInputs = { ...otherInputs };
      newOtherInputs[agent_id] = "";
      setOtherInputs(newOtherInputs);
    }

    setAnswers(newAnswers);
    storageUtil.setItemSession("surveyAnswers", newAnswers);
  };

  const handleOtherInputChange = (agent_id: string, value: string) => {
    const newOtherInputs = { ...otherInputs };
    newOtherInputs[agent_id] = value;
    setOtherInputs(newOtherInputs);
  };

  const validateForm = () => {
    let isValid = true;
    let errors: { [key: string]: boolean } = {};

    for (const agent_id of Object.keys(answers)) {
      if (answers[agent_id].length === 0 ||
        (answers[agent_id]?.includes("Other") && !otherInputs[agent_id])) {
        isValid = false;
        errors[agent_id] = true;
      }
    }

    setInputErrors(errors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      setValidationError("Please select at least one option for each question and provide a value for 'Other' if selected.");
      return;
    }

    setValidationError(null);
    const formattedAnswers = Object.keys(answers).map((agent_id) => {
      const selected_choices = answers[agent_id].map((choice) => {
        if (choice === "Other") {
          return otherInputs[agent_id] || "Other";
        }
        return choice;
      });

      return { agent_id, selected_choices };
    });
    let id_db;
    if(!userAgentSelectionId || userAgentSelectionId===""){
      id_db = storageUtil.getItemSession("db_id") as any
    }
    else{
      id_db= userAgentSelectionId;
    }
    const payload = {
      session_id: sessionId,
      agent_ids: selectedAgents,
      selected_fields: formattedAnswers,
      id: id_db,
    };

    setLoading(true);
    setError(null);

    try {
      const response = await updateUserAgents(payload);
      setSuccess(true);
      setCurrentStage(AppStage.STAGE_THREE);
      setCallToAction(true);
    } catch (error) {
      setError("Failed to update user agents");
    } finally {
      setLoading(false);
    }
  };

  const handleSkipClick = () => {
    setCurrentStage(AppStage.STAGE_THREE);
    setCallToAction(true);
  };

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100vw",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: { xs: "40px", md: "0px" },
        }}
      >
        <Typography
          variant="h2"
          sx={{ color: "white", fontSize: { xs: "24px", md: "33px" }, paddingTop:{md:"25px"} }}
        >
        Let us know what you’d like to achieve with the models or agents you’ve selected.
        </Typography>
      </Box>

      {validationError && (
        <Typography sx={{ color: "red", fontSize: "16px", marginTop: "16px" }}>
          {validationError}
        </Typography>
      )}

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Grid
          container
          spacing={5}
          pl={{ base: 0, lg: 20 }}
          pt={{ xs: "70px", md: "50px" }}
          justifyContent="center"
        >
          {userSelection.map((item: any, questionIndex: number) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              key={item.agent_id}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                paddingTop: "0px",
                width: "100%",
              }}
            >
              <FormControl
                component="fieldset"
                fullWidth
                sx={{ width: "100%", padding: { md: "0px", xs: "10px 0px" } }}
              >
                <FormLabel
                  component="legend"
                  sx={{
                    color: "white",
                    width: "100%",
                    padding: { md: "25px 0px 10px 50px" },
                  }}
                >
                  <Tooltip
                    title={item?.tooltipText}
                    slotProps={{
                      tooltip: {
                        sx: {
                          color: "#fff",
                          backgroundColor: "black",
                          border: "2px solid, #7bff004a",
                          padding: "10px 0px 10px 10px",
                          fontSize: "12px",
                          borderRadius: "10px",
                        },
                      },
                    }}
                    arrow
                  >
                    <Chip
                      label={item?.title}
                      icon={item?.icon}
                      variant="outlined"
                      sx={{
                        cursor: "grab",
                        color: "white",
                        background: "#7bff004d",
                        border: "2px solid, #7bff004a",
                        padding: { xs: "20px 0px" },
                        fontSize: { xs: "18px" },
                        width: { xs: "400px", md: "360px" },
                      }}
                    />
                  </Tooltip>
                </FormLabel>

                {[...item.options, "Other"].map(
                  (option: any, optionIndex: number) => (
                    <FormControlLabel
                      key={optionIndex}
                      control={
                        <Checkbox
                          checked={answers[item.agent_id]?.includes(option)}
                          onChange={() =>
                            handleCheckboxChange(item.agent_id, option)
                          }
                          sx={{ color: "white" }}
                        />
                      }
                      label={option}
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "0px",
                        paddingLeft: { md: "60px", xs: "6px" },
                      }}
                    />
                  )
                )}

                {answers[item.agent_id]?.includes("Other") && (
                  <TextField
                    label="Please specify"
                    variant="standard"
                    value={otherInputs[item.agent_id] || ""}
                    onChange={(e) =>
                      handleOtherInputChange(item.agent_id, e.target.value)
                    }
                    fullWidth
                    margin="dense"
                    InputProps={{
                      style: {
                        color: "white",
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        color: "white",
                      },
                    }}
                    error={inputErrors[item.agent_id]}
                    helperText={
                      inputErrors[item.agent_id]
                        ? "This field is required."
                        : ""
                    }
                    sx={{
                      "& .MuiInput-underline:before": {
                        borderBottomColor: "white",
                      },
                      "& .MuiInput-underline:hover:before": {
                        borderBottomColor: "white",
                      },
                      width: { md: "57%", xs: "98%" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "flex-end",
                      paddingRight: { md: "212px" },
                    }}
                  />
                )}
              </FormControl>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="center">
          <Button
            onClick={handleSkipClick}
            color="primary"
            style={{ padding: "10px 30px", color: "white" }}
          >
            Skip <BsArrowUpRight style={{ marginLeft: "5px" }} />
          </Button>
          <Button
            type="submit"
            style={{ padding: "10px 30px", color: "white" }}
          >
            Submit <BsArrowUpRight style={{ marginLeft: "5px" }} />
          </Button>
        </Box>
      </form>
      {loading && (
        <Loader />
      )}
    </Container>
  );
};

export default Questionnaire;
