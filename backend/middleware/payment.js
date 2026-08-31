const paths = [
  '/',
  '/register',
  '/fgtpwd',
  '/sendotp',
  '/login',
  '/payment',
  '/verifyPayment',
  '/me',
  '/logout',
  '/fetchHistory',
  '/getPayments',
  '/savePayment',
  '/fetchLawyer',
  '/askLawyer'
];

async function isPaid(req, res, next) {
  if (paths.includes(req.path) || req.path.startsWith('/lawyer')) return next();
  let user = req.user;
  if (!user) return res.send({ status: 8, msg: "Unauthorized access" });
  if (user.role === 'admin' || user.role === 'lawyer') return next();

  let date = new Date();
  let expDate = user?.expDate;
  if (!expDate) return res.send({ status: 12, msg: "No active subscription found" });
  if (date > new Date(expDate).getTime()) {
    return res.send({
      status: 11,
      msg: "Subscription expired. Please renew to continue."
    });
  }
  if (user.plan === 'Basic' || user.plan === 'Premium') return next();
  return res.send({ status: 19, msg: "No active subscription found" });
}

export { isPaid };