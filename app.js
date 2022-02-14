//jshint esversion:6
const express = require('express');
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true,
}));


//connection to mongoose
const mongoURL = "mongodb://localhost:27017/DealerOderDB"

const connectDB = () => {
    try {
        mongoose.connect(mongoURL, { useNewUrlParser: true, autoIndex: false }, () => {
            console.log("Connected to the Mongo Database");
        })
    } catch (err) {
        console.log(err);
    }
}

connectDB();



app.get('/', function (req, res) {
    res.render('home');
})


const dealer = require("./routes/dealer")

app.use(dealer.router)

const driver = require("./routes/driver");
const { use } = require('passport');

app.use(driver.router)


global.my_city = '';
global.my_state = '';
global.my_booking_id = '';

app.get('/dealer_city/:id', function (req, res) {
    const id = req.params.id;
    try {
        dealer.User.findOne({ _id: id }, (err, user) => {
            if (!user) {
                console.log("ID not Found")
            }
            else {
                if (user) {
                    my_city = user.city;
                    my_state = user.state;
                    my_booking_id = id;
                    res.render("./dealer/dealer_city_details", { users: user })
                    console.log(my_city)
                    console.log(my_state)
                }
            }
        })
    } catch (err) {
        console.log(err);
    }
})

//if city = pune and state is maharashtra
//driver with toFirst == pune or to

app.get('/get_status', function (req, res) {
    driver.Driver.find({
        $or: [{ "toFirst_city": my_city }, { "toSecond_city": my_city }, { "toThird_city": my_city }],
        $or: [{ "fromFirst_city": my_city }, { "fromSecond_city": my_city }, { "fromThird_city": my_city }],
    }, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(results)
            res.render('./dealer/have_status.ejs', { users: results });
        }
    })
})


app.get("/book/:id", function (req, res) {
    const id = req.params.id;
    try {

        driver.Driver.findOneAndUpdate({
            _id: id,
        },
            {
                bookingStatus: "Booked",
                bookedBy: my_booking_id,

            },
            function (err, results) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.redirect("/get_status")
                }
            }
        )

    } catch (err) {
        console.log(err);
    }
})

app.get('/driver_check_my_bookings/:id', function (req, res) {
    console.log(my_booking_id)
    dealer.User.findOne({ _id: my_booking_id }, (err, user1) => {
        if (!user1) {
            console.log("ID not Found")
        }
        else {

            console.log(user1)
            res.render('./driver/driver_booking.ejs', { users: user1 })

        }
    })

})


app.listen(3000, function (req, res) {
    console.log("Successfully started at port 3000");
})