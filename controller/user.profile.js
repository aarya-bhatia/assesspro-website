const qualificationKeys = require('../resources/json/qualification.keys.json')
const statesList = require('../resources/json/india.states.json')
const { getFormDays, getFormMonths, getFormYears } = require('./util');
const UserProfile = require("../models/UserProfile.js");

/* update user profile */
module.exports.updateUserProfile = (req, res, next) => {
    // console.log('Form submitted! ', req.body);

    const user = req.user;

    /* update name, email and bio */
    ['name', 'email', 'bio'].map(key => {
        if (req.body[key]) {
            user[key] = req.body[key]
        }
    });

    /* update address information */
    ['city', 'state', 'zip'].map(key => {
        if (req.body[key]) {
            user.address[key] = req.body[key]
        }
    });

    /* update date of birth information */
    ['day', 'month', 'year'].map(key => {
        if (req.body[key]) {
            user.dob[key] = req.body[key]
        }
    });

    /* update status */
    user.status = (req.body.status === "on") ? "public" : "private"

    /* update qualifications */
    qualificationKeys.map(element => {
        const { key, subjectKey, institutionKey } = element;

        if (req.body[subjectKey]) {
            user.qualifications[key].subject = req.body[subjectKey];
        }
        if (req.body[institutionKey]) {
            user.qualifications[key].institution = req.body[institutionKey];
        }
    })

    /* update user in db */
    UserProfile.findById({ _id: user._id }).then((profile) => {
        Object.assign(profile, user);
        profile.save().then((newProfile) => {

            /* authenticate user */
            req.logIn(newProfile, (err) => {
                if (!err) {
                    console.log("updated user", req.user);
                    res.redirect("/users/profile");
                }
            });
        });
    }).catch(err => next(err))
}

module.exports.getProfileUpdateForm = (req, res) => {
    res.render("profile/update", {
        loggedIn: true,
        user: req.user,
        qualificationKeys,
        states: statesList,
        months: getFormMonths(),
        days: getFormDays(),
        years: getFormYears(),
    });
}

module.exports.getUserProfile = (req, res) => {
    res.render("profile/profile", { loggedIn: true, user: req.user });
}