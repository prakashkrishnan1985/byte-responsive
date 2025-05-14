import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import { minify } from "terser";
import { PayloadUpdateWidget, updateWidget } from "../../services/widgetsService";
import { toast } from "react-toastify";
import { useWidget } from "../../providers/WidgetsProvider";
import { baseURL } from "../../services/axiosConfig";

const SpotlightSearchWidget: React.FC = () => {
  const [title, setTitle] = useState("Spotlight Search");
  const [placeholder, setPlaceholder] = useState("Search...");
  const [color, setColor] = useState("#227ebb");
  const [results, setResults] = useState<string[]>([
    "Macbook Pro",
    "iPhone 15",
    "iPad Air",
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [miniScript, setMiniScript] = useState<string>("");
  const [opacity, setOpacity] = useState(1);
  const [domainName, setDomainName] = useState("");
  const [linkedTo, setLinkedTo] = useState("");

  const { widgetId } = useWidget();

  const generateScript = async () => {
    const defaultResults = results || [
      "Example Result 1",
      "Example Result 2",
      "Example Result 3",
    ];

    const script = `
      <div id="spotlight-search" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); 
        width: 80%; max-width: 600px; 
        border-radius: 25px 25px 10px 10px; padding: 12px 16px; 
        display: flex; flex-direction: column;">
        
        <div style="position: relative; width: 100%;">
          <input type="text" id="search-input" placeholder="${placeholder}" 
                 style="font-size: 16px; padding: 16px; border: 1px solid #ccc; border-radius: 25px; 
                        width: 100%; box-sizing: border-box; outline: none; 
                         background-color: ${
                           color || "#F4F4F5"
                         }; color: #333; font-weight: 400; 
                         box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1); z-index: 9999;" />
          
          <div id="results-container" style="position: absolute; top: 100%; left: 0; width: 100%; 
                                              max-height: 300px; overflow-y: auto; background-color: ${color}; 
                                              border-radius: 10px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15); 
                                              display: none; z-index: 9999;">
            ${defaultResults
              .map(
                (result) =>
                  `<div class="result-item" style="padding: 10px; cursor: pointer; border-bottom: 1px solid rgba(255, 255, 255, 0.2);">${result}</div>`
              )
              .join("")}
          </div>
  
          <!-- This is the output section, looks identical to the results section -->
          <div id="output-container" style="display: none; position: absolute; top: 100%; left: 0; width: 100%; 
                                              max-height: 300px; overflow-y: auto; background-color: ${color}; 
                                              border-radius: 10px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15); 
                                              z-index: 9999;">
            <!-- The output will be dynamically filled with selected data -->
          </div>
        </div>
      </div>
  
      <script>
        // Function to perform API call when user types
        const searchAPI = async (query) => {
            const payload ={
              search_term: query
            }
            try {
              const response = await fetch('${baseURL}/v1/widget/search/${widgetId}', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload), 
              });

              if (!response.ok) {
                throw new Error('Failed to update search');
              }
              const data = await response.json();
              updateResults(data.result);
            } catch (error) {
              console.error('Error fetching search results:', error);
            }
          };

        const updateResults = (data) => {
          const resultsContainer = document.getElementById('results-container');
          resultsContainer.innerHTML = '';
  
          if (data.length > 0) {
            // Show API results
            data.forEach(item => {
              const resultItem = document.createElement('div');
              resultItem.classList.add('result-item');
              resultItem.style.padding = '10px';
              resultItem.style.cursor = 'pointer';
              resultItem.style.borderBottom = '1px solid #f0f0f0';
              resultItem.innerText = item;
              resultItem.addEventListener('click', () => {
                handleSelection(item);  // Handle selection
              });
              resultsContainer.appendChild(resultItem);
            });
          } else {
            // If no API results, show default response
            const defaultResultItem = document.createElement('div');
            defaultResultItem.classList.add('result-item');
            defaultResultItem.style.padding = '10px';
            defaultResultItem.style.cursor = 'pointer';
            defaultResultItem.style.borderBottom = '1px solid #f0f0f0';
            defaultResultItem.innerText = "Searching......";
            resultsContainer.appendChild(defaultResultItem);
          }
  
          resultsContainer.style.display = data.length > 0;
        };
  
        const handleSelection = (selectedItem) => {
          const resultsContainer = document.getElementById('results-container');
          document.getElementById('search-input').value = selectedItem;
          const outputContainer = document.getElementById('output-container');
  
          // Clear previous output and show selected data
          outputContainer.innerHTML = '';
          
          const selectedOutputItem = document.createElement('div');
          selectedOutputItem.classList.add('result-item');
          selectedOutputItem.style.padding = '10px';
          selectedOutputItem.style.cursor = 'pointer';
          selectedOutputItem.style.borderBottom = '1px solid #f0f0f0';
          selectedOutputItem.innerText = "Here we will have output reponse of query";
  
          outputContainer.appendChild(selectedOutputItem);
  
          // Hide results and show the output
          resultsContainer.style.display = 'none';
          outputContainer.style.display = 'block';
          
          // Optionally, you can log the selected item
          console.log('Selected:', selectedItem);  // Do something with the selected item
        };
  
        document.getElementById('search-input')?.addEventListener('input', function(e) {
          const query = e.target.value.toLowerCase();
          const resultsContainer = document.getElementById('results-container');
          const searchContainer = document.getElementById('spotlight-search');
          
          if (query.length > 0) {
            searchContainer.style.borderRadius = "25px 25px 0px 0px";
            resultsContainer.style.display = 'block';
          } else {
            searchContainer.style.borderRadius = "25px 25px 10px 10px";
            resultsContainer.style.display = 'none';
          }
  
          if (query.length > 2) {
            searchAPI(query);
          } else {
            const filteredResults = ${JSON.stringify(
              defaultResults
            )}.filter(result =>
              result.toLowerCase().includes(query)
            );
            updateResults(filteredResults);
          }
        });
  
        document.addEventListener('click', (e) => {
          const resultsContainer = document.getElementById('results-container');
          const outputContainer = document.getElementById('output-container');
          if (!document.getElementById('spotlight-search').contains(e.target)) {
            resultsContainer.style.display = 'none';
            outputContainer.style.display = 'none';
            const searchContainer = document.getElementById('spotlight-search');
            searchContainer.style.borderRadius = "25px 25px 10px 10px";
          }
        });
      </script>
    `;

    setGeneratedScript(script);

    const miniScript = `
      (function() {        
          // url goes here
          var scriptUrl = '${baseURL}/v1/widget/${widgetId}'; 

          var scriptElement = document.createElement('script');

          fetch(scriptUrl)
              .then(function(response) {
                  if (!response.ok) {
                      throw new Error('Failed to fetch the script');
                  }
                  return response.text();
              })
              .then(function(scriptContent) {
                  //set the content to the script element
                  scriptElement.text = scriptContent;
                  
                  //Append the script to the head or body of the page
                  document.head.appendChild(scriptElement); // You can also append to document.body
                  console.log('Seach Script successfully loaded and appended to the page.');
              })
              .catch(function(error) {
                  console.error('Error loading the script:', error);
              });
      })();`;
    try {
      const result = await minify(script);
      if ((result as any).error) {
        console.error("Minification error:", (result as any).error);
      } 
      else {
        //setGeneratedScript((result as any).code);
      }

    } catch (error) {
      console.error("Error during minification:", error);
    }
    const payload: PayloadUpdateWidget = {
      header_title: title,
      widget_type: "search_box",
      ai_type: linkedTo,
      opacity: 1,
      color_code: color,
      website_domain: domainName,
      script: script,
      widget_id: widgetId,
    };
    const loadingToast = toast.loading("Saving your data...");
    try {
      const response = await updateWidget(payload);
      toast.dismiss(loadingToast);
      if (response) {
        toast.success("Widget updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update widget");
      console.error("Error during widget update:", error);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        height: "auto",
        padding: 4,
        overflowY: "visible",
      }}
    >
      <Grid
        container
        direction="column"
        sx={{
          width: "47%",
          background: "white",
          padding: 3,
          boxSizing: "border-box",
          borderRadius: "8px",
          boxShadow: 2,
        }}
      >
        <SpotlightSearchForm
          onTitleChange={setTitle}
          onPlaceholderChange={setPlaceholder}
          onColorChange={setColor}
          onResultsChange={setResults}
          onOpacityChnage={setOpacity}
          generateScript={generateScript}
          domainName={domainName}
          setDomainName = {setDomainName}
          linkedTo={linkedTo}
          setLinkedTo={setLinkedTo}
        />
      </Grid>

      <Grid
        container
        direction="column"
        sx={{
          width: "47%",
          backgroundColor: "#ffffff",
          padding: 3,
          boxSizing: "border-box",
          borderRadius: "8px",
          boxShadow: 2,
          alignItems: "flex-start",
          marginRight: "4%",
        }}
      >
        <h2>Live Preview</h2>
        <SpotlightSearch
          title={title}
          placeholder={placeholder}
          color={color}
          results={results}
          opacity={opacity}
        />
      </Grid>
      <GeneratedScriptDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        generatedScript={generatedScript}
        miniScript={miniScript}
      />
    </Box>
  );
};

export default SpotlightSearchWidget;

type SpotlightSearchFormProps = {
  onTitleChange: (title: string) => void;
  onPlaceholderChange: (placeholder: string) => void;
  onColorChange: (color: string) => void;
  onResultsChange: (results: string[]) => void;
  generateScript: () => void;
  onOpacityChnage: (opacity: any) => void;
  domainName: string;
  setDomainName:any;
  linkedTo: string;
  setLinkedTo: any;
};

const SpotlightSearchForm: React.FC<SpotlightSearchFormProps> = ({
  onTitleChange,
  onPlaceholderChange,
  onColorChange,
  onResultsChange,
  generateScript,
  onOpacityChnage,
  domainName,
  setDomainName,
  linkedTo,
  setLinkedTo,
}) => {
  const [title, setTitle] = useState("Spotlight Search");
  const [placeholder, setPlaceholder] = useState("Search...");
  const [color, setColor] = useState("#227ebb");
  const [results, setResults] = useState<string[]>([
    "Macbook Pro",
    "iPhone 15",
    "iPad Air",
  ]);
  const [opacity, setOpacity] = useState(1);
  const handleOpacityChange = (event: Event, newValue: any) => {
    onOpacityChnage(newValue);
    setOpacity(newValue);
  };

  const handleGenerateScript = () => {
    generateScript();
  };

  const handleDomainNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDomainName(event.target.value);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <h2>Spotlight Search Configuration</h2>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <InputLabel>Title</InputLabel>
          <TextField
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              onTitleChange(e.target.value);
            }}
            fullWidth
          />
        </Grid>

        <Grid item>
          <InputLabel>Placeholder Text</InputLabel>
          <TextField
            value={placeholder}
            onChange={(e) => {
              setPlaceholder(e.target.value);
              onPlaceholderChange(e.target.value);
            }}
            fullWidth
          />
        </Grid>

        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <InputLabel htmlFor="domain-name">Domain Name</InputLabel>
            </Grid>
            <Grid item xs={12}>
              <Input
                id="domain-name"
                value={domainName}
                onChange={handleDomainNameChange}
                placeholder="bytesized.com.au"
                fullWidth
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <FormControl fullWidth>
            <InputLabel>Linked To</InputLabel>
            <Select
              value={linkedTo}
              onChange={(e) => setLinkedTo(e.target.value)}
              fullWidth
              sx={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
              }}
            >
              <MenuItem value="rag">rag</MenuItem>
              <MenuItem value="llm">llm</MenuItem>
            </Select>
          </FormControl>
        </Grid>


        <Grid item>
          <InputLabel>Search Color</InputLabel>
          <TextField
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              onColorChange(e.target.value);
            }}
            fullWidth
          />
        </Grid>

        <Grid item mx={0.2}>
          <InputLabel>Opacity Slider</InputLabel>
          <Slider
            value={opacity}
            onChange={handleOpacityChange}
            aria-labelledby="opacity-slider"
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
          />
        </Grid>

        <Grid item>
          <InputLabel>Search Results</InputLabel>
          <TextField
            value={results.join(", ")}
            onChange={(e) => {
              const newResults = e.target.value.split(", ");
              setResults(newResults);
              onResultsChange(newResults);
            }}
            fullWidth
            helperText="Comma-separated list"
          />
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="success"
            onClick={handleGenerateScript}
          >
            Generate Embed Script
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

