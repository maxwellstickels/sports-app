var nameSearch = document.getElementById("name-search");
var submitBtn = document.getElementById("submit-btn");
var info;
var info2;

function displayResults() {
    fetch("http://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'&active_sw='Y'&name_part='" + nameSearch.value + "%25'").then(function(response) { return response.json();}).then(function(data) {
        if (data.search_player_all.queryResults.totalSize != "0") {
                info = data.search_player_all.queryResults.row;
                for (var i = 0; i < info.length; i++) {
                    var nickName = " \"";
                    if (info[i].name_nick === "") {
                        nickName = " ";
                    }
                    else {
                        nickName += info[i].name_nick + "\" ";
                    }
                    
                    var jerseyNum = info[i].jersey_number;
                    if (jerseyNum) {
                        jerseyNum += "00";
                    }
                    console.log("#" + jerseyNum + ": " + info[i].name_first + nickName + info[i].name_last);
                }
            return data;
        }
    });
}

submitBtn.addEventListener("click", displayResults);