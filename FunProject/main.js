import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const geometryPlayer = new THREE.BoxGeometry( 1, 2, 1 );
const materialPlayer = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const player = new THREE.Mesh( geometryPlayer, materialPlayer );
player.position.set(-5,0,0)
scene.add( player );

const geometryPlayer2 = new THREE.BoxGeometry( 1, 2, 1 );
const materialPlayer2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const player2 = new THREE.Mesh( geometryPlayer2, materialPlayer2 );
player2.position.set(5,0,0)
scene.add( player2 );

camera.position.z = 5;

// Create a circle geometry
const radius = 1; // Radius of the circle
const segments = 32; // Number of segments to make the circle smooth
const ballGeometry = new THREE.CircleGeometry(radius, segments);

// Create a material
const materialBall = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });

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

let speed = 0;

document.body.addEventListener('keydown', (event) => {
    if(event.key == "ArrowDown"){
        speed = -0.1;
    }
    else if(event.key == "ArrowUp"){
        speed = 0.1;
    }
    else{
        speed = 0;
    }
});

document.body.addEventListener('keyup', (event) => {
    if(event.key == "ArrowDown" || event.key == "ArrowUp"){
        speed = 0;
    }
});

let speedX = 0.1;
let speedY = 0.1;

// Adding controls for the camera
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 10); // Where the camera is.
controls.target.set(0, 0, 0); // Where the camera is looking towards.

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
    if (player.position.y < -2.5){
        player.position.y = -2.5;
    } else if(player.position.y > 2.5){
        player.position.y = 2.5;
    }
    else{
        player.position.y += speed;
    }

    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );