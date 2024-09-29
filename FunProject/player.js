export class Player {
    constructor(player, posX, posY, posZ){
        this.player = player;
        this.player.position.x = posX;
        this.player.position.y = posY;
        this.player.position.z = posZ;
    }

    movePlayer(x,y){
        this.player.position.x = x;
    }
}