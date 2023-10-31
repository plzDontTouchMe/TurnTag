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
var arrayC = {};
var lengthWay = 0;
var countIter = 0;
var countIterArrayOCur = 0;
var countIterArrayOMax = 0;
var countIterArrayCMax = 0;
var isOver = false;

export function getInfoDbfs(){
    return {
        lengthWay: lengthWay,
        countIter: countIter,
        countIterArrayOMax: countIterArrayOMax,
        countIterArrayCMax: countIterArrayCMax,
        countIterArrayOCur: countIterArrayOCur
    }
}
function init(){
    arrayForwardO = []; //очередь
    arrayBackO = []; //очередь
    arrayC = {};
    lengthWay = 0;
    countIter = 0;
    countIterArrayOCur = 0;
    countIterArrayOMax = 0;
    countIterArrayCMax = 0;
    resetWays();
    isOver = false;
}
function checkInC(state, array){
    let key = getKey(state.gameField);
    if(arrayC.hasOwnProperty(key)){
        let tempState = arrayC[key];
        if (state.iter <= tempState.iter){
            delete arrayC[key];
            array.push()
            countIterArrayOCur++;
            countIterArrayOMax++;
        }
    }
    if(!arrayC.hasOwnProperty(getKey(state.gameField))){
        array.push(state)
        countIterArrayOMax++;
        countIterArrayOCur++;
    }
}
function forwardDir(){
    let x = arrayForwardO[0];
    countIter++;
    let index = getIndexBack0(x)
    if(index !== -1){
        lengthWay = getWayVersion2(x, arrayBackO[index]);
        isOver = true;
    }
    arrayC[getKey(x.gameField)] = x;
    countIterArrayCMax++;
    arrayForwardO.shift();
    countIterArrayOCur--;
    for(let i = 0; i < countBlock - 1; i++){
        for(let j = 0; j < countBlock - 1; j++){
            let x1 = turnClockwise(x, i, j);
            let x2 = turnCounterclockwise(x, i, j);
            checkInC(x1, arrayForwardO);
            checkInC(x2, arrayForwardO);
        }
    }
}
function backDir(){
    let x = arrayBackO[0];
    countIter++;
    arrayC[getKey(x.gameField)] = x;
    countIterArrayCMax++;
    arrayBackO.shift();
    countIterArrayOCur--;
    for(let i = 0; i < countBlock - 1; i++){
        for(let j = 0; j < countBlock - 1; j++){
            let x1 = turnClockwise(x, i, j);
            let x2 = turnCounterclockwise(x, i, j);
            checkInC(x1, arrayBackO);
            checkInC(x2, arrayBackO);
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
    countIterArrayOCur++;
    countIterArrayOMax++;
    arrayBackO.push(endState);
    countIterArrayOCur++;
    countIterArrayOMax++;
    while(!isOver){
        forwardDir();
        backDir();
    }
}