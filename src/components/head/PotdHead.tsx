// TODO: refactor whole setup for meta tags, JsonLD and OpenGraph

import NHead from "next/head";
import {NextSeo} from "next-seo";
import {defaultTitleShort, defaultDesc, twitterUser, defaultTitle} from "../../next-seo.config";
import {ordinalSuffix} from "../../libs/utils/string";
import WebPage from "./jsonLd/WebPage";
import {getCustomThumbPath} from "../../libs/unsplashUrl";


// TODO: refactor when happy with the result
function getDesc(pageTitle, pageNr) {
	let descTmp = ''
	//if(pageNr > 0) {
	//	descTmp = `${ordinalSuffix(pageNr+1)} most recent `
	//} else {
	//	descTmp = 'Most recent '
	//}
	if (pageTitle) {
		//descTmp += `»${defaultTitleShort}« from ${pageTitle.toLowerCase()}.`
		descTmp = `${pageTitle}'s »${defaultTitleShort}«.`
	} else if (pageNr > 2) {
		descTmp = `${ordinalSuffix(pageNr)} most recent »${defaultTitleShort}«.`
	} else {
		//descTmp += `Current »${defaultTitleShort}«.`
		//descTmp += `Current ${defaultTitleShort.toLowerCase()}.`
		//descTmp += `Current »${defaultTitleShort}«.`
		descTmp += `Today's »${defaultTitleShort}«.`
	}
	descTmp += ` ${defaultDesc}`
	return descTmp;
}

function getTitle(pageTitle, pageNr) {
	if (pageNr > 2) {
		// when testing (/3, /4 etc.)
		return `${pageNr} days ago`
	}
	return pageTitle
}

// this is a bit odd but mimics the behaviour of next-seo when setting a title (next-seo.config.js)
function getTitleFull(pageTitle, pageNr) {
	const tTemp = getTitle(pageTitle, pageNr)
	return tTemp ? tTemp + ` | ${defaultTitle}` : defaultTitle
}

function PotdHeadBase({path, pageTitle, pageNr}) {
	const titleTxt = getTitle(pageTitle, pageNr);
	const descTxt = getDesc(pageTitle, pageNr);

	return (
		<>
			<NextSeo title={titleTxt} // also sets og:title
					 description={descTxt} // also sets og:description

					 canonical={`${process.env.NEXT_PUBLIC_HOST}${path}`} // required when using languageAlternates aka rel="alternate"
					 //languageAlternates={[
					 //	 {
					 //		 hrefLang: router.locales[0],
					 //		 href: `${process.env.NEXT_PUBLIC_HOST}${path}`,
					 //	 },
					 //	 {
					 //		 hrefLang: router.locales[1],
					 //		 href: `${process.env.NEXT_PUBLIC_HOST}/${router.locales[1]}${path}`,
					 //	 },
					 //	 {
					 //		 hrefLang: 'x-default',
					 //		 href: `${process.env.NEXT_PUBLIC_HOST}${path}`,
					 //	 }
					 //]}
			/>
		</>
	)
}

function getImgAlt(sharing, date, pageTitle) {
	// Alt should always describe what's in the img not what's it about - if possible
	//return sharing.imgAlt ? sharing.imgAlt : `${defaultTitleShort} (${date}) by ${sharing.creatorName}`;

	// But bc the content changes every day, is connected to the shared link and this might get cached etc - the text should stay true.
	// It's not very meaningful though
	if(pageTitle) {
		return `${defaultTitleShort} - ${pageTitle}`;
	}
	return defaultTitleShort;
}



/** PotdHead V1
 * Simple enough to do this manually aka with <meta> tags.
 * Allows adding different image(s) for twitter.
 */
