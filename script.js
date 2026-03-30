const questions = [
    {
        question: "¿CUÁL ES EL PRIMER PASO CUANDO LLEGA UN COLABORADOR NUEVO?",
        options: {
            A: "SENTARLO EN SU PUESTO",
            B: "DEJARLO QUE EXPLORE SOLO",
            C: "INVITARLO A LA INDUCCIÓN",
            D: "MANDARLO PARA LA CASA"
        },
        correct: "C"
    },
    {
        question: "¿QUÉ SE DEBE HACER ANES DEL PRIMER DÍA CON EL COLABORADOR?",
        options: {
            A: "ESPERAR QUE LLEGUE",
            B: "NOTIFICACIÓN POR CORREO",
            C: "LLAMARLO SOLAMENTE",
            D: "NO HACER NADA"
        },
        correct: "B"
    },
    {
        question: "¿QUÉ SE LE ENTREGA AL COLABORADOR PARA SABER SU PROCESO DE INDUCCIÓN?",
        options: {
            A: "UNA AGENDA DE APUNTES",
            B: "UN AUDIO AL WHATSAPP",
            C: "UN COMPAÑERO GUÍA",
            D: "UN CRONOGRAMA DE FORMACIÓN"
        },
        correct: "D"
    },
    {
        question: "¿LA INDUCCIÓN SOLO CONSISTE EN EXPLICAR LOS PROCESOS?",
        options: {
            A: "NO",
            B: "SI",
            C: "SOLO AVECES",
            D: "DEPENDE EL JEFE"
        },
        correct: "A"
    },
    {
        question: "¿QUÉ INCLUYE TAMBIÉN LA INDUCCIÓN ADEMÁS DE LOS PROCESOS?",
        options: {
            A: "SOLO NORMAS",
            B: "CULTURA, VALORES, FORMA LABORAL",
            C: "SOLO TAREAS",
            D: "SOLO HORARIOS"
        },
        correct: "B"
    },
    {
        question: "¿QUÉ GANA UN COLABORADOR CON UNA BUENA INDUCCIÓN?",
        options: {
            A: "MÁS SALARIO",
            B: "SEGURIDAD Y CLARIDAD",
            C: "MENOS TRABAJO",
            D: "MÁS DESCANSO"
        },
        correct: "B"
    },
    {
        question: "¿QUÉ PASÓ CON LA HISTORIA CON EL COLABORADOR QUE NO LLEGÓ A LA INDUCCIÓN?",
        options: {
            A: "TODO SALIÓ PERFECTO",
            B: "NO FUE IDENTIFICADO A TIEMPO",
            C: "LLEGÓ TARDE PERO NO IMPORTÓ",
            D: "CANCELARON LA INDUCCIÓN"
        },
        correct: "B"
    },
    {
        question: "¿POR QUÉ ES IMPORTANTE LA INDUCCIÓN?",
        options: {
            A: "ES UN REQUISITO LEGAL",
            B: "ES INICIAR BIEN EN LA EMPRESA",
            C: "ES UN REQUISITO MÁS",
            D: "SOLO PARA SOCIALIZARLA"
        },
        correct: "B"
    },
    {
        question: "¿QUÉ PUEDE PASAR SI ALGUIEN EMPIEZA A TRABAJAR SIN LA INDUCCIÓN?",
        options: {
            A: "APRENDE MÁS RÁPIDO",
            B: "CONFUSIÓN Y ERRORES",
            C: "NADA CAMBIA",
            D: "MEJORA EL DESEMPEÑO"
        },
        correct: "B"
    },
    {
        question: "¿QUÉ SE DEBE VERIFICAR EN EL PROCESO DE INDUCCIÓN?",
        options: {
            A: "ASISTENCIA",
            B: "CRONOGRAMA",
            C: "INFORMACIÓN RECIBIDA",
            D: "TODAS LAS ANTERIORES"
        },
        correct: "D"
    }
];

const levels = [
    "Experto Nivel 1", "Experto Nivel 2", "Experto Nivel 3", "Experto Nivel 4", 
    "Especialista", "Líder de Inducción", "Maestro de Cultura", "Gurú Corporativo", 
    "Visionario", "LEYENDA DE LA INDUCCIÓN"
];

