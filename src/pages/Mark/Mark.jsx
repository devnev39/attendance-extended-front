import { Alert, Box, Grid, IconButton, Snackbar, Toolbar } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CameraIcon from '@mui/icons-material/Camera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect, useRef, useState } from "react";

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

const Mark = () => {
    const videoH = "50%";
    const videoW = "75%";

    const [camOn, setCamOn] = useState(false);
    const [videoSrcObj, setVideoSrcObj] = useState(null);
    
    const [photoBlob, setPhotoBlob] = useState(null);

    const vref = useRef();
    const canvasRef = useRef();

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setAlertOpen(false);
    };

    const setVideoStream = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setVideoSrcObj(stream);
        vref.current.srcObject = stream;
        setAlertMessage("Camera found !");
        setAlertSeverity("info");
        setAlertOpen(true); 
    }

    const clickPhoto = () => {
        if(!canvasRef.current) return;
        if(!vref.current) return;
        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(vref.current,0,0,canvasRef.current.width,canvasRef.current.height);
        let image = canvasRef.current.toDataURL("image/jpeg");
        const content_type = image.split(";")[0].split(":")[1];
        const bs64 = image.split(";")[1].split(",")[1];
        const blob = b64toBlob(bs64,content_type);
        setPhotoBlob(blob);
        setCamOn(false);
    }

    const uploadPhoto = () => {

    }

    useEffect(() => {
        if(!camOn){
            setVideoSrcObj(null);
            if(vref.current){
                vref.current.pause();
                if(vref.current.srcObject) vref.current.srcObject.getTracks()[0].stop();
            }
            return;
        }
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
           setVideoStream(); 
        }else{
            setAlertMessage("No media devices found !");
            setAlertSeverity("error");
            setAlertOpen(true);
        }
    },[camOn]);


    // useEffect(() => {
        
    // },[camOn]);

    return (
        <>
        <Toolbar />
        <Grid container gap={2}>
            <Grid item xs={6} sx={{borderRight: "solid"}}>
                <Box sx={{width: "100%",height: "auto", display: "flex", justifyContent: "center"}}>
                    <video ref={vref} style={{"border": "solid", "borderRadius": "5px"}} autoPlay muted playsInline width={videoW} height={videoH}/>
                    <canvas style={{"position": "absolute", "display": "none"}} width={videoW} height={videoH} ref={canvasRef} />
                </Box>
                <Box sx={{display: "flex", justifyContent: "center"}}>
                    <IconButton onClick={() => setCamOn(!camOn)} size="large">
                        {
                            camOn ? <VideocamIcon color="success" fontSize="large"/> : <VideocamOffIcon color="error" fontSize="large" />
                        }
                    </IconButton>
                    <IconButton onClick={clickPhoto} sx={{ml: "1rem"}}>
                        <CameraIcon fontSize="large" />
                    </IconButton>
                    <IconButton disabled={!photoBlob && true} onClick={uploadPhoto} sx={{ml: "1rem"}}>
                        <CloudUploadIcon fontSize="large" />
                    </IconButton>
                </Box>
                
            </Grid>
        </Grid>
        <Snackbar sx={{display: "flex", justifyContent: "center", width: "100%"}} open={alertOpen} autoHideDuration={3000} onClose={handleAlertClose}>
            <Alert onClose={handleAlertClose} severity={alertSeverity}>
                {alertMessage}
            </Alert>
        </Snackbar>
        </>
    )
}

export default Mark;
