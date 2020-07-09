let trackSequence = [];
const track = 200;
const trackNumber = 40;

function generateTrackNumberSequence(num) {
  trackSequence.length=0;
  var str = document.querySelector('.values').value;
  if(str.length==0)
  {
      showErrorMessage('Please Enter Values', true);
      return trackSequence;
  }
  trackSequence=JSON.parse("[" + str + "]");
  return trackSequence;
}

const algorithms = Array.from(document.querySelectorAll('.borderlayout > button'));

let algorithmValue = null;

function selectAlgorithm(btn) {
  algorithmValue = this.dataset.algorithm;
  algorithms.forEach(key => key.classList.remove('activatebutton'));
  btn.target.classList.add('activatebutton');
}

algorithms.forEach(key => key.addEventListener('click', selectAlgorithm));

function showErrorMessage(tips, bool) {
  const promptBox = document.querySelector('.error-msg');
  promptBox.innerHTML = tips;
  if(bool) {
    promptBox.classList.add('error');
  } else {
    promptBox.classList.remove('error');
  }
}

function check() {
  const headPosition = document.querySelector('.headposition').value;
  if(!algorithmValue) {
    showErrorMessage('Please Select The Algorithm', true);
    return false;
  } else if(!headPosition) {
    showErrorMessage('Please enter the initial head Position!', true);
    return false;
  } else {
    showErrorMessage('', false);
    return headPosition;
  }
}

function fcfs(headPosition) {
  let headPath = [];
  headPath.push(headPosition);
  return headPath.concat(trackSequence);
}

Array.prototype.min = function () {
  var min = this[0];
  var coor = 0; 
  this.forEach((ele, index,arr) => {
    if(ele < min) {
      min = ele;
      coor = index; 
    } 
  }) 
  return coor; 
}

function sstf(headPosition) {
  let headPath = [];
  headPath.push(headPosition);
  let trackSequenceCopy = trackSequence.concat();
  for(let i = 0; i < trackSequence.length; i++) {
    let distance = trackSequenceCopy.map(key => Math.abs(key - headPath[i]));
    let minCoor = distance.min();
    headPath.push(trackSequenceCopy[minCoor]);
    trackSequenceCopy.splice(minCoor, 1);
  }
  return headPath;
}

function scan(headPosition) {
  let headPath = [];
  headPath.push(headPosition);
  headPath = headPath.concat((trackSequence.filter(key => key <= headPosition)).sort((a, b) => b - a));
  headPath = headPath.concat(0);
  headPath = headPath.concat((trackSequence.filter(key => key > headPosition)).sort((a, b) => a - b));
  
  
  return headPath;
}

function cScan(headPosition) {
  let headPath = [];
  headPath.push(headPosition);
  headPath = headPath.concat((trackSequence.filter(key => key <= headPosition)).sort((a, b) => b - a));
  headPath = headPath.concat(0);
  headPath = headPath.concat(track-1);
  headPath = headPath.concat((trackSequence.filter(key => key > headPosition)).sort((a, b) => b - a));    
  return headPath;
}

const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');

function getStyle(obj,attr){
    const cssStyle = obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
    if(attr == 'height' || attr == 'width') {
      return cssStyle.slice(0, cssStyle.length - 2);
    }
    return cssStyle;
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

function drawText(text, xPos, yPos) {
  ctx.textAlign = "center";
  ctx.font = "20px Arial";
  ctx.fillText(text, xPos, yPos);
}

function drawCoordinateAxis(xCoorArray) {
  ctx.strokeStyle = '#de1428';
  ctx.fillStyle = '#de1428';
  ctx.lineWidth = 2;
  for(let i = 0; i < xCoorArray.length; i++) {
    const sX = (xCoorArray[i] / track) * canvas.width;
    const eY = (xCoorArray[i + 1] / track) * canvas.width;
    drawText(xCoorArray[i], sX, 25); 
    drawLine(sX, 40, eY, 40);
    drawLine(sX, 40, sX, 30);
  }
}

function drawPoint(xPos, yPos, size) {
  ctx.beginPath();
  ctx.arc(xPos, yPos, size, 0, Math.PI * 2, true); 
  ctx.fill();
}

function drawLineChart(headPath) {
  ctx.strokeStyle = '#de1428';
  ctx.fillStyle = '#de1428';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  let sY = 50;
  let eY = 80;
  for(let i = 0; i < headPath.length; i++) {
    let sX = (headPath[i] / track) * canvas.width;
    let eX = (headPath[i + 1] / track) * canvas.width;
    if(sX == eX) {
      eY = sY;
    }
    drawPoint(sX, sY, 10);
    drawLine(sX, sY, eX, eY);
    sY = eY;
    eY += 50;
  }
}

function showCanvas(headPath) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvas.width = getStyle(canvas, 'width') * 2;
  canvas.height = getStyle(canvas, 'height') * 2;

  let xCoorArray = []
  xCoorArray = xCoorArray.concat(headPath);
  xCoorArray.sort((a, b) => a - b);
  // console.log(`X-axis array: ${xCoorArray}`);
  drawCoordinateAxis(xCoorArray);
  drawLineChart(headPath);
}

function showMoveNumber(headPath) {
  let moveNumber = [];
  for(let i = 1; i < headPath.length; i++) {
    moveNumber.push(Math.abs(headPath[i] - headPath[i - 1]));
  }
  showErrorMessage(`Number of head movements: ${moveNumber.reduce((a, b) => a + b)}`, true);
  document.getElementById("answer").innerHTML = (moveNumber.reduce((a, b) => a + b));
}

function start() {
  const headPosition = check();
  if(headPosition && algorithmValue) {
    generateTrackNumberSequence(trackNumber);
    let headPath = [];
    switch(algorithmValue) {
      case 'fcfs':
        headPath = fcfs(headPosition);
        break;
      case 'sstf':
        headPath = sstf(headPosition);
        break;
      case 'scan':
        headPath = scan(headPosition);
        break;
      case 'c-scan':
        headPath = cScan(headPosition);
        break;
    }
    showCanvas(headPath);
    showMoveNumber(headPath); 
  }
}
document.querySelector('.startbtn').addEventListener('click', start);
