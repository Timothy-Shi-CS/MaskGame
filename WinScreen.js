class WinScreen extends Phaser.Scene{
    constructor(){
        super("win");
    }
    create() {
        this.add.image(240, 180, "win");
        var txt = this.add.text(120, 200, "Click here to play again");
        txt.setInteractive({useHandCursor: true});
        txt.on('pointerdown', () => this.clickStart());
    }

    clickStart(){
        this.scene.start("loadGame");
    }
}