const handleInvalidRoute = (req, res) => {
  res.status(404).json({
    success: false,
    message:
      'API endpoint not found! Please refer to the README file or check out the Postman collection for detailed documentation and instructions on available API paths!',
  });
};

export default handleInvalidRoute;
