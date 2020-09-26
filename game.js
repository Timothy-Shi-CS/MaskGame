var gameSettings = {
    playerSpeed: 200,
    mobSpeedMax: 100,
    mobSpeedMin: 40,
    chargeSpeed: 400,
    bulletSpeed: 500,
    stunTime: 5000,
    shootDelay: 500,
    collideCount: 1,
    infectionRate: 0.005,
    maskReductionFactor: 10,
    spotSize: 12,
    mobSize: 16,
    infectionMax: 1000,
    screamDelay: 12000,
    karenHealth: 100,
    playerHealth: 10
}

var config = {
    width: 480,
    height: 360,
    backgroundColor: 0x000000,
    scene: [TitleScreen, Directions, MainScene],
    pixelArt: true,
    autoCenter: true,
    physics: {
        default: "arcade",
        arcade:{
            debug: false,
        }
    }
}

var game = new Phaser.Game(config);
game.scene.start("loadGame");
