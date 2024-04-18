'use strict';

const fs = require('fs');

// process.stdin.resume();
// process.stdin.setEncoding('utf-8');

// let inputString = '';
// let currentLine = 0;

// process.stdin.on('data', function(inputStdin) {
//     inputString += inputStdin;
// });

// process.stdin.on('end', function() {
//     inputString = inputString.split('\n');

//     main();
// });

// function readLine() {
//     return inputString[currentLine++];
// }





/*
 * Complete the 'solution' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts STRING phrase as parameter.
 */
function solutionV1(phrase) {
    // TODO: validate

    // Split string into words
    const words = phrase.split(' ');

    const nonLetterPattern = /\W*/g

    const mapWordLengthNum = new Map(); // Hold word length (key), Count (val)

    // Loop each word
    words.forEach((word) => {
        // Trim punctuation
        word = word.replace(nonLetterPattern, '');

        // console.log(`Word: '${word}'`);

        // determine length
        const wordLength = word.length;

        const numSeen = mapWordLengthNum.get(wordLength) ?? 0;

        // console.log(`Seen: ${numSeen}, Length: ${wordLength}`);

        mapWordLengthNum.set(wordLength, numSeen + 1);
    });

    // console.log(Array.from(mapWordLengthNum));

    const max = Array.from(mapWordLengthNum).reduce((currMax, elem) => {
        //elem:[len, numSeen]
        if (currMax.numSeen < elem[1]) {
            currMax.numSeen = elem[1];
            currMax.maxLength = elem[0];
        }

        return currMax;
    }, { numSeen: 0, maxLength: 0 });


    // console.log(`Max: ${JSON.stringify(max)}`);
    // console.log(max.maxLength);
    return max.maxLength;
}

/**
 * Find the most common word length used in the phrase
 * 
 * Difference:
 *  Same logic for splitting words; 
 *  Changed to map.forEach to avoid unneeded conversion to array
 * @param {string} phrase - The string of words to inspect
 * @returns {number} The most common length of the words used in the given string
 */
function solutionV2(phrase) {
    if (typeof phrase !== 'string') throw new TypeError(`Expected a string - Received ${typeof phrase}`);
    if (phrase.length === 0) return 0;

    // Split string into separate words
    const words = phrase.split(' ');

    const nonLetterPattern = /\W*/g; // Matches zero or more non-word characters (anything other than letter, digit, or underscore)

    const mapWordLengthNum = new Map(); // Hold word length (key), Count (val)

    // Loop each word to determine length
    words.forEach((word) => {
        // Trim punctuation
        word = word.replace(nonLetterPattern, ''); // Pattern as global flag set to remove all

        // Determine word length
        const wordLength = word.length;

        // Retrieve previous occurrence count in order to increment or init the value for this word
        const numSeen = mapWordLengthNum.get(wordLength) ?? 0;
        mapWordLengthNum.set(wordLength, numSeen + 1);
    });

    // Hold the highest word length occurrence seen while traversing the collection
    const mostFreq = {
        numSeen: 0,
        wordLength: 0
    }

    // Traverse the collection, looking for the highest occurrence value seen
    mapWordLengthNum.forEach((wordOccurrence, wordLength) => {
        if (mostFreq.numSeen < wordOccurrence) {
            mostFreq.numSeen = wordOccurrence;
            mostFreq.wordLength = wordLength;
        }
    });

    return mostFreq.wordLength;
}

/**
 * Find the most common word length used in the phrase
 * 
 * Difference:
 *   Instead of splitting, then looping again, count word length as iterating through the phrase
 * @param {string} phrase - The string of words to inspect
 * @returns {number} The most common length of the words used in the given string
 */
function solutionV3(phrase) {
    if (typeof phrase !== 'string') throw new TypeError(`Expected a string - Received ${typeof phrase}`);
    if (phrase.length === 0) return 0;

    // Hold current word being inspected
    let currWordLength = 0;

    // Collection for storing historical
    const mapWordLengthOccurrence = new Map();

    // Loop through the phrase one char at a time
    for (let i = 0; i < phrase.length; i++) {
        const c = phrase.charCodeAt(i) ?? 0;

        // Check if an ASCII Char
        // NOTE: This assumes ASCII letters only; Excludes digits, punctuation, and hyphenated words
        if ((c >= 97 && c <= 122) || (c >= 65 && c <= 90)) {
            currWordLength++;
            continue;
        }
        // Otherwise, this char was not a letter (finished with word)

        // Store previous word length (if not zero)
        if (currWordLength > 0) {
            mapWordLengthOccurrence.set(currWordLength, (mapWordLengthOccurrence.get(currWordLength) ?? 0) + 1);
        }

        // Reset metrics for next word
        currWordLength = 0;
    }

    // Hold the highest word length occurrence seen while traversing the collection
    const mostFreq = {
        numSeen: 0,
        wordLength: 0
    }

    // Traverse the collection, looking for the highest occurrence value seen
    mapWordLengthOccurrence.forEach((wordOccurrence, wordLength) => {
        if (mostFreq.numSeen < wordOccurrence) {
            mostFreq.numSeen = wordOccurrence;
            mostFreq.wordLength = wordLength;
        }
    });

    return mostFreq.wordLength;
}

