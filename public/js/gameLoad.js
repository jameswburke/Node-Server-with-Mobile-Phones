var baseURL = "http://192.168.2.7";

var CANVAS_WIDTH = window.innerWidth-100;
var CANVAS_HEIGHT = window.innerHeight-100;
var FPS = 30
        
//Start game loop and stuff
var canvasElement = $("<canvas id='mainCanvas' width='" + CANVAS_WIDTH + "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('#wrapper');
       
setInterval(function() {
  update();
  draw();
}, 1000/FPS);
        
//Queue Functions
function Push(arrayName,arrayElement){    arrayName.push(arrayElement);   }
function Pop(arrayName){                  arrayName.shift();              }

//Universals
var players = [];
