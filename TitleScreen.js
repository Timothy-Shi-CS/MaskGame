class TitleScreen extends Phaser.Scene{
    constructor() {
        super("loadGame");
    }
    preload(){
        // Load Assets Here
        this.load.image("background", "assets/images/MaskMan_background.png");
        this.load.spritesheet("mob", "assets/sprites/ship.png",{
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("player", "assets/sprites/Mask_Man_Player.png",{
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("projectile", "assets/sprites/beam.png",{
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.audio("crowd1", 'assets/sounds/crowd1.wav');
        this.load.audio("crowd2", 'assets/sounds/crowd2.wav');
        this.load.audio("music", 'assets/sounds/Mask_Man_Music.wav');

    }
    create() {
        // Create animations here
        this.add.text(20, 20, "Loading game...");
        this.scene.start("startGame");

        this.anims.create({
            key: "mob1_anim",
            frames: this.anims.generateFrameNumbers("mob"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "shoot",
            frames: this.anims.generateFrameNumbers("projectile"),
            frameRate: 20,
            repeat: -1,
        });
    }
}