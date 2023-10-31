import {
    State,
    countBlock,
    checkState,
    turnClockwise,
    turnCounterclockwise,
    getWay,
    ways,
    resetWays,
    getKey
} from "./state.js"
import { startState, endState, drawGameField } from "./game.js"

var arrayO = []; //очередь
var arrayC = {};
var lengthWay = 0;
var countIter = 0;
var countIterArrayOCur = 0;
var countIterArrayOMax = 0;
var countIterArrayCMax = 0;

export function getInfoBfs(){
    return {
        lengthWay: lengthWay,
        countIter: countIter,
        countIterArrayOMax: countIterArrayOMax,
        countIterArrayCMax: countIterArrayCMax,
        countIterArrayOCur: countIterArrayOCur
    }
}
function init(){
    arrayO = []; //очередь
    arrayC = {};
    lengthWay = 0;
    countIter = 0;
    countIterArrayOCur = 0;
    countIterArrayOMax = 0;
    countIterArrayCMax = 0;
    resetWays();
}
function checkInC(state){
    let key = getKey(state.gameField);
    if(!arrayC.hasOwnProperty(key)){
        arrayO.push(state)
        countIterArrayOMax++;
        countIterArrayOCur++;
    }
}
export function bfs(){
    init()
    arrayO.push(startState);
    countIterArrayOCur++;
    countIterArrayOMax++;
    while(arrayO.length != 0){
        let x = arrayO[0];
        countIter++;
        if(checkState(x, endState)){
            lengthWay = getWay(x);
            break;
        }
        arrayC[getKey(x.gameField)] = x;
        countIterArrayCMax++;
        arrayO.shift();
        countIterArrayOCur--;
        for(let i = 0; i < countBlock - 1; i++){
            for(let j = 0; j < countBlock - 1; j++){
                let x1 = turnClockwise(x, i, j);
                let x2 = turnCounterclockwise(x, i, j);
                checkInC(x1);
                checkInC(x2);
            }
        }
    }
}