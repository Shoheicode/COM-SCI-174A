import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const scene = new THREE.Scene();

//THREE.PerspectiveCamera( fov angle, aspect ratio, near depth, far depth );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 10);
controls.target.set(0, 5, 0);

// Rendering 3D axis
const createAxisLine = (color, start, end) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.Line(geometry, material);
};
//Creating the axis lines
const xAxis = createAxisLine(0xff0000, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 0, 0)); // Red
const yAxis = createAxisLine(0x00ff00, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, 0)); // Green
const zAxis = createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 3)); // Blue
scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);


// ***** Assignment 2 *****
// Setting up the lights
const pointLight = new THREE.PointLight(0xffffff, 100, 100);
pointLight.position.set(5, 5, 5); // Position the light
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0.5, .0, 1.0).normalize();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x505050);  // Soft white light
scene.add(ambientLight);

const phong_material = new THREE.MeshPhongMaterial({
    color: 0x00ff00, // Green color
    shininess: 100   // Shininess of the material
});


// Start here.

const l = 0.5
const positions = new Float32Array([
    // Front face
    -l, -l,  l, // 0
     l, -l,  l, // 1
     l,  l,  l, // 2
    -l,  l,  l, // 3

    // Left face
    -l, -l, -l, // 4
    -l, -l,  l, // 5
    -l,  l,  l, // 6 
    -l,  l, -l, // 7
  
    // Top face
    -l, l, -l, // 8
    -l, l,  l, // 9
     l, l, l, // 10 
     l, l, -l, // 11
  
    // Bottom face
    -l, -l, l, // 12
    -l, -l, -l, // 13
     l, -l, -l, // 14 
     l, -l, l, // 15
  
    // Right face
    l,  l, -l, // 16
    l,  l,  l, // 17
    l,  -l,  l, // 18
    l, -l, -l, // 19

     // Back face
    -l,  l, -l, // 20
     l,  l, -l, // 21
     l, -l, -l, // 22
    -l, -l, -l, // 23
  ]);
  
  const indices = [
    // Front face
    0, 1, 2,
    0, 2, 3,
  
    // Left face
    4, 5, 6,
    4, 6, 7,
  
    // Top face
    8, 9, 10,
    8, 10, 11,
  
    // Bottom face
    12, 13, 14,
    12, 14, 15,

    // Right face
    16, 17, 18,
    16, 18, 19,

    // Back face
    20, 21, 22,
    20, 22, 23,
  ];

  // Compute normals
  const normals = new Float32Array([
    // Front face
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
  
    // Left face
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
  
    // Top face
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
  
    // Bottom face
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
  
    // Right face
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // Back face
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
  ]);

const custom_cube_geometry = new THREE.BufferGeometry();
custom_cube_geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
custom_cube_geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
custom_cube_geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

const wireframe_vertices = new Float32Array([
  // Front face
  -l, -l, l,    l, -l, l,
  l, -l, l,    l, l, l,
  l, l, l,    -l, l, l,
  -l, l, l,    -l, -l, l,
  // Top face
  -l, l, -l,   -l, l, l,
  -l, l, l,    l, l, l,
  l, l, l,     l, l, -l,
  l, l, -l,    -l, l, -l,
  // Right face
  l, -l, -l,   l, -l, l,
  l, -l, l,    l, l, l,
  l, l, l,     l, l, -l,
  l, l, -l,    l, -l, -l,
  // Back face
  -l, -l, -l,   l, -l, -l,
  l, -l, -l,   l, l, -l,
  l, l, -l,    -l, l, -l,
  -l, l, -l,   -l, -l, -l,
  // Bottom face
  -l, -l, -l,  -l, -l, l,
  -l, -l, l,    l, -l, l,
  l, -l, l,     l, -l, -l,
  l, -l, -l,   -l, -l, -l,
  // Left face
  -l, -l, -l,   -l, l, -l,
  -l, l, -l,    -l, l, l,
  -l, l, l,    -l, -l, l
]);

// Create geometry from the vertices
const wireframe_geometry = new THREE.BufferGeometry();
wireframe_geometry.setAttribute('position', new THREE.BufferAttribute(wireframe_vertices, 3));

//translation matrix
function translationMatrix(tx, ty, tz) {
	return new THREE.Matrix4().set(
		1, 0, 0, tx,
		0, 1, 0, ty,
		0, 0, 1, tz,
		0, 0, 0, 1
	);
}
// TODO: Implement the other transformation functions.
function rotationMatrixZ(theta) {
	return new THREE.Matrix4().set(
    Math.cos(theta), -Math.sin(theta), 0, 0,
    Math.sin(theta), Math.cos(theta), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
	);
}

function scalingMatrix(sx, sy, sz) {
  return new THREE.Matrix4().set(
    sx, 0, 0, 0,
		0, sy, 0, 0,
		0, 0, sz, 0,
		0, 0, 0, 1
  );
}

//FOR VISIBILITY OF WIREFRAME
let visible = true;

