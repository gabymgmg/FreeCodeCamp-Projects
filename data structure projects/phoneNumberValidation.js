function telephoneCheck(str) {
    //check if is there's weird char
    const notValid = /[!*$#?]+/
    if(notValid.test(str)===true){
        return false
    }
    //check the country code
    if(str[0] == '1' && !/[ (]/.test(str[1])){
        return false
    }
    // check parentheses
    let signRegex = /[()]/
    if(signRegex.test(str)){
        const startIndex = str.indexOf('(')
        const finalIndex = str.indexOf(')')
        if(startIndex>finalIndex == true || finalIndex==-1 || startIndex ==-1 || finalIndex-startIndex!=4){
            return false
        }
    }

    // check length
    const numRegex = /[0-9]/
    let counter = 0
    let hyphenCounter = 0
    let i = 0
    
    while(counter<11 && i<str.length){
        if(numRegex.test(str[i])){
            counter++
        }
        if(str[i]=='-'){
            hyphenCounter++
        }
        i++
    }
    if(hyphenCounter>2){
        return false
    }
    if ( counter === 10 || counter === 11 && str[0]==1) {
        return true;
    } else {
        return false
    }
}

console.log(telephoneCheck("555-555-5555"))

//telephoneCheck("555-555-5555") should return true.
// telephoneCheck("(555)555-5555") should return true.
// telephoneCheck("5555555555") should return true.
//telephoneCheck("1(555)555-5555") should return true.
