require('../config/db.config').connect()

const { Assessment } = require('../models')

require('mongoose').connection.once('open', async () => {
    const doc = await Assessment.updateMany(
        {
            key: {
                $nin: [
                    'NEST',
                    'CPT'
                ]
            }
        },
        {
            public: false
        }
    );

    console.log(doc)
})