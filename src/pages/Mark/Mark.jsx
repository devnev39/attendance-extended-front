import { Alert, Box, Button, Grid, IconButton, Snackbar, TextField, Toolbar } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CameraIcon from '@mui/icons-material/Camera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useEffect, useRef, useState } from "react";
import { Urls } from "../../config/url";
import { useGridApiRef } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import StyledDataGrid from "../../components/StyledDataGrid";

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

const getRowId = (row) => {
    return row.role_id;
}

const studentResponseColumns = [
    {
        field: "name",
        headerName: "Name",
        width: 200
    },
    {
        field: "role_id",
        headerName: "Role ID",
        width: 150
    },
    {
        field: "present",
        headerName: "Present",
        width: 100
    }
]

const Mark = () => {
    const videoH = "50%";
    const videoW = "75%";

    const [camOn, setCamOn] = useState(false);
    const [videoSrcObj, setVideoSrcObj] = useState(null);
    
    const [photoBlob, setPhotoBlob] = useState(null);

    const [photoUploading, setPhotoUploading] = useState(false);

    const vref = useRef();
    const canvasRef = useRef();
    const dateRef = useRef();

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);

    const [studentResponse, setStudentResponse] = useState([]);

    const apiRef = useGridApiRef();

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
        canvasRef.current.height = 480;
        canvasRef.current.width = 720;
        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(vref.current,0,0,canvasRef.current.width,canvasRef.current.height);
        let image = canvasRef.current.toDataURL("image/jpeg");
        const content_type = image.split(";")[0].split(":")[1];
        const bs64 = image.split(";")[1].split(",")[1];
        const blob = b64toBlob(bs64,content_type);
        console.log(blob);
        setPhotoBlob(blob);
        setCamOn(false);
    }

    const uploadPhoto = () => {
        if(!photoBlob){
            setAlertMessage("No photo found ! Take photo first !");
            setAlertSeverity("error");
            setAlertOpen(true);
            return;
        }
        setPhotoUploading(true);
        let formdata = new FormData();
        formdata.append("image", photoBlob);
        fetch(`${Urls.baseUrl}/mark/api/v1/check-present`,{
            method: "POST",
            body: formdata
        }).then(resp => resp.json()).then(resp => {
            if(resp.status) {
                setStudentResponse(resp.data);
                setPhotoUploading(false);
            }else{
                setAlertMessage(resp.message ? resp.message : resp.detail ? resp.detail : "Error from backend !");
                setAlertSeverity("error");
                setAlertOpen(true); 
                setPhotoUploading(false);
            }
        })
    }

    const commitStudentResponse = () => {       
        if(!studentResponse.length){
            setAlertMessage("No student attendance response found !");
            setAlertSeverity("error");
            setAlertOpen(true);
            return;
        }
        let date = document.getElementById("dateInput").value;
        console.log(date);
        fetch(`${Urls.baseUrl}/mark/api/v1/mark-attendance`,{
            method: "POST",
            body: JSON.stringify({attendance: studentResponse, date: date}),
            headers: {
               "Content-Type": "application/json" 
            }
        }).then(resp => resp.json()).then(resp => {
            if(resp.status){
                setAlertMessage("Attendance updated successfully !");
                setAlertSeverity("success");
                setAlertOpen(true);
            }else{
                setAlertMessage(resp.message ? resp.message : resp.detail ? resp.detail : "Error from backend !");
                setAlertSeverity("error");
                setAlertOpen(true); 
            }
        })
    }

    const getTestPhoto = () => {
        if(!photoBlob){
            setAlertMessage("No photo found ! Take photo first !");
            setAlertSeverity("error");
            setAlertOpen(true);
            return;
        }
        setPhotoUploading(true);
        let formdata = new FormData();
        formdata.append("image", photoBlob);
        fetch(`${Urls.baseUrl}/mark/api/v1/check-present-photo`,{
            method: "POST",
            body: formdata
        }).then(resp => resp.blob()).then(blob => {
            let file = window.URL.createObjectURL(blob);
            window.location.assign(file);
        }) 
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

    return (
        <>
        <Toolbar />
        <Grid container gap={2}>
            <Grid item xs={6} sx={{borderRight: "solid"}}>
                <Box sx={{width: "100%",height: "auto", display: "flex", justifyContent: "center"}}>
                    <video ref={vref} style={{"border": "solid", "borderRadius": "5px"}} autoPlay muted playsInline width={videoW} height={videoH}/>
                    <canvas style={{"position": "absolute", "display": "none"}} ref={canvasRef} />
                </Box>
                <Box sx={{display: "flex", justifyContent: "center", my: "1rem"}}>
                    <IconButton onClick={() => setCamOn(!camOn)} size="large" sx={{mx: "1rem"}}>
                        {
                            camOn ? <VideocamIcon color="success" fontSize="large"/> : <VideocamOffIcon color="error" fontSize="large" />
                        }
                    </IconButton>
                    <IconButton onClick={clickPhoto} sx={{mx: "1rem"}}>
                        <CameraIcon fontSize="large" />
                    </IconButton>
                    <LoadingButton disabled={!photoBlob && true} loadingPosition="center" loading={photoUploading} size="1rem" startIcon={<CloudUploadIcon fontSize="large"/>} onClick={uploadPhoto} sx={{mx: "1rem"}}>
                    </LoadingButton>
                    <LoadingButton disabled={!photoBlob && true} loadingPosition="center" loading={photoUploading} size="1rem" startIcon={<CloudDownloadIcon fontSize="large"/>} onClick={getTestPhoto} sx={{mx: "1rem"}}>
                    </LoadingButton>
                    
                </Box>
            </Grid>
            <Grid item xs={4}>
                <Box sx={{width: "100%"}}>
                    <StyledDataGrid 
                    ref={apiRef}
                    rows={studentResponse}
                    getRowId={getRowId}
                    columns={studentResponseColumns}
                    getRowClassName={(params) => {
                        return params.row.present ? "super-app-theme--success" : "super-app-theme--error"
                    }}
                    initialState={{
                        pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                        },
                    }}
                    pageSizeOptions={[5]}
                    />
                </Box>
                <Box sx={{width: "100%", display: "flex", justifyContent: "center", m: "1rem", gap: 2}}>
                    <TextField type="date" id="dateInput" defaultValue={
                        new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDate()
                    } />
                    <Button onClick={commitStudentResponse} startIcon={<SaveIcon />} variant="outlined" disabled={!studentResponse.length}>
                        Commit
                    </Button>
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
