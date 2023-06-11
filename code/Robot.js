"use strict";

var gl;
var dir = 0;

var isRobot = 1;
var distanceBetweenRobot = 0;

var isWalk = 0;
var isSeeSky = 0;
var isSideBySide = 0;
var isSpinHead = 0;


var changeTheta = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var theta = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


var TorsoId = 0;
var HeadId = 1;
var LeftUpperArmId = 2;
var LeftLowerArmId = 3;
var LeftUpperLegId = 4;
var LeftLowerLegId = 5;
var RightUpperArmId = 6;
var RightLowerArmId = 7;
var RightUpperLegId = 8;
var RightLowerLegId = 9;

var TORSO_HEIGHT = 0.7;
var TORSO_WIDTH = 0.5;
var HEAD_HEIGHT = 0.15;
var UPPER_ARM_HEIGHT = 0.4;
var UPPER_ARM_WIDTH = 0.1;
var LOWER_ARM_HEIGHT = 0.3;
var BETWEEN_LEGS_WIDTH = 0.12;
var UPPER_LEG_HEIGHT = 0.5;
var UPPER_LEG_WIDTH = 0.14;
var LOWER_LEG_HEIGHT = 0.35;

var figure = [];

var numNodes = 10;
//생성하려는 총 node 수(몸통, 머리 , ... 오른쪽 윗다리, 오른쪽 아랫다리)

var stack = [];

var modelViewMatrix;
var modelViewMatrixLoc;

var eyeX = 0;
var eyeY = 0;
var eyeZ = 4;
var eye = vec3(eyeX, eyeY, eyeZ);
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

var projectionMatrix;
var projectionMatirxLoc;

