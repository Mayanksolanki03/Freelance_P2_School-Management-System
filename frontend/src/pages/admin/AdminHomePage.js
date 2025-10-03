import React, { useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Divider,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useDispatch, useSelector } from "react-redux";
import CountUp from "react-countup";

import SeeNotice from "../../components/SeeNotice";
import { getAllSclasses } from "../../redux/sclassRelated/sclassHandle";
import { getAllStudents } from "../../redux/studentRelated/studentHandle";
import { getAllTeachers } from "../../redux/teacherRelated/teacherHandle";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { studentsList } = useSelector((state) => state.student);
  const { sclassesList } = useSelector((state) => state.sclass);
  const { teachersList } = useSelector((state) => state.teacher);
  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllStudents(adminID));
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllTeachers(adminID));
  }, [adminID, dispatch]);

  const numberOfStudents = studentsList?.length || 0;
  const numberOfClasses = sclassesList?.length || 0;
  const numberOfTeachers = teachersList?.length || 0;

  // 🟦 Card Data (for cleaner rendering)
  const stats = [
    {
      title: "Total Students",
      value: numberOfStudents,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      color: "#007bff",
      duration: 2.5,
    },
    {
      title: "Total Classes",
      value: numberOfClasses,
      icon: <ClassIcon sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      color: "#28a745",
      duration: 2.5,
    },
    {
      title: "Total Teachers",
      value: numberOfTeachers,
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      color: "#ff5722",
      duration: 2.5,
    },
    {
      title: "Fees Collection",
      value: 23000,
      icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#4caf50",
      prefix: "$",
      duration: 2.5,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* 🟩 Top Stats Cards */}
      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: 180,
                background: item.gradient,
                color: "white",
                borderRadius: 3,
                boxShadow: 4,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  textAlign: "center",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "white",
                    color: item.color,
                    mb: 1,
                    width: 56,
                    height: 56,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {item.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", mt: 1, color: "white" }}
                >
                  <CountUp
                    start={0}
                    end={item.value}
                    duration={item.duration}
                    prefix={item.prefix || ""}
                  />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* 📢 Notices Section */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p:3,
              display: "flex",
              flexDirection: "column",
              borderRadius: 10,
              boxShadow: 3,
            }}
          >
            {/* <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
            >
              Notices
            </Typography> */}
            <Divider sx={{ mb: 2 }} />
            <SeeNotice />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminHomePage;
