"use strict";

var gl;

var theta = [0, 0, 0];
var Base = 0;
var LowerArm = 1;
var UpperArm = 2;

var modelViewMatrix;
var modelViewMatrixLoc;

var BASE_HEIGHT = 0.2;
var BASE_WIDTH = 1;
var LOWER_ARM_HEIGHT = 0.5;
var LOWER_ARM_WIDTH = 0.4;
var UPPER_ARM_HEIGHT = 0.3;
var UPPER_ARM_WIDTH = 0.2;

var dir1 = true; //rotation base 관련
var dir2 = true; //rotation lowerarm 관련
var dir3 = true; //rotation upperarm 관련

window.onload = function init() {
  document.getElementById("one").onclick = function () {
    dir1 = !dir1;
  };
  document.getElementById("two").onclick = function () {
    dir2 = !dir2;
  };
  document.getElementById("three").onclick = function () {
    dir3 = !dir3;
  };
  var canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }
  var vertices = [
    //base
    vec3(-0.5, 0.1, 0),
    vec3(-0.5, -0.1, 0),
    vec3(0.5, -0.1, 0),
    vec3(0.5, 0.1, 0),

    //lowerarm
    vec3(-0.2, 0.25, 0),
    vec3(-0.2, -0.25, 0),
    vec3(0.2, -0.25, 0),
    vec3(0.2, 0.25, 0),

    //upperarm
    vec3(-0.1, 0.15, 0),
    vec3(-0.1, -0.15, 0),
    vec3(0.1, -0.15, 0),
    vec3(0.1, 0.15, 0),
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
  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  render();
};

function base() {
  var instanceMatrix = translate(0.0, 0.5 * BASE_HEIGHT, 0.0);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 0, 4);
}

function lowerArm() {
  var instanceMatrix = translate(0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 4, 4);
}

function upperArm() {
  var instanceMatrix = translate(0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.LINE_LOOP, 8, 4);
}

var render = function () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  theta[Base] += dir1 ? 0 : 2.0;
  theta[LowerArm] += dir2 ? 0 : 2.0;
  theta[UpperArm] += dir3 ? 0 : 2.0;
  modelViewMatrix = rotate(theta[Base], 0, 1, 0);
  base();
  modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT, 0.0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm], 0, 0, 1));
  lowerArm();
  modelViewMatrix = mult(
    modelViewMatrix,
    translate(0.0, LOWER_ARM_HEIGHT, 0.0)
  );
  modelViewMatrix = mult(modelViewMatrix, rotate(theta[UpperArm], 0, 0, 1));
  upperArm();
  requestAnimFrame(render);
};
