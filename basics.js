function c(dataIn){console.log(dataIn);};
//B0
//отладка
class debugMsg{
	constructor(){
		this.warningFlag=	false;
		this.errorFlag=		true;
	};
	msg(keyConstIn,dataIn){
		switch(keyConstIn){
			case 'w':
				if(this.warningFlag){
					console.log('! '+dataIn);
				};
			break;
			case 'e':
				if(this.errorFlag){
					console.log('!! '+dataIn);
				};
			break;
			default:
				console.log('B0. Ключ ошибки не корректен');
			break;
		};
	};
};
var deb=new debugMsg();
//B1
//координаты
class xyClass{
	constructor(x1,y1,x2,y2){
		this.x1=x1;
		this.y1=y1;
		this.x2=x2;
		this.y2=y2;
		this.xyWidth=x2-x1;
		this.xyHeight=y2-y1;
		//проверять колизию? (по умолчанию)
		this.flagCheckFullCollision=true;
		this.flagCheckPartCollision=true;
	};
	resizeByX(xIn){
		this.x1-=xIn;
		this.x2+=xIn;
		this.xyWidth=this.x2-this.x1;
	};
	//проверка полного пересечения
	checkCollision(cX1,cY1,cX2,cY2){
		if(this.flagCheckFullCollision){
			return ((this.x1<=cX1)&&(cX1<=this.x2)&&(this.x1<=cX2)&&(cX2<=this.x2)&&(this.y1<=cY1)&&(cY1<=this.y2)&&(this.y1<=cY2)&&(cY2<=this.y2));
		};
	};
	//проверка частичного пересечения
	checkPartCollision(cX1,cY1,cX2,cY2){
		if(this.flagCheckPartCollision){
			let res;
			/*
			if(arguments.lenght==1){
				let xy=cX1;
				cY2=xy.y2;
				cX2=xy.x2;
				cY1=xy.y1;
				cX1=xy.x1;
				c('1');
			};
			*/
			res=
			(
				(
					(this.x1<=cX1)&&(cX1<=this.x2)&&
					(this.y1<=cY1)&&(cY1<=this.y2)
				)||
				(
					(this.x1<=cX2)&&(cX2<=this.x2)&&
					(this.y1<=cY2)&&(cY2<=this.y2)
				)||
				(
					(this.x1<=cX1)&&(cX1<=this.x2)&&
					(this.y1<=cY2)&&(cY2<=this.y2)
				)||
				(
					(this.x1<=cX2)&&(cX2<=this.x2)&&
					(this.y1<=cY1)&&(cY1<=this.y2)
				)
			);
			return res;
		};
	};
	//обновить координаты коллизии
	updateX(deltaIn){
		this.x1+=deltaIn;
		this.x2+=deltaIn;
	};
	updateY(deltaIn){
		this.y1+=deltaIn;
		this.y2+=deltaIn;
	};
};
//B2
//класс данных типа xyClass
class xyStackClass{
	constructor(dataIn){
		this.data=dataIn;
	};
	getCollision(xyIn,deltaIn){
		for(let obj of this.data.values()){
			if(obj.checkCollision(
				xyIn.x1+deltaIn.x,
				xyIn.y2+deltaIn.y,
				xyIn.x2+deltaIn.x,
				xyIn.y2+deltaIn.y)
			)
			return true;
		};
	};
	//возвращает обьект пересечения - прямоугольник
	getSquare(xyIn,deltaIn){
		for(let obj of this.data.values()){
			if(obj.checkCollision(
				xyIn.x1+deltaIn.x,
				xyIn.y2+deltaIn.y,
				xyIn.x2+deltaIn.x,
				xyIn.y2+deltaIn.y)
			)
			return obj;
		};
	};
};
//B3
//координаты и данные анимационного спрайта
class spriteAnimateClass{
	constructor(x1,y1,x2,y2,parts,delay){
		this.xyFirst=		new xyClass(x1,y1,x2,y2);	//координаты первого спрайта
		this.parts=			parts;						//число спрайтов анимации
		this.circleOnceFlag=false;						//сист.: Флаг повтора анимации
		this.delay=			delay;						//Задержка анимации. >0
		this.xyCurrent=		new xyClass(x1,y1,x2,y2);	//текущие значения координат
		this.ch=			0;
		this.delayCh=		1;
		this.xStart=		this.xyFirst.x1;
		this.unvisibleFlag=	false;
	};
	nextSprite(){										//сдвинуть облать выреза
		if(this.parts>1){
			if(this.delayCh==this.delay){
				if(this.ch==this.parts)
				{
					this.ch=0;
					if(this.circleOnceFlag){this.parts=0;};
				};
				this.xyCurrent.x1=this.xyFirst.x1+this.xyFirst.xyWidth*this.ch;
				this.xyCurrent.x2=this.xyCurrent.x1+this.xyFirst.xyWidth;
				//this.xyCurrent.x1+=this.xyFirst.xyWidth;
				//this.xyCurrent.x2+=this.xyFirst.xyWidth;
				/*
				if(this.ch==(this.parts-1))
				{
					//this.xyCurrent.x1=this.xStart+this.xyFirst.x1;
					//this.xyCurrent.x2=this.xyCurrent.x1+this.xyFirst.xyWidth;
					this.ch=0;
				};
				*/
				this.ch++;
				this.delayCh=1;
				/*
				if(this.parts<this.ch){
					this.ch=1;
					this.xyCurrent.x1=this.xyFirst.x1;
					this.xyCurrent.x2=this.xyFirst.x2;
				}else{
					this.xyCurrent.x1+=this.xyFirst.xyWidth;
					this.xyCurrent.x2+=this.xyFirst.xyWidth;
				};
				this.ch++;
				this.delayCh=1;
				*/
			}else{this.delayCh++;};
		};
	};
	setOnceRepeat(){
		this.circleOnceFlag=true;
	};
	setLoopRepeat(){
		this.circleOnceFlag=false;
	};
	setStart(frameIn){
		this.ch=frameIn;
		this.xyCurrent.x1=this.xyFirst.x2*(frameIn-1);
		this.xyCurrent.x2=this.xyFirst.x2*frameIn;
	};
	setUnvisible(){
		this.unvisibleFlag=true;
	};
	setVisible(){
		this.unvisibleFlag=false;
	};
	//interface
	xyGet(constIn){
		if(!this.unvisibleFlag){
			switch(constIn){
				case 'x':
					return this.xyCurrent.x1;
				break;
				case 'y':
					return this.xyCurrent.y1;
				break;
				case 'w':
					return this.xyFirst.xyWidth;
				break;
				case 'h':
					return this.xyFirst.xyHeight;
				break;
				default:
					c('ERROR IN: spriteAnimateClass TO: get()');
					return false;
				break;
			};
		}else{
			//c('return 0');
			return 0;
		};
	};
};
//B4
//разделяем изображение на квадраты
class splitSpriteClass{
	constructor(
		cXIn,			//центр по х на уровне
		cYIn,			//~ по у
		sizeIn,			//размер вырезаемого спрайта по ширине и высоте на слое
		multiplierIn,	//множитель для масштабирования на уровне
		constEffectsIn	//ключ состояний анимаций. '1': disabled only; '2': 1 and enabled; '3': 2 and destroyed; '4': all.
	){
		//координаты расположения
		this.xyLocation=	new xyClass(
			cXIn-sizeIn*multiplierIn/2,
			cYIn-sizeIn*multiplierIn/2,
			cXIn+sizeIn*multiplierIn/2,
			cYIn+sizeIn*multiplierIn/2);
		this.spriteSize=	sizeIn;
		this.constKey=		constEffectsIn;
		//анимации состояний
		this.enabled=		null;
		this.disabled=		null;
		this.destroyed=		null;
		this.crashed=		null;
		this.current;
		this.err=			'B4. Эффект не определен';
	};
	setDisable(){
		this.current=	this.disabled;
		if(this.disable==null){
			this.deb.msg('e',err);
		};
	};
	setEnable(){
		this.current=	this.enabled;
	};
	setDestroy(){
		this.current=	this.destroyed;
		if(this.destroyed==null){
			this.deb.msg('e',err);
		};
	};
	setCrashed(){
		this.current=	this.crashed;
		if(this.crashed==null){
			this.deb.msg('e',err);
		};
	};
	splitSpite(startYIn,partsIn,delayIn){
		let y=				startYIn;
		let d=				this.spriteSize;
		let war=			'B4. Эффект не задан';
		//										   x,y,		w,h,	число спрайтов,	задержка анимации
		this.enabled=		new spriteAnimateClass(0,y,		d,y+d,	partsIn,		delayIn);
		if(this.constKey>1){
			this.disabled=	new spriteAnimateClass(0,y+d,	d,y+d*2,partsIn,		delayIn);
		}else{
			deb.msg('w',war);
		};
		if(this.constKey>2){
			this.destroyed=	new spriteAnimateClass(0,y+d*2,	d,y+d*3,partsIn,		delayIn);
		}else{
			deb.msg('w',war);
		};
		//this.destroyed.setOnceRepeat();
		if(this.constKey>3){
			this.crashed=	new spriteAnimateClass(0,y+d*3,	d,y+d*4,partsIn,		delayIn);
		}else{
			deb.msg('w',war);
		};
		this.current=		this.enabled;
	};
	hide(){
		this.current.setUnvisible();
		this.enabled.setUnvisible();
		if(this.disabled!=null){this.disable.setUnvisible();};
		if(this.destroyed!=null){this.destroyed.setUnvisible();};
		if(this.crashed!=null){this.crashed.setUnvisible();};
		//c('w: '+this.current.xyGet('w'));
		return true;
	};
	unhide(){
		this.current.setVisible();
		this.enabled.setVisible();
		if(this.disabled!=null){this.disable.setVisible();};
		if(this.destroyed!=null){this.destroyed.setVisible();};
		if(this.crashed!=null){this.crashed.setVisible();};
		return true;
	};
};
//B5
//
class publishClass{
	constructor(DATAIN){
		this.data=DATAIN;
		this.img=new Image();
		this.img.src=this.data.fileName;
		this.stuffsSprites=new Map();
	};
	separateImg(){
		for(let obj of this.data.framesData.values()){
			this.stuffsSprites.set(
				obj.name,
				new splitSpriteClass(
					obj.cX,
					obj.cY,
					this.data.framePixels,
					obj.mult,
					obj.effectsAmount
				)
			);
			this.stuffsSprites.get(obj.name).splitSpite(
				(obj.spriteString-1)*this.data.framePixels,
				obj.frames,
				obj.delay
			);
			this.stuffsSprites.get(obj.name).xyLocation.resizeByX(obj.widerX);
		};
	};
	publish(contextIn){
		for(let obj of this.stuffsSprites.values()){
			contextIn.drawImage(this.img,
								obj.current.xyGet('x'),
								obj.current.xyGet('y'),
								obj.current.xyGet('w'),
								obj.current.xyGet('h'),
								obj.xyLocation.x1,
								obj.xyLocation.y1,
								obj.xyLocation.xyWidth,
								obj.xyLocation.xyHeight
								);
								//c(obj.current.unvisibleFlag);
			//console.log('x1:'+obj.current.xyCurrent.x1+' x2:'+obj.current.xyCurrent.x2+' w:'+obj.current.xyFirst.xyWidth+' h:'+obj.current.xyFirst.xyHeight);
			//console.log('local: X:'+obj.xyLocation.x1+' Y:'+obj.xyLocation.y1+' W:'+obj.xyLocation.xyWidth+' H:'+obj.xyLocation.xyHeight);
			obj.current.nextSprite();
		};
	};
	hideCollision(xyIn){
		let checkResult;
		for(let obj of this.stuffsSprites.values()){
			if(obj.xyLocation.checkPartCollision(xyIn.x1,xyIn.y1,xyIn.x2,xyIn.y2)){
				checkResult=obj.hide();
				//c('hide this');
			}else{
				checkResult=obj.unhide();
			};
		};
	};
};

