const Joi = require('joi');

const dateSchema = Joi.string().custom((value, helpers) => {
    const dates = value.split(',');
    if (dates.length > 2) {
        return helpers.error('date.format');
    }
    for (const date of dates) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return helpers.error('date.format');
        }
        const [year, month, day] = date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        if (dateObj.getFullYear() !== year || dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day) {
            return helpers.error('date.invalid');
        }
    }
    return value;
}, 'Date validation');

const lessonValidationSchema = Joi.object({
    date: dateSchema.messages({
        'date.format': 'Дата должна быть в формате YYYY-MM-DD или YYYY-MM-DD,YYYY-MM-DD',
        'date.invalid': 'Указана некорректная дата'
    }),
    status: Joi.number().valid(0, 1).messages({
        'number.base': 'Статус должен быть числом',
        'any.only': 'Статус должен быть 0 или 1'
    }),
    teacherIds: Joi.string().pattern(/^\d+(,\d+)*$/).messages({
        'string.pattern.base': 'ID учителей должны быть числами, разделенными запятыми'
    }),
    studentsCount: Joi.alternatives().try(
        Joi.number().integer().min(0),
        Joi.string().pattern(/^\d+,\d+$/)
    ).messages({
        'number.base': 'Количество студентов должно быть числом',
        'number.integer': 'Количество студентов должно быть целым числом',
        'number.min': 'Количество студентов не может быть отрицательным',
        'string.pattern.base': 'Диапазон количества студентов должен быть в формате число,число'
    }),
    page: Joi.number().integer().min(1).messages({
        'number.base': 'Номер страницы должен быть числом',
        'number.integer': 'Номер страницы должен быть целым числом',
        'number.min': 'Номер страницы должен быть больше или равен 1'
    }),
    lessonsPerPage: Joi.number().integer().min(1).messages({
        'number.base': 'Количество уроков на странице должно быть числом',
        'number.integer': 'Количество уроков на странице должно быть целым числом',
        'number.min': 'Количество уроков на странице должно быть больше или равно 1'
    })
});

module.exports = { lessonValidationSchema }