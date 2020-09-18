class playerMovementClass{
	constructor(){
		this.key=		new keyCodeClass();
		this.movement=	'STAY';
		this.target=	'RIGHT';
		this.RUNDELTA=	PLAYER.RUN_D/PLAYER.RUNDELAY;
		this.x=			0;
		this.y=			0;
	};
	checkKeyIn(keyInCode){
		//c(keyInCode);
		switch(keyInCode){
			case this.key.RIGHTKEY1:
				this.target='RIGHT';
				this.x=this.RUNDELTA;
				this.movement='RUN';
			break;
			case this.key.LEFTKEY1:
				this.target='LEFT';
				this.x=-this.RUNDELTA;
				this.movement='RUN';
			break;
			case this.key.UPKEY1:
				this.y-=this.RUNDELTA*PLAYER.MOVEDIAGONALMULT;
				this.movement='RUN';
			break;
			case this.key.DOWNKEY1:
				this.y=this.RUNDELTA*PLAYER.MOVEDIAGONALMULT;
				this.movement='RUN';
			break;
		};
	};
	checkKeyOff(keyInCode){
		switch(keyInCode){
			case this.key.RIGHTKEY1:
				this.x=0;
				this.movement='STAY';
				if(this.stairsFlag){
					this.y=0
				};
			break;
			case this.key.LEFTKEY1:
				this.x=0;
				this.movement='STAY';
				if(this.stairsFlag){
					this.y=0
				};
			break;
			case this.key.UPKEY1:
				this.y=0;
				if(this.x==0){
					this.movement='STAY';
				};
			break;
			case this.key.DOWNKEY1:
				this.y=0;
				if(this.x==0){
					this.movement='STAY';
				};
			break;
		};
	};
	getSpeed(){
		return {x:this.x,y:this.y}
	};
	getSpeedCollision(){
		return {x:this.x/5,y:this.y/20};
	};
	getMovement(){
		return this.movement;
	};
	setStay(){
		//this.movement='STAY';
		this.y=0;
	};
	getTarget(){
		return this.target;
	};
	setStairs(){
		this.stairsFlag=true;
	};
	setFloors(){
		this.stairsFlag=false;
	};
};

//=========SPRITES=====

//==================FLOORS========

//==================PLAYER========
class debugClass{
	constructor(){
		this.seeCollisionFlag=	false;
		this.keys=				new keyCodeClass();
		this.collisionData=		new Array();
		this.keyCodeIn=			false;
	};
	addData(dataIn){
		let tmp=dataIn;
		this.collisionData.push(dataIn);
	};
	seeCollision(contextIn){
		if(this.keyCodeIn==this.keys.SEECOLLISION){
			let colorCh=0;
			for(let obj of this.collisionData){
				contextIn.fillStyle='rgba('+colorCh+',0,0,0.5)';
				if(colorCh<201){colorCh+=50;};
				for(let obj2 of obj){
					contextIn.fillRect(
						obj2.x1,
						obj2.y1,
						obj2.xyWidth,
						obj2.xyHeight
					);
				};
			};
		};
	};
	getCollision(keyIn){
		this.keyCodeIn=keyIn;
	};
	seeCollisionOff(keyIn){
		this.keyCodeIn=false;
	};
};

