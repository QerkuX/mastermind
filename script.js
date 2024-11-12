const colors = ["firebrick", "seagreen", "dodgerblue", "orange", "yellow", "sienna", "magenta", "gray"];
const rgb = ["rgb(178, 34, 34)", "rgb(46, 139, 87)", "rgb(30, 144, 255)", "rgb(255, 165, 0)", "rgb(255, 255, 0)", "rgb(160, 82, 45)", "rgb(255, 0, 255)", "rgb(128, 128, 128)"];
const buttons = document.getElementsByClassName("button");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const width = 1280;
const height = 720;
var holes;
var guesses;
var square_size;
var horizontal_space;
var veritcal_space;

var square_pos = [];
var selected_color = [];
var current_square = 0;
var check_pos = [];
var current_check = 0;

var selecting_colors = true;
var winning_colors = [];

//Koniec gry
function end(won){
    ctx.reset();
    ctx.font = "100px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (won) ctx.fillText("Wygrales!", width/2, height/2);
    else ctx.fillText("Przegrales!", width/2, height/2);
}

//Cofa wybor koloru
function fix(){
    if (current_square % holes == 0) return;
    current_square -= 1;
    ctx.clearRect(square_pos[current_square][0], square_pos[current_square][1], square_size, square_size);
    ctx.strokeRect(square_pos[current_square][0], square_pos[current_square][1], square_size, square_size);
    selected_color.pop();

}


//Koloruje odpowiedni kwadrat w odpowiednim kolorze
function draw_square(color_index){
    ctx.fillStyle = rgb[color_index];
    ctx.fillRect(square_pos[current_square][0], square_pos[current_square][1], square_size, square_size);
    selected_color.push(color_index)
    current_square += 1;

    if (current_square % holes == 0) check();
}

//Sprawdza poprawnosc linii kolorow
function check(){
    if (selecting_colors){
        reset_variables();
        return;
    }
    console.log(winning_colors);
    var temp_winning_colors = winning_colors.slice(0);;
    var correct_quesses = 0;
    for (var i = 0; i < holes; i++){
        if (selected_color[i] == temp_winning_colors[i]){
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(check_pos[current_check][0], check_pos[current_check][1], square_size, square_size);
            current_check += 1;
            correct_quesses += 1;
            temp_winning_colors[i] = -1;
            continue;
        }
        if (temp_winning_colors.includes(selected_color[i])){
            ctx.fillStyle = "rgb(125, 125, 125)";
            ctx.fillRect(check_pos[current_check][0], check_pos[current_check][1], square_size, square_size);
            current_check += 1;
            console.log(temp_winning_colors);
            temp_winning_colors[temp_winning_colors.indexOf(selected_color[i])] = -1;
            continue;
        }

        current_check += 1;
    }
    
    selected_color = [];
    if (correct_quesses == holes) end(true);
    else if (current_check >= check_pos.length) end(false);
}


//Po wybraniu wygrywajacych kolorow, resetuje zmienne aby gra dzialal
function reset_variables(draw){
    if (!draw) winning_colors = selected_color;
    selecting_colors = false;
    square_pos = [];
    selected_color = [];
    current_square = 0;
    check_pos = [];
    current_check = 0;
    ctx.reset();
    build_board();
}

//Rysuje plansze
function build_board(){
    square_size = (height * 0.8) / (holes * 2);
    horizontal_space = ((width - (square_size * holes*2)) / (holes*2 + 1));
    veritcal_space = ((height - (square_size * guesses)) / (guesses + 1));
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    x = horizontal_space;
    y = veritcal_space;
    for (let i = 0; i < guesses; i++){
        for (let j = 0; j < holes; j++){
            ctx.strokeRect(x, y, square_size, square_size);
            square_pos.push([Math.floor(x), Math.floor(y)]);
            x += horizontal_space + square_size;
        }

        for (let j = 0; j < holes; j++){
            ctx.strokeRect(x, y, square_size, square_size);
            check_pos.push([Math.floor(x), Math.floor(y)]);
            x += horizontal_space + square_size;
        }

        y += veritcal_space + square_size;
        x = horizontal_space;
    }
}

//Losuje wygrywajace kolory
function draw(){
    winning_colors = [];
    for (var i = 0; i < holes; i++){
        winning_colors.push(Math.floor(Math.random() * 8));
    }
    reset_variables(draw);
}


//Rozpoczyna gre po wybraniu rozmiaru
function start_game(){
    ctx.lineWidth = 5;
    guesses = parseInt(document.getElementById("guesses").value);
    holes = parseInt(document.getElementById("holes").value);
    if (holes < 1) holes = 1;
    if (guesses < 1) guesses = 1;
    square_size = (height * 0.8) / (holes);
    horizontal_space = ((width - (square_size * holes)) / (holes + 1));
    document.getElementById("setup").style.display = "none";
    document.getElementById("draw").style.display = "block";
    canvas.style.display = "block";

    x = horizontal_space;
    y = (height/2)-(square_size/2)
    for (let i = 0; i < holes; i++){
        ctx.strokeRect(x, y, square_size, square_size);
        square_pos.push([Math.floor(x), Math.floor(y)]);
        x += horizontal_space + square_size;
    }

    ctx.font = "50px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillText("Mozesz kliknac przycisk \"wylosuj\" w prawym dolnym rogu!", width/2, height-10);
}

//Przygotowuje przyciski
function setup(){
    for (let i = 0; i < 8; i++){
        buttons[i].style.background = colors[i];
        buttons[i].addEventListener("click", draw_square.bind(this, i));
    }
}

setup();