/** This is the default used on all pages (used in _app.tsx)
 * Set/Overwrite in another <Head> ('next/head') on page level when required.
 */
// TODO: refactor whole setup for meta tags, JsonLD and OpenGraph

import NHead from 'next/head'
import {DefaultSeo} from 'next-seo'
import DefaultSeoProps from '../../next-seo.config';
import Organization from "./jsonLd/Organizaion";
import WebSite from "./jsonLd/WebSite";

function HeadDefaults() {
	return (
		<>
			<NHead>
				{/* ******* GENERAL ******* */}
				<meta charSet="utf-8" />{/* must be "charSet" (not "charset") or next(?) will inject "charSet" as well */}
				{/* <= IE10 <meta httpEquiv="X-UA-Compatible" content="IE=edge" />*/}
				<meta // full width (no-gap4notch-safari)
					name="viewport"
					content="width=device-width,initial-scale=1,minimum-scale=1,viewport-fit=cover"
				/>
			</NHead>

			<DefaultSeo {...DefaultSeoProps} />

			<NHead>
				<link rel="icon" sizes="any" href="/favicon.ico" />{/* type="image/x-icon" */}
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />

				{/* <link rel="manifest" href="/manifest.json"/> */}
				<link rel="manifest" href="/manifest.webmanifest"/>
				<link rel="alternate icon" sizes="32x32" type="image/png" href="/favicon-32x32.png" />
				<link rel="alternate icon" sizes="16x16" type="image/png" href="/favicon-16x16.png" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				{/* not for now... caching is way to aggressive
				<link rel="mask-icon" color="#5299d1" href="/safari-pinned-tab.svg" />
				*/}
				<meta name="msapplication-TileColor" content="#5299d1"/>
				{/*
				<meta name="theme-color" content="#ffffff"/>
				*/}
				<meta name="theme-color" content="#1d508f"/>


				{/* noFouc.js v3a - 2nd best result
				  * According to some ppl online: this might throw some next.js warnings/errors for <script> in next/head.
				*/}
				<script type="text/javascript" src='/js/noFouc.js'>{/**/}</script>

				{/* noFouc.js v3b - Best result - but don't like the idea of using a env-var
				  * According to some ppl online: <script> might throw some next.js warnings/errors when used in next/head.
				<script
					type="text/javascript"
					dangerouslySetInnerHTML={{
						__html: process.env.noFouc,
					}}
				></script>
				*/}
			</NHead>

			{/* JsonLD */}
			<Organization />
			<WebSite />
		</>
	)
}

export { HeadDefaults }
