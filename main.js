// const text = document.querySelector('#score');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const reloadBtn = document.getElementById('reload');
// const looseInfo = document.getElementById('loose');
// const winInfo = document.getElementById('win');

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 32;
const tetrominoSequance = [];
const playfield = [];
let score = 0;


function loadFromLS(key) {
    try {
        const data = localStorage.getItem(key);
        const parsedData = data === null ? undefined : JSON.parse(data);
        return parsedData;
    } 
    catch (err) {
       console.error('Set state error:', error.message) 
    }
}

let loose = loadFromLS('loose') === undefined ? 0 : loadFromLS('loose');
console.log(loose)

// looseInfo.innerText = loose;

let win = loadFromLS('win') === undefined ? 0 : loadFromLS('win');

// winInfo.innerText = win;

let count = 0;

let rAF = null;

let gameOver = false;

if (rAF === null) {
    stopBtn.classList.add('disabled')
} 

context.fillStyle = "transparent";
context.fillRect(0, 0, canvas.width, 60);
context.fillStyle = "white";
context.font = "18px monospace";
context.fillText(`Score ${score} Win ${win} Loose ${loose}`, canvas.width / 8, canvas.height / 16);



reloadBtn.addEventListener('click', onReloadBtnClick)

function onReloadBtnClick() {
    if (!gameOver && score !== 0) {
        win += 1;
        // winInfo.innerText = win;
        localStorage.setItem('win', JSON.stringify(win))
         cancelAnimationFrame(rAF);
    // gameOver = true;
context.clearRect(0, 0, canvas.width, canvas.height);
context.fillStyle = "transparent";
context.fillRect(0, 0, canvas.width, 60);
context.fillStyle = "white";
context.font = "18px monospace";
context.fillText(`Score ${score} Win ${win} Loose ${loose}`, canvas.width / 8, canvas.height / 16);

    context.globalCompositeOperation = 'source-over';
    context.fillStyle = "black";
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 100);
    context.clobalAlpha = 1;
    context.fillStyle = "white";
    context.font = "18px monospace";
    context.textAlighn = "center";
    context.textBaseLine = "middle";
    context.fillText(`Congratulations! You win!`, canvas.width / 12, canvas.height / 1.95);
    context.fillText(`Your score is ${score}!`, canvas.width / 4, canvas.height / 1.8);
    setTimeout(() => {
          document.location.reload()
    },2000)
    } else if (rAF) {
      showGameOver()  
    }
    
    else {
                document.location.reload()  
    }


}

stopBtn.addEventListener('click', onStopBtnClick);

function onStopBtnClick() {
    if (stopBtn.innerText === "CONTINUE") {
        rAF = requestAnimationFrame(loop);
         stopBtn.innerText = "PAUSE"
    } else{    cancelAnimationFrame(rAF)
    stopBtn.innerText = "CONTINUE"}

}
    
    startBtn.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
        startBtn.classList.add('disabled')
        rAF = requestAnimationFrame(loop);

}


  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateSequence() {
    const sequance = ["I", "J", "L", "O", "S", "T", "Z"];
    while (sequance.length) {
        const rand = getRandomInt(0, sequance.length - 1);
        const name = sequance.splice(rand, 1)[0];
        tetrominoSequance.push(name);
    }
    console.log(tetrominoSequance)
}

function getNextTetromino() {
    if (tetrominoSequance.length === 0) {
        generateSequence();
    }
    const name = tetrominoSequance.pop();
    const matrix = tetrominos[name];
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2)
    const row = name === "I" ? -1 : -2;
    console.log({
        name: name,
        matrix: matrix,
        row: row,
        col: col,
    })
    return {
        name: name,
        matrix: matrix,
        row: row,
        col: col,
    }
}

function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) => row.map((value, j) => matrix[N - j][i]));
    console.log(result)
    return result;
}

function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                    cellCol + col < 0 || cellCol + col >= playfield[0].length || cellRow + row >= playfield.length || playfield[cellRow + row][cellCol + col]
                )) {
                return false;
            }
        }
    }
    return true;
}

function placeTetromino() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {
                if (tetromino.row + row < 0) {
                    return showGameOver();
                }
                playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
            }
        }
    }
    for (let row = playfield.length - 1; row >= 0;) {
              
        if (playfield[row].every((cell) => !!cell)) {
            score += 1
            // text.innerText = score;
            for (let r = row; r >= 0; r--) {
           
                for (let c = 0; c < playfield[r].length; c++) {
                    playfield[r][c] = playfield[r - 1][c]
         
                
                }
            }
        } else {
            row--
     
        }
    }
    tetromino = getNextTetromino();
}

function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = "black";
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    context.clobalAlpha = 1;
    context.fillStyle = "white";
    context.font = "26px monospace";
    context.textAlighn = "center";
    context.textBaseLine = "middle";
    context.fillText("Sorry! You loose!", canvas.width / 12, canvas.height / 1.95);
    score = 0;
    setTimeout(() => {
          document.location.reload()
    }, 1500)
    startBtn.classList.remove('disabled');
    if (loose) {
        loose++
         localStorage.setItem('loose', JSON.stringify(loose));
    } else {
          localStorage.setItem('loose', JSON.stringify(1));
    }
    // looseInfo.innerText = loose;
   
}



