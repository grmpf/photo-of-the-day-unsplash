// Not to be confused with an ImageLoader (see ../loaders/unsplash.ts)

import {stringify} from "querystring";
import {base64toBase64Url, toBase64Url} from "./utils/string";

// BUG?: this is already in the raw url (and shouldn't be added twice):
// ?crop=entropy&cs=tinysrgb&fm=jpg
// &q=80
// and &raw_url=true (looks like some internal value from unsplash)
// TODO: refactor to process and remove above params beforehand
// UPDATE: they just fixed(?) the issue with those hardcoded params (appearing in the urls from the Unsplash API).
// before:      https://images.unsplash.com/photo-1649895618216-7b7cefbb7d96?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMTY2MjJ8MHwxfGNvbGxlY3Rpb258MjZ8MTQ1OTk2MXx8fHx8Mnx8MTY1MzYyMjY2Mw&ixlib=rb-1.2.1&raw_url=true&q=80&fit=crop&crop=faces%2Centropy%2Cedges%2Ccenter&fm=jpg&q=80&w=1200&h=899
// fixed again: https://images.unsplash.com/photo-1649895618216-7b7cefbb7d96?ixid=MnwzMTY2MjJ8MHwxfGNvbGxlY3Rpb258Mjd8MTQ1OTk2MXx8fHx8Mnx8MTY1MzcwNjcxMg&ixlib=rb-1.2.1&fit=crop&crop=faces%2Centropy%2Cedges%2Ccenter&fm=jpg&q=80&w=1200&h=899
function removeDefaultsBug(str: string) {
	return str.replace('?crop=entropy&cs=tinysrgb&fm=jpg&', '?').replace('&q=80', '')
}

/**
 * @param src - Raw url string
 * @param width - Thumbnail width
 * @param height - Thumbnail height
 * @param quality - Thumbnail quality
 * @returns Url which can be used as blurred placeholder (blurDataURL).
 */
const getCustomPath = (src: string, width: number = 32, height?: number, quality?: number, options?: {}) => {
	src = removeDefaultsBug(src)

	const urlPrep = {
		//auto: 'format', // this overwrites "fm" (and might return avif)
		//auto: 'compress',
		//fit: 'max', // default for thumb
		fit: 'crop', // same as the default loader
		//crop: 'entropy', // default for thumb
		crop: 'faces,entropy,edges,center', // same as the default loader (important when fit:crop)
		//cs: 'tinysrgb', // default for thumb
		fm: 'jpg', // default for thumb
		//fm: 'png', // as a bug? you can overwrite it once with png but nothing else (don't)
		q: quality ? quality : 75,
		w: width,
		...(height ? {h: height} : {}), // optional height
		//blur:50, // 0 – 2000 (non-official param from imgix; not really required bc it will be blurred again by next.js)

		...options,
	}
	return `${src}&${stringify(urlPrep)}`
}

/**
 * @param src - Raw url string
 * @param width - Thumbnail width
 * @param height - Thumbnail height
 * @param quality - Thumbnail quality
 * @returns Url which can be used as blurred placeholder (blurDataURL).
 *
 * @TODO: Not sure (yet) how well this works with pre-loading (bc it's not a DataUri, so in theory it's possible the thumb returns later).
 */
const getCustomThumbPath = (src: string, width: number = 32, height?: number, quality?: number) => {
	return getCustomPath(src, width, height, quality || 1)
}

/**
 * @param src - Raw url string
 * @param size - Thumbnail width/height
 * @returns Url which can be used as blurred placeholder (blurDataURL).
 */
const getCustomThumbSquarePath = (src: string, size: number = 32, quality?: number) => {
	return getCustomThumbPath(src, size, size, quality || 1)
}












/** getFacebookOpenGraphPath + getTwitterCardPath
 *
 * NOTES:
 * - ~~Generating complex sharing-images on the fly is fun and all but the length of the urls is concerning.~~
 *   NVM: The urls are currently "only" about 900 characters long in base64. <2000 should work in all browsers. Even though e.g. 11747 characters for a base64 dataUrls works in Chrome, I would not recommend it for anything the client/3rd-party is depending on.
 * - It's possible to send url-encoded and/or base64 strings (examples below + https://docs.imgix.com/apis/rendering#base64-variants)
 * - https://assets.imgix.net/~text is a special endpoint that returns an image which can be used as overlay
 * - Alternative: Using https://resoc.io/
 *   - Requires e.g. a separate api to create/return/cache/cleanup images; or on build...
 *   - Allows using the very same css with only minimal adaptions (the image will behave like
 * - Unsplash needs padding "=" signs removed from all base64 strings (some escaping issues i guess)
 *
 * TODO:
 * - Fully test Resoc for this scenario
 */



// TODO: make this dynamic (remember to remove padding "="; probably as base64url)
const base64Logo = 'aHR0cHM6Ly9zYW5kYm94LXVwbG9hZHMuaW1naXgubmV0L3UvMTY1MjE5MjY1Ni1hODRlNTgzYTJiYjMyYTYxMDIxZTFjOTVkY2Y0NDI0MD93PTE2MA'; // public/assets/img/logo-opengraph.png

