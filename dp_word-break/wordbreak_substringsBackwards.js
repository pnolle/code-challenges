/**
 * Source: One of the solutions at https://leetcode.com/problems/word-break/description/?envType=study-plan-v2&envId=top-interview-150
 * 
 *  
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {
  // n = string length
  let n = s.length;
  // prepare dp array, one for each string position
  let dp = new Array(n + 1).fill(false);
  // set dp[0] to true
  dp[0] = true;

  // find max word length
  let len_max = Math.max(...wordDict.map(word => word.length));

  // loop through string (=> used in substring)  
  for (let i = 1; i <= n; i++) {
    // loop down: starting at currentStringPos, ending at currentStringPos - maxWordLength - 1 or 0
    for (let j = i - 1; j >= Math.max(i - len_max - 1, 0); j--) {
        // check if the substring of max word length 
        //       from currentStringPos backwards on
        //       includes a word in wordDict
        console.log(s.substring(j, i), dp[i])
        if (dp[j] && wordDict.includes(s.substring(j, i))) {
          // if so, set the dp array at currentStringPos to true
          dp[i] = true;
          break;
        } 
    }
  }
  return dp[n];
};


// vars
let starttime = undefined;
let msg = '';
let result = false;

// tests
starttime = Date.now();
result = wordBreak("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", ["aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa","aaaaaaaa","aaaaaaaaa","aaaaaaaaaa","ba"]);
msg = "assert false 10";
console.assert(!result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab", ["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa","aaaaaaaa","aaaaaaaaa","aaaaaaaaaa"]);
msg = "assert false 10";
console.assert(!result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("cars", ["car", "ca", "rs"]);
msg = "assert true 3";
console.assert(result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("ddadddbdddadd", ["dd","ad","da","b"]);
msg = "assert true 3";
console.assert(result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("bccdbacdbdacddabbaaaadababadad", [
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
]);
msg = "assert true 50";
console.assert(result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("catskicatcats", ["cats", "cat", "dog", "ski"]);
msg = "assert true 2";
console.assert(result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("ccaccc", ["cc", "bb", "aa", "bc", "ac", "ca", "ba", "cb"]);
msg = "assert true 2";
console.assert(result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("ccaccc", ["cc", "ac", "fritzl"]);
msg = "assert true 2";
console.assert(result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("cbca", ["bc", "ca"]);
msg = "assert false 2";
console.assert(!result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("carsandmoon", ["car", "ca", "rs", "mo", "and"]);
msg = "assert false 5";
console.assert(!result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("carsandmoon", ["car", "ca", "rs", "mo", "and", "caon"]);
msg = "assert false 6";
console.assert(!result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("carsrsrsrsandmoon", ["car", "ca", "rs", "mo", "moon", "and"]);
msg = "assert true 6";
console.assert(result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("carshitthemoonfallingfromtheskies", [
  "car",
  "ca",
  "rs",
  "sk",
  "skies",
  "moo",
  "fall"
]);
msg = "assert false 7";
console.assert(!result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("carshitthemoonfallingfromtheskies", [
  "car",
  "ca",
  "rs",
  "sk",
  "skies",
  "moo",
  "fall",
  "falling"
]);
msg = "assert false 8";
console.assert(!result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("carshitthemoonfallingfromtheskies", [
  "car",
  "ca",
  "rs",
  "sk",
  "skies",
  "moo",
  "fall",
  "falling",
  "ing",
  "shit",
]);
msg = "assert false 10";
console.assert(!result, [msg, Date.now() - starttime]);

starttime = Date.now();
result = wordBreak("carshitthemoonfallingfromtheskies", [
  "car",
  "ca",
  "rs",
  "sk",
  "skies",
  "moon",
  "fall",
  "falling",
  "ing",
  "shit",
  "hit",
  "the",
  "from",
]);
msg = "assert true 13";
console.assert(result, [msg, Date.now() - starttime]);
