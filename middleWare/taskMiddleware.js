const checkTaskExistence = (tasks) => {
  return (req, res, next) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
      return res.status(404).send('Task not found');
    }
    next();
  };
};

module.exports = { checkTaskExistence };