let cubes = [];
for (let i = 0; i < 7; i++) {
	let cube = new THREE.Mesh(custom_cube_geometry, phong_material);
  cube.matrixAutoUpdate = false;
  cube.visible = !visible;
	cubes.push(cube);
	scene.add(cube);
}

let cubes_wireframe = [];
for (let i = 0; i < 7; i++){
  let cubeW = new THREE.LineSegments(wireframe_geometry);
  cubeW.matrixAutoUpdate = false;
  cubeW.visible = !visible;
  cubes_wireframe.push(cubeW);
  scene.add(cubeW);
}

//Stores the scale height value and the tilt angle
const scaleH = 1.5
let tiltAngle = THREE.MathUtils.degToRad(20);

// FOR NORMAL CUBES

/*
These values keep track of the height and width total that will change based on the angle
This is mainly because when we translate, we just need to keep track of the total height and width
that each block needs to move depending on the angle
*/
let heightTotal = 0
let widthTotal = 0
for (let i = 0; i < 7;i++){
  /* 
    Added Matrix Multiplier that will act as the main way to transform the cubes
  */
  let M = new THREE.Matrix4();
  let r = rotationMatrixZ(i*tiltAngle) // Gets the rotationZ angle matrix
  let s = scalingMatrix(1,scaleH,1) // Gets the scaling matrix
  M = M.multiplyMatrices(translationMatrix(0.5,0.5,0),M) // Multiplies the M matrix by the translation Matrix which moves the block to 0.5, 0.5
  
  M = M.multiplyMatrices(s, M) // Multiplies the M matrix by the Scale matrix which makes the block bigger in the y direction
  M = M.multiplyMatrices(r,M) // Multiplies the M matrix by the rotation matrix which makes the block around the z axis at the origin
  M = M.multiplyMatrices(translationMatrix(-0.5,-scaleH/2,0),M) // Moves the block back to it's original starting point 

  let rightAngle = THREE.MathUtils.degToRad(90) // gets the right angle to help with calculations later
  let pastTiltAngle = (i-1)*tiltAngle // Gets the past angle for the else statement which is needed for calculations
  let hyp = 1.5 // the hypotenuse, aka the height of the cube
  if(i <=1){ // Checks the first cube and applies the matrixs of translation to the cubes.
    M = M.multiplyMatrices(translationMatrix(0,i*1.5,0),M)
    if (i == 1){ // if the cube equals 1, we add the to the height total and move it to the left by none.
      heightTotal += 1.5
      widthTotal += 0
    }
  }
  else{ // Otherwise, we have a different formula we use to figure out the height that each cube needs to get to. 
    heightTotal += Math.sin(rightAngle - pastTiltAngle) * hyp // heightTotal += sin(PI - pastTiltAngle) * the height of the cube
    widthTotal += -Math.cos(rightAngle - pastTiltAngle) * hyp // widthTotal += cos(PI - pastTiltAngle) * the height to of the cube

    /* 
      Both these equations help figure out how much to move the cube from the the starting translation point after
      the cubes rotate since the rotated cubes height that you need to move up are different due to the fact that 
      the point that we are trying to get to ends up being lower than the traditioanl height of 1.5

      Thus, we have to add all the previous heights and the previous width to the current height in order for the
      code to translate well. 
    */
   
    //Have a variable to store the value of the translation matrix
    let newTranslation = translationMatrix(widthTotal,heightTotal,0)
    
    //Multiply the translation matrix to the current M
    M = M.multiplyMatrices(newTranslation,M) 
  }

  //Apply the multiplication matrix that has all the scales and translations in it.
  cubes[i].matrix.copy(M)
}

//FOR WIRE FRAME CUBES
let heightTotal2 = 0
let widthTotal2 = 0
for (let i = 0; i < 7;i++){
  let M = new THREE.Matrix4();
  let r = rotationMatrixZ(i*tiltAngle)
  let s = scalingMatrix(1,1.5,1)
  M = M.multiplyMatrices(translationMatrix(0.5,0.5,0),M)
  
  M = M.multiplyMatrices(s, M)
  M = M.multiplyMatrices(r,M)
  M = M.multiplyMatrices(translationMatrix(-0.5,-0.75,0),M)

  let rightAngle = THREE.MathUtils.degToRad(90)
  let pastTiltAngle = (i-1)*tiltAngle
  let hyp = 1.5
  if(i <=1){
    M = M.multiplyMatrices(translationMatrix(0,i*1.5,0),M)
    if (i == 1){
      heightTotal2 += 1.5
      widthTotal2 += 0
    }
  }
  else{
    heightTotal2 += Math.sin(rightAngle - pastTiltAngle) * hyp
    widthTotal2 += -Math.cos(rightAngle - pastTiltAngle) * hyp

    M = M.multiplyMatrices(translationMatrix(widthTotal2,heightTotal2,0),M)
  }
  cubes_wireframe[i].matrix.copy(M)
}

let animation_time = 0;
let delta_animation_time;
let rotation_angle;
const clock = new THREE.Clock();

