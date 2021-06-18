const { Assessment } = require('../models');

const router = require('express').Router()

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const { key } = await Assessment.findById(id)

    res.render("assessments/" + key, {
        loggedId: true,
        assessment_id: id,
    });
})

module.exports = router