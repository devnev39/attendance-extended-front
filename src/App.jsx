import { AppBar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material"
import { useState } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom"
import MenuIcon from '@mui/icons-material/Menu';

const navItems = [
  {text: "Students", route: "/"}, {text: "Attendance", route: "/attendance"}, {text: "Mark", route: "/mark"}
]

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const container = window !== undefined ? () => window.document.body : undefined;
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center'}}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Attendance Management
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => {navigate(item.route)}}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{display: "flex"}}>
        <AppBar component={"nav"} sx={{bgcolor: "white"}}>
          <Toolbar>
            <Typography component="a" sx={{color: "black", fontSize: "1.5rem", ml: "20%"}}>
              Attendance Management
            </Typography>              
            <Box sx={{ display: {xs: "none", sm: "block"}, ml: "30%"}}>
              {navItems.map((item) => (
                <Button key={item.text} onClick={() => {
                  navigate(item.route);
                }}>
                  {item.text}
                </Button>
              ))}
            </Box>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mx: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <nav>
          <Drawer
            container={container}
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box'},
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </Box>
    </>
  )
}

export default App
