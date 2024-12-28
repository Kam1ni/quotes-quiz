const fs = require("fs");

function addNewMentions(quote, mentions){
	for (let mention of quote.mentions) {
		let found = false;
		for (let m of mentions) {
			if (m.id == mention.id){
				found =true;
				break;
			}
		}
		if (found) continue;
		mentions.push({
			id:mention.id,
			value:mention.global_name
		});
	}
}

function main(){
	let fileInput = process.argv[process.argv.length-1];
	let quotes = require(fileInput);

	let result = {
		quotes:[],
		answers:[]
	}
	for (let quote of quotes) {
		if (quote.attachments.length > 0) continue;
		if (quote.mentions.length == 0) continue;
		addNewMentions(quote, result.answers)
		let item = {
			id:quote.id,
			author: quote.global_name,
			content: quote.content,
			timestamp:quote.timestamp
		}
		result.quotes.push(item);
	}

	fs.writeFileSync("output.json", JSON.stringify(result));
}

main();