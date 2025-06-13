document.addEventListener('DOMContentLoaded', () => {
    // --- Variáveis de Estado do Jogo ---
    let playerBoardPosition = 0; // Posição atual do jogador no tabuleiro (começa em 0)
    // Alterado para 14, pois o contador de casas começa em 0 (0 a 14 = 15 casas)
    const totalBoardSpaces = 14;
    let quizActive = false; // Flag para controlar se um quiz está ativo, evitando múltiplas interações

    // --- Perguntas do Quiz ---
    // Adicionei mais perguntas para ter um total de 15
    const questions = [
        {
            question: "Qual é a principal atividade econômica no campo?",
            options: ["Agricultura", "Indústria", "Serviços"],
            correctAnswer: "Agricultura"
        },
        {
            question: "Qual é o maior benefício da urbanização?",
            options: ["Acesso a serviços", "Tradições culturais", "Vida no campo"],
            correctAnswer: "Acesso a serviços"
        },
        {
            question: "Qual destes animais é comumente encontrado no campo?",
            options: ["Vaca", "Cachorro", "Gato"],
            correctAnswer: "Vaca"
        },
        {
            question: "O que é mais abundante em uma cidade grande?",
            options: ["Ar puro", "Prédios altos", "Espaços abertos"],
            correctAnswer: "Prédios altos"
        },
        {
            question: "Qual é a estação do ano em que as plantas florescem?",
            options: ["Inverno", "Outono", "Primavera"],
            correctAnswer: "Primavera"
        },
        {
            question: "Qual a função de um semáforo na cidade?",
            options: ["Decorar a rua", "Controlar o tráfego", "Indicar lojas"],
            correctAnswer: "Controlar o tráfego"
        },
        {
            question: "O que a pecuária produz?",
            options: ["Carros", "Alimentos e matérias-primas de origem animal", "Software"],
            correctAnswer: "Alimentos e matérias-primas de origem animal"
        },
        {
            question: "Um rio que atravessa uma cidade é um exemplo de elemento natural ou cultural?",
            options: ["Natural", "Cultural", "Artificial"],
            correctAnswer: "Natural"
        },
        {
            question: "Qual é a principal forma de transporte de grãos do campo para a cidade?",
            options: ["Avião", "Caminhão", "Bicicleta"],
            correctAnswer: "Caminhão"
        },
        {
            question: "O que as áreas rurais fornecem para as áreas urbanas?",
            options: ["Entretenimento", "Alimentos", "Trânsito"],
            correctAnswer: "Alimentos"
        },
        {
            question: "Qual o nome do fenômeno de crescimento das cidades?",
            options: ["Ruralização", "Urbanização", "Desertificação"],
            correctAnswer: "Urbanização"
        },
        {
            question: "Um celeiro é uma construção típica de qual ambiente?",
            options: ["Cidade", "Campo", "Praia"],
            correctAnswer: "Campo"
        },
        {
            question: "Qual destes é um desafio comum enfrentado por quem vive no campo?",
            options: ["Falta de espaço", "Acesso limitado a hospitais", "Excesso de poluição sonora"],
            correctAnswer: "Acesso limitado a hospitais"
        },
        {
            question: "Qual destes é um desafio comum enfrentado por quem vive na cidade?",
            options: ["Falta de serviços básicos", "Isolamento social", "Trânsito intenso"],
            correctAnswer: "Trânsito intenso"
        },
        {
            question: "Como a tecnologia tem ajudado a conectar campo e cidade?",
            options: ["Apenas com celulares", "Melhorando a comunicação e logística", "Construindo mais estradas"],
            correctAnswer: "Melhorando a comunicação e logística"
        }
    ];

    // --- Elementos DOM (Document Object Model) ---
    const startScreen = document.getElementById('startScreen');
    const gameArea = document.getElementById('gameArea');
    const resultDisplay = document.getElementById('result');
    const boardPath = document.getElementById('boardPath');
    const playerToken = document.getElementById('playerToken');
    const quizSection = document.getElementById('quizSection');
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('optionsContainer');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const nextMoveBtn = document.getElementById('nextMoveBtn');
    // Novos elementos DOM para os botões de fim de jogo
    const endGameButtons = document.getElementById('endGameButtons');
    const restartGameBtn = document.getElementById('restartGameBtn');
    const exitGameBtn = document.getElementById('exitGameBtn');

    // --- Adição de Ouvintes de Eventos (Event Listeners) ---
    document.getElementById('campoBtn').addEventListener('click', () => startGame('Campo'));
    document.getElementById('cidadeBtn').addEventListener('click', () => startGame('Cidade'));
    // Ouvintes de eventos para os novos botões
    restartGameBtn.addEventListener('click', () => startGame(document.body.classList.contains('theme-campo') ? 'Campo' : 'Cidade'));
    exitGameBtn.addEventListener('click', () => showStartScreen());

    // --- Funções Principais do Jogo ---

    /**
     * Inicia o jogo, configurando o tema visual e reiniciando o estado do tabuleiro.
     * @param {string} theme - O tema visual do jogo ('Campo' ou 'Cidade').
     */
    function startGame(theme) {
        startScreen.classList.add('hidden'); // Esconde a tela inicial
        gameArea.classList.remove('hidden'); // Mostra a área principal do jogo
        endGameButtons.classList.add('hidden'); // Esconde os botões de fim de jogo

        playerBoardPosition = 0; // Reinicia a posição do jogador para o início
        resultDisplay.innerText = ''; // Limpa mensagens anteriores
        feedbackMessage.classList.add('hidden'); // Esconde qualquer feedback antigo
        quizSection.classList.add('hidden'); // Esconde o quiz no início de uma nova partida

        // Define o tema visual no corpo do documento (para mudar cores de fundo e elementos)
        spawnAnimalsAndFlowers(theme);

        setupGameBoard(); // Cria visualmente as casas do tabuleiro
        updatePlayerPositionOnBoard(); // Posiciona o jogador na primeira casa

        startTurn(); // Inicia a primeira jogada, que será um quiz
    }

    /**
     * Mostra a tela inicial e esconde a área do jogo.
     */
    function showStartScreen() {
        gameArea.classList.add('hidden');
        startScreen.classList.remove('hidden');
        endGameButtons.classList.add('hidden'); // Garante que os botões de fim de jogo estejam escondidos
        // Opcional: Limpar elementos de fundo ao sair para a tela inicial
        document.body.querySelectorAll('.bicho, .flor').forEach(el => el.remove());
        document.body.classList.remove('theme-campo', 'theme-cidade'); // Limpa o tema
    }

    /**
     * Configura o tabuleiro do jogo, criando os elementos visuais para cada casa.
     */
    function setupGameBoard() {
        boardPath.innerHTML = ''; // Limpa quaisquer casas anteriores
        const numSpaces = totalBoardSpaces + 1; // Ex: 15 casas -> 0, 1, ..., 14

        // Cria um div para cada casa do tabuleiro
        for (let i = 0; i < numSpaces; i++) {
            const space = document.createElement('div');
            space.classList.add('board-space', 'flex-shrink-0');
            space.innerText = i + 1; // Numeração das casas (1 a N, para o usuário)
            boardPath.appendChild(space);
        }
        // Ajusta a largura dos espaços para que se distribuam uniformemente
        boardPath.classList.add('w-full', 'justify-between', 'items-center', 'flex');
        boardPath.style.gap = '10px'; // Define o espaço entre as casas
    }

    /**
     * Atualiza a posição visual do token do jogador no tabuleiro.
     * Calcula a posição exata e anima o movimento do token.
     */
    function updatePlayerPositionOnBoard() {
        const spaces = Array.from(boardPath.children);
        // Remove a classe 'active' de todas as casas (para desmarcar a casa anterior)
        spaces.forEach((s) => s.classList.remove('active'));

        // Se a posição atual do jogador for válida, marca a casa como 'active'
        if (spaces[playerBoardPosition]) {
            spaces[playerBoardPosition].classList.add('active');

            // Calcula a posição do centro da casa atual para posicionar o token
            const targetSpace = spaces[playerBoardPosition];
            const boardRect = boardPath.getBoundingClientRect();
            const spaceRect = targetSpace.getBoundingClientRect();

            // Calcula a posição 'left' e 'top' relativa ao 'boardPath'
            const tokenLeft = (spaceRect.left - boardRect.left) + (spaceRect.width / 2);
            const tokenTop = (spaceRect.top - boardRect.top) + (spaceRect.height / 2);

            // Aplica as posições ao token para centralizá-lo na casa
            playerToken.style.left = `${tokenLeft}px`;
            playerToken.style.top = `${tokenTop}px`;
        }
    }

    /**
     * Inicia uma nova jogada, verificando se o jogo terminou ou mostrando o quiz.
     */
    function startTurn() {
        // Verifica se o jogador alcançou a última casa
        if (playerBoardPosition >= totalBoardSpaces) {
            // Jogo concluído: Exibe mensagem de vitória
            resultDisplay.innerText = "Parabéns! Você conectou o Campo e a Cidade!";
            resultDisplay.classList.remove('hidden', 'text-red-600', 'text-gray-700');
            resultDisplay.classList.add('text-green-700');

            quizSection.classList.remove('active'); // Esconde o quiz
            quizSection.classList.add('hidden');

            // Mostra os botões de fim de jogo
            endGameButtons.classList.remove('hidden');

        } else {
            // Jogo em andamento: Exibe a posição atual e instrui o jogador
            resultDisplay.innerText = `Você está na casa ${playerBoardPosition + 1} de ${totalBoardSpaces + 1}. Responda para avançar!`;
            resultDisplay.classList.remove('hidden', 'text-green-700', 'text-red-600');
            resultDisplay.classList.add('text-gray-700');

            showQuiz(); // Apresenta uma nova pergunta do quiz
        }
    }

    /**
     * Exibe uma pergunta do quiz e suas opções de resposta.
     */
    function showQuiz() {
        if (quizActive) return;

        quizActive = true;
        nextMoveBtn.classList.add('hidden');
        feedbackMessage.classList.add('hidden');
        optionsContainer.classList.remove('disabled-options');

        const questionIndex = playerBoardPosition % questions.length;
        const currentQuizQuestion = questions[questionIndex];

        questionElement.innerText = currentQuizQuestion.question;
        optionsContainer.innerHTML = '';

        currentQuizQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            button.innerText = option;
            button.addEventListener('click', () => checkAnswer(button, option, currentQuizQuestion.correctAnswer));
            optionsContainer.appendChild(button);
        });

        quizSection.classList.remove('hidden');
        setTimeout(() => quizSection.classList.add('active'), 100);
    }

    /**
     * Verifica a resposta do usuário e atualiza o estado do jogo e o visual.
     * @param {HTMLElement} clickedButton - O botão da opção que foi clicado.
     * @param {string} selectedOption - A string da opção selecionada pelo usuário.
     * @param {string} correctAnswer - A string da resposta correta para a pergunta atual.
     */
    function checkAnswer(clickedButton, selectedOption, correctAnswer) {
        optionsContainer.classList.add('disabled-options');
        quizActive = false;

        const allOptionButtons = optionsContainer.querySelectorAll('.option-button');
        allOptionButtons.forEach(btn => {
            if (btn.innerText === correctAnswer) {
                btn.classList.add('correct');
            }
        });

        if (selectedOption === correctAnswer) {
            clickedButton.classList.add('correct');
            feedbackMessage.innerText = "🎉 Resposta Certa! Avance!";
            feedbackMessage.classList.remove('hidden', 'text-red-600');
            feedbackMessage.classList.add('text-green-700');

            setTimeout(() => {
                playerBoardPosition++;
                updatePlayerPositionOnBoard();

                setTimeout(() => {
                    quizSection.classList.remove('active');
                    setTimeout(() => {
                        quizSection.classList.add('hidden');
                        startTurn();
                    }, 400);
                }, 800);
            }, 1000);
        } else {
            clickedButton.classList.add('incorrect');
            feedbackMessage.innerText = "😞 Resposta Errada! Tente novamente.";
            feedbackMessage.classList.remove('hidden', 'text-green-700');
            feedbackMessage.classList.add('text-red-600');

            setTimeout(() => {
                allOptionButtons.forEach(btn => btn.classList.remove('correct', 'incorrect'));
                optionsContainer.classList.remove('disabled-options');
                feedbackMessage.classList.add('hidden');
                quizActive = true;
            }, 1500);
        }
    }

    /**
     * Gera elementos de fundo (animais e flores/plantas) e define o tema visual
     * do corpo do documento com base na escolha do jogador.
     * @param {string} theme - O tema do jogo ('Campo' ou 'Cidade').
     */
    function spawnAnimalsAndFlowers(theme) {
        const backgroundElementsContainer = document.body;

        backgroundElementsContainer.querySelectorAll('.bicho, .flor').forEach(el => el.remove());

        let elementsToSpawn = [];
        if (theme === 'Campo') {
            elementsToSpawn = [
                { type: 'bicho', class: 'coelho' },
                { type: 'bicho', class: 'vaca' },
                { type: 'bicho', class: 'ovelha' },
                { type: 'flor', class: 'margarida' },
                { type: 'flor', class: 'girassol' },
                { type: 'flor', class: 'flor' }
            ];
            document.body.classList.remove('theme-cidade');
            document.body.classList.add('theme-campo');
        } else {
            elementsToSpawn = [
                { type: 'bicho', class: 'cachorro' },
                { type: 'bicho', class: 'gato' },
                { type: 'flor', class: 'planta-vaso' },
                { type: 'flor', class: 'arbusto' },
                { type: 'flor', class: 'flor' }
            ];
            document.body.classList.remove('theme-campo');
            document.body.classList.add('theme-cidade');
        }

        elementsToSpawn.forEach(elementData => {
            const elDiv = document.createElement('div');
            elDiv.classList.add(elementData.type, elementData.class);
            elDiv.style.top = `${Math.random() * 70 + 10}%`;
            elDiv.style.left = `${Math.random() * 80 + 10}%`;
            elDiv.style.animationDelay = `${Math.random() * 2}s`;
            backgroundElementsContainer.appendChild(elDiv);
        });
    }
});


