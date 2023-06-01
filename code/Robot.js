"use strict";

var gl;

var theta = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var Torso = 0;
var Head = 1;
var LeftUpperArm = 2;
var LeftLowerArm = 3;
var LeftUpperLeg = 4;
var LeftLowerLeg = 5;
var RightUpperArm = 6;
var RightLowerArm = 7;
var RightUpperLeg = 8;
var RightLowerLeg = 9;

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

  render();
};

function torso() {
  var instanceMatrix = translate(0.0, 0.5 * TORSO_HEIGHT - 0.15, 0.0);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 0, 4); //Torso앞면
  gl.drawArrays(gl.LINE_LOOP, 4, 4); //Torso뒷면

  gl.drawArrays(gl.LINES, 8, 2); //Torso앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 10, 2); //Torso앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 12, 2); //Torso앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 14, 2); //Torso앞뒷면 연결-4

  return t;
}

function head() {
  var instanceMatrix = translate(0.0, 0.5 * (TORSO_HEIGHT + HEAD_HEIGHT), 0.0);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 16, 4); //Head앞면
  gl.drawArrays(gl.LINE_LOOP, 20, 4); //Head뒷면

  gl.drawArrays(gl.LINES, 24, 2); //Head앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 26, 2); //Head앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 28, 2); //Head앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 30, 2); //Head앞뒷면 연결-4

  return t;
}

function leftUpperArm() {
  var instanceMatrix = translate(
    -0.5 * (TORSO_WIDTH + UPPER_ARM_WIDTH),
    0.0,
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 32, 4); //Left upper arm앞면
  gl.drawArrays(gl.LINE_LOOP, 36, 4); //Left upper arm뒷면

  gl.drawArrays(gl.LINES, 40, 2); //Left upper arm앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 42, 2); //Left upper arm앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 44, 2); //Left upper arm앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 46, 2); //Left upper arm앞뒷면 연결-4

  return t;
}

function leftLowerArm() {
  var instanceMatrix = translate(
    0.0,
    -0.5 * (UPPER_ARM_HEIGHT + LOWER_ARM_HEIGHT),
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 48, 4); //Left lower arm앞면
  gl.drawArrays(gl.LINE_LOOP, 52, 4); //Left lower arm뒷면

  gl.drawArrays(gl.LINES, 56, 2); //Left lower arm앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 58, 2); //Left lower arm앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 60, 2); //Left lower arm앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 62, 2); //Left lower arm앞뒷면 연결-4

  return t;
}

function leftUpperLeg() {
  var instanceMatrix = translate(
    -0.5 * (BETWEEN_LEGS_WIDTH + UPPER_LEG_WIDTH),
    0.0,
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 64, 4); //Left upper leg앞면
  gl.drawArrays(gl.LINE_LOOP, 68, 4); //Left upper leg뒷면

  gl.drawArrays(gl.LINES, 72, 2); //Left upper leg앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 74, 2); //Left upper leg앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 76, 2); //Left upper leg앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 78, 2); //Left upper leg앞뒷면 연결-4

  return t;
}

function leftLowerLeg() {
  var instanceMatrix = translate(
    0.0,
    -0.5 * (UPPER_LEG_HEIGHT + LOWER_LEG_HEIGHT),
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 80, 4); //Left lower leg앞면
  gl.drawArrays(gl.LINE_LOOP, 84, 4); //Left lower leg뒷면

  gl.drawArrays(gl.LINES, 88, 2); //Left lower leg앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 90, 2); //Left lower leg앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 92, 2); //Left lower leg앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 94, 2); //Left lower leg앞뒷면 연결-4

  return t;
}

function rightUpperArm() {
  var instanceMatrix = translate(
    0.5 * (TORSO_WIDTH + UPPER_ARM_WIDTH),
    0.0,
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 96, 4); //Right upper arm앞면
  gl.drawArrays(gl.LINE_LOOP, 100, 4); //Right upper arm뒷면

  gl.drawArrays(gl.LINES, 104, 2); //Right upper arm앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 106, 2); //Right upper arm앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 108, 2); //Right upper arm앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 110, 2); //Right upper arm앞뒷면 연결-4

  return t;
}

function rightLowerArm() {
  var instanceMatrix = translate(
    0.0,
    -0.5 * (UPPER_ARM_HEIGHT + LOWER_ARM_HEIGHT),
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 112, 4); //Right lower arm앞면
  gl.drawArrays(gl.LINE_LOOP, 116, 4); //Right lower arm뒷면

  gl.drawArrays(gl.LINES, 120, 2); //Right lower arm앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 122, 2); //Right lower arm앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 124, 2); //Right lower arm앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 126, 2); //Right lower arm앞뒷면 연결-4

  return t;
}

function rightUpperLeg() {
  var instanceMatrix = translate(
    0.5 * (BETWEEN_LEGS_WIDTH + UPPER_LEG_WIDTH),
    0.0,
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 128, 4); //Right upper leg앞면
  gl.drawArrays(gl.LINE_LOOP, 132, 4); //Right upper leg뒷면

  gl.drawArrays(gl.LINES, 136, 2); //Right upper leg앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 138, 2); //Right upper leg앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 140, 2); //Right upper leg앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 142, 2); //Right upper leg앞뒷면 연결-4

  return t;
}

function rightLowerLeg() {
  var instanceMatrix = translate(
    0.0,
    -0.5 * (UPPER_LEG_HEIGHT + LOWER_LEG_HEIGHT),
    0.0
  );
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 144, 4); //Right lower leg앞면
  gl.drawArrays(gl.LINE_LOOP, 148, 4); //Right lower leg뒷면

  gl.drawArrays(gl.LINES, 152, 2); //Right lower leg앞뒷면 연결-1
  gl.drawArrays(gl.LINES, 154, 2); //Right lower leg앞뒷면 연결-2
  gl.drawArrays(gl.LINES, 156, 2); //Right lower leg앞뒷면 연결-3
  gl.drawArrays(gl.LINES, 158, 2); //Right lower leg앞뒷면 연결-4

  return t;
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  eye = vec3(eyeX, eyeY, eyeZ);
  modelViewMatrix = lookAt(eye, at, up);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  requestAnimationFrame(render); //요기는 강의노트와 스펠링이 다름
}
