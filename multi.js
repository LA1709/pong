var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var gameON = false, upl = false, downl = false, upr = false, downr = false;
window.addEventListener('keydown', kstart, false);
window.addEventListener('keyup', kstop, false);

function kstart(e)
{
  if(e.keyCode==32 && !gameON)
  {
    gameON = true;
    if(Math.random()<0.5) puck.theta = (Math.random() * (Math.PI/2)) - (Math.PI/4);
    else puck.theta = (Math.random() * (Math.PI/2)) + (3*Math.PI/4);
    puck.v = 6;
    start_game = setInterval(start, 16);
  }
  else if(e.keyCode==38) upr = true;
  else if(e.keyCode==40) downr = true;
  else if(e.keyCode==87) upl = true;
  else if(e.keyCode==83) downl = true;
}

function kstop(e)
{
  if(e.keyCode==38) upr = false;
  else if(e.keyCode==40) downr = false;
  else if(e.keyCode==87) upl = false;
  else if(e.keyCode==83) downl = false;
}

var puck = {x:canvas.width/2, y:canvas.height/2, r:10, theta:0.2, v:6};
var rpaddle = {x:980, y: 250, h: 100, w:10};
var lpaddle = {x:10, y: 350, h: 100, w:10};
var lsco = 0, rsco = 0;

function draw()
{
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  ctx.arc(puck.x, puck.y, puck.r, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.fillRect(lpaddle.x, lpaddle.y, lpaddle.w, lpaddle.h);
  ctx.fillRect(rpaddle.x, rpaddle.y, rpaddle.w, rpaddle.h);
  ctx.font = "30px Arial";
  ctx.fillText(lsco, 15, 30);
  ctx.fillText(rsco, 965, 30);
}

function update()
{
  puck.x += puck.v*Math.cos(puck.theta);
  puck.y += puck.v*Math.sin(puck.theta);
  if(upr && rpaddle.y>0) rpaddle.y -= 5;
  if(downr && rpaddle.y+rpaddle.h<canvas.height) rpaddle.y += 5;
  if(upl && lpaddle.y>0) lpaddle.y -= 5;
  if(downl && lpaddle.y+lpaddle.h<canvas.height) lpaddle.y += 5;
}

function edges()
{
  if(puck.y-puck.r<0 || puck.y+puck.r>canvas.height) puck.theta *= -1;
  else if(puck.x-puck.r>canvas.width)
  {
    clearInterval(start_game);
    puck.x = canvas.width/2;
    puck.y = canvas.height/2;
    lsco++;
    draw();
    gameON = false;
  }
  else if(puck.x+puck.r<0)
  {
    clearInterval(start_game);
    puck.x = canvas.width/2;
    puck.y = canvas.height/2;
    rsco++;
    draw();
    gameON = false;
  }
}

function check()
{
  if (puck.x>rpaddle.x && puck.x<rpaddle.x+rpaddle.w && puck.y>rpaddle.y && puck.y<rpaddle.y+rpaddle.h)
  {
    let d = rpaddle.y+rpaddle.h-puck.y;
    puck.theta = (210-(d*0.6))*(Math.PI/180);
    changespeed(d);
  }
  else if (puck.x>lpaddle.x && puck.x<lpaddle.x+lpaddle.w && puck.y>lpaddle.y && puck.y<lpaddle.y+lpaddle.h)
  {
    let d = lpaddle.y+lpaddle.h-puck.y;
    puck.theta = ((d*0.6)-30)*(Math.PI/180);
    changespeed(d);
  }
}

function changespeed(d)
{
  d -= 50;
  if(d<0) d *= -1;
  puck.v = (d*0.08)+6;
}

function start()
{
  draw();
  update();
  edges();
  check();
}

draw();
