//TODO: find a way to do this with getStaticProps() and revalidation on demand

import {GetServerSidePropsContext} from "next";
import potdLinks from "../data/potdLinks";
import {removePathTrailingSlash} from "next/dist/client/normalize-trailing-slash";

// should be in sync with the cronjob (might get delayed though)
//const refreshHour = 1; // was delayed a lot i guess and was still too early to get a new image from the api
const refreshHour = 6;

const Sitemap = () => { return null };

/**
 * - <loc> required; URL of the page. This URL must begin with the protocol (such as http) and end with a trailing slash, if your web server requires it. This value must be less than 2,048 characters.
 * - <lastmod> optional
 * - <changefreq> optional; always, hourly, daily, weekly, monthly, yearly, never;
 *   Only a hint, not a command. Just omit it when unknown.
 * - <priority> optional; 0.0 - 1.0 (default: 0.5)
 *
 * NOTE:
 * - locally (Zurich): new Date().toISOString() is 2h behind new Date()
 * - vercel.app (???): new Date().toISOString() is another h behind the local date
 *
 * @see https://www.sitemaps.org/protocol.html
 */
export const getServerSideProps = async ({ res }: GetServerSidePropsContext) => {
	const baseUrl = process.env.NEXT_PUBLIC_HOST
	//const isoDate = new Date().toISOString()

	// set time to 1am (when the cronjob runs)
	//const dateTmp = new Date(new Date().setHours(refreshHour,0,0,0))
	const dateTmp = new Date(new Date().setUTCHours(refreshHour,0,0,0)) // this fixes the time offset problem
	if (dateTmp > new Date()) {
		//dateTmp.setDate(dateTmp.getDate() - 1);
		dateTmp.setUTCDate(dateTmp.getUTCDate() - 1); // this fixes the time offset problem
	}

	//const isoDate = dateTmp.toString() // for human readable debugging (result different locally and on Vercel server)
	//const isoDate = dateTmp.toUTCString() // for human readable debugging (this is the base format used on the Vercel server - no matter it's location)
	const isoDate = dateTmp.toISOString() // the format we want (result different locally and on Vercel server)

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${potdLinks.filter(function(l) {
  	return !l.noPreGen;
  }).map(function(link, i) {
  	const prioTmp = Math.max(0.0, Math.round((1.0 - i / 10) * 10) / 10)
	const prio = prioTmp + (prioTmp === 1 ? '.0' : '')

	const path = removePathTrailingSlash(`${baseUrl}${link.path}`)

	return `
  <url>
	<loc>${path}</loc>
	<lastmod>${isoDate}</lastmod>
	<changefreq>daily</changefreq>
	<priority>${prio}</priority>
  </url>`
  }).join('')}

</urlset>
`
	res.setHeader('Cache-Control', 's-maxage=43200, stale-while-revalidate'); // 12h
	res.setHeader('Content-Type', 'application/xml');
	res.write(sitemap);
	res.end();

	return {
		props: {},
	};
};

export default Sitemap;
