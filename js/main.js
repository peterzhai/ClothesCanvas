/**
 * Created by zhaizy on 16/8/9.
 */

var backCanvas = document.getElementById('backCanvas');

var drawCanvas = document.getElementById('drawCanvas');


var backCtx = backCanvas.getContext('2d');
var drawCtx = drawCanvas.getContext('2d');


var drawObjects = [];

var point = {
    x: 0,
    y: 0
}

var drawObject = {
    isSelected: false,
    width: 0,
    height: 0, // type 为 1 时,图大小,  type为0时,
    x: 0,
    y: 0,
    oldX: 0,
    oldY: 0,
    imgPath: '',
    type: 0   //0 文字 1图片
}

function drawCircle() {

    drawCtx.fillStyle = '#ffffff';
    drawCtx.font = '40px 宋体';
    drawCtx.lineWidth = 2;
    drawCtx.fillText("这是字体哦", 0, 40);

}

function drawTextToImg(color, text, font, lineW) {
    var canvas = document.createElement('canvas');
    canvas.width = 40 * text.length;
    canvas.height = 45;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.lineWidth = lineW;
    ctx.font = font;
    ctx.fillText(text, 40, 40);
    var img = new Image();
    img.src = canvas.toDataURL();
    return img;
}


function drawImg(img, x, y) {
    var imgObject = {
        isSelected: false,
        width: img.width,
        height: img.height,
        point: {
            x: x,
            y: y
        },
        lastPoint: {
            x: x,
            y: y
        },
        img: img,
        type: 0
    }
    drawObjects.push(imgObject);
    drawCtx.drawImage(img, x, y, 200, 45);
}

function isInRect(point, imageObject) {
    var px = point.x;
    var py = point.y;
    var left = imageObject.point.x;
    var top = imageObject.point.y;
    var right = imageObject.point.x + imageObject.width;
    var bottom = imageObject.point.y + imageObject.height;
    if (px > left && px < right && py > top && py < bottom) {
        return true;
    }

    return false;
}


drawCircle();

var img = drawTextToImg('#556677', "图片来的哦", '30px 宋体', 1);
drawImg(img, 0, 0);

// mouse event
drawCanvas.addEventListener("mousedown", onMouseDown, false);
drawCanvas.addEventListener('mousemove', onMouseMove, false);
drawCanvas.addEventListener('mouseup', onMouseUp, false);

var isMouseDown = false;
var lastPoint;
var selectedObject = null;
function onMouseDown(e) {
    isMouseDown = true;
    console.log('@@##onMouseDown:' + e.clientX + ' ' + e.clientY);
    var point = getPointOnCanvas(drawCanvas, e.clientX, e.clientY);
    console.log('@@##getPoint:' + JSON.stringify(point));
    lastPoint = point;
    for (var i = 0; i < drawObjects.length; i++) {
        if (isInRect(point, drawObjects[i])) {
            drawObjects[i].isSelected = true;
            selectedObject = drawObjects[i];
            // selectedObject.lastPoint = point;
        }
    }
}

function onMouseMove(e) {
    if (isMouseDown) {
        var point = getPointOnCanvas(drawCanvas, e.clientX, e.clientY);
        drawCtx.beginPath();
        drawCtx.moveTo(lastPoint.x, lastPoint.y);
        drawCtx.lineTo(point.x, point.y);
        drawCtx.lineWidth = 2;
        drawCtx.strokeStyle = 'black';
        drawCtx.stroke();

        if (selectedObject) {
            selectedObject.point = point;
            draw();
            selectedObject.lastPoint = point;

        }

        lastPoint = point;

    }

}


function onMouseUp(e) {
    console.log('@@##onMouseUp:' + e.pageX + ' ' + e.pageY);
    isMouseDown = false;
    lastPoint = null;
    // selectedObject.isSelected = false;
    selectedObject = null;
}

function draw() {
    for (var i = 0; i < drawObjects.length; i++) {
        onDrawObject(drawObjects[i]);
    }
}

function onDrawObject(drawObject) {
    drawCtx.clearRect(drawObject.point.x, drawObject.point.y, drawObject.width, drawObject.height);
    drawCtx.drawImage(drawObject.img, drawObject.lastPoint.x, drawObject.lastPoint.y);
}


// 获取canvas坐标
function getPointOnCanvas(canvas, xs, ys) {

    var bbox = canvas.getBoundingClientRect();
    console.log('@@##get point:' + xs + ' ' + ys);
    console.log('@@##get point:' + bbox.left + ' ' + bbox.top);
    // return {x: Math.round(xs - bbox.left), y: Math.round(ys - bbox.top)};
    return {
        x: (xs - bbox.left) * (canvas.width / bbox.width),

        y: (ys - bbox.top) * (canvas.height / bbox.height)

    };

}