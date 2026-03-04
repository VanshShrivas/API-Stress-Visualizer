export const tests=new Map(); //on server memory to improve performance...

export function getTestState(id){
    return tests.get(id);
}
export function addTestState(testState){
    tests.set(testState.id,testState);
}
export function deleteTestState(id){
    tests.delete(id);
}