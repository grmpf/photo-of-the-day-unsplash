export const defaultTitleShort = 'Photo of the Day'
export const defaultTitleExtraShort = 'POTD'
//export const defaultTitle = `${defaultTitleShort} - Archive`
export const defaultTitle = `${defaultTitleShort}`
export const defaultDesc = 'Daily changing image from various artists. Photo collection curated by Unsplash.com.'

/// BLA BLA
//displayed on a exhibition/gallery wall.
//showcasing the work of various artists
//Photos from various artists curated by Unsplash.com

// EXTRAS
export const organizationName = 'grmpf'
export const gitHubLink = 'https://github.com/grmpf'
export const gitHubRepoName = 'photo-of-the-day-unsplash'
export const gitHubRepoLink = `${gitHubLink}/${gitHubRepoName}`
export const twitterUser = 'grmpf_';
export const twitterLink = `https://twitter.com/${twitterUser}`




// this is the actual config for next-seo
export default {
	defaultTitle: `${defaultTitle}`,
	titleTemplate: `%s | ${defaultTitle}`,
	//titleTemplate: `%s - ${defaultTitle}`,

	openGraph: {
		type: 'website',
		//locale: 'en',
		site_name: `${defaultTitle}`,


		//image: '/assets/img/share.jpg',
		//imageType: "image/jpeg",
		//imageWidth: 1200, // ≈ 1.91:1 -> facebook
		//imageHeight: 630,
	}

	//twitter: {
	//	cardType: 'summary_large_image',
	//},

	// to add a meta tag that are not covered (yet)
	//additionalMetaTags: {
	//
	//}
}
