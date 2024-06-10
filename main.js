import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

var scene, camera, renderer, controls, mouse, raycaster, selectedPiece = null;

// SETUP
//creates a scene from Three.js that allows for a camera, renderer and geometry to be created and animated
scene = new THREE.Scene();

//creates camera
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);

const loadingManager = new THREE.LoadingManager();

var display = document.querySelector('.controls-container').style.display;
const controlsContainer = document.querySelector('.controls-container');


loadingManager.onStart = function(url, item, total) {
    controlsContainer.style.display = 'none';
}

const progressBar = document.getElementById('progress-bar');

loadingManager.onProgress = function(url, loaded, total) {
    progressBar.value = (loaded / total) * 100;
}

const progressBarContainer = document.querySelector('.progress-bar-container');


loadingManager.onLoad = function() {
    controlsContainer.style.display = display;
    progressBarContainer.style.display = 'none';
    setTimeout(() => {
        controlsContainer.style.display = 'none';
    }, 60);  
    }


function onPointerMove (event){
    //calculates the pointers position in a normalized device coordinates
    //(-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}


//creates renderer
renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

//defines the size of the renderers window
// container = document.getElementById('canvas');
renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
// container.appendChild(renderer.domElement);

camera.position.set(-10, 25, 50);

//tells the renderer to render
renderer.render( scene, camera);

//GTLF LOADER
const modelLoader = new GLTFLoader(loadingManager);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

    modelLoader.load(
        'Models/Homepage_007.glb',
        
        function(gltf) {
            scene.add( gltf.scene );
            gltf.scene.position.set(-7.5, 0, 0)
            gltf.scene.scale.set(12, 12, 12)
            gltf.scene.rotation.set(0, -0.70, 0)
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        
        function(error) {
            console.log('An error happened');
        }
        
        )

// ADDING VIDEO TEXTURE TO PLANE
// const video = document.getElementById('TV-Texture'); //define video as a const

// video.src="Videos/TV-Texture.mp4";
// video.load();
// video.play();
// const texture = new THREE.VideoTexture(video); //call the var video as a texture
// texture.needsUpdate; //refresh/update the video - like in animation
// texture.minFilter = THREE.LinearFilter;
// texture.magFilter = THREE.LinearFilter;
// texture.format = THREE.RGBAFormat;
// texture.crossOrigin = 'anonymous';

// var imageObject = new THREE.Mesh(
//     new THREE.PlaneGeometry(9.45,5.5),
//     new THREE.MeshBasicMaterial({map: texture, side: THREE.FrontSide, toneMapped: false}),);

// imageObject.position.set(7.15, 6.9,  4.95)
// imageObject.rotation.set(0,-0.7,0)

// scene.add(imageObject);

// // //FOOD COLLAGE VIDEO
// const foodVideo = document.getElementById('FoodCollage'); //define video as a const

// foodVideo.src="Videos/FoodCollage.mp4";
// foodVideo.load();
// foodVideo.play();
// const foodTexture = new THREE.VideoTexture(foodVideo); //call the var video as a texture
// foodTexture.needsUpdate; //refresh/update the video - like in animation
// foodTexture.minFilter = THREE.LinearFilter;
// foodTexture.magFilter = THREE.LinearFilter;
// foodTexture.format = THREE.RGBAFormat;
// foodTexture.crossOrigin = 'anonymous';

// var foodObject = new THREE.Mesh(
//     new THREE.PlaneGeometry(5.05, 2.84),
//     new THREE.MeshBasicMaterial({map: foodTexture, side: THREE.FrontSide, toneMapped: false}),);

// foodObject.position.set(15, 7.97, -8.67)
// foodObject.rotation.set(0,0.07,0)

// scene.add(foodObject);

//SKYBOX
const skyMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1000, 32, 32),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.BackSide,
    })
    );
scene.add(skyMesh);


//FOG
scene.fog = new THREE.FogExp2(0x9E9759, 0.005);

//LIGHTING
// X back/right from camera, Y is up? z is forward?
// 0xEDE175
const pointLight = new THREE.PointLight(0xffffff, 25)
pointLight.position.set(20, 10, -10)
pointLight.castShadow = true;

const pointLight2 = new THREE.PointLight(0xffffff, 25)
pointLight2.position.set(1, 10, 10) 
pointLight2.castShadow = true;

const pointLight3 = new THREE.PointLight(0xffffff, 25)
pointLight3.position.set(-17, 10, -12)
pointLight3.castShadow = true;

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
directionalLight.castShadow = true;
directionalLight.position.set(2.36, 4.57, 8.98);

// const geometry = new THREE.BoxGeometry(1,1,1);
// const material = new THREE.MeshBasicMaterial(0x00ff00);
// const cube = new THREE.Mesh(geometry, material);
// cube.position.set(-17, 10, -12)
// scene.add(cube);


scene.add(directionalLight);

// const ambientLight = new THREE.AmbientLight(0x999999, 100)
// ambientLight.castShadow = true;

scene.add(pointLight, pointLight2, pointLight3)

controls = new OrbitControls(camera, renderer.domElement);
// console.log(controls.getDistance);
controls.maxDistance = 75;
controls.maxPolarAngle = 1.75;

renderer.setPixelRatio(0.6);

function animate () {
    controls.update();

    renderer.render( scene, camera);
    requestAnimationFrame(animate);
}

// //calls the animate function
animate()

//updates and resizes the window if it is changed
window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

window.addEventListener("keydown", (event) => {
    if(event.keyCode === 82 ) {
        // camera.position.set(-10, 25, 50);
        // camera.rotation.set(-0.13, -0.67, -0.08);
        location.reload();
    }
    // else {
    //     // camera.position.set(-10, 25, 50);
        
    //     // camera.position.set(2.9, 6.9, 9.4);
    //     // camera.rotation.set(-0.13, -0.67, -0.08);
    // }
    return;
})
