class WinScreen extends Phaser.Scene{
    constructor(){
        super("win");
    }
    create() {
        var image = this.add.image(240, 180, "win");
        this.add.text(120, 200, "Click anywhere to play again");
        image.setInteractive({useHandCursor: true});
        image.on('pointerdown', () => this.clickStart());
    }

    clickStart(){
        this.scene.start("loadGame");
    }
}