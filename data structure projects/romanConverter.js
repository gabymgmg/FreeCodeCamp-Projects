function convertToRoman(num){
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let numero = num
    let i = 0
    let result = ''
    while(i<values.length){
        if(numero>=values[i]){
            result+=symbols[i]
            numero-=values[i]
        }
        if (numero<values[i]){
            i++
        }
        if(numero == 0){
            break
        }
    }
    return result
}

console.log(convertToRoman(83)) //LXXXIII