/** WORK IN PROGRESS - I've got some unfinished business with next/image
 * GOAL:
 * - Find solution(s) to the unsolved next/image mystery/misery/problem(s) - at least showcase some a) dreamworld implementations (see official examples) and one or more workarounds to make it work in realworld (layout="raw" to the rescue?).
 * - Each way next/image could be used should become it's own component (with somewhat distinctive names) with mandatory params to always get expected results.
 *
 * TODO:
 * - Finish testing and refactor afterwards
 *
 * WARNINGS:
 * - All style overwrites can potentially cause CLS (Cumulative Layout Shift) AND might break at any time in the future.
 *
 * NOTES:
 * - Based on the official docs, some required/recommended parameters including their meaning change based on the layout and/or in combination with other params.
 *   It's basically an extra hard text-quiz where you have to read through, make notes and because it's sometimes contradictory, do some testing.
 * - The 'sizes' param is quite important and needs to be set manually approx. 98% of the time.
 *   To have a precise result, imageSizes and/or deviceSizes should match the requested images.
 *   imageSizes and/or deviceSizes can also be adjusted to keep costs down for generating all those image versions.
 *   TODO: needs some more calculations. And for a non+ultra version: a default layout config for columns/paddings/gaps.
 *
 * OPTIONS:
 * - External images can be loaded directly when using 'loader' (if the external server can handle at least the 'width' param) OR by next.js (when domain is allowed in next.js config)
 *   The 'loader' should be the better option (less overhead; might be cached; should be faster, can handle 'height' param, might lower the costs). AFAIK next.js won't optimize images beforehand.
 * - An image url can sometime be used as 'blurDataURL'
 *   Unsplash provides a thumbnail (which is 200px wide and might be cached) where a custom 30x20px img would be smaller but has to be generated first.
 *   Pros(nice effect) / cons(extra requests/data/and maybe most costs) - have to be considered on a case by case basis.
 *   P.S.: When base64 are generated in getStaticProps this could become useful
 * - For image cropping to a requested width/height (e.g. you need a undistorted square image from a non-square image source) you NEED an api for that (next.js will just distort your images).
 *   next/image has no cropping ability yet so the 'height' is mostly ignored (and not even passed to the ImageLoader).
 *   With a custom loader and e.g. the unsplash api, cropping to the requested size is possible.
 *
 * OPEN ISSUES:
 * - unknown external image size (maybe use "probe" in getStaticProps to get the image size when required and without fully downloading the image)
 *
 * HOW-TO / FYI:
 * - Currently className's are based on tailwind classes (could be other classes or styles instead)
 * - Currently the params 'wrapperClassName' and 'className' can have defaults which allow easy overwrites but have to be passed again when you want to extend them.
 */

/* *** EXTRA NOTE FROM next.js - AKA the text-quiz ***

// Width property
// Can represent either the rendered width or original width in pixels, depending on the layout and sizes properties.
// - When using layout="intrinsic", layout="fixed", or layout="raw" WITHOUT sizes, the width property represents the rendered width in pixels, so it will affect how large the image appears.
// - When using layout="responsive", layout="fill", or layout="raw" WITH sizes, the width property represents the original width in pixels, so it will only affect the aspect ratio.
// Required - except for statically imported images, or those with layout="fill".

// layout: intrinsic, fixed, raw
// width/height - can represent either the rendered width or original width in pixels, depending on the layout and sizes properties.
// - WITH 'sizes': ???
// - WITHOUT 'sizes': the width/height properties represent the *rendered* width/height in pixels, so it will affect how large the image appears.
// - Required, except for statically imported images, or those with layout="fill".

//// layout: responsive, fill, raw
// - width/height (semi-optional? i guess) - can represent either the rendered width or original width in pixels, depending on the layout and sizes properties.
// - WITH 'sizes': the width/height properties represent the *original* width/height in pixels, so it will only affect the aspect ratio.
// - WITHOUT 'sizes': ???

//// layout: intrinsic
// - "should" be similar to <img> (with 'max-with:100%;') by the meaning of the word but only works similar regarding scaling only down to fit the width of the container (no zooming)
// - sets 'srcSet': 1x, 2x (based on imageSizes)
// - PARAMS
// -- sizes: no effect (?)

//// layout: fixed (ONLY useless for tiny images w/o down-scaling) - similar to <img> (with width=?? height=??; w/o max-widht:100%)
// - with/height will be used without scaling up or down
// - sets 'srcSet': 1x, 2x (based on imageSizes)
// - PARAMS
// -- sizes: no effect (?)

//// layout: responsive
// - the parent element must have display:block
// - sets 'srcSet': 640w, 750w, ... 2048w, 3840w (based on imageSizes and deviceSizes)
// - PARAMS
// -- sizes: default: 100vw

//// layout: fill
// - the parent element must have position:relative
// - sets 'srcSet': 640w, 750w, ... 2048w, 3840w (based on imageSizes and deviceSizes)
// - PARAMS
// -- sizes: default: 100vw

//// layout: raw
// - Still adds some aspect-ratio styles but no wrapper div/span etc.
// - blur/lazy not tested yet
// - sets 'srcSet': Behaves like 'responsive' if the image has the sizes prop, and like fixed if it does not
// - will not set width/height on <img> if sizes property is used
// - PARAMS
// -- sizes: optional (whatever that means)
*/

