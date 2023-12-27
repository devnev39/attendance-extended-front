import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Students from './pages/Students/Students.jsx'
import Attendance from "./pages/Attendance/Attendance.jsx";
import Mark from "./pages/Mark/Mark.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Routes>
        <Route path='/' element={<Students />}/>
        <Route path='/attendance' element={<Attendance />}/>
        <Route path='/mark' element={<Mark />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
