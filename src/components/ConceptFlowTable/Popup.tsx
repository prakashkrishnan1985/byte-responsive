import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  Grid,
  Card,
  Box,
  Snackbar,
  DialogTitle,
  Chip,
} from "@mui/material";
import {
  Clear as ClearIcon,
  Delete as DeleteIcon,
  LeakRemoveTwoTone,
} from "@mui/icons-material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { useDnD } from "../../providers/DnDContext";
import { useDataFlow } from "../../providers/FlowDataProvider";
import { getConcept, PutConcept } from "../../services/conceptService";
import ModalOutput from "../develop/ModalOutput";
import DataSourceForm from "./DataSourceForm";
import ConceptMockData from "./ConceptMockData";
import ModalInput from "../develop/ModalInput";
import { useOrchestration } from "../../providers/OrchestrationProvider";
import { SectionName } from "./Index";
import { updateYield } from "typescript";

interface RowData {
  value: string;
  selected: boolean;
  pills: string[];
}

interface PopupProps {
  open: boolean;
  onClose: () => void;
  setInputData: any;
  setCardsInputData: any;
  nodeId: string;
  sectionName: string;
  setSectionName: any;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface FormState {
  appName: string;
  description: string;
}

interface variableObj {
  variableId: string;
  variableName: string;
  keyPath: string;
  value: string;
}

type DataItem = {
  variableId: string;
  variableName: string;
  values: { round: number; value: any[] }[];
};

interface MappedData {
  [key: string]: {
    source?: number;
    keyPath?: string;
    values: Array<any>;
    type?: string;
  };
}

interface Row {
  value: string;
  selected: boolean;
  pills: string[];
}

interface Card {
  header: string;
  rows: Row[];
}

const Popup: React.FC<PopupProps> = ({
  open,
  onClose,
  setInputData,
  setCardsInputData,
  nodeId,
  sectionName,
  setSectionName,
}) => {
  const [isEditingHeader, setIsEditingHeader] = useState<number | null>(null);
  const [rows, setRows] = useState<RowData[]>([
    { value: "", selected: false, pills: [] },
    { value: "", selected: false, pills: [] },
  ]);
  const [cards, setCards] = useState<any[]>([]);
  const [pillText, setPillText] = useState("");
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  const [openConfirmationDialog, setOpenConfirmationDialog] =
    useState<boolean>(false);
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cardHeaders, setCardHeaders] = useState<any>([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [variableObj, setVariableObj] = useState<variableObj[]>([]);
  const { type, nodeData, setNodeData, allNodeData } = useDnD();
  const {
    conceptId,
    cardsMappedData,
    setConceptDataAgentBy,
    conceptDataAgentBy,
  } = useDataFlow();
  const [value, setValue] = React.useState(0);
  const [isDataSourceCardVisible, setIsDataSourceCardVisible] = useState(false);
  const [isNextBtnClicked, setIsNextBtnClicked] = useState(false);
  const [isDataSourceVisible, setIsDataSourceVisible] =
    useState<boolean>(false);
  const [requestVariable, setRequestVariable] = useState([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState<FormState>({
    appName: "",
    description: "",
  });

  const initialDataSourceFormData = {
    inbound: {
      seq: 1,
      applicationName: "",
      applicationDescription: "",
      variables: {},
    },
    outbound: {
      seq: 2,
      applicationName: "",
      applicationDescription: "",
      variables: [],
      endpoint: null,
      authConfig: null,
      requestTemplate: {},
      response: {},
    },
    modelInput: {
      seq: 3,
      actualValue: [],
      variables: {},
    },
    modelOutput: {
      seq: 4,
      actualValue: [],
      variables: [],
    },
  };

  const [DataSourceFormData, setDataSourceFormData] = useState(
    initialDataSourceFormData
  );

  const [selectedPath, setSelectedPath] = useState<string>("");
  const [selectedValues, setSelectedValue] = useState<string>("");
  const [cardIndex, setCardIndex] = useState(0);
  const [tempHeader, setTempHeader] = useState(
    cards[isEditingHeader as number]?.header
  );
  const {
    modalOutputData,
    modalInputData,
    setConceptData,
    setCardsMappedData,
  } = useDataFlow();
  const {
    // updateInboundDataInNode,
    updateDataSourceInConcept,
    updateVariableDictInConcept,
    saveConcept,
    fetchConceptData,
  } = useOrchestration();

  const handleClickOutside = useCallback((event: React.MouseEvent) => {
    if (
      headerRef.current &&
      !headerRef.current.contains(event.target as Node)
    ) {
      setIsEditingHeader(null);
    }
  }, []);

  const handleHeaderClick = useCallback(
    (cardIndex: number, cardHeader: any) => {
      setIsEditingHeader(cardIndex);
      setTempHeader(cardHeader);
    },
    []
  );

  const handleCheckboxChange = useCallback(
    (cardIndex: number, rowIndex: number) => {
      const updatedCards = [...cards];
      const row = updatedCards[cardIndex].rows[rowIndex];
      updatedCards[cardIndex].rows = updatedCards[cardIndex].rows.map(
        (r: any, idx: any) => {
          if (idx !== rowIndex) {
            r.selected = false;
          } else {
            r.selected = true;
          }
          return r;
        }
      );

      setCards(updatedCards);
    },
    [cards]
  );

  const mapModalOutputData = (samples: any[]): any => {
    const mappedResult: any = {};

    samples?.forEach((sample, index) => {
      if (sample.name) {
        mappedResult[sample.name] = {
          source: nodeId,
          keyPath: sample.keyPath,
          values: ["", ""],
          type: "modelOutput",
        };
      }
    });

    return mappedResult;
  };

  useEffect(() => {
    const headersInbound = cardsMappedData["Inbound"]
      ? Object.keys(cardsMappedData["Inbound"])
      : [];

    const headersObjectInbound = headersInbound?.reduce(
      (acc: any, key: any) => {
        acc[key] = `$${key}$`;
        return acc;
      },
      {}
    );

    const headersOutbound = cardsMappedData["Outbound"]
      ? Object.keys(cardsMappedData["Outbound"])
      : [];

    const headersObjectOutbound = headersOutbound?.reduce(
      (acc: any, key: any) => {
        acc[key] = `$${key}$`;
        return acc;
      },
      {}
    );

    const requestVariableObj = requestVariable?.reduce((acc: any, key: any) => {
      acc[key] = `$${key}$`;
      return acc;
    }, {});

    const mappedModalOutputVar =
      modalOutputData && modalOutputData?.map((item: any) => `$${item.name}$`);

    const headers = cards.map((item) => item.header);

    setCardHeaders(headers);

    console.log('modalInputData', modalInputData, sectionName);

    let updatedDataSourceFormData: any = {};
    switch (sectionName) {
      case SectionName.Inbound:
        updatedDataSourceFormData = {
          ...DataSourceFormData,
          inbound: {
            ...DataSourceFormData.inbound,
            variables: headersObjectInbound,
          },
        };
        break;

      case SectionName.Outbound:
        updatedDataSourceFormData = {
          ...DataSourceFormData,
          outbound: {
            ...DataSourceFormData.outbound,
            requestTemplate: requestVariableObj,
            response: headersObjectOutbound ?? {},
          },
        };
        break;

      case SectionName.ModalOutput:
        updatedDataSourceFormData = {
          ...DataSourceFormData,
          modelOutput: {
            ...DataSourceFormData.modelOutput,
            variables: mappedModalOutputVar ? mappedModalOutputVar : [],
          },
        };
        break;

      case SectionName.Internal:
        updatedDataSourceFormData = {
          ...DataSourceFormData,
          modelInput: {
            ...DataSourceFormData.modelInput,
            variables: modalInputData,
          },
        };
        break;

      default:
        break;
    }

    setDataSourceFormData(updatedDataSourceFormData);
    setCardsInputData(cards);
  }, [cards, modalOutputData, selectedValues]);

  const handleSaveData = async () => {
    await saveConcept();
        onClose();
    fetchConceptData();
    setDataSourceFormData(initialDataSourceFormData);
    setCardsMappedData({});
  };

  const AddDataToConcept = useCallback(async () => {
    const modalOutPutVariableData =
      modalOutputData && mapModalOutputData(modalOutputData);

    const variableDict = {
      ...modalOutPutVariableData,
      ...cardsMappedData["Outbound"],
      ...cardsMappedData["Inbound"],
    };

    updateDataSourceInConcept(nodeId, DataSourceFormData);
    updateVariableDictInConcept(nodeId, variableDict);

    if (cards.length > 0) {
      setInputData(cards);
      setCardsInputData(cards);
    }
    // onClose();
    setIsDataSourceVisible(false);
    setIsDataSourceCardVisible(false);
    setIsNextBtnClicked(false);
    setCards([]);
  }, [
    cards,
    setInputData,
    onClose,
    modalInputData,
    modalOutputData,
    selectedPath,
  ]);

  const handleAddCard = useCallback(() => {
    if (cards.length < 5) {
      setCards((prevCards) => [
        ...prevCards,
        {
          header: "NewCard",
          rows: [
            { value: "", selected: false, pills: [] },
            { value: "", selected: false, pills: [] },
          ],
        },
      ]);
    } else {
      setErrorMessage("You can only add up to 5 cards.");
    }
  }, [cards]);

  console.log("cards++++++", cards);

  const handleDeleteCard = useCallback(
    (cardIndex: number) => {
      const updatedCards = [...cards];
      updatedCards.splice(cardIndex, 1);
      setCards(updatedCards);
    },
    [cards]
  );

  const handleClearRows = useCallback(
    (cardIndex: number) => {
      setCardToDelete(cardIndex);
      setOpenConfirmationDialog(true);
    },
    [cards]
  );

  const handleConfirmClearData = useCallback(() => {
    if (cardToDelete !== null) {
      const updatedCards = [...cards];
      updatedCards[cardToDelete].rows = updatedCards[cardToDelete].rows.map(
        (row: any) => ({
          ...row,
          value: "",
          selected: false,
          pills: [],
        })
      );
      setCards(updatedCards);
      setOpenConfirmationDialog(false);
    }
  }, [cards, cardToDelete]);

  const handleCancelClearData = useCallback(() => {
    setOpenConfirmationDialog(false);
  }, []);

  const handlePillChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPillText(event.target.value);
    },
    []
  );

  const handlePillKeyDown = useCallback(
    (event: React.KeyboardEvent, cardIndex: any, rowIndex: any) => {
      if (event.key === "Enter" && pillText.trim() !== "") {
        const row = cards[cardIndex].rows[rowIndex];
        if (row.pills.length < 5) {
          const updatedCards = [...cards];
          updatedCards[cardIndex].rows[rowIndex].pills.push(pillText);
          updatedCards[cardIndex].rows[rowIndex].value = "";
          setCards(updatedCards);
          setPillText("");
        } else {
          setErrorMessage("You can only add up to 5 pills to a row.");
        }
      }
    },
    [cards, pillText]
  );

  const deletePill = useCallback(
    (cardIndex: number, pillIndex: number, rowIndex: number) => {
      const updatedCards = [...cards];
      updatedCards[cardIndex].rows[rowIndex].pills.splice(pillIndex, 1);
      setCards(updatedCards);
    },
    [cards]
  );

  const handleCardRowClick = (
    cardIndex: number,
    rowIndex: number,
    e: React.MouseEvent
  ) => {
    handleCheckboxChange(cardIndex, rowIndex);
    setActiveCardIndex(cardIndex);
    setActiveRowIndex(rowIndex);
  };

  const handleSavePill = () => {
    if (
      activeCardIndex !== null &&
      activeRowIndex !== null &&
      pillText.trim() !== ""
    ) {
      const row = cards[activeCardIndex].rows[activeRowIndex];
      if (row.pills.length < 5) {
        const updatedCards = [...cards];
        updatedCards[activeCardIndex].rows[activeRowIndex]?.pills?.push(
          pillText
        );
        updatedCards[activeCardIndex].rows[activeRowIndex].value = "";
        setCards(updatedCards);
        setPillText("");
      } else {
        setErrorMessage("You can only add up to 5 pills to a row.");
      }
    }
  };

  const handleChipClick = (header: any) => {
    const selectedCardData = cards.find((card: any) => card.header === header);
    const selectedCardData1 = {
      ...selectedCardData,
      header: selectedCardData.header + "_$",
    };
    setCards([...cards, selectedCardData1]);
    setSelectedCard(selectedCardData);
  };

  const popupPosition = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 1300,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  };

  const conditionalRendering = (sectionName: string) => {
    if (sectionName === "Inbound" || sectionName === "Outbound") {
      return (
        <>
          <DataSourceForm
            onNext={() => {
              setIsNextBtnClicked(true);
              setIsDataSourceVisible(false);
            }}
            sectionName={sectionName}
            DataSourceFormData={DataSourceFormData}
            setDataSourceFormData={setDataSourceFormData}
            requestVariable={requestVariable}
            setRequestVariable={setRequestVariable}
          />
          <div>
            {cardHeaders?.map((item: any, index: any) => (
              <Chip
                key={index}
                label={item}
                onClick={() => handleChipClick(item)}
                variant="outlined"
                sx={{
                  borderColor: "#2D6414",
                  borderWidth: "2px",
                  color: "white",
                  backgroundColor: "transparent",
                  "&:hover": {
                    borderColor: "#2D6414",
                    backgroundColor: "rgba(45, 100, 20, 0.1)",
                  },
                  margin: "5px",
                }}
              />
            ))}
          </div>
          <DialogTitle
            style={{
              color: "white",
              position: "fixed",
              left: "190px",
              justifyContent: "center",
              marginTop: "30px",
            }}
          ></DialogTitle>
          <Box>
            <IconButton
              onClick={() => {
                onClose();
                setIsDataSourceVisible(false);
                setIsDataSourceCardVisible(false);
                setIsNextBtnClicked(false);
              }}
              style={{
                position: "fixed",
                top: 28,
                right: 90,
                color: "white",
                padding: 0,
                fontSize: "24px",
              }}
            >
              <ClearIcon />
            </IconButton>
            <Button
              onClick={handleAddCard}
              style={{
                position: "fixed",
                top: cards.length === 0 ? "58%" : "20px",
                right: cards.length === 0 ? "42%" : "235px",
                transform:
                  cards.length === 0 ? "translate(-50%, -50%)" : "none",
                color: "white",
                padding: "8px 16px",
                zIndex: 1301,
              }}
            >
              + Add Card
            </Button>

            <DialogActions
              sx={{
                position: "fixed",
                top: 15,
                right: 130,
                color: "white",
                padding: "8px 16px",
              }}
            >
              <Button
                onClick={AddDataToConcept}
                color="primary"
                sx={{ color: "white" }}
              >
                Add Data
              </Button>
            </DialogActions>
            <Grid
              container
              spacing={4}
              flexDirection="row"
              flexWrap="nowrap"
              overflow="auto"
              justifyContent="center"
              marginTop={"70px"}
            >
              {cards?.map((card, cardIndex) => (
                <Grid item key={cardIndex}>
                  <Card
                    style={{
                      width: "287px",
                      minHeight: "245px",
                      backgroundColor: "#333",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                      overflowY: "auto",
                    }}
                  >
                    <div
                      onClick={() => handleHeaderClick(cardIndex, card.header)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#2D6414",
                        padding: 4,
                        color: "white",
                        display: "flex",
                        justifyContent: "space-between",
                        height: "65px",
                      }}
                    >
                      {isEditingHeader === cardIndex ? (
                        <TextField
                          fullWidth
                          value={tempHeader}
                          onClick={() => setCardIndex(cardIndex)}
                          onChange={(e) => setTempHeader(e.target.value)}
                          onKeyDown={(e: any) => handleKeyDown(e, cardIndex)}
                          variant="outlined"
                          autoFocus
                          onBlur={() => setIsEditingHeader(null)}
                          InputProps={{
                            style: {
                              color: "white",
                              backgroundColor: "black",
                              border: "none",
                              wordWrap: "break-word",
                            },
                          }}
                        />
                      ) : (
                        <>
                          <span style={{ padding: "21px 13px" }}>
                            {card.header}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <IconButton
                              onClick={() => handleClearRows(cardIndex)}
                              style={{
                                color: "white",
                                marginLeft: "8px",
                              }}
                            >
                              <ClearIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteCard(cardIndex)}
                              style={{
                                color: "white",
                                marginLeft: "8px",
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </>
                      )}
                    </div>

                    {card.rows.map((row: any, rowIndex: any) => (
                      <div
                        key={rowIndex}
                        style={{
                          marginBottom: 0,
                          display: "flex",
                          width: "100%",
                          borderBottom: "1px solid white",
                          padding: "0px 16px",
                          overflowX: "auto",
                          height: "68px",
                          maxHeight: "300px",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={row.selected}
                              onChange={() => {
                                const updatedCards = [...cards];
                                updatedCards[cardIndex].rows[
                                  rowIndex
                                ].selected = !row.selected;
                                setCards(updatedCards);
                              }}
                              style={{ padding: 0 }}
                            />
                          }
                          label=""
                          style={{ marginRight: 8 }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            marginTop: "8px",
                            padding: "8px",
                          }}
                        >
                          {row.pills.map((pill: any, pillIndex: any) => (
                            <Box
                              key={pillIndex}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#444",
                                borderRadius: "16px",
                                marginRight: "8px",
                                marginBottom: "8px",
                                padding: "4px 8px",
                                color: "white",
                              }}
                            >
                              <span>{pill}</span>
                              <IconButton
                                onClick={() =>
                                  deletePill(cardIndex, pillIndex, rowIndex)
                                }
                                sx={{
                                  color: "white",
                                  marginLeft: "8px",
                                  padding: "2px",
                                }}
                              >
                                <ClearIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                        <TextField
                          value={row.value}
                          onChange={(e: any) => {
                            const updatedCards = [...cards];
                            updatedCards[cardIndex].rows[rowIndex].value =
                              e.target.value;
                            setCards(updatedCards);
                            handlePillChange(e);
                            handleCardRowClick(cardIndex, rowIndex, e);
                          }}
                          onKeyDown={(e) =>
                            handlePillKeyDown(e, cardIndex, rowIndex)
                          }
                          variant="outlined"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                border: "none",
                              },
                            },
                            input: {
                              color: "white",
                              backgroundColor: "transparent",
                            },
                          }}
                          style={{
                            backgroundColor: "transparent",
                            marginBottom: 0,
                            width: "100%",
                            padding: 10,
                            marginLeft: "-24px",
                            minWidth: "100px",
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        if (card.rows.length < 5) {
                          const updatedCards = [...cards];
                          updatedCards[cardIndex].rows.push({
                            value: "",
                            selected: false,
                            pills: [],
                          });
                          setCards(updatedCards);
                        } else {
                          setErrorMessage(
                            "You can only add up to 5 rows to a card."
                          );
                        }
                      }}
                      style={{
                        marginTop: 8,
                        color: "white",
                        display: "flex",
                        justifyContent: "left",
                      }}
                    >
                      + Add Row
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {activeCardIndex !== null &&
            activeRowIndex !== null &&
            cards?.length ? (
              <Box
                sx={{
                  position: "relative",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80%",
                  backgroundColor: "transparent",
                  padding: "10px",
                  borderRadius: "8px",
                  marginTop: "60px",
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  value={pillText}
                  onChange={handlePillChange}
                  placeholder="Add data"
                  variant="outlined"
                  sx={{
                    backgroundColor: "transparent",
                    color: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                    },
                    "& .MuiInputBase-root": {
                      paddingRight: "40px",
                    },
                  }}
                  InputProps={{
                    style: {
                      color: "white",
                      backgroundColor: "transparent",
                      border: "1px solid gray",
                      wordWrap: "break-word",
                    },
                  }}
                />
                <IconButton
                  onClick={handleSavePill}
                  sx={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "white",
                    backgroundColor: "transparent",
                    padding: "6px",
                  }}
                >
                  <span style={{ fontSize: "16px", padding: "5px" }}>Save</span>
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            ) : null}
            <Dialog
              open={openConfirmationDialog}
              onClose={() => setOpenConfirmationDialog(false)}
              PaperProps={{
                elevation: 3,
                style: {
                  background: "#2a2a2a",
                  boxShadow: "none",
                  maxWidth: "100%",
                  border: "1px solid white",
                },
              }}
            >
              <DialogContent
                style={{
                  textAlign: "center",
                  color: "white",
                  borderBottom: "1px solid white",
                }}
              >
                <h3>Are you sure you want to clear this card's data?</h3>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelClearData} color="primary">
                  No
                </Button>
                <Button onClick={handleConfirmClearData} color="primary">
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      );
    }
    if (sectionName === "Internal") {
      return (
        <ModalInput
          json={nodeData.payloadTemplate}
          AddDataToConcept={AddDataToConcept}
          selectedValues={selectedValues}
          setSelectedValue={setSelectedValue}
        ></ModalInput>
      );
    }
    if (sectionName === "ModalOutput") {
      return (
        <>
          <div>
            {variableObj?.map((item: any, index: any) => (
              <Chip
                key={index}
                label={item.variableName}
                onClick={() => handleChipClick(item)}
                variant="outlined"
                sx={{
                  borderColor: "#2D6414",
                  borderWidth: "2px",
                  color: "white",
                  backgroundColor: "transparent",
                  "&:hover": {
                    borderColor: "#2D6414",
                    backgroundColor: "rgba(45, 100, 20, 0.1)",
                  },
                  margin: "5px",
                }}
              />
            ))}
          </div>
          <ModalOutput
            nodeData={nodeData}
            AddDataToConcept={AddDataToConcept}
            selectedPath={selectedPath}
            setSelectedPath={setSelectedPath}
          />
        </>
      );
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    cardIndex: any
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const updatedCards = [...cards];
      console.log("updatedCards:", updatedCards, tempHeader, cardIndex);
      console.log("updatedCards cardINdex", cardIndex);
      updatedCards[cardIndex].header = tempHeader;
      setCards(updatedCards);
      setIsEditingHeader(null);
      setTempHeader("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(
        event: React.MouseEvent | React.KeyboardEvent,
        reason: string
      ) => {
        if (reason === "backdropClick") {
          return;
        }
        onClose();
      }}
      PaperProps={{
        elevation: 3,
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
          maxWidth: "100%",
        },
      }}
      disableEscapeKeyDown={true}
      sx={popupPosition}
    >
      <IconButton
        onClick={() => {
          onClose();
          setIsDataSourceVisible(false);
          setIsDataSourceCardVisible(false);
          setIsNextBtnClicked(false);
          setCards([]);
        }}
        style={{
          position: "fixed",
          top: 28,
          right: 90,
          color: "white",
          padding: 0,
          fontSize: "24px",
        }}
      >
        <ClearIcon />
      </IconButton>
      {!isDataSourceVisible && (
        <Button
          onClick={handleSaveData}
          color="primary"
          style={{
            position: "fixed",
            top: 20,
            right: 130,
            color: "white",
            padding: 0,
            fontSize: "24px",
          }}
        >
          Save
        </Button>
      )}
      {isDataSourceVisible ? (
        <DialogContent
          onClick={handleClickOutside}
          style={{
            color: "white",
            paddingTop: "10px",
            width: "90vw",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {conditionalRendering(sectionName)}
        </DialogContent>
      ) : (
        <DialogContent
          onClick={handleClickOutside}
          style={{
            color: "white",
            paddingTop: "10px",
            width: "90vw",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ConceptMockData
            onNext={() => {
              setIsNextBtnClicked(true);
            }}
            setIsDataSourceVisible={setIsDataSourceVisible}
            setSectionName={setSectionName}
          />
        </DialogContent>
      )}
      {errorMessage && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={() => setErrorMessage(null)}
          message={errorMessage}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          sx={{
            "& .MuiSnackbarContent-root": {
              backgroundColor: "red",
              color: "white",
              padding: "16px",
              fontSize: "16px",
              borderRadius: "4px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
              width: "80%",
              marginTop: "20px",
            },
          }}
        />
      )}
    </Dialog>
  );
};

export default Popup;
