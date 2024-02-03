let wordsForTest = [];
let randomizedWords = [];
let currentIndex = 0;
let spokenWords = new Set();
let currentUtterance = null;

// Load words from local storage on page load
window.onload = function () {
    randomizedWords = getWordsFromLocalStorage();
};

function startOralTest() {
    const wordInput = document.getElementById('wordInput');
    const startButton = document.getElementById('startButton');
    const displayedWordElement = document.getElementById('displayedWord');

    wordsForTest = wordInput.value.trim().split(/\s+/);

    if (wordsForTest.length > 0) {
        if (currentIndex >= randomizedWords.length) {
            currentIndex = 0;
            spokenWords.clear();
            randomizedWords = generateRandomOrder(wordsForTest);
            
            // Save randomizedWords to local storage
            localStorage.setItem('randomizedWords', JSON.stringify(randomizedWords));
        }

        if (currentUtterance) {
            speechSynthesis.cancel();
        }

        const currentWord = randomizedWords[currentIndex];
        const utterance = new SpeechSynthesisUtterance(currentWord);
        utterance.lang = 'en-US';

        currentUtterance = utterance;

        speechSynthesis.speak(utterance);

        displayedWordElement.textContent = currentWord;
        spokenWords.add(currentWord);
        currentIndex++;

        startButton.disabled = true;

        utterance.onend = function() {
            if (currentIndex < randomizedWords.length) {
                startButton.disabled = false;
            } else {
                alert('Oral test completed. Every word has been spoken.');
            }
        };
    } else {
        alert('Please enter words for the test.');
    }
}

function repeatWord() {
    if (currentUtterance) {
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(randomizedWords[currentIndex - 1]);
        utterance.lang = 'en-US';

        speechSynthesis.speak(utterance);
    }
}

function resetOralTest() {
    const startButton = document.getElementById('startButton');
    const displayedWordElement = document.getElementById('displayedWord');

    currentIndex = 0;
    spokenWords.clear();
    randomizedWords = generateRandomOrder(wordsForTest);

    if (currentUtterance) {
        speechSynthesis.cancel();
    }

    const currentWord = randomizedWords[currentIndex];
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = 'en-US';

    currentUtterance = utterance;

    speechSynthesis.speak(utterance);

    displayedWordElement.textContent = currentWord;
    spokenWords.add(currentWord);
    currentIndex++;

    startButton.disabled = true;

    utterance.onend = function() {
        if (currentIndex < randomizedWords.length) {
            startButton.disabled = false;
        } else {
            alert('Oral test completed. Every word has been spoken.');
        }
    };
}

function stopSpeech() {
    if (currentUtterance) {
        speechSynthesis.cancel();
        currentIndex = 0;
        spokenWords.clear();

        const startButton = document.getElementById('startButton');
        startButton.disabled = false;
    }
}

function generateRandomOrder(words) {
    const uniqueWords = Array.from(new Set(words));
    let randomOrder = [...uniqueWords];
    shuffleArray(randomOrder);
    return randomOrder;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to get words from local storage
function getWordsFromLocalStorage() {
    const storedWords = localStorage.getItem('randomizedWords');
    return storedWords ? JSON.parse(storedWords) : [];
    }
