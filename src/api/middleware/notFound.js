function notFound(req, res) {
  return res.status(404).json({
    errors: [
      `route '${req.path}' does not exist`
    ]
  });
}

module.exports = notFound;
