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
        if(this.y < 30){
            this.destroy();
        }
    }
}

class Player extends Entity{
    constructor(scene, x, y){
        super(scene, x, y, "player");

        this.spacebar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    movePlayer(){
        this.body.setVelocity(0);
        if(this.keyA.isDown){
            this.body.setVelocityX(-gameSettings.playerSpeed);
        }
        else if(this.keyD.isDown){
            this.body.setVelocityX(gameSettings.playerSpeed);
        }
        if(this.keyW.isDown){
            this.body.setVelocityY(-gameSettings.playerSpeed);
        }
        else if(this.keyS.isDown){
            this.body.setVelocityY(gameSettings.playerSpeed);
        }
    }

    update(){
        this.movePlayer();
        if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
            let pointer = this.scene.input.mousePointer;
            this.shootProjectile(pointer.worldX, pointer.worldY);
        }
    }

    shootProjectile(pointerX, pointerY){
        let angle = Phaser.Math.Angle.Between(this.x, this.y, pointerX, pointerY);
        let xVelocity = gameSettings.bulletSpeed * Math.cos(angle) + Phaser.Math.Between(-50, 50);
        let yVelocity = gameSettings.bulletSpeed  * Math.sin(angle) + Phaser.Math.Between(-50, 50);
        var projectile = new Projectile(this.scene, this.x, this.y, xVelocity, yVelocity);
    }
}