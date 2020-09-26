class MainScene extends Phaser.Scene{
    constructor() {
        super("startGame");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width * 5, config.height * 5, "background");
        this.background.setOrigin(0,0);

        this.infections = 0;
        let spotSize = 2;
        this.meetingSpots = this.randomLocations(spotSize);
        this.meetingSpotCounts = new Array(spotSize).fill(0)

        this.projectiles = this.add.group();
        this.mobs = this.add.group();
        this.player = new Player(this, config.width/2 - 8, config.height - 64, this.projectiles);

        for(let i = 0; i < 2; i++)
            this.mobs.add(new Mob(this, Phaser.Math.Between(16, this.background.width), Phaser.Math.Between(16, this.background.height)));
        
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player); 
        this.cameras.main.setBounds(0, 0, this.background.width, this.background.height);
        this.physics.world.setBounds(0,0,this.background.width, this.background.height);

        this.initCollisions();
    }

    update(){
        //this.background.tilePositionY -= 0.5;
        this.player.update();
        console.log(this.infections);
        console.log(this.meetingSpotCounts)
        //console.log(this.projectiles.getChildren().length)
        for(var i = 0; i < this.projectiles.getChildren().length; i++){
            var beam = this.projectiles.getChildren()[i];
            beam.update();
        }
        for(var i = 0; i < this.mobs.getChildren().length; i++){
            var mob = this.mobs.getChildren()[i];
            mob.update();
        }
    }

    randomLocations(length){
        let locs = [];
        for(let i = 0; i < length; i++){
            let point = [];
            let padding = 100;
            point.push(Phaser.Math.Between(padding, this.background.width - padding));
            point.push(Phaser.Math.Between(padding, this.background.width - padding));
            locs.push(point)
        }

        return locs;
    }

    initCollisions(){
        this.physics.add.collider(this.player, this.mobs, function(player, mob){
            player.stunned = true;
            mob.stun(player.body.velocity.x, player.body.velocity.y);
            setTimeout(function(mob){mob.unstun()}, gameSettings.stunTime, mob);
        });

        this.physics.add.collider(this.mobs, this.mobs, function(mob1, mob2){

        });

        this.physics.add.collider(this.projectiles, this.mobs, function(proj, mob){
            mob.wearMask();
            proj.destroy();
        });
    }
}