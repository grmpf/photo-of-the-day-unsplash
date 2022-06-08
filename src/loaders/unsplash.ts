import {stringify} from 'querystring';
import {ImageLoaderProps} from 'next/image';

// BUG?: this is already in the raw url (don't add again):
// ?crop=entropy&cs=tinysrgb&fm=jpg
// &q=80
// TODO: refactor to process and remove above params beforehand
function removeDefaultsBug(str: string) {
	return str.replace('?crop=entropy&cs=tinysrgb&fm=jpg&', '?').replace('&q=80', '')
}

/** Returns an ImageLoader for next/image
 * @param config
 * @param src
 * @param width
 * @param quality
 * @returns Basic ImageLoader required for next/image (keeps ratio; w/o cropping)
 */
export const unsplashLoader = ({config, src, width, quality}: ImageLoaderProps) => {
	src = removeDefaultsBug(src)

	// unsplash params (based on imgix)
	const urlPrep = {
		auto: 'format', // this overwrites "fm" (and might return avif); it is the only parameter that can be combined by reiteration, e.g. auto=compress&auto=enhance&auto=format
		//auto: 'compress',
		sharp: 10, // non-official param from imgix
		fit: 'crop',
		//fm: 'jpg',
		//cs: 'tinysrgb',
		crop: 'faces,entropy,edges,center',
		q: quality || 75,
		w: width,
		//h: ???, // height is not passed to the loader
	}

	return `${src}&${stringify(urlPrep)}`
}

/** Returns an ImageLoader with square images for next/image
 * @param config
 * @param src
 * @param width
 * @param quality
 * @returns Basic ImageLoader required for next/image (square image; w/ cropping)
 */
export const unsplashSquareLoader = ({config, src, width, quality}: ImageLoaderProps) => {
	src = removeDefaultsBug(src)

	// unsplash params (based on imgix)
	const urlPrep = {
		auto: 'format',
		sharp: 10,
		fit: 'crop',
		crop: 'faces,entropy,edges,center',
		q: quality || 75,
		w: width,
		h: width, // height is not passed to the loader
	}

	return `${src}&${stringify(urlPrep)}`
}


/** Returns an ImageLoader for next/image
 *
 *  ### USAGE:
 *  - getUnsplashLoader() for behaviour like next/image (aspect-ratio of the original img; w/o cropping; most likely needs object-fit)
 *  - getUnsplashLoader(4,3) for images with the aspect-ratio of the input width/height or to crop to any ratio required.
 *
 * ### OR DO THIS WHERE REQUIRED
 * const unsplashLoader = useCallback(
 *	 ({ config, src, width, quality}: ImageLoaderProps): string => {
 *		 const urlPrep = {
 *			 auto: 'format',
 *			 sharp: 10, // non-official param from imgix
 *			 fit: 'crop',
 *			 crop: 'faces,entropy,edges,center',
 *			 q: quality || 75,
 *			 w: width,
 *			 ...(ratioWidth && ratioHeight ? {h: Math.trunc(ratioHeight / ratioWidth * width)} : {}),
 *		 }
 *		 return `${src}&${stringify(urlPrep)}`
 *	 },
 *	 [ratioWidth, ratioHeight]
 * )
 *
 * @param ratioWidth - Only used to calculate the ratio (for cropping)
 * @param ratioHeight - Only used to calculate the ratio (for cropping)
 * @returns unsplashLoader - ImageLoader for next/image.
 */
export const getUnsplashLoader = (ratioWidth?: number | undefined, ratioHeight?: number | undefined) => {
	const unsplashLoader = ({config, src, width, quality}: ImageLoaderProps) => {
		src = removeDefaultsBug(src)

		// unsplash params (based on imgix)
		const urlPrep = {
			auto: 'format',
			sharp: 10, // non-official param from imgix
			fit: 'crop',
			crop: 'faces,entropy,edges,center',
			q: quality || 75,
			w: width,
			//h: height, // height is supported by unsplash but is not passed to the loader
			...(ratioWidth && ratioHeight ? {h: Math.ceil(ratioHeight / ratioWidth * width)} : {}), // optional height
		}

		return `${src}&${stringify(urlPrep)}`
	}
	return unsplashLoader
}



