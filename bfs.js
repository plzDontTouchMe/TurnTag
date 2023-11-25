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
var N = 0;

export function getInfoBfs(){
    return {
        lengthWay: lengthWay,
        countIter: countIter,
        N: N
    }
}
function init(){
    arrayO = []; //очередь
    arrayC = {};
    lengthWay = 0;
    countIter = 0;
    N = 0;
    resetWays();
}
function checkInC(state){
    let key = getKey(state.gameField);
    if(!arrayC.hasOwnProperty(key) && getIndexInO(state) === -1){
        arrayO.push(state)
    }
}
function getIndexInO(state){
    for(let i = 0; i < arrayO.length; i++){
        if (getKey(state.gameField) === getKey(arrayO[i].gameField)) {
            return i;
        }
    }
    return -1;
}
export function bfs(){
    init()
    arrayO.push(startState);
    while(arrayO.length !== 0){
        let x = arrayO[0];
        countIter++;
        if(checkState(x, endState)){
            lengthWay = getWay(x);
            N = Object.keys(arrayC).length + arrayO.length;
            break;
        }
        arrayC[getKey(x.gameField)] = x;
        arrayO.shift();
        for(let i = 0; i < countBlock - 1; i++){
            for(let j = 0; j < countBlock - 1; j++){
                let x1 = turnClockwise(x, i, j);
                let x2 = turnCounterclockwise(x, i, j);
                checkInC(x1);
                x1 = turnClockwise(x1, i, j);
                x1 = turnCounterclockwise(x1, i, j);
                getIndexInO(x1);
                checkInC(x2);
            }
        }
    }
}