//----FLOORS COLLISION DATA--
let FLOORSDATA=
[
	new xyClass(10,295,220,300),
	
	new xyClass(9,400,265,415),
	
	new xyClass(10,510,160,530),
	new xyClass(120,510,300,530),
	new xyClass(250,504,765,530),
	new xyClass(700,515,960,530)
];

let LADDERSDATA=
[
	new xyClass(30,102,60,205),
	new xyClass(9,195,40,300),
	new xyClass(35,295,75,405),
	new xyClass(75,400,115,515)
];

var COLLISIONDATA={FLOORS:FLOORSDATA,LADDERS:LADDERSDATA};
//----LIGHT EFFECTS DATA--
var LIGHTEFFECTSDATA=
{
	lightBulb1:{
		area:			null,
		square:			new xyClass(140,426,960,530),
		enabled:{
			type:		'radial',
			parameters:	{x1:512,y1:443,r1:20,x2:512,y2:500,r2:450},
			color:		[[0,'yellow'],[0.6,'black'],[0.7,'yellow'],[1,'white']],
			composite:	{opacity:0.9,operation:'soft-light'},
			timing:		{onStart:0.05,onFinish:0,ch:0.9}
		},
		disabled:{
			type:		'fill',
			parameters:	{},
			color:		'black',
			composite:	{opacity:0.7},
			timing:		null
		},
		currentConst:	'enabled',	//for draw to canvas
		activeConst:	'enabled',	//for registered unvisible room effect
		hidden:{
			type:		'fill',
			parameters:	{},
			color:		'black',
			composite:	{opacity:0.9},
			timing:		null
		}
	},
	lightBulb2:{
		area:			null,
		square:			new xyClass(0,315,270,415),
		enabled:{
			type:		'radial',
			parameters:	{x1:147,y1:340,r1:20,x2:147,y2:340,r2:100},
			color:		[[0,'yellow'],[1,'black']],
			composite:	{opacity:0.5,operation:'soft-light'},
			timing:		null
		},
		disabled:{
			type:		'linear',
			parameters:	{x1:50,y1:315,x2:200,y2:400},
			color:		[[0,'white'],[1,'black']],
			composite:	{opacity:0.7,operation:'overlay'},
			timing:		null
		},
		currentConst:	'enabled',
		activeConst:	'enabled',
		hidden:{
			type:		'fill',
			parameters:	{},
			color:		'black',
			composite:	{opacity:0.9},
			timing:		null
		}
	},
	fifthLeft:{
		area:			null,
		square:			new xyClass(0,428,140,530),
		enabled:{
			type:		'radial',
			parameters:	{x1:95,y1:428,r1:20,x2:95,y2:450,r2:100},
			color:		[[0,'yellow'],[1,'black']],
			composite:	{opacity:0.35,operation:'multiply'},
			timing:		null
		},
		currentConst:	'enabled',
		activeConst:	'enabled',
		hidden:{
			type:		'fill',
			parameters:	{},
			color:		'black',
			composite:	{opacity:0.9},
			timing:		null
		}
	},
	thirdLeft:{
		area:			[	[0,310],[[0,215],[215,215],[260,305]]	],
		square:			new xyClass(5,215,215,300),
		enabled:{
			type:		'linear',
			parameters:	{x1:5,y1:260,x2:250,y2:300},
			color:		[[0,'white'],[0.65,'black'],[1,'white']],
			composite:	{opacity:0.75,operation:'multiply'},
			timing:		null
		},
		currentConst:	'enabled',
		activeConst:	'enabled',
		hidden:{
			type:		'fill',
			parameters:	{},
			color:		'black',
			composite:	{opacity:0.9},
			timing:		null
		}
	},
	sky:{
		area:			[	[5,205],[[0,0],[973,0],[973,200],[740,200],[645,420],[280,420],[275,340],[215,215]]	],
		square:			new xyClass(0,80,960,215),
		enabled:{
			type:		'fill',
			parameters:	{},
			color:		'yellow',
			composite:	{opacity:0.05},
			timing:		null
		},
		currentConst:	'enabled',
		activeConst:	'enabled',
		hidden:{
			type:		'fill',
			parameters:	{},
			color:		'black',
			composite:	{opacity:0.9},
			timing:		null
		}
	}
	/*
	elevatorThird:{
		area:			[	[790,515],[[790,440],[845,440],[845,515],[880,530],[765,530]]	],
		square:			new xyClass(790,515,850,530),
		enabled:{
			type:		'linear',
			parameters:	{x1:830,y1:430,x2:830,y2:540},
			color:		[[0,'white'],[0.8,'black'],[1,'white']],
			composite:	{opacity:0.05,operation:'lighten'},
			timing:		null
		},
		currentConst:	'enabled',
		activeConst:	'enabled',
		hidden:{
			type:		'fill',
			parameters:	{},
			color:		'black',
			composite:	{opacity:0.9},
			timing:		null
		}
	}
	*/
};

