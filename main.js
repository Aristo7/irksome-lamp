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
var spotLight;

var loader = new THREE.ColladaLoader();
var default_floor_color = [54, 100, 132];
var default_lamp_color = [100, 100, 100];
var default_light_color = [255, 255, 255];
var default_world_color = [0, 0, 0];
var default_lamp_scale = 1;
var default_lamp_spin = true;

var half_pi = Math.PI / 2.0;

loader.load(
    // resource URL
    'models/Model_for_Render.dae',
    // Function when resource is loaded
    function ( collada ) {
        init();

        collada.scene.rotation.x = -half_pi;

        scene.add( collada.scene );
        model_lamp = collada.scene;

        set_shadow_mode(model_lamp, true, true);
        set_lamp_color(default_lamp_color);
        set_model_scale(model_lamp, default_lamp_scale);

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
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    if ( !renderer )
        renderer = new THREE.CanvasRenderer();

    set_world_color(default_world_color);

    // Setting up shadows
    renderer.shadowMap.Enabled = true;
    // to anti-alias the shadow
    renderer.shadowMap.Type = THREE.PCFShadowMap;
    renderer.shadowMap.Debug = true;
    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;
    renderer.shadowMapWidth = 1024;
    renderer.shadowMapHeight = 1024;

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Add a plane for the lamp to stand on
    geometry = new THREE.PlaneGeometry(5, 5);
    material = new THREE.MeshPhongMaterial( { specular: 0x009900, shininess: 1, shading: THREE.FlatShading } );
    model_plane = new THREE.Mesh(geometry, material);
    model_plane.rotation.x = -half_pi;
    model_plane.position.y = -.02; // the model is digging into the floor a bit otherwise
    set_floor_color(default_floor_color);
    set_shadow_mode(model_plane, true, true);
    model_plane.receiveShadow = true;
    scene.add(model_plane);

    // Add some lights to the scene
    spotLight = new THREE.SpotLight( 0xAAAAAA );
    spotLight.position.set( 5, 10, 0 );
    spotLight.castShadow = true;
    spotLight.shadowCameraFov = 0.7;
    spotLight.shadowBias = 0.0001;
    spotLight.shadowDarkness = 0.2;
    spotLight.shadowMapWidth = 2048;
    spotLight.shadowMapHeight = 2048;
    scene.add( spotLight );

    var ambientLight = new THREE.AmbientLight(0xBBBBBB);
    scene.add(ambientLight);

    // CONTROLS
    controls = new THREE.OrbitControls( camera, renderer.domElement );
}

var render = function () {
    requestAnimationFrame( render );

    if (default_lamp_spin) {
        var rotation_speed = 0.001;
        rotate_slowly(model_lamp, rotation_speed);
        rotate_slowly(model_plane, rotation_speed);
    }

    renderer.render(scene, camera);
};

function rotate_slowly(model, delta){
    model.rotation.z += delta;
}

function set_world_color(value){
    var new_color = new THREE.Color(value[0] / 256, value[1] / 256, value[2] / 256);
    renderer.setClearColor( new_color, 1 );
}

function set_floor_color(value){
    var floor_material = model_plane.material;
    floor_material.color.r = value[0] / 256;
    floor_material.color.g = value[1] / 256;
    floor_material.color.b = value[2] / 256;
}

function set_lamp_color(value){
    var new_material = new THREE.MeshPhongMaterial( { specular: 0x555555, shininess: 30, shading: THREE.FlatShading } );
    new_material.side = THREE.DoubleSide;
    new_material.color.r = value[0] / 256;
    new_material.color.g = value[1] / 256;
    new_material.color.b = value[2] / 256;
    set_material(model_lamp, new_material);
}

// Recursive
var set_material = function(node, material) {
    node.material = material;

    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            set_material(node.children[i], material);
        }
    }
};

// Recursive
var set_shadow_mode = function(node, castShadow, receiveShadow) {
    node.castShadow = castShadow;
    node.receiveShadow = receiveShadow;

    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            set_shadow_mode(node.children[i], castShadow, receiveShadow);
        }
    }
};

var set_model_scale = function(node, scale){
    node.scale.x = node.scale.y = node.scale.z = scale;
};

function set_lamp_size(scale){
    set_model_scale(model_lamp, scale);
}

function set_light_color(value){
    spotLight.color = new THREE.Color(value[0] / 256, value[1] / 256, value[2] / 256);
}

function set_lamp_spin(value){
    default_lamp_spin = value;
}
