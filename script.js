// YouTube API Key: AIzaSyDW3t-myU9L1Q-P2Mw8SqbKDS2WSdbnMX0

var nameSearch = document.getElementById("name-search");
var nameSearchTeam = document.getElementById("team-search");
var submitBtn = document.getElementById("submit-btn");
var submitBtnTeam = document.getElementById("submit-btn-team");
var playerResults = document.getElementById("player-stats-display");
var teamResults = document.getElementById("team-stats-display");
var playerDropDown = document.getElementById("player-history");
var teamDropDown = document.getElementById("team-history");
var info; // for getting player ID by name
var info2; // for getting player team affiliation, jersey #, etc. by ID
var playerSearchHistory = JSON.parse(localStorage.getItem("playerSearchHistory"));
var teamSearchHistory = JSON.parse(localStorage.getItem("teamSearchHistory"));
if(playerSearchHistory === null) {
    playerSearchHistory = [];
}

if(teamSearchHistory === null){
    teamSearchHistory = [];
}

function youtubesetup() {
    gapi.client.setApiKey("AIzaSyDW3t-myU9L1Q-P2Mw8SqbKDS2WSdbnMX0");
    gapi.client.load("youtube", "v3", function() {
        // console.log("Success!");
    });
}

// Given a player ID, renders information to screen corresponding that the player with that ID.
function fetchPlayerStats(id) {
    var playerCard = document.createElement('section'); // playerCard is border around all player info
    playerCard.setAttribute("class", "card");
    playerCard.setAttribute("style", "margin: 10px 0; width: 90%;");
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
        var teamName = document.createElement('p');
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
        //Adds pitching stats to screen
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
        playerSearchHistory.unshift(nameSearch.value);
        localStorage.setItem("playerSearchHistory", JSON.stringify(playerSearchHistory));
        showSearchHistories();
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

function displayTeamResults() {
    var teamName = nameSearchTeam.value.trim().toLowerCase();
    if (teamName.length > 0) { // This condition sets minimum input length requirement - set it to -1 if you don't care about minimum length.
        teamSearchHistory.unshift(nameSearchTeam.value);
        localStorage.setItem("teamSearchHistory", JSON.stringify(teamSearchHistory));
        showSearchHistories();
        teamResults.innerHTML = ""; // Clears team results
        // Fetches full list of current season's teams
        fetch("https://lookup-service-prod.mlb.com/json/named.team_all_season.bam?sport_code='mlb'&all_star_sw='N'&sort_order=name_asc&season='2021'").then(function(response) {
            return response.json();}).then(function(data) {
            if (data.team_all_season != undefined) {
                infoT = data.team_all_season.queryResults.row;
                for (var i = 0; i < infoT.length; i++) {
                    // Checks if input is part of any possible name for the team
                    if (infoT[i].name_display_full.toLowerCase().includes(teamName) || infoT[i].name_display_long.toLowerCase().includes(teamName) || infoT[i].name_display_short.toLowerCase().includes(teamName) || infoT[i].name_display_brief.toLowerCase().includes(teamName) || infoT[i].mlb_org_abbrev.toLowerCase().includes(teamName)) {
                        var teamCard = document.createElement('section'); // playerCard is border around all player info
                        teamCard.setAttribute("class", "card");
                        teamCard.setAttribute("style", "margin: 10px 0; width: 90%;");
                        // Gets the team's home city and full name, links website if it exists
                        var teamNameDisplay = document.createElement('p');
                        if (infoT[i].base_url != "") {
                            var teamLink = document.createElement('a');
                            teamLink.setAttribute("href", "http://www." + infoT[i].base_url);
                            teamLink.textContent = infoT[i].name_display_full;
                            teamNameDisplay.appendChild(teamLink);
                        }
                        else {
                            teamNameDisplay.textContent = infoT[i].name_display_full;
                        }
                        teamNameDisplay.innerHTML += " | " + infoT[i].city + ", " + infoT[i].state;
                        // Gets the team's phone number, if it exists
                        var teamPhone = document.createElement('p');
                        if (infoT[i].phone_number == "") {
                            teamPhone.textContent = "Phone Number: N/A"
                        }
                        else {
                            teamPhone.textContent = "Phone Number: " + infoT[i].phone_number;
                        }
                        // Gets the team's venue name, if it exists (hint: it probably does)
                        var teamVenue = document.createElement('p');
                        if (infoT[i].venue == "") {
                            teamVenue.textContent = "Venue: N/A"
                        }
                        else {
                            teamVenue.textContent = "Venue: " + infoT[i].venue_name;
                        }
                        teamCard.appendChild(teamNameDisplay);
                        teamCard.appendChild(teamPhone);
                        teamCard.appendChild(teamVenue);
                        teamResults.appendChild(teamCard);
                    }
                }
            }
            return data;
        });
    }
}

submitBtn.addEventListener("click", displayPlayerResults);
submitBtnTeam.addEventListener("click", displayTeamResults);
showSearchHistories();

function showSearchHistories() {
    playerDropDown.innerHTML = "";
    teamDropDown.innerHTML = "";
    var playerDefaultOption = document.createElement("option");
        playerDefaultOption.textContent = "Search History";
        playerDropDown.appendChild(playerDefaultOption);
    var teamDefaultOption = document.createElement("option");
        teamDefaultOption.textContent = "Search History"
        teamDropDown.appendChild(teamDefaultOption);    
    for( var i = 0; i < playerSearchHistory.length; i++) {
        var playerOption = document.createElement("option");
        playerOption.textContent = playerSearchHistory[i];
        playerDropDown.appendChild(playerOption);
    }
    for( var i = 0; i < teamSearchHistory.length; i++) {
        var teamOption = document.createElement("option");
        teamOption.textContent = teamSearchHistory[i];
        teamDropDown.appendChild(teamOption);
    }
}