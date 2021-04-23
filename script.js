var nameSearch = document.getElementById("name-search");
var submitBtn = document.getElementById("submit-btn");
var playerResults = document.getElementById("player-stats-display");
var info; // for getting player ID by name
var info2; // for getting player team affiliation, jersey #, etc. by ID

// Given a player ID, renders information to screen corresponding that the player with that ID.
function fetchPlayerStats(id) {
    var playerCard = document.createElement('section'); // playerCard is border around all player info
    playerCard.setAttribute("class", "card");
    playerCard.setAttribute("style", "margin: 10px 0; width: 50%;");
    var playerBatting = document.createElement('p');
    var playerPitching = document.createElement('p');
    fetch("https://lookup-service-prod.mlb.com/json/named.player_info.bam?sport_code='mlb'&player_id=\'" + id + "\'").then(function(response2) {
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
        var teamName = document.createElement('ol');
        teamName.textContent = "Team: " + info2.team_name + " " + "Position: " + info2.primary_position_txt;
        // Adds batting stats to screen
        fetch("https://lookup-service-prod.mlb.com/json/named.sport_career_hitting.bam?league_list_id='mlb'&game_type='R'&player_id=\'" + id + "\'").then(function(response3) {
        return response3.json();}).then(function(data3) {
                var info3 = data3.sport_career_hitting.queryResults.row;
                if (info3 != undefined) {
                    playerBatting.innerHTML = "<b>Batting Stats</b> - " + info3.hr + " Home Runs, " + info3.rbi + " RBIs, " + info3.avg + " Batting Average"; 
                }
                else {
                    playerBatting.innerHTML = "Batting Stats - None Available";
                }
            return data3;
        });
        fetch("https://lookup-service-prod.mlb.com/json/named.sport_career_pitching.bam?league_list_id='mlb'&game_type='R'&player_id=\'" + id + "\'").then(function(response4) {
            return response4.json();}).then(function(data4) {
                var info4 = data4.sport_career_pitching.queryResults.row;
                if (info4 != undefined) {
                    var tempText = "<b>Pitching Stats</b> - " + info4.era + " ERA, " + info4.so + " Strikeouts, " + info4.era + " ERA"; 
                    playerPitching.innerHTML = tempText;
                }
                else {
                    playerPitching.innerHTML = "Pitching Stats - None Available";
                }
                return data4;
        });
        // Adds player info to screen
        playerCard.appendChild(playerName);
        playerCard.appendChild(teamName);
        playerCard.appendChild(playerBatting);
        playerCard.appendChild(playerPitching);
        return data2;
    });
    playerResults.appendChild(playerCard);
}

function displayPlayerResults() {
    if (nameSearch.value.length > 0) { // This condition sets minimum input length requirement - set it to -1 if you don't care about minimum length.
        playerResults.innerHTML = ""; // Clears player results
        fetch("https://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'&active_sw='Y'&name_part='" + nameSearch.value + "%25'").then(function(response) {
            return response.json();}).then(function(data) {
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

submitBtn.addEventListener("click", displayPlayerResults);