import Image from "next/image";
import {ImageProps} from "next/dist/client/image";

// returns a numeric value to be used as padding-bottom (%). A good old css-trick to set an aspect-ratio.
export function getRatioPadding(width: string | number | undefined, height: string | number | undefined){
	if(height && +height > 0 && width && +width > 0) {
		return Math.trunc(+height/+width * 10000) / 100
	}
	return 100 //results in a square
}

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


/**
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


