import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enabled = true;
controls.minDistance = 10;
controls.maxDistance = 50;

function translationMatrix(tx, ty, tz) {
	return new THREE.Matrix4().set(
		1, 0, 0, tx,
		0, 1, 0, ty,
		0, 0, 1, tz,
		0, 0, 0, 1
	);
}

function rotationMatrixX(theta) {
    return new THREE.Matrix4().set(
        1, 0, 0, 0,
        0, Math.cos(theta), -Math.sin(theta), 0,
        0, Math.sin(theta), Math.cos(theta), 0,
        0, 0, 0, 1
    );
}

function rotationMatrixY(theta) {
    return new THREE.Matrix4().set(
        Math.cos(theta), 0, Math.sin(theta), 0,
        0, 1, 0, 0,
        -Math.sin(theta), 0, Math.cos(theta), 0,
        0, 0, 0, 1
    );
}

function rotationMatrixZ(theta) {
	return new THREE.Matrix4().set(
		Math.cos(theta), -Math.sin(theta), 0, 0,
		Math.sin(theta),  Math.cos(theta), 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	);
}

//List of the planets
let planets = [];
let clock = new THREE.Clock();
let attachedObject = null;
let blendingFactor = 0.1;
// Create additional variables as needed here

// Create the sun geometry 
let sunGeo = new THREE.SphereGeometry(1,32, 32);
// Create the material for the sun
let materialSun = new THREE.MeshBasicMaterial({ color: 0xffffff });
// Create the sphere sun mesh
let sphereSun = new THREE.Mesh(sunGeo, materialSun);
// Added the sun to the scene
scene.add(sphereSun);


// Added the Point Light that acts as the light source
let sunLight = new THREE.PointLight(0xff0000, 1, 0, 1);
// Sets the light to the center of the world
sunLight.position.set(0,0,0);
// Add the Sunlight to the Scene.
scene.add(sunLight)

// Create orbiting planets
// Create Planet 1: Flat-shaded Gray Planet
// Create the Geometry for the plant
let planet1Geo = new THREE.SphereGeometry(1,8,6);
// Material for the planet 1
let materialPlanet1 = new THREE.MeshPhongMaterial({ color: 0x808080, emissive: 0x000000,flatShading:true });
// Sphere Planet 1 mesh
let spherePlanet1 = new THREE.Mesh(planet1Geo, materialPlanet1);
scene.add(spherePlanet1)

// TODO: Create Planet 2: Swampy Green-Blue with Dynamic Shading
let planet2 = new THREE.SphereGeometry(1,8,8);
let materialPlanet2 = new THREE.MeshPhongMaterial({ color: 0x80FFFF, emissive: 0x000000,shininess: 40,specular: 0xffffff, });
let spherePlanet2 = new THREE.Mesh(planet2, materialPlanet2);
scene.add(spherePlanet2)

// Create Planet 3: Muddy Brown-Orange Planet with Ring
let planet3Geo = new THREE.SphereGeometry(1, 16, 16);
// Update the planet 3 material to be a phong material
let materialPlanet3 = createPhongMaterial(
    {
        color: new THREE.Color(0xB08040), 
        ambient: 0.0,
        diffusivity: 1.0, 
        specularity: 1.0,
        smoothness: 100.0
    }
)
// Create the mesh for the planet 3
let spherePlanet3 = new THREE.Mesh(planet3Geo, materialPlanet3);
scene.add(spherePlanet3)

// Planet 3 Ring
// Create the Geometry for the ring
let ringGeo = new THREE.RingGeometry(1.5, 2.5, 64);
// Called the function for creating the ring material
let materialRing = createRingMaterial();
// Planet 3 Ring mesh
let planet3Ring = new THREE.Mesh(ringGeo, materialRing);
spherePlanet3.add(planet3Ring)


// Create Planet 4: Soft Light Blue Planet
//Specifications of the Sphere Geometry of the Planet4
let planet4Geo = new THREE.SphereGeometry(1, 16, 16);
// Creating the phong material for the planet 4
let materialPlanet4 = createPhongMaterial(
    {
        color: new THREE.Color(0x0000D1), 
        ambient: 0.0,
        diffusivity: 1.0, 
        specularity: 1.0,
        smoothness: 100.0
    }
);
// Create the mesh for planet 4
let spherePlanet4 = new THREE.Mesh(planet4Geo, materialPlanet4);
scene.add(spherePlanet4)

