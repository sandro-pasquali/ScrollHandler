
function $ScrollThumb(id,def)
  {
    this.id = id;
    this.definition = def || this.definition;
	this.trackTop = 0;
	this.thumbTop = 0;
	this.trackHeight = 0;
	this.scrollIncrement = 0;
	this.obReferences = new Array();
	this.styReferences = new Array();
	this.scrollTimer = null;
	this.bound = false;
	this.trackMDown = null;
    this.lastThumbPos = 0;
    this.thumbOffset = 0;
	this.arrowDown = 0;
    return;
  }

$ScrollThumb.prototype = new $ScrollHandler();
$ScrollThumb.prototype.highZ = 10000;
$ScrollThumb.prototype.active = null;

$ScrollThumb.prototype.definition = 
  {
    useThumb: true,
	useTrack: true,
	useArrows: true,
	internal: true,
	friendly: false,
	uArrow: 'images/def_up.gif',
	dArrow: 'images/def_down.gif',
	thumb: 'images/def_thumb.gif',
	thumbActive: 'images/def_thumb_active.gif',
	track: 'images/def_track.gif',
	trackCap: 'images/def_trackCap.gif',
	width: 16,
	capHeight: 3,
	arrowHeight: 16,
	thumbHeight: 19,
	thumbVisible: 16,
	upStep: 4,
	downStep: 4,
	trackCloseSpeed: .3
  };
  
$ScrollThumb.prototype.applyTo = function(r)
  {
    this.master = r;	
	this.trackHeight = parseInt(this.master.height
	                            -((this.definition.useArrows)
                                  ? 2*this.definition.arrowHeight
								  : 0));
								  
	this.scrollIncrement = (this.master.scrollerHeight-this.master.height)
                           /(this.trackHeight-this.definition.thumbVisible);

    if(this.master.scrollerHeight > this.master.height)
	  {
	    this.make('track'); 
	    this.make('trackCap');
	    this.make('thumb'); 
	    this.make('uArrow');
	    this.make('dArrow');
	
	    this.addHandler(document,'onmousemove',this.id+'.MMove');
	    this.addHandler(document,'onmouseup',this.id+'.MUp');
	  }
	  
	this.lastThumbPos = parseInt(this.styReferences['thumb'].top);  
	this.startTimer();
	
	return;
  }
  
$ScrollThumb.prototype.make = function(typ)
  {
    var M = this.master;
	var D = this.definition;
	
    var left = (D.internal) 
	         ? (M.left+M.width)-D.width
			 : M.left+M.width;
			 
	var top = (typ=='dArrow') 
	          ? M.top+M.height-D.arrowHeight
			  : (typ=='uArrow')
			    ? (D.friendly)
				  ? M.top+M.height-(2*D.arrowHeight)
				  : M.top
				: (D.useArrows)
				  ? (D.friendly)
				    ? M.top
			        : M.top + D.arrowHeight
				  : M.top;
				
	var height = (typ.indexOf('Arrow')!=-1) 
		         ? D.arrowHeight
		         : (typ=='thumb')
                   ? D.thumbHeight
				   : (typ=='trackCap')
				     ? D.capHeight
                     : this.trackHeight;

    if(typ=='track') { this.trackTop = top; }
	if(typ=='thumb') { this.thumbTop = top; }
				   
	var IMID = M.id + typ;
	var NL = this.makeLayer('',D.width)


	var L = document.createElement('IMG');
	NL.appendChild(L);
	L.setAttribute('src',eval("this.definition."+typ));
	L.setAttribute('width',D.width);
	L.setAttribute('height',height);
	L.setAttribute('id',IMID);
	L.setAttribute('name',IMID);
	
	this.addHandler(L,'onmousedown',this.id+'.MDown');
	this.addHandler(L,'onmouseup',this.id+'.MUp');
	
	this.obReferences[typ] = NL;
	NL = NL.style;
	this.styReferences[typ] = NL;

	NL.position = 'absolute';
	NL.left = left;
	NL.top = top;
	NL.zIndex = ++this.highZ;
	
	if((typ.indexOf('Arrow')!=-1&&!D.useArrows)
	 ||(typ=='track'&&!D.useTrack) 
	 ||(typ=='thumb'&&!D.useThumb)) { NL.visibility = 'hidden'; } 
	else { NL.visibility = 'visible'; }
	
	return;
  }
  
