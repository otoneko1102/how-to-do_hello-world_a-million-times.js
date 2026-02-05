"use strict";
var m=new Uint8Array(2e3),r=new Int32Array(9),p=0,h=0;
(function(c){
 [...c].reduce((_,b,i)=>m[i]=b,0);
 new Uint32Array(8e6).reduce(()=>{
  if(h)return;
  var o=m[p++],a,b,v;
  if(o==1)r[m[p++]]=(m[p++]<<24)|(m[p++]<<16)|(m[p++]<<8)|m[p++];
  if(o==2)r[m[p++]]+=r[m[p++]];
  if(o==4){a=r[m[p++]];b=m[p++];if(a)p=b}
  if(o==5){a=m[p++];b=m[p++];v=(m[p++]<<24)|(m[p++]<<16)|(m[p++]<<8)|m[p++];r[a]=r[b]<v?1:0}
  if(o==8)console.log("Hello, World!");
  if(o==255)h=1
 },0)
})([1,0,0,0,0,0,1,1,0,0,0,1,8,2,0,1,5,2,0,0,15,66,64,4,2,12,255]);