// Create Planet 4's Moon
let moon = new THREE.SphereGeometry(1, 4, 2);
// Create the material for the moon
let materialMoon = new THREE.MeshPhongMaterial({ color: 0xC83CB9, emissive: 0x000000,flatShading:true });
// Created the actual moon object
let moonObj = new THREE.Mesh(moon, materialMoon);
scene.add(moonObj)

// Store planets and moon in an array for easy access, 
// e.g. { mesh: planet1, distance: 5, speed: 1 },]

// The first planet is out 5 units and each planet is 3 units out further from the prior one
// The speed is the inversely proportional to its distance. Thus, the speed is 5/(distance away from sun)
planets = [
    // TODO: Fill in the planet's data here
    {mesh: spherePlanet1, distance: 5, speed: 1},
    {mesh: spherePlanet2, distance: 8, speed: 5/8},
    {mesh: spherePlanet3, distance: 11, speed: 5/11},
    {mesh: spherePlanet4, distance: 14, speed: 5/14},
];

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

// Handle keyboard input
document.addEventListener('keydown', onKeyDown, false);

animate();

// TODO: Implement the Gouraud Shader for Planet 2
function createGouraudMaterial(materialProperties) {  
    // console.log(materialProperties)
    const numLights = 1;  
    // TODO: Implement the Vertex Shader in GLSL
    let vertexShader = `
        precision mediump float;
        const int N_LIGHTS = ${numLights};
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS];
        uniform vec4 light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale;
        uniform vec3 camera_center;
        varying vec3 N, vertex_worldspace;
        varying vec3 vColor;  // Varying to pass the calculated color to the fragment shader

        // ***** PHONG SHADING HAPPENS HERE: *****
        vec3 phong_model_lights(vec3 N, vec3 vertex_worldspace) {
            vec3 E = normalize(camera_center - vertex_worldspace);
            vec3 result = vec3(0.0);
            for(int i = 0; i < N_LIGHTS; i++) {
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                    light_positions_or_vectors[i].w * vertex_worldspace;
                float distance_to_light = length(surface_to_light_vector);
                vec3 L = normalize(surface_to_light_vector);
                vec3 H = normalize(L + E);
                float diffuse = max(dot(N, L), 0.0);
                float specular = pow(max(dot(N, H), 0.0), smoothness);
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light);
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                        + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        }

        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;

        void main() {
            N = normalize(mat3(model_transform) * normal / squared_scale);
            vertex_worldspace = (model_transform * vec4(position, 1.0)).xyz;
            vColor = shape_color.xyz * ambient;  // Start with ambient component
            vColor += phong_model_lights(N, vertex_worldspace);  // Add lighting calculation

            gl_Position = projection_camera_model_transform * vec4(position, 1.0);
        }
    `;
    // Fragment Shader
    let fragmentShader = `
        precision mediump float;
        varying vec3 vColor;  // Color interpolated from the vertex shader

        void main() {
            gl_FragColor = vec4(vColor, 1.0);  // Set color with full opacity
        }
    `;

    let shape_color = new THREE.Vector4(
        materialProperties.color.r, 
        materialProperties.color.g, 
        materialProperties.color.b,
        1.0
    );
    
    // Uniforms
    const uniforms = {
        ambient: { value: materialProperties.ambient },
        diffusivity: { value: materialProperties.diffusivity },
        specularity: { value: materialProperties.specularity },
        smoothness: { value: materialProperties.smoothness },
        shape_color: { value: shape_color },
        squared_scale: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
        camera_center: { value: new THREE.Vector3() },
        model_transform: { value: new THREE.Matrix4() },
        projection_camera_model_transform: { value: new THREE.Matrix4() },
        light_positions_or_vectors: { value: [] },
        light_colors: { value: [] },
        light_attenuation_factors: { value: [] }
    };

    // Create the ShaderMaterial using the custom vertex and fragment shaders
    return new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms
    });
}

