import db from '../models/index.js';

export const createCohort = async (req, res) => {
  try {
    const { name, start_date, end_date, status } = req.body;
    
    // Validate end date is after start date
    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    const cohort = await db.Cohort.create({
      name,
      start_date,
      end_date,
      status
    });

    return res.status(201).json(cohort);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: "Cohort name already exists" });
    }
    return res.status(500).json({ error: "Failed to create cohort" });
  }
};

export const getAllCohorts = async (req, res) => {
  try {
    const cohorts = await db.Cohort.findAll({
      order: [['start_date', 'DESC']]
    });
    return res.status(200).json(cohorts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch cohorts" });
  }
};

export const getCohortById = async (req, res) => {
  try {
    const { id } = req.params;
    const cohort = await db.Cohort.findByPk(id);
    
    if (!cohort) {
      return res.status(404).json({ error: "Cohort not found" });
    }
    
    return res.status(200).json(cohort);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch cohort" });
  }
};

export const updateCohort = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, start_date, end_date, status } = req.body;
    
    const cohort = await db.Cohort.findByPk(id);
    if (!cohort) {
      return res.status(404).json({ error: "Cohort not found" });
    }

    // Validate end date is after start date
    if (end_date && start_date && new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    const updatedCohort = await cohort.update({
      name,
      start_date,
      end_date,
      status
    });

    return res.status(200).json(updatedCohort);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: "Cohort name already exists" });
    }
    return res.status(500).json({ error: "Failed to update cohort" });
  }
};

export const deleteCohort = async (req, res) => {
  try {
    const { id } = req.params;
    const cohort = await db.Cohort.findByPk(id);
    
    if (!cohort) {
      return res.status(404).json({ error: "Cohort not found" });
    }
    
    await cohort.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete cohort" });
  }
};