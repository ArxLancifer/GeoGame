import { myFun, something } from "./moduletest.js";

console.log("main.js loaded");

let func = myFun;
let myX = something;

func();

console.log(myX);
