//token handlers modules 
import jwt from "jsonwebtoken";

const checkToken = (req,res,next) =>
{
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "User token");
        next();

    }
    catch(err){
        
        res.send("invalid token")
        console.log("Token Error", err)
    }
}

export default checkToken