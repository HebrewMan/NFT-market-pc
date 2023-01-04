import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import './index.scss'

export const Privacy: React.FC<any> = (props) => {
  const history = useHistory()
  const [type, setType] = useState<string>('')

  useEffect(() => {
    const state: any = history.location.state
    setType(state?.source)
  }, [history.location.state])

  // 服务协议 
  const serviceAgreement = () => {
    return (
      <>
        <p>1. INTRODUCTION</p>
        <p>Welcome to Diffgalaxy (“Company”, “we”, “our”, “us”)!</p>
        <p>These Terms of Service (“Terms”, “Terms of Service”) govern your use of our website located at Diffgalaxy.io (together or individually “Service”) operated by Diffgalaxy.</p>
        <p>Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages.</p>
        <p>Your agreement with us includes these Terms and our Privacy Policy (“Agreements”). You acknowledge that you have read and understood Agreements, and agree to be bound of them.</p>
        <p>IF YOU DO NOT AGREE WITH (OR CANNOT COMPLY WITH) AGREEMENTS ,THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.</p>
        <p>Supplemental terms and conditions or documents that may be posted on the Site from time to time are hereby expressly incorporated herein by reference.
          We reserve the right, in our sole discretion, to make changes or modifications to these Terms of Use at any time and for any reason.
          We will alert you about any changes by updating the “Last updated” date of these Terms of Use, and you waive any right to receive specific notice
          of each such change. Please ensure that you check the applicable Terms every time you use our Site so that you understand which Terms apply.
          You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Terms of Use by your
          continued use of the Site after the date such revised Terms of Use are posted.
        </p>
        <p>The information provided on the Site is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution
          or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly,
          those persons who choose to access the Site from other locations do so on their own initiative and are solely responsible for compliance with local laws,
          if and to the extent local laws are applicable.</p>
        <p> 2. ASSUMPTION OF RISK</p>
        <p>You accept and acknowledge:</p>
        <p>The value of an NFTs is subjective. Prices of NFTs are subject to volatility and fluctuations in the price of cryptocurrency can also materially and adversely affect NFT prices. You acknowledge that you fully understand this subjectivity and volatility and that you may lose money.</p>
      </>
    )
  }
  // 隐私条款
  const privacyTexy = () => {
    return (
      <>
        <p>
          Thank you for choosing to be part of our community at Diffgalaxy ("Diffgalaxy," "we," "us," or "our").
          We are committed to protecting your personal information and your right to privacy.
          If you have any questions or concerns about this privacy notice or our practices with regard to your personal information,
          please contact us at hi@Diffgalaxy.com.
        </p>
        <p>
          When you visit our website https://Diffgalaxy.com, and use our services, you trust us with your personal information.
          We take your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way possible what information we collect,
          how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important.
          If there are any terms in this privacy notice that you do not agree with, please discontinue use of our Sites and our services.
        </p>
        <p>
          This privacy notice applies to all information collected through our website (such as https://Diffgalaxy.com),
          and/or any related services, sales, marketing or events (we refer to them collectively in this privacy notice as the "Services").
        </p>
        <p>Please read this privacy notice carefully as it will help you make informed decisions about sharing your personal information with us.</p>
        <p>1. WHAT INFORMATION DO WE COLLECT?</p>
        <p>Personal information you disclose to us</p>
        <p>In Short: We collect personal information that you provide to us.</p>
        <p>We collect personal information that you voluntarily provide to us when you register on the express an interest in obtaining information about us or our products and Services,
          when you participate in activities on the (such as by posting messages in our online forums or entering competitions, contests or giveaways) or otherwise when you contact us.</p>
        <p>The personal information that we collect depends on the context of your interactions with us and the ,
          the choices you make and the products and features you use. The personal information we collect may include the following:</p>
        <p>All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information.</p>
        <p>Information automatically collected</p>
        <p>In Short: Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our .</p>
        <p>We automatically collect certain information when you visit, use or navigate the .
          This information does not reveal your specific identity (like your name or contact information) but may include device and usage information,
          such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name,
          country, location, information about how and when you use our and other technical information.
          This information is primarily needed to maintain the security and operation of our , and for our internal analytics and reporting purposes.</p>
        <p>Like many businesses, we also collect information through cookies and similar technologies.</p>
        <p>2. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</p>
        <p>In Short: We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
        <p>We may process or share your data that we hold based on the following legal basis:</p>
        <p>Consent: We may process your data if you have given us specific consent to use your personal information in a specific purpose.</p>
        <p>Legitimate Interests: We may process your data when it is reasonably necessary to achieve our legitimate business interests.</p>
        <p>Performance of a Contract: Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.</p>
        <p>Legal Obligations: We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process, such as in response to a court order or a subpoena (including in response to public authorities to meet national security or law enforcement requirements).</p>
        <p>Vital Interests: We may disclose your information where we believe it is necessary to investigate, prevent,
          or take action regarding potential violations of our policies, suspected fraud,
          situations involving potential threats to the safety of any person and illegal activities,
          or as evidence in litigation in which we are involved.</p>
        <p>More specifically, we may need to process your data or share your personal information in the following situations:</p>
        <p>Business Transfers. We may share or transfer your information in connection with, or during negotiations of,
          any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</p>
        <p>Affiliates. We may share your information with our affiliates, in which case we will require those affiliates to honor this privacy notice.
          Affiliates include our parent company and any subsidiaries, joint venture partners or other companies that we control or that are under common control with us.</p>
        <p>Business Partners. We may share your information with our business partners to offer you certain products, services or promotions.</p>
        <p>Other Users. When you share personal information or otherwise interact with public areas of the ,
          such personal information may be viewed by all users and may be publicly made available outside the in perpetuity.
          If you interact with other users of our and register for our through a social network (such as Facebook),
          your contacts on the social network will see your name, profile photo, and descriptions of your activity.
          Similarly, other users will be able to view descriptions of your activity, communicate with you within our , and view your profile.</p>
        <p>3. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</p>
        <p>In Short: We may use cookies and other tracking technologies to collect and store your information.</p>
        <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.</p>
        <p>4. HOW LONG DO WE KEEP YOUR INFORMATION?</p>
        <p>In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.</p>
        <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice,
          unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).
          No purpose in this notice will require us keeping your personal information for longer than 2 years.</p>
        <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information,
          or, if this is not possible (for example, because your personal information has been stored in backup archives),
          then we will securely store your personal information and isolate it from any further processing until deletion is possible.</p>
        <p>5. DO WE COLLECT INFORMATION FROM MINORS?</p>
        <p>In Short: We do not knowingly collect data from or market to children under 18 years of age.</p>
        <p>We do not knowingly solicit data from or market to children under 18 years of age. By using the ,
          you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the .
          If we learn that personal information from users less than 18 years of age has been collected,
          we will deactivate the account and take reasonable measures to promptly delete such data from our records.
          If you become aware of any data we may have collected from children under age 18, please contact us at.</p>
        <p>6. WHAT ARE YOUR PRIVACY RIGHTS?</p>
        <p>In Short: You may review, change, or terminate your account at any time.</p>
        <p>Account InformationIf you would at any time like to review or change the information in your account or terminate your account,
          you can: Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However,
          we may retain some information in our files to prevent fraud, troubleshoot problems,
          assist with any investigations, enforce our Terms of Use and/or comply with applicable legal requirements.</p>
        <p>7. CONTROLS FOR DO-NOT-TRACK FEATURES</p>
        <p>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can
          activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage
          no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to
          DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online
          tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice</p>
        <p>8. DO WE MAKE UPDATES TO THIS NOTICE?</p>
        <p>In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.</p>
        <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will
          be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a
          notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of
          how we are protecting your information.</p>
        <p>9. CONSENT</p>
        <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
      </>
    )
  }

  return (
    <div className='privacyWpaer'>
      <div className='privacyTitle'>{type === "policy" ? 'PRIVACY POLICY' : 'TERMS OF SERVICE'}</div>
      <div className='privacyTime'>Last updated: 2022-1-4</div>
      <div className='privacyConten'>
        {type === "policy" ? privacyTexy() : serviceAgreement()}
      </div>
    </div>
  )
}