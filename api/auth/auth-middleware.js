const { default: jwtDecode } = require("jwt-decode");
const { JWT_SECRET } = require("../secrets"); // use this secret!

const jwt = require('jsonwebtoken');
const e = require("express");

const restricted = (req, res, next) => {
  
  const token = req.body.authorization

  if (!token) {
    res.status(401).json("token needed")
  } else {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if(err) {
        res.status(401).json("toekn is bad:" + err.message)
      } else {
        req.decodedToken = decoded
        next()
      }
    })
  }
}

const only = role_name => (req, res, next) => {
  
  if(req.decodedToken.role === role) {
    next()
  } else {
    res.status(403).json({"message": "This is not for you"})
  }
}


const checkUsernameExists = (req, res, next) => {
 
  User.findBy(req.body.username)
  .then(res => {
    if(!res) {
      res.status(401).json({ "message": "Invalid credentials"})
    } else {
      next()
    }
  })
  .cathc(err => {
    res.status(500).json({ message: err.message })
  })
}


const validateRoleName = (req, res, next) => {
  
  if(!req.body.role_name || req.body.role_name === "") {
    req.body.role_name = 'student'
    req.body.role_name.trim()
    next()
  } else if (req.body.role_name === 'admin') {
    res.status(422).json({"message": "Role name can not be admin"})
  } if (req.body.role_name.trim().length > 32 ) {
    res.status(422).json({ "message": "Role name can not be longer than 32 chars"})
  }
}

module.exports = {
  restricted,
  checkUsernameExists,
  validateRoleName,
  only,
}