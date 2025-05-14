import * as React from 'react';
import{Tabs,Tab,Typography,Box,Accordion,AccordionDetails,AccordionSummary,Paper,InputLabel}  from '@mui/material';
import{Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,MenuItem}  from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {Card,CardContent,TextField
} from '@mui/material';
import chatBotImage from "../../assets/chat_bot.png";
import searchImage from "../../assets/search_box.png";
import { colorSchemes } from '../../components/theme/themePrimitives';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (

    
    <div


      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}

    >
      {value === index && (
        <Box sx={{ p: 2 }}>

          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


  

export default function Documentation() {
  const [value, setValue] = React.useState(0);
  const [expanded, setExpanded] = React.useState<string | false>(false);



  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangePanel =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
    
  

  const[area,setArea]=React.useState('');
 

  const[isDisabled,setIsDisabled]=React.useState(false);

  const handleClickChange = () => {
    setIsDisabled((prev) => !prev);
    };

  const [output, setOutput]=React.useState('');


     const handleGenerate = () => {
      setOutput(area);
    }; 


  return (

    <Box
      sx={{ flexGrow: 2, bgcolor: 'background.paper', display: 'flex', justifyContent: 'left', height: 600,  }}
      
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', minWidth:200 }}
      >
         <Tab label="Bytesize Documentation" {...a11yProps(0)} style={{backgroundColor:'green',color:'white'}} />
        <Tab label="About Us" {...a11yProps(1)} 
  />
        <Tab label="Chatbot" {...a11yProps(2)} />
        <Tab label="Search_bar" {...a11yProps(3)}   />
        <Tab label="Try our model" {...a11yProps(4)}   />

      </Tabs>

      <TabPanel value={value} index={0}  >
        <h1>Documentation</h1>
      </TabPanel>
      <TabPanel value={value} index={1}  >
        <h1>Bytesize</h1>
        <p>
        Welcome! to the ByteSize.ByteSize is an AI-powered website designed to provide intelligent and efficient services through its
         cutting-edge RAG (Retrieve and Generate) system. <br /> The RAG system is a powerful framework that combines
          information retrieval with text generation, allowing ByteSize to deliver precise, contextually relevant
           answers and solutions.The core functionality of ByteSize revolves around its ability to retrieve data from
            extensive databases or external sources and then generate accurate, natural language responses based on the
             retrieved information. <br /> This enables users to interact with the website in a conversational manner while
              receiving detailed, data-driven insights. Whether you're seeking answers to specific queries
               or exploring general information, ByteSize seamlessly blends the capabilities of AI and data
                retrieval to ensure a smooth user experience.
        </p>
        <h2>
        Key Features:</h2>
        <ol>
          <li> <b>AI-Powered:</b> Utilizes advanced machine learning models for natural language processing and understanding.</li>
          <li><b>RAG System:</b> Combines data retrieval and text generation to provide accurate answers and recommendations.</li>
          <li><b>User-Centric:</b> Designed for ease of use, offering intuitive navigation and quick responses.</li>
        </ol>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <h1>About</h1>
        <p> <b> Chatbot</b> that gathers data from OpenAI using RAG (Retrieval-Augmented Generation) integrates
           the power of AI-driven language models with external data retrieval mechanisms.
            RAG combines the benefits of pre-trained models (like OpenAI's GPT) with real-time access
             to external databases, documents, or APIs to enhance the chatbot's responses. <br />
             The process works in two main stages. First, the chatbot retrieves relevant information from 
             a large corpus of data, which could include internal documents, web content, or
              specific datasets. This is achieved through a retrieval mechanism, such as search 
              or vector databases, that identifies the most pertinent data based on the user’s query. <br />
               Next, the chatbot feeds this retrieved information into the generative model (like GPT) to
                produce a more informed, contextually rich response.
            </p>
            <h2>Chatbot UI:</h2>
            <img src={chatBotImage} alt="Chat bot image" />

      </TabPanel>
      <TabPanel value={value} index={3}>
        <h1>About Search</h1>
        <p>A Search Bar using RAG (Retrieval-Augmented Generation) system combines traditional search
           techniques with powerful AI models like OpenAI’s GPT. 
           The goal is to enhance search results by retrieving relevant information from external sources
            and generating meaningful, contextually enriched responses.</p>
        <h2>Stages</h2>
        <p> <b> Retrieval Stage:</b> When a user enters a query in the search bar, the system first searches
           an external data source, such as a database, document collection, or web content, to find relevant
            information. This is done using search algorithms or vector-based retrieval methods, ensuring that 
            the most pertinent data is gathered.</p>

            <p> <b>Generation Stage:</b> After retrieving relevant documents or data, the system uses an
          AI model like OpenAI's GPT to process the retrieved information. The model combines this data with its
           pre-trained knowledge to generate a coherent, contextually accurate response. The result is a response
            that is both factually informed and conversational, making it more engaging and helpful than traditional
             search results.</p>  

             <h2>Search_box UI:</h2>
            <img src={searchImage} alt="search_box image" />  
      </TabPanel>
      <TabPanel value={value} index={4}>
        <h1>Angular Friendly model</h1>
        <p>The below provided link is tested on angular frame work:</p>
        <a href="https://curious-crumble-65d36b.netlify.app/" target="_blank">Angular bots</a>

        <h1>Vue Friendly model</h1>
        <p>The below provided link is tested on vue frame work:</p>
        <a href="https://mellow-bombolone-8130c3.netlify.app/" target="_blank">Vue bots</a>

        <Accordion expanded={expanded === 'panel1'} onChange={handleChangePanel('panel1')}
         style={{backgroundColor:'#E0FFFF'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography component="span" sx={{ width: '70%', flexShrink: 0 }}>
          <Button variant="contained" sx={{backgroundColor:'green'}}>Agent</Button>
          </Typography>
          <Typography component="span" sx={{ color: 'text.secondary', textAlign:'center' }}>
            Add a new discription
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography>
          <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          
        <TableRow>
        <TableCell><h3>Parameters</h3></TableCell>
            <TableCell align='right'> <button onClick={handleClickChange} >{isDisabled?'Enable':'Disable'}</button></TableCell>
           
          </TableRow>

          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
           
          </TableRow>
         
        </TableHead>
        <TableBody>
          
        <TableRow>
            <TableCell><span> <b>body</b> <span style={{color:'red'}}>*required</span> </span>
            <p>object</p>
            <p style={{color:'grey'}}> (body)</p>
            </TableCell>
            <TableCell>Add something in the text field  
              <p>Example Value | value</p>
              <TextField
              
              disabled={isDisabled}                
              value={area}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setArea(event.target.value);
        }}
      />
            </TableCell>
            
          </TableRow>
          <TableRow>
          { !isDisabled &&(
            <Button variant="contained" fullWidth onClick={handleGenerate}>
            Try it
            </Button>
          )}
          </TableRow>
          
</TableBody>

        <TableRow>
        <TableCell><h3>Responses</h3></TableCell>
        <TableCell></TableCell>

            
          </TableRow>

          <TableRow>
            <TableCell> <h2> Output</h2></TableCell>
            <TableCell>{output}</TableCell>
           
          </TableRow>
          
           
          {output.trim() &&(
            <TableRow>
            <TableCell>  200</TableCell>
            <TableCell>Code success</TableCell>
            </TableRow>
            
          )}

           {!output.trim() &&(
            <TableRow style={{color:'red'}}> 
            <TableCell>  404</TableCell>
            <TableCell>Error! Please write something</TableCell>
            </TableRow>
          )}
          
      </Table>
    </TableContainer>
          </Typography>
        </AccordionDetails>
      </Accordion>
      </TabPanel>
    </Box>
  );
}