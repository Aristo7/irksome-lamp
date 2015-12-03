/**
 * Created by Olex on 12/3/2015.
 */

var FizzyText = function() {
    this.type = 'Your Lamp Name';
    this.size = default_lamp_scale;
    this.lamp_color = default_lamp_color;
    this.floor_color = default_floor_color;
    this.world_color = default_world_color;
};

window.onload = function() {
    var text = new FizzyText();
    var gui = new dat.GUI();

    var f1 = gui.addFolder('Lamp');
    var lamp_type_controller = f1.add(text, 'type', [ 'Lamp Type 1', 'Lamp Type 2', 'Lamp Type 3' ]);
    f1.add(text, 'size', 0.5, 2.5).onChange(function(value) {
        // Fires on every change, drag, keypress, etc.
        set_lamp_size(value);
    });
    f1.addColor(text, 'lamp_color').onChange(function(value) {
        // Fires on every change, drag, keypress, etc.
        set_lamp_color(value);
    });

    var f2 = gui.addFolder('Environment');
    f2.addColor(text, 'floor_color').onChange(function(value) {
        // Fires on every change, drag, keypress, etc.
        set_floor_color(value);
    });
    f2.addColor(text, 'world_color').onChange(function(value) {
        // Fires on every change, drag, keypress, etc.
        set_world_color(value);
    });

    f1.open();
    f2.open();
};
