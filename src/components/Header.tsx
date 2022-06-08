import SmartLink from "./SmartLink";
import {ChevronDoubleLeftIcon as ChevronLeftS, ChevronDoubleRightIcon as ChevronRightS} from "@heroicons/react/solid";
import {defaultTitleShort} from "../next-seo.config";

function Header({prevImgLink, nextImgLink, collectionId, backLinkParams, date}) {
	const date2 = date.split('/').join(' / ');

	return (
		<>

			<div className={`z-10 flex-shrink-0 text-center  topDiv shadow-smOFF`}>
				<div className={`flex justify-center items-center h-full w-full  topInner`}>

					<div className={`relative mx-auto  flex justify-between items-center flex-nowrap h-full`}>

						<div className="xs:leading-snug tracking-wide">
							<h1 className="m-0 mt-1.5 font-semibold">
								{defaultTitleShort}
								{/*
								{' - '}
								<SmartLink href={`https://unsplash.com/collections/${collectionId}${backLinkParams}`} className="colored-link">
									Archive
								</SmartLink>
								*/}
							</h1>
							<div className="subtitle font-medium">
								{date && prevImgLink && nextImgLink && <>
									{/* prevents looping + quick hack: off={links.prevImg === '/2'} */}
									<SmartLink off={prevImgLink === '/2'} title={"TO THE FUTURE"} href={`${prevImgLink}`} className="3xs-y-max:hidden text-[130%] px-1.5 2xl:px-[0.8vw]   leading-none xs:text-xs colored-link">
										<ChevronLeftS width={'1.1em'} height={'1.1em'} className="inline-block"/>
									</SmartLink>
									<span className="inline-block pt-0.5 tracking-wider tabular-nums">{date2}</span>
									<SmartLink off={nextImgLink === '/'} title={"TO THE PAST"} href={`${nextImgLink}`} className="3xs-y-max:hidden text-[130%] px-1.5 2xl:px-[0.8vw]   leading-none xs:text-xs colored-link">
										<ChevronRightS width={'1.1em'} height={'1.1em'} className="inline-block"/>
									</SmartLink>
								</>}
							</div>
						</div>

					</div>

				</div>
			</div>

		</>
	)
}

export { Header }
