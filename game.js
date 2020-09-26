var gameSettings = {
    playerSpeed: 200,
    mobSpeedMax: 100,
    mobSpeedMin: 40,
    chargeSpeed: 400,
    bulletSpeed: 200,
    stunTime: 5000,
    shootDelay: 500,
    collideCount: 2,
    infectionRate: 0.005
}

var config = {
    width: 480,
    height: 360,
    backgroundColor: 0x000000,
    scene: [TitleScreen, MainScene],
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