//[0,310],[[260,310],[275,340],[280,420],[0,420]]
//----PIX DATA------------
let pixData1=
	{
		weaponStore:{
			eventSquare:	new xyClass(200,250,210,290),
			position:		new xyClass(165,220,250,300),
			enabled:		[0,0,	80,80,	7,	10	],
			disabled:		[0,80,	80,160,	7,	10	],
			destroyed:		[0,160,	80,240,	7,	10	],
			creshed:		[0,240,	80,320,	7,	10	],
			current:		new spriteAnimateClass(0,0,80,80,7,10),
			composite:		null,
			currentConst:	'enabled'
		},
		box1:{
			eventSquare:	new xyClass(650,470,710,520),
			position:		new xyClass(620,435,720,535),
			closed:			[0,320,	80,400,	7,	10	],
			opened:			[0,400,	80,480,	7,	10	],
			current:		new spriteAnimateClass(0,320,80,400,7,10),
			composite:		null,
			currentConst:	'closed'
		},
		smog:{
			eventSquare:	new xyClass(0,0,10,10),
			position:		new xyClass(100,490,800,530),
			visible:		[0,480,	80,560,	7,	12	],
			current:		new spriteAnimateClass(0,480,80,560,7,12),
			composite:		null,
			currentConst:	'visibile'
		},
		cab1:{
			eventSquare:	new xyClass(120,240,160,290),
			position:		new xyClass(95,225,185,305),
			openAnimate:	[0,640,	80,720,	7,	8	],
			closed:			[0,720,	80,800,	1,	1000],
			opened:			[0,800,	80,880,	1,	1000],
			current:		new spriteAnimateClass(0,720,80,800,1,1000),
			composite:		null,
			currentConst:	'closed'
		},
		doors:{
			eventSquare:	new xyClass(130,470,165,530),
			position:		new xyClass(100,460,180,530),
			closed:			[0,		880,	80,		960,	1,	1000],
			openAnimate:	[0,		960,	80,		1040,	4,	4	],
			opened:			[240,	960,	320,	1040,	1,	1000],
			current:		new spriteAnimateClass(0,880,80,960,1,1000),
			composite:		null,
			currentConst:	'closed'
		},
		windowFrame:{
			eventSquare:	new xyClass(125,140,130,165),
			position:		new xyClass(84,117,165,197),
			visible:		[0,1040,80,1120,1,	100	],	
			destroyed:		[0,1120,80,1200,7,	3	],
			current:		new spriteAnimateClass(0,1040,80,1120,1,100),
			composite:		null,
			currentConst:	'visibile'
		},
		doorElevator:{
			eventSquare:	new xyClass(820,450,840,515),
			position:		new xyClass(760,445,840,517),
			closed:			[0,1360,80,1440,1,	1000],	
			opened:			[0,1440,80,1520,1,	1000],
			openAnimate:	[0,1360,80,1440,7,	5	],	
			closeAnimate:	[0,1440,80,1520,7,	5	],
			current:		new spriteAnimateClass(0,1360,80,1440,1,100),
			composite:		null,
			currentConst:	'closed'
		},
		cab2:{
			eventSquare:	new xyClass(357,445,407,455),
			position:		new xyClass(325,435,415,510),
			closed:			[0,1520,80,1600,7,	16	],
			opened:			[0,1600,80,1680,7,	16	],
			current:		new spriteAnimateClass(0,1520,80,1600,7,9),
			composite:		null,
			currentConst:	'closed'
		}
		//{name:'waterGlass1',	cX:300,cY:240,spriteString:17,	frames:7,	delay:10,	mult:2,		widerX:0,	effectsAmount:1},
		//{name:'waterGlass2',	cX:370,cY:250,spriteString:17,	frames:7,	delay:12,	mult:2,		widerX:50,	effectsAmount:1},
		//{name:'waterGlass3',	cX:480,cY:245,spriteString:17,	frames:7,	delay:9,	mult:2,		widerX:50,	effectsAmount:1},
		//{name:'waterGlass3',	cX:580,cY:245,spriteString:17,	frames:7,	delay:8,	mult:2,		widerX:40,	effectsAmount:1},
	};

