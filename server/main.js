var express = require('express'), utils = require('./utils');
var app = express();

// app.get('/cardURL/:id', function(req, res) {
//   var body = 'Hello World';
//   res.setHeader('Content-Type', 'text/plain');
//   res.setHeader('Content-Length', Buffer.byteLength(body));
//   res.end(body);
// });

app.get('/hand', function(req, res) {
	// TODO: get this from the DB
	var cardIDs = [373535, 373632, 373512];
	fetchCards(cardIDs, res);
});

app.get("/library", function(req, res) {
	// TODO: get this from the DB
	var cardIDs = [373661, 373712, 373543, 373578, 373590, 373550, 373604, 373671, 373677, 373715, 373740, 373585, 373742, 373506, 373689, 373500, 373631, 373720, 373612, 373627, 373583, 373544, 373638, 373642, 373509, 373659, 373714];
	fetchCards(cardIDs, res);
});

app.get("/battlefield", onGetBattlefield);

app.use(express.static(__dirname + '/../app'));

// read the card data
var cards = {};
var fs = require('fs');
fs.readFile("data/theros.json", function(err, data) {
	var cardData = JSON.parse(data);
	utils.extend(cards, cardData);
});

app.listen(3000);

function getCard(id) {
	var result = null;
	var cardObj = cards[id];
	if (cardObj) {
		result = utils.extend({}, cardObj);
		result.id = id;
	}
	return result;
}

function fetchCards(ids, res) {
	var result = [];
	ids.forEach(function(id) {
		var card = getCard(id);
		if (card)
			result.push(card);
	});
	res.write(JSON.stringify(result));
	res.end();
}

function onGetBattlefield(req, res) {
	var result = { myCards: [], oppCards: [] };
	var ids = [373732, 373554, 373591, 373539];
	var locs = [{top:10,left:10}, {top:10,left:150}, {top:10,left:290}, {top:200,left:10}];
	ids.forEach(function(id) {
		var card = getCard(id);
		if (card) {
			card.pos = locs.shift();
			result.myCards.push(card);
		}
	});
	res.write(JSON.stringify(result));
	res.end();
}
