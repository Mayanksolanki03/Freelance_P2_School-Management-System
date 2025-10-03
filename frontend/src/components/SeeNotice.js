import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotices } from "../redux/noticeRelated/noticeHandle";
import {
  Paper,
  Typography,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import TableViewTemplate from "./TableViewTemplate";

const SeeNotice = () => {
  const dispatch = useDispatch();
  const { currentUser, currentRole } = useSelector((state) => state.user);
  const { noticesList, loading, error, response } = useSelector(
    (state) => state.notice
  );

  useEffect(() => {
    if (currentRole === "Admin") {
      dispatch(getAllNotices(currentUser._id, "Notice"));
    } else {
      dispatch(getAllNotices(currentUser.school._id, "Notice"));
    }
  }, [dispatch]);

  if (error) {
    console.error(error);
  }

  const noticeColumns = [
    { id: "title", label: "Title", minWidth: 170 },
    { id: "details", label: "Details", minWidth: 100 },
    { id: "date", label: "Date", minWidth: 170 },
  ];

  const noticeRows =
    Array.isArray(noticesList) &&
    noticesList.map((notice) => {
      const date = new Date(notice.date);
      const dateString =
        date.toString() !== "Invalid Date"
          ? date.toISOString().substring(0, 10)
          : "Invalid Date";
      return {
        title: notice.title,
        details: notice.details,
        date: dateString,
        id: notice._id,
      };
    });

  return (
    <Box sx={{ mt: 4 }}>
      {/* Section Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          gap: 1.5,
        }}
      >
        <NotificationsActiveIcon
          color="primary"
          sx={{ fontSize: 40, fontWeight: 700 }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            fontSize: "2rem",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            color: "#1a1a1a",
          }}
        >
          Notices
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Main Notice Table / Empty State */}
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          p: 3,
          background: "linear-gradient(135deg, #f0f4ff 0%, #e3eeff 50%, #f9f9f9 100%)",
          backdropFilter: "blur(8px)", // glassy effect ✨
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : response || !noticeRows || noticeRows.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              fontSize: "1.2rem",
              fontWeight: 500,
              color: "text.secondary",
            }}
          >
            No Notices to Show Right Now 📭
          </Box>
        ) : (
          <Box
            sx={{
              "& .MuiTableCell-root": {
                fontSize: "1rem",
                fontWeight: 600,
              },
              "& .MuiTableCell-head": {
                fontSize: "1.05rem",
                fontWeight: 800,
                background:
                  "linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 100%)",
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              },
            }}
          >
            <TableViewTemplate columns={noticeColumns} rows={noticeRows} />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SeeNotice;