class collisionClass{
	constructor(PlayerX,PlayerY,debugIn){
		this.xyPlayer=		new xyClass(
								PlayerX-8,
								PlayerY-60,
								PlayerX+8,
								PlayerY
							);
		this.floors=		new xyStackClass(COLLISIONDATA.FLOORS);
		this.ladders=		new xyStackClass(COLLISIONDATA.LADDERS);
		this.debug=			new debugClass();
		this.debug.addData(
			this.ladders.data.concat(this.floors.data)
		);
		this.debug.addData([this.xyPlayer]);
	};
	setMovement(deltaIn){
		this.xyPlayer.updateX(deltaIn.x/GAMESPEED);
		this.xyPlayer.updateY(deltaIn.y/GAMESPEED);
	};
	getCollision(deltaIn){
		if(this.ladders.getCollision(this.xyPlayer,deltaIn)){
			return {onPlace:'ONLADDERS',square:this.ladders.getSquare(this.xyPlayer,deltaIn)};
		};
		if(this.floors.getCollision(this.xyPlayer,deltaIn)){
			return {onPlace:'ONFLOOR',square:this.floors.getSquare(this.xyPlayer,deltaIn)};
		}else{
			return {onPlace:'ONFLOORSOFF',square:this.floors.getSquare(this.xyPlayer,deltaIn)};
		};
	};
};

class playerSpritesClass{
	constructor(){
		this.stay=		new spriteAnimateClass(0,440,150,660,5,PLAYER.STAYDELAY);
		this.run=		new spriteAnimateClass(0,220,150,440,23,PLAYER.RUNDELAY);
		this.current=	this.stay;
	};
	setSprite(movementCodeIn){
		movementCodeIn=="STAY"?	this.current=this.stay:	null;
		movementCodeIn=="RUN"?	this.current=this.run:	null;
	}
};

class player{
	constructor(imgPlayerRight,imgPlayerLeft){
		this.imgRight=		new Image();
		this.imgRight.src=	imgPlayerRight;
		this.imgLeft=		new Image();
		this.imgLeft.src=	imgPlayerLeft;
		this.imgs=			{'LEFT':this.imgLeft,'RIGHT':this.imgRight};
		this.collision=		new collisionClass(PLAYER.START_X,PLAYER.START_Y);
		this.sprites=		new playerSpritesClass();
		this.userKeys=		new keyCodeClass();
		this.playerMovement=new playerMovementClass();
	};
	publish(contextIn){
		this.collision.debug.seeCollision(contextIn);
		let tmp=this.sprites.current;
		//прозрачность для лифта
		contextIn.save();
		//contextIn.globalCompositeOperation='multiply'|'source-atop';
		//contextIn.globalAlpha=0.5;
		contextIn.shadowOffsetX=0;
		contextIn.shadowOffsetY=20;
		contextIn.shadowColor='black';
		contextIn.shadowBlur=10;
		//отрисовка
		contextIn.drawImage(
			this.imgs[this.playerMovement.getTarget()],
			tmp.xyGet('x'),
			tmp.xyGet('y'),
			tmp.xyGet('w'),
			tmp.xyGet('h'),
			this.collision.xyPlayer.x1-PLAYER.SIZE_X/2,
			this.collision.xyPlayer.y1-3,
			this.collision.xyPlayer.xyWidth+PLAYER.SIZE_X,
			this.collision.xyPlayer.xyHeight+10
		);
		//для лифта
		contextIn.restore();
		this.sprites.current.nextSprite();
	};
	keyOn(keyInCode){
		this.playerMovement.checkKeyIn(keyInCode);
		
		
	};
	keyOff(keyInCode){
		this.playerMovement.checkKeyOff(keyInCode);
		
		
	};
	stepListener(){
		let obj=this.collision.getCollision(this.playerMovement.getSpeedCollision());
		//unvisible.setDark(obj.square);
		switch(obj.onPlace){
			case 'ONFLOOR':
				this.playerMovement.setFloors();
				this.collision.setMovement(this.playerMovement.getSpeed());
				this.sprites.setSprite(this.playerMovement.getMovement());
			break;
			case 'ONLADDERS':
				this.collision.setMovement(this.playerMovement.getSpeed());
				this.sprites.setSprite(this.playerMovement.getMovement());
			break;
			case 'ONFLOORSOFF':
				this.playerMovement.setStay();
			break;
		};
	};
	getXyPlayer(){
		return this.collision.xyPlayer;
	};
};

