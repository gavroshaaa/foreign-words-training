const words = [
    { word: "летать", translation: "fly", example: "I'm afraid to fly." },
    { word: "больница", translation: "hospital", example: "We urgently need to go to the hospital." },
    { word: "чайник", translation: "kettle", example: "The kettle is boiling, please turn it off." },
    { word: "улица", translation: "street", example: "Do you know what street he lives on?" },
    { word: "велосипед", translation: "bicycle", example: "I don't know how to ride a bicycle." },
    { word: "счастье", translation: "happiness", example: "Children are happiness!" },
    { word: "зеленый", translation: "green", example: "Help me find a green shirt." },
];

const flipCard = document.querySelector(".flip-card");
const btnNext = document.querySelector('#next');
const btnBack = document.querySelector('#back');
const btnExam = document.querySelector('#exam');
const examCards = document.querySelector('#exam-cards');
const btnShuffleWords = document.querySelector('#shuffle-words');
const time = document.querySelector('#time');
const currentWord = document.querySelector('#current-word');
const wordsProgress = document.querySelector('#words-progress');
const examProgress = document.querySelector('#exam-progress');
const correctPercent = document.querySelector('#correct-percent');

let index = 0;


function makeCard({ word, translation, example }) {
    flipCard.querySelector("#card-front h1").textContent = word;
    flipCard.querySelector("#card-back h1").textContent = translation;
    flipCard.querySelector("#card-back p span").textContent = example;
};

function renderCard(arr) {
    arr.forEach((item) => {
        makeCard(item);
    })
};

renderCard(words);
document.querySelector('#total-word').textContent = words.length;

flipCard.addEventListener('click', () => {
    flipCard.classList.toggle('active');
});

btnShuffleWords.addEventListener('click', () => {
    renderCard(words.sort(() => Math.random() - 0.5))
});

function showProgress() {
    wordsProgress.value = index * (100 / (words.length - 1));
    currentWord.textContent = index + 1;
    makeCard(words[index]);
}

function showProgressTest() {
    examProgress.value = correctPairs * (100 / (words.length));
    correctPercent.textContent = `${Math.round(examProgress.value)}%`;
}

btnNext.addEventListener('click', () => {
    index = ++index;
    btnBack.disabled = false;
    if (index === words.length - 1) {
        btnNext.disabled = true;
    }
    showProgress();
});

btnBack.addEventListener('click', () => {
    index = --index;
    if (index === 0) {
        btnBack.disabled = true;
    }
    if (index < words.length - 1) {
        btnNext.disabled = false;
    }
    showProgress();
});
let selectedCards = [];
let correctPairs = 0;
let totalPairs = words.length;

function makeExamCard(elem) {
    const item = document.createElement("div");
    item.classList.add('card');
    item.textContent = elem;

    item.addEventListener('click', function() {

        const card = document.querySelectorAll('.card');
        card.forEach(i => {
            i.classList.remove('correct');
            i.classList.remove('wrong');
        });
        selectedCards.push(item);

        if (selectedCards.length === 1) {
            item.classList.add('correct');
        } else if (selectedCards.length === 2) {

            const choosenWord = words.find(words => words.translation === selectedCards[0].textContent || words.word === selectedCards[0].textContent);
            if (selectedCards[0] === selectedCards[1]) {
                selectedCards.forEach((i) => {
                    i.classList.add("wrong");
                });
                setTimeout(() => {
                    selectedCards[1].classList.remove("wrong");
                    selectedCards = [];
                }, 1000);
            } else if (choosenWord.translation === selectedCards[1].innerHTML || choosenWord.word === selectedCards[1].innerHTML) {
                selectedCards.forEach((i) => {
                    i.classList.add("correct");
                    i.classList.add("fade-out");
                    i.style.pointerEvents = "none";
                    selectedCards = [];
                });
                correctPairs = correctPairs + 1;
                if (correctPairs === totalPairs) {
                    setTimeout(() => finishPlay("Молодец, отличная работа!"), 500);

                }
            } else {
                selectedCards[1].classList.add("wrong");
                setTimeout(() => {
                    selectedCards[1].classList.remove("wrong");
                    selectedCards.forEach((i) => i.classList.remove("active"));
                    selectedCards = [];
                }, 1000);
            }
            showProgressTest()
        }
    });
    return item;
}

function addCard() {
    const fragment = new DocumentFragment();
    const newArray = [];
    words.forEach((item) => {
        newArray.push(makeExamCard(item.translation));
        newArray.push(makeExamCard(item.word));
    });
    fragment.append(...newArray.sort(() => Math.random() - 0.5));
    examCards.innerHTML = "";
    examCards.append(fragment);
};

const timer = document.querySelector("#time");
const timeArray = timer.textContent.split(':');

let minutes = +timeArray[0];
let seconds = +timeArray[1];

let timerId;

let isRunning = false;

btnExam.addEventListener('click', function() {
    document.querySelector('.study-cards').classList.add('hidden');
    document.querySelector('#study-mode').classList.add('hidden');
    document.querySelector('#exam-mode').classList.remove('hidden');
    addCard();
    if (!isRunning) {
        seconds = 0;
        minutes = 0;
        timerId = setInterval(() => {
            seconds++;
            if (seconds > 59) {
                seconds = 0;
                minutes++;
            }
            timer.textContent = `${format(minutes)}:${format(seconds)}`
        }, 1000)
        isRunning = true;
    }
});

function format(val) {
    if (val < 10) {
        return (`0${val}`)
    }
    return val;
}


function stopTimer() {
    isRunning = false;
    clearInterval(timerId);
}

function finishPlay(info) {
    clearInterval(timerId);
    alert(`${info}     Твое время: ${timer.textContent}`);
    isRunning = false;
}