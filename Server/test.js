
// const ODj = {
//     a: "adab",
//     b: "fjdgfji"
// }

// ODj.ronak = 1;
// console.log(ODj);

// var array = ["apple", "banana", "orange"];
// var array2 = ["grape", "pineapple"];

// Array.prototype.containsAny = function (array) {
//     return this.indexOfAny(array) != -1;
// }

// const a = [10, 50, 60, 70, 80]
const a = [1, 545, 15, 12, 155]
const b = [54, 545, 15, 12, 155, 1]

const checknumber = b.filter(i => a.includes(i))
console.log(checknumber);

if (!checknumber) {
    console.log(`It's Number Not Include ${b}`);
} else {
    console.log("Something Wrong");
}