export function generateRandomString(length = 6, isAlphanumeric = false, isCapital = true) {
    const numbers = '123456789';
    const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
    const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let characters = numbers;
    if (isAlphanumeric) {
        characters += isCapital ? upperLetters : lowerLetters;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return isCapital ? result.toUpperCase() : result;
}
