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

var arrayO = []; //стек
var arrayC = [];
var indexI = 0, indexJ = 0;
var countIter = 0;
var countIterArrayOCur = 0;
var countIterArrayOMax = 0;
var countIterArrayCMax = 0;

export function getInfoDfs(){
    return {
        countIter: countIter,
        countIterArrayOMax: countIterArrayOMax,
        countIterArrayCMax: countIterArrayCMax,
        countIterArrayOCur: countIterArrayOCur
    }
}
function init(){
    arrayO = []; //очередь
    arrayC = {};
    indexI = 0;
    indexJ = 0;
    countIter = 0;
    countIterArrayOCur = 0;
    countIterArrayOMax = 0;
    countIterArrayCMax = 0;
    resetWays()
}
export function dfs(){
    init();
    arrayO.push(startState);
    while(arrayO.length != 0){
        let x = arrayO[arrayO.length - 1];
        if(checkState(x, endState)){
            getWay(x);
            break;
        }
        arrayC[getKey(x.gameField)] = x;
        countIter ++;
        countIterArrayCMax++;
        arrayO.pop();
        countIterArrayOCur--;
        for(let i = 0; i < countBlock - 1; i++){
            for(let j = 0; j < countBlock - 1; j++){
                let x1 = turnClockwise(x, indexI + i, indexJ + j);
                let x2 = turnCounterclockwise(x, indexI + i, indexJ + j);
                if(!arrayC.hasOwnProperty(getKey(x1.gameField))){
                    arrayO.push(x1)
                    countIterArrayOMax++;
                    countIterArrayOCur++;
                }
                if(!arrayC.hasOwnProperty(getKey(x2.gameField))){
                    arrayO.push(x2)
                    countIterArrayOMax++;
                    countIterArrayOCur++;
                }
            }
        }
    }
}