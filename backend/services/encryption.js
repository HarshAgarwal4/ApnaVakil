import bcrypt from 'bcryptjs'

async function hashPassword(password) {
    const saltRounds = 10;
    try{
        let hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    }
    catch(err){
        console.log(err)
        return null
    }
}

async function comparePassword(password, hashedPassword) {
    let isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch;
}

export { hashPassword, comparePassword }