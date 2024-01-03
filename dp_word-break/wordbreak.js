/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function (s, wordDict, debug = true) {
  // basic problem:
  // - find out the right combination of words from the dict that give a valid result
  // what do we know:
  // - dictionary words cannot overlap in string
  // - later words might have to be used first to find the right solution
  // approach:
  // - start with each word and try every other combination
  // optimization:
  // X reduce wordDict: if a word is not a match on the first level, it doesn't have to be checked in combinations
  // X reduct wordDict on every sub-level
  // - memoization of string results not possible because different words are taken out
  // - does it make sense to sort the list by length and start with the shortest words?
  if (debug) console.log(`🚀 starting new string "${s}" with wordDict`, wordDict);

  // reduce wordDict one time for complete string
  reduceWordDict(s, wordDict, debug);
  if (!checkChars(s, wordDict, debug)) {
    if (debug) console.log(`⚠️ not all characters from string "${s}" could be found in wordDict.`, wordDict, checkChars(s, wordDict, debug));
    return false;
  }
  
  let levelCounter = 0;
  for (let i = 0; i < wordDict.length; i++) {
    if (findWord(s, wordDict, i, [], levelCounter, debug) == true) return true;
  }
  if (debug) console.log(`❌ string "${s}" could not be created from wordDict.`, wordDict);
  return false;
};

// match words from dict in string
const findWord = (s, wordDict, wi, usedWords, levelCounter, debug = false) => {
    levelCounter++;
    const word = wordDict[wi];
    const oneLevelDeeperWordDict = wordDict.map((u) => u);

    // if string is an exact match with one from the wordDict, we succeeded
    if (checkExactMatch(s, wordDict, debug)) {
      if (debug) console.log(`[level ${levelCounter}] ✅ rest of string ${s} is an exact match with one of the dictionary words. word order successful.`, usedWords);
      return true;
    }

    // word found in string?
    if (s.startsWith(word)) {
      let foundWordOnSameLevelCounter = 1;
      let newS = s;

      // performance update: if word is found on same level more than once, we remove it a couple of times at once
      while (newS.startsWith(word)) {
        // if string is an exact match with one from the wordDict, we succeeded
        // we need to check here again because we might have removed part of the last word if then two last words begin equally
        if (checkExactMatch(newS, wordDict, debug)) {
          if (debug) console.log(`[level ${levelCounter}] ✅ rest of string ${s} is an exact match with one of the dictionary words. word order successful.`, usedWords);
          return true;
        }
        
        // push word to usedWords (only for logging purposes when debug enabled)
        if (debug) usedWords.push(word);

        // remove word from string
        newS = newS.substring(word.length);
        if (debug) console.log(`[level ${levelCounter}] found word "${word}" in "${s} (${foundWordOnSameLevelCounter}x on same level)". new string: "${newS}"`, usedWords);

        // if string is empty, the word order was successful
        if (newS.length == 0) {
          if (debug) console.log(`[level ${levelCounter}] ✅ string is empty. word order successful.`, usedWords);
          return true;
        }
        foundWordOnSameLevelCounter++;
      }

      // if newS does not begin with one of the words in the dictionary, it's not worth going deeper.
      if (!checkWordsOnSameLevel(newS, oneLevelDeeperWordDict, debug)) {
        if (debug) console.log(`[level ${levelCounter}] ⚠️ string "${newS}" does not begin with one of the words from wordDict.`, oneLevelDeeperWordDict);
        return false;
      }
      // reduce wordDict for new string
      reduceWordDict(newS, oneLevelDeeperWordDict, debug);
      // if no words left in dictionary, this attempt is not successful
      if (oneLevelDeeperWordDict.length == 0) {
        if (debug) console.log(`[level ${levelCounter}] ⚠️ string "${newS}" is not empty and no dictionary words match. word order not successful.`, usedWords);
        return false;
      }
      // if there are still words in the dict, check chars
      if (!checkChars(newS, oneLevelDeeperWordDict, debug)) {
        if (debug) console.log(`[level ${levelCounter}] ⚠️ not all characters from string "${newS}" could not be found in wordDict.`, oneLevelDeeperWordDict);
        return false;
      }

      for (let wj = 0; wj < oneLevelDeeperWordDict.length; wj++) {
        let oneLevelDeeperUsedWords = [];
        // pass deep copy of usedWords to keep the original for more attempts on same level (only for logging purposes when debug enabled)
        if (debug) oneLevelDeeperUsedWords = usedWords.map((u) => u);
        if (findWord(newS, oneLevelDeeperWordDict, wj, oneLevelDeeperUsedWords, levelCounter, debug) == true) return true;
      }
      // if no matches
      return false;
  }
}

// removing every word that has no match in one of the strings
const reduceWordDict = (s, wordDict, debug = false) => {
  const wordDictOriginal = wordDict.map((w) => w);
  for (let i = 0; i < wordDictOriginal.length; i++) {
    if (!s.includes(wordDictOriginal[i])) {
      wordDict.splice(wordDict.indexOf(wordDictOriginal[i]), 1);
    }
  }
  // sort decreasing by length => longer words first might reduce the amount of words to check
  wordDict.sort((a,b) => b.length - a.length);
  if (debug) { console.log(`wordDict length reduced for string "${s}" from ${wordDictOriginal.length} to ${wordDict.length}`, wordDict); }
};

// check for chars in string that are not in any dict word
const checkChars = (s, wordDict, debug = false) => {
  const wordDictCharsUnique = [...wordDict.join('')].reduce((acc, curr) => { return acc.includes(curr) ? acc : acc + curr}, '');
  const stringCharsUnique = [...s].reduce((acc, curr) => { return acc.includes(curr) ? acc : acc + curr}, '');

  for (let i = 0; i < stringCharsUnique.length; i++) {
    const element = stringCharsUnique[i];
    if (!wordDictCharsUnique.includes(element)) {
      return false;
    }
  };
  return true;
};

