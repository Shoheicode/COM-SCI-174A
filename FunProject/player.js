export class Player {
    constructor(player, posX, posY, posZ){
        this.player = player;
        this.player.position.x = posX;
        this.player.position.y = posY;
        this.player.position.z = posZ;
    }

    movePlayerX(x){
        this.player.position.x += x;
    }

    movePlayerY(y){
        this.player.position.y += y; 
    }

    movePlayerZ(y){
        this.player.position.y += y; 
    }
}