// --- Sound Manager (Local Media) ---
const SoundManager = {
    sounds: {
        startApp: new Audio('media/Inicio de la app.mp3'),
        newQuestion: new Audio('media/Inicio de Pregunta.mp3'),
        correct: new Audio('media/Respuesta correcta.mp3'),
        wrong: new Audio('media/Respuesta incorrecta.mp3'),
        suspense: new Audio('media/Mientras contesta.mp3'),
        lifeline: new Audio('media/al utilizar un comodin.mp3')
    },

    init() {
        // Prepare suspense music for looping
        this.sounds.suspense.loop = true;
    },

    stopAll() {
        Object.values(this.sounds).forEach(s => {
            s.pause();
            s.currentTime = 0;
        });
    },

    playStart() {
        this.stopAll();
        this.sounds.startApp.play().catch(e => console.log("Audio play blocked", e));
    },

    playNewQuestion() {
        this.stopAll();
        this.sounds.newQuestion.play().catch(e => console.log("Audio play blocked", e));
        // Start suspense music after a brief delay
        setTimeout(() => {
            this.sounds.suspense.play().catch(e => {});
        }, 1500);
    },

    playCorrect() {
        this.stopAll();
        this.sounds.correct.play().catch(e => console.log("Audio play blocked", e));
    },

    playWrong() {
        this.stopAll();
        this.sounds.wrong.play().catch(e => console.log("Audio play blocked", e));
    },

    playLifeline() {
        this.sounds.lifeline.play().catch(e => {});
    }
};

SoundManager.init();

let currentQuestionIndex = 0;
let usedLifelines = {
    fifty: false,
    people: false,
    phone: false
};

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionBtns = document.querySelectorAll('.option-btn');
const currentLevelDisplay = document.getElementById('current-level');

const modal = document.getElementById('lifeline-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close');

// Ladder removed
function initLadder() {}
function updateLadder() {}

// Game Logic
function startGame() {
    currentQuestionIndex = 0;
    usedLifelines = { fifty: false, people: false, phone: false };
    resetLifelineButtons();
    showScreen('game-screen');
    initLadder();
    loadQuestion();
}

function loadQuestion() {
    const q = questions[currentQuestionIndex];
    questionText.textContent = q.question;
    currentLevelDisplay.textContent = currentQuestionIndex + 1;
    
    optionBtns.forEach(btn => {
        const opt = btn.dataset.option;
        btn.querySelector('.text').textContent = q.options[opt];
        btn.className = 'option-btn'; // Reset classes
        btn.style.visibility = 'visible';
    });
    
    updateLadder();
    SoundManager.playNewQuestion();
}

function handleAnswer(e) {
    const selectedBtn = e.currentTarget;
    if (selectedBtn.classList.contains('disabled') || selectedBtn.classList.contains('correct') || selectedBtn.classList.contains('wrong')) return;

    const selectedOption = selectedBtn.dataset.option;
    const correctAnswer = questions[currentQuestionIndex].correct;

    selectedBtn.classList.add('selected');

    // Classic suspense delay
    setTimeout(() => {
        if (selectedOption === correctAnswer) {
            selectedBtn.classList.remove('selected');
            selectedBtn.classList.add('correct');
            SoundManager.playCorrect();
            
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    loadQuestion();
                } else {
                    endGame(true);
                }
            }, 1500);
        } else {
            selectedBtn.classList.remove('selected');
            selectedBtn.classList.add('wrong');
            SoundManager.playWrong();
            document.querySelector(`.option-btn[data-option="${correctAnswer}"]`).classList.add('correct');
            
            setTimeout(() => {
                endGame(false);
            }, 2000);
        }
    }, 1000);
}