window.onload = function init() {
  var canvas = document.getElementById("gl-canvas");

  document.getElementById("front_cam").onclick = function () {
    eyeX = 0;
    eyeY = 0;
    eyeZ = 4;
  };

  document.getElementById("side_cam").onclick = function () {
    eyeX = 4;
    eyeY = 0;
    eyeZ = 2.5;
  };

  document.getElementById("top_cam").onclick = function () {
    eyeX = 0;
    eyeY = 3.5;
    eyeZ = 2;
  };

  document.getElementById("walk").onclick = function () {
    changeTheta[LeftUpperArmId] = -0.3;
    changeTheta[RightUpperArmId] = 0.3;
    changeTheta[LeftUpperLegId] = 0.4;
    changeTheta[RightUpperLegId] = -0.4;
    changeTheta[LeftLowerArmId] = -0.6;
    changeTheta[RightLowerArmId] = 0.6;
    changeTheta[LeftLowerLegId] = 0.8;
    changeTheta[RightLowerLegId] = -0.8;
    isWalk = 1;
    isSideBySide = 0;
  };

  document.getElementById("stop").onclick = function () {
    for (var i = 0; i < numNodes; i++) {
      theta[i] = 0;
      changeTheta[i] = 0;
    }
    isWalk = 0;
    isSeeSky = 0;
    isSideBySide = 0;
    isSpinHead = 0;
  };
  document.getElementById("seesky").onclick = function () {
    dir = 0;
    isSeeSky = 1;
    changeTheta[HeadId] = -0.5;
  };
  document.getElementById("head_on").onclick = function () {
    dir = 1;
    isSeeSky = 1;
    changeTheta[HeadId] = 0.5;
  };

  document.getElementById("sidebyside").onclick = function() {
    isSideBySide = 1;
    isWalk = 0;
  }
  document.getElementById("copy").onclick = function() {
    isRobot = 2;
  }
  document.getElementById("spinhead").onclick = function() {
    isSpinHead = 1;
    isSeeSky = 0;
  }
  document.getElementById("respinhead").onclick = function() {
    isSpinHead = 2;
    isSeeSky = 0;
  }
  document.getElementById("residebyside").onclick = function() {
    isSideBySide = 2;
    isWalk = 0;
  }

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }
  var vertices = [
    //Torso
    vec3(-0.25, 0.35, 0.15), //Torso-1
    vec3(0.25, 0.35, 0.15), //Torso-2
    vec3(0.25, -0.35, 0.15), //Torso-3
    vec3(-0.25, -0.35, 0.15), //Torso-4

    vec3(-0.25, 0.35, -0.15), //Torso-5
    vec3(0.25, 0.35, -0.15), //Torso-6
    vec3(0.25, -0.35, -0.15), //Torso-7
    vec3(-0.25, -0.35, -0.15), //Torso-8

    vec3(-0.25, 0.35, 0.15), //Torso-1
    vec3(-0.25, 0.35, -0.15), //Torso-5
    vec3(0.25, 0.35, 0.15), //Torso-2
    vec3(0.25, 0.35, -0.15), //Torso-6
    vec3(0.25, -0.35, 0.15), //Torso-3
    vec3(0.25, -0.35, -0.15), //Torso-7
    vec3(-0.25, -0.35, 0.15), //Torso-4
    vec3(-0.25, -0.35, -0.15), //Torso-8

    //Head
    vec3(-0.075, 0.075, 0.075), //Head-1
    vec3(0.075, 0.075, 0.075), //Head-2
    vec3(0.075, -0.075, 0.075), //Head-3
    vec3(-0.075, -0.075, 0.075), //Head-4

    vec3(-0.075, 0.075, -0.075), //Head-5
    vec3(0.075, 0.075, -0.075), //Head-6
    vec3(0.075, -0.075, -0.075), //Head-7
    vec3(-0.075, -0.075, -0.075), //Head-8

    vec3(-0.075, 0.075, 0.075), //Head-1
    vec3(-0.075, 0.075, -0.075), //Head-5
    vec3(0.075, 0.075, 0.075), //Head-2
    vec3(0.075, 0.075, -0.075), //Head-6
    vec3(0.075, -0.075, 0.075), //Head-3
    vec3(0.075, -0.075, -0.075), //Head-7
    vec3(-0.075, -0.075, 0.075), //Head-4
    vec3(-0.075, -0.075, -0.075), //Head-8

    //Left upper arm
    vec3(-0.05, 0.2, 0.05), // upper arm-1
    vec3(0.05, 0.2, 0.05), // upper arm-2
    vec3(0.05, -0.2, 0.05), // upper arm-3
    vec3(-0.05, -0.2, 0.05), // upper arm-4

    vec3(-0.05, 0.2, -0.05), // upper arm-5
    vec3(0.05, 0.2, -0.05), // upper arm-6
    vec3(0.05, -0.2, -0.05), // upper arm-7
    vec3(-0.05, -0.2, -0.05), // upper arm-8

    vec3(-0.05, 0.2, 0.05), // upper arm-1
    vec3(-0.05, 0.2, -0.05), // upper arm-5
    vec3(0.05, 0.2, 0.05), // upper arm-2
    vec3(0.05, 0.2, -0.05), // upper arm-6
    vec3(0.05, -0.2, 0.05), // upper arm-3
    vec3(0.05, -0.2, -0.05), // upper arm-7
    vec3(-0.05, -0.2, 0.05), // upper arm-4
    vec3(-0.05, -0.2, -0.05), // upper arm-8

    //Left lower arm
    vec3(-0.025, 0.15, 0.025), // lower arm-1
    vec3(0.025, 0.15, 0.025), // lower arm-2
    vec3(0.025, -0.15, 0.025), // lower arm-3
    vec3(-0.025, -0.15, 0.025), // lower arm-4

    vec3(-0.025, 0.15, -0.025), // lower arm-5
    vec3(0.025, 0.15, -0.025), // lower arm-6
    vec3(0.025, -0.15, -0.025), // lower arm-7
    vec3(-0.025, -0.15, -0.025), // lower arm-8

    vec3(-0.025, 0.15, 0.025), // lower arm-1
    vec3(-0.025, 0.15, -0.025), // lower arm-5
    vec3(0.025, 0.15, 0.025), // lower arm-2
    vec3(0.025, 0.15, -0.025), // lower arm-6
    vec3(0.025, -0.15, 0.025), // lower arm-3
    vec3(0.025, -0.15, -0.025), // lower arm-7
    vec3(-0.025, -0.15, 0.025), // lower arm-4
    vec3(-0.025, -0.15, -0.025), // lower arm-8

    //Left upper leg
    vec3(-0.07, 0.25, 0.07), // upper leg-1
    vec3(0.07, 0.25, 0.07), // upper leg-2
    vec3(0.07, -0.25, 0.07), // upper leg-3
    vec3(-0.07, -0.25, 0.07), // upper leg-4

    vec3(-0.07, 0.25, -0.07), // upper leg-5
    vec3(0.07, 0.25, -0.07), // upper leg-6
    vec3(0.07, -0.25, -0.07), // upper leg-7
    vec3(-0.07, -0.25, -0.07), // upper leg-8

    vec3(-0.07, 0.25, 0.07), // upper leg-1
    vec3(-0.07, 0.25, -0.07), // upper leg-5
    vec3(0.07, 0.25, 0.07), // upper leg-2
    vec3(0.07, 0.25, -0.07), // upper leg-6
    vec3(0.07, -0.25, 0.07), // upper leg-3
    vec3(0.07, -0.25, -0.07), // upper leg-7
    vec3(-0.07, -0.25, 0.07), // upper leg-4
    vec3(-0.07, -0.25, -0.07), // upper leg-8

    //left lower leg
    vec3(-0.035, 0.175, 0.035), // lower leg-1
    vec3(0.035, 0.175, 0.035), // lower leg-2
    vec3(0.035, -0.175, 0.035), // lower leg-3
    vec3(-0.035, -0.175, 0.035), // lower leg-4

    vec3(-0.035, 0.175, -0.035), // lower leg-5
    vec3(0.035, 0.175, -0.035), // lower leg-6
    vec3(0.035, -0.175, -0.035), // lower leg-7
    vec3(-0.035, -0.175, -0.035), // lower leg-8

    vec3(-0.035, 0.175, 0.035), // lower leg-1
    vec3(-0.035, 0.175, -0.035), // lower leg-5
    vec3(0.035, 0.175, 0.035), // lower leg-2
    vec3(0.035, 0.175, -0.035), // lower leg-6
    vec3(0.035, -0.175, 0.035), // lower leg-3
    vec3(0.035, -0.175, -0.035), // lower leg-7
    vec3(-0.035, -0.175, 0.035), // lower leg-4
    vec3(-0.035, -0.175, -0.035), // lower leg-8

    //Right upper arm
    vec3(-0.05, 0.2, 0.05), // upper arm-1
    vec3(0.05, 0.2, 0.05), // upper arm-2
    vec3(0.05, -0.2, 0.05), // upper arm-3
    vec3(-0.05, -0.2, 0.05), // upper arm-4

    vec3(-0.05, 0.2, -0.05), // upper arm-5
    vec3(0.05, 0.2, -0.05), // upper arm-6
    vec3(0.05, -0.2, -0.05), // upper arm-7
    vec3(-0.05, -0.2, -0.05), // upper arm-8

    vec3(-0.05, 0.2, 0.05), // upper arm-1
    vec3(-0.05, 0.2, -0.05), // upper arm-5
    vec3(0.05, 0.2, 0.05), // upper arm-2
    vec3(0.05, 0.2, -0.05), // upper arm-6
    vec3(0.05, -0.2, 0.05), // upper arm-3
    vec3(0.05, -0.2, -0.05), // upper arm-7
    vec3(-0.05, -0.2, 0.05), // upper arm-4
    vec3(-0.05, -0.2, -0.05), // upper arm-8

    //Right lower arm
    vec3(-0.025, 0.15, 0.025), // lower arm-1
    vec3(0.025, 0.15, 0.025), // lower arm-2
    vec3(0.025, -0.15, 0.025), // lower arm-3
    vec3(-0.025, -0.15, 0.025), // lower arm-4

    vec3(-0.025, 0.15, -0.025), // lower arm-5
    vec3(0.025, 0.15, -0.025), // lower arm-6
    vec3(0.025, -0.15, -0.025), // lower arm-7
    vec3(-0.025, -0.15, -0.025), // lower arm-8

    vec3(-0.025, 0.15, 0.025), // lower arm-1
    vec3(-0.025, 0.15, -0.025), // lower arm-5
    vec3(0.025, 0.15, 0.025), // lower arm-2
    vec3(0.025, 0.15, -0.025), // lower arm-6
    vec3(0.025, -0.15, 0.025), // lower arm-3
    vec3(0.025, -0.15, -0.025), // lower arm-7
    vec3(-0.025, -0.15, 0.025), // lower arm-4
    vec3(-0.025, -0.15, -0.025), // lower arm-8

    //Right upper leg
    vec3(-0.07, 0.25, 0.07), // upper leg-1
    vec3(0.07, 0.25, 0.07), // upper leg-2
    vec3(0.07, -0.25, 0.07), // upper leg-3
    vec3(-0.07, -0.25, 0.07), // upper leg-4

    vec3(-0.07, 0.25, -0.07), // upper leg-5
    vec3(0.07, 0.25, -0.07), // upper leg-6
    vec3(0.07, -0.25, -0.07), // upper leg-7
    vec3(-0.07, -0.25, -0.07), // upper leg-8

    vec3(-0.07, 0.25, 0.07), // upper leg-1
    vec3(-0.07, 0.25, -0.07), // upper leg-5
    vec3(0.07, 0.25, 0.07), // upper leg-2
    vec3(0.07, 0.25, -0.07), // upper leg-6
    vec3(0.07, -0.25, 0.07), // upper leg-3
    vec3(0.07, -0.25, -0.07), // upper leg-7
    vec3(-0.07, -0.25, 0.07), // upper leg-4
    vec3(-0.07, -0.25, -0.07), // upper leg-8

    //Right lower leg
    vec3(-0.035, 0.175, 0.035), // lower leg-1
    vec3(0.035, 0.175, 0.035), // lower leg-2
    vec3(0.035, -0.175, 0.035), // lower leg-3
    vec3(-0.035, -0.175, 0.035), // lower leg-4

    vec3(-0.035, 0.175, -0.035), // lower leg-5
    vec3(0.035, 0.175, -0.035), // lower leg-6
    vec3(0.035, -0.175, -0.035), // lower leg-7
    vec3(-0.035, -0.175, -0.035), // lower leg-8

    vec3(-0.035, 0.175, 0.035), // lower leg-1
    vec3(-0.035, 0.175, -0.035), // lower leg-5
    vec3(0.035, 0.175, 0.035), // lower leg-2
    vec3(0.035, 0.175, -0.035), // lower leg-6
    vec3(0.035, -0.175, 0.035), // lower leg-3
    vec3(0.035, -0.175, -0.035), // lower leg-7
    vec3(-0.035, -0.175, 0.035), // lower leg-4
    vec3(-0.035, -0.175, -0.035), // lower leg-8

    vec3(-1, 0, 0), // x축
    vec3(1, 0, 0), // x축

    vec3(0, 1, 0), // y축
    vec3(0, -1, 0), // y축
  ];

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.9, 0.9, 0.9, 1.0); //screen 색깔 결정 - 회색(RGB투명도)

  //  Load shaders and initialize attribute buffers

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Load the data into the GPU

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  modelViewMatrix = mat4();
  projectionMatrix = perspective(30, 1, 1, 0);
  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  projectionMatirxLoc = gl.getUniformLocation(program, "projectionMatrix");

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(projectionMatirxLoc, false, flatten(projectionMatrix));

  for (var i = 0; i < numNodes; i++) {
    figure[i] = createNode(null, null, null, null);
  }

  render();
};
/*
 * transform : 4 X 4 transfrom matrix
 * render : robot의 각 부위를 그리는 함수(ex: torso())
 */

