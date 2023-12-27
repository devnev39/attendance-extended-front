import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Snackbar, TextField, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import {Urls} from "../../config/url";
import { DataGrid } from "@mui/x-data-grid";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  

const columns = [
    {
        field: "role_id",
        headerName: "Role ID",
        // width: 250
    },
    {
        field: "name",
        headerName: "Name",
    }
]

const getRowId = (item) => {
    return item.role_id;
}

const Students = () => {
    // 1. Fetch students
    // 2. Student info card
    // 3. Student data table

    const [students, setStudents] = useState([]);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);

    const [studentFormOpen, setStudentFormOpen] = useState(false);

    const [newStudent, setNewStudent] = useState({});
    const [studentPhoto, setStudentPhoto] = useState(null);

    const handleStudentFormOpen = () => {
        setStudentFormOpen(true);
      };
    
      const handleStudentFormClose = () => {
        setStudentFormOpen(false);
        setNewStudent({});
        setStudentPhoto(null);
      };

      const newStudentSubmitted = () => {
        if(!newStudent || !newStudent.role_id || newStudent.role_id == "" || !newStudent.name || newStudent.name == "") {
            setAlertSeverity("error");
            setAlertMessage("Empty student info !")
            setAlertOpen(true);
            setStudentPhoto(null);
            setNewStudent({});
            return;
        }

        handleStudentFormClose();
      }

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setAlertOpen(false);
      };

    const fetchStudents = () => {
        fetch(`${Urls.baseUrl}/student/api/v1/get-students`).then(resp => resp.json()).then(resp => {
            if(resp.status){
                setStudents(resp.data);
            }
            else {
                setAlertSeverity("error");
                setAlertMessage(resp.message ? resp.message : "Error while fetching data !");
                setAlertOpen(true);
            }
        })
    }

    useEffect(() => {
        fetchStudents();
    },[]);

    return (
        <>
            <Toolbar />
            <Grid container spacing={2} sx={{m: "0.1rem"}}>
                <Grid item xs={6} sx={{borderRight: "solid", p: "1rem"}}>
                    <DataGrid
                    getRowId={getRowId}
                    rows={students}
                    columns={columns}
                    initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 5,
                          },
                        },
                      }}
                    pageSizeOptions={[5]}
                    />
                    <Box sx={{width: "100%", display:"flex", justifyContent: "center", mt: "1rem"}}>
                        {/* <IconButton>
                            <PersonAddIcon />
                        </IconButton> */}
                        <Button onClick={handleStudentFormOpen} startIcon={<PersonAddIcon />} variant="outlined">
                            Add
                        </Button>
                    </Box>
                    
                </Grid>
                <Grid item xs={6}>

                </Grid>
            </Grid>
            <Snackbar sx={{display: "flex", justifyContent: "center", width: "100%"}} open={alertOpen} autoHideDuration={3000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={alertSeverity}>
                    {alertMessage}
                </Alert>
            </Snackbar>
            <Dialog open={studentFormOpen} onClose={handleStudentFormClose}>
                <DialogTitle>Add Student</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Add a new student
                    </DialogContentText>
                    <TextField 
                        autoFocus
                        margin="dense"
                        label="Role ID"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setNewStudent(student => {
                                return {...student, role_id: event.target.value}
                            })
                        }}
                    />
                    <TextField 
                        autoFocus
                        margin="dense"
                        label="Full Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setNewStudent(student => {
                                return {...student, name: event.target.value}
                            })
                        }}
                    />
                    <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                        Upload Photo
                        <VisuallyHiddenInput onChange={(event) => {
                            setStudentPhoto(event.target.files[0]);
                            console.log(event.target.files[0].name)
                        }} type="file" accept="image/png, image/jpeg" />
                    </Button>
                    <Typography>
                        {studentPhoto ? studentPhoto.name : "None selected !"}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleStudentFormClose}>Close</Button>
                    <Button onClick={newStudentSubmitted}>Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Students;
