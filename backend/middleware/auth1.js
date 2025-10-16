import { getUser } from "../services/auth.js";
import userModel from "../App/models/user.js"

// Define public & unrestricted paths
const publicPaths = ['/', '/register', '/fgtpwd', '/sendotp', '/login' , '/logout' , '/contact'];
const unrestrictedPaths = [
  '/payment', '/verifyPayment', '/me', '/logout',
  '/fetchHistory', '/getPayments', '/savePayment'
];

async function authAndPayment(req, res, next) {
  try {
    // Skip authentication for public routes
    if (publicPaths.includes(req.path)) return next();

    // Get token from cookies
    const token = req.cookies?.UID;
    if (!token)
      return res.send({ status: 15, msg: "Unauthorized access - No token" });

    // Decode and validate user
    const user = await getUser(token);
    if (!user)
      return res.send({ status: 16, msg: "Invalid or expired token" });

    // Fetch actual user from DB
    const dbUser = await userModel.findById(user.id);
    if (!dbUser)
      return res.send({ status: 17, msg: "User not found in database" });

    //console.log(token ,'\n', dbUser.refreshToken,'\n', token === dbUser.refreshToken);

    // Enforce one-device login
    if (token !== dbUser.refreshToken)
      return res.send({ status: 18, msg: "Unauthorized - Multiple devices" });

    req.user = dbUser;

    // Skip payment check for unrestricted or public routes
    if (unrestrictedPaths.includes(req.path)) return next();

    // ----- Payment / Subscription check -----
    const now = Date.now();
    const expDate = new Date(dbUser.expDate).getTime();

    if (!expDate || dbUser.plan === 'free')
      return res.send({ status: 19, msg: "No active subscription found" });

    if (now > expDate){
        dbUser.plan = 'free'
        dbUser.expDate = null
        await dbUser.save()
        return res.send({ status: 20, msg: "Subscription expired. Please renew to continue." });
    }

    if (dbUser.plan === 'Basic' || dbUser.plan === 'Premium')
      return next();

    return res.send({ status: 21, msg: "Invalid subscription plan" });

  } catch (err) {
    console.error("Auth Error:", err);
    return res.send({ status: 22, msg: "Error during authentication" });
  }
}

export { authAndPayment };