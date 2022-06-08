import {Footer} from "../Footer";

const PotdLayout = ({children}) => {
	return (
		<>
			<div className={`h-full flex flex-col justify-between    overflow-hidden`}>

				{children}

				<div className={`flex-shrink-0 bottomDiv drop-shadowTEST`}>
					<div className={`h-full bottomInner`}>
						<div className="footer mx-auto  flex justify-around items-center flex-nowrap h-full asdfasdfasdf">
							<Footer withSep={false}/>
						</div>
					</div>
				</div>

			</div>
		</>
	)
}

export default PotdLayout
