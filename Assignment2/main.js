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

let cube = new THREE.Mesh( custom_cube_geometry, phong_material );
scene.add(cube);

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

// Create a LineSegments object with the geometry
const line = new THREE.LineSegments(wireframe_geometry);

line.position.x = 10

// Add the wireframe to the scene
scene.add(line);

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
  cube.visible = visible;
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

let c = new THREE.Mesh(custom_cube_geometry, phong_material)
c.position.x = 2;
c.applyMatrix4(scalingMatrix(1.0,1.5,1.0))
scene.add(c)

const scaleH = 1.5
let tiltAngle = THREE.MathUtils.degToRad(10);

let translation = translationMatrix(0, 2*(scaleH/2.0), 0); // Translate 2l units in the y direction
let model_transformation = new THREE.Matrix4(); // model transformation matrix we will update
for (let i = 0; i < cubes.length; i++) {
  
	cubes[i].matrix.copy(model_transformation)
  model_transformation.multiplyMatrices(translation, model_transformation);
}

model_transformation = new THREE.Matrix4();
for (let i = 0; i < cubes.length; i++) {
  
	cubes_wireframe[i].matrix.copy(model_transformation)
  model_transformation.multiplyMatrices(translation, model_transformation);
}

// model_transformation = new THREE.Matrix4();
let scale = scalingMatrix(1.0,scaleH, 1.0); // Translate 2l units in the y direction
for (let i = 0; i < cubes.length; i++) {
	cubes[i].matrix.multiply(scale)
}


for (let i = 0; i < cubes.length; i++) {
	cubes_wireframe[i].matrix.multiply(scale)
}

// for (let i = 1; i < cubes.length; i++) {
//   cubes[i].applyMatrix4(translationMatrix(0,1,0))   
// 	cubes[i].applyMatrix4(rotationMatrixZ(i*tiltAngle))
// }

// for (let i = 1; i < cubes.length; i++) {
//   let dis = cubes_wireframe[i].position.x
//   let disY = Math.cos(tiltAngle)*1.5
//   let disX = Math.sin(tiltAngle)*1
//   console.log(disY)
//   cubes_wireframe[i].applyMatrix4(translationMatrix(0,-1.5 * i + 0.75,0))   
// 	cubes_wireframe[i].applyMatrix4(rotationMatrixZ(i*tiltAngle))
//   cubes_wireframe[i].applyMatrix4(translationMatrix(-disX*(i-1),disY*i-0.75,0))
// }


function animate() {
    
	renderer.render( scene, camera );
  controls.update();

  // TODO
  // Animate the cube
  if(!visible){
    for (let i = 0; i < 7; i++){
      cubes[i].visible = true;
      cubes_wireframe[i].visible = false;
    }
  }
  else if(visible){
    for (let i = 0; i < 7; i++){
      cubes_wireframe[i].visible = true;
      cubes[i].visible = false;
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