/**
 * - https://unsplash.com/documentation#list-collections
 * - https://unsplash.com/documentation#list-photos
 * - https://unsplash.com/documentation#get-a-random-photo
 * - https://unsplash.com/documentation#search-photos
 * - https://assets.imgix.net/unsplash/bridge.jpg?w=640&h=480&q=85&auto=format&sharp=10&fit=crop&crop=faces%2Centropy%2Cedges%2Ccenter&txtalign=middle,center&txtclr=fff&txtsize=100&txtfit=max&txt-pad=50&txtfont=helvetica,bold&txt=Lorem%20Ipsum
 *
 * NOTE: there is an official package `unsplash-js` but is doesn't work very well (v7.0.15)
 * TODO: test/handle possible errors + return with a status codes
 *
 * P.S. It happens all unsplash services are unavailable - incl. their website. Looks like an IP-block (workaround: VPN).
 * This has nothing to do with the api rate limit (which is quite low in demo mode) and makes this behaviour extra odd. It looks like "block after n-requests from the same IP within n-minutes" (without doing any DoS attacks).
 */

import {stringify} from 'querystring';

const API_CLIENTID = process.env.UNSPLASH_CLIENTID || 'n/a';
const API_URL_PHOTOS = `https://api.unsplash.com/photos`;
const API_URL_SEARCH_PHOTOS = `https://api.unsplash.com/search/photos`;
const API_URL_COLLECTIONS = `https://api.unsplash.com/collections`;
const API_URL_PHOTOS_RANDOM = `https://api.unsplash.com/photos/random`;

// OR ?client_id=${API_CLIENTID}
const requestGetOptions = {
	method: 'GET',
	...(API_CLIENTID && {headers: { Authorization: `Client-ID ${API_CLIENTID}` }}),
};


async function getCollectionPhotos({id, page, per_page, orientation}: { id: string | number, page?: string | number, per_page?: string | number, orientation?: string }) {
	const params = {
		//client_id: API_CLIENTID, // already in the header

		...(page && {page: page}), // Optional; default: 1
		...(per_page && {per_page: per_page}), // Optional; default: 10
		...(orientation && {orientation: orientation}), // Optional; landscape, portrait, squarish
	}

	const url = `${API_URL_COLLECTIONS}/${id}/photos?${stringify(params)}`;

	const tmp = await fetch(url, requestGetOptions)
		.then((response) => response.json())
		.then((result) => {
			if (result.errors) {
				// handle error here
				//console.log('error occurred: ', result);
				console.log('error occurred: ', result.errors[0]);
			} else {
				return result;
			}
			return [];
		});

	//console.log('getCollectionPhotos tmp.length', tmp.length)
	return tmp
}









///////////////////////////////////////////////////////////////////
/////////// AT THE MOMENT, THE REST IS ONLY FOR TESTING ///////////
///////////////////////////////////////////////////////////////////

// Note: You can't use the collections or topics filtering with query parameters in the same request
async function getRandomPhotos({searchString, collections, topics, username, orientation, content_filter, count = 1}: { searchString?: string, collections?: string | number, topics?: string, username?: string, orientation?: string, content_filter?: string, count?: string | number }) {
	const params = {
		client_id: API_CLIENTID, // already in the header

		...(searchString && {query: searchString}), // prio 1
		...(!searchString && collections && {collections: collections}), // prio 2
		...(!searchString && !collections && topics && {topics: topics}), // prio 3
		...(username && {username: username}),
		...(orientation && {orientation: orientation}), // optional; landscape, portrait, squarish
		...(content_filter && {content_filter: content_filter}),
		...(count && {count: count}), // setting count (even 1) returns an array (otherwise just a single image)
	}
	const url = `${API_URL_PHOTOS_RANDOM}?${stringify(params)}`;

	const tmp = await fetch(url, requestGetOptions)
		.then((response) => {
			if (!response.ok) {
				console.log(`${response.status} - ${response.statusText} - ${response.url}`)
				throw new Error('Network response was not OK');
			}
			return response.json();
		})
		.then((result) => result);

	//console.log('getRandomPhotos tmp.length', tmp.length)
	return tmp
}


async function searchPhotos({searchString, orientation, collections, page, per_page, order_by, content_filter, color}: { searchString: string, page?: string | number, per_page?: string | number, order_by?: string, collections?: string | number, content_filter?: string, color?: string, orientation?: string }) {
	const params = {
		//client_id: API_CLIENTID, // already in the header

		...(searchString && {query: searchString.toString()}),
		...(page && {page: page}), // default: 1
		...(per_page && {per_page: per_page}), // Optional; default: 10
		...(order_by && {order_by: order_by}), // Optional; relevant (default), latest
		...(collections && {collections: collections}), // Optional;
		...(content_filter && {content_filter: content_filter}), // Optional; THIS DOES NOT BEHAVE; low (default), high
		...(color && {color: color}), // Optional; black_and_white, black, white, yellow, orange, red, purple, magenta, green, teal, blue
		...(orientation && {orientation: orientation}), // Optional; landscape, portrait, squarish
	}
	const url = `${API_URL_SEARCH_PHOTOS}?${stringify(params)}`;

	const tmp = await fetch(url, requestGetOptions)
		.then((response) => response.json())
		.then((result) => {
			const res = result.results
			//console.log('searchPhotos results', res)
			return res
		});

	return tmp
}


async function getEditorialPhotos({page, per_page, order_by}: {page?: string | number, per_page?: string | number, order_by?: string}) {
	const params = {
		//client_id: API_CLIENTID, // already in the header

		...(page && {page: page}), // default: 1
		...(per_page && {per_page: per_page}), // default: 10
		...(order_by && {order_by: order_by}), // latest (default), oldest, popular
	}

	const url = `${API_URL_PHOTOS}?${stringify(params)}`;

	const tmp = await fetch(url, requestGetOptions)
		.then((response) => response.json())
		.then((result) => result);

	//console.log('getEditorialPhotos tmp.length', tmp.length)
	return tmp
}


async function getPhotoById(id: string | number) {
	//const url = `${API_URL_PHOTOS}/${id}&client_id=${API_CLIENTID}`;
	const url = `${API_URL_PHOTOS}/${id}`;

	const tmp = await fetch(url, requestGetOptions)
		.then((response) => response.json())
		.then((result) => result);

	//console.log('tmp', tmp)
	return tmp
}




async function getCollection({id}: { id: string | number}) {
	const url = `${API_URL_COLLECTIONS}/${id}`;

	const tmp = await fetch(url, requestGetOptions)
		.then((response) => response.json())
		.then((result) => {
			if (result.errors) {
				// handle error here
				//console.log('error occurred: ', result);
				console.log('error occurred: ', result.errors[0]);
			} else {
				return result;
			}
			return [];
		});

	//console.log('getCollectionPhotos tmp.length', tmp.length)
	return tmp
}



export {
	getCollectionPhotos,

	// testing
	searchPhotos, getRandomPhotos, getEditorialPhotos, getPhotoById, getCollection
}

