class Directions extends Phaser.Scene{
    constructor(){
        super("directions");
    }
    create() {
        var image = this.add.image(240, 180, "blank");
        this.add.text(120, 50, "WASD - Move");
        this.add.text(120, 100, "CLICK - Fire");
        this.add.text(120, 150, "SHIFT - Run");
        this.add.text(120, 200, "WATCH OUT FOR KAREN");
        this.add.text(120, 250, "Click anywhere to start");

        image.setInteractive({useHandCursor: true});
        image.on('pointerdown', () => this.clickStart());
    }

    clickStart(){
        this.scene.start("startGame");
    }
}