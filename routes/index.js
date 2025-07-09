var express = require('express');
var router = express.Router();
const userModel = require('../routes/user');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('../routes/multer');
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', (req, res) => res.render('landing'));

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

router.get('/profile', isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ username: req.session.passport.user });
    if (!user) return res.status(404).send('User not found');
    res.render('profile', { user });
});

router.get('/post-equipment-form', isLoggedIn, (req, res) => {
    res.render('post-equipment');
});

router.post('/post-form', isLoggedIn, upload.single('image'), async (req, res) => {
    try {
        const username = req.session.passport.user;
        const user = await userModel.findOne({ username });

        if (!user) return res.status(404).json({ error: 'User not found' });

        const {
            owner,
            machineName,
            machineType,
            rent,
            location,
            status,
            rating
        } = req.body;

        const image = req.file ? req.file.filename : "default.jpg";

        user.rented.push({
            owner,
            machineName,
            machineType,
            rent: Number(rent),
            location,
            status,
            rating: Number(rating),
            image
        });

        await user.save();

        res.redirect('/home');
    } catch (err) {
        console.error("❌ Error while posting equipment:", err.message);
        res.status(500).send('Server Error while posting equipment');
    }
});

router.post("/editProfile", isLoggedIn, async (req, res) => {
    const { username, email, phone, location, farmSize, experience, specialization } = req.body;
    const specializationArray = specialization ? specialization.split(",").map(s => s.trim()) : [];

    const user = await userModel.findOne({ username: req.session.passport.user });
    user.username = username;
    user.email = email;
    user.bio = {
        ...user.bio,
        phone,
        location,
        farmSize,
        experience,
        specialization: specializationArray
    };

    await user.save();
    res.redirect("/profile");
});

router.get('/home', isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ username: req.session.passport.user });
    res.render('home', { user });
});

router.get('/equipment/:id', isLoggedIn, async (req, res) => {
    try {
        const allUsers = await userModel.find({});
        let equipment = null;
        let owner = null;

        for (const user of allUsers) {
            const found = user.rented.id(req.params.id);
            if (found) {
                equipment = found;
                owner = user;
                break;
            }
        }

        if (!equipment || !owner) return res.status(404).send("Equipment not found");

        const currentUser = req.session.passport.user;
        res.render('equipment-details', { equipment, owner, currentUser });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.get('/cart', isLoggedIn, async (req, res) => {
    try {
        const currentUser = await userModel.findOne({ username: req.session.passport.user });
        const allUsers = await userModel.find({});

        const rentedEquipment = [];

        for (const item of currentUser.rented_items || []) {
            for (const user of allUsers) {
                const equipment = user.rented.id(item.equipmentId);
                if (equipment) {
                    rentedEquipment.push({
                        ...equipment._doc,
                        owner: user.username
                    });
                    break;
                }
            }
        }
console.log("Rented Equipment:", rentedEquipment);
        res.render('cart', { rented_items: rentedEquipment });
    } catch (err) {
        console.error("❌ Error loading cart:", err);
        res.status(500).send("Server Error");
    }
});



router.post('/rent/:id', isLoggedIn, async (req, res) => {
    try {
        const currentUsername = req.session.passport.user;
        const currentUser = await userModel.findOne({ username: currentUsername });

        const allUsers = await userModel.find({});
        let equipmentToRent = null;

        for (const user of allUsers) {
            const found = user.rented.id(req.params.id);
            if (found) {
                equipmentToRent = found;
                break;
            }
        }

        if (!equipmentToRent) return res.status(404).send('Equipment not found');

        if (equipmentToRent.owner === currentUsername) {
            return res.status(400).send("You can't rent your own equipment");
        }

        currentUser.rented_items = currentUser.rented_items || [];
        currentUser.rented_items.push(equipmentToRent);

        await currentUser.save();
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/renting', isLoggedIn, async (req, res) => {
    try {
        const allUsers = await userModel.find({});
        const currentUser = req.session.passport.user;

        const equipment = [];

        allUsers.forEach(user => {
            user.rented.forEach(machine => {
                equipment.push({
                    ...machine._doc,
                    isOwn: user.username === currentUser
                });
            });
        });

        res.render('renting', { equipment, currentUser });
    } catch (err) {
        console.error("Error fetching equipment:", err);
        res.status(500).send("Server Error");
    }
});

router.get('/cropinfo', isLoggedIn, (req, res) => res.render('cropinfo'));
router.get('/schemes', isLoggedIn, (req, res) => res.render('schemes'));
router.get('/market', isLoggedIn, (req, res) => res.render('marketdata'));
router.get('/workers', isLoggedIn, (req, res) => res.render('workers'));

router.post('/register', (req, res) => {
    const UserData = new userModel({
        username: req.body.username,
        email: req.body.email,
    });
    userModel.register(UserData, req.body.password)
        .then(() => passport.authenticate('local')(req, res, () => res.redirect('/profile')));
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
}));

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

module.exports = router;