import jwt from "jsonwebtoken"


const protect= async (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message: "Unauthorized access"});
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    if(!token){
        return res.status(401).json({message: "Unauthorized access"});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();

    }catch(error){
        return res.status(401).json({message: "Unauthorized access"});
    }
}

export default protect;




