const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
const dotenv = require('dotenv');
dotenv.config();


mongoose.connect(process.env.Mongo_string)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });


const userSchema = new mongoose.Schema({
  fullname: String,
  password: String,
  email: String,
  bio: {
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    farmSize: { type: String, default: "" },
    experience: { type: String, default: "" },
    specialization: [String],
    memberSince: { type: String, default: "" },
    profileImage: { type: String, default: "default.jpg" },
    hobbies: [String],
    website: { type: String },
    bioNote: { type: String, default: "" }
  },

  rented: [
    {
      owner: String,
      machineName: String,
      machineType: String,
      rent: Number,
      location: String,
      status: { type: String, enum: ["available", "booked"], default: "available" },
      rating: { type: Number, default: 0 },
      image: String
    }
  ],
  rented_items: [
    {
      equipmentId: String
    }
  ],


  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }]
});


userSchema.plugin(plm);


module.exports = mongoose.model('user', userSchema);
