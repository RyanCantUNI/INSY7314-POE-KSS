//token handlers modules 
import jwt from "jsonwebtoken";

const checkToken = (req,res,next) =>
{
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "Current user");
        next();

    }
    catch{
        res.send("invalid token")
    }
}

export default checkToken