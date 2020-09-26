class NewScene extends Phaser.Scene{
    constructor() {
        super("startGame");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0,0);

        this.mob1 = this.add.sprite(config.width/2 - 50, config.height/2, "mob");
        this.mob1.play("mob1_anim");

        this.player = this.physics.add.sprite(config.width/2 - 8, config.height - 64, "player");
        this.player.play("run");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player); 
        this.cameras.main.setBounds(0, 0, this.background.width, this.background.height);
        this.physics.world.setBounds(0,0,this.background.width, this.background.height);
        this.player.setCollideWorldBounds(true);

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.projectiles = this.add.group();
    }

    update(){
        //this.background.tilePositionY -= 0.5;
        this.movePlayer();
        if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
            this.shootProjectile();
        }
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

    movePlayer(){
        this.player.setVelocity(0);
        if(this.cursorKeys.left.isDown){
            this.player.setVelocityX(-gameSettings.playerSpeed);
        }
        else if(this.cursorKeys.right.isDown){
            this.player.setVelocityX(gameSettings.playerSpeed);
        }
        if(this.cursorKeys.up.isDown){
            this.player.setVelocityY(-gameSettings.playerSpeed);
        }
        else if(this.cursorKeys.down.isDown){
            this.player.setVelocityY(gameSettings.playerSpeed);
        }
    }

    resetMobPos(mob){
        mob.y = 0;
        var randomX = Phaser.Math.Between(0, config.width);
        mob.x = randomX;
    }

    shootProjectile(){
        var projectile = new Projectile(this);
    }
}