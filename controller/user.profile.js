const qualificationKeys = require('../resources/json/qualification.keys.json')
const statesList = require('../resources/json/india.states.json')
const { formatTime, formatDateString, getFormDays, getFormMonths, getFormYears } = require('./util');
const { UserScore, UserProfile } = require('../models');

// Get profile update page
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

// Get signed in user's profile page
module.exports.getUserProfile = async (req, res) => {

    // Get assessment scores
    const userScores =
        await UserScore.find({ user_id: req.user._id })
            .sort('-date').exec()

    res.render("profile/profile", {
        loggedIn: true, user: req.user, userScores, formatTime, formatDateString
    });
}

// Upload profile picture
module.exports.uploadProfilePicture = async (req, res) => {
    UserProfile.findById(req.user._id)
        .then(found => {
            found.img_url = `/images/uploads/${req.file.filename}`
            found.save().then(user => {
                req.logIn(user, (err) => {
                    if (!err) {
                        res.redirect("/users/profile/update");
                    }
                });
            })
        })
}


/* update user profile */
module.exports.updateUserProfile = async (req, res) => {
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
    let profile = await UserProfile.findById({ _id: user._id })

    Object.assign(profile, user);
    const newProfile = await profile.save()

    /* authenticate user */
    req.logIn(newProfile, (err) => {
        if (!err) {
            console.log("updated user", req.user);
            res.redirect("/users/profile");
        }
    });
}
