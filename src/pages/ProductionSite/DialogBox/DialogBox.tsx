// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Button,
// } from "@mui/material";
// import DynamicDescriptionGenerator from "../UseCasesSection/DynamicDescriptionGenerator";

// interface HeaderProps {
//   title: string;
//   content: any;
//   open:any;
//   setOpen :any
// }

// const PopupModal: React.FC<HeaderProps> = (props: HeaderProps) => {
//   const { title, content , open ,setOpen} = props;

//   const handleClose = () => {
//     setOpen(false); // Close modal
//   };

//   return (
//     <div>
//       {/* <Button variant="contained" color="primary" onClick={handleClickOpen}>
//         Open Popup
//       </Button> */}

//       {/* Dialog Modal */}
//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>{title}</DialogTitle>
//         <DialogContent >
//           {/*
//           dangerouslySetInnerHTML={{ __html: content}}
//           <p>This is a simple popup modal created with MUI.</p>
//           <p>You can place any content here, including forms, text, or images.</p> */}
//           <DynamicDescriptionGenerator/>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default PopupModal;

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  content: any;
  open: any;
  setOpen: any;
}

const PopupModal: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { title, content, open, setOpen } = props;

  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(false);
    navigate("/calltoactions");
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 4,
          backgroundColor: "#000",
          padding: "16px",
        },
        width: {xs:"100vw", sm:"auto"},
        height: {xs:"100vh", sm:"auto"},
      }}
    >
      {/* Header Section */}
      <DialogTitle
        sx={{
          background:
            "linear-gradient(90deg, #800080 0%, #7C21CE 47.83%, #C079FF 100%)",
          color: "white",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          margin: "8px 0",
        }}
      >
        {content?.header}
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content Section */}
      <DialogContent
        sx={{ padding: "16px", color: "white", backgroundColor: "#000" }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Flow preview:
        </Typography>

        {/* Flow Grid Section */}
        <Grid
          container
          spacing={2}
          sx={{
            borderBottom: "1px solid gray",
            borderTop: "1px solid gray",
            pb: 2,
          }}
        >
          {content &&
            Object.keys(content).length > 0 &&
            content?.flow.length > 0 &&
            content?.flow.map((item: any, index: any) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2.4}
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRight: {
                    lg:
                      index !== content?.flow.length - 1
                        ? "1px solid gray"
                        : "none",
                    xs: "none",
                  },
                  borderBottom: {
                    xs:
                      index !== content?.flow.length - 1
                        ? "1px solid gray"
                        : "none",
                    lg: "none",
                  },
                  padding: "4px",
                  margin: "2px auto",
                  minHeight: {xs:"35%", sm:"240px"},
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {item?.node_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ minHeight: "60px", color: "#fff", mt: 1 }}
                  >
                    {item?.node_descrption}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  sx={{
                    mt: "auto",
                    color: "gray",
                    borderColor: "gray",
                    textTransform: "none",
                    borderRadius: "12px",
                    padding: "4px 12px",
                    border: "dotted",
                  }}
                >
                  {item?.node_value}
                </Button>
              </Grid>
            ))}
        </Grid>

        {/* Business Info Section */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {content?.sub_header}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, color: "gray", maxWidth: "100%" }}
          >
            {content?.article_description}
          </Typography>
        </Box>
      </DialogContent>

      {/* Footer Buttons */}
      <DialogActions sx={{ backgroundColor: "#000", padding: "12px 16px" }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: "#800080",
            color: "white",
            textTransform: "none",
            borderRadius: "20px",
            padding: "8px 16px",
          }}
        >
          GOT IT!
        </Button>
        <Button
          onClick={handleClick}
          sx={{
            color: "white",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          Express interest →
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupModal;
