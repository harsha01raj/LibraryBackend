const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.user.roles)) {
      return res
        .status(200)
        .json({ Message: "This user is unauthorized for this task" });
    }
    next();
  };
};

module.exports= authorizeRoles;