function createNode(transform, render, sibling, child) {
  var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
  };
  return node;
}

function initNodes(Id, Xaxis, Yaxis, Zaxis) {
  var m = mat4();
  switch (Id) {
    case TorsoId:
      if (Xaxis != 0 || Yaxis != 0 || Zaxis != 0)
        m = rotate(theta[TorsoId], Xaxis, Yaxis, Zaxis);
      figure[TorsoId] = createNode(m, torso, null, HeadId);
      break;

    case HeadId:
      if (Xaxis != 0 || Yaxis != 0 || Zaxis != 0)
        m = rotate(theta[HeadId], Xaxis, Yaxis, Zaxis);
      figure[HeadId] = createNode(m, head, LeftUpperArmId, null);
      break;

    case LeftUpperArmId:
      if (Xaxis != 0 || Yaxis != 0 || Zaxis != 0)
        m = rotate(theta[LeftUpperArmId], Xaxis, Yaxis, Zaxis);
      figure[LeftUpperArmId] = createNode(m, leftUpperArm, RightUpperArmId, LeftLowerArmId);
      break;

    case RightUpperArmId:
      if (Xaxis != 0 || Yaxis != 0 || Zaxis != 0)
        m = rotate(theta[RightUpperArmId], Xaxis, Yaxis, Zaxis);
      figure[RightUpperArmId] = createNode(m, rightUpperArm, LeftUpperLegId, RightLowerArmId);
      break;

    case LeftUpperLegId:
      if (Xaxis != 0 || Yaxis != 0 || Zaxis != 0)
        m = rotate(theta[LeftUpperLegId], Xaxis, Yaxis, Zaxis);
      figure[LeftUpperLegId] = createNode(m, leftUpperLeg, RightUpperLegId, LeftLowerLegId);
      break;

    case RightUpperLegId:
      if (Xaxis != 0 || Yaxis != 0 || Zaxis != 0)
        m = rotate(theta[RightUpperLegId], Xaxis, Yaxis, Zaxis);
      figure[RightUpperLegId] = createNode(m, rightUpperLeg, null, RightLowerLegId);
      break;

    case LeftLowerArmId:
      if (Xaxis != 0 || Yaxis != 0 || Zaxis != 0)
        m = rotate(theta[LeftLowerArmId], Xaxis, Yaxis, Zaxis);
      figure[LeftLowerArmId] = createNode(m, leftLowerArm, null, null);
      break;

    case RightLowerArmId:
      if (Xaxis != 0 || Yaxis != 0 || Zaxis != 0)
        m = rotate(theta[RightLowerArmId], Xaxis, Yaxis, Zaxis);
      figure[RightLowerArmId] = createNode(m, rightLowerArm, null, null);
      break;

    case LeftLowerLegId:
      if (Xaxis != 0 || Yaxis != 0 || Zaxis != 0)
        m = rotate(theta[LeftLowerLegId], Xaxis, Yaxis, Zaxis);
      figure[LeftLowerLegId] = createNode(m, leftLowerLeg, null, null);
      break;

    case RightLowerLegId:
      if (Xaxis != 0 || Yaxis != 0 || Zaxis != 0)
        m = rotate(theta[RightLowerLegId], Xaxis, Yaxis, Zaxis);
      figure[RightLowerLegId] = createNode(m, rightLowerLeg, null, null);
      break;
  }
}
function traverse(Id) {
  if (Id == null) return;

  stack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
  figure[Id].render();

  if (figure[Id].child != null) {
    traverse(figure[Id].child);
  }

  modelViewMatrix = stack.pop();

  if (figure[Id].sibling != null) {
    traverse(figure[Id].sibling);
  }
}


