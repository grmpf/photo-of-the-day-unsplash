import { ImageFill } from "./images";
import { unsplashLoader } from "../loaders/unsplash";
import { Spotlight3 } from "./lights";
import { defaultTitleShort } from "../next-seo.config";
import { useState } from "react";
import SmartLink from "./SmartLink";

export function SinglePhoto({photo, index, date, backLinkParams, collectionId}) {
	const [isLoading, setLoading] = useState(true);

	const imgRatio = Math.trunc(photo.width / photo.height * 1000) / 1000
	const widthStr = imgRatio < 1
		? `calc(var(--xy-min2) * ${imgRatio})`
		//: `calc(var(--xy-min) * ${imgRatio})`
		: `var(--xy-min)`

	{/* image "sizes": hardcoded and simplified version bc --vars does not work here - should match the layout */}
	const imgVwWidth = imgRatio < 1
		? Math.trunc(88 * imgRatio * 1000) / 1000
		: 88
	const imgVwWidthXs = imgRatio < 1
		? Math.trunc(78 * imgRatio * 1000) / 1000
		: 78
	const imgSizes = [
		// doesn't work with combined media-queries
		//`((min-width: 640px) and (max-width: 1539px)) min(88vw, calc(100vh - 60px - 40px))`,
		//`min(88vw, calc(100vh - 10vh - 8vh))`,

		`(min-width: 1536px) min(${imgVwWidth}vw, 82vh)`, // calc(100vh - 10vh - 8vh) = 82vh
		`(min-width: 640px) min(${imgVwWidth}vw, calc(100vh - 60px - 40px))`,
		`min(${imgVwWidthXs}vw, 82vh)`, // calc(100vh - 10vh - 8vh) = 82vh
	].join(', ')

	return (
		<>
			<div className="flex flex-col flex-nowrap	content-center justify-center items-center">

				<div className="contentTop" style={{ width: widthStr }}>
					<Spotlight3 />
					{/*
					<LightBar />
					*/}
				</div>

				<div className="flex justify-center" style={{ width: widthStr }}>
					<div
						className="flexGridSingleItem w-full shadow-red-400/50XY"
						style={{
							backgroundColor: `${photo.color2}`,
							//width: widthStr,
						}}>

						{/* replacement for next/image blurDataURL */}
						{isLoading && <>
							<div className="blurImgBox overflow-hidden">
								<div className="absolute -inset-2">
									<img src={photo.urls.blurDataURL} alt="" className="absolute inset-0 w-full h-full blur-md" />
								</div>
							</div>
						</>}

						<ImageFill loader={unsplashLoader}
								   src={`${photo.urls.raw}`}
								   alt={photo.alt || `${defaultTitleShort} (${date}) by ${photo.user.name}`}
								   width={photo.width} // required for ratio-calc
								   height={photo.height} // required for ratio-calc
								   priority={true}
								   quality={80}

								   sizes={imgSizes}

								   //// not ideal look&feel so onLoadingComplete() is used instead.
								   //placeholder="blur"
								   //blurDataURL={photo.urls.thumb} // can work when domain is enabled
								   //blurDataURL={photo.urls.blurDataURL} // base64 works but has some flickering and feels slower

								   onLoadingComplete={() => setLoading(false)}
						>
							<div className="imageDate tabular-nums">
								{date}
							</div>
						</ImageFill>

					</div>
				</div>

				<div className="contentBottom" style={{ width: widthStr }}>
					<div className="caption">
						<SmartLink href={`${photo.links.html}${backLinkParams}`} className="colored-link">
							Photo
						</SmartLink>
						{' by '}
						<SmartLink href={`${photo.user.links.html}${backLinkParams}`} className="colored-link">
							{photo.user.name}
						</SmartLink>
						{' on '}
						{/*
						<SmartLink href={`https://unsplash.com${backLinkParams}`} className="colored-link">
							Unsplash
						</SmartLink>
						*/}
						<SmartLink href={`https://unsplash.com/collections/${collectionId}${backLinkParams}`} className="colored-link">
							Unsplash
						</SmartLink>

						<div className="extraScrews"></div>
					</div>
				</div>

			</div>

		</>
	)
}



