# utf8util.js
utility for convert javascript string and utf8 bytes

the default array constructor is TypedArraySupported?Uint8Array:Array.
```
npm i utf8util --save
```

```javascript
var utf8Util=require('utf8util');

//string to bytes
utf8Util.utf8ToBytes('🌶');	//Uint8Array(4) [240, 159, 140, 182]
utf8Util.utf8ToBytes('abcde');		//Uint8Array(5) [97, 98, 99, 100, 101]
utf8Util.utf8ToBytes('苟利国家生死以，岂因祸福避趋之。');	
//Uint8Array(48) [232, 139, 159, 229, 136, 169, 229, 155, 189, 229, 174, 182, 231, 148, 159, 230, 173, 187, 228, 187, 165, 239, 188, 140, 229, 178, 130, 229, 155, 160, 231, 165, 184, 231, 166, 143, 233, 129, 191, 232, 182, 139, 228, 185, 139, 227, 128, 130]
utf8Util.utf8ToBytes('🐶🐱🐽✈️🇨🇳');
//Uint8Array(26) [240, 159, 144, 182, 240, 159, 144, 177, 240, 159, 144, 189, 226, 156, 136, 239, 184, 143, 240, 159, 135, 168, 240, 159, 135, 179]

//empty string
utf8Util.utf8ToBytes('');	//Uint8Array []

//2 bytes offset
utf8Util.utf8ToBytes('a',2);    //Uint8Array(3) [0, 0, 97]

//specify an array constructor
utf8Util.utf8ToBytes('abc',0,Array);    //Array(3) [97, 98, 99]

//bytes to string
utf8Util.bytesToUTF8(utf8Util.utf8ToBytes('🌶'));		//'🌶'
utf8Util.bytesToUTF8([240, 159, 140, 182]);					//'🌶'
```