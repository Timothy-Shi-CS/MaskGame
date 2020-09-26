class TitleScreen extends Phaser.Scene{
    constructor() {
        super("loadGame");
    }
    preload(){
        // Load Assets Here
        this.load.image("title", "assets/images/MaskMan.png");
        this.load.image("blank", "assets/images/Blank.png");
        this.load.image("win", "assets/images/YouWin.png");
        this.load.image("lose", "assets/images/YouLose.png");
        this.load.image("background", "assets/images/MaskMan_background.png");
        this.load.image("player", "assets/sprites/Mask_Man_Player.png");
        this.load.image("mob1", "assets/sprites/MaskMan_Maskless1.png");
        this.load.image("mob2", "assets/sprites/MaskMan_Maskless2.png");
        this.load.image("mob3", "assets/sprites/MaskMan_Maskless3.png");
        this.load.image("masked1", "assets/sprites/MaskMan_Masked1.png");
        this.load.image("masked2", "assets/sprites/MaskMan_Masked2.png");
        this.load.image("masked3", "assets/sprites/MaskMan_Masked3.png");
        this.load.image("karen", "assets/sprites/MaskMan_Karen.png");
        this.load.image("maskedKaren", "assets/sprites/MaskMan_Karenmasked.png");

        this.load.image("decor1", "assets/images/bush.png");
        this.load.image("decor2", "assets/images/flower_1.png");
        this.load.image("decor3", "assets/images/rock_1.png");
        this.load.image("decor4", "assets/images/stones.png");
        this.load.image("decor5", "assets/images/tree.png");

        this.load.image("projectile", "assets/sprites/mask_projectile.png");

        this.load.audio("crowd1", 'assets/sounds/crowd1.wav');
        this.load.audio("crowd2", 'assets/sounds/crowd2.wav');
        this.load.audio("music", 'assets/sounds/Mask_Man_Music.wav');
        this.load.audio("karen1", 'assets/sounds/karen1.wav');
        this.load.audio("karen2", 'assets/sounds/karen2.wav');
        this.load.audio("karen3", 'assets/sounds/karen3.wav');
        this.load.audio("karen4", 'assets/sounds/karen4.wav');
        this.load.audio("karen5", 'assets/sounds/karen5.wav');
        this.load.audio("karen6", 'assets/sounds/karen6.wav');

    }
    create() {
        // Create animations here
        var image = this.add.image(240, 180, "title");
        this.add.text(140, 200, "Click anywhere to start");
        image.setInteractive({useHandCursor: true});
        image.on('pointerdown', () => this.clickStart());
    }

    clickStart(){
        this.scene.start("directions");
    }
}