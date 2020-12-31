var scene, zombie, scoreText;
var scores = 0;

var gameOver = false;

function start() {
  scene = $('a-scene')[0];
  zombie = $('.dummy-zombie');
  scoreText = $('#score-text');
  $('.menu-zombie').on('hitstart',startGame);
  console.log("The scene is ready", scene);
}

function startGame(){
  addZombie();
  $('.menu-zombie').remove();
  scoreText.attr('visible', 'true');
  $('#game-title').attr('visible','false');
  var musicTag = $('#bgmusic-sound')[0];
  musicTag.components.sound.playSound();
}

function getDirection(x, y, z, direction){
  var randomNum;
  if (direction == 'random'){
    randomNum = getRandom(0, 3);
  } else {
    randomNum = direction;
  }  
  if (randomNum == 0) {
    x = '-' + x;
    z = '-' + z;
  } else if(randomNum == 1) {
    z = '-' + z;
  } else if (randomNum == 2) {
    x = '-' + x;
  }
  return x + ' ' + y + ' ' + z;
}

function getRandom(min, max) {
  var diff = max - min;
  var randomNum = Math.random()*diff + min;
  return Math.round(randomNum);
}

function addZombie() {
  var newZombie = zombie.clone();
  newZombie.attr('visible', 'true');
  newZombie.attr('class', 'zombie');
  newZombie.on('hitstart', die);
  newZombie.attr("sound", "src:#zombie; autoplay: true; loop:true;");
  var zombiePosition = zombie.attr('position');
  var randomX = getRandom(5, 30);
  var randomZ = getRandom(5, 30);
  console.log(zombiePosition, newZombie);
  var position = getDirection(randomX, zombiePosition.y, randomZ, 'random');
  console.log(position);
  newZombie.attr('position', position);
  newZombie.on('animationcomplete', endgame);
  $(scene).append(newZombie);
}

function endgame() {
  event.target.remove();
  gameOver = true;
  $('#bgmusic-sound')[0].components.sound.pauseSound();
  $('#gameover-sound')[0].components.sound.playSound();
  $('#game-over-text').attr('visible', 'true');
}

function die() {
  var collidedZombie = event.target;
  scores = scores + 1;
  $('#hit-sound')[0].components.sound.playSound();
  scoreText.attr('value', 'Scores: ' + scores);
  collidedZombie.remove();
  addZombie();
}

AFRAME.registerComponent("start-game", {
  init: start
});

function fire(bullet, aim) {
  var newBullet = $(bullet).clone();
  newBullet.attr('visible', 'true');
  newBullet.attr('class', 'plant');
  var bulletPos = $(bullet).attr('position');
  var target = aim.x + ' ' + bulletPos.y + ' ' + aim.z;
  newBullet.on('animationcomplete', vanish);
  newBullet.attr('animation', 'property:position; to:'+ target + '; dur:5000');
  $(scene).append(newBullet);
}

function vanish(){
  event.target.remove();
}

function shoot() {
  var bullet = this.data;
  $(this.el).on('click', function(evt){
    var aim = evt.detail.intersection.point;
    if(!gameOver){
    fire(bullet, aim);
    }
  });
}

AFRAME.registerComponent("shoot", {
  schema: {type: "selector"},
  init: shoot
});

function rotate() {
  var rotationVal = $(this.el).attr('rotation');
  $('.zombie').attr('rotation', rotationVal.x + ' ' + rotationVal.y + ' ' + rotationVal.z);
}

AFRAME.registerComponent("rotation-reader", {
  tick: rotate
});