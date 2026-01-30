import { contactModel } from "../../Users/models/contact";

async function getContacts(req,res) {
    try{
        let contacts = contactModel.find()
        return res.send({status:1 , msg:"Contacts fetched" , contacts: contacts})
    }
    catch(err){
        console.log(err)
        return res.send({status:0 , msg:"server error"})
    }
}

export {getContacts}