function PotdHead({path, date, sharing, pageTitle, pageNr, photos, colors}) {
	const imgAlt = getImgAlt(sharing, date, pageTitle)
	const titleTxt = getTitleFull(pageTitle, pageNr)
	const descTxt = getDesc(pageTitle, pageNr)

	const imgW = 1200
	const imgH = Math.trunc(imgW * (photos[0].height / photos[0].width))

	const fullUrl = `${process.env.NEXT_PUBLIC_HOST}${path}`

	const photoPaths = [
		{ // non-cropped
			url: getCustomThumbPath(photos[0].urls.raw, imgW, imgH, 80),
			width: imgW,
			height: imgH,
		},
		//{ // 16x9
		//	url: getCustomThumbPath(photos[0].urls.raw, imgW, 675, 80),
		//	width: imgW,
		//	height: 675,
		//},
		//{ // 4x3
		//	url: getCustomThumbPath(photos[0].urls.raw, imgW, 800, 80),
		//	width: imgW,
		//	height: 800,
		//},
		//{ // 1x1
		//	url: getCustomThumbPath(photos[0].urls.raw, imgW, imgW, 80),
		//	width: imgW,
		//	height: imgW,
		//},
	]

	return (
		<>
			<NHead>
				{colors.theme && <meta name="theme-color" content={colors.theme}/>}
				<meta property="og:url" content={fullUrl}/>
				<meta property="og:image" content={sharing.ogImageUrl}/> {/* ratio ≈ 1.91:1 */}
				<meta property="og:image:type" content="image/jpeg"/>
				<meta property="og:image:width" content="1200"/>
				<meta property="og:image:height" content="630"/>
				<meta property="og:image:alt" content={imgAlt}/>
				<meta name="twitter:card" content="summary_large_image"/>
				<meta name="twitter:site" content={`@${twitterUser}`}/>
				{sharing?.twitterUser && <> {/* giving credit to the creator of the photo IF a twitter handle is available */}
					<meta name="twitter:creator" content={`@${sharing.twitterUser}`}/>
				</>}

				{/* OPTIONAL: twitter shows a ratio of 2:1 but would also work with the default og:image (but crops) */}
				<meta name="twitter:image" content={sharing.twitterImageUrl} />
				<meta name="twitter:image:width" content="1500" />
				<meta name="twitter:image:height" content="750" />
				<meta name="twitter:image:alt" content={imgAlt}/>
			</NHead>

			{/* JsonLD */}
			<WebPage title={titleTxt} desc={descTxt} fullUrl={fullUrl} pageKey={pageNr} sharingImgAlt={imgAlt} photoPaths={photoPaths}/>
		</>
	)
}

/** PotdHead V2
 * Using NextSeo but doesn't allow twitter:image
 */
function PotdHeadV2({path, date, sharing, pageTitle, pageNr, photos}) {
	const imgAlt = getImgAlt(sharing, date, pageTitle)
	const titleTxt = getTitleFull(pageTitle, pageNr)
	const descTxt = getDesc(pageTitle, pageNr)

	const fullUrl = `${process.env.NEXT_PUBLIC_HOST}${path}`

	return (
		<>
			<NextSeo
				openGraph={{
					url: `${process.env.NEXT_PUBLIC_HOST}${path}`,
					images: [
						{
							url: sharing.ogImageUrl,
							alt: imgAlt,
							type: 'image/jpeg',
							width: 1200,
							height: 630,
						}
					],
				}}
				twitter={{ // does not allow own images (twitter uses og:image by default though)
					cardType: 'summary_large_image',
					//site: '@???', // the company (e.g. '@nytimes') // twitter:site
					site: `@${twitterUser}`,
					//handle: '@???', // the person (e.g. '@SomeDude') // twitter:creator
					...(sharing?.twitterUser ? {handle: sharing.twitterUser} : {}) // twitter:creator
				}}

			/>

			{/* JsonLD */}
			{/*
			<WebPage ... />
			*/}
		</>
	)
}

export default PotdHeadBase

export { PotdHeadBase, PotdHead, PotdHeadV2 }
