const jwt = require('jsonwebtoken');

const verifyJwt = (req,res,next)=>{
    try {
        const token = req.header("Authorization")
        if(!token)
        {
          return   res.status(401).json({message:"Unauthorised token"})
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        if(!decode)
        {
            req.body.userId = decode.userId
          return  res.status(401).json({message:"Invalid token"})
        }
        next();
    } catch (error) {
        res.status(500).json({message:"Invalid Token"})
    }
   
}

module.exports=verifyJwt