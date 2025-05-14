import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Lottie from "lottie-react";
import breakingAnimation from "../ui/styles/animations/breaking-animation.json"; // Update the path to your animation file
import warningAnimation from "../ui/styles/animations/limit-reached.json"; 
import "./styles/Dialog.css";

export default function AlertDialog({
  openDialog,
  title,
  content,
}: {
  openDialog: boolean;
  title: string;
  content: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const lottieRef = React.useRef<any>(null); // Ref for Lottie animation

  const handleClose = () => {
    if (lottieRef.current) {
      lottieRef.current.play(); // Start the animation immediately
    }
    setOpen(false);
  };

  React.useEffect(() => {
    setOpen(openDialog);
  }, [openDialog]);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent   style={{maxHeight:'65px', overflow:'hidden'}}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lottie
              animationData={warningAnimation}
              loop={true} 
              autoplay
              style={{ width: '105px', height: '80px' }}
            />
         <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <div className="lottie-container">
        <Lottie
          lottieRef={lottieRef} 
          animationData={breakingAnimation}
          loop={false}
          autoplay={false}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </React.Fragment>
  );
}
