//Old buttonSearch
const buttonSearch = (e) => {
    var searchString = searchInput.value.toLowerCase();
    const filteredLexicon = LEX.filter((word) =>

        word.search_word.toLowerCase().includes(searchString) ||
        word.gloss.some(gloss => gloss.includes(searchString))
    );

    displayWords(filteredLexicon);
};

function exactMatch(term){
    let searchString = term;

    //Exact match
    let exactWord = LEX.filter((word) =>
    word.search_word.toLowerCase() == searchString
);
    return exactWord;
}

function containsMatch(term){
    let searchString = term;

    //contains word
    let containsWord = LEX.filter((word) =>
    word.search_word.toLowerCase().startsWith(searchString)
);
    return containsWord;
}

function printSearch(displayTerm, first, second = []){
    //Print results in section
    results.innerHTML += `<span class="results_section">Results for <i>${displayTerm}</i>:</span>`;
    let termResults = first.concat(second.filter((item) => first.indexOf(item) < 0));
    displayWords(termResults);
}

function akuzSearch(term){
    //parse the searchTerm
    let parsedRootList = parseWord(term);

    let initialMatch = exactMatch(term);
    console.log(initialMatch)
    if(initialMatch.length){
        printSearch(term, initialMatch);
    }

    if(parsedRootList){
    
        let parsedRoot = parsedRootList[0];
        var postBases = parsedRootList.slice(1,parsedRootList.length);
        setParse(parsedRootList);

        //exact match parsed root
        var exactParsedRoot = exactMatch(parsedRoot);
        var containsParsedRoot = containsMatch(parsedRoot);
        printSearch(parsedRoot, exactParsedRoot, containsParsedRoot);

        //exact match postbases
        for(let i=0; i < postBases.length-1; i++){
            var pb = LEX.filter((word) =>
                word.search_word.toLowerCase() == postBases[i]
            );
            results.innerHTML += `<span class="results_section">Results for <i>${postBases[i]}</i>:</span>`
            displayWords(pb);
        }
    }
    //exact and contains searches if word could not be parsed
    else{
        var exactWord = exactMatch(term);
        var containsWord = containsMatch(term);
        printSearch(term, exactWord, containsWord);
    }
};

//Search for English words
function englishSearch(term) {
    //search for match in gloss first
    let filteredGloss = LEX.filter((word) =>

        word.gloss.some(gloss => gloss.includes(term))
    );

    //search for match in examples
    let filteredExamples = LEX.filter((word) =>

        word.examples.some(example => example.includes(term))
    );

    //search for match in notes
    let filteredNotes = LEX.filter((word) =>

        word.notes.some(note => note.includes(term))
    );

    //join all results together
    let filteredLexicon = filteredGloss.concat(filteredExamples.filter((item) => filteredGloss.indexOf(item) < 0));
    filteredLexicon = filteredLexicon.concat(filteredNotes.filter((item) => filteredLexicon.indexOf(item) < 0));

    displayWords(filteredLexicon);
};

const searchController = (e) => {
    //clear out results and parse divs
    results.innerHTML = "";
    dummy = "";
    setParse(dummy);

    const searchString = searchInput.value.toLowerCase();

    //English search
    if(document.getElementById("engSearch").checked){
        englishSearch(searchString);
    }
    //Akuzipik search
    else if(document.getElementById("akuzSearch").checked){
        akuzSearch(searchString);
    }
};

const setParse = (token) => {
    if(token == ""){
        document.getElementById("parse").style.display = "none";
    }
    else{
        document.getElementById("parse").style.display = "flex";
        const morphs = document.getElementById("morphs");
        let output = `<span class='base'>${token[0]}</span>`;
    
        for(i=1; i<token.length; i++){
            output += `<span class='morpheme'>+ ${token[i]}</span>`;
        }
    
        morphs.innerHTML = output;
    }
};
