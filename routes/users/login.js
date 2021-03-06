const express = require("express");
const app = express();
const User = require("../../models/User");
const bcrypt = require("bcrypt");
var createError = require('http-errors')

app.post("/login", (req,res, next)=> {
    User.findOne({
        username: req.body.username
    })
    .then((user)=> {
        if(!user) {
            res.redirect("/users/login?error=incorrect+credentials");
        } else {
            bcrypt.compare(req.body.password, user.password, function(err, match) {
                if(err){
                    console.log("Error", err);
                } else if(match) {
                    req.session.user = user;
                    if(req.query.redirectUrl) res.redirect(req.query.redirectUrl);
                    else res.redirect("/");
                    
                } else {
                    res.redirect("/users/login?error=incorrect+credentials");
                }
            });
        }
    })
    .catch((err)=> {
        next(createError(500, "Oeps, we have a problem. Please come back later."));
    })
})

app.get("/login", (req,res)=> {
    if(req.query.error) {
        res.render("users/login", {
            message: req.query.error, 
            error: true,
            redirectUrl: req.query.redirectUrl
        });
    } else {
        res.render("users/login", { redirectUrl: req.query.redirectUrl});
    }
})

module.exports = app;