function torso() {
  var instanceMatrix = translate(0.0, 0.5 * TORSO_HEIGHT - 0.15, 0.0);
  var t = mult(modelViewMatrix, instanceMatrix);

  if(isRobot == 2){
    t = mult(t, translate(distanceBetweenRobot,0,0));
  }

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 0, 4); //Torso앞면
  gl.drawArrays(gl.LINE_LOOP, 4, 4); //Torso뒷면

  gl.drawArrays(gl.LINES, 8, 2); //Torso앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 10, 2); //Torso앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 12, 2); //Torso앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 14, 2); //Torso앞뒷면 연결-4

  modelViewMatrix = t;
}

function head() {
  var instanceMatrix = translate(0.0, 0.5 * (TORSO_HEIGHT + HEAD_HEIGHT), 0.0);
  var t = mult(modelViewMatrix, instanceMatrix);

  if(isSpinHead == 1){
    t = mult(t, rotate(theta[HeadId],0,1,0));
  }
  else if(isSpinHead == 2){
    t = mult(t, rotate(theta[HeadId],0,1,0));
  }

  if(isSeeSky == 1){
    t = mult(t, rotate(theta[HeadId], 1, 1, 0));
  }

  
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 16, 4); //Head앞면
  gl.drawArrays(gl.LINE_LOOP, 20, 4); //Head뒷면

  gl.drawArrays(gl.LINES, 24, 2); //Head앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 26, 2); //Head앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 28, 2); //Head앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 30, 2); //Head앞뒷면 연결-4

  gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);

  modelViewMatrix = t;
}

