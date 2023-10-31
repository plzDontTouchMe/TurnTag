var countBlock = 3;
export var ways = [];
export function resetWays(){
    ways = [];
}
export class State{
    gameField = new Array(countBlock);
    parentState = null;
    iter = 0;
    grade = 0;
    constructor() {
        for (let i = 0; i < countBlock; i++){
            this.gameField[i] = new Array(countBlock);
        }
    }
    get gameField(){
        return this.gameField
    }
}
export function checkState(s1, s2){
    for (let i = 0; i < countBlock; i++){
        for (let j = 0; j < countBlock; j++){
            if(s1.gameField[i][j] != s2.gameField[i][j]) return false;
        }
    }
    return true;
}
export function turnClockwise(state, i, j){
    let newState = new State();
    newState.gameField = JSON.parse(JSON.stringify(state.gameField));
    newState.parentState = state;
    let temp = newState.gameField[i][j];
    newState.gameField[i][j] = newState.gameField[i + 1][j];
    newState.gameField[i + 1][j] = newState.gameField[i + 1][j + 1];
    newState.gameField[i + 1][j + 1] = newState.gameField[i][j + 1];
    newState.gameField[i][j + 1] = temp;
    newState.iter = state.iter + 1;
    return newState;
}
export function turnCounterclockwise(state, i, j){
    let newState = new State();
    newState.gameField = JSON.parse(JSON.stringify(state.gameField));
    newState.parentState = state;
    let temp = newState.gameField[i][j];
    newState.gameField[i][j] = newState.gameField[i][j + 1];
    newState.gameField[i][j + 1] = newState.gameField[i + 1][j + 1];
    newState.gameField[i + 1][j + 1] = newState.gameField[i + 1][j];
    newState.gameField[i + 1][j] = temp;
    newState.iter = state.iter + 1;
    return newState;
}
export function getKey(state){
    let key = ''
    for(let i = 0; i < state.length; i++){
        for(let j = 0; j < state[i].length; j++){
            key += state[i][j];
        }
    }
    return key;
}
export function getWay(x){
    let counter = 0;
    while(true){
        ways.unshift(x.gameField);
        if(x.parentState == null) return counter;
        x = x.parentState;
        counter++;
    }
}
export function getWayVersion2(s1, s2){
    let counter = 0;
    while(true){
        ways.unshift(s1.gameField);
        if(s1.parentState == null) break;
        s1 = s1.parentState;
        counter++;
    }
    while(true){
        if(s2.parentState == null) return counter;
        s2 = s2.parentState;
        ways.push(s2.gameField);
        counter++;
    }
}
export { countBlock };