class imagineSprites{
	constructor(dataIn){
		this.img=				new Image();
		this.img.src=			dataIn.fileName;
		this.frames=			dataIn.framesData;
	};
	publish(contextIn){
		for(let key in this.frames){
			let cur=	this.frames[key].current;
			let xy=		this.frames[key].position;
			let mode=	this.frames[key].composite;
			if(mode!=null){
			contextIn.save();
			contextIn.globalAlpha=mode.opacity;
			contextIn.globalCompositeOperation=mode.operation;
			};
			
			contextIn.drawImage(
				this.img,
				cur.xyGet('x'),
				cur.xyGet('y'),
				cur.xyGet('w'),
				cur.xyGet('h'),
				xy.x1,
				xy.y1,
				xy.xyWidth,
				xy.xyHeight
			);
			if(mode!=null){
				contextIn.restore();
			};
			this.frames[key].current.nextSprite();
		};
	};
	setCurrentMode(spriteNameIn,constModeIn){
		//	.setCurrent('box1','opened');
		let tmp=this.frames[String(spriteNameIn)];
		let par=tmp[String(constModeIn)];
		tmp.current=new spriteAnimateClass(par[0],par[1],par[2],par[3],par[4],par[5]);
		tmp.currentConst=String(constModeIn);
	};
	getCurrentMode(spriteNameIn){
		return this.frames[String(spriteNameIn)].currentConst;
	};
	setOpacity(spriteNameIn,intIn){
		
	};
	checkPartCollision(xyIn){
		let result=	new Array();
		for(let key in this.frames){
			//let xy=	this.frames[key].position;
			let xy=	this.frames[key].eventSquare;
			if(xy.checkPartCollision(xyIn.x1,xyIn.y1,xyIn.x2,xyIn.y2)){
				result.push(key);
			};
		};
		return result;
	};
};

class textClass{
	constructor(contextIn){
		this.context	=contextIn;
		this.locals		=LOCAL;
		this.msg		='message';
	};
	setMsg(msgIn){
		this.msg		=this.locals[msgIn];
	};
	publish(contextIn){
		contextIn.save();
		
		contextIn.textBaseline	='top';
		contextIn.font			='bold 20px Arial';
		contextIn.fillStyle		='gray';
		contextIn.fillText(this.msg, 400, 100);
		
		contextIn.restore();
	};
};

//шкаф
class cabClass{
	constructor(setKeysIn){
		this.key				=setKeysIn;				//ключи. 'DEFAULTKEY'; - дается всем
		this.currentStateConst	='closed';				//~ в момент времени
		this.things;									//вещи внутри этого шкафа
		//this.msg				={result:null,msg:''};	//код сообщения, возвращаемого функцией этого класса при выполнении
	};
	MAPopenByKeys(keysIn_MASS){
		for(let obj of keysIn_MASS){
			if((this.key==obj)||(this.currentStateConst=='crashed')){
				this.currentStateConst	='opened';
				//this.msg				='DONE';
				return {result:true,  msg:'cabOpen'};
			}else{
				//this.msg				=this.key;
				return {result:false, msg:'keysIsNotSuitable'};
			};
		};
	};
	MAPtoClose(keysIn_MASS){
		if(this.currentStateConst	!='crashed'){
			this.currentStateConst	='closed';
			//this.msg				='DONE';
			return {result:true,  msg:'cabClose'};
		}else{
			//this.msg				='CRASHED';
			return {result:false, msg:'crashed'};
		};
	};
};

let ENTITIESLEVEL={
	cab1:	new cabClass('ACCESSKEY_1'),
	cab2:	new cabClass('DEFAULTKEY')
};

let ENTITIESPLAYER={
	keys:		['DEFAULTKEY'],
	weapons:	['knife']
};

