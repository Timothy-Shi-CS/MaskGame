class MainScene extends Phaser.Scene{
    constructor() {
        super("startGame");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width * 5, config.height * 5, "background");
        this.background.setOrigin(0,0);

        this.projectiles = this.add.group();
        this.mobs = this.add.group();
        this.player = new Player(this, config.width/2 - 8, config.height - 64, this.projectiles);

        for(let i = 0; i < 100; i++)
            this.mobs.add(new Mob(this, Phaser.Math.Between(16, this.background.width), Phaser.Math.Between(16, this.background.height)));
        
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cameras.main.startFollow(this.player); 
        this.cameras.main.setBounds(0, 0, this.background.width, this.background.height);
        this.physics.world.setBounds(0,0,this.background.width, this.background.height);

        this.initCollisions();
    }

    update(){
        //this.background.tilePositionY -= 0.5;
        this.player.update();
        //console.log(this.projectiles.getChildren().length)
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

    initCollisions(){
        this.physics.add.collider(this.player, this.mobs, function(player, mob){
            player.stunned = true;

            mob.body.setDrag(300,300);
            mob.velocityX = mob.body.velocity.x;
            mob.velocityY = mob.body.velocity.y;

            mob.body.velocity.x = player.body.velocity.x * 1.1;
            mob.body.velocity.y = player.body.velocity.y * 1.1;
            setTimeout(function(mob){mob.update()}, gameSettings.stunTime, mob);
        });

        this.physics.add.collider(this.mobs, this.mobs, function(mob1, mob2){

        });
    }
}