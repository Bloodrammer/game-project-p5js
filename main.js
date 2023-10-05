var gameLogic;
var data
//import levelOneData from ;
var levelOneData
function preload(){
    levelOneData = loadJSON("levels/room1.json");
}

function setup() {
    gameLogic = new GameLogic();
    gameLogic.initialize();



//    var json = jQuery.getJSON('./levels/room1.json');
//    console.log(json)
//    fetch('./levels/room1.json').then((response) => response.json()).then((data) => console.log(data))
//    console.log(JSON.stringify(json))
}


function draw() {
    gameLogic.getCurrentScene().update();


//    
//    if (gameState === 0) {
//        gameStateZeroUpdate();
//    } else if (gameState === 1) {
//        gameStateOneUpdate()
//    } else if (gameState === 2) {
//        gameStateTwoUpdate()
//    } else if (gameState === 3) {
//        gameStateThreeUpdate()
//    }


}

