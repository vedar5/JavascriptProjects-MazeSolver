let size = 25;
let maze = [], copymaze = [];
let current = [];
let x, y, num;
x = y = num = 0;
let stack = [[0,0]]; // hardcoding the initial point 0,0
let path  = [];
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext("2d");


// Initialize maze with 0s
for( let i = 0; i < size; i++){
  let row  = [];
  for(let j = 0; j < size; j++){
    row.push(0);
  }
  maze.push( row );
  
}

function copyMaze() {
  copymaze=[];
  for( let i = 0; i < size; i++){
    let row  = [];
    for(let j = 0; j < size; j++){
      row.push(maze[i][j]);
    }
    copymaze.push(row);
  }
}

function markValue(indexX,indexY) {
  //console.log(indexX,indexY);
  let drawatX = (indexY  * (canvas.width / size)) +  (((canvas.width / size) - 2) / 2);
  let drawatY = (indexX  * (canvas.width / size)) +  (((canvas.height / size) - 2) / 2);

  if( maze[indexX][indexY] === 1){
    ctx.fillStyle="#FF0000";
    ctx.fillRect(drawatX,drawatY,((canvas.width / size) / 4), ((canvas.height / size) / 4));
  }
}

function checkValidValue(x, y, m, value){
  // check if x,y is withing the bounds of maze and is value
  if ((x >= 0) && (x < size) &&
      (y >= 0) && (y < size) &&
      (m[x][y] === value)) {
    return 1;
  } else{
    return 0;
  }
  
}

function getNeighborsTaken(x, y){
  let count = 0;
  let neighbors = [[(x - 1), y], //top
                   [x, y + 1], // right
                   [(x + 1), y], // bottom
                   [x, (y - 1)]]; // left
  neighbors.forEach( (node) => {
      if(checkValidValue(node[0], node[1], maze, 1) === 1){ 
           count++;
      }  
    });
  return count;
}

function isThisRightNode(x,y){
  if(checkValidValue(x, y, maze, 0) === 1 &&
   getNeighborsTaken(x, y) === 1){
     return true;  
  } else{
    return false;
  }
}

// get top value from the stack
current = stack[stack.length - 1];
maze[current[0]][current[1]] = 1;

while(stack.length > 0) {
    let chooseFrom = [];
    let topRightBottomLeft = [];
    
    current = stack[stack.length - 1];
    topRightBottomLeft = [[current[0] - 1, current[1]]    ,
                          [current[0]    , current[1] + 1],
                          [current[0] + 1, current[1]]    ,
                          [current[0]    , current[1] - 1]];
    //check validity of the neighbors( top, right, bottom, left ) of the current 
    
    topRightBottomLeft.forEach( (element) => {
      if(isThisRightNode(element[0],element[1])){
        chooseFrom.push([element[0],element[1]])
      } 
    });
    
    if (chooseFrom.length === 0) stack.pop();
    else {
      num = Math.floor(Math.random() * chooseFrom.length);
      stack.push(chooseFrom[num]);
      maze[chooseFrom[num][0]][chooseFrom[num][1]] = 1;
    }
}

//console.log( maze );
(function drawMaze(){
  let startX = 0;
  let startY = 0;

  let squareW = (canvas.width / size);

  for( let i = 0; i < size; i++ ){

    for( let j = 0; j < size; j++ ){

      if( maze[i][j] === 1){
        ctx.fillStyle = "#FFFFFF";
        //ctx.fillRect(startX, startY, squareW, squareW);
      } else{
        ctx.fillStyle = "#FF0000";
        ctx.strokeRect(startX, startY, squareW, squareW);
      }
      
      
      startX += squareW;
    }
    startX = 0;
    startY += squareW;
  }
})();

document.addEventListener('click', getCoOrdinates);
function getCoOrdinates(e){
  let canvasY = e.clientX - e.target.offsetLeft;
  let canvasX = e.clientY - e.target.offsetTop;
  if(canvasX >= canvas.width || canvasY >= canvas.height)
    return;
  let indexX  = Math.floor(canvasX / (canvas.width / size));
  let indexY  = Math.floor(canvasY / (canvas.height / size));

  markValue(indexX, indexY);
  if(maze[indexX][indexY]==1)
    showPath([[indexX,indexY], [0,0]]);
}

function showPath(points){
  let curX =  points[0][0];
  let curY =  points[0][1];
  let targetX = points[1][0];
  let targetY = points[1][1];

  copyMaze(); path = [];
  //console.log(`maze: ${maze}`);
  path.push([curX,curY]);
  copymaze[curX][curY] = 2;
  while(path.length != 0) {
    curX = path[path.length-1][0];
    curY = path[path.length-1][1];
    if(curX == targetX && curY == targetY)
      break;
    let openNodes = getOpenNodes(curX,curY);
    if(openNodes.length != 0) {
      path.push(openNodes[0]);
      copymaze[openNodes[0][0]][openNodes[0][1]] = 2;
    } else
      path.pop();
  }

  //console.log(path.length);

  path.forEach(node => markValue(node[0],node[1]));
}

function getOpenNodes(x, y){
  let openNodes = [];
  let neighbors = [[(x - 1), y], //top
                   [x, y + 1], // right
                   [(x + 1), y], // bottom
                   [x, (y - 1)]]; // left
  neighbors.forEach((node) => {
      if(checkValidValue(node[0], node[1], copymaze, 1) === 1){ 
           openNodes.push([node[0], node[1]]);
      }  
  });
  return openNodes;
}






