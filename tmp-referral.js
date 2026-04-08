const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb+srv://renukagite23_db_user:aoOcWnlknqeLMwgM@cluster0.d2pbmvq.mongodb.net/elearning?ssl=true&replicaSet=atlas-tsrxir-shard-0&authSource=admin&retryWrites=true&w=majority');
  
  const schema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.models.User || mongoose.model('User', schema, 'users');
  const Payment = mongoose.models.Payment || mongoose.model('Payment', schema, 'payments');
  const Batch = mongoose.models.Batch || mongoose.model('Batch', schema, 'batches');

  const users = await User.find({ referredBy: { $ne: null } });
  console.log("Users with referredBy:", users.map(u => ({ email: u.email, referredBy: u.referredBy, reward: u.referralReward, name: u.name })));

  const referrers = await User.find({ walletBalance: { $gt: 0 } });
  console.log("Referrers with walletBalance > 0:", referrers.map(u => ({ email: u.email, wallet: u.walletBalance, referralCode: u.referralCode })));

  const myUsers = await User.find().sort({createdAt: -1}).limit(5);
  console.log("Most recent 5 users:", myUsers.map(u => ({ email: u.email, referredBy: u.referredBy, referralCode: u.referralCode })));

  const payments = await Payment.find().sort({createdAt: -1}).limit(3);
  console.log("Recent Payments studentIds:", payments.map(p => ({ studentId: p.studentId, course: p.courseId })));
  
  const batches = await Batch.find().sort({createdAt: -1}).limit(3);
  console.log("Recent Batches students:", batches.map(b => ({ students: b.students })));

  mongoose.disconnect();
}
check();
