// import React, { useState } from 'react';
// import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
// import { useDispatch, useSelector } from 'react-redux';
// import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
// import { useNavigate } from 'react-router-dom'
// import { authLogout } from '../../redux/userRelated/userSlice';
// import { Button, Collapse } from '@mui/material';

import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Avatar,
  Divider,
} from "@mui/material";

const AdminProfile = () => {
    // const [showTab, setShowTab] = useState(false);
    // const buttonText = showTab ? 'Cancel' : 'Edit profile';

    // const navigate = useNavigate()
    // const dispatch = useDispatch();
        const { currentUser } = useSelector((state) => state.user);
    // const { currentUser, response, error } = useSelector((state) => state.user);
    // const address = "Admin"

    // if (response) { console.log(response) }
    // else if (error) { console.log(error) }

    // const [name, setName] = useState(currentUser.name);
    // const [email, setEmail] = useState(currentUser.email);
    // const [password, setPassword] = useState("");
    // const [schoolName, setSchoolName] = useState(currentUser.schoolName);

    // const fields = password === "" ? { name, email, schoolName } : { name, email, password, schoolName }

    // const submitHandler = (event) => {
    //     event.preventDefault()
    //     dispatch(updateUser(fields, currentUser._id, address))
    // }

    // const deleteHandler = () => {
    //     try {
    //         dispatch(deleteUser(currentUser._id, "Students"));
    //         dispatch(deleteUser(currentUser._id, address));
    //         dispatch(authLogout());
    //         navigate('/');
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    return (
        <div> 
            
          {/*   <center> */}
          {/* <Card sx={{ maxWidth: 345 }}>
            <b>
            Name: {currentUser.name}
            <hr />
            Email: {currentUser.email}
            <hr />
            School: {currentUser.schoolName}
            <hr />
            </b>
            </Card> */}

<Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 400,
            boxShadow: 6,
            borderRadius: 4,
            p: 3,
            textAlign: "center",
            background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
          }}
        >
          {/* Profile Avatar */}
          <Avatar
            alt={currentUser.name}
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              bgcolor: "#1976d2",
              fontSize: 28,
            }}
          >
            {currentUser.name?.charAt(0).toUpperCase()}
          </Avatar>

          {/* Heading */}
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            Admin Profile
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Details */}
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Name:</strong> {currentUser.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {currentUser.email}
            </Typography>
            <Typography variant="body1">
              <strong>School:</strong> {currentUser.schoolName}
            </Typography>
          </Box>
        </Card>
      </Box>
    </Container>


            {/*  </center> */}
            {/* <Button variant="contained" color="error" onClick={deleteHandler}>Delete</Button> */}
            {/* <Button variant="contained" sx={styles.showButton}
                onClick={() => setShowTab(!showTab)}>
                {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}{buttonText}
            </Button>
            <Collapse in={showTab} timeout="auto" unmountOnExit>
                <div className="register">
                    <form className="registerForm" onSubmit={submitHandler}>
                        <span className="registerTitle">Edit Details</span>
                        <label>Name</label>
                        <input className="registerInput" type="text" placeholder="Enter your name..."
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name" required />

                        <label>School</label>
                        <input className="registerInput" type="text" placeholder="Enter your school name..."
                            value={schoolName}
                            onChange={(event) => setSchoolName(event.target.value)}
                            autoComplete="name" required />

                        <label>Email</label>
                        <input className="registerInput" type="email" placeholder="Enter your email..."
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="email" required />

                        <label>Password</label>
                        <input className="registerInput" type="password" placeholder="Enter your password..."
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password" />

                        <button className="registerButton" type="submit" >Update</button>
                    </form>
                </div>
            </Collapse> */}
        </div>
    )
}

export default AdminProfile

// const styles = {
//     attendanceButton: {
//         backgroundColor: "#270843",
//         "&:hover": {
//             backgroundColor: "#3f1068",
//         }
//     }
// }