function leftUpperArm() {
  var instanceMatrix = translate(
    -0.5 * (TORSO_WIDTH + UPPER_ARM_WIDTH),
    0.0,
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  if(isWalk == 1){
    t = mult(t, rotate(theta[LeftUpperArmId], 1, 0, 0));
    t = mult(t, translate(0, -0.1 * Math.sin(radians(theta[LeftUpperArmId])), -0.2 * Math.sin(radians(theta[LeftUpperArmId]))));
  }

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 32, 4); //Left upper arm앞면
  gl.drawArrays(gl.LINE_LOOP, 36, 4); //Left upper arm뒷면

  gl.drawArrays(gl.LINES, 40, 2); //Left upper arm앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 42, 2); //Left upper arm앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 44, 2); //Left upper arm앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 46, 2); //Left upper arm앞뒷면 연결-4

  gl.drawArrays(gl.TRIANGLE_FAN, 32, 4);
  modelViewMatrix = t;
}

function leftLowerArm() {
  var instanceMatrix = translate(
    0.0,
    -0.5 * (UPPER_ARM_HEIGHT + LOWER_ARM_HEIGHT),
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  if(isWalk == 1){
    t = mult(t, rotate(theta[LeftLowerArmId], 1, 0, 0));
    t = mult(t, translate(0, -0.1 * Math.sin(radians(theta[LeftLowerArmId])), -0.2 * Math.sin(radians(theta[LeftLowerArmId]))));
  }
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 48, 4); //Left lower arm앞면
  gl.drawArrays(gl.LINE_LOOP, 52, 4); //Left lower arm뒷면

  gl.drawArrays(gl.LINES, 56, 2); //Left lower arm앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 58, 2); //Left lower arm앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 60, 2); //Left lower arm앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 62, 2); //Left lower arm앞뒷면 연결-4

  gl.drawArrays(gl.TRIANGLE_FAN, 48, 14);
  modelViewMatrix = t;
}

function leftUpperLeg() {
  var instanceMatrix = translate(
    -0.5 * (BETWEEN_LEGS_WIDTH + UPPER_LEG_WIDTH),
    -0.5 * (TORSO_HEIGHT + UPPER_LEG_HEIGHT),
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  if(isWalk == 1){
    t = mult(t, rotate(theta[LeftUpperLegId], 1, 0, 0));
    t = mult(t, translate(0, -0.1 * Math.sin(radians(theta[LeftUpperLegId])), -0.2 * Math.sin(radians(theta[LeftUpperLegId]))));
  }
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 64, 4); //Left upper leg앞면
  gl.drawArrays(gl.LINE_LOOP, 68, 4); //Left upper leg뒷면

  gl.drawArrays(gl.LINES, 72, 2); //Left upper leg앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 74, 2); //Left upper leg앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 76, 2); //Left upper leg앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 78, 2); //Left upper leg앞뒷면 연결-4

  gl.drawArrays(gl.TRIANGLE_FAN, 64, 4);
  modelViewMatrix = t;
}