function endGame(win) {
    showScreen('result-screen');
    const title = document.getElementById('result-title');
    const message = document.getElementById('result-message');
    const finalLevel = document.getElementById('final-level');

    if (win) {
        title.textContent = "¡FELICITACIONES!";
        message.textContent = "Has completado toda la inducción con éxito. ¡Eres una Leyenda!";
        finalLevel.textContent = "10 / 10";
    } else {
        title.textContent = "Juego Terminado";
        message.textContent = "No te preocupes, la inducción es un proceso de aprendizaje continuo.";
        finalLevel.textContent = `${currentQuestionIndex} / 10`;
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Lifelines
function useFiftyFifty() {
    if (usedLifelines.fifty) return;
    usedLifelines.fifty = true;
    document.getElementById('lifeline-5050').classList.add('used');
    SoundManager.playLifeline();

    const correct = questions[currentQuestionIndex].correct;
    const options = ['A', 'B', 'C', 'D'];
    const incorrect = options.filter(o => o !== correct);
    
    // Randomly remove two incorrect
    const toRemove = [];
    while (toRemove.length < 2) {
        const rand = incorrect[Math.floor(Math.random() * incorrect.length)];
        if (!toRemove.includes(rand)) toRemove.push(rand);
    }

    toRemove.forEach(opt => {
        const btn = document.querySelector(`.option-btn[data-option="${opt}"]`);
        btn.style.visibility = 'hidden';
    });
}

function usePeople() {
    if (usedLifelines.people) return;
    usedLifelines.people = true;
    document.getElementById('lifeline-people').classList.add('used');
    SoundManager.playLifeline();

    const correct = questions[currentQuestionIndex].correct;
    const options = ['A', 'B', 'C', 'D'];
    
    // Simulate results
    let results = {};
    let remaining = 100;
    
    // Give the correct one a boost
    const correctPercent = Math.floor(Math.random() * 30) + 50; 
    results[correct] = correctPercent;
    remaining -= correctPercent;

    const others = options.filter(o => o !== correct);
    others.forEach((opt, index) => {
        if (index === others.length - 1) {
            results[opt] = remaining;
        } else {
            const p = Math.floor(Math.random() * remaining);
            results[opt] = p;
            remaining -= p;
        }
    });

    modalBody.innerHTML = `
        <h3>Voto del Público</h3>
        <div style="margin-top: 20px; display: flex; justify-content: space-around; align-items: flex-end; height: 150px;">
            ${options.map(o => `
                <div style="display:flex; flex-direction:column; align-items:center;">
                    <div style="background:var(--accent-blue); width:40px; height:${results[o] * 1.5}px; border: 1px solid white;"></div>
                    <span>${o}: ${results[o]}%</span>
                </div>
            `).join('')}
        </div>
    `;
    modal.style.display = "block";
}

function usePhone() {
    if (usedLifelines.phone) return;
    usedLifelines.phone = true;
    document.getElementById('lifeline-phone').classList.add('used');
    SoundManager.playLifeline();

    const correct = questions[currentQuestionIndex].correct;
    const hints = [
        `"Hola, estoy casi seguro de que es la ${correct}."`,
        `"Esa es fácil, recuerdo que en la capacitación dijeron que era la ${correct}."`,
        `"He estado revisando el manual y definitivamente es la ${correct}."`
    ];
    const hint = hints[Math.floor(Math.random() * hints.length)];

    modalBody.innerHTML = `
        <h3>Llamada a un Amigo</h3>
        <p style="font-size: 1.5rem; margin-top: 20px; font-style: italic;">${hint}</p>
    `;
    modal.style.display = "block";
}

function resetLifelineButtons() {
    document.querySelectorAll('.lifeline-btn').forEach(btn => btn.classList.remove('used'));
}

// Event Listeners
startBtn.addEventListener('click', () => {
    SoundManager.playStart();
    startGame();
});
restartBtn.addEventListener('click', () => {
    SoundManager.playStart();
    startGame();
});
optionBtns.forEach(btn => btn.addEventListener('click', handleAnswer));

document.getElementById('lifeline-5050').addEventListener('click', useFiftyFifty);
document.getElementById('lifeline-people').addEventListener('click', usePeople);
document.getElementById('lifeline-phone').addEventListener('click', usePhone);

closeModal.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };
