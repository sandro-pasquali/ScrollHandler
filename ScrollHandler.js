
function $ScrollHandler(id,spd,dist)
  {
    this.id = id;
	this.speed = spd || 25;
	this.scrollDistance = dist || 4;
	this.loop = 0;
	this.delay = 0;
	this.auto = false;
	this.terminalFunction = null;
	this.scrollClipTop = 0;
	return;
  }

$ScrollHandler.prototype =  new $Environment();
$ScrollHandler.prototype.timer = null;

$ScrollHandler.prototype.applyToLayer = function(ref,l,t,w,h)
  {
	this.ref = this.getRef(ref);
    this.width = w;
    this.height = h;
    this.left = l;
    this.top = t; 
    this.scrollTop = t;
	
    this.setClipping();
	
	with(this.ref.style)
	  {
	    position = 'absolute';
	    left = this.left;
	    top = this.top;
	    height = this.height;
	    width = this.width;
	  }

	return;
  }

$ScrollHandler.prototype.applyToImage = function(ref,cont,spd,dist)
  {

    var oP = this.getLayerPosition(ref);
    this.top = this.scrollTop = oP.top;
	this.left = oP.left;

    this.width = ref.width;
    this.height = ref.height;	
		
	this.ref = this.makeLayer(this.getID(),this.width);

	with(this.ref.style)
	  {
	    position = 'absolute';
	    left = this.left;
	    top = this.top;
	    width = this.width;
	  }
	
	this.writeToLayer(cont);
	this.ref.style.visibility = 'visible';
	
	this.reset();
	this.setClipping();
	
	return;  
  }
  
$ScrollHandler.prototype.setClipping = function()
  {
	this.scrollerHeight = (this.MAC || this.NS) ? this.ref.offsetHeight
									                            : this.ref.clientHeight;								  
	this.ref.style.clip = 'rect(0px ' + this.width + 'px ' + this.height + 'px 0px)';
	return;
  }  
  
$ScrollHandler.prototype.handleScroll = function(up)
  {
    if((up&&this.scrollClipTop>0)||(!up&&this.scrollClipTop<(this.scrollerHeight-this.height)))
	  {
       this.scrollClipTop = (up) ? this.scrollClipTop - this.scrollDistance 
		                             : this.scrollClipTop + this.scrollDistance;
	    this.scrollTop = (up) ? this.scrollTop + this.scrollDistance 
		                        : this.scrollTop - this.scrollDistance;	
		this.move();
		if(this.auto)
		  {
		    this.timer = setTimeout(this.id +'.handleScroll('+((up)?1:'')+')',this.speed);
		  }
	  }
	else if(this.auto)
	  {
		if(this.loop-1>0)
		  {
		    --this.loop;
            this.timer = setTimeout(this.id + '.reset();' + this.id + '.handleScroll();',this.delay);
		  }
		else 
		  { 
		    this.stop();
		    eval(this.terminalFunction); 
		  }
	  }
	return;
  }
  
$ScrollHandler.prototype.move = function(up)
  {
    this.ref.style.top = this.scrollTop;
    this.ref.style.clip = 'rect(' + this.scrollClipTop + 'px ' + this.width + 'px ' + (this.height+this.scrollClipTop) + 'px 0px)';   
	  return;
  }  

$ScrollHandler.prototype.reset = function()
  {
    this.scrollTop = this.top;
	  this.scrollClipTop = 0;
	  return;
  }  
  
$ScrollHandler.prototype.stop = function()
  {
    this.auto = false;
	  this.loop = 0;
	  clearTimeout(this.timer);
	  return;
  }

$ScrollHandler.prototype.pause = function()
  {
    this.auto = false;
	  return;
  }  
  
$ScrollHandler.prototype.start = function()
  {
    this.auto = true;
	  this.handleScroll();
	  return;
  }
  
$ScrollHandler.prototype.repeat = function(loop,del,fun,spd,dist)
  {
    this.stop();
	  this.reset();
    this.speed = spd || this.speed;
	  this.scrollDistance = dist || this.scrollDistance;
	  this.delay = del || 0;
	  this.loop = loop || 0;
	  this.terminalFunction = fun || '';
	  this.start();
	  return;
  }  
  
$ScrollHandler.prototype.killScroll = function()
  {
    clearTimeout(this.timer);
	  return;
  }
  

