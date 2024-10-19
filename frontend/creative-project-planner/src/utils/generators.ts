export function generateRandomString(length: number = 6, isAlphanumeric: boolean = false, isCapital: boolean = true): string {
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
