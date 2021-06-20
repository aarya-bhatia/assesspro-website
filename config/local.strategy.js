const { Strategy } = require('passport-local')
const { UserProfile } = require('../models')
const bcrypt = require('bcrypt')

module.exports = new Strategy(
    async function (username, password, done) {
        try {
            const user = await UserProfile.findOne({ username })

            if (!user) {
                return done(null, false, { message: 'Incorrect username' })
            }

            const result = await bcrypt.compare(password, user.password)

            if (!result) {
                return done(null, false, { message: 'Incorrect password' })
            }
            else {
                return done(null, user)
            }
        }
        catch (err) {
            done(err)
        }
    }
)