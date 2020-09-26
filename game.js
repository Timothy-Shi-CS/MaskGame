var gameSettings = {
    playerSpeed: 200,
    chargeSpeed: 400,
    bulletSpeed: 200,
    stunTime: 5000,
    shootDelay: 800
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
