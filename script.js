const symbols = ["Heart", "Diamond", "Spade", "Club"];
const points = [1,2,3,4,5,6,7,8,9,10,10,10,10]
const value = ["Es", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];

let deck = [];
let dealerHand = [];
let playerHand = [];
let dealerPoint = 0;
let playerPoint = 0;

class Card
{
    constructor(symbol,value,point)
    {
        this.symbol = symbol;
        this.value = value;
        this.point = point;
        this.path = "Pictures/Cards/" + symbol + value + ".png";
    }
}
// Create Card and put them in deck
function CreateDeck()
{
    for(let i = 0; i < symbols.length; i++){
        for(let j = 0; j < value.length; j++)
            deck.push(new Card(symbols[i], value[j], points[j]));
    }
}
// Take a card in deck and shift place with a random card in deck
function ShuffleDeck()
{
    CreateDeck();
    for(let i = 0; i < deck.length; i++){
        let safe = deck[i];
        let temp = Math.floor(Math.random() * deck.length);
        deck[i] = deck[temp];
        deck[temp] = safe;
    }
}
// Add card to parameter/hand and return Card
function AddCardToHand(array)
{
    if(Array.isArray(array)){
        const drawedCard = deck.shift();
        array.push(drawedCard);
        return drawedCard;
    }
}
// Take hand and pluses point and if there is a es and total point is under 12 it will plus 10
function PointResult(array)
{
    let points = 0;
    if(Array.isArray(array) && array.length > 0){
        array.forEach(x => {points += x.point});
        array.forEach(x => {
            if(x.point == 1 && points <= 11){
                points += 10
            }
        });
        return points;
    }
    else
        return points;
}
// Show card in html
function PrintCard(path, target , id)
{
    let cardImage = document.createElement("img");
    cardImage.classList.add("card");
    cardImage.id = id;
    cardImage.setAttribute("src", path);
    document.getElementById(target).appendChild(cardImage);
}
// Flip cardBack
function HideDealerBack()
{
    const back = document.getElementById("hiddenBack");
    back.classList.toggle("flipped"); 
}
// Flip cardFront
function ShowDealerFront()
{
    const front = document.getElementById("hiddenFront");
    front.classList.toggle("flipped");
}
// Find hidden dealer card and set class and id
function FindDealerFrontCard()
{
    let foundHiddenCard = dealerHand[1];
    let img = document.getElementById("hiddenBack");
    img.setAttribute("src", foundHiddenCard.path);
    img.classList.add("cardFront");
    img.id = "hiddenFront";
}
// Flip cardBack to cardFront
function ShowDealerHiddenCard()
{
    const firstFlip = new Promise(function(){
        HideDealerBack();
    });
    firstFlip.then(setTimeout(() => FindDealerFrontCard(), 200)).then(setTimeout(() => ShowDealerFront(), 200));
}
// Add 2 Card to dealerHand and print first card as front, second as back and print first card point and set all point for dealer 
function PrintDealerStartHand()
{
    AddCardToHand(dealerHand);
    AddCardToHand(dealerHand);
    for(i = 0; i < dealerHand.length; i++){
        let foundCard = dealerHand[i];     
        if(i == 1){
            let img = document.createElement("img");
            img.setAttribute("src", "Pictures/Cards/back@2x.png");
            img.classList.add("cardBack");
            img.id = "hiddenBack";
            document.getElementById("dealerHand").appendChild(img);
            dealerPoint = PointResult(dealerHand);
        }
        else{                    
            document.getElementById("dealerInfo").innerHTML = "Dealer points: " + foundCard.point;
            PrintCard(foundCard.path, "dealerHand");
        }  
    }   
}
// Dealer draws cards until points is over playerPoints or 21 points
function DealerAutoDrawCard()
{
    ShowDealerHiddenCard();
    if(playerPoint < 22){
        while(playerPoint > dealerPoint){
            let foundCard = AddCardToHand(dealerHand);
            dealerPoint = PointResult(dealerHand);
            PrintCard(foundCard.path, "dealerHand");
        }
    }
    document.getElementById("dealerInfo").innerHTML = "Dealer points: " + dealerPoint;  
    GameEnd();
}
// Draw card for player and print it
function PrintDrawedCardPlayer()
{
    if(playerPoint < 22){
        let foundCard = AddCardToHand(playerHand);
        PrintCard(foundCard.path, "playerHand");
        playerPoint = PointResult(playerHand);
        document.getElementById("playerInfo").innerHTML = "Player points: " + playerPoint;
        if(playerPoint == 21)
            DealerAutoDrawCard();
        if(playerPoint > 21){
            document.getElementById("dealerInfo").innerHTML = "Dealer points: " + dealerPoint;
            ShowDealerHiddenCard();
            GameEnd();
        }
    }
}
// Remove draw and stay button and print result of game and shows a new game button.
function GameEnd()
{
    document.getElementById("btnDraw").remove();
    document.getElementById("btnStay").remove();
    document.getElementById("resultFrom").style.visibility = "visible";
    if(dealerPoint > 21 && playerPoint < 22)
        document.getElementById("result").innerHTML = "Player Wins";
    else if(playerPoint > 21 | (dealerPoint < 22 && playerPoint < dealerPoint))
        document.getElementById("result").innerHTML = "Dealer Wins";
    else
        document.getElementById("result").innerHTML = "Tie";
}
// Reload page
function StartNewGame(){
    location.reload();
}
// prints start game
function NewGame()
{
    ShuffleDeck();
    PrintDealerStartHand();
    PrintDrawedCardPlayer();
    PrintDrawedCardPlayer();  
}
NewGame();

