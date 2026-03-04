
export default function abortLoadTest(id,getTestState){
    const testState=getTestState(id);
    testState.aborted=true;
    return {message: `TestState with testID: ${id} has been Aborted.`};
}