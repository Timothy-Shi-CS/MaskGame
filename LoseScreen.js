class LoseScreen extends Phaser.Scene{
    constructor(){
        super("lose");
    }
    create() {
        var image = this.add.image(240, 180, "lose");
        this.add.text(120, 200, "Click anywhere to play again");
        image.setInteractive({useHandCursor: true});
        image.on('pointerdown', () => this.clickStart());
    }

    clickStart(){
        this.scene.start("loadGame");
    }
}