import db from '../models/index.js';

export const createActivityLog = async (req, res) => {
  try {
    const { 
      week_number,
      attendance,
      formative_one_grading,
      formative_two_grading,
      summative_grading,
      course_moderation,
      intranet_sync,
      gradebook_status,
      notes
    } = req.body;

    // Validate week number
    if (week_number < 1 || week_number > 52) {
      return res.status(400).json({ error: "Week number must be between 1 and 52" });
    }

    const activityLog = await db.ActivityLog.create({
      week_number,
      attendance: attendance || [],
      formative_one_grading: formative_one_grading || 'Not Started',
      formative_two_grading: formative_two_grading || 'Not Started',
      summative_grading: summative_grading || 'Not Started',
      course_moderation: course_moderation || 'Not Started',
      intranet_sync: intranet_sync || 'Not Started',
      gradebook_status: gradebook_status || 'Not Started',
      notes
    });

    return res.status(201).json(activityLog);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    return res.status(500).json({ error: "Failed to create activity log" });
  }
};

export const getAllActivityLogs = async (req, res) => {
  try {
    const { week_number } = req.query;
    const where = {};
    
    if (week_number) {
      where.week_number = week_number;
    }

    const activityLogs = await db.ActivityLog.findAll({
      where,
      order: [['week_number', 'ASC']]
    });
    return res.status(200).json(activityLogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch activity logs" });
  }
};

export const getActivityLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const activityLog = await db.ActivityLog.findByPk(id);
    
    if (!activityLog) {
      return res.status(404).json({ error: "Activity log not found" });
    }
    
    return res.status(200).json(activityLog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch activity log" });
  }
};

export const updateActivityLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      week_number,
      attendance,
      formative_one_grading,
      formative_two_grading,
      summative_grading,
      course_moderation,
      intranet_sync,
      gradebook_status,
      notes
    } = req.body;
    
    const activityLog = await db.ActivityLog.findByPk(id);
    if (!activityLog) {
      return res.status(404).json({ error: "Activity log not found" });
    }

    // Validate week number if provided
    if (week_number && (week_number < 1 || week_number > 52)) {
      return res.status(400).json({ error: "Week number must be between 1 and 52" });
    }

    const updatedActivityLog = await activityLog.update({
      week_number,
      attendance,
      formative_one_grading,
      formative_two_grading,
      summative_grading,
      course_moderation,
      intranet_sync,
      gradebook_status,
      notes
    });

    return res.status(200).json(updatedActivityLog);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    return res.status(500).json({ error: "Failed to update activity log" });
  }
};

export const deleteActivityLog = async (req, res) => {
  try {
    const { id } = req.params;
    const activityLog = await db.ActivityLog.findByPk(id);
    
    if (!activityLog) {
      return res.status(404).json({ error: "Activity log not found" });
    }
    
    await activityLog.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete activity log" });
  }
};