import Image from "next/image";
import {ImageProps} from "next/dist/client/image";
import {getRatioPadding} from "./images";


declare type PropsDefaultType = {
	// from ImageProps
	width: number | string; // make it REQUIRED
	height: number | string; // make it REQUIRED

	// from <img> (via ImageProps)
	sizes: string; // make it REQUIRED (the IDE does not pick that up the whole way though)

	// custom extras to handle things
	children?: {}; // for captions, overlays etc. // todo: set proper type (PropsWithChildren? ReactChild | ReactChildren?)
	wrapperClassName?: string;
} & ImageProps;


/** APPROVED
 *
 * Behaviour:
 * - This component NEEDS a with/height to calculate and handle the aspect-ratio. This is non-default for next layout=fill.
 * - Without "sizes" 100vw is used by default
 * - Requires position:relative on parent (actually just non 'static')
 *
 * @returns - next/image wrapped in a div
 */
export function ImageFill({children, width, height, wrapperClassName = 'relative', className, ...rest}: PropsDefaultType) {
	if (!(width && height)) { throw new Error("width/height is are required arguments"); }
	//if (!rest.sizes) { throw new Error("sizes is a required argument"); } // 100vw by default

	// nimg* helper classes (not used by the component)
	const defWrapCls = 'nimg-wrap nimg-fill-wrap'
	const defImgCls = 'nimg nimg-fill'

	//const ratio = useMemo(() => { // should ne be required
	//	return getRatioPadding(width, height)
	//},[width, height])
	const ratio = getRatioPadding(width, height)

	return (
		<div className={`${defWrapCls} ${wrapperClassName ? wrapperClassName : ''}`}
			 style={{ paddingBottom: `${ratio}%` }}
		>
			<Image
				className={`${defImgCls} ${className ? className : ''}`} //appending
				{...rest} // should not contain: width, height, className
				layout="fill"
			/>
			{children && children}
		</div>
	);
}















/** TO BE TESTED FURTHER
 *
 * Behaviour:
 * - ...
 *
 * @returns - next/image wrapped in a div
 */
export function ImageIntrinsic({children, wrapperClassName, className, ...rest}: PropsDefaultType) {
	if (!(rest.width && rest.height)) { throw new Error("width/height is are required arguments"); }
	//if (!rest.sizes) { throw new Error("sizes is a required argument") };

	// nimg* helper classes (not used by the component)
	const defWrapCls = 'nimg-wrap nimg-intr-wrap      children:!blockOFF   block relative max-h-full max-w-full children:max-h-full children:max-w-full'
	const defImgCls = 'nimg nimg-intr '

	return (
		<div className={`${defWrapCls} ${wrapperClassName ? wrapperClassName : ''}`}
			//style={{ paddingBottom: `${ratio}%` }}
		>
			<Image
				className={`${defImgCls} ${className ? className : ''}`} //appending
				{...rest} // should not contain className anymore
				layout="intrinsic"
			/>
			{children && children}
		</div>
	);
}


/** TO BE TESTED FURTHER
 *
 * Behaviour:
 * - Can be used as a background or in a container with a defined width/height (when parent position:relative)
 * - 'sizes' should be '100vw' by default (needs verification; but setting it might be more "secure" or just the opposite regarding future updates...)
 *
 * @returns - next/image wrapped in a div
 */
export function ImageFillBg({className, sizes = '100vw', ...rest}: ImageProps) {
	// nimg* helper classes (not used by the component)
	const defImgCls = 'nimg nimg-fillbg'

	return (
		<Image
			className={`${defImgCls} ${className ? className : ''}`} //appending

			/* maybe needs some more testing if this is somehow required in the loader or not
			width={width} // I GUESS with FILL this is ignored...??? But what about the loader...?
			height={height} //not passed to the loaderFnc - need to workaround this
			*/
			sizes={sizes}
			{...rest} // should not contain className anymore
			layout="fill"
		/>
	);
}


