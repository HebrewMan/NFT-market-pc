
import useWindowDimensions from '../../utils/layout';
import React from "react";
import './index.scss';

export const DomainLink = () => {
	const { width } = useWindowDimensions();
	return (
		<>
			<div className={`domian-link`}>
				<span>The only official domain for Diffgalaxy is</span>
				<a href="https://nft.diffgalaxy.com">https://nft.diffgalaxy.com</a>
			</div>
		</>
	)
}