// HANDLES (based on next.js defaults with webpack5)
// - @next/bundle-analyzer [DEV only]
// - Content-Security-Policy (CSP) [PRD only]
// - i18n
// - X-Clacks-Overhead
//
// NEEDS workaround/fix for
// - Loading SVG as dataURI and as component
//
// HAVE A LOOK AT:
// - outputStandalone: https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files-experimental


const withPlugins = require('next-compose-plugins')
const svgToMiniDataURI = require('mini-svg-data-uri');
const {readFileSync} = require("fs");

let withBundleAnalyzer = {}
if (process.env.NODE_ENV === 'development') { //required when installed as devDependency
	withBundleAnalyzer = require('@next/bundle-analyzer')({
		enabled: process.env.ANALYZE === 'true',
	})
}


const nextConfig = {
	webpack(config, {webpack, dev, isServer}) {

		//// TYPES
		// asset: automatically chooses between exporting a data URI and emitting a separate file. Previously achievable by using url-loader with asset size limit.
		// asset/resource: emits a separate file and exports the URL. Previously achievable by using file-loader.
		// asset/inline: exports a data URI of the asset. Previously achievable by using url-loader.
		// asset/source: exports the source code of the asset. Previously achievable by using raw-loader.


		/* USAGE: import svg from './assets/file.svg?data'
		 * <img src={svg} width="200" height="200" />
		 * background-image: url("#{$svg}")
		 *
		 * asset/inline NOT BEHAVING AS EXPECTED
		config.module.rules.push({
		  test: /\.svg$/i,
		  type: 'asset/inline', // NOT BEHAVING AS EXPECTED
		  //issuer: /\.[jt]sx?$/, // with this it will not affect .css, .scss etc.
		  resourceQuery: [/data/, /url/], // *.svg?data || *.svg?url
		});
	   */

//		// https://webpack.js.org/guides/asset-modules/#custom-data-uri-generator
//		config.module.rules.push({
//			test: /\.svg$/i,
//			//type: 'asset/inline',
//			type: 'asset',
//			//issuer: /\.[jt]sx?$/, // with this it will not affect .css, .scss etc.
//			resourceQuery: [/data/, /url/], // *.svg?data || *.svg?url
//			generator: {
//				dataUrl: (content) => {
//					// All .svg files will be encoded by mini-svg-data-uri package.
//					if (typeof content !== 'string') {
//						content = content.toString();
//					}
//					return svgToMiniDataURI(content);
//				}
//			},
//		});
//
//		// USAGE: import svg from './assets/file.svg?path'
//		config.module.rules.push({
//			test: /\.svg$/i,
//			type: 'asset/resource',
//			resourceQuery: /path/ // *.svg?path
//		});
//
//		// USAGE: import svg from './assets/file.svg?raw'
//		config.module.rules.push({
//			test: /\.svg$/i,
//			type: 'asset/source',
//			resourceQuery: /raw/ // *.svg?raw
//		});
//
//		// USAGE: import Svg from './assets/file.svg'
//		config.module.rules.push({
//			test: /\.svg$/i,
//			// NO??? //type: ???,
//			issuer: /\.[jt]sx?$/, // ignoring all import from .css, .scss etc.
//			resourceQuery: {not: [/data/, /url/, /path/, /raw/]}, // react component - becomes the default by excluding *.svg?auto && *.svg?url && *.svg?inline && *.svg?raw
//			//use: ['@svgr/webpack'],
//			use: [
//				{
//					loader: '@svgr/webpack', options: {
//						//icon: true,
//						svgoConfig: {}
//					}
//				}
//			],
//		});

		return config
	},
}

// manage i18n
if (process.env.EXPORT !== 'true') {
	nextConfig.i18n = {
		locales: ['en'],
		defaultLocale: 'en',
		//localeDetection: false
	}
}

module.exports = withPlugins(
	[
		withBundleAnalyzer,
		//withTM, // wants to be the last plugin in this list
	],
	{
		...nextConfig,

		// injecting ENV vars programmatically
		//env: {
		//	// process.env.noFouc could be used to run a script ASAP (best inlined in <head>) in order to avoid FOUC.
		//	noFouc: readFileSync('./public/js/noFouc.js').toString(), // move out of public when using this approach
		//},

		//experimental: {
		//  images: {
		//		layoutRaw: true,
		//  },
		//},

		//TODO: reduce sizes (default logic is a bit flawed)
		//// DEFAULTS
		// - https://nextjs.org/docs/api-reference/next/image#image-sizes
		// - https://nextjs.org/docs/api-reference/next/image#device-sizes
		//images: {
		//  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		//  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		//},

		poweredByHeader: false,
		reactStrictMode: true,

		//to ignore TS errors during build (for now)
		typescript: {ignoreBuildErrors: true},
		//images: {
		//  /*TODO: improve setup
		//  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		//  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		//  */
		//  domains: [
		//		//'images.unsplash.com', // not required when using a unsplashLoader (all imgs come directly from images.unsplash.com)
		//  ],
		//},

		async headers() {
			const h = [
				{
					source: '/((?!api$|api/).*)',
					headers: [
						{
							key: 'X-Clacks-Overhead',
							value: 'GNU Terry Pratchett',
						}
					]
				},
			]

			if (process.env.NODE_ENV === 'production') {
				const securityHeaders = require('./src/core/securityHeaders.js');
				//console.log('securityHeaders', securityHeaders)
				if (securityHeaders.length > 0) {
					h.push(
						{ // https://nextjs.org/docs/advanced-features/security-headers#content-security-policy
							// Apply these headers to all routes in your application.
							source: '/:path*', // all incl. top-lvl
							headers: securityHeaders,
						}
					)
				}
			}

			return h
		},

	}
)
