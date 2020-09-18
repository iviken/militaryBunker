//Имена спрайтов затенения неактивных этажей.
const FLOORSSHADSPRITES={first:'first',second:'second',thirdLeft:'thirdLeft',thirdRight:'thirdRight',fourthLeft:'fourthLeft',fourthRight:'fourthRight',fifthLeft:'fifthLeft',fifthRight:'fifthRight',underwater:'underwaterOpacity'};

//изображение оружия
const WEAPONSPIX='weaponsPix.png';

class PATHS{
	constructor(){
		//Имя спрайта игроков
		this.PLAYERPIXRIGHT='playerSpritesRight.png';
		this.PLAYERPIXLEFT='playerSpritesLeft.png';
	};
};

var ALLPATHS=	new PATHS;

class keyCodeClass{
	constructor(){
		this.STOREKEY1=		'KeyB';
		this.UPKEY1=		'KeyW';
		this.DOWNKEY1=		'KeyS';
		this.RIGHTKEY1=		'KeyD';
		this.LEFTKEY1=		'KeyA';
		this.SHIFTLEFT=		'ShiftLeft';
		this.SHIFTRIGHT=	'ShiftRight';
		this.SEECOLLISION=	'KeyP';
		this.INTERACTIONKEY='KeyE';
	};
};

var PLAYER={
	RUNDELAY:1,
	STAYDELAY:15,
	RUN_D:60,

	MOVEDIAGONALMULT:0.65,

	START_X:270,
	START_Y:525,
	
	SIZE_X:30
};




