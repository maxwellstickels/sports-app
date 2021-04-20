var nameSearch = document.getElementById("name-search");
var submitBtn = document.getElementById("submit-btn");
var info;
var info2;

function displayResults() {
    fetch("https://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'&active_sw='Y'&name_part='" + nameSearch.value + "%25'").then(function(response) { return response.json();}).then(function(data) {
        if (data.search_player_all.queryResults.totalSize != "0") {
                info = data.search_player_all.queryResults.row;
                for (var i = 0; i < info.length; i++) {
                    fetch("https://lookup-service-prod.mlb.com/json/named.player_info.bam?sport_code='mlb'&player_id='" + info[i].player_id + "'").then(function(response2) {
                        return response2.json();}).then(function(data2) {
                        console.log(data2.player_info.queryResults.row);
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
                        console.log("#" + jerseyNum + ": " + info2.name_first + nickName + info2.name_last);
                        return data2;
                    });
                }
            return data;
        }
    });
}

submitBtn.addEventListener("click", displayResults);