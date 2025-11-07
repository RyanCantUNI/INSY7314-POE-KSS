//token handlers modules 
import jwt from "jsonwebtoken";

export const userToken = (id ,email)=>
{

    //creates base user token with no permissions 
    //for customers
    /*
    take in user id and email and sign them onto the token 
    id for current logged in user
    email for verfication perposes
    */
   //console.log("Generating User Token with ID:", id, "and Email:", email);
   const signedToken = jwt.sign({ id, email }, "user token", { expiresIn: '2h' });
   //console.log("Signed Token:", signedToken);
   //console.log("token id:", signedToken._id); 
   return signedToken;
}


export const generateAdminsToken = (id, email, role) => {

    /*
    for signed users with access rolls
    id for current logged in user
    email for verfication perposes
    role for admin access roles
    */


  return jwt.sign({ id, email, role }, "admin token", { expiresIn: '2h' });
};

