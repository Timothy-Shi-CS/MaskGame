class MainScene extends Phaser.Scene{
    constructor() {
        super("startGame");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width * 5, config.height * 5, "background");
        this.background.setOrigin(0,0);
        this.music = this.sound.add('music').play({volume: 0.5, loop: true});

        this.crowd = [this.sound.add('crowd1'), this.sound.add('crowd2')];

        this.crowd[0].play({volume: 0.2, loop: true});
        this.crowd[1].play({volume: 0, loop: true});

        this.infections = 0;
        this.infectionText = this.add.text(10, 10, "Infection: " + this.infections, {
            fontFamily: 'monospace',
            fontSize: 16,
            align: 'left'
        });
        this.infectionText.setScrollFactor(0);

        let spotSize = gameSettings.spotSize;
        this.meetingSpots = this.randomLocations(spotSize);
        this.meetingSpotCounts = new Array(spotSize).fill(0);

        this.projectiles = this.add.group();
        this.mobs = this.add.group();
        this.player = new Player(this, config.width/2 - 8, config.height - 64, this.projectiles);

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

    update(){
        //this.background.tilePositionY -= 0.5;
        this.player.update();
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
    }

    randomLocations(length){
        let locs = [];
        for(let i = 0; i < length; i++){
            let point = [];
            let padding = 32;
            point.push(Phaser.Math.Between(padding, this.background.width - padding));
            point.push(Phaser.Math.Between(padding, this.background.height - padding));
            locs.push(point)
        }

        return locs;
    }

    updateUI(){
        this.infectionText.setText("Infection: " + Math.floor(this.infections));
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