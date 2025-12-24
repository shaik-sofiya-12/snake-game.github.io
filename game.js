/* ===================== GAME LOGIC ===================== */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const CELL = 20;

let snake = [];
let food = {};
let dir = { x: 1, y: 0 };
let nextDir = { x: 1, y: 0 };
let score = 0;
let gameLoopInterval = null;
let lastSpeed = 100;
let highScore = localStorage.getItem('snakeHigh') || 0;
