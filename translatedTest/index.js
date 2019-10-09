/***
 * 
 * Just run with node by: node index.js
 * 
 * It requires json-diff to check the result
 * npm install  json-diff  
 * 
 * 
 * TODO: optimize avoiding the nested foreach
 */

'use strict';
 
const fs = require('fs');

let rawDataset = fs.readFileSync('dataset.json');
let rawExpected = fs.readFileSync('expected.json');

let dataset = JSON.parse(rawDataset);
let resultDataset = JSON.parse(rawExpected);

//single val eval function, could be improved with more rules if needed be
function evalCondition(v1, v2){
    if(v1 == null && v2 == null) return 0; else return v1 == v2;
}

//find the distance for any element
function distance(element1, element2){
    let dist = 0
    for (let key in element1) {
        evalCondition(element1[key], element2[key]) ? 0 : dist = dist + 1;
    }
    return dist;
}

//just fill the missing vals
function completeFields(element1, element2){
    for (let key in element1) {
        if(element1[key] == null && element2[key] != null) element1[key] = element2[key]; 
        if(element1[key] != null && element2[key] == null) element2[key] = element1[key]; 
    }
}


//here we'll compare the two dataset with an horrible nested foreach (yes...I know)
let subjectNumber = 1;
dataset.forEach(element1 => {
    let compareNumber = 1;
    dataset.forEach(element2 => {
        //distance limit is 5 or less
        if(subjectNumber != compareNumber){
            let dist = distance(element1, element2);
            if(dist < 6){
                //uncomment to see each check...we check back and forth, can be optimized
                //for ex 1 vs 6 and 6 vs 1...the latter can be skipped
                //console.log("Comparing: %d with %d, result %d", subjectNumber, compareNumber, dist);       
                completeFields(element1, element2);      
            }
        }
        compareNumber = compareNumber + 1;
    });
    subjectNumber = subjectNumber + 1;
});


console.log("------Now dataset and resultDataset shall be the same------");
//check if they are the same
var jsonDiff = require('json-diff')
if(jsonDiff.diff(dataset, resultDataset) == null){
    console.log("Gotcha");
}


