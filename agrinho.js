// script.js
const board = document.getElementById("board");
const questionText = document.getElementById("question");
const optionsDiv = document.getElementById("options");
const turnSpan = document.getElementById("turn");
const playerScoreSpan = document.getElementById("playerScore");
const computerScoreSpan = document.getElementById("computerScore");
const startBtn = document.getElementById("startBtn");
const playerAvatar = document.getElementById("player");
const computerAvatar = document.getElementById("computer");

let currentPlayer = "player";
let playerScore = 0;
let computerScore = 0;
let playerPosition = 0;
let computerPosition = 0;

const questions = [
    {
        question: "Qual produto do campo é essencial para fazer o pão consumido nas cidades?",
        options: ["Trigo", "Milho", "Arroz", "Soja"],
        answer: "Trigo"
    },
    {
        question: "Qual é uma das formas mais comuns de escoar a produção rural até a cidade?",
        options: ["Transporte ferroviário", "Aviões comerciais", "Transporte rodoviário", "Barcos de turismo"],
        answer: "Transporte rodoviário"
    },
    {
        question: "Qual dessas ações ajuda a fortalecer a conexão entre campo e cidade?",
        options: ["Comprar alimentos de produtores locais", "Evitar produtos naturais", "Usar só produtos importados", "Consumir apenas alimentos industrializados"],
        answer: "Comprar alimentos de produtores locais"
    },
    {
        question: "As feiras livres nas cidades são importantes porque:",
        options: ["Oferecem produtos do campo frescos e acessíveis", "Vendemos apenas eletrônicos", "São locais para shows", "Só vendem roupas importadas"],
        answer: "Oferecem produtos do campo frescos e acessíveis"
    },
    {
        question: "O que o campo fornece principalmente para a cidade?",
        options: ["Tecnologia de satélite", "Serviços de internet", "Alimentos e matérias-primas", "Produtos eletrônicos"],
        answer: "Alimentos e matérias-primas"
    }
];

function createBoard() {
    for (let i = 0; i < 20; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.id = `tile${i}`;
        tile.textContent = i + 1;
        board.appendChild(tile);
    }
}

function moveAvatar(avatar, position) {
    const tile = document.getElementById(`tile${position}`);
    if (tile) {
        const rect = tile.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();
        avatar.style.left = (rect.left - boardRect.left + 10) + "px";
        avatar.style.top = (rect.top - boardRect.top - 40) + "px";
    }
}

function showQuestion() {
    const question = questions[Math.floor(Math.random() * questions.length)];
    questionText.textContent = question.question;
    optionsDiv.innerHTML = "";
    question.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => checkAnswer(option, question);
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(selected, question) {
    const correct = selected === question.answer;
    if (currentPlayer === "player") {
        if (correct) {
            playerScore += 10;
            playerPosition++;
        }
        currentPlayer = "computer";
    } else {
        if (selected === question.answer) {
            computerScore += 10;
            computerPosition++;
        }
        currentPlayer = "player";
    }
    updateGame();
}

function computerTurn() {
    const question = questions[Math.floor(Math.random() * questions.length)];
    const randomOption = question.options[Math.floor(Math.random() * question.options.length)];
    checkAnswer(randomOption, question);
}

function updateGame() {
    playerScoreSpan.textContent = playerScore;
    computerScoreSpan.textContent = computerScore;
    moveAvatar(playerAvatar, playerPosition);
    moveAvatar(computerAvatar, computerPosition);
    turnSpan.textContent = currentPlayer === "player" ? "Você" : "Computador";

    if (playerPosition >= 19) {
        questionText.textContent = "Parabéns! Você venceu!";
        optionsDiv.innerHTML = "";
        return;
    } else if (computerPosition >= 19) {
        questionText.textContent = "O computador venceu. Tente novamente!";
        optionsDiv.innerHTML = "";
        return;
    }

    if (currentPlayer === "player") {
        showQuestion();
    } else {
        setTimeout(computerTurn, 2000);
    }
}

startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    updateGame();
});

createBoard();
moveAvatar(playerAvatar, playerPosition);
moveAvatar(computerAvatar, computerPosition);
