const express = require('express');
const { lessonValidationSchema } = require('../schemas/lesson')
const { getLessons } = require('../services/lessonService');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { error } = lessonValidationSchema.validate(req.query, { abortEarly: false })

        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({ errors: errorMessages });
        }

        const lessons = await getLessons(req.query);
        res.json(lessons);
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error)
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

