# Assignment 1

## Explanation of Assignment 1:
This initial assignment, we will:

1. Set up the working environment.
   1. Install a package manager: `Node.js` and `npm`.
   2. Install `Three.js` for graphics
   3. Install `vite` to run your local web server.
2. Render a simple scene.
3. Get familiar with basic tips and debugging techniques.

The following steps are inspired by the [Three.js documentation](https://threejs.org/docs/#manual/en/introduction/Installation).

## Inital Part of Code:
### index.html
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Assignment1</title>
		<style>
			body { margin: 0; }
		</style>
	</head>
	<body>
		<script type="module" src="/main.js"></script>
	</body>
</html>
```

Each Three.js project requires at least one HTML file to structure the webpage, and a JavaScript file to execute the Three.js code. While the following structure and naming conventions are not mandatory, they will be used throughout the course for consistency.

### main.js
```javascript
import * as THREE from 'three'; // Imports the library that we will be using which is the Three.js

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}
```

### Example of first part of project:
![Untitled design](https://github.com/user-attachments/assets/74be88ff-3d4d-4fc1-9ae0-9f7e8390a381)

## Adding Axis:
```javascript
function createAxisLine(color, start, end) {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.Line(geometry, material);
}

// Create axis lines
const xAxis = createAxisLine(0xff0000, new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 0, 0)); // Red
const yAxis = createAxisLine(0x00ff00, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 5, 0)); // Green
const zAxis = createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 5)); // Blue

// Add axes to scene
scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);
```

## Adding Camera Controls:
```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//.....//
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 10); // Where the camera is.
controls.target.set(0, 5, 0); // Where the camera is looking towards.
//.....//
function animate() {
	controls.update(); // This will update the camera position and target based on the user input.
	//.....//
}
```

### Image of Final Product:
![image](https://github.com/user-attachments/assets/130bca9a-68e8-458e-83af-4add9e0c05bf)

## Getting Started
First, run the development server:

```bash
npm install
npx vite
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.
