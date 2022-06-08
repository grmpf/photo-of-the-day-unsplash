// https://schema.org/Organization
// https://schema.org/ImageObject

import {OrganizationJsonLd} from 'next-seo'
import {gitHubLink, organizationName, twitterLink} from '../../../next-seo.config';

/* How it should be
{
  "@type": "Organization",
  "@id": "https://example.vercel.app/#organization",
  "url": "https://example.vercel.app/",
  "name": "Example Company",
  "slogan": "We do stuff",
  "logo": {
    "@type": "ImageObject",
    "@id": "https://example.vercel.app/#logo",
    "url": "https://example.vercel.app/assets/imgs/icons/icon-512x512.png",
    "contentUrl": "https://example.vercel.app/assets/imgs/icons/icon-512x512.png",
    "width": 512,
    "height": 512,
    "caption": "Example Company"
  },
  "image": {
    "@id": "https://example.vercel.app/#logo"
  },
  "sameAs":[
    "https://twitter.com/example",
    "https://github.com/example"
  ]
}

//// currently
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "http://localhost:3000/#organization",
  "name": "grmpf",
  "url": "https://github.com/grmpf",
  "sameAs": [
    "https://twitter.com/grmpf_",
    "https://github.com/grmpf"
  ],

  // default by next-seo
  "logo": "http://localhost:3000/assets/img/logo-grmpf.png",

  // yay
  "logo": {
    "@type": "ImageObject",
    "@id": "http://localhost:3000/#logo",
    "url": "http://localhost:3000/assets/img/logo-grmpf.png",
    "contentUrl": "http://localhost:3000/assets/img/logo-grmpf.png",
    "width": 794,
    "height": 794,
    "caption": "grmpf"
  },
  "image": {
    "@id": "http://localhost:3000/#logo"
  }
}
*/

/** Owner of the website
 * This can be shown on multiple domains if the organization maintains multiple websites and points the the "source of truth".
 *
 * NOTE: <LogoJsonLd> is a part of <OrganizationJsonLd> - DON'T USE BOTH
 */
export default function Organization() {
	return (
		<>
			{/* Usually you would setup something like this (for THE page of an organization/brand/website)
			<OrganizationJsonLd
				name={'Organization Name'}
				logo={`${process.env.NEXT_PUBLIC_HOST}/assets/img/logo.png`} // Currently accepts only a string (not a ImageObject; aka no width, height, caption etc.)
				url={`${process.env.NEXT_PUBLIC_HOST}`} // maybe?
				//url={`https://www.brand-mainpage.com`} // maybe?
				sameAs={[
					'https://twitter.com/???',
					'https://github.com/???',
				]}
			/>
			*/}

			{/* Because this is a demo and the lack of other options the organization will be the github profile page */}
			<OrganizationJsonLd
				id={`${process.env.NEXT_PUBLIC_HOST}/#organization`} // /#/schema/organization/1
				name={organizationName}
				//logo={`${process.env.NEXT_PUBLIC_HOST}/assets/img/logo-grmpf.png`} // Currently accepts only a string (not a ImageObject; aka no width, height, caption etc.)
				url={gitHubLink}
				sameAs={[ // kind of the social media profile pages
					twitterLink,
					gitHubLink, // ...so in this exception it's the same as "url"
				]}

				// how it should be - just not officially supported by next-seo
				logo={{
					"@type": "ImageObject",
					"@id": `${process.env.NEXT_PUBLIC_HOST}/#logo`,
					"url": `${process.env.NEXT_PUBLIC_HOST}/assets/img/logo-grmpf.png`,
					"contentUrl": `${process.env.NEXT_PUBLIC_HOST}/assets/img/logo-grmpf.png`,
					"width": 794,
					"height": 794,
					"caption": organizationName
				}}
				image={{
					"@id": `${process.env.NEXT_PUBLIC_HOST}/#logo` // make sure this reference exists
				}}
			/>
		</>
	)
}
