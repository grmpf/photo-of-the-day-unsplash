/**
 * - Handles external links by NOT using next/link and setting target + rel
 * - Handles disabled links via "off" param (probably only for prototyping)
 * - Required wrapper to pass down props when using HeadlessUi.
 */

import Link from 'next/link'
import React, { PropsWithChildren, ComponentPropsWithoutRef } from "react";
import { LinkProps } from "next/dist/client/link";

const externalProps = {
	target: '_blank',
	rel: 'noopener noreferrer',
}
const disabledProps = {
	role: 'link', // to disable properly (this is odd and should be default aka not required)
	'aria-disabled': 'true', // to disable properly; <a> tag complains about this
}

declare type PropsExtraType = {
	off?: boolean // get a better name but avoid "disabled"
} & PropsWithChildren<LinkProps> & React.ComponentPropsWithoutRef<"a">;

/* or if a REF is required
const SmartLink = forwardRef((props, ref) => {
	const {
		href = '',
		children,
		off = false,
		as, passHref, prefetch, replace, scroll, shallow, locale, // next/link only
		...rest
	} = props
	return (
		<Link href={href} ...>
			<a ref={ref} {...rest}>{children}</a>
		</Link>
	)
})
*/

export default function SmartLink(props: PropsExtraType) {
	const {
		href = '',
		children,
		off = false,
		as, passHref, prefetch, replace, scroll, shallow, locale, // next/link only
		...rest
	} = props

	// internal links and NOT disabled (aka !OFF)
	if(!off && href.toString().indexOf('/') === 0) {
		return (
			<Link href={href}
				  as={as}
				  passHref={passHref}
				  prefetch={prefetch}
				  replace={replace}
				  scroll={scroll}
				  shallow={shallow}
				  locale={locale}
			>
				<a {...rest}>{children}</a>
			</Link>
		)
	}

	// external links AND/OR disabled (aka OFF)
	return (
		<a
			{...(!off ? {href: href.toString()} : {})} // only if not OFF
			{...(!off ? externalProps : {})} // only if NOT disabled (aka !OFF) and external (always true at this point IF !OFF)
			{...(off ? disabledProps : {})}

			{...rest}
		>
			{children}
		</a>
	)
}

export {
	SmartLink, SmartLink as HeadlessUiLink
}

