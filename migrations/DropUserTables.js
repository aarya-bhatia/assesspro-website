require('../config/db.config').connect()

const { dropCollections } = require('../config/db.config')
const { } = require('../models')


require('mongoose').connection.once('open', async () => {
    await dropCollections(['userassessments', 'usermodules', 'userscores', 'useranswers', 'usercarts'])
    console.log('done')
})