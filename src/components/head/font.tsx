// EXAMPLES
//
// Raleway
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800;900&display=swap" />
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800;900&display=optional" />
//
// Poppins
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" />
// 400,500,600,700 // <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins%3Aital%2Cwght%400%2C400%3B0%2C500%3B0%2C600%3B0%2C700%3B1%2C400%3B1%2C500%3B1%2C600%3B1%2C700&display=optional" />
//

/**
 * - Next.js: Fonts will be inlined automatically (IF Google Font or Typekit Font). For all other fonts (incl. self-hosted) this has to be done manually.
 * --- https://nextjs.org/docs/basic-features/font-optimization
 * --- https://font-display.glitch.me/
 *
 * NOTE: display=optional doesn't work at all for some reason (in Chrome)
 */
function GoogleFont({name = 'Raleway', display}: { name: string, display: string }) {
	// currently hardcoded to 400,500,600,700 (incl. italic)
	// TODO: remove unused styles
	let url = `https://fonts.googleapis.com/css2?family=${name}%3Aital%2Cwght%400%2C400%3B0%2C500%3B0%2C600%3B0%2C700%3B1%2C400%3B1%2C500%3B1%2C600%3B1%2C700`
	if (display) {
		url += `&display=${display}`
	}
	return (
		<>
			<link rel="preconnect" href="https://fonts.googleapis.com"/>
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
			<link rel="stylesheet" href={url}/>
		</>
	)
}

export {GoogleFont}
