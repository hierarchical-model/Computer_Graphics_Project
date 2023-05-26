"use strict";

var gl;

var theta = [0,0,0];
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 3;

var transX = 0;
var change_x = 0;
var transY = 0;
var change_y = 0;

var scaleSize = 1;

var modelViewMatrix;
var modelViewMatrixLoc;

var eyeX = 0;
var eyeY = 0;
var eyeZ = 4;
var eye = vec3(eyeX,eyeY,eyeZ);
var at = vec3(0,0,0);
var up = vec3(0,1,0);

var projectionMatrix;
var projectionMatirxLoc;

var lightPosition = vec4(1.0,1.0,1.0,0.0);
var lightAmbient = vec4(0.2,0.2,0.2,1.0);
var lightDiffuse = vec4(1.0,1.0,1.0,1.0);
var lightSpecular = vec4(1.0,1.0,1.0,1.0);

var materialAmbient = vec4(1.0,0.0,1.0,1.0);
var materialDiffuse = vec4(1.0,0.8,0.0,1.0);
var materialSpecular = vec4(1.0,0.8,0.0,1.0);
var materialShininess = 100.0;

var eyeLoc;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    // document.getElementById("rotationX").onclick = function(){
    //      axis = 0;
    //      change_x = 0;
    //      change_y = 0;
    //  }

    // document.getElementById("rotationY").onclick = function(){
    //     axis = 1;
    //     change_x = 0;
    //     change_y = 0;
    // }

    // document.getElementById("rotationZ").onclick = function(){
    //     axis = 2;
    //     change_x = 0;
    //     change_y = 0;
    // }

    // document.getElementById("right_move").onclick = function(){
    //     axis = 3;
    //     change_x = 0.003;
    //     change_y = 0;
    // }
    // document.getElementById("left_move").onclick = function(){
    //     axis = 3;
    //     change_x = -0.003;
    //     change_y = 0;
    // }
    // document.getElementById("up_move").onclick = function(){
    //     axis = 3;
    //     change_x = 0;
    //     change_y = 0.003;
    // }
    // document.getElementById("down_move").onclick = function(){
    //     axis = 3;
    //     change_x = 0;
    //     change_y = -0.003;
    // }

    // document.getElementById("scale+").onclick = function(){
    //     console.log(scaleSize);
    //     scaleSize = scaleSize + 0.1;
    //     if(scaleSize >= 2){//너무 큰 이니셜 방지
    //         scaleSize = 2;
    //     }
    // }
    
    // document.getElementById("scale-").onclick = function(){
    //     console.log(scaleSize);
    //     scaleSize = scaleSize - 0.1;
    //     if(scaleSize <= 0){//반전 방지
    //         scaleSize = 0;
    //     }
    // }
    
    // document.getElementById("pause").onclick = function(){
    //     axis = 3;
    //     change_x = 0;
    //     change_y = 0;
    // }

    document.getElementById("front_cam").onclick = function(){
        eyeX = 0;
        eyeY = 0;
        eyeZ = 4;
    }

    document.getElementById("side_cam").onclick = function(){
        eyeX = 4;
        eyeY = 0;
        eyeZ = 2.5
    }

    document.getElementById("top_cam").onclick = function(){
        eyeX = 0;
        eyeY = 3.5;
        eyeZ = 2;
        
    }

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    var vertices = [
        
        vec3(-0.8,0.5,0), // K-1
        vec3(-0.7,0.5,0), // K-2
        vec3(-0.7,0.15,0), // K-3
        vec3(-0.5,0.5,0), // K-4
        vec3(-0.4,0.5,0), // K-5
        vec3(-0.65,0,0), // K-6
        vec3(-0.4,-0.5,0), // K-7
        vec3(-0.5,-0.5,0), // K-8
        vec3(-0.7,-0.15,0), // K-9
        vec3(-0.7,-0.5,0), // K-10
        vec3(-0.8,-0.5,0), // K-11

        vec3(-0.8,0.5,0.1), // K-12
        vec3(-0.7,0.5,0.1), // K-13
        vec3(-0.7,0.15,0.1), // K-14
        vec3(-0.5,0.5,0.1), // K-15
        vec3(-0.4,0.5,0.1), // K-16
        vec3(-0.65,0,0.1), // K-17
        vec3(-0.4,-0.5,0.1), // K-18
        vec3(-0.5,-0.5,0.1), // K-19
        vec3(-0.7,-0.15,0.1), // K-20
        vec3(-0.7,-0.5,0.1), // K-21
        vec3(-0.8,-0.5,0.1), // K-22

        vec3(-0.8,0.5,0), // K-1
        vec3(-0.8,0.5,0.1), // K-12
        vec3(-0.7,0.5,0), // K-2
        vec3(-0.7,0.5,0.1), // K-13
        vec3(-0.7,0.15,0), // K-3
        vec3(-0.7,0.15,0.1), // K-14
        vec3(-0.5,0.5,0), // K-4
        vec3(-0.5,0.5,0.1), // K-15
        vec3(-0.4,0.5,0), // K-5
        vec3(-0.4,0.5,0.1), // K-16
        vec3(-0.65,0,0), // K-6
        vec3(-0.65,0,0.1), // K-17
        vec3(-0.4,-0.5,0), // K-7
        vec3(-0.4,-0.5,0.1), // K-18
        vec3(-0.5,-0.5,0), // K-8
        vec3(-0.5,-0.5,0.1), // K-19
        vec3(-0.8,-0.5,0), // K-11
        vec3(-0.8,-0.5,0.1), // K-22


        vec3(-0.2,0.5,0), // J-1
        vec3(-0.2,0.4,0), // J-2
        vec3(-0.08,0.4,0), // J-3
        vec3(-0.08,-0.3,0), // J-4
        vec3(-0.17,-0.3,0), // J-5
        vec3(-0.185,-0.1,0), // J-6
        vec3(-0.285,-0.1,0), // J-7
        vec3(-0.245,-0.35,0), // J-8
        vec3(-0.185,-0.5,0), // J-9
        vec3(-0.08,-0.5,0), // J-10
        vec3(-0.005,-0.35,0), // J-11
        vec3(-0.005,0.4,0), // J-12
        vec3(0.115,0.4,0), // J-13
        vec3(0.115,0.5,0), // J-14

        vec3(-0.2,0.5,0.1), // J-15
        vec3(-0.2,0.4,0.1), // J-16
        vec3(-0.08,0.4,0.1), // J-17
        vec3(-0.08,-0.3,0.1), // J-18
        vec3(-0.17,-0.3,0.1), // J-19
        vec3(-0.185,-0.1,0.1), // J-20
        vec3(-0.285,-0.1,0.1), // J-21
        vec3(-0.245,-0.35,0.1), // J-22
        vec3(-0.185,-0.5,0.1), // J-23
        vec3(-0.08,-0.5,0.1), // J-24
        vec3(-0.005,-0.35,0.1), // J-25
        vec3(-0.005,0.4,0.1), // J-26
        vec3(0.115,0.4,0.1), // J-27
        vec3(0.115,0.5,0.1), // J-28

        vec3(-0.2,0.5,0), // J-1
        vec3(-0.2,0.5,0.1), // J-15
        vec3(-0.2,0.4,0), // J-2
        vec3(-0.2,0.4,0.1), // J-16
        vec3(-0.08,0.4,0), // J-3
        vec3(-0.08,0.4,0.1), // J-17
        vec3(-0.08,-0.3,0), // J-4
        vec3(-0.08,-0.3,0.1), // J-18
        vec3(-0.17,-0.3,0), // J-5
        vec3(-0.17,-0.3,0.1), // J-19
        vec3(-0.185,-0.1,0), // J-6
        vec3(-0.185,-0.1,0.1), // J-20
        vec3(-0.285,-0.1,0), // J-7
        vec3(-0.285,-0.1,0.1), // J-21
        vec3(-0.245,-0.35,0), // J-8
        vec3(-0.245,-0.35,0.1), // J-22
        vec3(-0.185,-0.5,0), // J-9
        vec3(-0.185,-0.5,0.1), // J-23
        vec3(-0.08,-0.5,0), // J-10
        vec3(-0.08,-0.5,0.1), // J-24
        vec3(-0.005,-0.35,0), // J-11
        vec3(-0.005,-0.35,0.1), // J-25
        vec3(-0.005,0.4,0), // J-12
        vec3(-0.005,0.4,0.1), // J-26
        vec3(0.115,0.4,0), // J-13
        vec3(0.115,0.4,0.1), // J-27
        vec3(0.115,0.5,0), // J-14
        vec3(0.115,0.5,0.1), // J-28

        vec3(0.3,0.5,0), // H-1
        vec3(0.4,0.5,0), // H-2
        vec3(0.4,0.1,0), // H-3
        vec3(0.6,0.1,0), // H-4
        vec3(0.6,0.5,0), // H-5
        vec3(0.7,0.5,0), // H-6
        vec3(0.7,-0.5,0), // H-7
        vec3(0.6,-0.5,0), // H-8
        vec3(0.6,-0.1,0), // H-9
        vec3(0.4,-0.1,0), // H-10
        vec3(0.4,-0.5,0), // H-11
        vec3(0.3,-0.5,0), // H-12

        vec3(0.3,0.5,0.1), // H-13
        vec3(0.4,0.5,0.1), // H-14
        vec3(0.4,0.1,0.1), // H-15
        vec3(0.6,0.1,0.1), // H-16
        vec3(0.6,0.5,0.1), // H-17
        vec3(0.7,0.5,0.1), // H-18
        vec3(0.7,-0.5,0.1), // H-19
        vec3(0.6,-0.5,0.1), // H-20
        vec3(0.6,-0.1,0.1), // H-21
        vec3(0.4,-0.1,0.1), // H-22
        vec3(0.4,-0.5,0.1), // H-23
        vec3(0.3,-0.5,0.1), // H-24

        vec3(0.3,0.5,0), // H-1
        vec3(0.3,0.5,0.1), // H-13
        vec3(0.4,0.5,0), // H-2
        vec3(0.4,0.5,0.1), // H-14
        vec3(0.4,0.1,0), // H-3
        vec3(0.4,0.1,0.1), // H-15
        vec3(0.6,0.1,0), // H-4
        vec3(0.6,0.1,0.1), // H-16
        vec3(0.6,0.5,0), // H-5
        vec3(0.6,0.5,0.1), // H-17
        vec3(0.7,0.5,0), // H-6
        vec3(0.7,0.5,0.1), // H-18
        vec3(0.7,-0.5,0), // H-7
        vec3(0.7,-0.5,0.1), // H-19
        vec3(0.6,-0.5,0), // H-8
        vec3(0.6,-0.5,0.1), // H-20
        vec3(0.6,-0.1,0), // H-9
        vec3(0.6,-0.1,0.1), // H-21
        vec3(0.4,-0.1,0), // H-10
        vec3(0.4,-0.1,0.1), // H-22
        vec3(0.4,-0.5,0), // H-11
        vec3(0.4,-0.5,0.1), // H-23
        vec3(0.3,-0.5,0), // H-12
        vec3(0.3,-0.5,0.1), // H-24

        /* H's POINTS
        vec3(0.3,0.5,0), // H-1
        vec3(0.4,0.5,0), // H-2
        vec3(0.4,0.1,0), // H-3
        vec3(0.6,0.1,0), // H-4
        vec3(0.6,0.5,0), // H-5
        vec3(0.7,0.5,0), // H-6
        vec3(0.7,-0.5,0), // H-7
        vec3(0.6,-0.5,0), // H-8
        vec3(0.6,-0.1,0), // H-9
        vec3(0.4,-0.1,0), // H-10
        vec3(0.4,-0.5,0), // H-11
        vec3(0.3,-0.5,0), // H-12

        vec3(0.3,0.5,0.1), // H-13
        vec3(0.4,0.5,0.1), // H-14
        vec3(0.4,0.1,0.1), // H-15
        vec3(0.6,0.1,0.1), // H-16
        vec3(0.6,0.5,0.1), // H-17
        vec3(0.7,0.5,0.1), // H-18
        vec3(0.7,-0.5,0.1), // H-19
        vec3(0.6,-0.5,0.1), // H-20
        vec3(0.6,-0.1,0.1), // H-21
        vec3(0.4,-0.1,0.1), // H-22
        vec3(0.4,-0.5,0.1), // H-23
        vec3(0.3,-0.5,0.1), // H-24
        */

        /* J's POINTS
        vec3(-0.2,0.5,0), // J-1
        vec3(-0.2,0.4,0), // J-2
        vec3(-0.08,0.4,0), // J-3
        vec3(-0.08,-0.3,0), // J-4
        vec3(-0.17,-0.3,0), // J-5
        vec3(-0.185,-0.1,0), // J-6
        vec3(-0.285,-0.1,0), // J-7
        vec3(-0.245,-0.35,0), // J-8
        vec3(-0.185,-0.5,0), // J-9
        vec3(-0.08,-0.5,0), // J-10
        vec3(-0.005,-0.35,0), // J-11
        vec3(-0.005,0.4,0), // J-12
        vec3(0.115,0.4,0), // J-13
        vec3(0.115,0.5,0), // J-14

        vec3(-0.2,0.5,0.1), // J-15
        vec3(-0.2,0.4,0.1), // J-16
        vec3(-0.08,0.4,0.1), // J-17
        vec3(-0.08,-0.3,0.1), // J-18
        vec3(-0.17,-0.3,0.1), // J-19
        vec3(-0.185,-0.1,0.1), // J-20
        vec3(-0.285,-0.1,0.1), // J-21
        vec3(-0.245,-0.35,0.1), // J-22
        vec3(-0.185,-0.5,0.1), // J-23
        vec3(-0.08,-0.5,0.1), // J-24
        vec3(-0.005,-0.35,0.1), // J-25
        vec3(-0.005,0.4,0.1), // J-26
        vec3(0.115,0.4,0.1), // J-27
        vec3(0.115,0.5,0.1), // J-28
        */

        /* K's POINTS
        vec3(-0.8,0.5,0), // K-1
        vec3(-0.7,0.5,0), // K-2
        vec3(-0.5,0.5,0), // K-3
        vec3(-0.4,0.5,0), // K-4
        vec3(-0.8,-0.5,0), // K-5
        vec3(-0.7,-0.5,0), // K-6
        vec3(-0.5,-0.5,0), // K-7
        vec3(-0.4,-0.5,0), // K-8
        vec3(-0.7,0.15,0), // K-9
        vec3(-0.7,-0.15,0), // K-10
        vec3(-0.65,0,0), // K-11

        vec3(-0.8,0.5,0.1), // K-12
        vec3(-0.7,0.5,0.1), // K-13
        vec3(-0.5,0.5,0.1), // K-14
        vec3(-0.4,0.5,0.1), // K-15
        vec3(-0.8,-0.5,0.1), // K-16
        vec3(-0.7,-0.5,0.1), // K-17
        vec3(-0.5,-0.5,0.1), // K-18
        vec3(-0.4,-0.5,0.1), // K-19
        vec3(-0.7,0.15,0.1), // K-20
        vec3(-0.7,-0.15,0.1), // K-21
        vec3(-0.65,0,0.1), // K-22
        */

    ];
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(0.9,0.9,0.9,1.0); //screen 색깔 결정 - 회색(RGB투명도)

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );


    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrix = mat4();
    projectionMatrix = perspective(30,1,1,0);
    modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix");
    projectionMatirxLoc = gl.getUniformLocation(program,"projectionMatrix");
    
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatirxLoc, false, flatten(projectionMatrix));
    
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess );


    eyeLoc = gl.getUniformLocation(program, "eye");
    gl.uniform3fv(eyeLoc, eye);
    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 1.0;
    modelViewMatrix = rotateX(theta[xAxis]);
    modelViewMatrix = mult(modelViewMatrix, rotateY(theta[yAxis]));
    modelViewMatrix = mult(modelViewMatrix, rotateZ(theta[zAxis]));

    transX = transX + change_x;
    transY = transY + change_y; 
    modelViewMatrix = mult(modelViewMatrix, translate(transX,transY,0));

    modelViewMatrix = mult(modelViewMatrix, scalem(scaleSize,scaleSize,scaleSize));

    eye = vec3(eyeX,eyeY,eyeZ);
    modelViewMatrix = mult(modelViewMatrix, lookAt(eye,at,up));
    projectionMatrix = perspective(30,1,1,0);
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatirxLoc, false, flatten(projectionMatrix));
    gl.uniform3fv(eyeLoc, eye);
  
        
    
    gl.drawArrays(gl.LINE_LOOP,0,11);
    gl.drawArrays(gl.LINE_LOOP,11,11);

    gl.drawArrays(gl.LINES,22,2); // 
    gl.drawArrays(gl.LINES,24,2); //
    gl.drawArrays(gl.LINES,26,2); //  
    gl.drawArrays(gl.LINES,28,2); // 
    gl.drawArrays(gl.LINES,30,2); // 
    gl.drawArrays(gl.LINES,32,2); // 
    gl.drawArrays(gl.LINES,34,2); // 
    gl.drawArrays(gl.LINES,36,2); // 
    gl.drawArrays(gl.LINES,38,2); //


    gl.drawArrays(gl.LINE_LOOP,40,14);
    gl.drawArrays(gl.LINE_LOOP,54,14);

    gl.drawArrays(gl.LINES,68,2);
    gl.drawArrays(gl.LINES,70,2);
    gl.drawArrays(gl.LINES,72,2);
    gl.drawArrays(gl.LINES,74,2);
    gl.drawArrays(gl.LINES,76,2);
    gl.drawArrays(gl.LINES,78,2);
    gl.drawArrays(gl.LINES,80,2);
    gl.drawArrays(gl.LINES,82,2);
    gl.drawArrays(gl.LINES,84,2);
    gl.drawArrays(gl.LINES,86,2);
    gl.drawArrays(gl.LINES,88,2);
    gl.drawArrays(gl.LINES,90,2);
    gl.drawArrays(gl.LINES,92,2);
    gl.drawArrays(gl.LINES,94,2);

    gl.drawArrays(gl.LINE_LOOP,96,12);
    gl.drawArrays(gl.LINE_LOOP,108,12);

    gl.drawArrays(gl.LINES,120,2);
    gl.drawArrays(gl.LINES,122,2);
    gl.drawArrays(gl.LINES,124,2);
    gl.drawArrays(gl.LINES,126,2);
    gl.drawArrays(gl.LINES,128,2);
    gl.drawArrays(gl.LINES,130,2);
    gl.drawArrays(gl.LINES,132,2);
    gl.drawArrays(gl.LINES,134,2);
    gl.drawArrays(gl.LINES,136,2);
    gl.drawArrays(gl.LINES,138,2);
    gl.drawArrays(gl.LINES,140,2);
    gl.drawArrays(gl.LINES,142,2);

    gl.drawArrays(gl.TRIANGLES,0,3);

    requestAnimationFrame(render);//요기는 강의노트와 스펠링이 다름


}