/**
 * Find the most common word length used in the phrase
 * 
 * Difference:
 *  Same as v3 to determine length, but uses array instead of a Map
 * 
 * NOTE:
 *  - Assumes english language
 * @param {string} phrase - The string of words to inspect
 * @returns {number} The most common length of the words used in the given string
 */
function solutionV4(phrase) {
    if (typeof phrase !== 'string') throw new TypeError(`Expected a string - Received ${typeof phrase}`);
    if (phrase.length === 0) return 0;

    // Hold current word being inspected
    let currWordLength = 0;

    // Collection to hold number of times a word with certain length was seen
    // Assumes no words longer than 50 chars (longest official according to Webster is 45)
    // Index is word length, value is occurrences
    const arrWordLengthOccurrence = Array.from(new Array(50)).map((val) => 0);

    // Loop through the phrase one char at a time
    for (let i = 0; i < phrase.length; i++) {
        const c = phrase.charCodeAt(i) ?? 0;

        // Check if an ASCII Char
        // NOTE: This assumes ASCII letters only; Excludes digits, punctuation, and hyphenated words
        if ((c >= 97 && c <= 122) || (c >= 65 && c <= 90)) {
            currWordLength++;
            continue;
        }
        // Otherwise, this char was not a letter (finished with word)

        // Store previous word length (if not zero)
        if (currWordLength > 0) {
            arrWordLengthOccurrence[currWordLength]++; // NOTE: If a word longer than 50 chars exists, this will store NaN instead
        }

        // Reset metrics for next word
        currWordLength = 0;
    }

    // Hold the highest word length occurrence seen while traversing the collection
    const mostFreq = {
        numSeen: 0,
        wordLength: 0
    }

    // Traverse the collection, looking for the highest occurrence value seen
    arrWordLengthOccurrence.forEach((wordOccurrence, wordLength) => {
        if (mostFreq.numSeen < wordOccurrence) {
            mostFreq.numSeen = wordOccurrence;
            mostFreq.wordLength = wordLength;
        }
    });

    return mostFreq.wordLength;
}


function main() {
    // const phrase = '';
    // const phrase = 'Hello World';
    // const phrase = 'Life is like riding a bicycle. To keep your balance, you must keep moving.'; // Time to exec (in seconds): v1 = 0.000394, v2 = 0.0001405, v3 = 0.0001213, v4 = 0.0002417
    // const phrase = (fs.readFileSync('./Test/Documents/shortPhrase.txt') ?? '').toString(); // Time to exec (in seconds):     v1 = 0.0003064, v2 = 0.0001665, v3 = 0.0001646, v4 = 0.0003214
    // const phrase = (fs.readFileSync('./Test/Documents/100Paragraphs.txt') ?? '').toString(); // Time to exec (in seconds):   v1 = 0.008381,  v2 = 0.0066906, v3 = 0.0035631, v4 = 0.0037108
    const phrase = (fs.readFileSync('./Test/Documents/999Paragraphs.txt') ?? '').toString(); // Time to exec (in seconds):   v1 = 0.0609523, v2 = 0.0557256, v3 = 0.0067305, v4 = 0.0050524

    const functionList = [
        solutionV1, // Solution submitted
        solutionV2, // Changed to map.forEach (skipped unnecessary conversion to Array)
        solutionV3, // Count word length as iterating through phrase
        solutionV4, // Same as v3, but uses array instead of map for word length occurrences
    ];

    // Loop through each function and capture execute time
    functionList.forEach((funcPtr) => {
        const startTime = process.hrtime();
        const result = funcPtr(phrase);
        const endTime = process.hrtime(startTime);

        console.log(`${funcPtr.name}: Answer: ${result}; Time: ${endTime[0] + endTime[1] / 1e9}`);
    })
}

main();