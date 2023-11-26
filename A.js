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
var maxState = 0;

export function getInfoA(){
    return {
        lengthWay: lengthWay,
        countIter: countIter,
        N: N,
        maxState: maxState
    }
}

function init(){
    arrayO = []; //очередь
    arrayC = {};
    lengthWay = 0;
    countIter = 0;
    N = 0;
    maxState = new State();
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
    if(!arrayC.hasOwnProperty(state.stringField)){
        deleteInO(state)
        insertInO(state);
    }
    else{
        if(state.grade < arrayC[state.stringField].grade){
            delete arrayC[state.stringField];
            N++;
            insertInO(state);
        }
    }
}

function getIndexInO(state){
    for(let i = 0; i < arrayO.length; i++){
        if (state.stringField === arrayO[i].stringField) {
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
        N++;
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
            tempCost += getCountPos(state.gameField[i][j], i, j);
        }
    }
    return Math.ceil(tempCost / 4);
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
    if ((i<=-1) || (j<=-1)) return false;
    return !((i===countBlock) || (j===countBlock))
}

var dict = {};

function createPointOfSq(array, i, j, offsetI, offsetJ){
    if (checkSq(i+offsetI,j+offsetJ)){
        array.push({
            x: i+offsetI,
            y :j+offsetJ
        });
    }
}

function createSq(i,j){
    let array = [];
    createPointOfSq(array, i, j, 0, 0);
    createPointOfSq(array, i, j, 1, 0);
    createPointOfSq(array, i, j, 0, 1);
    createPointOfSq(array, i, j, 1, 1);
    return array;
}

function createDict(){
    for (let i=0;i<countBlock;i++) {
        for (let j = 0; j < countBlock; j++) {
            dict[i * countBlock + j] = getArray(i, j)
        }
    }
}
    
createDict();

function getArray(i,j){
    let array = [];
    let tempArray = createSq(i - 1, j - 1);
    if(tempArray.length === 4)  array.push(tempArray);
    tempArray = createSq(i - 1, j);
    if(tempArray.length === 4)  array.push(tempArray);
    tempArray = createSq(i, j - 1);
    if(tempArray.length === 4)  array.push(tempArray);
    tempArray = createSq(i, j);
    if(tempArray.length === 4)  array.push(tempArray);
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
    let count = 0;
    let isEqual = true;
    for(let tempI = 0;tempI < arrayEl.length; tempI++){
        for(let tempJ = 0; tempJ < dict[el].length; tempJ++){
            for(let tempK = 0; tempK < arrayEl[tempI].length; tempK++){
                if(arrayEl[tempI][tempK].x !== dict[el][tempJ][tempK].x || arrayEl[tempI][tempK].y !== dict[el][tempJ][tempK].y) isEqual = false;
            }
            if(isEqual) count++;
            isEqual = true;
        }
    }
    let result = dict[el].length - count;
    if(dict[el].length === countBlock + 1){
        if(el !== endState.gameField[i][j]){
            result--;
        }
    }
    if(result === 0){
        if(el !== endState.gameField[i][j]){
            result++;
        }
    }
    return result;
}
function countWrongSq(state){
    let tempCost = 0;
    for(let i = 0; i < countBlock; i++){
        for(let j = 0; j < countBlock; j++){
            tempCost += getCountSq(state.gameField[i][j], i, j);
        }
    }
    return Math.ceil(tempCost / 4);
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
    return Math.abs(parseInt(el / countBlock) - i) + Math.abs(el % countBlock - j);
}
function manhattanDistance(state){
    let tempCost = 0;
    for(let i = 0; i < countBlock; i++){
        for(let j = 0; j < countBlock; j++){
            tempCost += getCostManhattanDistance(state.gameField[i][j], i, j);
        }
    }
    return Math.ceil(tempCost / 4);
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


function checkMaxState(state){
    if (state.grade - state.iter > maxState.grade - maxState.iter) {
        maxState = new State();
        maxState = JSON.parse(JSON.stringify(state));
    }
}

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
    maxState = JSON.parse(JSON.stringify(startState));
    arrayO.push(startState);
    while(arrayO.length !== 0) {
        let x = arrayO[0];
        checkMaxState(x);
        countIter++;
        if(checkState(x, endState)){
            lengthWay = getWay(x);
            N = Object.keys(arrayC).length + arrayO.length;
            return;
        }
        arrayC[x.stringField] = x;
        arrayO.shift();
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
    alert('Из данного начального состояния невозможно найти решение!')
}