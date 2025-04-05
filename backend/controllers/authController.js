const logoutUser = (req, res) => {
    res.clearCookie('token'); // Or session
    res.status(200).json({ message: 'Logged out successfully' });
  };
  
  module.exports = { logoutUser };
  