import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Typography } from '@mui/material';

const TeacherDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

  const teacherID = params.id;

  useEffect(() => {
    dispatch(getTeacherDetails(teacherID));
  }, [dispatch, teacherID]);

  if (error) {
    console.log(error);
  }

  // Build subject-class pairs and class list from teachSubject array
  let subjectPairs = '';
  let classList = '';
  let defaultClassId = null;

  if (teacherDetails && Array.isArray(teacherDetails.teachSubject) && teacherDetails.teachSubject.length > 0) {
    const pairs = [];
    const classSet = new Set();
    teacherDetails.teachSubject.forEach((sub) => {
      const subName = sub?.subName || '';
      const className = sub?.sclassName?.sclassName || sub?.sclassName || '';
      if (subName && className) {
        pairs.push(`${subName} - ${className}`);
      } else if (subName) {
        pairs.push(subName);
      }
      if (className) {
        classSet.add(className);
      }
      if (!defaultClassId && sub?.sclassName?._id) {
        defaultClassId = sub.sclassName._id;
      }
    });
    subjectPairs = pairs.join(', ');
    classList = Array.from(classSet).join(', ');
  }

  // fallback to teachSclass if no subjects
  if (!defaultClassId && teacherDetails?.teachSclass?._id) {
    defaultClassId = teacherDetails.teachSclass._id;
  }

  const handleAddSubject = () => {
    // Use first class ID (defaultClassId) in the route
    navigate(`/Admin/teachers/choosesubject/${defaultClassId}/${teacherID}`);
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            Teacher Details
          </Typography>
          <Typography variant="h6" gutterBottom>
            Teacher Name: {teacherDetails?.name}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Classes: {classList || teacherDetails?.teachSclass?.sclassName || 'N/A'}
          </Typography>
          {subjectPairs ? (
            <Typography variant="h6" gutterBottom>
              Subjects: {subjectPairs}
            </Typography>
          ) : (
            <Button variant="contained" onClick={handleAddSubject}>
              Add Subject
            </Button>
          )}
        </Container>
      )}
    </>
  );
};

export default TeacherDetails;
