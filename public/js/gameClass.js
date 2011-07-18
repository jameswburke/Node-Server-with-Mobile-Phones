function player(id){
  this.id            = id;
  this.smoothingLR   = new Array();
  this.smoothingFB   = new Array();
  this.smoothedLR    = 0;
  this.smoothedFB    = 0;
  
  this.x = CANVAS_WIDTH/2;
  this.y = CANVAS_HEIGHT/2;
  this.width = 100;
  this.height = 100;

  this.draw = function(num) {
    canvas.save();
    canvas.fillRect(this.x,this.y,this.width,this.height);
    canvas.restore();
  }

  this.update = function(){
    //Stay within Bounds
    if(this.x < 0){
      this.x = 0;
    }else if(this.x > CANVAS_WIDTH-this.width){
      this.x = CANVAS_WIDTH-this.width;
    }

    if(this.y < 0){
      this.y = 0;
    }else if(this.y > CANVAS_HEIGHT-this.height){
      this.y = CANVAS_HEIGHT-this.height;
    }
  }
}
