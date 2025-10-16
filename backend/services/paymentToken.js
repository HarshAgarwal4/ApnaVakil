import { setuser, getUser } from "./auth.js";

async function updateToken(oldToken , res) {
    try {
        let user = await getUser(oldToken);
        console.log(user)
        if (!user) return null;
        let newUser = {...user , plan: 'Basic' , expDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) };
        console.log('new user is' , newUser);
        let newToken = await setuser(newUser);
        res.cookie('UID', newToken, {
            httpOnly: false,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return newToken;
    } catch (err) {
        console.log(err);
        return null;
    }
}


export { updateToken }