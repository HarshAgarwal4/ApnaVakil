import { paymentModel } from "../../Users/models/payment";

async function getAllPayments(req,res) {
    try{
        let payments = await paymentModel.find()
        return res.send({status:1 , msg:"Payments fetched successfully", payments:payments})
    }catch(err){
        return res.send({status:0 , msg:"server error"})
    }
}

export {getAllPayments}