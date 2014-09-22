
// Generate a random identifier, in this case a UUID4.
function makeId() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+S4());
}


function attributeSorter(a, b) {
    if (a.name == 'name') return -1;
    if (b.name == 'name') return 1;
    return a.label > b.label ? 1 : -1;
}
