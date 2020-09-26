class Projectile extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, "projectile");
        scene.add.existing(this);

        this.play("shoot");
        scene.physics.world.enableBody(this);
        this.body.velocity.y = -200;
    }

    update(){
        if(this.y < 30){
            this.destroy();
        }
    }
}