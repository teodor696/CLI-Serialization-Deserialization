#!/usr/bin/env node
import fs from 'fs';
import read from 'readline';
import btoa from 'btoa';
import crypto from 'crypto-js';
import yargs from 'yargs';

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

const readline = read.createInterface({
    input: process.stdin,
    output: process.stdout
});

yargs
    .command('i', 'a filepath to the file to write in', (options) => {
        readline.question('Text: ', (text) => {

            //store the input path
            const path = options.argv._[1];

            //check if the input text has spaces, if yes, the input will not be written
            if (text.split('').filter(character => character !== ' ').length !== text.length) {
                readline.close();
                return;
            }

            //divide the input text
            const dividedInputString = recursiveDivide(text);

            //encode the formed words
            const hashAndEncodedWords = dividedInputString.map(word => {
                return `${word.length};${word};${btoa(crypto.MD5(word))}`
            }).join('|');

            //the current data in the given file
            const prevData = fs.readFileSync(path, 'utf8', (err) => {
                if (err) {
                    throw new Error(err);
                }
            })

            //check if there is actually a content in the given file,
            //if there is we should put "|" for separatation 
            let splitLine;
            if (prevData.length === 0) {
                splitLine = '';
            } else {
                splitLine = '|';
            }

            //write the input to the file
            fs.writeFileSync(path, prevData + splitLine + hashAndEncodedWords, (err) => {
                if (err) {
                    throw new Error(err);
                }
            });
            readline.close();
        })
    })
    .command('o', 'a filepath to the file that has to be read', (options) => {

        //store the input path
        const path = options.argv._[1];

        //the current data in the given file
        const prevData = fs.readFileSync(path, 'utf8', (err) => {
            if (err) {
                throw new Error(err);
            }
        })

        //if there is no content in the file the code will stop here
        if (prevData.length === 0) {
            readline.close();
            return;
        }

        //verify the integrity of each word
        prevData.split('|').forEach(packet => {
            const packetParts = packet.split(';');

            //check for match between the given length of the string and
            //the actual length of the string 
            if (+packetParts[0] !== packetParts[1].length) {
                console.log('compromised');
                readline.close();
                return;
            }

            //encode the word to see if it actually matches the already existing one
            if (btoa(crypto.MD5(packetParts[1])) !== packetParts[2]) {
                console.log('compromised');
                readline.close();
                return;
            }
        })
        console.log(prevData);
        readline.close();
    })
    .argv;