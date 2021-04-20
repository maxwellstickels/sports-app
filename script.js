var nameSearch = document.getElementById("name-search");
var submitBtn = document.getElementById("submit-btn");
var playerResults = document.getElementById("player-stats-display");
var info; // for getting player ID by name
var info2; // for getting player team affiliation, jersey #, etc. by ID

// Given a player ID, renders information to screen corresponding that the player with that ID.
function fetchPlayerStats(id) {
    fetch("https://lookup-service-prod.mlb.com/json/named.player_info.bam?sport_code='mlb'&player_id='" + id + "'").then(function(response2) {
        return response2.json();}).then(function(data2) {
        info2 = data2.player_info.queryResults.row;
        // Checks for nick name
        var nickName = " \"";
        if (info2.name_nick === "") {
            nickName = " ";
        }
        else {
            nickName += info2.name_nick + "\" ";
        }
        // Checks for jersey number; defaults to #00 if none available
        var jerseyNum = info2.jersey_number;
        if (jerseyNum.length === 0) {
            jerseyNum += "00";
        }
        // Links Twitter account if handle is included
        if (info2.twitter_id == "") {
            var playerName = document.createElement('p');
            playerName.textContent = "#" + jerseyNum + ": " + info2.name_first + nickName + info2.name_last;
        }
        else {
            var playerName = document.createElement('p');
            var playerLink = document.createElement('a');
            playerLink.setAttribute("href", "https://twitter.com/" + info2.twitter_id);
            playerLink.textContent = "#" + jerseyNum + ": " + info2.name_first + nickName + info2.name_last;
            playerName.appendChild(playerLink);
        }
        // Adds player info to screen
        playerResults.appendChild(playerName);
        return data2;
    });
}

function displayResults() {
    if (nameSearch.value.length > -1) { // This condition sets minimum input length requirement - set it to -1 if you don't care about minimum length.
        playerResults.innerHTML = ""; // Clears player results
        fetch("https://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'&active_sw='Y'&name_part='" + nameSearch.value + "%25'").then(function(response) {
            return response.json();}).then(function(data) {
            console.log(data);
            if (data.search_player_all.queryResults.totalSize != "0") {
                    info = data.search_player_all.queryResults.row;
                    if (info[0] === undefined) { // Single result does not come in an array - check for this edge case, otherwise single results will not be logged.
                        fetchPlayerStats(info.player_id);
                    }
                    else {
                        for (var i = 0; i < info.length && i < 25; i++) { // Displays up to 25 search results
                            fetchPlayerStats(info[i].player_id);
                        }
                    }
                return data;
            }
        });
    }
}

submitBtn.addEventListener("click", displayResults);