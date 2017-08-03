		var items = [];
		var selected;
		var setNum;
		var colNum;
		var rarityNum;
		var item
		var rarity = ["common", "common", "common", "common", "common", "rare", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"];
		
		var itemRarity;
		var itemCollectible;
		var itemSet;
		for (var i = 0; i < 6; i++) {
			setNum = randomInt(0, 4);
			colNum = randomInt(0, 10);
			rarityNum = rarity[Math.floor(Math.random() * rarity.length)];
			switch (rarityNum) {
				case 'common':
					rarityNum = 0;
					break;
				case 'rare':
					rarityNum = 1;
					break;
				default:
					rarityNum = 0;
			}
			//item = "Set Num: "+setNum+", Collectible Num: " + colNum + ", Rarity Num: "+ rarityNum;
			item = setNum.toString() + colNum.toString() + rarityNum.toString();
			items.push(item);
		}
		for (var i = 0; i < items.length; i++) {
			selected = items[i].split("");
			switch (selected[0]) {
				case '0':
					itemSet = "Abstracts";
					break;
				case '1':
					itemSet = "Pixels";
					break
				case '2':
					itemSet = "Emojis";
					break;
				case '3':
					itemSet = "Wolves";
					break;
				default:
					itemSet = "Abstracts";
			}
			switch (selected[1]) {
				case '0':
					itemCollectible = 1;
					break;
				case '1':
					itemCollectible = 2;
					break;
				case '2':
					itemCollectible = 3;
					break;
				case '3':
					itemCollectible = 4;
					break;
				case '4':
					itemCollectible = 5;
					break;
				case '5':
					itemCollectible = 6;
					break;
				case '6':
					itemCollectible = 7;
					break;
				case '7':
					itemCollectible = 8;
					break;
				case '8':
					itemCollectible = 9;
					break;
				case '9':
					itemCollectible = 10;
					break;
			}
			switch (selected[2]) {
				case '0':
					itemRarity = "common";
					break;
				case '1':
					itemRarity = "rare";
					break;
			}
			console.log("Set: "+itemSet+", Collectible #: "+itemCollectible+", Rarity: "+itemRarity);
		}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
};
