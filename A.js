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

export function getInfoA(){
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

function insertInO(el){
    for(let i = 0; i < arrayO.length; i++){
        if(el.grade < arrayO[i].grade) {
            arrayO.splice(i, 0, el);
            countIterArrayOCur++;
            countIterArrayOMax++;
            return;
        }
    }
    arrayO.splice(arrayO.length, 0, el);
    countIterArrayOCur++;
    countIterArrayOMax++;
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
        countIterArrayOCur--;
    }
}


//-----------------------------------------f3-------------------------------------------
function getCountPos(el, i, j){
    if(el !== endState.gameField[i][j]) return 1;
    return 0;
}
function countWrongPosition(state){
    let tempCost = 0;
    for(let i = 0; i < countBlock; i++){
        for(let j = 0; j < countBlock; j++){
            tempCost += Math.ceil(getCountPos(state.gameField[i][j], i, j) / 4);
        }
    }
    return tempCost;
}

function g3(state){
    return state.iter;
}

function h3(state){
    return countWrongPosition(state);
}

function f3(state){
    return g3(state) + h3(state);
}
//-------------------------------------------------------------------------------------


//-----------------------------------------f2-------------------------------------------

function checkSq(i,j){
    if ((i==-1) || (j==-1)) return false;
    return !((i+1==countBlock) || (j+1==countBlock))
}

var dict = {};

function getArray(i,j){
    let array = []
    if (checkSq(i,j)){
        array.push({
            x: i,
            y :j
        });
    }
    if (checkSq(i-1,j-1)){
        array.push({
            x: i-1,
            y :j-1
        });
    }
    if (checkSq(i-1,j)){
        array.push({
            x: i-1,
            y :j
        });
    }
    if (checkSq(i,j-1)){
        array.push({
            x: i,
            y :j-1
        });
    }
    return array;
}

function getDictNumberIndexSq() {
    for (let i=0;i<countBlock;i++){
        for (let j=0;j<countBlock;j++){
            let el = i*countBlock+j;
            dict[el]=getArray(i,j);
        }
    }
}

function getCountSq(el, i, j){
    let arrayEl = getArray(i,j);
    let indexI = parseInt(el / countBlock);
    let indexJ = el % countBlock;
    for(let tempI = 0; tempI < arrayEl.length; tempI++){
        if(indexI === arrayEl[tempI].x && indexJ === arrayEl[tempI].y) {
            return 0;
        }
    }
    return 1;
}
function countWrongSq(state){
    let tempCost = 0;
    for(let i = 0; i < countBlock; i++){
        for(let j = 0; j < countBlock; j++){
            tempCost += Math.ceil(getCountSq(state.gameField[i][j], i, j) / 4);
        }
    }
    return tempCost;
}
function g2(state){
    return state.iter;
}

function h2(state){
    return countWrongSq(state);
}

function f2(state){
    return g2(state) + h2(state);
}
//-------------------------------------------------------------------------------------


//-----------------------------------------f1-------------------------------------------
function getCostManhattanDistance(el, i, j){
    return Math.abs(Math.ceil(parseInt(el / countBlock) - i) + Math.abs(el % countBlock - j) / 4);
}
function manhattanDistance(state){
    let tempCost = 0;
    for(let i = 0; i < countBlock; i++){
        for(let j = 0; j < countBlock; j++){
            tempCost += Math.ceil(getCostManhattanDistance(state.gameField[i][j], i, j));
        }
    }
    return tempCost;
}
function g1(state){
    return state.iter;
}

function h1(state){
    return manhattanDistance(state);
}

function f1(state){
    return g1(state) + h1(state);
}
//-------------------------------------------------------------------------------------


export function A(number) {
    init();
    switch (number){
        case 1:{
            startState.grade = f1(startState);
            break;
        }
        case 2:{
            startState.grade = f2(startState);
            break;
        }
        case 3:{
            startState.grade = f3(startState);
            break;
        }
    }
    arrayO.push(startState);
    countIterArrayOCur++;
    countIterArrayOMax++;
    while(arrayO.length !== 0) {
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
                switch (number){
                    case 1:{
                        x1.grade = f1(x1);
                        x2.grade = f1(x2);
                        break;
                    }
                    case 2:{
                        x1.grade = f2(x1);
                        x2.grade = f2(x2);
                        break;
                    }
                    case 3:{
                        x1.grade = f3(x1);
                        x2.grade = f3(x2);
                        break;
                    }
                }
                check(x1);
                check(x2);
            }
        }
    }
}