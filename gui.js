/**
 * Created by Olex on 12/3/2015.
 */

var FizzyText = function() {
    this.type = 'Your Lamp Name';
    this.size = default_lamp_scale;
    this.lamp_color = default_lamp_color;
    this.spin = default_lamp_spin;
    this.floor_color = default_floor_color;
    this.light_color = default_light_color;
    this.world_color = default_world_color;
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
    f1.add(text, 'spin').onChange(function(value) {
        set_lamp_spin(value);
    });

    var f2 = gui.addFolder('Environment');
    f2.addColor(text, 'floor_color').onChange(function(value) {
        set_floor_color(value);
    });
    f2.addColor(text, 'light_color').onChange(function(value) {
        set_light_color(value);
    });
    f2.addColor(text, 'world_color').onChange(function(value) {
        set_world_color(value);
    });

    f1.open();
    f2.open();
};
