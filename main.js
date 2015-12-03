/**
 * Created by Olex on 12/2/2015.
 */

var scene;
var camera;
var renderer;
var geometry;
var material;
var controls;
var model_lamp;
var model_plane;

var loader = new THREE.ColladaLoader();

loader.load(
    // resource URL
    'models/Model_for_Render.dae',
    // Function when resource is loaded
    function ( collada ) {
        init();

        scene.add( collada.scene );
        model_lamp = collada.scene;

        render();
    },
    // Function called when download progresses
    function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    }
);

function init(){

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    if ( !renderer )
        renderer = new THREE.CanvasRenderer();

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    geometry = new THREE.PlaneGeometry(5, 5);
    material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    model_plane = new THREE.Mesh(geometry, material);
    scene.add(model_plane);

    camera.position.z = 5;

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

    // CONTROLS
    controls = new THREE.OrbitControls( camera, renderer.domElement );
}

var render = function () {
    requestAnimationFrame( render );

    var rotation_speed = 0.001;
    rotate_slowly(model_lamp, rotation_speed);
    rotate_slowly(model_plane, rotation_speed);

    renderer.render(scene, camera);
};

function rotate_slowly(model, delta){
    //model.rotation.x += delta;
    //model.rotation.y += delta;
    model.rotation.z += delta;
}
