const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');

/**
 * Register a new teacher or update an existing one. 
 * If a teacher already exists (matching by email), new subject IDs are merged 
 * into the existing teacher’s `teachSubject` array and other fields are updated
 * if provided.  Otherwise, a new teacher is created.
 */
const teacherRegister = async (req, res) => {
  const { name, email, password, role, school, teachSubject, teachSclass } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Normalize teachSubject to array
    const newSubjectIds = Array.isArray(teachSubject) ? teachSubject : [teachSubject];

    // Check if teacher exists by email
    const existingTeacher = await Teacher.findOne({ email });

    if (existingTeacher) {
      // Merge new subject IDs into existing teacher's subject array
      const existingSubjects = existingTeacher.teachSubject || [];
      const merged = [
        ...new Set([
          ...existingSubjects.map(id => id.toString()),
          ...newSubjectIds.map(id => id.toString())
        ])
      ];
      existingTeacher.teachSubject = merged;

      // Update optional fields if provided
      if (role) existingTeacher.role = role;
      if (school) existingTeacher.school = school;
      if (teachSclass) existingTeacher.teachSclass = teachSclass;
      if (password) existingTeacher.password = hashedPass;

      const updatedTeacher = await existingTeacher.save();

      // Assign this teacher to all newly added subjects
      await Subject.updateMany({ _id: { $in: newSubjectIds } }, { teacher: updatedTeacher._id });

      updatedTeacher.password = undefined;
      return res.send(updatedTeacher);
    }

    // Create new teacher if not existing
    const teacher = new Teacher({
      name,
      email,
      password: hashedPass,
      role,
      school,
      teachSubject: newSubjectIds,
      teachSclass
    });

    const savedTeacher = await teacher.save();

    // Update subjects to reference this new teacher
    await Subject.updateMany({ _id: { $in: newSubjectIds } }, { teacher: savedTeacher._id });

    savedTeacher.password = undefined;
    return res.send(savedTeacher);
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * Teacher login. Populates subjects (with class info), school, and class. 
 */
const teacherLogIn = async (req, res) => {
  try {
    let teacher = await Teacher.findOne({ email: req.body.email })
      .populate({
        path: 'teachSubject',
        select: 'subName sessions sclassName',
        populate: { path: 'sclassName', select: 'sclassName' }
      })
      .populate('school', 'schoolName')
      .populate('teachSclass', 'sclassName');

    if (!teacher) {
      return res.send({ message: 'Teacher not found' });
    }

    const validated = await bcrypt.compare(req.body.password, teacher.password);
    if (!validated) {
      return res.send({ message: 'Invalid password' });
    }

    teacher.password = undefined;
    res.send(teacher);
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * Get all teachers for a given school.  Each teacher record is populated 
 * with its subject list and the class of each subject.
 */
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ school: req.params.id })
      .populate({
        path: 'teachSubject',
        select: 'subName sclassName',
        populate: { path: 'sclassName', select: 'sclassName' }
      })
      .populate('teachSclass', 'sclassName');

    if (!teachers.length) {
      return res.send({ message: 'No teachers found' });
    }

    // Remove password fields
    const sanitized = teachers.map((teacher) => {
      const obj = teacher.toObject();
      delete obj.password;
      return obj;
    });
    res.send(sanitized);
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * Get a single teacher by ID.  Populates subject and class information.
 */
const getTeacherDetail = async (req, res) => {
  try {
    let teacher = await Teacher.findById(req.params.id)
      .populate({
        path: 'teachSubject',
        select: 'subName sessions sclassName',
        populate: { path: 'sclassName', select: 'sclassName' }
      })
      .populate('school', 'schoolName')
      .populate('teachSclass', 'sclassName');

    if (!teacher) {
      return res.send({ message: 'No teacher found' });
    }

    teacher.password = undefined;
    res.send(teacher);
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * Append new subject IDs to a teacher’s teachSubject array.
 */
const updateTeacherSubject = async (req, res) => {
  const { teacherId, teachSubject } = req.body;
  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).send({ message: 'Teacher not found' });

    const newSubjectIds = Array.isArray(teachSubject) ? teachSubject : [teachSubject];
    const existingSubjects = teacher.teachSubject || [];
    const merged = [
      ...new Set([
        ...existingSubjects.map(id => id.toString()),
        ...newSubjectIds.map(id => id.toString())
      ])
    ];
    teacher.teachSubject = merged;

    const updatedTeacher = await teacher.save();

    // Update subjects to reference this teacher
    await Subject.updateMany({ _id: { $in: newSubjectIds } }, { teacher: teacher._id });

    res.send(updatedTeacher);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Delete a single teacher and remove references from subjects.
 */
const deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) {
      return res.status(404).send({ message: 'Teacher not found' });
    }

    await Subject.updateMany({ teacher: deletedTeacher._id }, { $unset: { teacher: '' } });
    res.send(deletedTeacher);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Delete all teachers in a school and remove references from subjects.
 */
const deleteTeachers = async (req, res) => {
  try {
    const teachersToDelete = await Teacher.find({ school: req.params.id });
    const teacherIds = teachersToDelete.map((t) => t._id);

    const result = await Teacher.deleteMany({ school: req.params.id });
    if (!result.deletedCount) {
      return res.send({ message: 'No teachers found to delete' });
    }

    await Subject.updateMany({ teacher: { $in: teacherIds } }, { $unset: { teacher: '' } });
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Delete teachers by class ID and remove references from subjects.
 */
const deleteTeachersByClass = async (req, res) => {
  try {
    const teachersToDelete = await Teacher.find({ sclassName: req.params.id });
    const teacherIds = teachersToDelete.map((t) => t._id);

    const result = await Teacher.deleteMany({ sclassName: req.params.id });
    if (!result.deletedCount) {
      return res.send({ message: 'No teachers found to delete' });
    }

    await Subject.updateMany({ teacher: { $in: teacherIds } }, { $unset: { teacher: '' } });
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Record teacher attendance for a given date.
 */
const teacherAttendance = async (req, res) => {
  const { status, date } = req.body;
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.send({ message: 'Teacher not found' });
    }

    const existingAttendance = teacher.attendance.find(
      (a) => a.date.toDateString() === new Date(date).toDateString()
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      teacher.attendance.push({ date, status });
    }

    const result = await teacher.save();
    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  updateTeacherSubject,
  deleteTeacher,
  deleteTeachers,
  deleteTeachersByClass,
  teacherAttendance
};
