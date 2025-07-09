This project is developed by Team Code Thrust in Hackorbit Hackathon. In domain Open Innovation to help farmers connect with each other.
It allows them to rent nearby farming equipment, access market data, and stay updated with government schemes.

# 🚜 FarmConnect - Equipment Rental Platform

**FarmConnect** is a web-based platform that allows farmers to list and rent agricultural equipment.
The goal is to promote sustainable farming by enabling easy access to tools and machines needed for 
various agricultural tasks.

## 🌐 Live Preview


## 📁 Project Structure

```
FarmConnect/
│
├── routes/
│   └── index.js            # Main backend routes
│   └── multer.js           # Image upload configuration
│   └── user.js             # Mongoose user schema
│
├── views/
│   ├── renting.ejs         # Equipment listing page
│   ├── post-equipment.ejs  # Post new machine form
│   ├── profile.ejs         # User profile
│   ├── cart.ejs            # User's rented equipment
│   ├── equipment-details.ejs # Equipment detail and rent page
│
├── public/
│   └── images/uploads/     # Uploaded images
│
├── app.js / server.js      # Main express app
└── README.md               # You're reading this!
```

---

## 💠 Tech Stack

- **Frontend:** HTML, EJS, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Auth:** Passport.js (Local Strategy)
- **File Uploads:** Multer

---

## 👤 User Features

- ✅ Register & Login securely
- ✅ View and edit profile
- ✅ Post equipment for rent
- ✅ See equipment from other users
- ✅ View full equipment and owner details
- ✅ Rent equipment from other users
- ❌ Cannot rent your own equipment
- ✅ Track rented equipment in profile (`rented_items`)
- ✅ View your rented equipment in **Cart** page

---

## 📦 Install & Run

### Clone the repository:

```bash
git clone https://github.com/HARISH-RAJAK/FarmConnect.git
cd FarmConnect
```

### Install dependencies:

```bash
npm install
```

### Environment variables (`.env`):

```env
MONGO_URL=mongodb://localhost:27017/farmconnect
SESSION_SECRET=yourSuperSecretKey
```

### Run the app:

```bash
node app.js
```

---

## 🧪 Sample User Model

```js
{
  username: String,
  email: String,
  password: String,
  bio: {
    phone: String,
    location: String,
    farmSize: String,
    experience: String,
    specialization: [String]
  },
  rented: [  // Your posted machines
    {
      machineName: String,
      machineType: String,
      rent: Number,
      location: String,
      status: String,
      rating: Number,
      image: String
    }
  ],
  rented_items: [ // Machines you rented from others
    {
      equipmentId: String  // Only the ID is stored
    }
  ]
}
```

---

## 📸 Screenshots

### 🔍 Browse Equipment
List of all available machines with filters.

### 📋 Post Equipment
Form to post your machine.

### 🧑‍🌾 Profile Page
Shows your info, your listings, and rented items.

### 🛒 Cart Page
Displays all equipment you have rented from others.

---

## 🙏 Credits

Made with ❤️ by Team **Code Thrust** and team at MITS Gwalior

> AI & Robotics Department · Code Thrust Group

---

## 📜 License
this project is made by Team Code Thrust from scratch to the help of farmers 
