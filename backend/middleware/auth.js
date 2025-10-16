import { getUser } from "../services/auth.js";

const paths = ['/' , '/register' ,'/fgtpwd' , '/sendotp' , '/login' ]

async function isLoggedIn(req ,res ,next) {
    if(paths.includes(req.path)) return next();
    let token = req.cookies?.UID;
    if(!token) return res.send({status: 8 , msg: "Unauthorized access"});
    try {
        let user = await getUser(token);
        let id = user?.id;
        if(!user) return res.status({status: 8 , msg: "Unauthorized access"});
        req.user = user;
        next();
    }catch(err){
        console.log(err);
        return res.send({status: 8 , msg: "Error in authentication"});
    }
}

export { isLoggedIn }