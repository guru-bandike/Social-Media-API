const welcomeUser = (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to Social Media API' });
};

export default welcomeUser;
