import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

// on login access and refresh both are generated 
// access in header payload and refresh in cookies will be saved 
// when the auth middleware finds the access is expired 
// it will send the 401 unauthorised and will request for the refresh 
// this will hit the auth/refresh by this the new access token is created and send in the 

export const verifyAccessToken = (token) => {
  
  return jwt.verify(token, process.env.JWT_SECRET);
  
};
