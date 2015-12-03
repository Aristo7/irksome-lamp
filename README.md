# irksome-lamp
A simple prototype lamp presentation.

## Code

My code is in 3 files here of the root folder:

index.html - very empty html page containing only the GL context

gui.js - UI settings that leverage dat.GUI library

main.js - the main code that loads and presents the lamp object in a scene

three/ - is a folder containing three.js distribution

skybox/ - a free skybox texture I found online to use

models/ - lamp model that I load (I kept the original .blender file but I actually load .dae exported version of it)

## Libraries Used
Three.js http://threejs.org/

dat.GUI http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage

Blender http://www.blender.org/ to re-export the model as Collada (.dae)


## Hosting/testing steps

To run it, host it in a server.

Or locally via python http helper tool, such as: python -m SimpleHTTPServer
