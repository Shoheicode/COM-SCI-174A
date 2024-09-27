import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let speedX = 0.1;
let speedY = 0.1;

function animate() {
	renderer.render( scene, camera );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    if(cube.position.x < -5){
        speedX = Math.random()*0.09 + 0.01
    }else if(cube.position.x > 5){
        speedX = Math.random()*0.09 + 0.01
        speedX *=-1;
    }
    if(cube.position.y < -3){
        speedY = Math.random()*0.09 + 0.01
    }else if(cube.position.y > 3){
        speedY = Math.random()*0.09 + 0.01
        speedY *=-1;
    }
    
    cube.position.x += speedX;
    cube.position.y += speedY;
}
renderer.setAnimationLoop( animate );