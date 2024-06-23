let selectedNumbers = [];
let gameCount = 1;
let currentGame = 0;
let allSelectedNumbers = [];
let drawCount = 1;
const selectSound = document.getElementById('selectSound');
const randomSound = document.getElementById('randomSound');
const correctSound = document.getElementById('correctSound');
const failureSound = document.getElementById('failureSound');
const quadraKillSound = document.getElementById('quadraKillSound');
const pentaKillSound = document.getElementById('pentaKillSound');
const crazySound = document.getElementById('crazySound');
const legendSound = document.getElementById('legendSound');

function playSelectSound() {
    selectSound.currentTime = 0;
    selectSound.volume = 0.8;
    selectSound.play().catch(error => console.error('Error playing select sound:', error));
}

function playRandomSound() {
    randomSound.currentTime = 0;
    randomSound.volume = 0.8;
    randomSound.loop = true;
    randomSound.play().catch(error => console.error('Error playing random sound:', error));
}

function stopRandomSound() {
    randomSound.pause();
    randomSound.currentTime = 0;
}

function playCorrectSound() {
    correctSound.currentTime = 0;
    correctSound.volume = 0.8;
    correctSound.play().catch(error => console.error('Error playing correct sound:', error));
}

function playFailureSound() {
    failureSound.currentTime = 0;
    failureSound.volume = 0.8;
    failureSound.play().catch(error => console.error('Error playing failure sound:', error));
}

function playQuadraKillSound() {
    quadraKillSound.currentTime = 0;
    quadraKillSound.volume = 0.8;
    quadraKillSound.play().catch(error => console.error('Error playing quadra kill sound:', error));
}

function playPentaKillSound() {
    pentaKillSound.currentTime = 0;
    pentaKillSound.volume = 0.8;
    pentaKillSound.play().catch(error => console.error('Error playing penta kill sound:', error));
}

function playCrazySound() {
    crazySound.currentTime = 0;
    crazySound.volume = 0.8;
    crazySound.play().catch(error => console.error('Error playing crazy sound:', error));
}

function playLegendSound() {
    legendSound.currentTime = 0;
    legendSound.volume = 0.8;
    legendSound.play().catch(error => console.error('Error playing legend sound:', error));
}

function setGameCount(count) {
    gameCount = count;
    document.getElementById('gameSelectionScreen').classList.add('hidden');
    document.getElementById('selectionScreen').classList.remove('hidden');
    document.getElementById('selectionInstruction').textContent = `게임 ${currentGame + 1} 숫자 6개 선택`;
}

function selectNumber(element) {
    const number = parseInt(element.textContent);
    
    if (selectedNumbers.includes(number)) {
        selectedNumbers = selectedNumbers.filter(n => n !== number);
        element.classList.remove('selected');
    } else {
        if (selectedNumbers.length < 6) {
            selectedNumbers.push(number);
            element.classList.add('selected');
            playSelectSound();
        } else {
            alert('6개의 숫자만 선택할 수 있습니다.');
        }
    }

    document.getElementById('selectedNumbers').textContent = '선택된 숫자: ' + selectedNumbers.join(', ');
}

function selectRandomNumbers() {
    const allNumbers = Array.from({ length: 15 }, (_, i) => i + 1);
    selectedNumbers = [];

    document.querySelectorAll('.number').forEach(el => el.classList.remove('selected'));

    while (selectedNumbers.length < 6) {
        const randomIndex = Math.floor(Math.random() * allNumbers.length);
        const randomNumber = allNumbers.splice(randomIndex, 1)[0];
        selectedNumbers.push(randomNumber);

        const numberElement = document.querySelector(`.number:nth-of-type(${randomNumber})`);
        if (numberElement) {
            numberElement.classList.add('selected');
        }
    }

    document.getElementById('selectedNumbers').textContent = '선택된 숫자: ' + selectedNumbers.join(', ');
    playSelectSound();
}

function submitNumbers() {
    if (selectedNumbers.length === 6) {
        allSelectedNumbers.push([...selectedNumbers]);
        selectedNumbers = [];
        currentGame++;

        if (currentGame < gameCount) {
            document.getElementById('selectionInstruction').textContent = `게임 ${currentGame + 1} 숫자 6개 선택`;
            document.querySelectorAll('.number').forEach(el => el.classList.remove('selected'));
            document.getElementById('selectedNumbers').textContent = '선택된 숫자: ';
        } else {
            document.getElementById('selectionScreen').classList.add('hidden');
            document.getElementById('resultScreen').classList.remove('hidden');
            document.getElementById('resultTitle').textContent = `${drawCount}회차 당첨결과`;
            drawCount++;
            displaySelectedNumbers();
            startRandomNumberGeneration();
        }
    } else {
        alert('6개의 숫자를 모두 선택해 주세요.');
    }
}

function displaySelectedNumbers() {
    const resultsDiv = document.getElementById('resultGames');
    resultsDiv.innerHTML = '';

    allSelectedNumbers.forEach((selectedNumbers, index) => {
        let gameResultHTML = `<div class="game-result"><h3>게임 ${index + 1}</h3>`;
        gameResultHTML += '<div class="selected-numbers">';

        selectedNumbers.forEach(num => {
            gameResultHTML += `<div class="user-number">${num}</div>`;
        });

        gameResultHTML += '</div></div>';
        resultsDiv.innerHTML += gameResultHTML;
    });
}

function startRandomNumberGeneration() {
    const randomNumbersDiv = document.getElementById('randomNumbers');
    randomNumbersDiv.innerHTML = '';

    const bonusNumberDiv = document.getElementById('bonusNumber');
    bonusNumberDiv.innerHTML = '';

    const randomNumbers = [];
    for (let i = 0; i < 6; i++) {
        const randomDiv = document.createElement('div');
        randomDiv.classList.add('random-number');
        randomDiv.textContent = '?';
        randomNumbersDiv.appendChild(randomDiv);
        randomNumbers.push(randomDiv);
    }

    const bonusDiv = document.createElement('div');
    bonusDiv.classList.add('bonus-number');
    bonusDiv.textContent = '?';
    bonusNumberDiv.appendChild(bonusDiv);

    let currentIndex = 0;
    const generatedNumbers = new Set();

    playRandomSound();

    function generateNumber() {
        if (currentIndex < randomNumbers.length) {
            let interval = setInterval(() => {
                let randomNumber;
                do {
                    randomNumber = Math.floor(Math.random() * 15) + 1;
                } while (generatedNumbers.has(randomNumber));
                randomNumbers[currentIndex].textContent = randomNumber;
            }, 100);

            setTimeout(() => {
                clearInterval(interval);
                const finalNumber = parseInt(randomNumbers[currentIndex].textContent);
                generatedNumbers.add(finalNumber);
                randomNumbers[currentIndex].classList.add('number-animate');
                highlightMatchingNumbers(finalNumber);
                currentIndex++;
                generateNumber();
            }, 1000);
        } else {
            generateBonusNumber();
        }
    }

    function generateBonusNumber() {
        let interval = setInterval(() => {
            let bonusNumber;
            do {
                bonusNumber = Math.floor(Math.random() * 15) + 1;
            } while (generatedNumbers.has(bonusNumber));
            bonusDiv.textContent = bonusNumber;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const finalBonusNumber = parseInt(bonusDiv.textContent);
            generatedNumbers.add(finalBonusNumber);
            bonusDiv.textContent = finalBonusNumber;
            bonusDiv.classList.add('number-animate');
            highlightBonusNumber(finalBonusNumber);
            stopRandomSound();
            checkMatches(finalBonusNumber);
        }, 1000);
    }

    generateNumber();
}

function highlightMatchingNumbers(number) {
    allSelectedNumbers.forEach((selectedNumbers, index) => {
        if (selectedNumbers.includes(number)) {
            const gameResultDiv = document.querySelectorAll('.game-result')[index];
            const numberDivs = gameResultDiv.querySelectorAll('.user-number');
            numberDivs.forEach(div => {
                if (parseInt(div.textContent) === number) {
                    div.classList.add('highlight');
                    playCorrectSound();
                }
            });
        }
    });
}

function highlightBonusNumber(bonusNumber) {
    allSelectedNumbers.forEach((selectedNumbers, index) => {
        if (selectedNumbers.includes(bonusNumber)) {
            const gameResultDiv = document.querySelectorAll('.game-result')[index];
            const numberDivs = gameResultDiv.querySelectorAll('.user-number');
            numberDivs.forEach(div => {
                if (parseInt(div.textContent) === bonusNumber) {
                    div.classList.add('bonus-highlight');
                }
            });
        }
    });
}

function checkMatches(finalBonusNumber) {
    const displayedNumbers = Array.from(document.getElementsByClassName('random-number')).map(div => parseInt(div.textContent));
    const resultsDiv = document.getElementById('resultGames');
    let overallResultText = '';

    allSelectedNumbers.forEach((selectedNumbers, index) => {
        const matchedNumbers = selectedNumbers.filter(number => displayedNumbers.includes(number));
        const bonusMatch = selectedNumbers.includes(finalBonusNumber);
        let matchResultText;
        let gameResultHTML = `<div class="game-result"><h3>게임 ${index + 1}</h3>`;
        gameResultHTML += '<div class="selected-numbers">';

        selectedNumbers.forEach(num => {
            let className = 'user-number';
            if (displayedNumbers.includes(num)) {
                className += ' highlight';
            }
            if (num === finalBonusNumber) {
                className += ' bonus-highlight';
            }
            gameResultHTML += `<div class="${className}">${num}</div>`;
        });

        gameResultHTML += '</div>';

        switch (matchedNumbers.length) {
            case 6:
                matchResultText = `1등 - 당첨번호 6개 숫자 일치!`;
                playLegendSound();
                break;
            case 5:
                if (bonusMatch) {
                    matchResultText = `2등 - 당첨번호 5개 숫자 일치 + 보너스 숫자 일치!`;
                    playCrazySound();
                } else {
                    matchResultText = `3등 - 당첨번호 5개 숫자 일치!`;
                    playPentaKillSound();
                }
                break;
            case 4:
                matchResultText = `4등 - 당첨번호 4개 숫자 일치!`;
                playQuadraKillSound();
                break;
            default:
                matchResultText = `꽝!`;
                playFailureSound();
                break;
        }

        gameResultHTML += `<p>${matchResultText}</p></div>`;
        overallResultText += gameResultHTML;
    });

    resultsDiv.innerHTML = overallResultText;
    document.querySelector('.retry-button').classList.remove('hidden');
}

function retry() {
    selectedNumbers = [];
    allSelectedNumbers = [];
    currentGame = 0;
    document.getElementById('selectedNumbers').textContent = '선택된 숫자: ';
    document.querySelectorAll('.number').forEach(el => el.classList.remove('selected'));
    document.getElementById('selectionScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.add('hidden');
    document.querySelector('.retry-button').classList.add('hidden');
    document.getElementById('gameSelectionScreen').classList.remove('hidden');
    document.getElementById('randomNumbers').innerHTML = '';
    document.getElementById('bonusNumber').innerHTML = '';
    document.getElementById('resultGames').innerHTML = '';
}

// 팝업 창을 여는 함수
function showInfo() {
    document.getElementById('infoPopup').classList.remove('hidden');
}

// 팝업 창을 닫는 함수
function closeInfo() {
    document.getElementById('infoPopup').classList.add('hidden');
}

// 직접 입력 팝업을 여는 함수
function showInputPopup() {
    document.getElementById('inputPopup').classList.remove('hidden');
}

// 직접 입력 팝업을 닫는 함수
function closeInputPopup() {
    document.getElementById('inputPopup').classList.add('hidden');
}

function submitInputNumbers() {
    const input = document.getElementById('numberInput').value;
    const numbers = input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num) && num >= 1 && num <= 15);
    
    if (numbers.length !== 6) {
        alert('6개의 유효한 숫자를 입력해야 합니다.');
        return;
    }

    selectedNumbers = numbers;

    document.querySelectorAll('.number').forEach(el => el.classList.remove('selected'));
    selectedNumbers.forEach(num => {
        const numberElement = document.querySelector(`.number:nth-of-type(${num})`);
        if (numberElement) {
            numberElement.classList.add('selected');
        }
    });

    document.getElementById('selectedNumbers').textContent = '선택된 숫자: ' + selectedNumbers.join(', ');
    closeInputPopup();
}
