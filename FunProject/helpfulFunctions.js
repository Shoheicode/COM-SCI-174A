function touchingPlayerBallTouch(player, ball, boxArea){
    console.log("PLAYER X: " + player.position.x + boxArea[0]);
    console.log("Ball X: " + ball.position.x);
    if(player.position.y < ball.position.y){
        if(player.position.y+boxArea[1] > ball.position.y && player.position.x + boxArea[0] < ball.position.x ){
            return true;
        }
    }else{
        if(player.position.y-boxArea[1] < ball.position.y && player.position.x + boxArea[0] < ball.position.x ){
            return true;
        }
    }
    return false;
}

export {touchingPlayerBallTouch};