#!/usr/bin/env node
import { serialize, deserialize } from './serialization.js'
import read from 'readline';
import yargs from 'yargs';

const readline = read.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * 
 * @param {string} text the string to be divided in 5-character strings
 * @description Splits a string in five-character substrings. 
 * In the end of the splitting, if there left four or less characters they will be formed as the last string
 * in the returning array. 
 * @returns Returns an array with strings formed by the split of the text parameter
 */
const recursiveDivide = (str) => {
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

yargs
    .command('i', 'a filepath to the file to write in', (options) => {
        readline.question('Text: ', (text) => {
            serialize(options.argv._[1], text, recursiveDivide);
            readline.close();
        })
    })
    .command('o', 'a filepath to the file that has to be read', (options) => {
        deserialize(options.argv._[1]);
        readline.close();
    })
    .argv;