export const setupAssociations = (sequelize) => {
  const {
    User,
    Module,
    Cohort,
    Class,
    CourseOffering,
    ActivityLog,
    Grade
  } = sequelize.models;

  // Class belongs to a Cohort
  Class.belongsTo(Cohort, {
    foreignKey: 'cohort_id',
    as: 'cohort'
  });
  
  // Cohort has many Classes
  Cohort.hasMany(Class, {
    foreignKey: 'cohort_id',
    as: 'classes'
  });

  // Course Offering belongs to Module, Class, and Facilitator (User)
  CourseOffering.belongsTo(Module, {
    foreignKey: 'module_id',
    as: 'module'
  });
  
  CourseOffering.belongsTo(Class, {
    foreignKey: 'class_id',
    as: 'class'
  });
  
  CourseOffering.belongsTo(User, {
    foreignKey: 'facilitator_id',
    as: 'facilitator'
  });

  // Module has many Course Offerings
  Module.hasMany(CourseOffering, {
    foreignKey: 'module_id',
    as: 'offerings'
  });

  // Class has many Course Offerings
  Class.hasMany(CourseOffering, {
    foreignKey: 'class_id',
    as: 'offerings'
  });

  // User (facilitator) has many Course Offerings
  User.hasMany(CourseOffering, {
    foreignKey: 'facilitator_id',
    as: 'facilitated_offerings'
  });

  // Activity Log belongs to Course Offering
  ActivityLog.belongsTo(CourseOffering, {
    foreignKey: 'offering_id',
    as: 'offering'
  });

  // Course Offering has many Activity Logs
  CourseOffering.hasMany(ActivityLog, {
    foreignKey: 'offering_id',
    as: 'activity_logs'
  });

  // Grade belongs to Student (User) and Course Offering
  Grade.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student'
  });
  
  Grade.belongsTo(CourseOffering, {
    foreignKey: 'offering_id',
    as: 'offering'
  });

  // User (student) has many Grades
  User.hasMany(Grade, {
    foreignKey: 'student_id',
    as: 'grades'
  });

  // Course Offering has many Grades
  CourseOffering.hasMany(Grade, {
    foreignKey: 'offering_id',
    as: 'grades'
  });

  // Class has many Students (Users)
  Class.hasMany(User, {
    foreignKey: 'class_id',
    as: 'students',
    scope: {
      role: 'student'
    }
  });

  // Student (User) belongs to Class
  User.belongsTo(Class, {
    foreignKey: 'class_id',
    as: 'class'
  });
};