class collisionInteractionClass{
	constructor(spritesIn, effectsIn, levelEntitiesIn, playerEntitiesIn, msgClassIn){
		this.sprites			=spritesIn;
		this.effects			=effectsIn;
		this.interactionSprites	=new Array();
		this.levelEntities		=levelEntitiesIn;
		this.playerEntities		=playerEntitiesIn;
		this.state				={result:true, msg:'nothing'};
		this.msgClass			=msgClassIn;
	};
	keyOn(spriteIn){
		this.interactionSprites	=spriteIn;
	};
	keyOff(){
		c(this.interactionSprites);
		for (let spriteConst of this.interactionSprites){
			
		switch(spriteConst){
			case 'box1':
				if(this.sprites.getCurrentMode('box1')=='closed'){
					this.sprites.setCurrentMode('box1','opened');
					//c(this.sprites.getCurrentMode('box1'));
				}else{
					this.sprites.setCurrentMode('box1','closed');
					//c(this.sprites.getCurrentMode('box1'));
				};
				break;
			case 'lightBulb1':
				switch(this.sprites.getCurrentMode('lightBulb1')){
					case 'enabled':
						this.sprites.setCurrentMode('lightBulb1','disabled');
						this.effects.setCurrentMode('lightBulb1','disabled');
					break;
					case 'disabled':
						this.sprites.setCurrentMode('lightBulb1','enabled');
						this.effects.setCurrentMode('lightBulb1','enabled');
					break;
				};
				break;
			case 'elevatorButton':
				if(this.sprites.getCurrentMode('elevatorButton')=='pressOff'){
					this.sprites.setCurrentMode('elevatorButton','pressOn');
				};
				break;
			case 'cab2':
				if(this.sprites.getCurrentMode('cab2')=='closed'){
					this.state=this.levelEntities.cab2.MAPopenByKeys(this.playerEntities.keys);
					if(this.state.result){
						this.sprites.setCurrentMode('cab2','opened');
					};
				}else{
					this.sprites.setCurrentMode('cab2','closed');
					this.state=this.levelEntities.cab2.MAPtoClose(this.playerEntities.keys);
				};
				break;
		};
		c(this.state);
		this.msgClass.setMsg(this.state.msg);
		this.state.msg='nothing';
		};
	};
};

class lightingEffectsClass{
	constructor(dataIn){
		this.data=		dataIn;
	};
	publish(contextIn){
		let fill;
		let par;
		let color;
		let xy		=null;
		let xyArea	=null;
		let obj;
		for(let key in this.data){
			obj=	this.data[key];
			xy=		obj.square;
			xyArea=	obj.area;
			
			
			contextIn.save();
			
			if(obj.currentConst=='enabled'){
				obj=obj.enabled;
			};
			if(obj.currentConst=='disabled'){
				obj=obj.disabled;
			};
			if(obj.currentConst=='hidden'){
				obj=obj.hidden;
			};
			
			color=	obj.color;
			par=	obj.parameters;
			if(obj.type=='radial'){
				fill=contextIn.createRadialGradient(par.x1,par.y1,par.r1,par.x2,par.y2,par.r2);
				fill.addColorStop(color[0][0],color[0][1]);
				fill.addColorStop(color[1][0],color[1][1]);
				
				contextIn.globalCompositeOperation=	obj.composite.operation;
			};
			if(obj.type=='fill'){
				fill=color;
			};
			if(obj.type=='linear'){
				fill=contextIn.createLinearGradient(par.x1,par.y1,par.x2,par.y2);
				for(let colorPar of color){
					fill.addColorStop(colorPar[0],colorPar[1]);
				};
				//fill.addColorStop(color[0][0],color[0][1]);
				//fill.addColorStop(color[1][0],color[1][1]);
				
				contextIn.globalCompositeOperation=	obj.composite.operation;
			};
			contextIn.fillStyle=	fill;
			
			let delta=0;
			if(obj.time!=null){
				//c('ch: '+obj.time.ch);
				if(obj.time.ch>obj.time.onStart){
					//c('ch: '+obj.time.ch);
					obj.time.ch-=obj.time.onStart;
					delta=obj.time.ch;
				};
			};
			//c('delta: '+delta);
			
			contextIn.globalAlpha=	obj.composite.opacity-delta;
			if(xyArea==null){
				
				contextIn.fillRect(xy.x1,xy.y1,xy.xyWidth,xy.xyHeight);
			}else{
				contextIn.beginPath();
				contextIn.moveTo(xyArea[0][0],xyArea[0][1]);
				
				for(let xyValues of xyArea[1]){
					contextIn.lineTo(xyValues[0],xyValues[1]);
				};
				
				contextIn.closePath();
				
				contextIn.fill();
				contextIn.lineWidth=15;
				contextIn.stroke();
			};
			contextIn.restore();
		};
	};
	setCurrentMode(spriteNameIn,constModeIn){
		this.data[String(spriteNameIn)].currentConst=	constModeIn;
		this.data[String(spriteNameIn)].activeConst=	constModeIn;
	};
	getCurrentMode(spriteNameIn){
		return this.data[String(spriteNameIn)].currentConst;
	};
};

