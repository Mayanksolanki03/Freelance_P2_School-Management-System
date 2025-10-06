import React from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const TeacherProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  // Extract subjects and classes from currentUser.teachSubject (now an array)
  let subjectPairs = '';
  let classList = '';

  if (currentUser && currentUser.teachSubject) {
    const subjects = Array.isArray(currentUser.teachSubject)
      ? currentUser.teachSubject
      : [currentUser.teachSubject];

    const pairs = [];
    const classSet = new Set();

    subjects.forEach((sub) => {
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
    });

    subjectPairs = pairs.join(', ');
    classList = Array.from(classSet).join(', ');
  }

  const teachSchool = currentUser?.school;

  return (
    <>
      <ProfileCard>
        <ProfileCardContent>
          <ProfileText>Name: {currentUser?.name}</ProfileText>
          <ProfileText>Email: {currentUser?.email}</ProfileText>
          <ProfileText>
            Classes: {classList || currentUser?.teachSclass?.sclassName || 'N/A'}
          </ProfileText>
          <ProfileText>Subjects: {subjectPairs || 'N/A'}</ProfileText>
          <ProfileText>School: {teachSchool?.schoolName}</ProfileText>
        </ProfileCardContent>
      </ProfileCard>
    </>
  );
};

export default TeacherProfile;

const ProfileCard = styled(Card)`
  margin: 20px;
  width: 400px;
  border-radius: 10px;
`;

const ProfileCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileText = styled(Typography)`
  margin: 10px;
`;