let MAX_ANGLE = THREE.MathUtils.degToRad(10) // 10 degrees converted to radians
let T = 3 // oscilation persiod in seconds

function timeToRotate(a_time){
    //Using a per
    let time = Math.cos((a_time*Math.PI)/T + Math.PI)
    return (0.5) + 0.5*time
}

function animate() {

  //For time keeping
  delta_animation_time = clock.getDelta();

  //Checks if the pause/still button is pressed and if it was pressed or the thing is paused, it will stop moving.
  if(!still){
    animation_time += delta_animation_time; 
  }
    
  //Updates the renderer and makes it animate
	renderer.render( scene, camera );
  controls.update();
  
  // Converts the time to a percentage of how much to rotate at a given time
  let rotation_angle = timeToRotate(animation_time) * MAX_ANGLE

  // TODO
  // Animate the cube
  if(!visible){
    for (let i = 0; i < 7; i++){
      cubes[i].visible = true;
      cubes_wireframe[i].visible = false;
    }
    // FOR NORMAL CUBES
    let heightTotal = 0
    let widthTotal = 0
    for (let i = 0; i < 7;i++){
      let M = new THREE.Matrix4();
      let r = rotationMatrixZ(i*rotation_angle)
      let s = scalingMatrix(1,1.5,1)
      M = M.multiplyMatrices(translationMatrix(0.5,0.5,0),M)
      
      M = M.multiplyMatrices(s, M)
      M = M.multiplyMatrices(r,M)
      M = M.multiplyMatrices(translationMatrix(-0.5,-0.75,0),M)

      let rightAngle = THREE.MathUtils.degToRad(90)
      let pastrotation_angle = (i-1)*rotation_angle
      let hyp = 1.5
      if(i <=1){
        M = M.multiplyMatrices(translationMatrix(0,i*1.5,0),M)
        if (i == 1){
          heightTotal += 1.5
          widthTotal += 0
        }
      }
      else{
        console.log("SIN: " + Math.sin(THREE.MathUtils.degToRad(90)-(i-1)*rotation_angle)*hyp)
        console.log("COS: " + Math.cos(THREE.MathUtils.degToRad(90) -(i-1)*rotation_angle)*hyp)
        heightTotal += Math.sin(rightAngle - pastrotation_angle) * hyp
        widthTotal += -Math.cos(rightAngle - pastrotation_angle) * hyp

        M = M.multiplyMatrices(translationMatrix(widthTotal,heightTotal,0),M)
      }
      cubes[i].matrix.copy(M)
    }
  }
  else if(visible){
    for (let i = 0; i < 7; i++){
      cubes_wireframe[i].visible = true;
      cubes[i].visible = false;
    }
    //FOR WIRE FRAME CUBES
    let heightTotal2 = 0
    let widthTotal2 = 0
    for (let i = 0; i < 7;i++){
      let M = new THREE.Matrix4();
      let r = rotationMatrixZ(i*rotation_angle)
      let s = scalingMatrix(1,1.5,1)
      M = M.multiplyMatrices(translationMatrix(0.5,0.5,0),M)
      
      M = M.multiplyMatrices(s, M)
      M = M.multiplyMatrices(r,M)
      M = M.multiplyMatrices(translationMatrix(-0.5,-0.75,0),M)

      let rightAngle = THREE.MathUtils.degToRad(90)
      let pastrotation_angle = (i-1)*rotation_angle
      let hyp = 1.5
      if(i <=1){
        M = M.multiplyMatrices(translationMatrix(0,i*1.5,0),M)
        if (i == 1){
          heightTotal2 += 1.5
          widthTotal2 += 0
        }
      }
      else{
        console.log("I VALUE CUBE:" + i)
        console.log(heightTotal)
        console.log("BEFORE WIDTH: " + widthTotal)
        console.log("SIN: " + Math.sin(THREE.MathUtils.degToRad(90)-(i-1)*rotation_angle)*hyp)
        console.log("COS: " + Math.cos(THREE.MathUtils.degToRad(90) -(i-1)*rotation_angle)*hyp)
        heightTotal2 += Math.sin(rightAngle - pastrotation_angle) * hyp
        widthTotal2 += -Math.cos(rightAngle - pastrotation_angle) * hyp

        M = M.multiplyMatrices(translationMatrix(widthTotal2,heightTotal2,0),M)
        console.log(heightTotal)
        console.log("AFTER WIDTH: " + widthTotal)
      }
      cubes_wireframe[i].matrix.copy(M)
    }
  }

}
renderer.setAnimationLoop( animate );

// TODO: Add event listener

let still = false;
window.addEventListener('keydown', onKeyPress); // onKeyPress is called each time a key is pressed
// Function to handle keypress
function onKeyPress(event) {
    switch (event.key) {
        case 's': // Note we only do this if s is pressed.
            still = !still;
            break;
        case 'w': //Handles the wireframe and allows for the object to change
            visible = !visible;
            break;
        default:
            console.log(`Key ${event.key} pressed`);
    }
}