const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var rope, rope2, rope3;
var fruit, fruitImg;
var fruitLink, fruitLink2, fruitLink3;
var bgImg;
var rabbit;
var rabbitImg;
var cutButton, cutButton2, cutButton3;
var eating, blinking, sad;
var bgSound, eatingSound, cutSound, airSound, sadSound;
var airbtn, mutebtn;
var fruitConnected = true;
var CW, CH;

function preload(){

  bgImg = loadImage("background.png");
  fruitImg = loadImage("melon.png");
  rabbitImg = loadImage("Rabbit-01.png");
  eating = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");
  blinking = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  bgSound = loadSound("sound1.mp3");
  eatingSound = loadSound("eating_sound.mp3");
  cutSound = loadSound("rope_cut.mp3");
  airSound = loadSound("air.wav");
  sadSound = loadSound("sad.wav");
  blinking.playing = true;
  eating.playing = true;
  sad.playing= true;
  eating.looping = false;
  sad.looping = false;
  blinking.frameDelay = 10;
  eating.frameDelay = 10;
  sad.frameDelay = 10;
  eatingSound.looping = false;
  cutSound.looping = false;
  airSound.looping = false;
  sadSound.looping = false;
}

function setup() 
{
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if(isMobile){
    CW = displayWidth;
    CH = displayHeight;
    createCanvas(CW+80, CH);
  }
  else{
    CW = windowWidth;
    CH = windowHeight;
    createCanvas(CW, CH);
  }
  bgSound.play();
  bgSound.setVolume(0.2);
  frameRate(80);
  engine = Engine.create();
  world = engine.world;
  ground = new Ground(200,CH-5,CW*2,20);
  rope = new Rope(9,{x:40, y:30});
  rope2 = new Rope(7,{x:200, y:50});
  rope3 = new Rope(8,{x:400, y: 150});
  var fruitOptions={
    density: 0.001,
  }
  fruit = Bodies.circle(300,300,15,fruitOptions);
  Composite.add(rope.body, fruit)

  fruitLink = new Link(rope, fruit);
  fruitLink2 = new Link(rope2,fruit );
  fruitLink3  = new Link(rope3, fruit);

  rabbit = createSprite(300, CH-80,100,100);
  rabbit.addImage(rabbitImg);
  rabbit.scale = 0.2;
  rabbit.addAnimation("blinking", blinking);
  rabbit.addAnimation("eating", eating);
  rabbit.addAnimation("sad", sad);
  rabbit.changeAnimation("blinking");

  cutButton = createImg("cut_button.png");
  cutButton.position(30,25);
  cutButton.size(30,30)
  cutButton.mouseClicked(cutRope)

  cutButton2 = createImg("cut_button.png");
  cutButton2.position(190,45);
  cutButton2.size(30,30)
  cutButton2.mouseClicked(cutRope2)

  cutButton3 = createImg("cut_button.png");
  cutButton3.position(380,145);
  cutButton3.size(30,30)
  cutButton3.mouseClicked(cutRope3)

  mutebtn = createImg("mute.png");
  mutebtn.position(CW-100,30);
  mutebtn.size(30,30);
  mutebtn.mouseClicked(pauseSound);

  airbtn = createImg("balloon.png");
  airbtn.position(100,200);
  airbtn.size(90,90);
  airbtn.mouseClicked(blowAir);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
}

function draw() 
{
  background(bgImg);
  ground.show();
  rope.show();
  rope2.show();
  rope3.show();
  
  Engine.update(engine);
  imageMode(CENTER)
  if(fruit!= null){
  image(fruitImg,fruit.position.x,fruit.position.y,50,50);
  }

  if(collided(fruit,rabbit)){
    eatingSound.play();
    rabbit.changeAnimation("eating");
  }

  if(fruit!=null&&fruit.position.y>650){
   fruit = null;
    sadSound.play();
    rabbit.changeAnimation("sad");
  }
  

 drawSprites();
   
}

function cutRope(){
  fruitConnected = false;
  cutSound.play();
  rope.break();
  fruitLink.detatch();
  fruitLink = null;
}

function cutRope2(){
  fruitConnected = false;
  cutSound.play();
  rope2.break();
  fruitLink2.detatch();
  fruitLink2 = null;
}

function cutRope3(){
  fruitConnected = false;
  cutSound.play();
  rope3.break();
  fruitLink3.detatch();
  fruitLink3 = null;
}



function collided(body, sprite){
  if(fruit!=null){
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y)
    console.log(d)
    if(d<70){
      World.remove(world,body);
      fruit = null;
      return true
    }
    else{
      return false
    }
      
    
  }

}

function pauseSound(){
  if(bgSound.isPlaying()){
   console.log("test");
    bgSound.stop();
  }
  else{
    bgSound.play();
  }
}

function blowAir(){
 if(fruitConnected){
  airSound.play();
  Matter.Body.applyForce(fruit,{x:0, y:0},{x:0.01,y:0});
 }
}