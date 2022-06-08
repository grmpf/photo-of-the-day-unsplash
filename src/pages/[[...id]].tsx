// PHOTO OF THE DAY (actually, from the day before aka yesterday)

import {Fragment} from 'react';
import {GetStaticPaths, GetStaticProps} from 'next'
import {useRouter} from 'next/router';
import {ChevronDoubleLeftIcon as ChevronLeftO, ChevronDoubleRightIcon as ChevronRightO} from '@heroicons/react/outline';
import {TinyColor} from '@ctrl/tinycolor';
import twColors from 'tailwindcss/colors'
import PotdLayout from '../components/layouts/potd';
import {dateFromNow2} from '../libs/utils/dateTime';
import potdLinks from '../data/potdLinks';
import {SinglePhoto} from '../components/photos';
import SmartLink from '../components/SmartLink';
import {Header} from '../components/Header';
import {PotdHeadBase, PotdHead} from "../components/head/PotdHead";
import {getFacebookOpenGraphPath, getTwitterCardPath} from "../libs/unsplashUrl";
import {getPhotos} from "../data/potdPhotos";
import {defaultTitleShort} from "../next-seo.config";
import {removeUrlParams} from "../libs/utils/string";

const backLinkParams = `?utm_source=${process.env.NEXT_PUBLIC_UNSPLASH_APP_NAME}&utm_medium=referral`
//const backLinkParams = ``

const svgBg = <>
	<svg xmlns='http://www.w3.org/2000/svg'
		 className='absolute inset-0'
		 width='100%' height='100%'
		 viewBox='0 0 650 500'
		 preserveAspectRatio='xMidYMid slice'
	>
		<rect x='0' y='0' width='100%' height='100%' filter='url(#roughpaper)' fill='none'></rect>
		<defs>
			<filter id='roughpaper' x='0%' y='0%' width='100%' height="100%">
				<feTurbulence type='fractalNoise' baseFrequency='0.04' result='noise' numOctaves="5"/>
				<feDiffuseLighting in='noise' lightingColor='white' surfaceScale='3.6'>
					<feDistantLight azimuth='45' elevation='70'/>
				</feDiffuseLighting>
			</filter>
		</defs>
	</svg>
</>;


const Potd = ({pageNr, pageTitle, photos, collectionId, dates, colors, links, sharing}) => {
	const router = useRouter()
	const path = removeUrlParams(router.asPath) // removes all query params

	return (
		<>
			<PotdHeadBase path={path} pageTitle={pageTitle} pageNr={pageNr}/>
			<PotdHead path={path} date={dates.dateNum} sharing={sharing} pageTitle={pageTitle} pageNr={pageNr} photos={photos} colors={colors}/>

			{/* cannot add this block conditionally (not w/o warnings) so the class has to be added conditionally or needs a fallback like below :( */}
			<style jsx global={false}>{`
				::selection {
					color: #FFFFFF;
					background: ${colors?.link ? colors.link : twColors.sky[600]};
				}
				a.colored-link {
					color: ${colors?.link ? colors.link : twColors.sky[500]};
					//transition: opacity 0.3s ease; // buggy without ease
					&:hover {
						color: ${colors?.linkHover ? colors.linkHover : twColors.sky[600]};
					}

					&[aria-disabled],
					&[aria-disabled]:hover {
						color: ${colors?.linkHover ? colors.linkHover : twColors.sky[600]};
						opacity: 0.25;
					}
				}
			`}</style>

			{/* checks are only for testing different "fallback" behaviours */}
			<Header date={dates.dateTxt} prevImgLink={links?.prevImg ? links.prevImg : undefined} nextImgLink={links?.nextImg ? links.nextImg : undefined} collectionId={collectionId} backLinkParams={backLinkParams}/>

			{!router.isFallback && <>
				<div className={`flexGridSingle h-fullXY mx-autoOFF w-fullOFF   relative   shadow-innerXYshadow-gray-400`}>
					{/*
					{svgBg}
					*/}
					<div className="w-[10vw] sm:w-[5vw] text-center z-10">

						{/* prevents looping + quick hack: off={links.prevImg === '/2'} */}
						<SmartLink off={links.prevImg === '/2'} href={`${links.prevImg}`} title={"TO THE FUTURE"} className="block py-4 text-4xl colored-link">
							<ChevronLeftO className="mx-auto w-[55%] 2xs:w-9/10 xs:w-5/10"/>
						</SmartLink>

					</div>

					{/* PREP for multiple imgs on the wall */}
					<div className="flex justify-center">

						{photos && photos.map((p, i) =>
							<Fragment key={`${p.id}-${i}`}>
								<SinglePhoto photo={p} index={i} date={dates.dateNum} backLinkParams={backLinkParams} collectionId={collectionId}/>
							</Fragment>
						)}

					</div>

					<div className="w-[10vw] sm:w-[5vw] text-center z-10">

						<SmartLink off={links.nextImg === '/'} href={`${links.nextImg}`} title={"TO THE PAST"}  className="block py-4 text-4xl colored-link">
							<ChevronRightO className="mx-auto w-[55%] 2xs:w-9/10 xs:w-5/10"/>
						</SmartLink>

					</div>

				</div>
			</>}

			{/* Footer is in the layout */}

		</>
	)
}


