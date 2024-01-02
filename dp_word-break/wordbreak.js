/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function (s, wordDict, debug = false) {
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
  
    reduceWordDict([s], wordDict);
  
    for (let i = 0; i < wordDict.length; i++) {
      let usedWords = [];
      let stringParts = [s];
      if (isWordInString(stringParts, wordDict, i, usedWords, debug) == true)
        return true;
    }
    return false;
  };
  
  // removing every word that has no match in one of the strings
  const reduceWordDict = (stringArray, wordDict) => {
    const originalWordDictLength = wordDict.length;
    const wordIdsToKeep = [];
    stringArray.forEach((s) => {
      wordDict.forEach((w, wi) => {
        if (s.indexOf(wordDict[wi]) > -1 && !wordIdsToKeep.includes(wi)) {
          wordIdsToKeep.push(wi);
        }
      });
    });
    wordIdsToDelete = [];
    for (let i = 0; i < wordDict.length; i++) {
      if (!wordIdsToKeep.includes(i)) {
        wordIdsToDelete.push(i);
      }
    }
    // sorting in descending order so the splice operation still works correctly when iterating up the ids
    wordIdsToDelete.sort((a, b) => b - a);
    wordIdsToDelete.forEach((wid) => {
      wordDict.splice(wid, 1);
    });
    /*
    console.log(
      `wordDict length reduced from ${originalWordDictLength} to ${wordDict.length}`,
      wordDict
    );
    */
  };
  
  const isWordInString = (
    stringParts,
    wordDict,
    i,
    usedWords,
    debug = false
  ) => {
    if (debug)
      console.log(
        usedWords,
        usedWords.map((id) => wordDict[id]),
        stringParts
      );
    const w = wordDict[i];
    usedWords.push(w);
  
    // remove w from strings
    for (let si = 0; si < stringParts.length; si++) {
      const s = stringParts[si];
  
      if (s.indexOf(w) > -1) {
        const sSplitW = s.split(w).filter((spl) => spl.length > 0);
  
        // attempted to join first, which doesn't work. in this case, false is expected: "cbca", ["bc","ca"]. what happens is: "cbca".split("bc") => "ca" => true
        //s = sSplitW.filter((sp) => sp != w).join('');
  
        stringParts.splice(si, 1);
        // in case the same stringPart occures more than once
        while (stringParts.indexOf(w) > -1) {
          stringParts.splice(stringParts.indexOf(w), 1);
        }
        stringParts.push(...sSplitW.filter((sp) => sp != w && sp.length > 0));
        if (debug)
          console.log(
            `is there a ${w} in ${s}? => ${sSplitW}. These are the remaining stringParts: ${stringParts}`
          );
  
        // if nothing is left from the string, we succeeded
        if (stringParts.length == 0) {
          return true;
        }
      } else {
        if (debug)
          console.log(
            `there is no ${w} in ${s}. abandoning this order of words.`
          );
        return false;
      }
  
      // reduct wordDict length by removing all words that have no matches in any member of stringParts
      const wordDictOneLevelDown = wordDict.map((w) => w);
      reduceWordDict(stringParts, wordDictOneLevelDown);
  
      // otherwise we need to try out all combinations of all other array members, that have not been tried out before
      for (let j = 0; j < wordDictOneLevelDown.length; j++) {
        if (!usedWords.includes(wordDictOneLevelDown[j])) {
          // deep copy arrays that have been filled up until this level
          const usedWordsOneLevelDown = usedWords.map((id) => id);
          const stringPartsOneLevelDown = stringParts.map((stp) => stp);
          if (
            isWordInString(
              stringPartsOneLevelDown,
              wordDictOneLevelDown,
              j,
              usedWordsOneLevelDown,
              debug
            ) == true
          )
            return true;
        }
      }
  
      // if there is something left in the string but no dict words to try left, we failed
      if (usedWords.length == wordDict.length) {
        return false;
      }
    }
  };
  
  let starttime = Date.now();
  console.log(
    "assert true 3",
    wordBreak("cars", ["car", "ca", "rs"]),
    Date.now() - starttime
  );
  
  starttime = Date.now();
  console.log(
    "assert true 50",
    wordBreak(
      "bccdbacdbdacddabbaaaadababadad",
      [
        "cbc",
        "bcda",
        "adb",
        "ddca",
        "bad",
        "bbb",
        "dad",
        "dac",
        "ba",
        "aa",
        "bd",
        "abab",
        "bb",
        "dbda",
        "cb",
        "caccc",
        "d",
        "dd",
        "aadb",
        "cc",
        "b",
        "bcc",
        "bcd",
        "cd",
        "cbca",
        "bbd",
        "ddd",
        "dabb",
        "ab",
        "acd",
        "a",
        "bbcc",
        "cdcbd",
        "cada",
        "dbca",
        "ac",
        "abacd",
        "cba",
        "cdb",
        "dbac",
        "aada",
        "cdcda",
        "cdc",
        "dbc",
        "dbcb",
        "bdb",
        "ddbdd",
        "cadaa",
        "ddbc",
        "babb",
      ]
    ),
    Date.now() - starttime
  ); /// too time-consuming even with wirdDict reduction
  
  starttime = Date.now();
  console.log(
    "assert true 2",
    wordBreak("catskicatcats", ["cats", "cat", "dog", "ski"], true),
    Date.now() - starttime
  );
  
  starttime = Date.now();
  console.log(
    "assert true 2",
    wordBreak("ccaccc", ["cc", "bb", "aa", "bc", "ac", "ca", "ba", "cb"]),
    Date.now() - starttime
  );
  
  starttime = Date.now();
  console.log(
    "assert true 2",
    wordBreak("ccaccc", ["cc", "ac", "fritzl"]),
    Date.now() - starttime
  );
  
  starttime = Date.now();
  console.log(
    "assert false 2",
    wordBreak("cbca", ["bc", "ca"]),
    Date.now() - starttime
  );
  
  starttime = Date.now();
  console.log(
    "assert false 5",
    wordBreak("carsandmoon", ["car", "ca", "rs", "mo", "and"]),
    Date.now() - starttime
  );
  
  starttime = Date.now();
  console.log(
    "assert false 6",
    wordBreak("carsandmoon", ["car", "ca", "rs", "mo", "and", "caon"]),
    Date.now() - starttime
  );
  
  starttime = Date.now();
  console.log(
    "assert true 6",
    wordBreak("carsandmoon", ["car", "ca", "rs", "mo", "moon", "and"]),
    Date.now() - starttime
  );
  
  starttime = Date.now();
  console.log(
    "assert false 7",
    wordBreak("carshitthemoonfallingfromtheskies", [
      "car",
      "ca",
      "rs",
      "sk",
      "skies",
      "moo",
      "fall",
    ]),
    Date.now() - starttime
  ); // (takes 1.5 sec)
  
  starttime = Date.now();
  console.log(
    "assert false 8",
    wordBreak("carshitthemoonfallingfromtheskies", [
      "car",
      "ca",
      "rs",
      "sk",
      "skies",
      "moo",
      "fall",
      "falling",
    ]),
    Date.now() - starttime
  );
  
    starttime = Date.now();
    console.log('assert false 10', wordBreak("carshitthemoonfallingfromtheskies", ["car","ca","rs", "sk", "skies", "moo", "fall", "falling", "ing", "shit"]), Date.now()-starttime);
    
    starttime = Date.now();
    console.log('assert true 13', wordBreak("carshitthemoonfallingfromtheskies", ["car","ca","rs", "sk", "skies", "moon", "fall", "falling", "ing", "shit", "hit", "the", "from"]), Date.now()-starttime);
  