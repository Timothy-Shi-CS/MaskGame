class Entity extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, key){
        super(scene, x, y, key);

        this.scene = scene;
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
    }
}

class Projectile extends Entity{
    constructor(scene, x, y, xVelocity, yVelocity){
        super(scene, x, y, "projectile");
        this.setScale(3);
        this.body.velocity.x = xVelocity;
        this.body.velocity.y = yVelocity;
    }

    update(){
        let camera = this.scene.cameras.main;
        if(this.x < camera.scrollX || this.x > camera.scrollX + config.width ||
            this.y < camera.scrollY || this.y > camera.scrollY + config.height){
            this.destroy();
        }
    }
}

class Player extends Entity{
    constructor(scene, x, y, projectileGroup){
        super(scene, x, y, "player");
        this.body.setCollideWorldBounds(true);
        this.setScale(2);

        this.projectileGroup = projectileGroup;
        this.nextShot = 0;
        this.shift = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    movePlayer(){
        if(this.stunned){
            this.body.velocity.x *= 0.95;
            this.body.velocity.y *= 0.95;

            let minVelocity = 1;

            if(Math.abs(this.body.velocity.x) < minVelocity && Math.abs(this.body.velocity.y) < minVelocity)
                this.stunned = false;

            return;
        }
        this.body.setVelocity(0);
        let charging = false;
        if(this.shift.isDown)
            charging = true;

        let speed = gameSettings.playerSpeed;
        if(charging)
            speed = gameSettings.chargeSpeed;

        if(this.keyA.isDown){
            this.body.setVelocityX(-speed);
            this.flipX = false;
        }
        else if(this.keyD.isDown){
            this.body.setVelocityX(speed);
            this.flipX = true;
        }
        if(this.keyW.isDown){
            this.body.setVelocityY(-speed);
        }
        else if(this.keyS.isDown){
            this.body.setVelocityY(speed);
        }
    }

    update(){
        this.movePlayer();
        if(game.input.activePointer.isDown){
            let pointer = this.scene.input.mousePointer;

            if(this.nextShot < game.getTime()){
                this.nextShot = game.getTime() + gameSettings.shootDelay;
                this.shootProjectile(pointer.worldX, pointer.worldY);
            }
        }
    }

    shootProjectile(pointerX, pointerY){
        let angle = Phaser.Math.Angle.Between(this.x, this.y, pointerX, pointerY);
        let xVelocity = gameSettings.bulletSpeed * Math.cos(angle) + Phaser.Math.Between(-50, 50);
        let yVelocity = gameSettings.bulletSpeed  * Math.sin(angle) + Phaser.Math.Between(-50, 50);
        let projectile = new Projectile(this.scene, this.x, this.y, xVelocity, yVelocity);
        this.projectileGroup.add(projectile)
    }
}

class Karen extends Entity{
    constructor(scene, x, y){
        super(scene, x, y, 'karen');
        this.body.setCollideWorldBounds(true);
        this.setScale(1.6);
        this.body.setBounce(1);
        this.health = 1000;
        this.scene = scene;

        this.body.velocity.x = Phaser.Math.Between(gameSettings.mobSpeedMin * 2, gameSettings.mobSpeedMax * 1.5);
        this.body.velocity.y = Phaser.Math.Between(gameSettings.mobSpeedMin * 2, gameSettings.mobSpeedMax * 1.5);
    }

    update(){
        this.scream();
    }

    scream(){
        let dist = Math.sqrt(Math.pow(this.x - this.scene.player.x, 2) + Math.pow(this.y - this.scene.player.y, 2));

        if(dist <= 300){

        }
    }

    wearMask(){
        this.health --;
    }

    stun(velocityX, velocityY){
        this.stunned = true;
        this.body.setDrag(300,300);
        this.body.velocity.x = velocityX * 1.1;
        this.body.velocity.y = velocityY * 1.1;
    }

    unstun(){
        this.body.setDrag(0,0);
        this.body.velocity.x = Phaser.Math.Between(gameSettings.mobSpeedMin * 2, gameSettings.mobSpeedMax * 1.5);
        this.body.velocity.y = Phaser.Math.Between(gameSettings.mobSpeedMin * 2, gameSettings.mobSpeedMax * 1.5);
    }
}

class Mob extends Entity{
    constructor(scene, x, y){
        let id = Phaser.Math.Between(1,3);
        super(scene, x, y, `mob${id}`);
        this.id = id;
        this.body.setCollideWorldBounds(true);
        this.setScale(2)
        this.body.setBounce(1);

        this.speed = Phaser.Math.Between(gameSettings.mobSpeedMin, gameSettings.mobSpeedMax);
        this.collideCount = gameSettings.collideCount;
        this.stunned = false;
        this.masked = false;
        this.inMeeting = false;

        this.getNewMeetingSpot();
        this.update();
    }
    
    getNewMeetingSpot(){
        if(this.inMeeting){
            this.scene.meetingSpotCounts[this.spotIndex] -= 1;
        }

        this.spotIndex = Phaser.Math.Between(0, this.scene.meetingSpots.length -1)
        this.destination = this.scene.meetingSpots[this.spotIndex];

        this.inMeeting = false;
    }

    wearMask(){
        this.masked = true;
        this.setTexture(`masked${this.id}`);
    }

    stun(velocityX, velocityY){
        this.stunned = true;
        this.body.setDrag(300,300);
        this.body.velocity.x = velocityX * 1.1;
        this.body.velocity.y = velocityY * 1.1;
    }

    unstun(){
        this.body.setDrag(0,0);
        this.collideCount --;
        if(this.collideCount <= 0){
            this.getNewMeetingSpot();
            this.collideCount = gameSettings.collideCount;

            //this.isMeeting = false;
            //this.freeRoam();
        }
        this.stunned = false;
    }

    update(){
        if(!this.stunned){
            this.goToMeetingSpot();
        }

        // if(this.body.velocity.x != 0 && this.body.velocity.y != 0){
        //     let angle = Math.atan2(this.body.velocity.y, this.body.velocity.x);
        //     this.setRotation(angle - Math.PI/2);
        // }
    }

    goToMeetingSpot(){
        let dx = this.destination[0] - this.x;
        let dy = this.destination[1] - this.y;
        let angle = Math.atan2(dy, dx);
        let dist = Math.sqrt(Math.pow(this.destination[0] - this.x, 2) + Math.pow(this.destination[1] - this.y, 2));

        if(dist > 30){
            this.body.velocity.x = this.speed * Math.cos(angle);
            this.body.velocity.y = this.speed * Math.sin(angle);
        }else{
            if(!this.inMeeting){
                this.scene.meetingSpotCounts[this.spotIndex] += 1;
                this.inMeeting = true;
            }

            this.body.velocity.x = 0;
            this.body.velocity.y = 0;

            if(this.scene.meetingSpotCounts[this.spotIndex] > 1 && !this.stunned){
                let rate = gameSettings.infectionRate
                if(this.masked)
                    rate /= gameSettings.maskReductionFactor;

                this.scene.infections += rate;
            }
        }
    }

    freeRoam(){
        this.body.velocity.x = Phaser.Math.Between(-this.speed, this.speed);
        this.body.velocity.y = Phaser.Math.Between(-this.speed, this.speed);
    }
}