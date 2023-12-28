import { Alert, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Snackbar, TextField, Toolbar, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import {Urls} from "../../config/url";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';

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
        width: 250
    },
    {
        field: "name",
        headerName: "Name",
        width: 250
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
    const [newStudentLoading, setNewStudentLoading] = useState(false);
    const [studentPhoto, setStudentPhoto] = useState(null);

    const [currentSelectedStudent, setCurrentSelectedStudent] = useState(null);
    
    const apiRef = useGridApiRef();

    // useGridApiEventHandler(apiRef, 'rowClick', (params) => setCurrentSelectedStudent(params.row))

    const handleStudentFormOpen = () => {
        setStudentFormOpen(true);
      };
    
    const handleStudentFormClose = () => {
        setStudentFormOpen(false);
        setNewStudent({});
        setStudentPhoto(null);
    };

    const newStudentSubmitted = () => {
        setNewStudentLoading(true);
        if(!newStudent || !newStudent.role_id || newStudent.role_id == "" || !newStudent.name || newStudent.name == "") {
            setAlertSeverity("error");
            setAlertMessage("Empty student info !")
            setAlertOpen(true);
            setStudentPhoto(null);
            setNewStudent({});
            return;
        }
        let data = new FormData();
        data.append("file", studentPhoto);
        fetch(`${Urls.baseUrl}/student/api/v1/create-student?role_id=${newStudent.role_id}&name=${newStudent.name}`,{
            method: "POST",
            body: data
        }).then(resp => resp.json()).then(resp => {
            if(resp.status){
                setStudents(current => [...current, resp.data]);      
            }else{
                setAlertSeverity("error");
                setAlertMessage(resp.detail ? resp.detail : resp.message ? resp.message : "Error from backend !");
                setAlertOpen(true);
            }
            setNewStudentLoading(false);
            handleStudentFormClose();
        })
        
    }

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setAlertOpen(false);
    };

    const deleteSelectedStudent = () => {
        fetch(`${Urls.baseUrl}/student/api/v1/delete-students?role_id=${currentSelectedStudent.role_id}`,{
            method: "DELETE",
        }).then(resp => resp.json()).then(resp => {
            if(resp.status){
                let current = students.filter(std => std.role_id == currentSelectedStudent.role_id);
                if(current.length) current = current[0];
                current = students.indexOf(current);
                if(current  == -1){
                    setAlertSeverity("error");
                    setAlertMessage("Selected student not found !");
                    setAlertOpen(true);
                }
                console.log(current);
                setStudents(stds => {
                    let copy = JSON.parse(JSON.stringify(stds));
                    copy.splice(current, current+1);
                    return copy;
                })
                setAlertSeverity("info");
                setAlertMessage("Student removed successfully !");
                setAlertOpen(true); 
                setCurrentSelectedStudent({});
            }else{
                setAlertSeverity("error");
                setAlertMessage("Error from backend !");
                setAlertOpen(true);
            }
        })
    }

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

    useEffect(() => {
        return apiRef.current.subscribeEvent("rowClick", (params) => setCurrentSelectedStudent(params.row));
    },[apiRef])

    return (
        <>
            <Toolbar />
            <Grid container spacing={2} sx={{m: "0.1rem"}}>
                <Grid item xs={6} sx={{borderRight: "solid", p: "1rem"}}>
                    <DataGrid
                    apiRef={apiRef}
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
                    <Card sx={{borderRadius: "5px", p: "1rem"}}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="h5" sx={{m: "1rem"}}>
                                    Name: {currentSelectedStudent?.name}
                                </Typography>
                                <Typography variant="h5" sx={{m: "1rem"}}>
                                    Role ID: {currentSelectedStudent?.role_id}
                                </Typography>
                                {/* <TextField value={currentSelectedStudent.name} /> */}
                            </Grid>
                            <Grid item xs={6}>
                                <Box 
                                    component="img"
                                    src={currentSelectedStudent?.photoid_url}
                                    sx={{maxWidth: "50%"}}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{display: "flex", justifyContent: "center", mt: "1rem"}}>
                            <Button 
                            startIcon={<DeleteIcon />} 
                            disabled={currentSelectedStudent ? false : true} 
                            variant="outlined"
                            onClick={deleteSelectedStudent}
                            >
                                Delete
                            </Button>
                        </Box>
                        
                    </Card>
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
                    <Button variant="outlined" onClick={handleStudentFormClose}>Close</Button>
                    <LoadingButton variant="outlined" loading={newStudentLoading} onClick={newStudentSubmitted}>Submit</LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Students;
