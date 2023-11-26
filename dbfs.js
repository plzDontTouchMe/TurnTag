import {
    State,
    countBlock,
    checkState,
    turnClockwise,
    turnCounterclockwise,
    getWay,
    ways,
    resetWays,
    getKey,
    getWayVersion2
} from "./state.js"
import { startState, endState, drawGameField } from "./game.js"

var arrayForwardO = []; //очередь
var arrayBackO = []; //очередь
var arrayForwardC = {};
var arrayBackC = {};
var lengthWay = 0;
var countIter = 0;
var N = 0;
var isOver = false;

export function getInfoDbfs(){
    return {
        lengthWay: lengthWay,
        countIter: countIter,
        N: N
    }
}
function init(){
    arrayForwardO = []; //очередь
    arrayBackO = []; //очередь
    arrayForwardC = {};
    arrayBackC = {};
    lengthWay = 0;
    countIter = 0;
    N = 0;
    resetWays();
    isOver = false;
}
function checkInC(state, arrayO, arrayC){
    if(!arrayC.hasOwnProperty(state.stringField) && getIndexInO(state, arrayO === -1)){
        arrayO.push(state)
    }
}
function getIndexInO(state, arrayO){
    for(let i = 0; i < arrayO.length; i++){
        if (state.stringField === arrayO[i].stringField) {
            return i;
        }
    }
    return -1;
}
function forwardDir(){
    let x = arrayForwardO[0];
    countIter++;
    arrayForwardC[x.stringField] = x;
    arrayForwardO.shift();
    let index = getIndexBack0(x)
    if(index !== -1){
        lengthWay = getWayVersion2(x, arrayBackO[index]);
        N = Object.keys(arrayForwardC).length + Object.keys(arrayBackC).length + arrayForwardO.length + arrayBackO.length;
        isOver = true;
        return;
    }
    index = arrayBackC.hasOwnProperty(x.stringField);
    if(index !== false){
        lengthWay = getWayVersion2(x, arrayBackC[x.stringField]);
        N = Object.keys(arrayForwardC).length + Object.keys(arrayBackC).length + arrayForwardO.length + arrayBackO.length;
        isOver = true;
        return;
    }
    for(let i = 0; i < countBlock - 1; i++){
        for(let j = 0; j < countBlock - 1; j++){
            let x1 = turnClockwise(x, i, j);
            let x2 = turnCounterclockwise(x, i, j);
            checkInC(x1, arrayForwardO, arrayForwardC);
            checkInC(x2, arrayForwardO, arrayForwardC);
        }
    }
}
function backDir(){
    let x = arrayBackO[0];
    countIter++;
    arrayBackC[x.stringField] = x;
    arrayBackO.shift();
    for(let i = 0; i < countBlock - 1; i++){
        for(let j = 0; j < countBlock - 1; j++){
            let x1 = turnClockwise(x, i, j);
            let x2 = turnCounterclockwise(x, i, j);
            checkInC(x1, arrayBackO, arrayBackC);
            checkInC(x2, arrayBackO, arrayBackC);
        }
    }
}
function getIndexBack0(state){
    for(let i = 0; i < arrayBackO.length; i++){
        if(checkState(arrayBackO[i], state)) return i;
    }
    return -1;
}
export function dbfs(){
    init();
    arrayForwardO.push(startState);
    arrayBackO.push(endState);
    while(!isOver){
        if(arrayForwardO.length === 0) break;
        forwardDir();
        backDir();
    }
    alert('Из данного начального состояния невозможно найти решение!');
}