import React from "react";
import './index.scss'

export const Footer = () => {
	return (
		<>
			<div className='pc-footer'>
				<div className='footer-left'>
				<img src={require('../../assets/logo.png')} alt='' />
					<div className="desc">Diffgalaxy Make NFT Trading Easier</div>
				</div>
				<div className='footer-right'>
					<div className="copyright">Copyright 2022. All Rights Reserved.</div>
					<div className="links">
						<span>Legal Notice</span>
						<span>Terms of Service</span>
						<span>Privacy Policy</span>
					</div>
				</div>
			</div>
		</>
	)
}