/** TO BE TESTED FURTHER
 *
 * Behaviour:
 * - Can be used as a background or in a container with a defined width/height (when parent position:relative)
 * - 'sizes' should be '100vw' by default (needs verification; but setting it might be more "secure" or just the opposite regarding future updates...)
 * - Requires display:block on parent (actually anything block-ish aka non-inline-ish)
 *
 * @returns - next/image wrapped in a div
 */
export function ImageResponsive({children, wrapperClassName, className, ...rest}: PropsDefaultType) {
	if (!(rest.width && rest.height)) { throw new Error("width/height is are required arguments"); }
	//if (!rest.sizes) { throw new Error("sizes is a required argument"); }

	// nimg* helper classes (not used by the component)
	const defWrapCls = 'nimg-wrap nimg-resp-wrap     block relative'
	const defImgCls = 'nimg nimg-resp'

	const ratio = getRatioPadding(rest.width, rest.height)

	return (
		<div className={`${defWrapCls} ${wrapperClassName ? wrapperClassName : ''}`}
			//style={{ paddingBottom: `${ratio}%` }}
		>
			<Image
				className={`${defImgCls} ${className ? className : ''}`} //appending
				{...rest} // should not contain className anymore
				layout="responsive"
			/>
			{children && children}
		</div>
	);
}


/** TO BE TESTED FURTHER
 *
 * Behaviour:
 * - Could be used for everything but styles have to be handled by yourself.
 * - 'sizes' should be '100vw' by default (needs verification; but setting it might be more "secure" or just the opposite regarding future updates...)
 * - Requires display:block on parent (actually anything block-ish aka non-inline-ish)
 *
 * NOTE: This is an experimental feature (needs to be enabled in next.config.js)
 *
 * @returns - next/image wrapped in a div
 * @see https://nextjs.org/docs/api-reference/next/image#experimental-raw-layout-mode
 */
export function ImageRaw({children, wrapperClassName = 'relative', className, ...rest}: PropsDefaultType) {
	//??? if (!(rest.width && rest.height)) { throw new Error("width/height is are required arguments"); }
	//??? if (!rest.sizes) { throw new Error("sizes is a required argument"); }

	// nimg* helper classes (not used by the component)
	const defWrapCls = 'nimg-wrap nimg-raw-wrap'
	const defImgCls = 'nimg nimg-raw     max-w-full max-h-full block w-auto h-auto mx-auto w-full'
	//style={{
	//	maxWidth: '100%',
	//	maxHeight: '100%',
	//	display: 'block',
	//	width: 'auto',
	//	height: 'auto',
	//	margin: '0 auto',
	//}}

	const ratio = getRatioPadding(rest.width, rest.height)

	return (
		<div className={`${defWrapCls} ${wrapperClassName ? wrapperClassName : ''}`}
			//style={{ paddingBottom: `${ratio}%` }}
		>
			<Image
				className={`${defImgCls} ${className ? className : ''}`} //appending
				{...rest} // should not contain className anymore
				layout="raw"
			/>
			{children && children}
		</div>
	);
}


/** TO BE TESTED FURTHER
 *
 * Behaviour:
 * - ONLY useful for tiny images which don't need down-scaling (e.g. Logos/images with text floating around them.
 * - The wrapper <div> is not actually needed but this way it's contained.
 *
 * @returns - next/image wrapped in a div
 */
export function ImageFixed({children, wrapperClassName, className, ...rest}: PropsDefaultType) {
	//??? if (!(rest.width && rest.height)) { throw new Error("width/height is are required arguments"); }
	//??? if (!rest.sizes) { throw new Error("sizes is a required argument"); }

	// nimg* helper classes (not used by the component)
	const defWrapCls = 'nimg-wrap nimg-fixed-wrap     children:!block'
	const defImgCls = 'nimg nimg-fixed     max-w-full max-h-full block w-auto h-auto mx-auto w-full'
	//style={{
	//	maxWidth: '100%',
	//	maxHeight: '100%',
	//	display: 'block',
	//	width: 'auto',
	//	height: 'auto',
	//	margin: '0 auto',
	//}}

	return (
		<div className={`${defWrapCls} ${wrapperClassName ? wrapperClassName : ''}`}
			//style={{ paddingBottom: `${ratio}%` }}
		>
			<Image
				className={`${defImgCls} ${className ? className : ''}`} //appending
				{...rest} // should not contain className anymore
				layout="fixed"
			/>
			{children && children}
		</div>
	);
}

