const express = require('express')

const router = express.Router()
const mongoose = require('mongoose')

const API_KEY = "6dO7s8SMGlTU21r9gVPznkueHQR3AWtfycFNxmJhIEwXYaKBjZ94POzj8ZxSlRdqiWcuINfrQ6oAVbn7";
const fast2sms = require('fast-two-sms')

const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

router.use(session({
    secret: "My secret 123",
    resave: false,
    saveUninitialized: false,
}))

router.use(passport.initialize());
router.use(passport.session());

const driverSchema = new mongoose.Schema({
    fullname: {
        type: String,
    },
    email: {
        type: String,
        // unique: true,
    },
    phone: {
        type: String,
    },
    age: {
        type: String,
    },
    truckNumber: {
        type: String,
    },
    truckCapacity: {
        type: Number,
    },
    transporterName: {
        type: String,
    },
    drivingExperience: {
        type: String
    },
    password: {
        type: String,
    },
    toFirst_state: {
        type: String,
    },
    toFirst_city: {
        type: String,
    },
    toSecond_state: {
        type: String,
    },
    toSecond_city: {
        type: String,
    },
    toThird_state: {
        type: String,
    },
    toThird_city: {
        type: String,
    },
    fromFirst_state: {
        type: String,
    },
    fromFirst_city: {
        type: String,
    },
    fromSecond_state: {
        type: String,
    },
    fromSecond_city: {
        type: String,
    },
    fromThird_state: {
        type: String,
    },
    fromThird_city: {
        type: String,
    },

    bookingStatus:
    {
        type: String,
    },
    bookedBy:
    {
        type: String,
    }
})

driverSchema.plugin(passportLocalMongoose)

const Driver = new mongoose.model('Driver', driverSchema);


passport.use(Driver.createStrategy());

passport.serializeUser(Driver.serializeUser());
passport.deserializeUser(Driver.deserializeUser());

router.get("/driver_register", function (req, res) {
    res.render("../views/driver/register_driver_account.ejs")
})



global.my_id = "";


router.post('/driver_register', function (req, res) {
    Driver.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/driver_register")
        }
        else {
            my_id = user._id.toString();
            res.render("../views/driver/driver_details.ejs")
        }
    })
})






