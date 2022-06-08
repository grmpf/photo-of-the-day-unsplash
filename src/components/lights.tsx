/**
 * FYI:
 * - The current implementation works but requires some weird calculations or the lightRay becomes distorted on extra large screens.
 *
 * IDEAS:
 * 1. Perspective + transform (current implementation) :(
 * 2. Use SVG with linearGradient A feGaussianBlur (this could then be stretched etc.)
 * 3. Use a gradient-border with blur filter.
 */

function Light1() {
	return (
		<div className="w-1/3 mb-1.5 mb-[1vh] rayTest">
			<div className="lightContainer">
				<div className="light pb-[85%]">
					{/* the lamp socket */}
				</div>
			</div>
			<div className="lightRay">
				{/* the light ray (could be an :after as well) */}
			</div>
		</div>
	)
}
function Light2() {
	return (
		<div className="w-1/3 mb-1.5 mb-[1vh] rayTest2">
			<div className="lightContainer">
				<div className="light pb-[85%]">
					{/* the lamp socket */}
				</div>
				{/* the light ray as :after */}
			</div>
		</div>
	)
}

//TESTING with some quick style overwrites
export function LightBar() {
	return (
		<>
			<div className="w-full mb-1.5 mb-[1vh] rayTest">
				<div className="lightContainer" style={{
					width: '80%',
					maxWidth: '100%',
					minWidth: '0',
				}}>
					<div className="light h-[2.4vh]">
						{/* the lamp socket */}
					</div>
				</div>
				<div className="lightRay" style={{
					width: '80%',
					maxWidth: '100%',
					minWidth: '0',
				}}>
					{/* the light ray (could be an :after as well) */}
				</div>
			</div>
		</>
	)
}


export function Spotlight3() {
    return (
        <>
			<Light1 />
			<Light1 />
			<Light1 />
		</>
    )
}
