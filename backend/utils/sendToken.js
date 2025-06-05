export const sendToken = (user, statuscode, message, res) => {
  const token = user.generateToken();
  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 3; 

  res
    .status(statuscode)
    .cookie("token", token, {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      user,
      message,
      token,
    });
};