type SpotlightSearchProps = {
  title: string;
  placeholder: string;
  color: string;
  results: string[];
  opacity: number;
};

const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  title,
  placeholder,
  color,
  results,
  opacity,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "93%",
      }}
    >
      <Autocomplete
        freeSolo
        disableClearable
        options={results}
        renderInput={(params: any) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder={placeholder}
            sx={{
              backgroundColor: color,
              borderRadius: "25px",
              color: color,
              opacity: opacity,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              "& .MuiOutlinedInput-root": {
                border: "none",
                "& fieldset": {
                  border: "none",
                },
              },
              "& .MuiInputBase-root": {
                border: "none",
              },
            }}
          />
        )}
        ListboxProps={{
          sx: {
            backgroundColor: color,
            color: "white",
            borderRadius: "10px",
            border: "none",
          },
        }}
        renderOption={(props, option) => (
          <li
            {...props}
            style={{
              color: "black",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {option}
          </li>
        )}
      />
    </Box>
  );
};

const GeneratedScriptDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  generatedScript: string;
  miniScript: string;
}> = ({ open, onClose, generatedScript, miniScript }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Generated Script</DialogTitle>
      <DialogContent>
        <TextField
          value={generatedScript}
          fullWidth
          multiline
          rows={8}
          InputProps={{
            readOnly: true,
          }}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px",
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(generatedScript);
          }}
          color="primary"
        >
          Copy Code
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
