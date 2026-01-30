import {contactModel}  from "../models/contact.js";

async function contact(req,res) {
    let {name , email , message} = req.body;
    if(!name || !email || !message) return res.send({status: 7 , msg: "All fields are required"});
    try {
        let contact = new contactModel({name , email , message});
        await contact.save();
        res.send({status: 1 , msg: "Message sent successfully"});
    }catch(err){
        console.log(err);
        res.send({status: 0 , msg: "Error in sending message"});
    }
}

export { contact }