class MainScene extends Phaser.Scene{
    constructor() {
        super("startGame");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width * 5, config.height * 5, "background");
        this.background.setOrigin(0,0);

        this.projectiles = this.add.group();
        this.player = new Player(this, config.width/2 - 8, config.height - 64, this.projectiles);

        this.mob1 = this.add.sprite(config.width/2 - 50, config.height/2, "mob");
        this.mob1.play("mob1_anim");

        
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player); 
        this.cameras.main.setBounds(0, 0, this.background.width, this.background.height);
        this.physics.world.setBounds(0,0,this.background.width, this.background.height);
        this.player.body.setCollideWorldBounds(true);
    }

    update(){
        //this.background.tilePositionY -= 0.5;
        this.player.update();
        console.log(this.projectiles.getChildren().length)
        for(var i = 0; i < this.projectiles.getChildren().length; i++){
            var beam = this.projectiles.getChildren()[i];
            beam.update();
        }
    }

    moveMob(mob, speed){
        mob.y += speed;
        if (mob.y > config.height){
            this.resetMobPos(mob);
        }
    }

    resetMobPos(mob){
        mob.y = 0;
        var randomX = Phaser.Math.Between(0, config.width);
        mob.x = randomX;
    }
}