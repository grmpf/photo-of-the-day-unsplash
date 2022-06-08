import {getCollectionPhotos} from "../libs/unsplashApi";
import {getCustomThumbPath} from "../libs/unsplashUrl";
import {getPlaiceholder} from "plaiceholder";
import {cleanupForAttrSpecial} from "../libs/utils/string";
import {removeEmojisEtc} from "../libs/utils/stringNode";
import {TinyColor} from "@ctrl/tinycolor";

async function getPhotos(photoOptions: { per_page: number; id: string; page: number }) {
	const photos = await getCollectionPhotos(photoOptions)

	// let revalidation fail without photo
	if (!(photos && photos.length > 0)) {
		throw new Error(`Failed to fetch photos`)
	}

	// Reducing data before passing as props
	const photosReduced = []
	for (let p of photos) {
		const altTmp = p.alt_description // || p.description; // p.description is not very meaningful
		const thumbUrl = getCustomThumbPath(p.urls.raw);

		const {base64} = await getPlaiceholder(
			thumbUrl
			, {size: 16} // default: 4 (4 - 64)
		);

		// PREP for multiple imgs on the wall (frame border and maybe backdrop/glow in darkmode)
		const colorTmp = new TinyColor(p.color)
		const colorNorm = colorTmp.brighten(22 - (100/255 * colorTmp.getBrightness())) // normalize perceived brightness to 22%

		photosReduced.push({ // this currently represents the unsplash API but without some data (until it's knows what's needed)
			id: p.id,
			width: p.width,
			height: p.height,
			alt: altTmp ? cleanupForAttrSpecial(altTmp) : '',
			color: p.color,
			color2: colorNorm.toHexString(), // custom key (non-default by unsplash)
			//color3: colorNorm.setAlpha(0.5).toRgbString(), // custom key (non-default by unsplash)
			urls: {
				raw: p.urls.raw, // passed to the image loader (don't use raw w/o image loader)
				//thumb: p.urls.thumb, // default thumb; might be way off to what's happening in the image loader; something like: https://images.unsplash.com/photo-1648134503606-f89fd3198c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTY2MjJ8MHwxfGNvbGxlY3Rpb258MjF8MzE3MDk5fHx8fHwyfHwxNjQ5NTY4MDg1&ixlib=rb-1.2.1&q=80&w=200
				thumb: `${thumbUrl}`, // thumbnail with the same settings as the image loader
				blurDataURL: base64, // custom key (non-default by unsplash)
			},

			links: {
				html: p.links.html,
			},
			user: {
				id: p.user.id,
				name: removeEmojisEtc(p.user.name),
				twitter_username: p.user.twitter_username, // without the @
				links: {
					html: p.user.links.html
				},
			},

			//TODO: flatten to one level - but currently it still represents the unsplash API (+ extras)
			//url_raw: p.urls.raw,
			//url_thumb: p.urls.thumb,
			//backlink: p.links.html,
			//user_id: p.user.id,
			//user_name: p.user.name,
			//user_backlink: p.user.links.html,
		})
	}
	return photosReduced;
}

export { getPhotos }
