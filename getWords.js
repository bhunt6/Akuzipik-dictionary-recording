function getWords(){
    const words = LEX.filter((word) => word.pos == "noun");
    var output = document.getElementById("output");
    output.innerHTML = words;
}

getWords();