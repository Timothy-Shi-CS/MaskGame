class TitleScreen extends Phaser.Scene{
    constructor() {
        super("loadGame");
    }
    preload(){
        // Load Assets Here
        this.load.image("title", "assets/images/MaskMan.png");
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
        })
    }
    create() {
        // Create animations here
        var image = this.add.image(240, 180, "title");
        this.add.text(140, 200, "Click anywhere to start");
        image.setInteractive({useHandCursor: true});
        image.on('pointerdown', () => this.clickStart());

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

    clickStart(){
        this.scene.start("startGame");
    }
}