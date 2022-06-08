// https://schema.org/WebPage
// https://schema.org/ImageObject

import {WebPageJsonLd} from 'next-seo'

/* How it should be
{
	"@type": "WebPage",
	"@id": "https://example.vercel.app/#webpage",
	"url": "https://example.vercel.app/",
	"name": "IconTest PWA",
	"description": "Simple PWA for testing and as reference",
	"isPartOf": {
		"@id": "https://example.vercel.app/#website"
	},
	"about": {
		"@id": "https://example.vercel.app/#organization"
	},
	"image": {
		"@type": "ImageObject",
		"@id": "https://example.vercel.app/#primaryimage",
		"url": "https://example.vercel.app/assets/imgs/share.jpg",
		"width": 1200,
		"height": 630,
		"caption": "Lorem ipsum..."
	},
	"primaryImageOfPage": {
		"@id": "https://example.vercel.app/#primaryimage"
	},
	"breadcrumb":{
		"@id":"https://example.vercel.app/#breadcrumb"

		// or e.g.
		//"@id":"https://icontest-pwa.vercel.app/test.html#breadcrumb"
	}
}


//// currently
{
	"@context": "https://schema.org",
	"@type": "WebPage",
	"@id": "http://localhost:3000/#webpage",
	"url": "http://localhost:3000/",
	"name": "IconTest PWA",
	"description": "Simple PWA for testing and as reference",
	"isPartOf": {
		"@id": "http://localhost:3000/#website"
	},
	"about": {
		"@id": "http://localhost:3000/#organization"
	},
	"image": {
		"@type": "ImageObject",
		"@id": "http://localhost:3000/#primaryimage",
		"url": "http://localhost:3000/assets/imgs/xyz.jpg",
		"width": 1200,
		"height": 630,
		"caption": "..."
	},
	"primaryImageOfPage": {
		"@id": "http://localhost:3000/#primaryimage"
	},
	"breadcrumb": {
		"@id": "http://localhost:3000/#breadcrumb"
	}
}


{
	"@context": "https://schema.org",
	"@type": "WebPage",
	"@id": "http://localhost:3000/test/25/#webpage",
	"description": "25th most recent »Photo of the Day«. Daily changing image from various artists. Photo collection curated by Unsplash.com.",
	"url": "http://localhost:3000/test/25",
	"name": "25 days ago | Photo of the Day",
	"isPartOf": {
		"@id": "http://localhost:3000/#website"
	},
	"about": {
		"@id": "http://localhost:3000/#organization"
	},
	"image": {
		"@type": "ImageObject",
		"@id": "http://localhost:3000/test/25/#primaryimage",
		"url":"https://images.unsplash.com/photo-1649895618216-7b7cefbb7d96?ixid=MnwzMTY2MjJ8MHwxfGNvbGxlY3Rpb258MjZ8MTQ1OTk2MXx8fHx8Mnx8MTY1MzYyMjY2Mw&amp;ixlib=rb-1.2.1&amp;raw_url=true&amp;fit=crop&amp;crop=faces%2Centropy%2Cedges%2Ccenter&amp;fm=jpg&amp;q=80&amp;w=1200&amp;h=899",
		"width":1200,
		"height":899,
		"caption":"Photo of the Day"
	},
	"primaryImageOfPage": {
		"@id": "http://localhost:3000/test/25/#primaryimage"
	}
}



*/



export default function WebPage({title, desc, fullUrl, pageKey, sharingImgAlt, photoPaths}) {

	const imgs = photoPaths.map((p, i) => {
		return {
			"@type": "ImageObject",
			...(i === 0 ? {"@id": `${fullUrl}/#primaryimage`} : {}),
			"url": p.url,
			"width": p.width,
			"height": p.height,
			"caption": `${sharingImgAlt}`,
		}
	})

	return (
		<>
			<WebPageJsonLd
				//id={`${fullUrl}/#webpage${pageKey}`}
				id={fullUrl}
				description={desc}

				// how it should be - just not officially supported by next-seo
				//url={`${process.env.NEXT_PUBLIC_HOST}`}
				url={fullUrl} // w/ or w/o trailing slash depending on your setup
				name={title}
				isPartOf={{"@id": `${process.env.NEXT_PUBLIC_HOST}/#website`}} // make sure this reference exists

				// should be: "The subject matter of the content."
				//about={{"@id": `${process.env.NEXT_PUBLIC_HOST}/#organization`}} // make sure this reference exists

				{...(imgs ? {image: imgs.length === 1 ? imgs[0] : imgs} : {})}
				{...(imgs ? {primaryImageOfPage: {"@id": `${fullUrl}/#primaryimage`}} : {})}

				//breadcrumb={{
				//	"@id": `${fullUrl}/#breadcrumb` // make sure this reference exists
				//}}
			/>

		</>
	)
}