function leftLowerLeg() {
  var instanceMatrix = translate(
    0.0,
    -0.5 * (UPPER_LEG_HEIGHT + LOWER_LEG_HEIGHT),
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  if(isWalk==1){
    t = mult(t, rotate(theta[LeftLowerLegId], 1, 0, 0));
    t = mult(t, translate(0, -0.1 * Math.sin(radians(theta[LeftLowerLegId])), -0.2 * Math.sin(radians(theta[LeftLowerLegId]))));
  }
  
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 80, 4); //Left lower leg앞면
  gl.drawArrays(gl.LINE_LOOP, 84, 4); //Left lower leg뒷면

  gl.drawArrays(gl.LINES, 88, 2); //Left lower leg앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 90, 2); //Left lower leg앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 92, 2); //Left lower leg앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 94, 2); //Left lower leg앞뒷면 연결-4

  gl.drawArrays(gl.TRIANGLE_FAN, 80, 16);
  modelViewMatrix = t;
}

function rightUpperArm() {
  var instanceMatrix = translate(
    0.5 * (TORSO_WIDTH + UPPER_ARM_WIDTH),
    0.0,
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);

  if(isSideBySide == 1){
    t =  mult(t, translate( 0, -0.385 * Math.sin( radians ( theta[RightUpperArmId])) + 0.03 * Math.cos(radians(theta[RightUpperArmId]+90)), 0) );
  }
  if(isSideBySide == 2){
    t =  mult(t, translate( 0, -0.385 * Math.sin( radians ( theta[RightUpperArmId])) + 0.03 * Math.cos(radians(theta[RightUpperArmId]+90)), 0) );
  }
  if(isWalk == 1){
    t = mult(t, rotate(theta[RightUpperArmId], 1, 0, 0));
    t = mult(t, translate(0, -0.1 * Math.sin(radians(theta[RightUpperArmId])), -0.2 * Math.sin(radians(theta[RightUpperArmId]))));
  }
  
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 96, 4); //Right upper arm앞면
  gl.drawArrays(gl.LINE_LOOP, 100, 4); //Right upper arm뒷면

  gl.drawArrays(gl.LINES, 104, 2); //Right upper arm앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 106, 2); //Right upper arm앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 108, 2); //Right upper arm앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 110, 2); //Right upper arm앞뒷면 연결-4

  gl.drawArrays(gl.TRIANGLE_FAN, 96, 4);
  modelViewMatrix = t;
}

function rightLowerArm() {
  var instanceMatrix = translate(
    0.0,
    -0.5 * (UPPER_ARM_HEIGHT + LOWER_ARM_HEIGHT),
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  if(isWalk == 1){
    t = mult(t, rotate(theta[RightLowerArmId], 1, 0, 0));
    t = mult(t, translate(0, -0.1 * Math.sin(radians(theta[RightLowerArmId])), -0.2 * Math.sin(radians(theta[RightLowerArmId]))));
  }
 
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 112, 4); //Right lower arm앞면
  gl.drawArrays(gl.LINE_LOOP, 116, 4); //Right lower arm뒷면

  gl.drawArrays(gl.LINES, 120, 2); //Right lower arm앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 122, 2); //Right lower arm앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 124, 2); //Right lower arm앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 126, 2); //Right lower arm앞뒷면 연결-4

  gl.drawArrays(gl.TRIANGLE_FAN, 112, 14);
  modelViewMatrix = t;
}

function rightUpperLeg() {
  var instanceMatrix = translate(
    0.5 * (BETWEEN_LEGS_WIDTH + UPPER_LEG_WIDTH),
    -0.5 * (TORSO_HEIGHT + UPPER_LEG_HEIGHT),
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  if(isWalk == 1){
    t = mult(t, rotate(theta[RightUpperLegId], 1, 0, 0));
    t = mult(t, translate(0, -0.1 * Math.sin(radians(theta[RightUpperLegId])), -0.2 * Math.sin(radians(theta[RightUpperLegId]))));
  }
 
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 128, 4); //Right upper leg앞면
  gl.drawArrays(gl.LINE_LOOP, 132, 4); //Right upper leg뒷면

  gl.drawArrays(gl.LINES, 136, 2); //Right upper leg앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 138, 2); //Right upper leg앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 140, 2); //Right upper leg앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 142, 2); //Right upper leg앞뒷면 연결-4

  gl.drawArrays(gl.TRIANGLE_FAN, 128, 4);
  modelViewMatrix = t;
}

