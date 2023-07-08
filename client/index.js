// const port = 3000                   //TODO <-- HOW TO SET THIS WHEN DEPLOYED TO HEROKU?
const baseUrl = "https://skribbl-words.herokuapp.com"  //TODO <-- HOW TO SET THIS WHEN DEPLOYED TO HEROKU?

const inputWord = document.getElementById("inputWord")
const submitFinalButton = document.getElementById("submitFinalButton")
const submitButton = document.getElementById("submitButton")
const cancelSubmitButton = document.getElementById('cancelSubmitButton')
const copyClipboardButton = document.getElementById("copyButton")
const fetchButton = document.getElementById( "fetchButton")
const submitModal = document.getElementById('submitModal')
const inputName = document.getElementById('inputName')
inputWord.addEventListener("keyup", ({key}) => { if (key === "Enter") validateWordInput(); });
inputName.addEventListener("input", () => validateNameInput());
submitFinalButton.addEventListener("click", submitWords);
submitFinalButton.addEventListener("click", hideSubmitModal);
copyClipboardButton.addEventListener("click", copyWordsToClipboard);
fetchButton.addEventListener("click", fetchAllWords);
submitButton.addEventListener("click", showSubmitModal);
cancelSubmitButton.addEventListener("click", hideSubmitModal);

async function validateWordInput() {
    const enteredWord = inputWord.value;
    const currentWords = Array.from(document.querySelectorAll('ul li'));
    const re = new RegExp("^[a-zA-Z\\s]{2,}$");

    if (!re.test(enteredWord)) {
        console.log(`Regex mismatch: ${enteredWord}`)
        addWordToList(enteredWord, 'red');
    } else if (currentWords.find((li) => (li.textContent.toLowerCase() === enteredWord.toLowerCase())))
    {
        console.log(`Duplicate word: ${enteredWord}`)
        addWordToList(enteredWord, 'red');
    } else
    {
        await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${enteredWord}`).then(() => {
            addWordToList(enteredWord, 'black');
        }).catch(() => {
            console.log(`Not found in dictionary: ${enteredWord}`)
            addWordToList(enteredWord, 'orange');
        });
    }

    submitButton.disabled = false;
    inputWord.value = "";
}

function validateNameInput()
{
    console.log(inputName.value)
    const re = new RegExp("^[a-zA-Z0-9 ]{2,}$");
    submitFinalButton.disabled = !re.test(inputName.value);
}

function addWordToList(word, color) {
    const trash = document.createElement('i');
    trash.classList.add('fa', 'fa-trash', 'w3-margin-right');
    trash.addEventListener('click', removeWordFromList);

    const newWord = document.createElement('li');
    newWord.innerText = word;
    newWord.classList.add(`w3-text-${color}`);

    document.querySelector('ul').appendChild(newWord).prepend(trash);
}

function removeWordFromList() {
    this.closest("li").remove();
}

function submitWords() {
    document.querySelectorAll('ul > li').forEach((i) => {
        axios.post(`${baseUrl}/word`, {
            word: i.innerText,
            name: inputName.value
        }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    })
    document.querySelector('ul').innerHTML = '';
    submitButton.disabled = true;
}

function showSubmitModal() {
    submitModal.style.display='block';
    axios.get(`${baseUrl}/names`)
        .then((response) => populateNamesList(response))
        .catch((error) => console.log(error))
}

function hideSubmitModal() {
    submitModal.style.display='none';
}

function populateNamesList(response) {
    const namesList = document.getElementById('names')
    namesList.innerHTML = "";
    response.data.forEach((d) => {
        const nameOption = document.createElement('option');
        nameOption.value = d.name;
        namesList.appendChild(nameOption);
    });
}

function displayAllWords(response) {
    document.querySelector('.allWordsHeader').innerText = `${response.data.length} words`;
    document.querySelector('.allWords').innerText = '';
    response.data.forEach((d) => {
        document.querySelector('.allWords').innerText += d.word + ',';
    });
}

function fetchAllWords() {
    axios.get(`${baseUrl}/words`)
        .then((response) => {displayAllWords(response)})
        .catch((error) => {console.log(error)})

    copyClipboardButton.disabled = false;
}

function copyWordsToClipboard() {
    navigator.clipboard.writeText("");
    const text = document.querySelector('.allWords').innerText;
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Words copied to clipboard');
            alert('Words copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy to clipboard: ', err);
            alert('Failed to copy to clipboard');
        });
    }
    else {
        console.log('Nothing to copy to clipboard')
        alert('Nothing to copy to clipboard');
    }
}