export const getStaticPaths: GetStaticPaths = async (context) => {
	const paths = []
	for (let i = 0; i < potdLinks.length; i++) {
		if (!potdLinks[i].noPreGen) {
			paths.push({
				params: {id: potdLinks[i].key ? [potdLinks[i].key] : null},
			})
		}
	}

	// { fallback: false } means other routes should 404.
	// { fallback: true } Next.js will generated missing paths on first request or statically generate for robots
	// { fallback: 'blocking' } Next.js will SSR missing paths on the first request and return the generated HTML
	return {
		paths,
		fallback: false,
		//fallback: true, // fallback needs to be != false so getStaticProps can redirect not matching routes
		//fallback: 'blocking',
	}
}


function getSharingData(firstPhoto, shareImgTxt: string, date: string) {
	// quick way to generate sharing image with custom text when required
	//shareImgTxt = `${defaultTitleShort}`
	//date = ''

	const ogImageUrl = getFacebookOpenGraphPath(firstPhoto.urls.raw, shareImgTxt, date);
	const twitterImageUrl = getTwitterCardPath(firstPhoto.urls.raw, shareImgTxt, date);
	const twitterUser = firstPhoto.user.twitter_username;
	const creatorName = firstPhoto.user.name;
	const imgAlt = firstPhoto.alt;

	return {ogImageUrl, twitterImageUrl, twitterUser, creatorName, imgAlt};
}

