import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import * as dat from 'dat.gui'

import commonVertexShader from './shaders/commonVertex.glsl'
import commonFragmentShader from './shaders/commonFragments.glsl'


import cubeVertexShaderTexture from './shaders/cubeVertexTexture.glsl'
import cubeFragmentShaderTexture from './shaders/cubeFragmentsTexture.glsl'

//#region Global declaration

//const gui = new dat.GUI();

//#region Texture Creation (Globally)
var textureLoader = new THREE.TextureLoader();
var texture_1 = textureLoader.load("./textures/t1.jpg");
var texture_2 = textureLoader.load("./textures/t2.jpg");
var texture_3 = textureLoader.load("./textures/t3.jpg");
//#endregion

//#region Scene (Globally)
var scene = new THREE.Scene();
//#endregion

//#region Camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
var camlok = {  height: 30,speed: 0.15 };
camera.position.set(-20, camlok.height, 40);
camera.lookAt(new THREE.Vector3(10, 0, 0));
//#endregion

//#region Canvas 
var canvas = document.querySelector('canvas.webgl')
var renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
//#endregion

//#region Light
var spotLight = new THREE.SpotLight(0xFFFFFF);
//#endregion



//#endregion




function init() {
    
    renderer.setClearColor(new THREE.Color(0x96c59d));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    
    // camera Setup
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
  
    initialBatCreation();
    initBallCreation();
    pitchCreation();
    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);
  
    // add spotlight for the shadows
    //var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
  
    // If you want a more detailled shadow you can increase the 
    // mapSize used to draw the shadows.
    // spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    scene.add(spotLight);
  
    var ambienLight = new THREE.AmbientLight(0x353535);
    scene.add(ambienLight);
  
    // add the output of the renderer to the html element
    document.getElementById("webgl");
  
    // call the render function
    renderer.render(scene, camera);

    camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
    cameraMove();
}
//init();

// Camera Setup
var keyboard = {}, degree = 0, click = 0;
function cameraMove(){
  setTimeout( function() {requestAnimationFrame( cameraMove );}, 1000/100 );
			//Up Arrow
			if (keyboard[38]) {
				camera.position.x -= Math.sin(camera.rotation.y) * camlok.speed;
				camera.position.z -= -Math.cos(camera.rotation.y) * camlok.speed;
			}
			//Down Arrow
			if (keyboard[40]) {
				camera.position.x += Math.sin(camera.rotation.y) * camlok.speed;
				camera.position.z += -Math.cos(camera.rotation.y) * camlok.speed;
			}
			//left Arrow
			if (keyboard[37]) {
				camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * camlok.speed;
				camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * camlok.speed;
			}
			//Right Arrow
			if (keyboard[39]) {
				camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * camlok.speed;
				camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * camlok.speed;
			}
			//Left turn(l)
			if (keyboard[76]) {
				camera.rotation.y -= Math.PI * 0.01;
			}
			//Right turn(r)
			if (keyboard[82]) {
				camera.rotation.y += Math.PI * 0.01;
			}
			//lightAnimation
			if (degree < 360) {
				degree += 0.5;
			} 
			else {
				degree = 0;
			}
			// spotLight.position.x = Math.sin(degree * Math.PI / 180) * 3;
			// spotLight.position.z = Math.cos(degree * Math.PI / 180) * 3;

			renderer.render(scene, camera);
      console.log("camera worked");
}
function keyDown(event) {
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

//Textures change through mouse click
function onClick(event) {			
  if (click < 3) 
    click += 1;
  else
    click = 1;
  //texture loader
  switch (click) {
    case 1:
      batCreation(texture_1, '#E2B07E');
    break;
    case 2:
      batCreation(texture_2, '#8C182B');
    break;
    case 3:
      batCreation(texture_3, '#000000');
      break;
    default:
      console.log('default')
  }		
}
function initialBatCreation(){
  // create a cube
  var cubeGeometry = new THREE.BoxGeometry(.5, 23, 4);
  var cubeMaterial = new THREE.ShaderMaterial({
    vertexShader: commonVertexShader,
    fragmentShader: commonFragmentShader,
    uniforms: 
    {
      uColor: { value: new THREE.Color('#FFF2D7')}
    }
  });
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  cube.name = 'cube';
  cube.position.x = -4;
  cube.position.y = 2;
  cube.position.z = 0;
  scene.add(cube);
  cylinderCreation('#0000FF');
}
function cylinderCreation(colorCode)
{
  // Create a Cylinder
  var CylinderGeometry = new THREE.CylinderGeometry(0.24, 0.25, 5, 32);
  var cylinderMaterial = new THREE.ShaderMaterial({
    vertexShader: commonVertexShader,
    fragmentShader: commonFragmentShader,
    uniforms:
    {
      uColor: { value: new THREE.Color(colorCode)}
    }
  });
  var cylinder = new THREE.Mesh(CylinderGeometry, cylinderMaterial);
  cylinder.castShadow = true;
  cylinder.name = 'cylinder';
  cylinder.position.x = -4;
  cylinder.position.y = 15;
  cylinder.position.z = 0;
  scene.add(cylinder);

}
function initBallCreation(){
  var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  var sphereMaterial = new THREE.ShaderMaterial({
    vertexShader: commonVertexShader,
    fragmentShader: commonFragmentShader,
    uniforms:
    {
      uColor: { value: new THREE.Color('#8C182B')}
    }
  });
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  
  // position the sphere
  sphere.position.x = 20;
  sphere.position.y = 4;
  sphere.position.z = 2;
  sphere.castShadow = true;
  sphere.name = 'sphere';
  scene.add(sphere);

  function renderScene() {
    
    //sphere rotate
    sphere.rotation.x += 0.02;
    sphere.rotation.y += 0.02;
    sphere.rotation.z += 0.02;
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
    }
    renderScene();
}

function batCreation(textureValue, colorCode){
  scene.remove(scene.getObjectByName('cube'));
  scene.remove(scene.getObjectByName('cylinder'));
  cubeCreation(textureValue);
  cylinderCreation(colorCode);
}
function cubeCreation(textureValue){
  var cubeGeometry = new THREE.BoxGeometry(.5, 23, 4);
  var cubeMaterial = new THREE.ShaderMaterial({
    vertexShader: cubeVertexShaderTexture,
    fragmentShader: cubeFragmentShaderTexture,
    uniforms: 
    {
      //uColor: { value: new THREE.Color('#FFF2D7')},
      uTexture: { value: textureValue}
    }
  });
  //console.log(cubeMaterial);
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;

  // position the cube
  cube.position.x = -4;
  cube.position.y = 2;
  cube.position.z = 0;
  scene.add(cube);
}
function pitchCreation(){
// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(60, 20);
// var planeMaterial = new THREE.MeshLambertMaterial({
//   color: 0xE2B07E
// });
var planeMaterial = new THREE.ShaderMaterial({
  vertexShader: commonVertexShader,
  fragmentShader: commonFragmentShader,
  uniforms:
  {
    uColor: { value: new THREE.Color('#E2B07E')}
  }
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);

// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(15, 0, 0);
plane.receiveShadow = true;

scene.add(plane);
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.addEventListener('click', onClick);
window.onload = init;
