var gameLogic;

function setup() {
    gameLogic = new GameLogic();
    gameLogic.initialize();
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