class lightingCollisionClass{
	constructor(dataIn){
		this.data=	dataIn;
	};
	checkPartCollision(xyIn){
		for(let key in this.data){
			if(this.data[key].square.checkPartCollision(xyIn.x1,xyIn.y1,xyIn.x2,xyIn.y2)){
				this.data[key].currentConst=this.data[key].activeConst;
			}else{
				this.data[key].currentConst='hidden';
			};
		};
	};
};

class gameClass{
	constructor(stuffsDataIn,pathsIn){
		this.text=					new textClass();
		this.pixStuffs80=			new imagineSprites(stuffsDataIn.PIXES[0]);
		this.pixStuffs40=			new imagineSprites(stuffsDataIn.PIXES[1]);
		this.redPlayer=				new player(pathsIn.PLAYERPIXRIGHT,pathsIn.PLAYERPIXLEFT);
		this.lightingEffects=		new lightingEffectsClass(LIGHTEFFECTSDATA);
		this.lightingCollision=		new lightingCollisionClass(LIGHTEFFECTSDATA);
		this.collisionInteraction80=new collisionInteractionClass(this.pixStuffs80,this.lightingEffects,ENTITIESLEVEL,ENTITIESPLAYER,this.text);
		this.collisionInteraction40=new collisionInteractionClass(this.pixStuffs40,this.lightingEffects,ENTITIESLEVEL,ENTITIESPLAYER,this.text);
		this.key=					new keyCodeClass();
		
		//this.debug=					new debugClass();
	};
	toCreate(){
		
	};
	keyOn(keyCodeIn){
		this.redPlayer.keyOn(keyCodeIn);
		
		this.collisionInteraction80.keyOn(this.pixStuffs80.checkPartCollision(this.redPlayer.getXyPlayer()));
		this.collisionInteraction40.keyOn(this.pixStuffs40.checkPartCollision(this.redPlayer.getXyPlayer()));
		
		this.redPlayer.collision.debug.getCollision(keyCodeIn);
	};
	keyOff(keyCodeIn){
		this.redPlayer.keyOff(keyCodeIn);
		
		if(keyCodeIn==this.key.INTERACTIONKEY){
			this.collisionInteraction80.keyOff();
			this.collisionInteraction40.keyOff();
		};
		
		this.redPlayer.collision.debug.seeCollisionOff(keyCodeIn);
	};
	draw(contextIn){
		this.pixStuffs40.publish(contextIn);
		this.pixStuffs80.publish(contextIn);
	
		this.redPlayer.publish(contextIn);
	
		this.redPlayer.stepListener();
		
		this.lightingEffects.publish(contextIn);
		
		this.lightingCollision.checkPartCollision(this.redPlayer.getXyPlayer());
		
		this.text.publish(contextIn);
	};
};



