export const getStaticProps: GetStaticProps = async (context) => {
	const ids = context?.params?.id
	let id = ids
		? ids[0]
		: null
	let pageNr = 0

	//const paths = []
	//for (let i = 0; i < potdLinks.length; i++) {
	//  if(!potdLinks[i].noPreGen) {
	//    paths.push(potdLinks[i].key)
	//  }
	//}
	const pathKeys = potdLinks.filter(function (l) {
		return !l.noPreGen;
	}).map(function (l2) { return l2.key; });


	// Expecting one of three values for "id" (null, '1', '2')
	// - null: The main page "/"
	// - '1': The same page 1 day in the past "/1"
	// - '2': The same page 2 days in the past "/2"
	// NOTE: '0' and any other unknown value will redirect to "/"
	// TODO: refactoring (maybe with redirects in next.config.js)
	if ((id !== null && pathKeys.indexOf(id) > -1) && (ids?.length && ids.length > 1)) {
		// redirect e.g. "/1/foobar" to "/1" (only the known paths to avoid extra redirects)
		return {
			redirect: {
				destination: `/${id}`,
				permanent: true, // false = 307 (temporary) | true = 308 (permanent)
				// statusCode: 302 // Can be used INSTEAD of "permanent"; 302 (temporary; traditionally) | 301 (permanent; traditionally)
			},
		}
	} else if ((id !== null && pathKeys.indexOf(id) === -1) || (ids?.length && ids.length > 1)) {
		// redirect to "/" if id not null, '1' or '2'
		// NOTE: actually not a good idea on the homepage (all unknown requests will be redirected). Back to FALLBACK:false
		return {
			redirect: {
				destination: '/',
				permanent: true, // false = 307 (temporary) | true = 308 (permanent)
				// statusCode: 302 // Can be used INSTEAD of "permanent"; 302 (temporary; traditionally) | 301 (permanent; traditionally)
			},
		}
	} else if (id === null) {
		// it's null (unset)
		//pageNr = 0 // already 0 as default
	} else {
		// it's either '1' or '2' already
		pageNr = +id // + convert string to number
	}
	// now: pageNr is either 0, 1 or 2

	const photoOptions = {
		//id: '317099', //collection_id "Unsplash Editorial"
		id: '1459961', //collection_id "Photo of the Day (Archive)"
		page: pageNr + 1,
		per_page: 1,
	}
	const photosReduced = await getPhotos(photoOptions); // will throw if there is no image (which aborts revalidation)

	// date: the collection 1459961 is an archive of POTD and always one day behind.
	// And if they forget to add a picture one day... the date will be off.
	//const dateNum = dateFromNow2(-(pageNr + 1)) // the ugly TRUTH
	const dateNum = dateFromNow2(-(pageNr)) // the pretty LIE
	// TEST
	const dateTxt = dateFromNow2(-(pageNr), {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		weekday: 'short'
	})

	// previous/next image link
	const prevKeyTmp = pageNr - 1
	const nextKeyTmp = pageNr + 1
	const prevLink = prevKeyTmp < 0
		? '/2'
		: prevKeyTmp < 1
			? '/'
			: `/${prevKeyTmp}`;
	const nextLink = nextKeyTmp > 2 ? '/' : `/${nextKeyTmp}`;

	const firstPhoto = photosReduced[0]
	// TEMP: using main photo color for links (works as long as there is only one image on the wall)
	const linkColorTmp = new TinyColor(firstPhoto.color)
	const brightnessFactor = (100 / 255 * linkColorTmp.getBrightness())
	const linkColorNorm = linkColorTmp.brighten(22 - brightnessFactor) // normalize perceived brightness to 22%
	//const themeColorNorm = linkColorTmp.brighten(30 - brightnessFactor) // normalize perceived brightness to 30%
	//const linkColorNormB = linkColorTmp.brighten(38 - brightnessFactor) // normalize perceived brightness to 38%

	// sharing + social data
	const shareImgTxt = `${defaultTitleShort}~by ${firstPhoto.user.name}`; // use ~ to get a linebreak
	const sharingData = getSharingData(firstPhoto, shareImgTxt, dateNum);

	return {
		props: {
			pageNr: pageNr,
			//pageTitle: potdLinks[pageNr]?.pageTitle ?? dateFromNow2(-(pageNr + 1), {
			//  //year: 'numeric',
			//  year: '2-digit',
			//  month: 'short',
			//  day: '2-digit'
			//}),
			pageTitle: potdLinks[pageNr]?.pageTitle ?? null,
			photos: photosReduced || null,
			collectionId: photoOptions.id,
			dates: {
				dateNum,
				dateTxt,
			},
			colors: {
				//link: linkColorNorm.setAlpha(0.62).toRgbString(),
				//linkHover: linkColorNormB.toHexString(),
				link: linkColorNorm.setAlpha(0.7).toRgbString(), // some extra contrast to make Lighthouse happy
				linkHover: '#1a1a1a',
				theme: linkColorNorm.toHexString(), // for the window-top when used as PWA
			},
			links: {
				prevImg: prevLink,
				nextImg: nextLink,
			},
			sharing: {
				// explicit for a better overview
				ogImageUrl: sharingData.ogImageUrl,
				twitterImageUrl: sharingData.twitterImageUrl,
				twitterUser: sharingData.twitterUser,
				creatorName: sharingData.creatorName,
				imgAlt: sharingData.imgAlt,
			},

		},
		//revalidate: 86400 // somewhat once a day - NOPE, using a cronjob instead (as github workflow)
	}
}

Potd.getLayout = function getLayout(page) {
	return (
		<PotdLayout>
			{page}
		</PotdLayout>
	)
}

export default Potd
