import { contactModel } from "../../Users/models/contact.js";

async function getContacts(req,res) {
    try{
        let contacts = await contactModel.find()
        return res.send({status:1 , msg:"Contacts fetched" , contacts: contacts})
    }
    catch(err){
        console.log(err)
        return res.send({status:0 , msg:"server error"})
    }
}

export {getContacts}