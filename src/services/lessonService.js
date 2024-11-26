const db = require('../config/database');

async function getLessons(filters) {
    let query = db('lessons')
        .select('lessons.*')
        .count('lesson_students.student_id as studentsCount')
        .leftJoin('lesson_students', 'lessons.id', 'lesson_students.lesson_id')
        .groupBy('lessons.id');

    if (filters.date) {
        const dates = filters.date.split(',');
        if (dates.length === 1) {
            query = query.where('lessons.date', dates[0]);
        } else if (dates.length === 2) {
            const [startDate, endDate] = dates.sort();
            query = query.whereBetween('lessons.date', [startDate, endDate]);
        }
    }

    if (filters.status) {
        query = query.where('lessons.status', Number(filters.status));
    }

    if (filters.teacherIds) {
        const teacherIds = filters.teacherIds.split(',').map(Number);
        query = query.whereIn('lessons.id', function() {
            this.select('lesson_id').from('lesson_teachers').whereIn('teacher_id', teacherIds);
        });
    }

    if (filters.studentsCount) {
        const counts = filters.studentsCount.split(',').map(Number);
        if (counts.length === 1) {
            query = query.havingRaw('COUNT(lesson_students.student_id) = ?', [counts[0]]);
        } else if (counts.length === 2) {
            const [minCount, maxCount] = counts.sort((a, b) => a - b);
            query = query.havingRaw('COUNT(lesson_students.student_id) BETWEEN ? AND ?', [minCount, maxCount]);
        }
    }

    const page = Number(filters.page) || 1;
    const lessonsPerPage = Number(filters.lessonsPerPage) || 5;
    const offset = (page - 1) * lessonsPerPage;

    query = query.offset(offset).limit(lessonsPerPage);

        const lessons = await query;

        const lessonsWithDetails = await Promise.all(lessons.map(async (lesson) => {
            const teachers = await db('teachers')
                .select('teachers.*')
                .join('lesson_teachers', 'teachers.id', 'lesson_teachers.teacher_id')
                .where('lesson_teachers.lesson_id', lesson.id);

            const students = await db('students')
                .select('students.*', 'lesson_students.visit')
                .join('lesson_students', 'students.id', 'lesson_students.student_id')
                .where('lesson_students.lesson_id', lesson.id);

            const visitCount = students.filter(student => student.visit).length;

            return {
                ...lesson,
                teachers,
                students,
                visitCount
            };
        }));

        return lessonsWithDetails;
}

module.exports = { getLessons };

