class MainScene extends Phaser.Scene{
    constructor() {
        super("startGame");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 2300, 1800, "background");
        this.background.setOrigin(0,0);
        this.sound.stopAll();
        this.music = this.sound.add('music').play({volume: 0.5, loop: true});
        this.sound.add('karen1');
        this.sound.add('karen2');
        this.sound.add('karen3');
        this.sound.add('karen4');
        this.sound.add('karen5');
        this.sound.add('karen6');
        this.crowd = [this.sound.add('crowd1'), this.sound.add('crowd2')];

        this.crowd[0].play({volume: 0.2, loop: true});
        this.crowd[1].play({volume: 0, loop: true});

        this.infections = 0;
        this.maskedCount = 0;
        let textStyle = {
            fontFamily: 'monospace',
            fontSize: 16,
            align: 'left'
        };
        this.infectionText = this.add.text(10, 10, "Town Health: " + gameSettings.infectionMax, textStyle);
        this.healthText = this.add.text(10, 30, "Mask Man Health: " + gameSettings.playerHealth, textStyle);
        this.maskedText = this.add.text(10, 50, "Masked: " + 0 + '/' + gameSettings.mobSize, textStyle);
        this.karenText = this.add.text(config.width - 160, 10, "Karen Health: " + gameSettings.karenHealth, textStyle);
        this.infectionText.setScrollFactor(0);
        this.healthText.setScrollFactor(0);
        this.maskedText.setScrollFactor(0);
        this.karenText.setScrollFactor(0);

        this.infectionText.setDepth(2);
        this.healthText.setDepth(2);
        this.maskedText.setDepth(2);
        this.karenText.setDepth(2);

        let spotSize = gameSettings.spotSize;
        this.meetingSpots = this.randomLocations(spotSize);
        this.meetingSpotCounts = new Array(spotSize).fill(0);

        this.decor = this.add.group();
        this.addDecor(100);
        this.projectiles = this.add.group();
        this.mobs = this.add.group();
        this.player = new Player(this, config.width/2 - 8, config.height - 64, this.projectiles);
        let loc = this.randomLocation();
        this.karen = new Karen(this, loc[0], loc[1]);
        this.mobs.add(this.karen);

        for(let i = 0; i < gameSettings.mobSize; i++)
            this.mobs.add(new Mob(this, Phaser.Math.Between(16, this.background.width), Phaser.Math.Between(16, this.background.height)));
        
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cameras.main.startFollow(this.player); 
        this.cameras.main.setBounds(0, 0, this.background.width, this.background.height);
        this.physics.world.setBounds(0,0,this.background.width, this.background.height);

        this.initCollisions();
    }

    addDecor(count){
        for(let i = 0; i < count; i++){
            let id = Phaser.Math.Between(1,5);
            let point = this.randomLocation();
            let decor = this.add.image(point[0], point[1], `decor${id}`);
            if(id == 5)
                decor.setScale(4);
            this.decor.add(decor);
        }
    }

    update(){
        //this.background.tilePositionY -= 0.5;
        this.player.update();
        this.karen.update();
        this.updateUI();
        this.updateSound();
        // console.log(this.infections);
        // console.log(this.meetingSpotCounts)
        //console.log(this.projectiles.getChildren().length)
        for(var i = 0; i < this.projectiles.getChildren().length; i++){
            var beam = this.projectiles.getChildren()[i];
            beam.update();
        }
        for(var i = 0; i < this.mobs.getChildren().length; i++){
            var mob = this.mobs.getChildren()[i];
            mob.update();
        }

        if(this.infections >= gameSettings.infectionMax || this.player.health <= 0){
            console.log('GameOver');
            this.sound.stopAll();
            this.scene.start("lose");
        }
        else {
            if(this.karen.health <= 0 && this.maskedCount == gameSettings.mobSize){
                console.log("WIN");
                this.scene.start("win");
            }
        }
    }

    randomLocations(length){
        let locs = [];
        for(let i = 0; i < length; i++){
            locs.push(this.randomLocation());
        }

        return locs;
    }
    
    randomLocation(){
        let point = [];
        let padding = 32;
        point.push(Phaser.Math.Between(padding, this.background.width - padding));
        point.push(Phaser.Math.Between(padding, this.background.height - padding));

        return point;
    }

    updateUI(){
        this.infectionText.setText("Town Health: " + (gameSettings.infectionMax - Math.floor(this.infections)));
        this.healthText.setText("Mask Man Health: " + this.player.health);
        this.maskedText.setText("Masked: " + this.maskedCount + '/' + gameSettings.mobSize);
        this.karenText.setText("Karen Health: " + this.karen.health);
    }

    updateSound(){
        let maxIndex = indexOfMax(this.meetingSpotCounts);

        let dist = Math.sqrt(Math.pow(this.meetingSpots[maxIndex][0] - this.player.x, 2) + Math.pow(this.meetingSpots[maxIndex][1] - this.player.y, 2));
        let volume = Math.min(1, (100/dist).toFixed(3));

        if(this.meetingSpotCounts[maxIndex] > 1)
            this.crowd[1].setVolume(volume);
        else this.crowd[1].setVolume(0);
    }

    initCollisions(){
        this.physics.add.collider(this.player, this.mobs, function(player, mob){
            player.stunned = true;
            if(mob.name == 'karen')
                player.damage(1);

            mob.stun(player.body.velocity.x, player.body.velocity.y);
            setTimeout(function(mob){mob.unstun()}, gameSettings.stunTime, mob);
        });

        this.physics.add.collider(this.mobs, this.mobs, function(mob1, mob2){

        });

        this.physics.add.overlap(this.projectiles, this.mobs, function(proj, mob){
            mob.wearMask();
            proj.destroy();
        });
    }
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}