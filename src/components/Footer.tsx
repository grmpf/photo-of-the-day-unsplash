import { Fragment } from 'react'
import SmartLink from "./SmartLink";
import {gitHubRepoLink} from "../next-seo.config";
import {GitHub} from "./icons/misc";

const disabledProps = {
	disabled: true, // to exclude <Link> tag // DEPRECATED - smartlink can handle this now
	role: 'link', // to disable properly (this is odd and should be default aka not required)
	'aria-disabled': 'true', // to disable properly; <a> tag complains about this
}

// Simple links for the footer (currently disabled)
// TODO: add some default styles for a and a:hover etc. when in use
const links = [
	{
		url: '/lorem',
		content: 'Lorem',

		...disabledProps
	},
	/*
	{
		url: '/foobar',
		content: 'Foobar',

		...disabledProps
	},
	{
		url: '/impressum',
		content: 'Impressum',
	},
	*/
	{
		url: gitHubRepoLink,
		content: <span className="inline-block text-center"><GitHub width="1.2em" height="1.2em" className="inline-block mr-1.5 -mt-1"/>GitHub</span>,
	},
	{
		url: '/ipsum',
		content: 'Ipsum',

		...disabledProps
	},
]

function Footer({withSep = true}) {
	return (
		<>
			{links && links.map(({content, url, disabled, ...rest}, i) =>
				<Fragment key={i}>
					{withSep && i > 0 ? '|' : ''}
					{disabled
						? <a className="px-2 font-medium disabled disabled:text-slate-500" {...rest}>{content}</a>
						: <SmartLink href={url} className="px-2 font-medium" {...rest}>
							{content}
						</SmartLink>
					}
				</Fragment>
			)}
		</>
	)
}

export { Footer }
