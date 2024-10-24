const words = [
    { word: "летать", translation: "fly", example: "I'm afraid to fly." },
    { word: "больница", translation: "hospital", example: "We urgently need to go to the hospital." },
    { word: "чайник", translation: "kettle", example: "The kettle is boiling, please turn it off." },
    { word: "улица", translation: "street", example: "Do you know what street he lives on?" },
    { word: "велосипед", translation: "bicycle", example: "I don't know how to ride a bicycle." },
    { word: "счастье", translation: "happiness", example: "Children are happiness!" },
    { word: "зеленый", translation: "green", example: "Help me find a green shirt." },
    { word: "лестница", translation: "staircase", example: "Carefully go down the staircase." },
    { word: "ножницы", translation: "scissors", example: "I made a snowflake using scissors and paper." },
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
    makeCard(words[Math.floor(Math.random() * words.length)]);
});

function showProgress() {
    wordsProgress.value = index * (100 / (words.length - 1));
    currentWord.textContent = index + 1;
    makeCard(words[index]);
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

function makeExamCard(elem) {
    const item = document.createElement("div");
    item.classList.add('card');
    item.textContent = elem;
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

btnExam.addEventListener('click', function() {
    document.querySelector('.study-cards').classList.add('hidden');
    document.querySelector('#study-mode').classList.add('hidden');
    document.querySelector('#exam-mode').classList.remove('hidden');
    addCard();
});