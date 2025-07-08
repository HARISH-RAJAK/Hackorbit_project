const mongoose = require('mongoose');
const express = require('express');
const plm = require('passport-local-mongoose');
const dotenv = require('dotenv').config();
mongoose.connect(process.env.Mongo_string, {
  "dbname": "farm-connect"
}).then(() => {
  console.log("connected to database")
}).catch((err) => {
  console.log("error in connecting to database", err)
});
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  bio: {
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    farmSize: { type: String, default: "" },
    experience: { type: String, default: "" },
    specialization: [{ type: String }],
    memberSince: { type: String, default: "" },
    profileImage: { type: String, default: "default.jpg" },
    hobbies: [{ type: String }],
    website: { type: String },
    bioNote: { type: String, default: "" }
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }]
});
userSchema.plugin(plm);
module.exports = mongoose.model('user', userSchema);