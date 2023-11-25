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
var lengthWay = 0;
var countIter = 0;
var N = 0;
var L = 0;
var isOver = false;

export function getInfoIddfs(){
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
    resetWays();
    N = 0;
    L = 0;
    isOver = false;
}
function checkInC(state){
    let key = getKey(state.gameField);
    if(arrayC.hasOwnProperty(key)){
        let tempState = arrayC[key];
        if (state.iter <= tempState.iter){
            delete arrayC[key];
            N++;
            let index = getIndexInO(state);
            if(index === -1){
                arrayO.push(state);
            }
            else{
                if(state.iter <= arrayO[index].iter){
                    arrayO.splice(index, 1, state);
                    N++;
                }
            }
        }
    }
    if(!arrayC.hasOwnProperty(key)){
        let index = getIndexInO(state);
        if(index === -1){
            arrayO.push(state);
        }
        else{
            if(state.iter <= arrayO[index].iter){
                arrayO.splice(index, 1, state);
                N++;
            }
        }
    }
}
function getIndexInO(state){
    for(let i = 0; i < arrayO.length; i++){
        if (state.gameField === arrayO[i].gameField) {
            return i;
        }
    }
    return -1;
}
function newLength(){
    L++;
    arrayO = [];
    arrayC = {};
    N = 0;
    countIter = 0;
    arrayO.push(startState);
}
export function iddfs(){
    init();
    arrayO.push(startState);
    while(!isOver){
        let x = arrayO[arrayO.length - 1];
        countIter++;
        if(checkState(x, endState)){
            lengthWay = getWay(x);
            N += Object.keys(arrayC).length + arrayO.length;
            isOver = true;
        }
        arrayC[getKey(x.gameField)] = x;
        arrayO.pop();
        if(x.iter < L){
            for(let i = 0; i < countBlock - 1; i++){
                for(let j = 0; j < countBlock - 1; j++){
                    let x1 = turnClockwise(x, i, j);
                    let x2 = turnCounterclockwise(x, i, j);
                    checkInC(x1);
                    checkInC(x2);
                }
            }
        }
        if(arrayO.length === 0) newLength();
    }
}