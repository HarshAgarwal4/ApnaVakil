const paths = ['/' , '/register' ,'/fgtpwd' , '/sendotp' , '/login' , '/payment' , '/verifyPayment' , '/me' , '/logout' , '/fetchHistory' , '/getPayments' , '/savePayment' ]

async function isPaid(req ,res ,next) {
    if(paths.includes(req.path)) return next();
    let date = new Date();
    let user = req.user;
    let expDate = user?.expDate;
    console.log(user)
    if(!user) return res.status({ status: 8, msg: "Unauthorized access" });
    if(!expDate) return res.status({ status: 12, msg: "Unauthorized access" });
    console.log(date , expDate , date > expDate)
    if(date > new Date(expDate).getTime()) {
        return res.status({ status: 11, msg: "Subscription expired. Please renew to continue." });
    }
    if(user.plan === 'Basic' || user.plan === 'Premium') return next();
}

export { isPaid }