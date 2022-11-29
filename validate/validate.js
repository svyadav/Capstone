const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRound = 10;
const secretkey = "KDHFBVBDHEJFJBJ";

const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(saltRound);
  let hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const hashCompare = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

let createToken = async (email, role) => {
  let token = await jwt.sign({ email, role }, secretkey, { expiresIn: "1h" });
  return token;
};

let jwtDecode = async (token) => {
  let data = await jwt.decode(token);
  return data;
};

let validate=async(req,res,next)=>{
    if(req.headers && req.headers.authorization){
        let token=req.headers.authorization.split(" ")[1]
        let data=await jwtDecode(token)
        let currentTime=Math.round(new Date()/1000)
        if(currentTime<=data.exp)
        next()
        else{
            res.send({
                statusCode:401,
                message:"Token expired"
            })
        }

    }
    else{
       res.send({
        statusCode:401,
        message:"Invalid token or no token"
       })
    }   

}

let roleAdmin=async(req,res,next)=>{
  if(req.headers && req.headers.authorization){
    let token=req.headers.authorization.split(" ")[1]
    let data=await jwtDecode(token)
    if(data.role=="Admin")
    next()
    else{
      res.send({
        statusCode:401,
      message:"Unauthorized:Only admin can access"
      })
    }
  }
  else{
    res.send({
      statusCode:401,
      message:"Invalid token or no token"
    })
  }
 
}

module.exports = { hashPassword, hashCompare, createToken, jwtDecode,validate };
