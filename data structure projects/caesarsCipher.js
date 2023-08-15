function rot13(str) {
    const letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const num = [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    let result = []
    let regex = /[\p{P}\s]/u
    for(let i=0;i<str.length;i++){
        for (let j=0;j<letras.length;j++){
            if(str[i]==letras[j]){
                if(j<13){
                    result.push(letras[num[j]+13])
                    break
                }
                else {
                    result.push(letras[num[j]-13])
                    break
                }
            }
            if(regex.test(str[i]) == true){
                result.push(str[i])
                break
            }
        }
    }
    return result.join('')
}

console.log(rot13("SERR PBQR PNZC!"))//free