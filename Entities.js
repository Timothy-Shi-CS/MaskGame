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
        this.body.setBounce(1);
        this.velocityX = Phaser.Math.Between(-200,200);
        this.velocityY = Phaser.Math.Between(-200,200);
        this.update();
    }

    update(){
        this.body.setDrag(0,0);
        this.body.velocity.x = this.velocityX;
        this.body.velocity.y = this.velocityY;
    }
}