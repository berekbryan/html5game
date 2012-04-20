// some variables that we gonna use in this demo  
var initId = 0;  
var player = function(){  
    this.object = null;  
    this.canJump = false;  
};  
var world;  
var ctx;  
var canvasWidth;  
var canvasHeight;  
var keys = [];  
  
// HTML5 onLoad event  
Event.observe(window, 'load', function() {  
    world = createWorld(); // box2DWorld  
    ctx = $('game').getContext('2d'); // 2  
    var canvasElm = $('game');  
    canvasWidth = parseInt(canvasElm.width);  
    canvasHeight = parseInt(canvasElm.height);  
    initGame(); // 3  
    step(); // 4  
  
// 5  
    window.addEventListener('keydown', handleKeyDown, true);  
    window.addEventListener('keyup', handleKeyUp, true);  
});

function initGame(){  
    // create 2 big platforms  
    createBox(world, canvasWidth/2, canvasHeight-10, canvasWidth/2, 10, true, 'ground');
	createBox(world, canvasWidth-10, canvasHeight/2, 10, canvasHeight/2, true, 'rightwall');  
    createBox(world, 10, canvasHeight/2, 10, canvasHeight/2, true, 'leftwall');  
    createBox(world, canvasWidth/2, 10, canvasWidth/2, 10, true, 'ceiling');  

    // create player ball  
    var ballSd = new b2CircleDef();  
    ballSd.density = 0.1;  
    ballSd.radius = 12;  
    ballSd.restitution = 0.5;  
    ballSd.friction = 1;  
    ballSd.userData = 'player';  
    var ballBd = new b2BodyDef();  
    ballBd.linearDamping = .03;  
    ballBd.allowSleep = false;  
    ballBd.AddShape(ballSd);  
    ballBd.position.Set(50,350);  
    player.object = world.CreateBody(ballBd);  
  
}  
  
//Inside <code>box2dutils.js</code>, we've created a function, called <code>createBox</code>. This creates a static rectangle body.  
 
function createBox(world, x, y, width, height, fixed, userData) { 
    if (typeof(fixed) == 'undefined') fixed = true;  
    //1  
	var boxSd = new b2BoxDef();  
    if (!fixed) boxSd.density = 1.0;  
    //2  
    boxSd.userData = userData;  
    //3  
    boxSd.extents.Set(width, height);  
  
    //4  
    var boxBd = new b2BodyDef();  
    boxBd.AddShape(boxSd);  
    //5  
    boxBd.position.Set(x,y);  
    //6  
    return world.CreateBody(boxBd)  
}

function step() {  
	handleInteractions();  
    var stepping = false;  
    var timeStep = 1.0/60;  
    var iteration = 1;  
    // 1  
    world.Step(timeStep, iteration);  
    // 2  
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);  
    drawWorld(world, ctx);  
    // 3  
    setTimeout('step()', 10);  
}

function handleKeyDown(evt){  
    keys[evt.keyCode] = true;
}  
  
function handleKeyUp(evt){  
    keys[evt.keyCode] = false;  
}  

  
// disable vertical scrolling from arrows :)  
document.onkeydown=function(){return event.keyCode!=38 && event.keyCode!=40}

function handleInteractions(){  
    // up arrow  
    // 1  
    var collision = world.m_contactList;  
    player.canJump = false;  
    if (collision != null){  
        if (collision.GetShape1().GetUserData() == 'player' || collision.GetShape2().GetUserData() == 'player'){  
            if ((collision.GetShape1().GetUserData() == 'ground' || collision.GetShape2().GetUserData() == 'ground')){  
                var playerObj = (collision.GetShape1().GetUserData() == 'player' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());  
                var groundObj = (collision.GetShape1().GetUserData() == 'ground' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());  
                if (playerObj.y < groundObj.y){  
                    player.canJump = true;  
                }  
            }  
        }  
    }  
    // 2  
    var vel = player.object.GetLinearVelocity();  
    // 3  
    if (keys[38] && player.canJump){  
        vel.y = -150;  
    }  
  
    // 4  
    // left/right arrows 
    if (keys[37]){  
        vel.x = -60;  
    }  
    else if (keys[39]){  
        vel.x = 60;  
    }  
	
	// 5
	// space
	if (keys[32]){
		console.log()
		var ball = createBall(world, player.object.GetOriginPosition().x+10, player.object.GetOriginPosition().y, 1);
		var temp = ball.GetLinearVelocity();
		temp.x = 500;
		//ball.object.SetLinearVelocity(temp);
		keys[32] = false;
	}
    // 5  
    player.object.SetLinearVelocity(vel);  
}  