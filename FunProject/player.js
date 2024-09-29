export class Player {
    constructor(player, posX, posY){
        this.player = player;
        this.player.position.x = posX;
        this.player.position.y = posY;
    }

    movePlayer(x,y){
        this.player.position.x = x;
    }
}