for (let row = -2; row < 20; row++){
    playfield[row] = [];
    console.log(playfield)
    for (let col = 0; col < 10; col++){
        playfield[row][col] = 0;

    }
}

const tetrominos = {
    'I': [[0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
        [0, 0, 0, 0]],
    'J': [[1, 0, 0],
          [1, 1, 1],
        [0, 0, 0]],
    'L': [[0, 0, 1],
          [1, 1, 1],
        [0, 0, 0]],
    'O': [[1, 1],
        [1, 1]],
    'S': [[0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]],
    'Z': [[1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]],
    'T': [[0, 1, 0],
        [1, 1, 1],
           [0,0,0]]
    
}

const colors = {
    'I': 'brown',
    'J': 'yellow',
    'L': 'blue',
    'O': 'green',
    'S': 'cyan',
    'Z': 'pink',
    'T': 'red',
}
    
let tetromino = getNextTetromino();    



function loop() {
    rAF = requestAnimationFrame(loop);
    if (rAF) {
        stopBtn.classList.remove('disabled')
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = "transparent";
context.fillRect(0, 0, canvas.width, 60);
context.fillStyle = "white";
context.font = "18px monospace";
context.fillText(`Score ${score} Win ${win} Loose ${loose}`, canvas.width / 8, canvas.height / 16);

    for (let row = 0; row < 20; row++){
        for (let col = 0; col < 10; col++){
            if (playfield[row][col]) {
                const name = playfield[row][col];
                context.fillStyle = colors[name];
                context.fillRect(col * grid, row * grid, grid - 1, grid -1)
            }
        }
    }
    if (tetromino) {
        if (++count > 35) {
            tetromino.row++;
            count = 0;
  
     
            if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
                tetromino.row--;
               
                placeTetromino();
            }
        } 
        context.fillStyle = colors[tetromino.name];
        for (let row = 0; row < tetromino.matrix.length; row++){
            for (let col = 0; col < tetromino.matrix[row].length; col++){
                if (tetromino.matrix[row][col]) {
                    context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid - 1, grid - 1);
 
                }
            }
        }
    }
}

document.addEventListener('keydown', function(e) {
    if (gameOver) return;
    if (e.which === 37 || e.which === 39) {
        const col = e.which === 37 ? tetromino.col - 1 : tetromino.col + 1;
        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
            tetromino.col = col;
        }
    }
    if (e.which === 38) {
        const matrix = rotate(tetromino.matrix);
        if (isValidMove(matrix, tetromino.row, tetromino.col)) {
            tetromino.matrix = matrix;
        }
    }
    if (e.which === 40) {
        const row = tetromino.row + 1;
        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
            tetromino.row = row - 1;
            placeTetromino();
            return
        }
        tetromino.row = row;
    }
})  

let clientWidth = 0;

let xDown = null;                                                        
let yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
} 


if (document.documentElement.clientWidth < 768) {
    document.addEventListener('touchstart', function (e) {

    const firstTouch = getTouches(e)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY; 
        console.log(yDown)
              console.log(xDown)
    //     if (e.touches.length === 2 && e.target === canvas) {
    //         const matrix = rotate(tetromino.matrix);
    //     if (isValidMove(matrix, tetromino.row, tetromino.col)) {
    //         tetromino.matrix = matrix;
    //         }
    //     }
    // else if (e.touches[0].clientX < document.documentElement.clientWidth/2 && e.target === canvas) {
    //         console.log(e.touches[0].clientX)
    //             const col = tetromino.col - 1;
    //     if (isValidMove(tetromino.matrix, tetromino.row, col)) {
    //         tetromino.col = col;
    //     }
            
    //     }

    //   else   if (e.touches[0].clientX > document.documentElement.clientWidth/2 && e.target === canvas) {
    //         console.log(e.touches[0].clientX)
    //             const col = tetromino.col + 1;
    //     if (isValidMove(tetromino.matrix, tetromino.row, col)) {
    //         tetromino.col = col;
    //     }
            
    //     }
     
    })

    document.addEventListener('touchmove', function (evt) {
        
    if ( ! xDown || ! yDown ) {
        return;
    }

    let xUp = evt.touches[0].clientX;                                    
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if (xDiff > 0) {
            console.log('left swipe')
             const col = tetromino.col - 1;
        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
            tetromino.col = col;
        }
            /* right swipe */ 
        } else {
            console.log('right swipe')
             const col = tetromino.col + 1;
        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
            tetromino.col = col;
        }
            /* left swipe */
        }                       
    } else {
        if (yDiff > 0) {
            console.log('up swipe')
                        const matrix = rotate(tetromino.matrix);
        if (isValidMove(matrix, tetromino.row, tetromino.col)) {
            tetromino.matrix = matrix;
            }
            /* down swipe */ 
        } else { 
                 console.log('down swipe')
            /* up swipe */
               const row = tetromino.row + 1;
        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
            tetromino.row = row - 1;
            placeTetromino();
            return
        }
        tetromino.row = row;
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;  
    })
}
    



//  rAF = requestAnimationFrame(loop);



