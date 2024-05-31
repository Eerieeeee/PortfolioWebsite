import * as THREE from 'three';

// import mp4 from './background.mp4';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

var scene, camera, cameraP, cameraF, renderer, controls, mouse, raycaster, selectedPiece = null;

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
    }, 6000);  
    }




// setup Raycast
// raycaster = new THREE.Raycaster();
// mouse = new THREE.Vector2();

function onPointerMove (event){
    //calculates the pointers position in a normalized device coordinates
    //(-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

// function resetMaterials() {
//     for ( let i = 0; i < scene.children.length; i++ ) {
//         if (scene.children[i].material) {
//             scene.children[i].material.opacity = scene.children[i] == selectedPiece ? 0.5 : 1.0;
//         }
//     }
// }

function onClick( ){
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        selectedPiece = intersects[0].object;
    }

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
// renderer.toneMapping = THREE.ACESFilmicToneMapping;

    modelLoader.load(
        'Homepage_007.glb',
        
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
const video = document.getElementById('TV-Texture'); //define video as a const

video.src="https://github.com/Eerieeeee/PortfolioWebsite/raw/main/Videos/TV-Texture.mp4";
video.load();
video.play();
const texture = new THREE.VideoTexture(video); //call the var video as a texture
texture.needsUpdate; //refresh/update the video - like in animation
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.format = THREE.RGBAFormat;
texture.crossOrigin = 'anonymous';

var imageObject = new THREE.Mesh(
    new THREE.PlaneGeometry(9.45,5.5),
    new THREE.MeshBasicMaterial({map: texture, side: THREE.FrontSide, toneMapped: false}),);

imageObject.position.set(7.15, 6.9,  4.95)
imageObject.rotation.set(0,-0.7,0)

scene.add(imageObject);

// //FOOD COLLAGE VIDEO
const foodVideo = document.getElementById('FoodCollage'); //define video as a const

foodVideo.src="https://github.com/Eerieeeee/PortfolioWebsite/raw/main/Videos/FoodCollage.mp4";
foodVideo.load();
foodVideo.play();
const foodTexture = new THREE.VideoTexture(foodVideo); //call the var video as a texture
foodTexture.needsUpdate; //refresh/update the video - like in animation
foodTexture.minFilter = THREE.LinearFilter;
foodTexture.magFilter = THREE.LinearFilter;
foodTexture.format = THREE.RGBAFormat;
foodTexture.crossOrigin = 'anonymous';

var foodObject = new THREE.Mesh(
    new THREE.PlaneGeometry(5.05, 2.84),
    new THREE.MeshBasicMaterial({map: foodTexture, side: THREE.FrontSide, toneMapped: false}),);

foodObject.position.set(15, 7.97, -8.67)
foodObject.rotation.set(0,0.07,0)

scene.add(foodObject);

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
const pointLight = new THREE.PointLight(0xEDE175, 0.1)
pointLight.position.set(100, 20, 0)
pointLight.castShadow = true;

const pointLight2 = new THREE.PointLight(0xffffff, 0.1)
pointLight2.position.set(-100, 20, 20)
pointLight2.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x999999, 1)
ambientLight.castShadow = true;

scene.add(pointLight, pointLight2)

controls = new OrbitControls(camera, renderer.domElement);
// console.log(controls.getDistance);
controls.maxDistance = 75;
controls.maxPolarAngle = 1.75;

renderer.setPixelRatio(0.6);

function animate () {
    controls.update();
    // resetMaterials();
    // hoverPieces();

    renderer.render( scene, camera);
    requestAnimationFrame(animate);

    // console.log(camera.rotation);
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



//LEARNED BUT UNUSED



//BACKGROUND TEXTURE
// const backgroundTexture = new THREE.TextureLoader().load("Images/Spain/Cocktails.jpg");

// CUBEMAP
// const backgroundTexture = new THREE.CubeTextureLoader()
//     .load([
//         'Images/Solid_Black.png',
//         'Images/Solid_Black.png',
//         'Images/Solid_Black.png',
//         'Images/Solid_Black.png',
//         'Images/Solid_Black.png',
//         'Images/Solid_Black.png'    
//     ]);

//     scene.background = backgroundTexture;


// //HELPERS
    // const lightHelper = new THREE.PointLightHelper(pointLight)
    // const lightHelper2 = new THREE.PointLightHelper(pointLight2)
    // const gridHelper = new THREE.GridHelper(200, 50)
    // scene.add(lightHelper, lightHelper2, gridHelper)


//STARS

    // function addStar(){
    //     const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    //     const material = new THREE.MeshStandardMaterial( {color: 0xffffff})
    //     const star = new THREE.Mesh( geometry, material);

    //     const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) ); 
        
    //     star.position.set(x, y, z);
    //     scene.add(star)
    // }

    // Array(200).fill().forEach(addStar)


//defines the animate function (make the donut spin)

 // (X, Y, Z)
        // X > 0 moves objects to the right
        // X < 0 moves objects to the left
        // Y > 0 moves objects up
        // Y < 0 moves objects down
        // Z > 0 moves objects closer
        // Z < 0 moves objects further


// RAYCASTER CHECK
    // checks to see if the mouse is over an object and makes the object transparent
    // function hoverPieces() {

    //     //update the picking ray with the camera and pointer position
    //     raycaster.setFromCamera ( mouse, camera);

    //     //calculate objects intersecting the picking ray
    //     const intersects = raycaster.intersectObjects(scene.children);

    //     for( let i = 0; i < intersects.length; i++) {
    //         intersects[i].object.material.transparent = true;
    //         intersects[i].object.material.opacity = 0.5;
    //         }
            
    //     }

    // window.addEventListener( 'pointermove', onPointerMove);
    // window.addEventListener('click', onClick)
    // window.requestAnimationFrame ( animate );