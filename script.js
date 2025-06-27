// DOM Elements
const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStop');
const lapBtn = document.getElementById('lap');
const resetBtn = document.getElementById('reset');
const lapsContainer = document.getElementById('laps');

// Stopwatch variables
let isRunning = false;
let startTime;
let elapsedTime = 0;
let timerInterval;
let lapCount = 1;

// Format time as MM:SS:MS
function formatTime(ms) {
    const date = new Date(ms);
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const milliseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
}

// Update the display with animation
function updateDisplay() {
    display.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.05)', opacity: 0.8 },
        { transform: 'scale(1)', opacity: 1 }
    ], {
        duration: 300,
        easing: 'ease-out'
    });
    display.textContent = formatTime(elapsedTime);
}

// Start or pause the stopwatch
function toggleStartStop() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10);
        startStopBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        startStopBtn.classList.remove('green');
        startStopBtn.classList.add('blue');
    } else {
        clearInterval(timerInterval);
        startStopBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        startStopBtn.classList.remove('blue');
        startStopBtn.classList.add('green');
    }
    isRunning = !isRunning;
}

// Record lap time with animation
function recordLap() {
    if (!isRunning && elapsedTime === 0) return;
    
    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.innerHTML = `
        <span>Lap ${lapCount++}</span>
        <span>${formatTime(elapsedTime)}</span>
    `;
    
    // Animation
    lapItem.animate([
        { opacity: 0, transform: 'translateY(-20px)' },
        { opacity: 1, transform: 'translateY(0)' }
    ], {
        duration: 300,
        easing: 'ease-out'
    });
    
    lapsContainer.prepend(lapItem);
    
    // Flash lap button
    lapBtn.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.2)' },
        { transform: 'scale(1)' }
    ], {
        duration: 300,
        easing: 'ease-out'
    });
}

// Reset the stopwatch with animation
function reset() {
    clearInterval(timerInterval);
    isRunning = false;
    elapsedTime = 0;
    lapCount = 1;
    updateDisplay();
    startStopBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    startStopBtn.classList.remove('blue');
    startStopBtn.classList.add('green');
    
    // Animate laps container disappearing
    lapsContainer.animate([
        { opacity: 1, height: 'auto' },
        { opacity: 0, height: 0 }
    ], {
        duration: 300,
        easing: 'ease-out'
    }).onfinish = () => {
        lapsContainer.innerHTML = '';
        lapsContainer.style.display = 'none';
        setTimeout(() => {
            lapsContainer.style.display = 'block';
            lapsContainer.animate([
                { opacity: 0 },
                { opacity: 1 }
            ], { duration: 300 });
        }, 50);
    };
}

// Event listeners
startStopBtn.addEventListener('click', toggleStartStop);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', reset);

// Initial display update
updateDisplay();