// Values based on OpenGraph (also used to calc the values for twitter via ogTwitterRatio)
const ogTwitterRatio = 1500 / 1200
const imgPadding = 60
const markWidth = 64
const txtSize = 50
const txtDateSize = txtSize
const txtShadow = 9.5
const txtTop = imgPadding + 14 // aligns text with the mask

// Shared values
const txtColor = 'fff'
const font = 'Avenir Next,Bold' // check the imgix api for possible values
const font64 = toBase64Url(font);

const getFacebookOpenGraphPath = (src: string, text?: string, date?: string) => {
	const w = 1200 // ≈ 1.91:1 -> OpenGraph + Facebook
	const h = 630

	const mark = {
		//'mark' : `${process.env.NEXT_PUBLIC_HOST}/assets/img/logo-opengraph.png`,
		'mark64': base64Logo,
		'mark-align': 'top,left',
		'mark-pad': imgPadding,
		'mark-w': markWidth,
	}

	const blendPrep = {
		w: w,
		...(h ? {h: h} : {}), // optional height
		'txt-color': txtColor,
		'txt-size': txtSize,
		'txt-pad': imgPadding, //'txt-x': imgPadding,
		//'txt-font': 'avenir-black',
		//'txt-font': font,
		'txt-font64': font64,
		'txt-align': 'bottom,left',
		'txt-fit': 'max',
		'txt-shad': txtShadow,
		...(text ? {txt: text} : {}), // optional height

		'bg': '30000000', // color: first one/two characters are for the opacity: ARGB/AARRGGBB; RGB/RRGGBB is also possible)
	}
	const blendTmp = `https://assets.imgix.net/~text?${stringify(blendPrep).replace(/~/g, '%0A')}`
	const blend64 = toBase64Url(blendTmp);

	const blend = {
		'blend-mode': 'normal',
		//'blend': `https://assets.imgix.net/~text?${stringify(blendPrep)}`,
		//'blend': blendTmp,
		'blend64': blend64,
	}

	let txt = {}
	if (date) {
		const txt64 = toBase64Url(date);
		txt = {
			'txt-color': txtColor,
			'txt-size': txtDateSize,
			'txt-pad': imgPadding,
			//'txt-font': 'avenir-black',
			//'txt-font': font,
			'txt-font64': font64,
			'txt-align': 'top,right',
			'txt-fit': 'max',
			'txt-shad': txtShadow,
			'txt-y': txtTop,
			//txt: date,
			txt64: txt64,
		}
	}

	const options = {
		...mark,
		...(text && blend ? blend : {}),
		...txt,

		//auto: 'enhance', // not doing that after all
	}

	return getCustomPath(src, w, h, 60, options)
}

const getTwitterCardPath = (src: string, text?: string, date?: string) => {
	const w = 1500 // = 2:1 -> Twitter
	const h = 750


	const mark = {
		//'mark' : `${process.env.NEXT_PUBLIC_HOST}/assets/img/logo-opengraph.png`,
		'mark64': base64Logo,
		'mark-align': 'top,left',
		'mark-pad': Math.trunc(ogTwitterRatio * imgPadding),
		'mark-w': Math.trunc(ogTwitterRatio * markWidth),
	}

	const blendPrep = {
		w: w,
		...(h ? {h: h} : {}), // optional height
		'txt-color': txtColor,
		'txt-size': Math.trunc(ogTwitterRatio * txtSize),
		'txt-pad': Math.trunc(ogTwitterRatio * imgPadding), //'txt-x': Math.trunc(ogTwitterRatio * imgPadding),
		//'txt-font': 'avenir-black',
		//'txt-font': font,
		'txt-font64': font64,
		'txt-align': 'bottom,left',
		'txt-fit': 'max',
		'txt-shad': txtShadow,
		...(text ? {txt: text} : {}), // optional height

		'bg': '30000000', // color: first one/two characters are for the opacity: ARGB/AARRGGBB; RGB/RRGGBB is also possible)
	}
	const blendTmp = `https://assets.imgix.net/~text?${stringify(blendPrep).replace(/~/g, '%0A')}`
	const blend64 = toBase64Url(blendTmp);

	const blend = {
		'blend-mode': 'normal',
		//'blend': `https://assets.imgix.net/~text?${stringify(blendPrep)}`,
		//'blend': blendTmp,
		'blend64': blend64,
	}

	let txt = {}
	if (date) {
		const txt64 = toBase64Url(date);
		txt = {
			'txt-color': txtColor,
			'txt-size': Math.trunc(ogTwitterRatio * txtDateSize),
			'txt-pad': Math.trunc(ogTwitterRatio * imgPadding),
			//'txt-font': 'avenir-black',
			//'txt-font': font,
			'txt-font64': font64,
			'txt-align': 'top,right',
			'txt-fit': 'max',
			'txt-shad': txtShadow,
			'txt-y': Math.ceil(ogTwitterRatio * txtTop),
			//txt: date,
			txt64: txt64,
		}
	}

	const options = {
		...mark,
		...(text && blend ? blend : {}),
		...txt,

		//auto: 'enhance', // not doing that after all
	}

	return getCustomPath(src, w, h, 60, options)
}

export {
	getCustomPath, getCustomThumbPath, getCustomThumbSquarePath,
	getFacebookOpenGraphPath, getTwitterCardPath
}
