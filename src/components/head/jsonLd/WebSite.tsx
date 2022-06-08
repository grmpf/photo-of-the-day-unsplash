// https://schema.org/WebSite
// https://schema.org/SearchAction

import {SiteLinksSearchBoxJsonLd} from 'next-seo'
import {defaultTitleShort} from '../../../next-seo.config';

/* How it should be
{
	"@type": "WebSite",
	"@id": "https://example.vercel.app/#website",
	"url": "https://example.vercel.app/",
	"name": "IconTest PWA",
	"publisher": {
		"@id": "https://example.vercel.app/#organization"
	},

	// without this because it's not of any use for this site
	"potentialAction": [
		{
			"@type": "SearchAction",
			"query-input": "required name=search_term_string",
			"target": {
				"@type": "EntryPoint",
				"urlTemplate": "https://example.vercel.app/?text={search_term_string}"
			}
		}
	]
}

//// currently
{
	"@context": "https://schema.org",
	"@type": "WebSite",
	"@id": "http://localhost:3000/#website",
	"url": "http://localhost:3000",
	"name": "Photo of the Day",
	"publisher": {
		"@id": "http://localhost:3000/#organization"
	},
	"potentialAction": [] // GO AWAY
}
*/



export default function WebSite() {
	return (
		<>
			{/* this is actually @type:WebSite which includes "potentialActions" but <WebSiteJsonLd /> doesn't exist.
			    :(
			*/}
			<SiteLinksSearchBoxJsonLd
				url={process.env.NEXT_PUBLIC_HOST}

				//// not useful for this site
				//potentialActions={[{
				//	//target: { // how it should be - does not work
				//	//	"@type": "EntryPoint",
				//	//	"urlTemplate": `${process.env.NEXT_PUBLIC_HOST}/?q={search_term_string}`
				//	//},
				//	target: `${process.env.NEXT_PUBLIC_HOST}/?q={search_term_string}`,
				//	queryInput: 'search_term_string',
				//}]}
				potentialActions={[]} // fails w/o this; adds "potentialAction":[] -> argh

				// how it should be - just not officially supported by next-seo
				id={`${process.env.NEXT_PUBLIC_HOST}/#website`} // /#/schema/website/1
				name={defaultTitleShort}
				publisher={{
					"@id": `${process.env.NEXT_PUBLIC_HOST}/#organization` // make sure this reference exists
				}}
			/>


		</>
	)
}
