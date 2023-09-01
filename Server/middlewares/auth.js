import jwt from 'jsonwebtoken'

export const verifyToken = async(req,res,next) =>{
    try{
        
        let token = req.headers("Authorization");

        if(!token){
            return res.status(403).send("Access denied")
        }

        if(token.startsWith("Bearer ")){
            token = token.slice(7,toke.length).trimLeft()
        }

        const verified = jwt.verify(token,process.env.SECRET);
        req.user = verified

    } catch(error){
        res.status(500).json({msg:"error"})
    }
} 