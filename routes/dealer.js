const express = require('express')

const router = express.Router()
const mongoose = require('mongoose')

const API_KEY = "6dO7s8SMGlTU21r9gVPznkueHQR3AWtfycFNxmJhIEwXYaKBjZ94POzj8ZxSlRdqiWcuINfrQ6oAVbn7";
const fast2sms = require('fast-two-sms')


const bcrypt = require('bcrypt')
const saltRounds = 10;


router.use(express.static("public"));


const dealerSchema = new mongoose.Schema({
    fullname: {
        type: String,
    },
    username: {
        type: String,
        // unique: true,
    },
    phone: {
        type: String,
    },
    natureOfMaterial: {
        type: String,
    },
    weightOfMaterial: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    city: {
        type: String,
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    password: {
        type: String
    },
    cpassword: {
        type: String,
    }
})



const User = new mongoose.model('User', dealerSchema);



router.get("/dealer_register", function (req, res) {
    res.render("../views/dealer/register_account.ejs")
})




global.my_id = "";

router.post('/dealer_register', function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            username: req.body.username,
            password: hash,
        })
        newUser.save(function (err) {
            if (err) {
                console.log(err);
                res.redirect("/dealer_register")
            }
            else {
                my_id = newUser._id.toString();
                console.log(newUser._id.toString());
                res.render("../views/dealer/register_details.ejs")
            }
        })
    })

})


router.post("/dealer_details", function (req, res) {
    console.log(my_id)
    try {
        User.findOne({ _id: my_id }, (err, user) => {
            if (!user) {
                console.log("ID not Found")
            }

            else {
                const fullname = req.body.username;
                const phone = req.body.phonenumber;
                const natureOfMaterial = req.body.nature;
                const weightOfMaterial = req.body.weight;
                const quantity = req.body.quantity;
                const country = req.body.country;
                const state = req.body.state;
                const city = req.body.city;

                console.log(fullname)
                console.log(phone)
                console.log(natureOfMaterial)
                console.log(weightOfMaterial)
                console.log(quantity)
                console.log(country)
                console.log(state)
                console.log(city)

                try {
                    console.log(my_id)
                    User.findOneAndUpdate({
                        _id: my_id,
                    },
                        {
                            fullname: fullname,
                            phone: phone,
                            natureOfMaterial: natureOfMaterial,
                            weightOfMaterial: weightOfMaterial,
                            quantity: quantity,
                            country: country,
                            state: state,
                            city: city,
                        },
                        function (err, results) {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log(results)
                                res.redirect('/dealer_login');
                            }
                        }
                    )

                } catch (err) {
                    console.log(err);
                }
            }

        })
    } catch (err) {
        console.log(err);
    }
})

router.get('/dealer_login', function (req, res) {
    res.render("../views/dealer/dealer_login.ejs");
})

router.get("/login_otp", function (req, res) {
    res.render("../views/dealer/delaer_login_otp.ejs");
})

var a = Math.floor(100000 + Math.random() * 900000);
a = String(a);
a = a.substring(0, 4);

global.my_phone = '';
global.my_otp = '';
router.post('/dealer_login_otp', async function (req, res) {
    my_phone = req.body.Phone;
    my_otp = a;
    const response = await fast2sms.sendMessage({ authorization: API_KEY, message: a, numbers: [req.body.Phone] })
    // res.send(response);
})

global.my_otp_id = '';

router.post('/dealer_login_otp_final', function (req, res) {
    const otp = req.body.otp;
    console.log(my_phone)
    console.log(my_otp);
    console.log(otp)
    if (otp == a) {
        try {
            User.findOne({ phone: my_phone }, (err, user) => {
                if (!user) {
                    console.log("Phone not Found")
                }
                else {
                    if (user) {
                        my_id = user._id.toString();
                        res.redirect("/dealer_user")
                    }
                }

            })
        } catch (err) {
            console.log(err);
        }
    }
    else {
        res.send("Sorry you entered wrong otp")
    }
})

router.get("/dealer_user", function (req, res) {
    try {
        User.findOne({ _id: my_id }, (err, user) => {
            if (!user) {
                console.log("ID not Found")
            }
            else {
                if (user) {
                    res.render("../views/dealer/dealer_user.ejs", { users: user })
                }
            }
        })
    } catch (err) {
        console.log(err);
    }
})


router.post("/dealer_login", function (req, res) {
    const { username, password } = req.body;
    try {
        User.findOne({ username: username }, (err, user) => {
            if (!user) {
                console.log("Email not Found")
            }
            else {
                if (user) {
                    bcrypt.compare(password, user.password, function (err, reslt) {
                        if (reslt == true) {
                            my_id = user._id.toString();
                            res.redirect("/dealer_user")
                        }
                    })

                }
            }

        })
    } catch (err) {
        console.log(err);
    }
})

router.get('/dealer_profile', function (req, res) {
    try {
        User.findOne({ _id: my_id }, (err, user) => {
            if (!user) {
                console.log("ID not Found")
            }
            else {
                if (user) {
                    res.render('../views/dealer/dealer_user_profile.ejs', { users: user })
                }
            }
        })
    } catch (err) {
        console.log(err);
    }
})

global.my_id2 = ''
global.my_city = '';
global.my_state = '';

router.get("/edit_profiles/:id", function (req, res) {
    const id = req.params.id;
    my_id2 = id.toString();
    console.log(my_id2)
    try {
        User.findOne({ _id: id }, (err, user) => {
            if (!user) {
                console.log("ID not Found")
            }
            else {
                if (user) {
                    res.render("../views/dealer/dealer_user_edit.ejs", { users: user })
                }
            }
        })
    } catch (err) {
        console.log(err);
    }
})

router.post("/dealer_profile_edit", function (req, res) {

    const fullname = req.body.fullname;
    const phone = req.body.dmobile;
    const natureOfMaterial = req.body.dnamture;
    const weightOfMaterial = req.body.dweight;
    const quantity = req.body.dquantity;
    const country = req.body.dcountry;
    const state = req.body.dstate;
    const city = req.body.dcity;


    try {

        User.findOneAndUpdate({
            _id: my_id2,
        },
            {
                fullname: fullname,
                phone: phone,
                natureOfMaterial: natureOfMaterial,
                weightOfMaterial: weightOfMaterial,
                quantity: quantity,
                country: country,
                state: state,
                city: city,
            },
            function (err, results) {
                if (err) {
                    console.log(err)
                }
                else {
                    my_city = city;
                    my_state = state;
                    res.redirect("/dealer_profile")
                }
            }
        )

    } catch (err) {
        console.log(err);
    }

})


router.get("/dealer_logout", function (req, res) {
    res.redirect("/")
})

module.exports = { router, User };