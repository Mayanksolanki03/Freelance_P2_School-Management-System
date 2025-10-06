const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Student = require('../models/studentSchema.js');

// Create subjects (unchanged)
const subjectCreate = async (req, res) => {
    try {
        const subjects = req.body.subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
        }));

        const existingSubjectBySubCode = await Subject.findOne({
            'subjects.subCode': subjects[0].subCode,
            school: req.body.adminID,
        });

        if (existingSubjectBySubCode) {
            res.send({ message: 'Sorry this subcode must be unique as it already exists' });
        } else {
            const newSubjects = subjects.map((subject) => ({
                ...subject,
                sclassName: req.body.sclassName,
                school: req.body.adminID,
            }));

            const result = await Subject.insertMany(newSubjects);
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get all subjects (unchanged)
const allSubjects = async (req, res) => {
    try {
        let subjects = await Subject.find({ school: req.params.id })
            .populate('sclassName', 'sclassName');
        if (subjects.length > 0) {
            res.send(subjects);
        } else {
            res.send({ message: 'No subjects found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get subjects by class (unchanged)
const classSubjects = async (req, res) => {
    try {
        let subjects = await Subject.find({ sclassName: req.params.id });
        if (subjects.length > 0) {
            res.send(subjects);
        } else {
            res.send({ message: 'No subjects found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get free subjects (unchanged)
const freeSubjectList = async (req, res) => {
    try {
        let subjects = await Subject.find({ sclassName: req.params.id, teacher: { $exists: false } });
        if (subjects.length > 0) {
            res.send(subjects);
        } else {
            res.send({ message: 'No subjects found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get subject detail (unchanged)
const getSubjectDetail = async (req, res) => {
    try {
        let subject = await Subject.findById(req.params.id);
        if (subject) {
            subject = await subject.populate('sclassName', 'sclassName');
            subject = await subject.populate('teacher', 'name');
            res.send(subject);
        } else {
            res.send({ message: 'No subject found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Delete a single subject and remove it from all teachers’ arrays
const deleteSubject = async (req, res) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

        // Remove the deleted subject ID from all teachers’ teachSubject arrays
        await Teacher.updateMany(
            { teachSubject: deletedSubject._id },
            { $pull: { teachSubject: deletedSubject._id } }
        );

        // Remove the objects containing the deleted subject from students' examResult array
        await Student.updateMany(
            {},
            { $pull: { examResult: { subName: deletedSubject._id } } }
        );

        // Remove the objects containing the deleted subject from students' attendance array
        await Student.updateMany(
            {},
            { $pull: { attendance: { subName: deletedSubject._id } } }
        );

        res.send(deletedSubject);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Delete all subjects by school and clean up teacher arrays
const deleteSubjects = async (req, res) => {
    try {
        // Gather IDs of all subjects to be deleted
        const subjectsToDelete = await Subject.find({ school: req.params.id });
        const subjectIds = subjectsToDelete.map((subject) => subject._id);

        const deletionResult = await Subject.deleteMany({ school: req.params.id });

        // Remove these IDs from every teacher’s teachSubject array
        await Teacher.updateMany(
            { teachSubject: { $in: subjectIds } },
            { $pull: { teachSubject: { $in: subjectIds } } }
        );

        // Remove examResult and attendance entries from all students
        await Student.updateMany({}, { $set: { examResult: null, attendance: null } });

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Delete all subjects by class and clean up teacher arrays
const deleteSubjectsByClass = async (req, res) => {
    try {
        // Gather IDs of all subjects to be deleted by class
        const subjectsToDelete = await Subject.find({ sclassName: req.params.id });
        const subjectIds = subjectsToDelete.map((subject) => subject._id);

        const deletionResult = await Subject.deleteMany({ sclassName: req.params.id });

        // Remove these IDs from every teacher’s teachSubject array
        await Teacher.updateMany(
            { teachSubject: { $in: subjectIds } },
            { $pull: { teachSubject: { $in: subjectIds } } }
        );

        // Remove examResult and attendance entries from all students
        await Student.updateMany({}, { $set: { examResult: null, attendance: null } });

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    subjectCreate,
    freeSubjectList,
    classSubjects,
    getSubjectDetail,
    deleteSubjectsByClass,
    deleteSubjects,
    deleteSubject,
    allSubjects,
};
