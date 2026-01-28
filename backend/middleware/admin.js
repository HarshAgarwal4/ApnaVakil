const adminRoutes= []

async function isAdmin(req,res,next) {
    if (adminRoutes.includes(req.path)) {
        if(req.user.role == 'admin') return next()
        else res.send({status:114 , msg:"Unauthorised access"})
    }
    return next()
}

export {isAdmin}