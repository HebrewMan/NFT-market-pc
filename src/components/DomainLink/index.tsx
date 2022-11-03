import { isMobile } from 'react-device-detect';
import useWindowDimensions from '../../utils/layout';
import React from "react";
import './index.scss';

export const DomainLink = () => {
	const { width } = useWindowDimensions();
	return (
		<>
			<div className={`domian-link ${isMobile && width < 768 ? 'mobile-domian-link' : ''}`}>
				<span>The only official domain for Diffgalaxy is</span>
				<a href="https://nft.diffgalaxy.com">https://nft.diffgalaxy.com</a>
			</div>
		</>
	)
}