let pixData2=
	{
		steam:{
			eventSquare:	new xyClass(420,440,440,500),
			position:		new xyClass(385,440,475,525),
			visible:		[0,	0,	40,	40,	9,	5	],
			current:		new spriteAnimateClass(0,0,40,40,9,5),
			composite:		null,
			currentConst:	'visible'
		},
		lightBulb1:{
			eventSquare:	new xyClass(500,517,520,530),
			position:		new xyClass(490,425,530,465),
			enabled:		[0,	160,40,	200,10,	12	],
			disabled:		[0,	200,40,	240,10,	12	],
			crashed:		[0,	280,40,	320,10,	12	],
			current:		new spriteAnimateClass(0,160,40,200,10,12),
			composite:		{opacity:1,operation:'screen'},
			currentConst:	'enabled'
		},
		lightBulb2:{
			eventSquare:	new xyClass(140,330,150,345),
			position:		new xyClass(126,320,166,360),
			enabled:		[0,	320,40,	360,3,	1	],
			disabled:		[0,	360,40,	400,3,	1000],
			current:		new spriteAnimateClass(0,320,40,360,3,1),
			composite:		{opacity:1,operation:'screen'},
			currentConst:	'enabled'
		},
		hightWaltage:{
			eventSquare:	new xyClass(495,440,520,445),
			position:		new xyClass(485,440,525,480),
			enabled:		[0,	480,40,	520,3,	12	],
			disabled:		[0,	520,40,	560,3,	12	],
			destroyed:		[0,	560,40,	600,3,	1	],
			crashed:		[0,	600,40,	640,3,	1	],
			current:		new spriteAnimateClass(0,480,40,520,3,12),
			composite:		null,
			currentConst:	'enabled'
		},
		shadow1:{
			eventSquare:	new xyClass(0,0,10,10),
			position:		new xyClass(577,428,615,508),
			visible:		[0,	640,40,	680,10,	12	],
			hidden:			[39,680,40,	720,1,	1000],
			current:		new spriteAnimateClass(0,640,40,680,10,12),
			composite:		null,
			currentConst:	'visible'
		},
		balloon:{
			eventSquare:	new xyClass(625,470,650,505),
			position:		new xyClass(615,460,670,510),
			visible:		[0,	720,40,	760,10,	12	],
			current:		new spriteAnimateClass(0,720,40,760,10,12),
			composite:		null,
			currentConst:	'visible'
		},
		elevatorButton:{
			eventSquare:	new xyClass(775,450,785,530),
			position:		new xyClass(750,460,800,500),
			pressOff:		[0,	760,40,	800,1,	1000],
			pressOn:		[0,	800,40,	840,1,	1000],
			current:		new spriteAnimateClass(0,760,40,800,1,1000),
			composite:		{opacity:1,operation:'screen'},
			currentConst:	'pressOff'
		}
	};

class STUFFSDATACLASS{
	constructor(){
		this.PIXES=new Array();
		this.PIXES[0]={fileName:'allStuffsAnimation80.png',	framePixels:80,	framesData:pixData1};
		this.PIXES[1]={fileName:'allStuffsAnimation40.png',	framePixels:40,	framesData:pixData2};
	};
};

var STUFFSDATA=	new STUFFSDATACLASS;


