var nameSearch = document.getElementById("name-search");
var submitBtn = document.getElementById("submit-btn");
var playerResults = document.getElementById("player-stats-display");
var info;
var info2;

function displayResults() {
    if (nameSearch.value.length > 2) {
        playerResults.innerHTML = "";
        fetch("https://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'&active_sw='Y'&name_part='" + nameSearch.value + "%25'").then(function(response) { return response.json();}).then(function(data) {
            if (data.search_player_all.queryResults.totalSize != "0") {
                    info = data.search_player_all.queryResults.row;
                    for (var i = 0; i < info.length; i++) {
                        fetch("https://lookup-service-prod.mlb.com/json/named.player_info.bam?sport_code='mlb'&player_id='" + info[i].player_id + "'").then(function(response2) {
                            return response2.json();}).then(function(data2) {
                            info2 = data2.player_info.queryResults.row;
                            var nickName = " \"";
                            if (info2.name_nick === "") {
                                nickName = " ";
                            }
                            else {
                                nickName += info2.name_nick + "\" ";
                            }
                            var jerseyNum = info2.jersey_number;
                            if (jerseyNum.length === 0) {
                                jerseyNum += "00";
                            }
                            if (info2.twitter_id == "") {
                                var playerName = document.createElement('p');
                                playerName.textContent = "#" + jerseyNum + ": " + info2.name_first + nickName + info2.name_last;
                                playerResults.appendChild(playerName);
                            }
                            else {
                                var playerName = document.createElement('p');
                                var playerLink = document.createElement('a');
                                playerLink.setAttribute("href", "https://twitter.com/" + info2.twitter_id);
                                playerLink.textContent = "#" + jerseyNum + ": " + info2.name_first + nickName + info2.name_last;
                                playerName.appendChild(playerLink);
                                playerResults.appendChild(playerName);

                            }
                            return data2;
                        });
                    }
                return data;
            }
        });
    }
}

submitBtn.addEventListener("click", displayResults);