// Adds a hidden hyphen for each word longer than the specified lenght.
// To be used with hyphen: manual;
const addHyphens = (sentence, length = 10) => {
	let words = sentence.split(' ');
	words.forEach(function (word, key) {
		let separatedByHyphen = word.split(/-|—|–/);
		separatedByHyphen.forEach(function (value, subkey) {
		let secondPartLength = value.slice(length).length;
		let newLength = length;
		if (value.length > length) {
			// Makes sure there is at least 3 characters on the second line
			if (secondPartLength == 1) {
			newLength = length - 2;
			} else if (secondPartLength == 2) {
			newLength = length - 1;
			}

			// Makes sure we dont split double letters in half (french rule)
			if (word.charAt(newLength - 1) == word.charAt(newLength - 2)) {
			newLength = length - 1;
			} else if (word.charAt(newLength - 2) == word.charAt(newLength - 3)) {
			newLength = length - 2;
			} else if (word.charAt(newLength) == word.charAt(newLength + 1)) {
			newLength = newLength + 1;
			}
			separatedByHyphen[subkey] = value.slice(0, newLength) + "&shy;" + value.slice(newLength);
		}

		});
		words[key] = separatedByHyphen.join("-");
	})
	return words.join(" ");
};

export default addHyphens;
