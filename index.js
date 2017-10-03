/*
Copyright luojia@luojia.me
MIT LICENSE
*/

'use strict';

//polyfill
/*! http://mths.be/codepointat v0.1.0 by @mathias */
String.prototype.codePointAt||function(){'use strict';var a=function(b){if(null==this)throw TypeError();var c=this+'',d=c.length,e=b?+b:0;if(e!=e&&(e=0),!(0>e||e>=d)){var g,f=c.charCodeAt(e);return 55296<=f&&56319>=f&&d>e+1&&(g=c.charCodeAt(e+1),56320<=g&&57343>=g)?1024*(f-55296)+g-56320+65536:f}};Object.defineProperty?Object.defineProperty(String.prototype,'codePointAt',{value:a,configurable:!0,writable:!0}):String.prototype.codePointAt=a}();
String.fromCodePoint||function(){var a=function(){try{var e={},f=Object.defineProperty,g=f(e,e,e)&&f}catch(h){}return g}(),b=String.fromCharCode,c=Math.floor,d=function(){var f=[],g,h,i=-1,j=arguments.length;if(!j)return'';for(var l,k='';++i<j;){if(l=+arguments[i],!isFinite(l)||0>l||1114111<l||c(l)!=l)throw RangeError('Invalid code point: '+l);65535>=l?f.push(l):(l-=65536,g=(l>>10)+55296,h=l%1024+56320,f.push(g,h)),(i+1==j||f.length>16384)&&(k+=b.apply(null,f),f.length=0)}return k};a?a(String,'fromCodePoint',{value:d,configurable:!0,writable:!0}):String.fromCodePoint=d}();

const G=(0,eval)('this'),
		SUPPORT_ARRAYBUFFER=!!G.ArrayBuffer,
		defaultArray=SUPPORT_ARRAYBUFFER?Uint8Array:Array;

const utf8Util={
	countByte:str=>{
		if((typeof str!=='string') || (str.length===0))return 0;
		let byteLength=0,code;
		for(let i=0;i<str.length;i++){
			code=str.codePointAt(i);
			if (code>0xD7FF&&code<0xE000)continue;
			if(code<128)byteLength++;
			else if(code<2048)byteLength+=2;
			else if(code<65536)byteLength+=3;
			else if(code<1114112)byteLength+=4;
			else throw(new Error('Invalid char code'));
		}
		return byteLength;	
	},
	utf8ToBytes:(str,offsetInArray=0,arrayConstructor=defaultArray)=>{
		let code,
			i=0,
			t=offsetInArray,
			bytes=Array.isPrototypeOf(arrayConstructor)
					?-1
					:(str.length?utf8Util.countByte(str):0),
			byteLength=offsetInArray+bytes,
			arr=new arrayConstructor(byteLength>=0?byteLength:0);
		if(bytes===0 || (bytes!==-1 && arr.length===0))return arr;
		for(;i<str.length;i++){
			code=str.codePointAt(i);
			if (code>0xD7FF&&code<0xE000 || t<0)continue;
			if(code<128){arr[t++]=code;}
			else if(code<2048){
				arr[t++]=code>>6|0xC0;
				arr[t++]=code&0x3F|0x80;
			}
			else if(code<65536){
				arr[t++]=code>>12|0xE0;
				arr[t++]=code>>6&0x3F|0x80;
				arr[t++]=code&0x3F|0x80;
			}
			else if(code<1114112){
				arr[t++]=code>>18|0xF0;
				arr[t++]=code>>12&0x3F|0x80;
				arr[t++]=code>>6&0x3F|0x80;
				arr[t++]=code&0x3F|0x80;
			}
			else throw(new Error('Invalid char code'));
		}
		return arr;	
	},
	bytesToUTF8:arr=>{
		let chars=[],u=0,tCode=0;
		for(let i=0;i<arr.length;i++){
			if(u){
				tCode|=(((arr[i]&0x3F)<<(6*--u)));
				if(u===0){
					chars.push(String.fromCodePoint(tCode));
				}
				continue;
			}
			if((arr[i]&0xF0) === 0xF0){u=3;}//4bytes
			else if((arr[i]&0xE0) === 0xE0)u=2;//3bytes
			else if((arr[i]&0xC0) === 0xC0)u=1;//2bytes
			else if((arr[i]&0x80) === 0){//1byte
				chars.push(String.fromCharCode(arr[i]));
				continue;
			}
			tCode=((arr[i]&(255>>(u+2)))<<(u*6));
		}
		return chars.join('');	
	}
}

module.exports=utf8Util;