$ScrollThumb.prototype.startTimer = function(t)
  {
    if(!this.scrollTimer)
	  {
        this.scrollTimer = setInterval(this.id+'.timerFunction()',t||20);
	  }
	return;
  }  
  
$ScrollThumb.prototype.stopTimer = function()
  {
    clearInterval(this.scrollTimer);
	this.scrollTimer = null;
	return;
  }
  
$ScrollThumb.prototype.bind = function()
  {
	this.bound = true;
	return;
  }  
  
$ScrollThumb.prototype.timerFunction = function()
  {
    if(this.bound)
	  {
	    this.obeyMaster();
	  }  
	if(this.trackMDown)
	  {
	    this.lastThumbPos -= (this.lastThumbPos-this.trackMDown)*this.definition.trackCloseSpeed;
	    this.moveToPoint(this.lastThumbPos);
	  }
	else if(this.arrowDown)
	  {
	    this.moveToPoint(this.lastThumbPos+this.arrowDown);
	  }
	return;
  }

$ScrollThumb.prototype.obeyMaster = function()
  {
    this.styReferences['thumb'].top = this.reverseThumbPos();
	this.lastThumbPos = parseInt(this.styReferences['thumb'].top);  
	return;
  }  
  
$ScrollThumb.prototype.maxThumbPos = function()
  {
    return (this.trackTop+this.trackHeight
		   -((this.definition.useArrows)
             ? this.definition.thumbVisible
		     : this.definition.thumbHeight));	
  }

$ScrollThumb.prototype.reverseThumbPos = function()
  {
    var rev = Math.abs((this.master.scrollTop-this.master.top)/this.scrollIncrement)
	                    + this.master.top + ((this.definition.useArrows)
			    			                 ? (!this.definition.friendly)
				    		                   ? this.definition.arrowHeight
					    				       : 0 
						    			     : 0 );	
	return((rev<0)?0:Math.min(rev,this.maxThumbPos()));
  }

$ScrollThumb.prototype.moveToPoint = function(cM)
  {
    var mT = this.master.top;
	var nP = (this.lastThumbPos>cM) 
		     ? Math.max(this.trackTop,cM) 
			 : (this.lastThumbPos<cM)
			   ? Math.min(this.maxThumbPos(),cM)
			   : cM;

    var chg = nP - mT - ((this.definition.useArrows && !this.definition.friendly)
		                 ? this.definition.arrowHeight
						 : 0 );
	with(this.master)
	  {
	    scrollTop =  mT-(chg*this.scrollIncrement);
	    scrollClipTop = mT-this.master.scrollTop;
	    move(this.lastThumbPos<cM);
	  }
    this.obeyMaster();
	return;
  }  
  
$ScrollThumb.prototype.MMove = function(e)
  {
    this.envX = (this.NS) ? e.pageX : e.clientX;
    this.envY = (this.NS) ? e.pageY : e.clientY; 
	if(this.active)
	  {
        this.moveToPoint(this.envY-this.thumbOffset);
	  }
	else if(this.trackMDown)
	  {
	    var nP = this.envY-(this.definition.thumbVisible/2);
        this.trackMDown = (this.trackMDown<=nP)
		                  ? Math.min(this.maxThumbPos(),nP)
						  : Math.max(this.trackTop,nP);
	  }
    e.cancelBubble = true; // IE only, but benign for others
	e.returnValue = false;
	return;
  }
  
$ScrollThumb.prototype.MUp = function(e)
  {
    this.active = null;
	this.trackMDown = null; 
	this.bound = true;
	this.arrowDown = 0;
	return;
  }

$ScrollThumb.prototype.MDown = function(e)
  {
    if(!this.scrollTimer) { this.startTimer(); }
	
	var src = (this.NS) ? e.target
	                    : e.srcElement;
    var id = src.id;
    if(id) 
	  {
		if(id.indexOf('uArrow')!=-1)
		  {
		    this.arrowDown = -this.definition.upStep;
		  }
		else if(id.indexOf('dArrow')!=-1)
		  {
		    this.arrowDown = this.definition.downStep;
		  }
		else if(id.indexOf('thumb')!=-1)
		  {
		    this.active = this.styReferences['thumb'];
            this.lastThumbPos = parseInt(this.active.top);
		    this.thumbOffset = this.envY - this.lastThumbPos;
			this.bound = false;
		  }
		else if(id.indexOf('track')!=-1)
		  {
            this.trackMDown = (this.envY-(this.definition.thumbVisible/2));
		  }
		else { return; }
	  }
	return;
  }
