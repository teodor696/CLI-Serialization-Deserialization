#!/usr/bin/env node
import { recursiveDivide } from './customFuncs/splitFunc.js';
import { serialize, deserialize } from './customFuncs/serialization.js'
import read from 'readline';
import yargs from 'yargs';

const readline = read.createInterface({
    input: process.stdin,
    output: process.stdout
});

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