import userModel from "../../Users/models/user.js";

async function getAllUsers(req,res) {
    try{
        let users = await userModel.find()
        return res.send({status:1 , msg:"Users found" , users: users})
    }
    catch(err){
        console.log(err)
        return res.send({status:0, msg:"server error"})
    }
}

export {getAllUsers}