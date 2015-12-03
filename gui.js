/**
 * Created by Olex on 12/3/2015.
 */

var UIElements = function() {
    this.type = 'Your Lamp Name';
    this.size = Default.lamp_scale;
    this.lamp_color = Default.lamp_color;
    this.spin = Default.lamp_spin;
    this.floor_color = Default.floor_color;
    this.light_color = Default.light_color;
    this.world_color = Default.world_color;
    this.show_plane = Default.show_plane;
    this.show_room = Default.show_room;
};

// Initialize the UI (uses dat.GUI library that comes with three.js)
window.onload = function() {
    var text = new UIElements();
    var gui = new dat.GUI();

    var f1 = gui.addFolder('Lamp');
    var lamp_type_controller = f1.add(text, 'type', [ 'Lamp Type 1', 'Not used', 'Not used either' ]);
    f1.add(text, 'size', 0.5, 2.5).onChange(function(value) {
        LampRoom.set_lamp_size(value);
    });
    f1.addColor(text, 'lamp_color').onChange(function(value) {
        LampRoom.set_lamp_color(value);
    });

    var f2 = gui.addFolder('Environment');
    f2.addColor(text, 'floor_color').onChange(function(value) {
        LampRoom.set_floor_color(value);
    });
    f2.add(text, 'show_plane').onChange(function(value) {
        LampRoom.set_floor_state(value);
    });
    f2.addColor(text, 'light_color').onChange(function(value) {
        LampRoom.set_light_color(value);
    });
    f2.addColor(text, 'world_color').onChange(function(value) {
        LampRoom.set_world_color(value);
    });
    f2.add(text, 'spin').onChange(function(value) {
        LampRoom.set_lamp_spin(value);
    });
    f2.add(text, 'show_room').onChange(function(value) {
        LampRoom.set_room_state(value);
    });

    f1.open();
    f2.open();
};