function rightLowerLeg() {
  var instanceMatrix = translate(
    0.0,
    -0.5 * (UPPER_LEG_HEIGHT + LOWER_LEG_HEIGHT),
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  if(isWalk == 1){
    t = mult(t, rotate(theta[RightLowerLegId], 1, 0, 0));
    t = mult(t, translate(0, -0.1 * Math.sin(radians(theta[RightLowerLegId])), -0.2 * Math.sin(radians(theta[RightLowerLegId]))));
  }
  
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 144, 4); //Right lower leg앞면
  gl.drawArrays(gl.LINE_LOOP, 148, 4); //Right lower leg뒷면

  gl.drawArrays(gl.LINES, 152, 2); //Right lower leg앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 154, 2); //Right lower leg앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 156, 2); //Right lower leg앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 158, 2); //Right lower leg앞뒷면 연결-4

  gl.drawArrays(gl.TRIANGLE_FAN, 144, 14);
  modelViewMatrix = t;
}

function sideBySide(){
  if(isSideBySide == 1){
    changeTheta[RightUpperArmId] = 0.5;
    if(theta[RightUpperArmId] >= 90){
      changeTheta[RightUpperArmId] = 0;
      initNodes(RightUpperArmId,0,0,1);
    }
    else {
      theta[RightUpperArmId] = theta[RightUpperArmId] + changeTheta[RightUpperArmId];
      initNodes(RightUpperArmId,0,0,1);
    }
  }

  else if(isSideBySide == 2){
    changeTheta[RightUpperArmId] = -0.5;
    if(theta[RightUpperArmId] <= 0){
      changeTheta[RightUpperArmId] = 0;
      initNodes(RightUpperArmId,0,0,1);
    }
    else {
      theta[RightUpperArmId] = theta[RightUpperArmId] + changeTheta[RightUpperArmId];
      initNodes(RightUpperArmId,0,0,1);
    }
  }
}

function copy(){
  distanceBetweenRobot = -distanceBetweenRobot;
  distanceBetweenRobot = distanceBetweenRobot + 0.01;
  if(distanceBetweenRobot >= 0.65){
    distanceBetweenRobot = 0.65;
  }
}

function spinHead(robotNum){
  if(isSpinHead == 1){

    if(robotNum == 1){
      changeTheta[HeadId] = -0.25;
      theta[HeadId] = theta[HeadId] * -1;
      if(theta[HeadId] <= -30){
        changeTheta[HeadId] = 0;
        initNodes(HeadId,0,1,0);
      }
      else {
        theta[HeadId] = theta[HeadId] + changeTheta[HeadId];
        initNodes(HeadId,0,1,0);
      }
    }

    else{
      changeTheta[HeadId] = 0.25;
      theta[HeadId] = theta[HeadId] * -1;
      if(theta[HeadId] >= 30){
        changeTheta[HeadId] = 0;
        initNodes(HeadId,0,1,0);
      }
      else {
        theta[HeadId] = theta[HeadId] + changeTheta[HeadId];
        initNodes(HeadId,0,1,0);
      }
    }
    
  }
  else if(isSpinHead == 2){
    if(robotNum == 1){
      changeTheta[HeadId] = 0.25;

      if(theta[HeadId] > 0){
        theta[HeadId] = theta[HeadId] * -1;
      }

      if(theta[HeadId] == -0){
        changeTheta[HeadId] = 0;
        initNodes(HeadId,0,1,0);
      }
      else {
        theta[HeadId] = theta[HeadId] + changeTheta[HeadId];
        initNodes(HeadId,0,1,0);
      }
    }

    else{
      changeTheta[HeadId] = -0.25;
      theta[HeadId] = theta[HeadId] * -1;

      if(theta[HeadId] == 0){
        changeTheta[HeadId] = 0;
        initNodes(HeadId,0,1,0);
      }
      else {
        theta[HeadId] = theta[HeadId] + changeTheta[HeadId];
        initNodes(HeadId,0,1,0);
      }
    }

  }
}

function seeSky(){
  theta[HeadId] = theta[HeadId] + changeTheta[HeadId];
   //하늘 쳐다보기
   if ( (theta[HeadId] < -45 && dir == 0) && isSeeSky == 1) changeTheta[HeadId] = 0;

   //머리 정면으로 돌리기
   if ( (theta[HeadId] > 0 && dir == 1) && isSeeSky == 1) changeTheta[HeadId] = 0;
}

