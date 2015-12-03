/**
 * Created by Olex on 12/2/2015.
 */

// Common objects for the presentation
var ThreeJSRoom = function(){
    // to be initialized later
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometry = null;
    this.floor_material = null;
    this.controls = null;
    this.model_lamp = null;
    this.model_plane = null;
    this.model_skyBox = null;
    this.light = null;
};

// Various settings that a user can modify
var Settings = function(){
    this.lamp_color = [100, 100, 100];
    this.lamp_scale = 1;
    this.lamp_spin = true;

    this.floor_color = [54, 100, 132];
    this.light_color = [255, 255, 255];
    this.world_color = [0, 0, 0];
    this.show_plane = true;
    this.show_room = true;
};

var loader = new THREE.ColladaLoader();
var Default = new Settings();
var LampRoom = new ThreeJSRoom();

var half_pi = Math.PI / 2.0;

// Resource loading stage
loader.load(
    // resource URL
    'models/Model_for_Render.dae',
    // called when resource is loaded
    function ( collada ) {
        LampRoom.init();

        // orient the lamp so that +Y is up
        collada.scene.rotation.x = -half_pi;

        LampRoom.scene.add( collada.scene );
        LampRoom.model_lamp = collada.scene;

        // set default lamp configuration
        set_shadow_mode(LampRoom.model_lamp, true, true);
        LampRoom.set_lamp_color(Default.lamp_color);
        LampRoom.set_lamp_size(Default.lamp_scale);

        // start the rendering loop
        LampRoom.render();
    }
);

// Initializes three.js context and creates the scene
ThreeJSRoom.prototype.init = function(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 1, 100000 );
    this.camera.position.z = 500;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    if ( !this.renderer )
        this.renderer = new THREE.CanvasRenderer();

    this.set_world_color(Default.world_color);

    // Setting up shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.Soft = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.shadowMap.cullFace = THREE.CullFaceFrontBack;
    this.renderer.shadowMap.cascade = true;

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );

    // Add some lights to the scene
    this.light = new THREE.DirectionalLight(0xdfebff, 1.75);
    this.light.position.set(300, 350, 50);
    this.light.position.multiplyScalar(1.3);
    this.light.castShadow = true;
    this.light.shadowMapWidth = 1024;
    this.light.shadowMapHeight = 1024;
    var d = 200;
    this.light.shadowCameraLeft = -d;
    this.light.shadowCameraRight = d;
    this.light.shadowCameraTop = d;
    this.light.shadowCameraBottom = -d;
    this.light.shadowCameraFar = 30000;
    this.light.shadowDarkness = 0.2;
    this.scene.add(this.light);

    var ambientLight = new THREE.AmbientLight(0xBBBBBB);
    this.scene.add(ambientLight);

    // Add a plane for the lamp to stand on
    this.geometry = new THREE.PlaneGeometry(250, 250);
    this.floor_material = new THREE.MeshLambertMaterial({
        color: 0x6C6C6C
    });
    this.model_plane = new THREE.Mesh(this.geometry, this.floor_material);
    this.model_plane.rotation.x = -half_pi;
    this.model_plane.position.y = -1.2; // the model is digging into the floor a bit otherwise
    this.set_floor_color(Default.floor_color);
    set_shadow_mode(this.model_plane, false, true);
    this.scene.add(this.model_plane);

    // Controls
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );

    // Sky box
    var imagePrefix = "skybox/";
    var directions  = ["posx", "negx", "posy", "negy", "posz", "negz"];
    var imageSuffix = ".jpg";

    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push( new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
            side: THREE.BackSide
        }));

    var sky_box_size = 1500;
    var skyGeometry = new THREE.CubeGeometry( sky_box_size, sky_box_size, sky_box_size );
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    this.model_skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    this.model_skyBox.rotation.y = -half_pi;
    this.scene.add( this.model_skyBox );
};

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    LampRoom.camera.aspect = window.innerWidth / window.innerHeight;
    LampRoom.camera.updateProjectionMatrix();

    LampRoom.renderer.setSize( window.innerWidth, window.innerHeight );

}

// Main render loop
ThreeJSRoom.prototype.render = function () {
    requestAnimationFrame( ThreeJSRoom.prototype.render );

    if (Default.lamp_spin) {
        var rotation_speed = 0.001;
        rotate_slowly(LampRoom.model_lamp, rotation_speed);
        rotate_slowly(LampRoom.model_plane, rotation_speed);
        LampRoom.model_skyBox.rotation.y += rotation_speed;
    }

    LampRoom.renderer.render(LampRoom.scene, LampRoom.camera);
};

// A helper method to rotate an object
function rotate_slowly(model, delta){
    model.rotation.z += delta;
}

// background clear color
ThreeJSRoom.prototype.set_world_color = function(value){
    var new_color = new THREE.Color(value[0] / 256, value[1] / 256, value[2] / 256);
    this.renderer.setClearColor( new_color, 1 );
};

// floor plane color
ThreeJSRoom.prototype.set_floor_color = function(value){
    var floor_material = this.model_plane.material;
    floor_material.color.r = value[0] / 256;
    floor_material.color.g = value[1] / 256;
    floor_material.color.b = value[2] / 256;
};

// lamp color converts from int [rgb] to float [rgb]
ThreeJSRoom.prototype.set_lamp_color = function(value){
    var new_material = new THREE.MeshPhongMaterial( { specular: 0x555555, shininess: 30, shading: THREE.SmoothShading } );
    new_material.side = THREE.DoubleSide;
    new_material.color.r = value[0] / 256;
    new_material.color.g = value[1] / 256;
    new_material.color.b = value[2] / 256;
    set_material(this.model_lamp, new_material);
};

// Recursively set material for a given scene object
var set_material = function(node, material) {
    node.material = material;

    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            set_material(node.children[i], material);
        }
    }
};

// Recursive set shadow mode for a given scene object
var set_shadow_mode = function(node, castShadow, receiveShadow) {
    node.castShadow = castShadow;
    node.receiveShadow = receiveShadow;

    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            set_shadow_mode(node.children[i], castShadow, receiveShadow);
        }
    }
};

// A helper scaling method
var set_model_scale = function(node, scale){
    node.scale.x = node.scale.y = node.scale.z = scale;
};

// Change the size of the lamp
ThreeJSRoom.prototype.set_lamp_size = function(scale){
    var internal_scale_ratio = 50;
    set_model_scale(this.model_lamp, scale * internal_scale_ratio);
};

// Change the color of the light in the scene
ThreeJSRoom.prototype.set_light_color = function(value){
    this.light.color = new THREE.Color(value[0] / 256, value[1] / 256, value[2] / 256);
};

// Change if the room should spin or not
ThreeJSRoom.prototype.set_lamp_spin = function(value){
    Default.lamp_spin = value;
};

// Hide or show the floor plane that a lamp stands on
ThreeJSRoom.prototype.set_floor_state = function(value){
    Default.show_plane = value;

    this.model_plane.visible = Default.show_plane;
};

// Hide or show the skybox
ThreeJSRoom.prototype.set_room_state = function(value){
    Default.show_room = value;

    this.model_skyBox.visible = Default.show_room;
};
