/**
NOTES
- IMPORTANT: Content-Type should be "application/manifest+json" (or at least a JSON MIME type), no matter if "manifest.json", "manifest.webmanifest" or "/api/getManifest" is used.
- Icon "purpose" defaults to "any" (options: monochrome, maskable, any). If an icon contains multiple purposes, it could be used for any of those purposes (works like an OR condition).
  So you can add additional icons for "maskable", "monochrome" and "maskable monochrome" (unclear where monochrome will be used though).
  "any maskable" should be unlikely.
- Because it's not static (yet), this could be an api route instead (with rewrite via next.config.js).

TODO: find a way to do make this static
TODO: fix issues with icons on android.
TODO: update after some more icon research
 */


import {GetServerSidePropsContext} from "next";
import {defaultTitle, defaultTitleShort, defaultTitleExtraShort, defaultDesc} from "../next-seo.config";


const icons = [
	{ // TODO: only 48x48 32x32 16x16?
		"src": "favicon.ico",
		"sizes": "64x64 48x48 32x32 24x24 16x16",
		"type": "image/x-icon",
		"purpose": "any"
	},
	
	{
		"src": "assets/icon/android-chrome-192x192.png",
		"sizes": "192x192",
		"type": "image/png",
		"purpose": "any"
	},
	{
		"src": "assets/icon/android-chrome-512x512.png",
		"sizes": "512x512",
		"type": "image/png",
		"purpose": "any"
	},

	// MASKABLE PNG: fallback if SVG does not work
	{
		"src": "assets/icon/maskable-inverted-192x192.png",
		"sizes": "192x192",
		"type": "image/png",
		"purpose": "maskable"
	},
	{
		"src": "assets/icon/maskable-inverted-512x512.png",
		"sizes": "512x512",
		"type": "image/png",
		"purpose": "maskable"
	},

	// SVG: THE best option
	// - With size overwrites to help browsers choose the right size
	// - And the biggest size +1 to make this the go-to image when even bigger image are requested.
	{
		"src": "favicon.svg",
		"sizes": "513x513 512x512 192x192 180x180 150x150 144x144 120x120 72x72 64x64 48x48 32x32 26x26 24x24 22x22 16x16",
		"type": "image/svg+xml",
		"purpose": "any monochrome"
	},

	// MASKABLE SVG
	{
		"src": "assets/icon/favicon-maskable-inverted.svg",
		//"src": "assets/icon/favicon-maskable-inverted-test.svg",
		"sizes": "513x513 512x512 192x192 180x180 150x150 144x144 120x120 72x72 64x64 48x48 32x32 26x26 24x24 22x22 16x16",
		"type": "image/svg+xml",
		"purpose": "maskable"
	},

	// MONOCHROME SVG: because why not - it's easy with an svg
	/* Actually: this SHOULD already work with default favicon.svg (when all colors are ignored the result has to be black and transparent)
	{
		"src": "assets/icon/favicon-mono.svg",
		"sizes": "513x513 512x512 192x192 180x180 150x150 144x144 120x120 72x72 64x64 48x48 32x32 26x26 24x24 22x22 16x16",
		"type": "image/svg+xml",
		"purpose": "monochrome"
	},
	*/
]

const screenshots = [
	{
		"src": "assets/screenshots/screenshot-1.jpg",
		"type": "image/jpeg",
		"sizes": "1920x1080",
		"label": "Landscape Demo 1"
	},
	{
		"src": "assets/screenshots/screenshot-2.jpg",
		"type": "image/jpeg",
		"sizes": "1920x1080",
		"label": "Landscape Demo 2"
	},
	{
		"src": "assets/screenshots/screenshot-3.jpg",
		"type": "image/jpeg",
		"sizes": "1920x1080",
		"label": "Portrait Demo 1"
	},
	{
		"src": "assets/screenshots/screenshot-4.jpg",
		"type": "image/jpeg",
		"sizes": "1920x1080",
		"label": "Landscape Demo 3"
	}
]

// TODO: make this dynamic (and make sure to use the same title, desc etc. everywhere)
const shortcuts = [
	{
		"name": `Today's »${defaultTitleShort}«`,
		"short_name": "Today",
		"description": `»${defaultTitleShort}« from today`,
		"url": "/?source=pwa"
	},
	{
		"name": `Yesterday's »${defaultTitleShort}«`,
		"short_name": "Yesterday",
		"description": `»${defaultTitleShort}« from yesterday`,
		"url": "/1?source=pwa"
	},
	{
		"name": `Two days ago's »${defaultTitleShort}«`,
		"short_name": "Two days ago",
		"description": `»${defaultTitleShort}« from two days ago`,
		"url": "/2?source=pwa",
		"icons": [
			{
				"src": "favicon.svg",
				"type": "image/svg+xml"
			}
		]
	}
]


const manifestJson = {
	"name": defaultTitle,
	"short_name": defaultTitleExtraShort,
	"description": defaultDesc,
	"categories": [ // https://w3c.github.io/manifest-app-info/#categories-member
		"photo",
		"graphics & design",
		"graphics",
		"design",
		"lifestyle"
	],
	"scope": "/",
	//"id": "/?source=pwa", // ???
	"start_url": "/?source=pwa",
	"display_override": ["window-controls-overlay"], // for testing
	//"display": "standalone",
	"display": "minimal-ui",
	"orientation": "any",
	//"theme_color": "#ffffff",
	"theme_color": "#1d508f",
	//"background_color": "#1d508f",
	"background_color": "#ffffff",

	"icons": icons,
	"screenshots": screenshots,
	"shortcuts": shortcuts
	//"splash_pages": null
}


const Manifest = () => { return null };

export const getServerSideProps = async ({res}: GetServerSidePropsContext) => {
	res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
	//res.write(JSON.stringify(manifestJson);
	res.write(JSON.stringify(manifestJson, null, 2)); // pretty-print
	res.end();

	return {
		props: {},
	};
};

export default Manifest;
