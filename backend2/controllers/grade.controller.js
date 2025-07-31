import db from '../models/index.js';

export const createGrade = async (req, res) => {
  try {
    const { 
      formative_one,
      formative_two,
      summative,
      final_grade,
      grade_status,
      feedback
    } = req.body;

    // Validate grade values (0-100)
    const validateGrade = (grade) => {
      if (grade !== null && (grade < 0 || grade > 100)) {
        throw new Error('Grades must be between 0 and 100');
      }
    };

    validateGrade(formative_one);
    validateGrade(formative_two);
    validateGrade(summative);
    validateGrade(final_grade);

    const grade = await db.Grade.create({
      formative_one,
      formative_two,
      summative,
      final_grade,
      grade_status: grade_status || 'draft',
      feedback
    });

    return res.status(201).json(grade);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError' || error.message.includes('Grades must be between')) {
      return res.status(400).json({ 
        error: error.errors ? error.errors.map(e => e.message) : error.message 
      });
    }
    return res.status(500).json({ error: "Failed to create grade" });
  }
};

export const getAllGrades = async (req, res) => {
  try {
    const { grade_status } = req.query;
    const where = {};
    
    if (grade_status) {
      where.grade_status = grade_status;
    }

    const grades = await db.Grade.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
    return res.status(200).json(grades);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch grades" });
  }
};

export const getGradeById = async (req, res) => {
  try {
    const { id } = req.params;
    const grade = await db.Grade.findByPk(id);
    
    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }
    
    return res.status(200).json(grade);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch grade" });
  }
};

export const updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      formative_one,
      formative_two,
      summative,
      final_grade,
      grade_status,
      feedback
    } = req.body;
    
    const grade = await db.Grade.findByPk(id);
    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }

    // Validate grade values (0-100)
    const validateGrade = (grade) => {
      if (grade !== null && (grade < 0 || grade > 100)) {
        throw new Error('Grades must be between 0 and 100');
      }
    };

    validateGrade(formative_one);
    validateGrade(formative_two);
    validateGrade(summative);
    validateGrade(final_grade);

    const updatedGrade = await grade.update({
      formative_one,
      formative_two,
      summative,
      final_grade,
      grade_status,
      feedback
    });

    return res.status(200).json(updatedGrade);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError' || error.message.includes('Grades must be between')) {
      return res.status(400).json({ 
        error: error.errors ? error.errors.map(e => e.message) : error.message 
      });
    }
    return res.status(500).json({ error: "Failed to update grade" });
  }
};

export const publishGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const grade = await db.Grade.findByPk(id);
    
    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }

    // Additional validation before publishing
    if (grade.grade_status === 'published') {
      return res.status(400).json({ error: "Grade is already published" });
    }

    const updatedGrade = await grade.update({
      grade_status: 'published'
    });

    return res.status(200).json(updatedGrade);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to publish grade" });
  }
};

export const deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const grade = await db.Grade.findByPk(id);
    
    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }
    
    await grade.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete grade" });
  }
};