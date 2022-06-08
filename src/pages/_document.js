/**
 * Currently _document.tsx only exists to
 * - add/test a google font (will be inlined automatically IF Google Font or Typekit Font). All other fonts (incl. self-hosted) require doing this manually.
 * --- https://nextjs.org/docs/basic-features/font-optimization
 * --- https://font-display.glitch.me/
 * - add/test <NScript> to handle darkmode and avoid FOUC.
 *   Well, next.js wants <NScript> here but it doesn't actually work.
 */

import { Html, Head as DocHead, Main, NextScript } from 'next/document'
import NScript from "next/script";
import {GoogleFont} from "../components/head/font";

function Document() {
	return (
		<Html prefix="og: https://ogp.me/ns#">
			<DocHead>
				{/* currently "display=optional" isn't working and never shows the font (at least in Chrome)
				<GoogleFont name={'Poppins'} display={'optional'} />
				<GoogleFont name={'Poppins'} />
				*/}

				{/* noFouc.js v2a - would work but moved to _app.tsx->HeadDefaults for better positioning
				<script type="text/javascript" src='/js/noFouc.js'></script>
				*/}

				{/* noFouc.js v2b - would work but moved to _app.tsx->HeadDefaults for better positioning
				<script
					type="text/javascript"
					dangerouslySetInnerHTML={{
						__html: process.env.noFouc,
					}}
				></script>
				*/}
			</DocHead>
			<body>
				<Main />
				<NextScript />

				{/* noFouc.js v1 - where next.js want's this - but it does not work at all
				<NScript
					src="/js/noFouc.js"
					strategy="beforeInteractive"
					defer={false} // false removes "defer" (default for next/script)
				></NScript>
				*/}
			</body>
		</Html>
	)
}

export default Document
