import {SVGProps} from "react";

export type LogoType = {
	color?: string | undefined;
	color2?: string | undefined;
	width?: string | undefined;
	height?: string | undefined;
} & SVGProps<SVGSVGElement>

/**
 * USAGE
 * 1) Default (with radialGradient)
 * <Logo />
 * 2) Auto-adjusting to font-size
 * <Logo width={'1em'} height={'1em'} />
 * 3) Size overwrite
 * <Logo width={'32px'} height={'32px'} />
 */
function Logo({ color = undefined, color2 = undefined, width = undefined, height = undefined, ...props }: LogoType) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
			 xmlSpace="preserve"
			 viewBox="0 0 16 16"
			 width={width || 16}
			 height={height || 16}
			 {...props}
		>
			<path fill={color ? color : 'url(#gradient)'} d="M15,1l-14,-0c-0.557,-0 -1,0.454 -1,1.011l0,11.989c0,0.557 0.443,1.011 1,1.011l14,-0c0.557,-0 1,-0.454 1,-1.011l0,-11.989c0,-0.557 -0.443,-1.011 -1,-1.011Zm-3.613,7.638c-0.109,-0.128 -0.277,-0.227 -0.467,-0.227c-0.186,0 -0.317,0.088 -0.466,0.208l-0.682,0.576c-0.142,0.102 -0.255,0.172 -0.419,0.172c-0.157,-0 -0.299,-0.059 -0.401,-0.15c-0.037,-0.033 -0.103,-0.095 -0.157,-0.149l-1.962,-2.122c-0.146,-0.168 -0.364,-0.274 -0.609,-0.274c-0.244,0 -0.47,0.121 -0.612,0.285l-4.612,5.563l0,-10.093c0.036,-0.248 0.23,-0.427 0.478,-0.427l13.041,0c0.251,0 0.455,0.186 0.47,0.438l0.011,10.09l-3.613,-3.89Z"/>
			<path fill={color2 ? color2 : '#bbb'} d="M11.5,7c0.828,0 1.5,-0.672 1.5,-1.5c0,-0.828 -0.672,-1.5 -1.5,-1.5c-0.828,0 -1.5,0.672 -1.5,1.5c0,0.828 0.672,1.5 1.5,1.5Z"/>
			{!color && <defs>
				<radialGradient id="gradient" cx="10" cy="6" r="84" gradientUnits="userSpaceOnUse" >
					<stop stopColor="#5299d1" offset="0.00343514"/>
					<stop stopColor="#1d508f" offset="0.3"/>
					<stop stopColor="#04142e" offset="1"/>
				</radialGradient>
			</defs>}
		</svg>
	)
}

function LogoColor({ color= 'currentColor', color2 = 'currentColor', width = undefined, height = undefined, ...props }) {
	return Logo({ color, color2, width, height, ...props })
}

export default Logo
export {
	Logo, Logo as LogoGradient,
	LogoColor,
}
