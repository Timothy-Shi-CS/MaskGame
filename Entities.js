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

        this.play("shoot");
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
        this.play("run");

        this.projectileGroup = projectileGroup;
        this.nextShot = 0;
        this.spacebar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
        }
        else if(this.keyD.isDown){
            this.body.setVelocityX(speed);
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
        if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
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

class Mob extends Entity{
    constructor(scene, x, y){
        super(scene, x, y, "ship");
        this.play("mob1_anim");

        this.body.setCollideWorldBounds(true);
        this.setScale(1.2)
        this.body.setBounce(1);

        this.destination = scene.meetingSpots[Phaser.Math.Between(0, scene.meetingSpots.length -1)];
        this.speed = Phaser.Math.Between(gameSettings.mobSpeedMin, gameSettings.mobSpeedMax);
        this.collideCount = gameSettings.collideCount;
        this.stunned = false;
        this.masked = false;
        this.isMeeting = true;
        this.update();
    }
    
    wearMask(){
        this.masked = true;
        // update sprite
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
            this.destination = this.scene.meetingSpots[Phaser.Math.Between(0, this.scene.meetingSpots.length -1)];
            this.collideCount = gameSettings.collideCount;

            //this.isMeeting = false;
            //this.freeRoam();
        }
        this.stunned = false;
    }

    update(){
        if(!this.stunned && this.isMeeting){
            this.goToMeetingSpot();
        }

        if(this.body.velocity.x != 0 && this.body.velocity.y != 0){
            let angle = Math.atan2(this.body.velocity.y, this.body.velocity.x);
            this.setRotation(angle - Math.PI/2);
        }
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
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }
    }

    freeRoam(){
        this.body.velocity.x = Phaser.Math.Between(-this.speed, this.speed);
        this.body.velocity.y = Phaser.Math.Between(-this.speed, this.speed);
    }
}