// check if string startts with any of the words in the dict
const checkWordsOnSameLevel = (s, wordDict, debug = false) => {
  for (let i = 0; i < wordDict.length; i++) {
    if (s.startsWith(wordDict[i])) {
      return true;
    }
  };
  return false;
};

// check if string startts with any of the words in the dict
const checkExactMatch = (s, wordDict, debug = false) => {
  for (let i = 0; i < wordDict.length; i++) {
    if (s === wordDict[i]) {
      return true;
    }
  };
  return false;
};


// vars
let starttime = undefined;
let msg = '';
let result = false;

// tests
// starttime = Date.now();
// result = wordBreak("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", ["aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa","aaaaaaaa","aaaaaaaaa","aaaaaaaaaa","ba"], true);
// msg = "assert false 10";
// console.assert(!result, [msg, Date.now() - starttime]);

// starttime = Date.now();
// result = wordBreak("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab", ["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa","aaaaaaaa","aaaaaaaaa","aaaaaaaaaa"]);
// msg = "assert false 10";
// console.assert(!result, [msg, Date.now() - starttime]);

// starttime = Date.now();
// result = wordBreak("cars", ["car", "ca", "rs"]);
// msg = "assert true 3";
// console.assert(result, [msg, Date.now() - starttime]);

// starttime = Date.now();
// result = wordBreak("ddadddbdddadd", ["dd","ad","da","b"]);
// msg = "assert true 3";
// console.assert(result, [msg, Date.now() - starttime]);

// starttime = Date.now();
// result = wordBreak("bccdbacdbdacddabbaaaadababadad", [
//   "cbc",
//   "bcda",
//   "adb",
//   "ddca",
//   "bad",
//   "bbb",
//   "dad",
//   "dac",
//   "ba",
//   "aa",
//   "bd",
//   "abab",
//   "bb",
//   "dbda",
//   "cb",
//   "caccc",
//   "d",
//   "dd",
//   "aadb",
//   "cc",
//   "b",
//   "bcc",
//   "bcd",
//   "cd",
//   "cbca",
//   "bbd",
//   "ddd",
//   "dabb",
//   "ab",
//   "acd",
//   "a",
//   "bbcc",
//   "cdcbd",
//   "cada",
//   "dbca",
//   "ac",
//   "abacd",
//   "cba",
//   "cdb",
//   "dbac",
//   "aada",
//   "cdcda",
//   "cdc",
//   "dbc",
//   "dbcb",
//   "bdb",
//   "ddbdd",
//   "cadaa",
//   "ddbc",
//   "babb",
// ]);
// msg = "assert true 50";
// console.assert(result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("catskicatcats", ["cats", "cat", "dog", "ski"]);
msg = "assert true 2";
console.assert(result, [msg, Date.now() - starttime]);

// starttime = Date.now();
// result = wordBreak("ccaccc", ["cc", "bb", "aa", "bc", "ac", "ca", "ba", "cb"]);
// msg = "assert true 2";
// console.assert(result, [msg, Date.now() - starttime]);

// starttime = Date.now();
// result = wordBreak("ccaccc", ["cc", "ac", "fritzl"]);
// msg = "assert true 2";
// console.assert(result, [msg, Date.now() - starttime]);

// starttime = Date.now();
// result = wordBreak("cbca", ["bc", "ca"]);
// msg = "assert false 2";
// console.assert(!result, [msg, Date.now() - starttime]);

// starttime = Date.now();
// result = wordBreak("carsandmoon", ["car", "ca", "rs", "mo", "and"]);
// msg = "assert false 5";
// console.assert(!result, [msg, Date.now() - starttime]);

// starttime = Date.now();
// result = wordBreak("carsandmoon", ["car", "ca", "rs", "mo", "and", "caon"]);
// msg = "assert false 6";
// console.assert(!result, [msg, Date.now() - starttime]);

// starttime = Date.now();
// result = wordBreak("carsrsrsrsandmoon", ["car", "ca", "rs", "mo", "moon", "and"]);
// msg = "assert true 6";
// console.assert(result, [msg, Date.now() - starttime]);

// starttime = Date.now();
// result = wordBreak("carshitthemoonfallingfromtheskies", [
//   "car",
//   "ca",
//   "rs",
//   "sk",
//   "skies",
//   "moo",
//   "fall"
// ]);
// msg = "assert false 7";
// console.assert(!result, [msg, Date.now() - starttime]);

// starttime = Date.now();
// result = wordBreak("carshitthemoonfallingfromtheskies", [
//   "car",
//   "ca",
//   "rs",
//   "sk",
//   "skies",
//   "moo",
//   "fall",
//   "falling"
// ]);
// msg = "assert false 8";
// console.assert(!result, [msg, Date.now() - starttime]);

// starttime = Date.now();
// result = wordBreak("carshitthemoonfallingfromtheskies", [
//   "car",
//   "ca",
//   "rs",
//   "sk",
//   "skies",
//   "moo",
//   "fall",
//   "falling",
//   "ing",
//   "shit",
// ]);
// msg = "assert false 10";
// console.assert(!result, [msg, Date.now() - starttime]);

// starttime = Date.now();
// result = wordBreak("carshitthemoonfallingfromtheskies", [
//   "car",
//   "ca",
//   "rs",
//   "sk",
//   "skies",
//   "moon",
//   "fall",
//   "falling",
//   "ing",
//   "shit",
//   "hit",
//   "the",
//   "from",
// ]);
// msg = "assert true 13";
// console.assert(result, [msg, Date.now() - starttime]);