// Custom Phong Shader has already been implemented, no need to make change.
function createPhongMaterial(materialProperties) {
    // console.log("PHONGGG")
    const numLights = 1;
    // Vertex Shader
    let vertexShader = `
        precision mediump float;
        const int N_LIGHTS = ${numLights};
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS];
        uniform vec4 light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale;
        uniform vec3 camera_center;
        varying vec3 N, vertex_worldspace;

        // ***** PHONG SHADING HAPPENS HERE: *****
        vec3 phong_model_lights(vec3 N, vec3 vertex_worldspace) {
            vec3 E = normalize(camera_center - vertex_worldspace);
            vec3 result = vec3(0.0);
            for(int i = 0; i < N_LIGHTS; i++) {
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                    light_positions_or_vectors[i].w * vertex_worldspace;
                float distance_to_light = length(surface_to_light_vector);
                vec3 L = normalize(surface_to_light_vector);
                vec3 H = normalize(L + E);
                float diffuse = max(dot(N, L), 0.0);
                float specular = pow(max(dot(N, H), 0.0), smoothness);
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light);
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                        + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        }

        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;

        void main() {
            gl_Position = projection_camera_model_transform * vec4(position, 1.0);
            N = normalize(mat3(model_transform) * normal / squared_scale);
            vertex_worldspace = (model_transform * vec4(position, 1.0)).xyz;
        }
    `;
    // Fragment Shader
    let fragmentShader = `
        precision mediump float;
        const int N_LIGHTS = ${numLights};
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS];
        uniform vec4 light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 camera_center;
        varying vec3 N, vertex_worldspace;

        // ***** PHONG SHADING HAPPENS HERE: *****
        vec3 phong_model_lights(vec3 N, vec3 vertex_worldspace) {
            vec3 E = normalize(camera_center - vertex_worldspace);
            vec3 result = vec3(0.0);
            for(int i = 0; i < N_LIGHTS; i++) {
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                    light_positions_or_vectors[i].w * vertex_worldspace;
                float distance_to_light = length(surface_to_light_vector);
                vec3 L = normalize(surface_to_light_vector);
                vec3 H = normalize(L + E);
                float diffuse = max(dot(N, L), 0.0);
                float specular = pow(max(dot(N, H), 0.0), smoothness);
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light);
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                        + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        }

        void main() {
            // Compute an initial (ambient) color:
            vec4 color = vec4(shape_color.xyz * ambient, shape_color.w);
            // Compute the final color with contributions from lights:
            color.xyz += phong_model_lights(normalize(N), vertex_worldspace);
            gl_FragColor = color;
        }
    `;

    let shape_color = new THREE.Vector4(
        materialProperties.color.r, 
        materialProperties.color.g, 
        materialProperties.color.b, 
        1.0
    );
    // Prepare uniforms
    const uniforms = {
        ambient: { value: materialProperties.ambient },
        diffusivity: { value: materialProperties.diffusivity },
        specularity: { value: materialProperties.specularity },
        smoothness: { value: materialProperties.smoothness },
        shape_color: { value: shape_color },
        squared_scale: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
        camera_center: { value: new THREE.Vector3() },
        model_transform: { value: new THREE.Matrix4() },
        projection_camera_model_transform: { value: new THREE.Matrix4() },
        light_positions_or_vectors: { value: [] },
        light_colors: { value: [] },
        light_attenuation_factors: { value: [] }
    };

    // Create the ShaderMaterial using the custom vertex and fragment shaders
    return new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms
    });
}

