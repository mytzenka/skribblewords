const mySubmitButton = document.querySelector(".submitButton")
mySubmitButton.addEventListener("click", submitWords);

async function validateInput() {
    const currentWords = Array.from(document.querySelectorAll('ul li'));
    // const totalCorrect = document.querySelector('.quiz-total-correct');
    if (currentWords.find((li) => (li.textContent.toLowerCase() === myInput.value.toLowerCase()))) {
        addWordToList(myInput.value, 'red');
    } else {
        await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${myInput.value}`).then(resp => {
            addWordToList(myInput.value, 'black');
        }).catch(() => {
            addWordToList(myInput.value, 'orange');
        });
    }

    mySubmitButton.disabled = false;
    myInput.value = "";
}

function addWordToList(word, color) {
    const trash = document.createElement('i');
    trash.classList.add('fa', 'fa-trash', 'w3-margin-right');
    trash.addEventListener('click', removeWord);

    const newWord = document.createElement('li');
    newWord.innerText = word.toLowerCase();
    newWord.classList.add(`w3-text-${color}`);

    document.querySelector('ul').appendChild(newWord).prepend(trash);
}

const myInput = document.querySelector(".inputWord")
const myWord = document.querySelector('ul li')
myInput.addEventListener("keyup", ({key}) => {
    if (key === "Enter") validateInput();
});



function removeWord() {
    this.closest("li").remove();
}

function submitWords() {
    document.querySelectorAll('ul > li').forEach((i) => {
        axios.post('http://localhost:3000/word', {
            word: i.innerText.toLowerCase(),
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    })
    document.querySelector('ul').innerHTML = '';
    mySubmitButton.disabled = true;
}

function displayAllWords(response) {
    document.querySelector('.allWordsHeader').innerText = `${response.data.length} words`;
    document.querySelector('.allWords').innerText = '';
    response.data.forEach((d) => {
        document.querySelector('.allWords').innerText += d.word + ',';
    });
}

document.querySelector(".copyButton").addEventListener("click", copyWordsToClipboard);
function copyWordsToClipboard() {
    const text = document.querySelector('.allWords').innerText;
    if (text) {
        navigator.clipboard.writeText(text);
        console.log('Words copied to clipboard');
        alert('Copied to clipboard');
    }
    else {
        alert('Nothing to copy');
    }

}

document.querySelector(".fetchButton").addEventListener("click", fetchAllWords);
function fetchAllWords() {
    axios.get('http://localhost:3000/words')
        .then((response) => {displayAllWords(response)})
        .catch((error) => {console.log(error)})
}
