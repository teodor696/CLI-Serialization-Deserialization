/**
 * 
 * @param {string} text the string to be divided in 5-character strings
 * @description Splits a string in five-character substrings. 
 * In the end of the splitting, if there left four or less characters they will be formed as the last string
 * in the returning array. 
 * @returns Returns an array with strings formed by the split of the text parameter
 */
export const recursiveDivide = (str) => {
    const innerFunc = (text, index = 0, end = text.length - 1, wordsArray = []) => {
        let currentWordsArray = [...wordsArray];
        let word = '';
        for (let i = index; i < index + 5; i += 1) {
            if (text[i] === '\\' && text[i + 1] === 'n') {
                if (word.length === 0) {
                    return currentWordsArray;
                }
                currentWordsArray.push(word);
                return currentWordsArray;
            } else {
                if (text[i]) {
                    word += text[i];
                } else {
                    if (word.length > 0) {
                        currentWordsArray.push(word);
                    }
                    return currentWordsArray;
                }
            }
        }
        currentWordsArray.push(word);
        return innerFunc(text, index + 5, end, currentWordsArray);
    }
    return innerFunc(str);
}