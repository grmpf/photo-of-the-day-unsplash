import type { AppProps } from 'next/app'
import '../styles/globals.scss'
import { HeadDefaults } from '../components/head/HeadDefaults'


const App = ({ Component, pageProps }: AppProps) => {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout || function getLayout(page) { return page }

	//return (
	return getLayout(
		<>
			<HeadDefaults />

			<Component {...pageProps} />
		</>
	)
}

export default App
