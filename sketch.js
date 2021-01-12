//Create variables here
var dog, happyDog, database, foodS, foodStock;
var dogImg, happyDogImg;
var foodObj,fedTime,lastFed; 
var feedDog,addfoods
var changingGameState,readingGameState
var bedroom,garden,washroom,b,g,w;
var gameState;

function preload()
{
  //load images here
  dogImg=loadImage("Dog.png");

  happyDog=loadImage("happydog.png");
  b=loadImage("Bed Room.png");
  w=loadImage("Wash Room.png");
  g=loadImage("Garden.png");
}

function setup() {
  createCanvas(1000, 400);
  database=firebase.database();
  foodObj =new Milk();
  dog=createSprite(900,250,20,20);
  dog.addImage(dogImg);
  dog.scale=0.2;

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(fedDog);

  addfood=createButton("Add Food");
  addfood.position(800,95);
  addfood.mousePressed(addFoods);
  
  foodStock=database.ref('Food');
  foodStock.on("value",function(data){
    foodS=data.val();
    foodObj.updateFoodStock(foodS);
  })

  fedTime=database.ref('FeedTime');
  fedTime.on("value",(data)=>{
    lastFed=data.val();
  })

  readState=database.ref('gameState');
  readState.on("value",(data)=>{
    gameState=data.val();
  })
}


function draw() {  
  
  currentTime=hour();
  if(currentTime==(lastFed+1))
  {    
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime==(lastFed+2))
  {
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4))
  {
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry");
    foodObj.display();
  }
  if(gameState!="Hungry")
  {
    //alert("error");
    feed.hide();
    addfood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addfood.show();
    dog.addImage(dogImg)
  }
    
   drawSprites();
  //add styles here

}

function fedDog()
{
  
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}
function addFoods()
{
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state)
{
  database.ref('/').update({
    gameState:state
  })
}