/** IDEA
 * - A title should be set which describes the page.
 * - Avoid dates because the content changes on a daily basis.
 * - ...
 *
 * KNOWN ISSUES
 * - Wording problems with "actually showing images from yesterday and older". At the end, it just doesn't make sense to have an app showing ONLY old stuff, so let's just lie about that fact :)
 * - You don't actually want anyone to share a page to outdated data (exception: THE current "Photo of the Day" which changes daily).
 * - Lack of data (about if and when new photos are added).
 *
 * Keep in mind: this is somewhat similar to an annual event e.g. "Event XY" [/event-xy] (not "Event XY 2021" [/event-xy-2021])
 * ... with the extras that the content changes once a day and - if cached - the data should stay true (exception: image and share data).
 *
 *
 * NOTE:
 * I don't actually recommend to have multiple pages set up like this for numerous reasons (see "Known Issues")
 * BUT:
 *   - It's a demo and for testing different behaviour so there should be at least some interaction.
 *   - This setup will change again eventually.
 */



export type Link = {
	key: string | null | undefined | false;
	path: string;
	pageTitle?: string; // required (excl. the homepage). The title can't really be dynamic because the pages update daily (indexed dates etc. would be really bad).

	noPreGen?: boolean; // currently this is only for testing paths included/excluded in getStaticPaths
}

const potdLinks: Link[] = [
	{
		key: null,
		path: '/',
		//pageTitle: 'Yesterday', // not required for the homepage
		//pageTitle: 'Today', // not required for the homepage
	},

	// This app works best as single-page app so past this line is non-optimal and for demo/testing purposes only.
	{
		key: '1',
		path: '/1', // '/2nd' ?
		//pageTitle: 'Two days ago', // the ugly TRUTH
		pageTitle: 'Yesterday', // the pretty LIE
	},
	{
		key: '2',
		path: '/2', // '/3rd' ?
		//pageTitle: 'Three days ago',
		pageTitle: 'Two days ago'
	},
	{
		key: '3',
		path: '/3',
		//pageTitle: 'Four days ago',
		pageTitle: 'Three days ago',

		noPreGen: true,
	},
	{
		key: '4',
		path: '/4',
		//pageTitle: 'Five days ago',
		pageTitle: 'Four days ago',

		noPreGen: true,
	},
	{
		key: '5',
		path: '/5',
		//pageTitle: 'Six days ago',
		pageTitle: 'Five days ago',

		noPreGen: true,
	},
]

export default potdLinks
