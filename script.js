
fetch("https://www.balldontlie.io/api/v1/games/").then(function(response) { 
    console.log(response.status);
    return response.json();
    }).then(function(data) {
    console.log(data);

    return data;
});