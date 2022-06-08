
/**
 * Removes all but a-z A-Z 0-9 _ , : . ? = ! incl. extra whitespace
 * @param str - string
 * @returns - string
 */
export const cleanupForAttr = (str: string) => {
  return removeExtraWhitespace(
	  str.replace(/([^\w,:.\?!\s/\-#*$£]+)/g, '') // remove all but the allowed (negated with ^)
  )
}


/**
 * Replaces linebreaks a extra whitespace with a single whitespace
 */
export function removeExtraWhitespace(str: string) {
	return str.replace(/\s+/g, ' ') // replace one or more \t\v\n\r\f with ' '
		      .trim()
}


/**
 * Removes linebreaks, extra whitespace and double --
 * @param str - string
 * @returns - string
 */
export function cleanupForAttrLight(str: string) {
	return removeExtraWhitespace(str)
		   .replace(/[\-\-]+/g, '-') // replace -- with -
}

//const cleanupSpecialRegEx = new RegExp('@|follow|facebook|instagram|:\/\/|http', 'i') // constructor function: when the regex is an input or could change (here just as reference)
const cleanupSpecialRegEx = /@|#|follow|facebook|instagram|:\/\/|http/i // literal notation: when the regex will remain constant

/**
 * Returns empty string when text contains some special strings.
 * e.g. @, #, follow, facebook, instagram, http
 * @param str - string
 * @returns - string
 */
export function cleanupForAttrSpecial(str: string) {
	// ignore strings containing email addresses and other stuff not describing the image
	if (cleanupSpecialRegEx.test(str)) {
		return ''
	}
	return cleanupForAttrLight(str)
}

/**
 * @param str - string
 * @param suffix - string
 * @returns boolean - boolean
 */
export function endsWith(str: string, suffix: string) {
  return str.slice(-suffix.length) === suffix
}

/**
 * @param str - string
 * @param suffix - string
 * @returns str - string
 */
export function removeFromEnd(str: string, removeStr: string) {
  return endsWith(str, removeStr) ? str.slice(0, removeStr.length * -1) : str
  //return endsWith(str, removeStr) ? str.substr(0, str.length - removeStr.length) : str
}

export function removeTrailingSlash(str: string) {
  return removeFromEnd(str, '/')
}



// Removes one or more trailing "=" (can be 0-2 for base64)
function removeBase64Padding(str: string) {
  return str.replace(/=+$/gm,'');
}

// Removes one or more "=" on both sides of the string
// NOTE: Padding is only added to the end so this is overkill
/*
function removeBase64PaddingV0(str: string) {
  return str.replace(/^=+|=+$/gm,'');
}
*/


export function base64toBase64Url(str: string) {
	return removeBase64Padding(
		// '+' => '-'
		// '/' => '_'
		str.replace(/\+/g, '-').replace(/\//g, '_')
	);
}

/* TODO (but not required so far)
export function base64UrlToBase64(str: string) {
	// 1) '-' => '+'; '_' => '/'
	// 2) add 0-2 "=" at the end
}
*/


/**
 * @param str - utf8
 */
export function toBase64(str: string) {
	return typeof window === 'undefined'
		? Buffer.from(str).toString('base64') // utf8 -> base64
		: window.btoa(str);
}

/**
 * @param str - utf8
 */
export function toBase64Url(str: string) {
	// Buffer.from(str).toString('base64url') needs v15.7.0+, v14.18.0+ and this works in the browse as well
	return base64toBase64Url(
		toBase64(str)
	)
}


/**
 * Splits e.g. '100px' into [100, 'px']
 * @param value - string
 * @param parse - string
 * @returns - [number, 'unit']
 */
export function unitSplit(value: number | string, parse?: boolean): [number | string, string] | null {
	const retArr = value.toString().match(/^([\d]*\.?[\d]+)([^\d]*)$/);
	if (retArr && parse) {
		// returns float or int
		retArr[1] = retArr[1].indexOf('.') >= 0 ? parseFloat(retArr[1]) : parseInt(retArr[1], 10);
	}
	if (retArr && retArr.length === 3) {
		return [retArr[1], retArr[2]]; // ignore input in retArr[0]
	}

	return null;
}

/**
 * @param i - integer
 * @returns - string
 */
export function ordinalSuffix(i: number) {
	const j = i % 10;
	const k = i % 100;
	if (j === 1 && k !== 11) {
		// excl. 111, 211 etc.
		return i + "st";
	}
	if (j === 2 && k !== 12) {
		// excl. 112, 212 etc.
		return i + "nd";
	}
	if (j === 3 && k !== 13) {
		// excl. 113, 213 etc.
		return i + "rd";
	}
	return i + "th";
}

/**
 * @param url - string
 * @returns - string
 */
export function removeUrlParams(url: string) {
	return url.split('?')[0] // removes all query params
}

