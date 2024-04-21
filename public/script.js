// DOMが読み込まれた後に実行されるイベントリスナー
document.addEventListener('DOMContentLoaded', () => {
    const questionContainer = document.getElementById('question');
    const choiceContainer = document.getElementById('choice');
    const scoreContainer = document.getElementById('score');


    // 問題番号、スコア、クイズデータの格納
    let currentQuestion = 0;
    let score = 0;
    let quizData = [];

// クイズデータの取得と表示関数
    const loadQuiz = async () => {
        try {
            const response = await fetch('/get-quiz');
            const data = await response.json();
            quizData = data.results;
            displayQuestion();
        } catch (error) {
            console.log('クイズデータの取得に失敗しました', error);
        }
    };

    // 問題の表示関数
    const displayQuestion = () => {
        const question = quizData[currentQuestion];
        questionContainer.textContent = question.question;
        choiceContainer.innerHTML = '';
        // const choices = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);
        // choices.forEach(choice => {
        //     const button = createElement('button');
        //     button.innerHTML = decodeURIComponent(window.atob(choice));
        //     button.addEventListener('click', () => selectAnswer(choice, question.correct_answer));

        //     choiceContainer.appendChild(button);
        // });
        question.incorrect_answers.concat(question.correct_answer).forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.addEventListener('click', () => selectAnswer(answer, question.correct_answer));

            choiceContainer.appendChild(button);
        });
    };

    // 回答選択関数
    const selectAnswer = (selectAnswer, correctAnswer) => {
        if(selectAnswer === correctAnswer) {
            score++;
            alert(`${currentQuestion +1}問目、正解です`);
        } else  {
            alert(`${currentQuestion +1}問目、不正解です`);
        }
        showNextQuestion();
    }

    // 次の問題表示、最後の場合はクイズ終了関数
    function showNextQuestion() {
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            displayQuestion();
        } else {
            alert(`your score ${score}/${quizData.length}    一問目に戻ります`);
            currentQuestion = 0;
            loadQuiz();
        }
    }
    loadQuiz();



});
