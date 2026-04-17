const developerSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  score: { type: Number, default: 0 },
  commits: { type: Number, default: 0 },

  prCount: { type: Number, default: 0 }   // 🔥 NEW
});