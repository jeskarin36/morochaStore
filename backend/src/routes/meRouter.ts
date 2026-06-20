import { getAuth } from "@clerk/express";
import { Router } from "express";
import { getLocalUser } from "./users.js";

const router = Router();

router.get("/",async(req,res,next)=>{
    try {
        const { userId, isAuthenticated } = getAuth(req);
        if(!isAuthenticated || !userId){
            res.status(401).json({error:"Unauthorized"});
            return;
        }

        const users= await getLocalUser(userId);
        res.json({users})
    } catch (error) {
        next(error)
    }
})

export default router;