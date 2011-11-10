
function $Environment()
  {
	this.initialize();
	return;
  }

$Environment.prototype.agent = navigator.userAgent.toLowerCase(); 
$Environment.prototype.MAC   = ($Environment.prototype.agent.indexOf("mac")!=-1);
$Environment.prototype.OPERA = ($Environment.prototype.agent.indexOf("opera") != -1);

$Environment.prototype.E = ($Environment.prototype.agent.indexOf("msie") != -1); 
$Environment.prototype.NS = ($Environment.prototype.agent.indexOf('mozilla')!=-1 && $Environment.prototype.agent.indexOf('spoofer')==-1 && $Environment.prototype.agent.indexOf('compatible') == -1 && $Environment.prototype.agent.indexOf('opera')==-1 && $Environment.prototype.agent.indexOf('webtv')==-1); 

$Environment.prototype.envX = null;
$Environment.prototype.envY = null; 
$Environment.prototype.active = null;

$Environment.prototype.initialize = function()
  {
	document.onmousemove = this.handlerTemplate;
	document.onmouseup = this.handlerTemplate;
	return;
  }  
  
$Environment.prototype.writeToLayer = function(cont)
  {
	if(cont)
	  {
        this.ref.innerHTML = cont;
	  }
	return;
  }
  
$Environment.prototype.getRef = function(r,sty)
  {
    return((sty)?document.getElementById(r).style:document.getElementById(r)); 
  }  
  
$Environment.prototype.makeLayer = function(id,w)
  {
    var L = null;
    var id = id || '';
	var w = w || 10;
	var rID = id || this.getID();
	
    L = document.createElement('DIV');
	document.body.appendChild(L);
	L.setAttribute('style','position:absolute;width:'+w+';');
	L.setAttribute('id',rID);
	L.setAttribute('name',rID);

	return(L);
  }
  
$Environment.prototype.getLayerPosition = function(ref)
  {
    var P = ref.offsetParent;
    var rOb = 
	  {
		left: ref.offsetLeft,
		top: ref.offsetTop
	  };
  	while (P != null) 
	  {
        rOb.left += P.offsetLeft;
		rOb.top += P.offsetTop;
  		P = P.offsetParent;
  	  }
	return(rOb);
  }  
  
$Environment.prototype.addHandler = function(ref,evt,fun)
  {
    var e = evt.toLowerCase();
	var RET = '';
    var CUR = eval('ref.'+e);
	if(!CUR) { eval('CUR = this.handlerTemplate'); }
	var EV = CUR.toString();
	var PRE = (EV.substring(0,EV.lastIndexOf('return',EV.length)));
	var END = (EV.substring(EV.lastIndexOf('return',EV.length),EV.length));
	RET = PRE + fun + '(e);' + END;
	eval('ref.'+e+'='+RET);
	return;  
  }
  
$Environment.prototype.handlerTemplate = function(e)
  {
    e = e || window.event;
	return;
  }
  
$Environment.prototype.getID = function(pref)
  {
    var p = pref || 'X';
    return(p+parseInt(Math.random()*999999999999));
  }  