router.post("/driver_details", function (req, res) {
    try {
        Driver.findOne({ _id: my_id }, (err, user) => {
            if (!user) {
                console.log("ID not Found")
            }

            else {
                const fullname = req.body.username;
                const age = req.body.age;
                const phone = req.body.phonenumber;
                const truckNumber = req.body.truck_number;
                const truckCapacity = req.body.truck_capacity;
                const transporterName = req.body.transporter_name;
                const drivingExperience = req.body.driving_experience;
                const toFirst_state = req.body.to_first_state;
                const toFirst_city = req.body.to_first_city;
                const toSecond_state = req.body.to_second_state;
                const toSecond_city = req.body.to_second_city;
                const toThird_state = req.body.to_third_state;
                const toThird_city = req.body.to_third_city;

                const fromFirst_state = req.body.from_first_state;
                const fromFirst_city = req.body.from_first_city;
                const fromSecond_state = req.body.from_second_state;
                const fromSecond_city = req.body.from_second_city;
                const fromThird_state = req.body.from_third_state;
                const fromThird_city = req.body.from_third_city;


                try {

                    Driver.findOneAndUpdate({
                        _id: my_id,
                    },
                        {
                            fullname: fullname,
                            age: age,
                            phone: phone,
                            truckNumber: truckNumber,
                            truckCapacity: truckCapacity,
                            transporterName: transporterName,
                            drivingExperience: drivingExperience,
                            toFirst_state: toFirst_state,
                            toFirst_city: toFirst_city,
                            toSecond_state: toSecond_state,
                            toSecond_city: toSecond_city,
                            toThird_state: toThird_state,
                            toThird_city: toThird_city,
                            fromFirst_state: fromFirst_state,
                            fromFirst_city: fromFirst_city,
                            fromSecond_state: fromSecond_state,
                            fromSecond_city: fromSecond_city,
                            fromThird_state: fromThird_state,
                            fromThird_city: fromThird_city,
                            bookingStatus: "Not Booked",
                            bookedBy: ""

                        },
                        function (err, results) {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                res.redirect('/driver_login');
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

router.get('/driver_login', function (req, res) {
    res.render("../views/driver/driver_login.ejs");
})

router.get("/login_otp_driver", function (req, res) {
    res.render("../views/driver/driver_login_otp.ejs");
})

var a = Math.floor(100000 + Math.random() * 900000);
a = String(a);
a = a.substring(0, 4);

global.my_phone = '';
global.my_otp = '';
router.post('/driver_login_otp', async function (req, res) {
    my_phone = req.body.Phone;
    my_otp = a;
    const response = await fast2sms.sendMessage({ authorization: API_KEY, message: a, numbers: [req.body.Phone] })
    // res.send(response);
})

global.my_otp_id = '';




router.post("/driver_login", function (req, res) {
    const user = new Driver({
        username: req.body.username,
        password: req.body.password,
    })

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        }
        else {

            console.log(user.username);

            try {
                Driver.findOne({ username: user.username }, (err, user) => {
                    if (!user) {
                        console.log("user not Found")
                    }
                    else {
                        if (user) {
                            my_id = user._id.toString();
                        }
                    }
                })
            } catch (err) {
                console.log(err);
            }
            passport.authenticate("local")(req, res, function () {
                res.redirect("/driver_user")
            })
        }
    })
})

router.post('/driver_login_otp_final', function (req, res) {
    const otp = req.body.otp;
    console.log(my_phone)
    console.log(my_otp);
    console.log(otp)
    if (otp == a) {
        try {
            Driver.findOne({ phone: my_phone }, (err, user) => {
                if (!user) {
                    console.log("Phone not Found")
                }
                else {
                    if (user) {
                        my_id = user._id.toString();
                        res.redirect("/driver_user")
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

router.get("/driver_user", function (req, res) {
    try {
        Driver.findOne({ _id: my_id }, (err, user) => {
            if (!user) {
                console.log("ID not Found")
            }
            else {
                if (user) {
                    console.log(user)
                    if (req.isAuthenticated()) {
                        res.render("../views/driver/driver_user.ejs", { users: user })
                    }
                    else {
                        res.redirect('/driver_login');
                    }
                }
            }
        })
    } catch (err) {
        console.log(err);
    }

})

global.my_id2 = ''


router.get("/driver_edit_profiles/:id", function (req, res) {
    const id = req.params.id;
    my_id2 = id.toString();
    console.log(my_id)
    try {
        Driver.findOne({ _id: id }, (err, user) => {
            if (!user) {
                console.log("ID not Found")
            }
            else {
                if (user) {
                    res.render("../views/driver/driver_profile_edit.ejs", { users: user })
                }
            }
        })
    } catch (err) {
        console.log(err);
    }
})


router.post("/driver_profile_edit", function (req, res) {

    const fullname = req.body.fullname;
    const age = req.body.page;
    const phone = req.body.pmobile;
    const truckNumber = req.body.pTruckNumber;
    const truckCapacity = req.body.pTruckCapacity;
    const transporterName = req.body.pTransporterName;
    const drivingExperience = req.body.pDrivingExperience;
 

    try {

        Driver.findOneAndUpdate({
            _id: my_id2,
        },
            {
                fullname: fullname,
                age: age,
                phone: phone,
                truckNumber: truckNumber,
                truckCapacity: truckCapacity,
                transporterName: transporterName,
                drivingExperience: drivingExperience,
                bookingStatus: "Not Booked",
                bookedBy: "",

            },
            function (err, results) {
                if (err) {
                    console.log(err)
                }
                else {

                    res.redirect("/driver_profile")
                }
            }
        )

    } catch (err) {
        console.log(err);
    }

})


//profile part
router.get('/driver_profile', function (req, res) {

    try {
        Driver.findOne({ _id: my_id }, (err, user) => {
            if (!user) {
                console.log("ID not Found")
            }
            else {
                if (user) {
                    res.render('../views/driver/driver_profile.ejs', { users: user })
                }
            }
        })
    } catch (err) {
        console.log(err);
    }

})

router.get("/driver_logout", function (req, res) {
    req.logout();
    res.redirect("/")
})





module.exports = { router, Driver }