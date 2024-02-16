const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();

async function sendEmail(subject, message) {

    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'anonymj0001@gmail.com', // Your email id
            pass: 'vihbuwsbekmmbxou' // Your password
        }
    });

    await new Promise((resolve, reject) => {
        // verify connection configuration
        mail.verify(function (error, success) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });
    
    
    

    var mailOptions = {
        from: 'anonymj0001@gmail.com',
        to: "njeriaisha2@gmail.com",
        subject: subject,
        html: message
    };
    await new Promise((resolve, reject) => {
        // send mail
        mail.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log(0)
            }
        });
    });
    
}

router.get('/', function(req, res, next) {
    res.render("index");
});

router.get('/fitness', function(req, res, next) {
    res.render("fit");
});

router.get('/mindfulness', function(req, res, next) {
    res.render("mind");
});

/*router.get("/lifestream", (req, res, next) => {
    res.render("lifestream");
});*/
router.get('/gymwear', function(req, res, next) {
    res.render("wear");
});

router.get('/contact', function(req, res, next) {
    res.render("contacts");
});

router.get("/signin", (req, res, next) => {
    res.render("login");
});
router.get("/signup", (req, res, next) => {
    res.render("register");
});
router.get("/signout", (req, res, next) => {
    req.session.destroy(function () {
        console.log("Bye");
    });
    res.redirect("/");
});


router.post('/contact', function (req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;
    if (!name && !email && !message) {
        res.status(500);
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify({
            code: "error",
            message: "Name email or message is missing",
        }));
        res.end();
    } else {
		sendEmail(name + ' sent a message', "<dl><dt><b>Sender's Name</b></dt><dd>"+name+"</dd><br><dt><b>Sender's Email</b></dt><dd>"+email+"</dd><br><dt><b>Message</b></dt><dd>"+message+"</dd></dl>");

        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify({
            code: "200",
            message: "Message sent",
        }));
        res.end();
	}
});

router.post('/login', function (request, response, next) {

    var user_email_address = request.body.user_email_address;

    var user_password = request.body.user_password;

    if (user_email_address && user_password) {
        var query = `
        SELECT * FROM user_login 
        WHERE user_email = "${user_email_address}"
        `;

        database.query(query, function (error, data) {

            if (data.length > 0) {
                for (var count = 0; count < data.length; count++) {
                    if (data[count].user_password == user_password) {
                        console.log(request.session)
                        request.session.user_name = data[count].user_name;
                        request.session.user_id = data[count].user_id;

                        response.redirect("/");
                    }
                    else {
                        // response.send('Incorrect Password');
                        response.render('login', { "error": true, "message": "Incorrect Password" });
                    }
                }
            }
            else {
                // response.send('Incorrect Email Address');
                response.render('login', { "error": true, "message": "Incorrect Email Address" });
            }

        });
    }
    else {
        // response.send('Please Enter Email Address and Password Details');
        response.render('login', { "error": true, "message": "Please Enter Email Address and Password Details" });
    }

});

module.exports = router;