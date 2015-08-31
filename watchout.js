// start slingin' some d3 here.
var settings = {
    height: window.innerHeight,
    width: window.innerWidth,
    nAsteroid: 30,
    rAsteroid: 20,
    rPlayer: 7.5
};

var stats = {
    high_score: 0,
    current_score: 0,
    collisions: 0
};

var player = {
    x: settings.width / 2,
    y: settings.height / 2,
    r: 7.5
};
/*
var enemy = {
    n: 60,
    rEnemy: 7.5
};
*/
var randX = function() {

    return Math.random() * settings.width;

};

var randY = function() {

    return Math.random() * settings.height;

};


//not necessary to wrap the d3 functions in a function but RECOMMENDED
var gameBoard = function() {
    d3.select('body').append('svg:svg')
        .attr('width', settings.width)
        .attr('height', settings.height)
        .attr('class', 'gameBoard')
        .style({
            'position': 'relative',
            'background-color': '#eeeeee'
        });
};

var updateScores = function() {

    stats.current_score++;
    d3.select('.scoreboard .current span').text(stats.current_score.toString());

    if (stats.current_score > stats.high_score) {
        stats.high_score = stats.current_score;
    }

    d3.select('.high span').text(stats.high_score.toString());
};

var createPlayer = function() {

    d3.select('.gameBoard').append('svg:circle')
        .attr('cx', player.x)
        .attr('cy', player.y)
        .attr('r', settings.rPlayer)
        .attr('class', 'player')
        .style({
            'fill': 'orange'
        });
};

var movePlayer = function() {
    d3.select('.gameBoard').on('mousemove', function() {
        var location = d3.mouse(this);
        player.x = location[0];
        player.y = location[1];
        //console.log(player.x, player.y);

        d3.select('.player').attr('cx', player.x)
            .attr('cy', player.y);
    });
};


var createEnemy = function() {

var colors = ["red", "orange", "yellow","green","blue","indigo","violet"];
    d3.select('.gameBoard').append('svg:circle')
        .attr('r', settings.rAsteroid)
        .attr('class', 'asteroids')
        .attr('cx', randX())
        .attr('cy', randY())
        .style({
            'fill': colors[Math.floor(Math.random()*colors.length)]
            // 'position': 'absolute'
        });

        //d3.select('.asteroids').insert('svg:image').attr("xlink:href", "asteroid.png");




};

var asteroidMove = function() {
    return function() {
        d3.selectAll('.asteroids').each(function() {
            d3.select(this).transition().duration(1500)
                .attr('cx', randX())
                .attr('cy', randY());
        });
        d3.timer(asteroidMove(), 1500);
        return true;
    };

};

var collideCheck = function() {

    //kinda working collisions but with bugs 
    // d3.selectAll('.asteroids').each(function() {

    //     d3.select(this).on('mouseenter', function() {
    //         stats.collisions++;
    //         d3.select('.collisions span').text(stats.collisions);
    //     });
    // });

    d3.selectAll('.asteroids').each(function() {
        var enemy = d3.select(this);
        var enemyX = parseFloat(enemy.attr("cx"));
        var enemyY = parseFloat(enemy.attr("cy"));
        var enemyR = parseFloat(enemy.attr("r"));

        var player = d3.select('.player');
        var playerX = parseFloat(player.attr("cx"));
        var playerY = parseFloat(player.attr("cy"));
        var playerR = parseFloat(player.attr("r"));

        var distanceX = enemyX - playerX;
        var distanceY = enemyY - playerY;
        var distance = enemyR + playerR;

        var collided = (Math.sqrt(distanceY * distanceY + distanceX * distanceX) <= distance);
        if (collided) {
            stats.collisions++;
            d3.select('.collisions span').text(stats.collisions);
            stats.current_score = 0;  
        } 
    });
};


var gameLoop = function() {
    return function() {
        collideCheck();
        d3.timer(gameLoop());
        return true; //to escape from function, you return true.
    };
};


var game = function() {
    gameBoard();
    createPlayer();
    movePlayer();
    //setInterval(updateScores, 200);
    d3.timer(updateScores, 100);
    for (var i = 0; i < settings.nAsteroid; i++) {
        createEnemy();
    }
    d3.timer(asteroidMove(), 1500);
    d3.timer(gameLoop());
};


game();

// var asteroids = d3.select('.gameBoard').selectAll('.asteroids').data(d3.range(settings.nAsteroid))
//     .enter()
//     .append('svg:circle')
//     .attr('r', 10)
//     .attr('class', 'asteroids')
//     .attr('cx', randX())
//     .attr('cy', randY())
//     .style({
//         'fill': 'black',
//         'position': 'absolute'
//     })
