import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import {Player} from './player.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const geometryPlayer = new THREE.BoxGeometry( 1, 2, 1 );
const materialPlayer = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const player = new THREE.Mesh( geometryPlayer, materialPlayer );
player.position.set(-5,0,0)
scene.add( player );

//Collions detection
let boxArea = [0.5, 1, 0.5] // distance from the edges of the cube in length, width and height

const geometryPlay = new THREE.BoxGeometry( 1, 2, 1 );
const materialPlay = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const play = new THREE.Mesh( geometryPlay, materialPlay );
play.position.set(-5,0,0)
scene.add( play );

let a = new Player(play, 10, 0, 0)

const geometryPlayer2 = new THREE.BoxGeometry( 1, 2, 1 );
const materialPlayer2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const player2 = new THREE.Mesh( geometryPlayer2, materialPlayer2 );
player2.position.set(5,0,0)
scene.add( player2 );

camera.position.z = 5;

// Create a circle geometry
const radius = 0.5; // Radius of the circle
const segments = 32; // Number of segments to make the circle smooth
const ballGeometry = new THREE.SphereGeometry(radius, segments, 32);

// Create a material
const materialBall = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });

// Create a mesh
const ball = new THREE.Mesh(ballGeometry, materialBall);

// Add the circle to the scene
scene.add(ball);

//Adding Line
const materialLine = new THREE.LineBasicMaterial( { color: 0x0000ff } );

let width = 10;
let height = 6

const points = [];
points.push( new THREE.Vector3( -width/2, -height/2, 0 ) );
points.push( new THREE.Vector3( width/2, -height/2, 0 ) );
points.push( new THREE.Vector3( width/2, height/2, 0 ) );
points.push( new THREE.Vector3( -width/2, height/2, 0 ) );
points.push( new THREE.Vector3( -width/2, -height/2, 0 ) );

const geometryLine = new THREE.BufferGeometry().setFromPoints( points );

const line = new THREE.Line( geometryLine, materialLine );

scene.add( line );

const loader = new FontLoader();
loader.load('https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new TextGeometry('Hello World!', {
        font: font,
        size: 5,
        height: 0.05,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 0.005,
        bevelOffset: 0,
        bevelSegments: 10
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-15, 5, -50);
    scene.add(textMesh);
});

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let speedPlayer = 0;

document.body.addEventListener('keydown', (event) => {
    if(event.key == "ArrowDown" && player.position.y >= -2){
        speedPlayer = -0.1;
    }
    else if(event.key == "ArrowUp" && player.position.y <= 2){
        speedPlayer = 0.1;
    }
    else{
        speedPlayer = 0;
    }
});

document.body.addEventListener('keyup', (event) => {
    if(event.key == "ArrowDown" || event.key == "ArrowUp"){
        speedPlayer = 0;
    }
});

let speedX = 0.1;
let speedY = 0.1;

let x = 0;

// Adding controls for the camera
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 10); // Where the camera is.
controls.target.set(0, 0, 0); // Where the camera is looking towards.

let speedCap = 0.1

function animate() {

    if(ball.position.x < -(width/2-radius)){
        speedX = Math.random()*(speedCap/2.0) + (speedCap/2.0)
        if(speedY < 0){
            speedY = Math.sqrt(Math.pow(speedCap,2)-speedX*speedX) * -1;
            console.log("GOING DOWN", speedY)
        }
        else{
            speedY = Math.sqrt(Math.pow(speedCap,2)-speedX*speedX);
            console.log("GOING DOWN", speedY)
        }
    }else if(ball.position.x >= (width/2-radius)){
        speedX = Math.random()*0.05 + 0.05
        speedX *=-1;
    }
    if(ball.position.y < -(height/2-radius)){
        speedY = Math.random()*0.05 + 0.05
    }else if(ball.position.y >= -(height/2-radius)){
        speedY = Math.random()*0.05 + 0.05
        speedY *=-1;
    }
    
    ball.position.x += speedX;
    ball.position.y += speedY;
    if (player.position.y + speedPlayer <= 2 && player.position.y + speedPlayer >= -2){
        player.position.y += speedPlayer;
    }

    if(Math.abs((player.position.y + boxArea[1]) - ball.position.y) < 0.01){
        console.log("touching")
    }

    speedCap+=0.00001
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );