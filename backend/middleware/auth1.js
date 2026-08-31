import { getUser } from "../services/auth.js";
import userModel from "../App/Users/models/user.js";
import { redis } from "../services/redis.js";

// Define public & unrestricted paths
const publicPaths = [
  '/',
  '/register',
  '/fgtpwd',
  '/sendotp',
  '/login',
  '/logout',
  '/contact',
  '/fetchLawyer',
  '/askLawyer'
];

const unrestrictedPaths = [
  '/payment',
  '/verifyPayment',
  '/me',
  '/logout',
  '/fetchHistory',
  '/getPayments',
  '/savePayment',
  '/fetchDrafts',
  '/format',
  '/fetchLawyer',
  '/askLawyer',
  '/user-connections',
  '/lawyer-me',
  '/lawyer-update-profile',
  '/lawyer-requests',
  '/lawyer-request-status',
  '/direct-chat/conversations'
];

async function authAndPayment(req, res, next) {
  try {
    // Check for public paths (exact or parameter routes like /lawyer/:id)
    if (publicPaths.includes(req.path) || req.path.startsWith('/lawyer/')) {
      return next();
    }

    const token = req.cookies?.UID;
    if (!token)
      return res.send({ status: 15, msg: "Unauthorized access - No token" });

    const user = await getUser(token);
    if (!user)
      return res.send({ status: 16, msg: "Invalid or expired token" });

    let redisUsers = (await redis.get(`user:${user.id}`)) || null;
    let dbUser = null;

    if (redisUsers) {
      dbUser = redisUsers;
    } else {
      dbUser = await userModel.findById(user.id).lean();
      if (dbUser) {
        await redis.set(`user:${user.id}`, dbUser);
      }
    }
    if (!dbUser)
      return res.send({ status: 17, msg: "User not found in database" });

    if (token !== dbUser.refreshToken)
      return res.send({ status: 18, msg: "Unauthorized - Multiple devices" });

    req.user = dbUser;

    // Unrestricted endpoints for logged in users (or lawyer panel routes)
    if (
      unrestrictedPaths.includes(req.path) ||
      req.path.startsWith('/lawyer') ||
      req.path.startsWith('/direct-chat') ||
      dbUser.role === 'lawyer' ||
      dbUser.role === 'admin'
    ) {
      return next();
    }

    // ----- Payment / Subscription check for regular client user features -----
    const now = Date.now();
    const expDate = new Date(dbUser.expDate).getTime();

    if (!expDate || dbUser.plan === 'free')
      return res.send({ status: 19, msg: "No active subscription found" });

    if (now > expDate) {
      dbUser.plan = 'free';
      dbUser.expDate = null;
      await userModel.findByIdAndUpdate(
        dbUser._id,
        {
          $set: dbUser
        },
        { new: true }
      );
      await redis.set(`user:${user.id}`, dbUser);
      return res.send({
        status: 20,
        msg: "Subscription expired. Please renew to continue."
      });
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