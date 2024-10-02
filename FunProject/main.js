import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import {Player} from './player.js'
import {touchingPlayerBallTouch} from './helpfulFunctions.js'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OBB } from 'three/examples/jsm/math/OBB'

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


//Adding in temporary mesh for testing purposes
const geometry = new THREE.BoxGeometry(1, 2, 3)
geometry.computeBoundingBox()

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(4, 10, 0)
mesh.geometry.userData.obb = new OBB().fromBox3(
    mesh.geometry.boundingBox
)

mesh.userData.obb = new OBB()
scene.add(mesh)

const mesh2 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
)
mesh2.position.set(-3, 10, 0)
mesh2.geometry.userData.obb = new OBB().fromBox3(
    mesh2.geometry.boundingBox
)
mesh2.userData.obb = new OBB()
scene.add(mesh2)

// Create a circle geometry
const ballGeometry2 = new THREE.SphereGeometry(radius, segments, 32);

// Create a material
const materialBall2 = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });

// Create a mesh
const ball2 = new THREE.Mesh(ballGeometry2, materialBall2);

ball2.position.set(-3, 10, 0)

scene.add(ball2)

const clock = new THREE.Clock()

function animate() {
    mesh.position.x = Math.sin(clock.getElapsedTime() * 0.5) * 4

    controls.update()

    mesh.userData.obb.copy(mesh.geometry.userData.obb)
    mesh2.userData.obb.copy(mesh2.geometry.userData.obb)
    mesh.userData.obb.applyMatrix4(mesh.matrixWorld)
    mesh2.userData.obb.applyMatrix4(mesh2.matrixWorld)
    if (mesh.userData.obb.intersectsOBB(mesh2.userData.obb)) {
        mesh.material.color.set(0xff0000)
        console.log("TOUCHING")
    } else {
        mesh.material.color.set(0x00ff00)
        console.log("NO TOUCHING")
    }

    if (mesh.userData.obb.intersectsSphere(ball2.geometry)) {
        ball2.material.color.set(0xff0000)
        console.log("TOUCHING")
    } else {
        ball2.material.color.set(0x00ff00)
        console.log("NO TOUCHING")
    }

    mesh.rotateY(0.01)
    mesh2.rotateY(-0.005)

    if(ball.position.x < -(width/2-radius)){
        speedX = Math.random()*(speedCap/2.0) + (speedCap/2.0)
    }else if(ball.position.x > (width/2-radius)){
        speedX = Math.random()*(speedCap/2.0) + (speedCap/2.0)
        speedX *=-1;
    }
    if(ball.position.y < -(height/2-radius)){
        speedY = Math.random()*(speedCap/2.0) + (speedCap/2.0)
    }else if(ball.position.y > (height/2-radius)){
        speedY = Math.random()*(speedCap/2.0) + (speedCap/2.0) 
        speedY *=-1;
    }

    if(touchingPlayerBallTouch(player, ball, boxArea)){
        speedX *=-1;
        ball.position.x += speedX;
        ball.position.y += speedY;
    }
    else{
        ball.position.x += speedX;
        ball.position.y += speedY;
    }

    if (player.position.y + speedPlayer <= 2 && player.position.y + speedPlayer >= -2){
        player.position.y += speedPlayer;
    }

    speedCap+=0.00001
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );