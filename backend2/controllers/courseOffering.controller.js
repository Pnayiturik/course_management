import db from '../models/index.js';

export const createCourseOffering = async (req, res) => {
  try {
    const { start_date, end_date, status, capacity, current_enrollment } = req.body;
    
    // Validate end date is after start date
    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    // Validate current enrollment doesn't exceed capacity
    if (current_enrollment > capacity) {
      return res.status(400).json({ 
        error: "Current enrollment cannot exceed capacity" 
      });
    }

    const courseOffering = await db.CourseOffering.create({
      start_date,
      end_date,
      status,
      capacity,
      current_enrollment
    });

    return res.status(201).json(courseOffering);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    return res.status(500).json({ error: "Failed to create course offering" });
  }
};

export const getAllCourseOfferings = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    
    if (status) {
      where.status = status;
    }

    const courseOfferings = await db.CourseOffering.findAll({
      where,
      order: [['start_date', 'DESC']]
    });
    return res.status(200).json(courseOfferings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch course offerings" });
  }
};

export const getCourseOfferingById = async (req, res) => {
  try {
    const { id } = req.params;
    const courseOffering = await db.CourseOffering.findByPk(id);
    
    if (!courseOffering) {
      return res.status(404).json({ error: "Course offering not found" });
    }
    
    return res.status(200).json(courseOffering);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch course offering" });
  }
};

export const updateCourseOffering = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, status, capacity, current_enrollment } = req.body;
    
    const courseOffering = await db.CourseOffering.findByPk(id);
    if (!courseOffering) {
      return res.status(404).json({ error: "Course offering not found" });
    }

    // Validate end date is after start date
    if (end_date && start_date && new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    // Validate current enrollment doesn't exceed capacity
    if (current_enrollment && capacity && current_enrollment > capacity) {
      return res.status(400).json({ 
        error: "Current enrollment cannot exceed capacity" 
      });
    }

    const updatedCourseOffering = await courseOffering.update({
      start_date,
      end_date,
      status,
      capacity,
      current_enrollment
    });

    return res.status(200).json(updatedCourseOffering);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    return res.status(500).json({ error: "Failed to update course offering" });
  }
};

export const deleteCourseOffering = async (req, res) => {
  try {
    const { id } = req.params;
    const courseOffering = await db.CourseOffering.findByPk(id);
    
    if (!courseOffering) {
      return res.status(404).json({ error: "Course offering not found" });
    }
    
    await courseOffering.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete course offering" });
  }
};