import { Alert, Box, Grid, LinearProgress, Snackbar, Toolbar, Typography } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Urls } from "../../config/url";
import StyledDataGrid from "../../components/StyledDataGrid";

const getRowIdDates = (row) => {return row.date;}
const getRowIdAtt = (row) => {return row.role_id;}

const dateTableColums = [
    {
        field: "date",
        headerName: "Date"
    }
]

const attendanceTableColums = [
    {
        field: "role_id",
        headerName: "Role ID",
        width: 150
    },
    {
        field: "name",
        headerName: "Name",
        width: 200
    },
    {
        field: "present",
        headerName: "Present"
    }
]

const Attendance = () => {
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);

    const [connecting, setConnecting] = useState(false);

    const [dates, setDates] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const [currentDate, setCurrentDate] = useState(null);

    const dateGridRef = useGridApiRef();

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setAlertOpen(false);
    };

    useEffect(() => {
        setConnecting(true);
        fetch(`${Urls.baseUrl}/mark/api/v1/get-dates`).then(resp => resp.json()).then(resp => {
            if(resp.status){
                setDates(resp.data);
                setConnecting(false);
            }else{
                setAlertMessage(resp.message ? resp.message : resp.detail ? resp.detail : "Error from backend !");
                setAlertSeverity("error");
                setAlertOpen(true); 
                setConnecting(false);
            }
        })
    },[]);

    useEffect(() => {
        return dateGridRef.current.subscribeEvent("rowClick", (params) => setCurrentDate(params.row.date));
    },[dateGridRef])

    useEffect(() => {
        if(!currentDate) return;
        setConnecting(true);
        fetch(`${Urls.baseUrl}/mark/api/v1/get-attendance?date=${currentDate}`).then(
            resp => resp.json()).then(resp => {
                if(resp.status){
                    setAttendance(resp.data);
                    setConnecting(false);
                }else{
                    setAlertMessage(resp.message ? resp.message : resp.detail ? resp.detail : "Error from backend !");
                    setAlertSeverity("error");
                    setAlertOpen(true);
                    setConnecting(false);
                }
            })
    },[currentDate]);

    return (
        <>
        <Toolbar />
        {connecting ? <LinearProgress fourColor/> : null}
        <Grid container sx={{mt: "2rem"}}>
            <Grid item xs={6}>
                <Typography sx={{display: "flex", justifyContent: "center", textTransform:"uppercase", fontWeight: "bold", fontSize: "1.5rem"}}>
                    Select Date
                </Typography>
                <Box sx={{display: "flex", justifyContent: "center", mt:"1rem"}}>
                    <DataGrid 
                    sx={{maxWidth: "65%"}}
                    apiRef={dateGridRef}
                    getRowId={getRowIdDates}
                    rows={dates}
                    columns={dateTableColums}
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
                
            </Grid>
            <Grid item xs={6}>
                <Typography sx={{display: "flex", justifyContent: "center",textTransform:"uppercase", fontWeight: "bold", fontSize: "1.5rem"}}>
                 Attendance   
                </Typography>
                <Box sx={{display: "flex", justifyContent: "center", width: "100%", mt:"1rem"}}>
                    <StyledDataGrid
                    sx={{maxWidth: "80%"}}
                    getRowId={getRowIdAtt}
                    rows={attendance}
                    columns={attendanceTableColums}
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

export default Attendance;
