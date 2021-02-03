/**
 * Feb 2021: necessary for Samsung Browser and SeaMonkey
 * 
 * String.prototype.replaceAll() polyfill
 * https://vanillajstoolkit.com/polyfills/stringreplaceall/
 */
if (!String.prototype.replaceAll) {
	String.prototype.replaceAll = function(str, newStr){

		// If a regex pattern
		if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
			return this.replace(str, newStr);
		}

		// If a string
		return this.replace(new RegExp(str, 'g'), newStr);

	};
}