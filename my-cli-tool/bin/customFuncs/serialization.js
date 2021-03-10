#!/usr/bin/env node
import fs from 'fs';
import btoa from 'btoa';
import crypto from 'crypto-js';

export function serialize(path, text, divideFunc) {
    //check if the input text has spaces, if yes, the input will not be written
    if (text.split('').filter(character => character !== ' ').length !== text.length) {
        readline.close();
        return;
    }

    //divide the input text
    const dividedInputString = divideFunc(text);

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
}

export function deserialize(path) {
    //the current data in the given file
    const prevData = fs.readFileSync(path, 'utf8', (err) => {
        if (err) {
            throw new Error(err);
        }
    })

    //if there is no content in the file
    if (prevData.length === 0) {
        return;
    }

    //verify the integrity of each word
    prevData.split('|').forEach(packet => {
        const packetParts = packet.split(';');

        //check for match between the given length of the string and
        //the actual length of the string 
        if (+packetParts[0] !== packetParts[1].length) {
            throw new Error('Compromised');
        }

        //encode the word to see if it actually matches the already existing one
        if (btoa(crypto.MD5(packetParts[1])) !== packetParts[2]) {
            throw new Error('Compromised');
        }
    })

    const deserializedFileContent = prevData.split('|').map(packet => {
        return packet.split(';')[1];
    }).join('');
    console.log(deserializedFileContent);
}