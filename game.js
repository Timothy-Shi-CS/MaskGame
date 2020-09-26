var gameSettings = {
    playerSpeed: 200,
}

var config = {
    width: 480,
    height: 360,
    backgroundColor: 0x000000,
    scene: [TitleScreen, NewScene],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade:{
            debug: false,
        }
    }
}

var game = new Phaser.Game(config);
