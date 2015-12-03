/**
 * Created by Olex on 12/3/2015.
 */

var FizzyText = function() {
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

window.onload = function() {
    var text = new FizzyText();
    var gui = new dat.GUI();

    var f1 = gui.addFolder('Lamp');
    var lamp_type_controller = f1.add(text, 'type', [ 'Lamp Type 1', 'Not used', 'Not used either' ]);
    f1.add(text, 'size', 0.5, 2.5).onChange(function(value) {
        set_lamp_size(value);
    });
    f1.addColor(text, 'lamp_color').onChange(function(value) {
        set_lamp_color(value);
    });

    var f2 = gui.addFolder('Environment');
    f2.addColor(text, 'floor_color').onChange(function(value) {
        set_floor_color(value);
    });
    f2.add(text, 'show_plane').onChange(function(value) {
        set_floor_state(value);
    });
    f2.addColor(text, 'light_color').onChange(function(value) {
        set_light_color(value);
    });
    f2.addColor(text, 'world_color').onChange(function(value) {
        set_world_color(value);
    });
    f2.add(text, 'spin').onChange(function(value) {
        set_lamp_spin(value);
    });
    f2.add(text, 'show_room').onChange(function(value) {
        set_room_state(value);
    });

    f1.open();
    f2.open();
};
