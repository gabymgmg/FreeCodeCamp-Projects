function palindrome(str){
    //retirar punto y comas
    let rightWord = []
    let reversedWord = []
    let regex = /[\p{P}\s]/u
    //delete '.' and ','
    for(const letter of str){
        if(regex.test(letter)== false){
            rightWord.push(letter.toLowerCase())
            reversedWord.push(letter.toLowerCase())
        }
    }

    while(reversedWord.length>0 && rightWord.length>0){
        if(rightWord.shift()!== reversedWord.pop()){
            return false
        }
        if(rightWord.length ==0 && reversedWord.length==0){
            return true
        }
    }

}
console.log(palindrome('0_0 (: /-\ :) 0-0"'))