// TODO: Finish the custom shader for planet 3's ring with sinusoidal brightness variation
function createRingMaterial(materialProperties) {
    let vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    // TODO: Finish the fragment shader to create the brightness variation with sinine finction
    let fragmentShader = `
        uniform vec3 color;
        varying vec2 vUv;

        void main() {
            // Calculate the radial distance from the center
            float radius = length(vUv - vec2(0.5));
            
            // Sinusoidal brightness variation
            float frequency = 50.0;  // Adjust for more or fewer bands
            float brightness = 0.5 + 0.5 * sin(frequency * radius * 3.14159);  // Modulate brightness
            
            // Apply color with the sinusoidal brightness
            vec3 finalColor = color * brightness;
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    // TODO: Fill in the values to be passed in to create the custom shader
    return new THREE.ShaderMaterial({
        uniforms: {color: { value: new THREE.Color(0xB08040)}},
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide
    });
}

// This function is used to update the uniform of the planet's materials in the animation step. No need to make any change
function updatePlanetMaterialUniforms(planet) {
    const material = planet.material;
    if (!material.uniforms) return;

    const uniforms = material.uniforms;

    const numLights = 1;
    const lights = scene.children.filter(child => child.isLight).slice(0, numLights);
    // Ensure we have the correct number of lights
    if (lights.length < numLights) {
        console.warn(`Expected ${numLights} lights, but found ${lights.length}. Padding with default lights.`);
    }
    
    // Update model_transform and projection_camera_model_transform
    planet.updateMatrixWorld();
    camera.updateMatrixWorld();

    uniforms.model_transform.value.copy(planet.matrixWorld);
    uniforms.projection_camera_model_transform.value.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
    ).multiply(planet.matrixWorld);

    // Update camera_center
    uniforms.camera_center.value.setFromMatrixPosition(camera.matrixWorld);

    // Update squared_scale (in case the scale changes)
    const scale = planet.scale;
    uniforms.squared_scale.value.set(
        scale.x * scale.x,
        scale.y * scale.y,
        scale.z * scale.z
    );

    // Update light uniforms
    uniforms.light_positions_or_vectors.value = [];
    uniforms.light_colors.value = [];
    uniforms.light_attenuation_factors.value = [];

    for (let i = 0; i < numLights; i++) {
        const light = lights[i];
        if (light) {
            let position = new THREE.Vector4();
            if (light.isDirectionalLight) {
                // For directional lights
                const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(light.quaternion);
                position.set(direction.x, direction.y, direction.z, 0.0);
            } else if (light.position) {
                // For point lights
                position.set(light.position.x, light.position.y, light.position.z, 1.0);
            } else {
                // Default position
                position.set(0.0, 0.0, 0.0, 1.0);
            }
            uniforms.light_positions_or_vectors.value.push(position);

            // Update light color
            const color = new THREE.Vector4(light.color.r, light.color.g, light.color.b, 1.0);
            uniforms.light_colors.value.push(color);

            // Update attenuation factor
            let attenuation = 0.0;
            if (light.isPointLight || light.isSpotLight) {
                const distance = light.distance || 1000.0; // Default large distance
                attenuation = 1.0 / (distance * distance);
            } else if (light.isDirectionalLight) {
                attenuation = 0.0; // No attenuation for directional lights
            }
            // Include light intensity
            const intensity = light.intensity !== undefined ? light.intensity : 1.0;
            attenuation *= intensity;

            uniforms.light_attenuation_factors.value.push(attenuation);
        } else {
            // Default light values
            uniforms.light_positions_or_vectors.value.push(new THREE.Vector4(0.0, 0.0, 0.0, 0.0));
            uniforms.light_colors.value.push(new THREE.Vector4(0.0, 0.0, 0.0, 1.0));
            uniforms.light_attenuation_factors.value.push(0.0);
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


// TODO: Implement the camera attachment given the key being pressed
// Hint: This step you only need to determine the object that are attached to and assign it to a variable you have to store the attached object.
function onKeyDown(event) {
    switch (event.keyCode) {
        case 48: // '0' key - Detach camera
            attachedObject = 5
            break;
        case 49:
            attachedObject = 0;
            break;
        case 50:
            attachedObject = 1;
            break;
        case 51:
            attachedObject = 2;
            break;
        case 52:
            attachedObject = 3;
            break;
        // case 53:
        //     attachedObject = 4;
        //     break;
        //...
    }
}

function animate() {
    
    requestAnimationFrame(animate);

    //Use this timer to help with making the sun bigger and smaller and changing the color
    let time = clock.getElapsedTime();

    // Makes a 10 second interval for time
    let period10 = (time+5) % 10.0; // Added 5 because the abs would start from 1 and go to 0 and we want it not to do that. 

    // This animation factor helps make the animation smoother and allow for the translation go from 0->1 and 1->0
    const animationFactor = Math.abs((period10) / 5-1);

    // Scale amount and control the amount of scaling happening in the sun
    const scale = 1 + 2 * animationFactor

    // Scales the sphere of the sun to match the scale factor
    sphereSun.scale.set(scale, scale, scale)

    // has the color factor match the animation factor
    const colorFactor = animationFactor;
    // Update the material color based on RGB
    sphereSun.material.color.setRGB(1, colorFactor, colorFactor)
    
    // Chnages the sun color and the power of the sunlight
    sunLight.color.setRGB(1, colorFactor, colorFactor)
    sunLight.power = Math.pow(10, scale)

    // Loop through all the orbiting planets and apply transformation to create animation effect
    planets.forEach(function (obj, index) {
        let planet = obj.mesh
        let distance = obj.distance
        let speed = obj.speed
        
        let model_transform = new THREE.Matrix4(); 

        if(index == 3){
            let m = new THREE.Matrix4(); 
            m = translationMatrix(2.5,0,0).multiply(m)
            // console.log(m)
            m = rotationMatrixY(speed * time).multiply(m)
            // console.log(m)
            //Move it to match the planet
            m = translationMatrix(distance,0,0).multiply(m)
            m = rotationMatrixY(speed * time).multiply(m)
            moonObj.matrix.copy(m);
            moonObj.matrixAutoUpdate = false;
        }

        
        // TODO: Implement the model transformations for the planets
        // Hint: Some of the planets have the same set of transformation matrices, but for some you have to apply some additional transformation to make it work (e.g. planet4's moon, planet3's wobbling effect(optional)).
        model_transform = translationMatrix(distance,0,0).multiply(model_transform)
        model_transform = rotationMatrixY(speed * time).multiply(model_transform)
        planet.matrix.copy(model_transform);
        planet.matrixAutoUpdate = false;
        
        if(index == 2){
            const wobbleX = 0.05 * Math.sin(time * 2.0);
            const wobbleZ = 0.05 * Math.sin(time * 1.5);
            // console.log(wobbleX)
            let mod2 = new THREE.Matrix4()
            mod2.multiply(rotationMatrixZ(wobbleZ*(10)), mod2)
            mod2 = mod2.multiply(rotationMatrixX(wobbleX*(10)), mod2)
            planet3Ring.matrix.copy(mod2)
            planet3Ring.matrixAutoUpdate = false;
        }
        
        // Camera attachment logic here, when certain planet is being attached, we want the camera to be following the planet by having the same transformation as the planet itself. No need to make changes.
        if (attachedObject === index){
            let cameraTransform = new THREE.Matrix4();

            // Copy the transformation of the planet (Hint: for the wobbling planet 3, you might have to rewrite to the model_tranform so that the camera won't wobble together)
            cameraTransform.copy(model_transform);
            
            // Add a translation offset of (0, 0, 10) in front of the planet
            let offset = translationMatrix(0, 0, 10);
            cameraTransform.multiply(offset);

            // Apply the new transformation to the camera position
            let cameraPosition = new THREE.Vector3();
            cameraPosition.setFromMatrixPosition(cameraTransform);
            camera.position.lerp(cameraPosition, blendingFactor);

            // Make the camera look at the planet
            let planetPosition = new THREE.Vector3();
            planetPosition.setFromMatrixPosition(planet.matrix);
            camera.lookAt(planetPosition);

            // Disable controls
            controls.enabled = false;
        } 

        // TODO: If camera is detached, slowly lerp the camera back to the original position and look at the origin
        else if (attachedObject === 5) {
            camera.position.lerp(new THREE.Vector3(0, 10, 20), blendingFactor);

            camera.lookAt(new THREE.Vector3(0,0,0))

            // Enable controls
            controls.enabled = true;

            // attachedObject = null
        }
    });
    
    // TODO: Apply Gouraud/Phong shading alternatively to Planet 2
    if(Math.floor(time) % 2 == 0){
        // console.log("BING PHONG")
        spherePlanet2.material = createPhongMaterial(
            { 
                color: new THREE.Color(0x80FFFF), 
                ambient: 0.0,
                diffusivity: 0.5, 
                specularity: 1.0,
                smoothness: 40.0 
            }
        )
    }
    if(Math.floor(time) % 2 == 1){
        spherePlanet2.material = createGouraudMaterial(
            { 
                color: new THREE.Color(0x80FFFF), 
                ambient: 0.0,
                diffusivity: 0.5, 
                specularity: 1.0,
                smoothness: 40.0 
            }
        )
    }

    // TODO: Update customized planet material uniforms
    // e.g. updatePlanetMaterialUniforms(planets[1].mesh);
    updatePlanetMaterialUniforms(planets[1].mesh);
    updatePlanetMaterialUniforms(planets[2].mesh);
    updatePlanetMaterialUniforms(planets[3].mesh)

    // Update controls only when the camera is not attached
    if (controls.enabled) {
        controls.update();
    }

    renderer.render(scene, camera);
}
