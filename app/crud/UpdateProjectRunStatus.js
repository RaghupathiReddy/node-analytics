const Project = require("../models/Project");

const updateProjectRunStatus = async (projectId) => {
  const statusUpdate = { isRunComplete: true };
  return Project.findByIdAndUpdate(
    projectId,
    statusUpdate
  );

};

module.exports = updateProjectRunStatus;
