/** It performs text processing on a set of documents(corpus) to calculate their 
 * term frequency (TF) and inverse document frequency (IDF) values. */

const { removeStopwords } = require("stopword");
const removePunc = require("remove-punctuation");
const fs = require("fs");
const path = require("path");

let documents = []; // to store the contents of all documents
const N = 3023; // total no. of documents(problem files) to process

/** Reading Documents */
for (let i = 1; i <= N; i++) {
  const str = path.join(__dirname, "Problems");
  const str1 = path.join(str, `problem_text_${i}.txt`); // getting the filename
  // console.log(str1);
  const question = fs.readFileSync(str1).toString(); // reading the contents of file str1
    // console.log(question);
  documents.push(question);
}

/** Preprocessing and Extracting Keywords */
let docKeywords = []; // to store the keywords wrt each document
for (let i = 0; i < documents.length; i++) {
  const lines = documents[i].split("\n");
  // console.log(lines);

  const docWords = [];
  for (let k = 0; k < lines.length; k++) {
    const words = lines[k].split(" ");
    // console.log(words)

    words.forEach((word) => {
      word = word.split("\r"); // Each word is further split on the carriage return character \r
      // Here word is an array of length 1

      // Checking if the word is non-empty
      if (word[0].length) 
        docWords.push(word[0]);
    });
  }

  // Removing stopwords
  const filteredDocWords = removeStopwords(docWords);
  filteredDocWords.sort();
  let temp = [];
  // Removing punctuations and converting to lowercase
  for (let j = 0; j < filteredDocWords.length; j++) {
    filteredDocWords[j] = filteredDocWords[j].toLowerCase();
    filteredDocWords[j] = removePunc(filteredDocWords[j]);
    if (filteredDocWords[j] !== "") temp.push(filteredDocWords[j]);
  }

  docKeywords.push(temp);
}

// console.log(docKeywords[0]);

/** Calculating Document Lengths(No. of keywords) and storing it in length.txt */
let sum = 0;

for (let i = 0; i < N; i++) {
  const length = docKeywords[i].length;
  sum += length;
  fs.appendFileSync("length.txt", length + "\n");
  // console.log(length);
}

// // console.log("LENGTH DONE");
// console.log(sum / N);

/** Creating a Unique Keyword List */
let keywords = [];
for (let i = 0; i < N; i++) {
  for (let j = 0; j < docKeywords[i].length; j++) {
    if (keywords.indexOf(docKeywords[i][j]) === -1)
      keywords.push(docKeywords[i][j]);
  }
}
keywords.sort();
// console.log(keywords);

const W = keywords.length;
// Store keywords in a file
keywords.forEach((word) => {
  fs.appendFileSync("keywords.txt", word + "\n");
});

/** Calculating Term Frequency (TF) */
let TF = new Array(N);
for (let i = 0; i < N; i++) {
  TF[i] = new Array(W).fill(0); //making all zero
  let map = new Map();
  docKeywords[i].forEach((key) => {
    return map.set(key, 0);
  });

  docKeywords[i].forEach((key) => {
    let cnt = map.get(key);
    cnt++;
    return map.set(key, cnt);
  });

  // console.log(map);
  docKeywords[i].forEach((key) => {
    const id = keywords.indexOf(key);
    if (id !== -1) {
      TF[i][id] = map.get(key) / docKeywords[i].length;
    }
  });
}

// console.log(keywords);
// console.log("TF cal done");

/** Saving TF Values */
for (let i = 0; i < N; i++) {
  for (let j = 0; j < W; j++) {
    if (TF[i][j] != 0) // ith document and jth keyword in it
      fs.appendFileSync("TF.txt", i + " " + j + " " + TF[i][j] + "\n");
  }

  // fs.appendFileSync("TFIDF.txt", '\n'.toString());
}

// console.log("TF Call done!");

/** Calculating Inverse Document Frequency (IDF) BM-25 */
let IDF = new Array(W);
for (let i = 0; i < W; i++) {
  let cnt = 0; // no. of documents in with ith keyword is present
  for (let j = 0; j < N; j++) {
    if (TF[j][i]) {
      cnt++;
    }
  }

  if (cnt) IDF[i] = Math.log((N - cnt + 0.5) / (cnt + 0.5) + 1) + 1;
}

// // console.log("IDF cal done");

IDF.forEach((word) => {
  fs.appendFileSync("IDF.txt", word + "\n");
});

// let TFIDF = new Array(N);

// for (let i = 0; i < N; i++) {
//   TFIDF[i] = new Array(W);
//   for (let j = 0; j < W; j++) {
//     TFIDF[i][j] = TF[i][j] * IDF[j];
//   }
// }

// // console.log("TFIDF cal done");

// for (let i = 0; i < N; i++) {
//   for (let j = 0; j < W; j++) {
//     if (TFIDF[i][j] != 0)
//       fs.appendFileSync("TFIDF.txt", i + " " + j + " " + TFIDF[i][j] + "\n");
//   }

//   fs.appendFileSync("TFIDF.txt", "\n".toString());
// }

// for (let i = 0; i < N; i++) {
//   let sqrsum = 0;
//   for (let j = 0; j < W; j++) {
//     sqrsum += TFIDF[i][j] * TFIDF[i][j];
//   }

//   fs.appendFileSync("Magnitude.txt", Math.sqrt(sqrsum) + "\n");
// }

// // const query =
// //   "minimum number of elements you need to add to make the sum of the array equal to goal.";
// // const oldString = query.split(" ");
// // const filteredDocWords = removeStopwords(oldString);
// // filteredDocWords.sort(); // filteredDocWords is an array
// // let queryKeywords = [];

// // for (let j = 0; j < filteredDocWords.length; j++) {
// //   filteredDocWords[j] = filteredDocWords[j].toLowerCase();
// //   filteredDocWords[j] = removePunc(filteredDocWords[j]);
// //   if (filteredDocWords[j] !== "") queryKeywords.push(filteredDocWords[j]);
// // }
// // // console.log(queryKeywords);
// // // now we need to filter out those keywords which are present in our corpse
// // let temp = [];
// // for (let i = 0; i < queryKeywords.length; i++) {
// //   const id = keywords.indexOf(queryKeywords[i]);
// //   if (id !== -1) {
// //     temp.push(queryKeywords[i]);
// //   }
// // }

// // queryKeywords = temp;
// // queryKeywords.sort();
// // console.log(queryKeywords);

// // let qTF = new Array(W).fill(0);
// // let qTFIDF = new Array(W).fill(0);
// // let map = new Map();
// // queryKeywords.forEach((key) => {
// //   return map.set(key, 0);
// // });

// // queryKeywords.forEach((key) => {
// //   let cnt = map.get(key);
// //   cnt++;
// //   return map.set(key, cnt);
// // });

// // queryKeywords.forEach((key) => {
// //   const id = keywords.indexOf(key);
// //   if (id !== -1) {
// //     qTF[id] = map.get(key) / queryKeywords.length;
// //     qTFIDF[id] = qTF[id] * IDF[id];
// //   }
// // });

// // // console.log(qTFIDF);

// // // SIMILARITY OF EACH DOC WITH QUERY STRING
// // const arr = [];

// // for (let i = 0; i < N; i++) {
// //   const s = cosineSimilarity(TFIDF[i], qTFIDF);
// //   // console.log(s);
// //   arr.push({ id: i, sim: s });
// // }

// // arr.sort((a, b) => b.sim - a.sim);
// // for (let i = 0; i < 5; i++) {
// //   console.log(arr[i]);
// // }