function walk(){
  theta[LeftUpperArmId] = theta[LeftUpperArmId] + changeTheta[LeftUpperArmId];
  theta[RightUpperArmId] = theta[RightUpperArmId] + changeTheta[RightUpperArmId];
  theta[LeftUpperLegId] = theta[LeftUpperLegId] + changeTheta[LeftUpperLegId];
  theta[RightUpperLegId] = theta[RightUpperLegId] + changeTheta[RightUpperLegId];

  theta[LeftLowerArmId] = theta[LeftLowerArmId] + changeTheta[LeftLowerArmId];
  theta[RightLowerArmId] = theta[RightLowerArmId] + changeTheta[RightLowerArmId];
  theta[LeftLowerLegId] = theta[LeftLowerLegId] + changeTheta[LeftLowerLegId];
  theta[RightLowerLegId] = theta[RightLowerLegId] + changeTheta[RightLowerLegId];

  if ( (isWalk == 1) && (theta[LeftUpperArmId] > 15) ) {
    changeTheta[LeftUpperArmId] = -0.3;
  }
  if ( (isWalk == 1) && (theta[LeftUpperArmId] < -15) ) {
    changeTheta[LeftUpperArmId] = 0.3;
  }
  if ( (isWalk == 1) && (theta[RightUpperArmId] > 15) ) {
    changeTheta[RightUpperArmId] = -0.3;
  }
  if ( (isWalk == 1) && (theta[RightUpperArmId] < -15) ) {
    changeTheta[RightUpperArmId] = 0.3;
  }
  if ( (isWalk == 1) && (theta[LeftLowerArmId] > 15) ) {
    changeTheta[LeftLowerArmId] = -0.3;
  }
  if ( (isWalk == 1) && (theta[LeftLowerArmId] < -30) ) {
    changeTheta[LeftLowerArmId] = 0.6;
  }
  if ( (isWalk == 1) && (theta[RightLowerArmId] > 15) ) {
    changeTheta[RightLowerArmId] = -0.3;
  }
  if ( (isWalk == 1) && (theta[RightLowerArmId] < -30) ) {
    changeTheta[RightLowerArmId] = 0.6;
  }

  if ( (isWalk == 1) && (theta[LeftUpperLegId] > 20) ) {
    changeTheta[LeftUpperLegId] = -0.4;
  }
  if ( (isWalk == 1) && (theta[LeftUpperLegId] < -20) ) {
    changeTheta[LeftUpperLegId] = 0.4;
  }
  if ( (isWalk == 1) && (theta[RightUpperLegId] > 20) ) {
    changeTheta[RightUpperLegId] = -0.4;
  }
  if ( (isWalk == 1) && (theta[RightUpperLegId] < -20) ) {
    changeTheta[RightUpperLegId] = 0.4;
  }
  if ( (isWalk == 1) && (theta[LeftLowerLegId] > 20) ) {
    changeTheta[LeftLowerLegId] = -0.8;
  }
  if ( (isWalk == 1) && (theta[LeftLowerLegId] < -20) ) {
    changeTheta[LeftLowerLegId] = 0.8;
  }
  if ( (isWalk == 1) && (theta[RightLowerLegId] > 20) ) {
    changeTheta[RightLowerLegId] = -0.8;
  }
  if ( (isWalk == 1) && (theta[RightLowerLegId] < -20) ) {
    changeTheta[RightLowerLegId] = 0.8;
  }
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  eye = vec3(eyeX, eyeY, eyeZ);
  modelViewMatrix = lookAt(eye, at, up);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.drawArrays(gl.LINES, 160, 2); // x축
  gl.drawArrays(gl.LINES, 162, 2); // y축



  if(isRobot == 1){
    
    for(var i = 0; i < numNodes; i++){
      initNodes(i,0,0,0);
    }
    walk();
    seeSky();
    sideBySide();
    traverse(TorsoId);
  }
  
  if(isRobot == 2){

    for(var i = 0; i < numNodes; i++){
      if( (isSideBySide == 1) && (i == RightUpperArmId) ){
        initNodes(RightUpperArmId,0,0,1);
      }
      else if( (isSpinHead == 1) && (i == HeadId) ){
        initNodes(HeadId,0,1,0);
      }
      else if( (isSpinHead == 2) && (i == HeadId) ){
        initNodes(HeadId,0,1,0);
      }
      else if( (isSideBySide == 2) && (i == RightUpperArmId) ){
        initNodes(RightUpperArmId,0,0,1);
      }
      else {
        initNodes(i,0,0,0);
      }
    }
    spinHead(1);
    sideBySide();
    traverse(TorsoId);
  
    distanceBetweenRobot = -distanceBetweenRobot;

    for(var i = 0; i < numNodes; i++){
      if( (isSideBySide == 1) && (i == RightUpperArmId) ){
        initNodes(RightUpperArmId,0,0,1);
      }
      else if( (isSpinHead == 1) && (i == HeadId) ){
        initNodes(HeadId,0,1,0);
      }
      else if( (isSpinHead == 2) && (i == HeadId) ){
        initNodes(HeadId,0,1,0);
      }
      else if( (isSideBySide == 1) && (i == RightUpperArmId) ){
        initNodes(RightUpperArmId,0,0,1);
      }
      else {
        initNodes(i,0,0,0);
      }
    }
    spinHead(2);
    sideBySide();
    traverse(TorsoId);

    copy();
    walk();
    
  }

  requestAnimationFrame(render); //요기는 강의노트와 스펠링이 다름
}
