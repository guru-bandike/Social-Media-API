const handleInvalidRoute = (req, res) => {
  res.status(404).json({
    status: false,
    message: 'API not found!, Please check out our documentaion for more information!',
  });
};

export default handleInvalidRoute;
