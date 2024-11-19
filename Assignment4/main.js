import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, -8);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);


class Texture_Rotate {
    vertexShader() {
        return `
        uniform sampler2D uTexture;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
        `;
    }

    fragmentShader() {
        return `
        uniform sampler2D uTexture;
        uniform float animation_time;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {    
            float speed = (-4.0*3.14159)/15.0;
            //vRotate the texture map around the center of each face at a rate of 8 rpm.
            // Angle that is the speed times the animation time and mod to prevent the rotation angle from going on forever.
            float angle = mod(speed*animation_time, 2.0*3.14159);

            // Create a new vector2 for storing the vector that will be used for doing all the translation
            // Create a centered to translate the values to the center to have the proper effect
            vec2 new_vUv;
            vec2 centered =  vUv - vec2(0.5,0.5);

            // Perform the rotations based on 2D rotation matrix
            new_vUv.x = centered.x * cos(angle) - centered.y * sin(angle);
            new_vUv.y = centered.x * sin(angle) + centered.y * cos(angle);

            // Return the vector back to the center
            new_vUv += vec2(0.5, 0.5);

            // Load the texture color from the texture map using texture2D function to get the color of the texture at the current UV coordinates
            vec4 tex_color = texture2D(uTexture, new_vUv);
            
            // Add the outline of a black square in the center of each texture that moves with the texture
            // Tell whether the current pixel is within the black square or not using the UV coordinates
            //       If the pixel is within the black square, set the tex_color to vec4(0.0, 0.0, 0.0, 1.0)

            // Side length is 0.7 and border thickness is 0.1 because we subtract the min and max bound from the border min and max
            float side_length = 0.7;
            float border_thickness = 0.1;

            vec2 center = vec2(0.5, 0.5);

            // Finds the minimum and max bounds for the edges of the rectangle
            vec2 minBound = center - vec2(side_length / 2.0);
            vec2 maxBound = center + vec2(side_length / 2.0);

            // Finds the inner min and inner max for the inner square
            vec2 innerMin = minBound + vec2(border_thickness);
            vec2 innerMax = maxBound - vec2(border_thickness);

            // Checks if texture is on the square and in the inner square
            bool inSquare = (new_vUv.x >= minBound.x && new_vUv.x <= maxBound.x &&
                    new_vUv.y >= minBound.y && new_vUv.y <= maxBound.y);
            bool inInnerSquare = (new_vUv.x >= innerMin.x && new_vUv.x <= innerMax.x &&
                    new_vUv.y >= innerMin.y && new_vUv.y <= innerMax.y);

            // Set the color based on whether the fragment is in the border region
            //if it is in the square and not in the inner square, make the black border. Otherwise it will make the texture. 
            if (inSquare && !inInnerSquare) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black border
            } else {
                gl_FragColor = tex_color; // Default texture color
            }
        }
        `;
    }
}


class Texture_Scroll_X {
    vertexShader() {
        return `
        uniform sampler2D uTexture;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
        `;
    }

    fragmentShader() {
        return `
        uniform sampler2D uTexture;
        uniform float animation_time;
        // uniform float scroll_speed = 2.0
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            // Shrink the texuture by 50% so that the texture is repeated twice in each direction
            vec2 new_vUv = vUv * 2.0;

            // Translate the texture varying the s texture coordinate by 4 texture units per second, 
            float scroll_speed = -4.0;
            new_vUv.x = mod(new_vUv.x + animation_time * scroll_speed, 1.0);

            // Load the texture color from the texture map
            // Use texture2D function to get the color of the texture at the current UV coordinates
            vec4 tex_color = texture2D(uTexture, new_vUv);
            

            // Does the tile square
            vec2 tileUv = mod(new_vUv, 1.0);              // Get UV within a single tile

            
            vec2 center = vec2(0.5,0.5);

            // Define the bounds of the black square
            float side_length = 0.7;

            // Finds the minimum and max bounds for the edges of the rectangle
            vec2 minBound = center - vec2(side_length / 2.0);
            vec2 maxBound = center + vec2(side_length / 2.0);

            float border_thickness = 0.1; // Since the innerMin and innerMax add and subtract the vec2 border thickness, it gives it a thickness of 0.2

            // Define the bounds of the black border
            vec2 innerMin = minBound + vec2(border_thickness);
            vec2 innerMax = maxBound - vec2(border_thickness);

            // Determine if the fragment is in the black border region
            bool inSquare = (tileUv.x >= minBound.x && tileUv.x <= maxBound.x &&
                            tileUv.y >= minBound.y && tileUv.y <= maxBound.y);
            bool inInnerSquare = (tileUv.x >= innerMin.x && tileUv.x <= innerMax.x &&
                                tileUv.y >= innerMin.y && tileUv.y <= innerMax.y);

            // Create  new texture color
            vec4 textureColor = texture2D(uTexture, new_vUv);

            if (inSquare && !inInnerSquare) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black border
            } else {
                gl_FragColor = textureColor; // Default texture color
            }
        }
        `;
    }
}

