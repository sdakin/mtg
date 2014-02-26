// Script for parsing the card list HTML pages from MTG's Gatherer site and
// extracting all card data into a JSON file.
//
// Example command invocations:
//		node cardlist.js '../docs/TherosList.html' 'theros.json'
//		node cardlist.js '../docs/BornOfTheGodsList.html' 'botg.json'

var fs = require('fs');

fs.readFile(process.argv[2], function(err, data) {
	if (err) throw err;
	var lines = data.toString().split("\n"), cards = {};
	lines.forEach(function(line) {
		var cardData = matchLine(line);
		if (cardData) {
			var cardObj = processData(cardData);
			console.log("card: " + cardObj.id + "  " + cardObj.name + "  " + cardObj.color + "  " + cardObj.rarity);
			var id = cardObj.id;
			delete cardObj.id;
			cards[id] = cardObj;

			// var checkPath = "../app/cards/" + cardObj.set + "/" + cardObj.name + ".full.jpg";
			// var stats = fs.stat(checkPath, function(err, stats) {
			// 	if (!stats)
			// 		console.log("no image for card: " + cardObj.name);
			// });
		}
	});

	// output the json data if the script was invoked with an output file param
	if (process.argv.length > 3)
		fs.writeFileSync(process.argv[3], JSON.stringify(cards));
});

function matchLine(line) {
	var result = line.match(/[ ]+<tr class="cardItem">(.*)/);
	if (result && result.length > 1)
		return result[1];
	return null;
}

function processData(data) {
	var result = {};
	var matchResult;

	// extract the id
	matchResult = data.match(/multiverseid=([0-9]+)/);
	if (matchResult && matchResult.length > 1)
		result.id = matchResult[1];

	// extract the name
	matchResult = data.match(/>([^<]+)<\/a>/);
	if (matchResult && matchResult.length > 1)
		result.name = matchResult[1];

	// extract the set
	matchResult = data.match(/"set">([^<]+)<\//);
	if (matchResult && matchResult.length > 1)
		result.set = matchResult[1];

	// extract the color
	matchResult = data.match(/"color">([^<]+)<\//);
	if (matchResult && matchResult.length > 1)
		result.color = matchResult[1];

	// extract the rarity
	matchResult = data.match(/"rarity">([^<]+)<\//);
	if (matchResult && matchResult.length > 1)
		result.rarity = matchResult[1];

	return result;
}
