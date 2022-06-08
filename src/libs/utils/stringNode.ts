//// Additional string utils but meant to only run on the the server

import {removeExtraWhitespace} from "./string";

/**
 * Returns an url-safe string with normalized diacritic characters (éàçèñ -> eacen)
 * normalize() is save to be used by node (check which version but above v14 afaik) but might fail in the browser
 *
 * @param str - string
 * @returns - string
 */
export function getSlug(str: string) {
	return str
		.toLowerCase()
		.replace(/[\s_\-]+/g, '-') // replace spaces etc. and _- with a single '-'
		.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Normalize diacritics characters (éàçèñ -> eacen)
		.replace(/([^\w\-]+)/g, '') // remove all but a-zA-Z0-9_- ("_" is already removed though)
}


/**
 * Removes all except:
 * - \p{L} - all letters from any language (?)
 * - \p{N} - numbers
 * - \p{P} - punctuation -> !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
 * - \p{Z} - whitespace separators
 * - \^\$\+ - add any symbols you want to keep
 *
 * THROWS when file is used on the client even though the function itself is not.
 * => [TypeError: a.clone is not a function] - Has something to do with that \p{?} syntax.
 *
 * @param str - string
 * @returns - string
 */
export function removeEmojisEtc(str: string) {
	return removeExtraWhitespace(
		str.replace(/[^\p{L}\p{N}\p{P}\p{Z}\^\$\+]/gu, '') // remove all but the allowed (negated with ^)
	)
}