let animation_time = 0.0;

const cube1_geometry = new THREE.BoxGeometry(2, 2, 2);

// Load texture map 
const cube1_texture = new THREE.TextureLoader().load('assets/stars.png');

// Apply Texture Filtering Techniques to Cube 1
cube1_texture.minFilter = THREE.NearestFilter
cube1_texture.magFilter = THREE.NearestFilter

// Enable texture repeat wrapping for Cube 1
cube1_texture.wrapS = THREE.RepeatWrapping;
cube1_texture.wrapT = THREE.RepeatWrapping;

const cube1_uniforms = {
    uTexture: { value: cube1_texture },
    animation_time: { value: animation_time }
};
const cube1_shader = new Texture_Rotate();
const cube1_material = new THREE.ShaderMaterial({
    uniforms: cube1_uniforms,
    vertexShader: cube1_shader.vertexShader(),
    fragmentShader: cube1_shader.fragmentShader(),
});

const cube1_mesh = new THREE.Mesh(cube1_geometry, cube1_material);
cube1_mesh.position.set(2, 0, 0)
scene.add(cube1_mesh);

const cube2_geometry = new THREE.BoxGeometry(2, 2, 2);

// A Load texture map 
const cube2_texture = new THREE.TextureLoader().load('assets/earth.gif');

// Apply Texture Filtering Techniques to Cube 2
cube2_texture.minFilter = THREE.LinearMipMapLinearFilter

// TODO: 2.a Enable texture repeat wrapping for Cube 2
cube2_texture.wrapS = THREE.RepeatWrapping;
cube2_texture.wrapT = THREE.RepeatWrapping;

const cube2_uniforms = {
    uTexture: { value: cube2_texture },
    animation_time: { value: animation_time }
};
const cube2_shader = new Texture_Scroll_X();
const cube2_material = new THREE.ShaderMaterial({
    uniforms: cube2_uniforms,
    vertexShader: cube2_shader.vertexShader(),
    fragmentShader: cube2_shader.fragmentShader(),
});

const cube2_mesh = new THREE.Mesh(cube2_geometry, cube2_material);
cube2_mesh.position.set(-2, 0, 0)
scene.add(cube2_mesh);

const clock = new THREE.Clock();
let cPressed = false;
let prevTime = 0;
let timeDiff = 0;

function animate() {
    controls.update();

    // TODO: 2.b&2.c Update uniform values
    // e.g. cube1_uniforms.animation_time.value = ...
    animation_time = clock.getElapsedTime()
    timeDiff = animation_time-prevTime;

    // console.log(animation_time)
    cube1_uniforms.animation_time.value = animation_time;
    cube2_uniforms.animation_time.value = animation_time;


    // TODO: 2.e Rotate the cubes if the key 'c' is pressed to start the animation
    // Cube #1 should rotate around its own X-axis at a rate of 15 rpm.
    // Cube #2 should rotate around its own Y-axis at a rate of 40 rpm
    if(cPressed){
        cube1_mesh.rotation.x += -1.57079*timeDiff;// 1.57057 is approximately 15 rpm
        cube2_mesh.rotation.y += (4.1887902*timeDiff) // 4.1887902 is approximately 40 rpm
    }

    renderer.render(scene, camera);
    prevTime = animation_time;
}

renderer.setAnimationLoop(animate);

// TODO: 2.e Keyboard Event Listener
// Press 'c' to start and stop the rotating both cubes
window.addEventListener('keydown', onKeyPress);
function onKeyPress(event) {
    console.log(event.key)
    switch (event.key) {
        // ...
        case 'c':
            // console.log("HIHIH")
            cPressed = !cPressed;
            break;
    }
}