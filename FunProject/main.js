import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

//Adding Line
const materialLine = new THREE.LineBasicMaterial( { color: 0x0000ff } );

const points = [];
points.push( new THREE.Vector3( -5, -3, 0 ) );
points.push( new THREE.Vector3( 5, -3, 0 ) );
points.push( new THREE.Vector3( 5, 3, 0 ) );
points.push( new THREE.Vector3( -5, 3, 0 ) );
points.push( new THREE.Vector3( -5, -3, 0 ) );

const geometryLine = new THREE.BufferGeometry().setFromPoints( points );

const line = new THREE.Line( geometryLine, materialLine );

scene.add(geometryText)

scene.add( line );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let speedX = 0.1;
let speedY = 0.1;

// Adding controls for the camera
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 10); // Where the camera is.
controls.target.set(0, 5, 0); // Where the camera is looking towards.

function animate() {
	renderer.render( scene, camera );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    if(cube.position.x < -4.5){
        speedX = Math.random()*0.09 + 0.01
    }else if(cube.position.x > 4.5){
        speedX = Math.random()*0.09 + 0.01
        speedX *=-1;
    }
    if(cube.position.y < -2.5){
        speedY = Math.random()*0.09 + 0.01
    }else if(cube.position.y > 2.5){
        speedY = Math.random()*0.09 + 0.01
        speedY *=-1;
    }
    
    cube.position.x += speedX;
    cube.position.y += speedY;

    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );