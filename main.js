/**
 * Created by Olex on 12/2/2015.
 */


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

camera.position.z = 5;

var model_lamp;

var loader = new THREE.ColladaLoader();

loader.load(
    // resource URL
    'models/Model_for_Render.dae',
    // Function when resource is loaded
    function ( collada ) {
        scene.add( collada.scene );
        model_lamp = collada.scene;

        init();
        render();
    },
    // Function called when download progresses
    function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    }
);

function init(){
    // Add some lights to the scene
    var directionalLight = new THREE.DirectionalLight(0xeeeeee , 1.0);
    directionalLight.position.x = 1;
    directionalLight.position.y = 0;
    directionalLight.position.z = 0;
    scene.add( directionalLight );

    var directionalLight2 = new THREE.DirectionalLight(0xeeeeee, 2.0);
    // A different way to specify the position:
    directionalLight2.position.set(-1, 0, 1);
    scene.add( directionalLight2 );

    var ambientLight = new THREE.AmbientLight(0xBBBBBB);
    scene.add(ambientLight);
}

var render = function () {
    requestAnimationFrame( render );

    model_lamp.rotation.x += 0.01;
    model_lamp.rotation.y += 0.01;

    renderer.render(scene, camera);
};
