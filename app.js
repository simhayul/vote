const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite');

// EJS 설정
app.set('view engine', 'ejs');

// 정적 파일 경로 설정
app.use(express.static(path.join(__dirname, 'public')));

// 요청 파라미터 파싱
app.use(express.urlencoded({ extended: true }));

// 데이터베이스 테이블 생성
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            options TEXT NOT NULL,
            votes TEXT NOT NULL
        )
    `);
});

// 라우트 설정
app.get('/', (req, res) => {
    db.all('SELECT * FROM topics', (err, rows) => {
        if (err) return res.status(500).send('Database Error');
        res.render('index', { topics: rows });
    });
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', (req, res) => {
    const { title, description, options } = req.body;
    const optionsArray = Array.isArray(options) ? options : [options];
    const votesArray = optionsArray.map(() => 0);
    const optionsString = JSON.stringify(optionsArray);
    const votesString = JSON.stringify(votesArray);

    db.run(
        'INSERT INTO topics (title, description, options, votes) VALUES (?, ?, ?, ?)',
        [title, description, optionsString, votesString],
        (err) => {
            if (err) return res.status(500).send('Database Error');
            res.redirect('/');
        }
    );
});

app.get('/topic/:id', (req, res) => {
    const topicId = req.params.id;

    db.get('SELECT * FROM topics WHERE id = ?', [topicId], (err, row) => {
        if (err) return res.status(500).send('Database Error');
        if (!row) return res.status(404).send('Topic Not Found');

        const options = JSON.parse(row.options);
        const votes = JSON.parse(row.votes);
        res.render('topic', { topic: row, options, votes });
    });
});

app.post('/topic/:id/vote', (req, res) => {
    const topicId = req.params.id;
    const { optionIndex } = req.body;

    db.get('SELECT * FROM topics WHERE id = ?', [topicId], (err, row) => {
        if (err) return res.status(500).send('Database Error');
        if (!row) return res.status(404).send('Topic Not Found');

        const options = JSON.parse(row.options);
        const votes = JSON.parse(row.votes);
        votes[optionIndex] += 1;

        db.run(
            'UPDATE topics SET votes = ? WHERE id = ?',
            [JSON.stringify(votes), topicId],
            (err) => {
                if (err) return res.status(500).send('Database Error');
                res.redirect(`/topic/${topicId}`);
            }
        );
    });
});

// 서버 시작
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
