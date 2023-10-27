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
var indexI = 0, indexJ = 0;
var countIter = 0;
var countIterArrayOCur = 0;
var countIterArrayOMax = 0;
var countIterArrayCMax = 0;

function init(){
    arrayO = []; //очередь
    arrayC = {};
    indexI = 0;
    indexJ = 0;
    countIter = 0;
    countIterArrayOCur = 0;
    countIterArrayOMax = 0;
    countIterArrayCMax = 0;
    resetWays();
}

function insertInO(el){
    for(let i = 0; i < arrayO.length; i++){
        if(el.grade < arrayO[i].grade) {
            arrayO.splice(i, 0, el);
            return;
        }
    }
    arrayO.splice(arrayO.length, 0, el);
}

function check(state){
    let key = getKey(state.gameField);
    if(!arrayC.hasOwnProperty(key)){
        deleteInO(state);
        insertInO(state);
    }
    else{
        if(state.grade < arrayC[key].grade){
            delete arrayC[key];
            insertInO(state);
        }
    }
}

function getIndexInO(state){
    for(let i = 0; i < arrayO.length; i++){
        if (state.gameField === arrayO[i].gameField) {
            if(state.grade < arrayO[i].grade) return i;
            return -1;
        }
    }
    return -1;
}

function deleteInO(state){
    let index = getIndexInO(state)
    if(index !== -1){
        arrayO.splice(index, 1);
    }
}

/*function getCost(el, i, j){ //state.iter * 2
    return Math.abs(parseInt(el / countBlock) - i) + Math.abs(el % countBlock - j)
}*/

function getCost(el, i, j){ //state.iter * 2
    return Math.sqrt(Math.pow(parseInt(el / countBlock) - i, 2) + Math.pow(el % countBlock - j,2));
}

function chessKingMetric(state){
    let tempCost = 0;
    for(let i = 0; i < countBlock; i++){
        for(let j = 0; j < countBlock; j++){
            tempCost += getCost(state.gameField[i][j], i, j);
        }
    }
    return tempCost;
}

/*function getCount(el, i, j){
    return Math.abs(el - endState.gameField[i][j]);
}*/
function getCount(el, i, j){ //state.iter * 0.9
    if(el !== endState.gameField[i][j]) return 1;
    return 0;
}
function countWrongPosition(state){
    let tempCost = 0;
    for(let i = 0; i < countBlock; i++){
        for(let j = 0; j < countBlock; j++){
            tempCost += getCount(state.gameField[i][j], i, j);
        }
    }
    return tempCost;
}



function g(state){
    return state.iter * 2;
}

function h(state){
    return countWrongPosition(state);
}

function f(state){
    return g(state) + h(state);
}

var itr = 0;

export function A() {
    init();
    startState.grade = f(startState);
    arrayO.push(startState);
    while(arrayO.length !== 0) {
        let x = arrayO[0];
        itr++;
        if(itr == 25000){
            return;
        }
        if(checkState(x, endState)){
            getWay(x);
            console.log("COUNT ITER = " + itr);
            break;
        }
        arrayC[getKey(x.gameField)] = x;
        arrayO.shift();
        for(let i = 0; i < countBlock - 1; i++){
            for(let j = 0; j < countBlock - 1; j++){
                let x1 = turnClockwise(x, indexI + i, indexJ + j);
                let x2 = turnCounterclockwise(x, indexI + i, indexJ + j);
                x1.grade = f(x1);
                x2.grade = f(x2);
                check(x1);
                check(x2);
            }
        }
    }
}