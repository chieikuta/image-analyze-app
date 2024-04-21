const express = require('express');
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000;
    max: 100
})


// セキュリティ強化
app.use(helmet());
app.use(cors());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 静的ファイル
app.use(express.static('public'));

// クイズデータ取得
app.get('/get-quiz', async (req, res) => {
    try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10&encode=url3986&language=ja');
        const decodedData = response.data.results.map(quiz => {
            return {
                ...quiz,
                question: decodeURIComponent(quiz.question),
                correct_answer: decodeURIComponent(quiz.collect_answer),
                incorrent_answer: quiz.incorrent_answers.map(answer => {
                    decodeURIComponent(quiz.incorrent_answers)
                }) 
            }
        })
        res.json({ result: decodedData});
    } catch (error) {
        console.error('クイズデータを取得中にエラーが発生しました', error);
        res.status(500).send('クイズデータを取得中にエラーが発生しました')
    }
});

// エラーハンドリング
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('サーバーに問題が発生しました');
});


// サーバー起動
app.listen(port, () => {
    console.log(`server start port${port}`)
});
