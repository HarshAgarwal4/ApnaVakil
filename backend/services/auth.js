import jwt from 'jsonwebtoken';

async function setuser(user) {
    try {
        let obj = {
            id: user._id || user.id,
            name: user.name,
            email: user.email,
            plan: user.plan || 'free',
            expDate: user.expDate || null
        }
        let token = await jwt.sign(obj, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        return token;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getUser(token){
    try{
        let user = await jwt.verify(token , process.env.JWT_SECRET_KEY);
        return user;
    }catch(err){
        console.log(err);
        return null;
    }
}

export { setuser , getUser }