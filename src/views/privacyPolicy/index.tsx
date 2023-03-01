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
        <p>Welcome to HiSky (“Company”, “we”, “our”, “us”)!</p>
        <p>These Terms of Service (“Terms”, “Terms of Service”) govern your use of our website located at HiSky.io (together or individually “Service”) operated by HiSky.</p>
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
        <p>A lack of use or public interest in the creation and development of distributed ecosystems could negatively impact the development of those ecosystems and related applications, and could therefore also negatively impact the potential utility of NFTs.</p>
        <p>The regulatory regime governing blockchain technologies, non-fungible tokens, cryptocurrency, and other crypto-based items is uncertain,
          and new regulations or policies may materially adversely affect the development of the Service and the utility of NFTs.</p>
        <p>You are solely responsible for determining what, if any, taxes apply to your transactions. HiSky is not responsible for determining the taxes that apply to your NFTs.</p>
        <p>There are risks associated with purchasing items associated with content created by third parties through peer-to-peer transactions,
          including but not limited to, the risk of purchasing counterfeit items, mislabeled items,
          items that are vulnerable to metadata decay, items on smart contracts with bugs, and items that may become untransferable.
          You represent and warrant that you have done sufficient research before making any decisions to sell, obtain, transfer, or otherwise interact with any NFTs or accounts/collections.</p>
        <p>We do not control the public blockchains that you are interacting with and we do not control certain smart contracts and protocols that may be integral to your ability
          to complete transactions on these public blockchains. Additionally, blockchain transactions are irreversible and HiSky has no ability to reverse any transactions on the blockchain.</p>
        <p>There are risks associated with using Internet and blockchain based products, including, but not limited to, the risk associated with hardware, software,
          and Internet connections, the risk of malicious software introduction, and the risk that third parties may obtain unauthorized access to your third-party wallet or Account.
          You accept and acknowledge that HiSky will not be responsible for any communication failures, disruptions, errors, distortions or delays you may experience when using the
          Service or any Blockchain network, however caused.</p>
        <p>The Service relies on third-party platforms and/or vendors. If we are unable to maintain a good relationship with such platform providers and/or vendors;
          if the terms and conditions or pricing of such platform providers and/or vendors change; if we violate or cannot comply with the terms and conditions of such platforms and/or vendors;
          or if any of such platforms and/or vendors loses market share or falls out of favor or is unavailable for a prolonged period of time, access to and use of the Service will suffer.</p>
        <p>HiSky reserves the right to hide collections, contracts, and items affected by any of these issues or by other issues. Items you purchase may become inaccessible on HiSky.
          Under no circumstances shall the inability to view items on HiSky or an inability to use the Service in conjunction with the purchase, sale,
          or transfer of items available on any blockchains serve as grounds for a claim against HiSky.</p>
        <p>IF YOU HAVE A DISPUTE WITH ONE OR MORE USERS, YOU RELEASE US FROM CLAIMS, DEMANDS, AND DAMAGES OF EVERY KIND AND NATURE, KNOWN AND UNKNOWN, ARISING OUT OF OR IN ANY WAY CONNECTED WITH SUCH DISPUTES.
          IN ENTERING INTO THIS RELEASE YOU EXPRESSLY WAIVE ANY PROTECTIONS (WHETHER STATUTORY OR OTHERWISE) THAT WOULD OTHERWISE LIMIT THE COVERAGE OF THIS RELEASE TO INCLUDE THOSE CLAIMS WHICH YOU MAY KNOW
          OR SUSPECT TO EXIST IN YOUR FAVOR AT THE TIME OF AGREEING TO THIS RELEASE.</p>
        <p>3. PROPRIETARY RIGHTS</p>
        <p>The intellectual property generated by core contributors to HiSky and all material generated by Service are the property of HiSky. You may not distribute, modify,
          transmit, reuse, download, repost, copy, or use said Content, whether in whole or in part, for commercial purposes or for personal gain, without express advance written permission from us.</p>
        <p>Provided that you are eligible to use the Site, you are granted a limited license to access and use the Site and to download or print a copy of any portion of the Content to which you have properly
          gained access solely for your personal, non-commercial use. We reserve all rights not expressly granted to you in and to the Site, the Content and the Marks.</p>
        <p>4. THIRD-PARTY CONTENT AND SERVICES</p>
        <p>HiSky helps you explore NFTs created by third parties and interact with different blockchains. HiSky does not make any representations or warranties about this third-party content visible
          through our Service, including any content associated with NFTs displayed on the Service, and you bear responsibility for verifying the legitimacy,
          authenticity, and legality of NFTs that you purchase from third-party sellers. We also cannot guarantee that any NFTs visible on HiSky will always remain visible and/or available to be bought,
          sold, or transferred.</p>
        <p>5. PROHIBITED USES</p>
        <p>You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:</p>
        <p>In any way that violates any applicable national or international law or regulation.For the purpose of exploiting, harming,
          or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</p>
        <p>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</p>
        <p>To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.
          In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful,
          or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</p>
        <p>To engage in any other conduct that restricts or inhibits anyone’s use or enjoyment of Service, or which, as determined by us,may harm or offend Company or users of Service or expose them to liability.Additionally, you agree not to:</p>
        <p>Use Service in any manner that could disable, overburden, damage, or impair Service or interfere with any other party’s use of Service, including their ability to engage in real time activities through Service.</p>
        <p>Use any robot, spider, or other automatic device, process, or means to access Service for any purpose, including monitoring or copying any of the material on Service.</p>
        <p>Use any manual process to monitor or copy any of the material on Service or for any other unauthorized purpose without our prior written consent.</p>
        <p>Use any device, software, or routine that interferes with the proper working of Service.Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful.</p>
        <p>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of Service, the server on which Service is stored, or any server, computer, or database connected to Service.</p>
        <p>Attack Service via a denial-of-service attack or a distributed denial-of-service attack.
          Bypass any instructions that control access to the Service, including attempting to circumvent any rate limiting systems by using multiple API keys,
          or obfuscating the source of traffic you send to HiSky;Take any action that may damage or falsify Company rating.Otherwise attempt to interfere with the proper working of Service.</p>
        <p>6. USER REPRESENTATIONS</p>
        <p>By using the Site, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Terms of Use;
          (2) you are not a minor in the jurisdiction in which you reside; (3) you will not access the Site through automated or non-human means,
          whether through a bot, script, or otherwise; (4) you will not use the Site for any illegal or unauthorized purpose;
          and (5) your use of the Site will not violate any applicable law or regulation.
        </p>
        <p>If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Site (or any portion thereof).</p>
        <p>7. REFUNDS POLICY</p>
        <p>All sales are final and no refund will be issued.</p>
        <p>8. PRODUCTS OR SERVICES</p>
        <p>Data and images of products on the Site may be provided by third-party services.</p>
        <p>We have made every effort to display as accurately as possible the data and images of the products that appear on the Site. We cannot guarantee that your computer monitor's display of any data or images will be accurate or update-to-date.</p>
        <p>We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction. We may exercise this right on a case-by-case basis. We reserve the right to limit the quantities of any products or services that we offer.</p>
        <p>We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the Service will be corrected.</p>
        <p>9. THIRD-PARTY LINKS</p>
        <p>Certain content, products and services available via our Service may include materials from third-parties.</p>
        <p>Third-party links on the Site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or services of third-parties.</p>
        <p>We are not liable for any harm or damages related to the purchase or use of goods, services, resources, content,
          or any other transactions made in connection with any third-party websites. Please review carefully the third-party's policies and practices and make sure you understand them before you engage in any transaction.
          Complaints, claims, concerns, or questions regarding third-party products should be directed to the third-party.
        </p>
        <p> 10. COPYRIGHT POLICY </p>
        <p>
          We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on Service infringes on the copyright or other intellectual property rights ("Infringement") of any person or entity.
        </p>
        <p>If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via Discord.
        </p>
        <p>You may be held accountable for damages (including costs and attorneys’ fees) for misrepresentation or bad-faith claims on the infringement of any Content found on and/or through Service on your copyright.
        </p>
        <p>11. ERROR REPORTING AND FEEDBACK
        </p>
        <p>You may provide us either directly on Discord or via third party sites and tools with information and feedback concerning errors, suggestions for improvements, ideas, problems, complaints,
          and other matters related to our Service ("Feedback"). You acknowledge and agree that: (i) you shall not retain, acquire or assert any intellectual property right or other right,
          title or interest in or to the Feedback; (ii) Company may have development ideas similar to the Feedback; (iii) Feedback does not contain confidential information or proprietary
          information from you or any third party; and (iv) Company is not under any obligation of confidentiality with respect to the Feedback. In the event the transfer of the ownership to
          the Feedback is not possible due to applicable mandatory laws, you grant Company and its affiliates an exclusive, transferable, irrevocable, free-of-charge, sub-licensable,
          unlimited and perpetual right to use (including copy, modify, create derivative works, publish, distribute and commercialize) Feedback in any manner and for any purpose.
        </p>
        <p>12. LINKS TO OTHER WEB SITES
        </p>
        <p>Our Service may contain links to third party web sites or services that are not owned or controlled by HiSky.
        </p>
        <p>HiSky has no control over, and assumes no responsibility for the content, privacy policies, or practices of any third party web sites or services. We do not warrant the offerings of any of these entities/individuals or their websites.
        </p>
        <p>YOU ACKNOWLEDGE AND AGREE THAT COMPANY SHALL NOT BE RESPONSIBLE OR LIABLE, DIRECTLY OR INDIRECTLY, FOR ANY DAMAGE OR LOSS CAUSED OR ALLEGED TO BE CAUSED BY OR IN CONNECTION WITH USE OF OR RELIANCE ON ANY SUCH CONTENT, GOODS OR SERVICES AVAILABLE ON OR THROUGH ANY SUCH THIRD PARTY WEB SITES OR SERVICES.
        </p>
        <p>WE STRONGLY ADVISE YOU TO READ THE TERMS OF SERVICE AND PRIVACY POLICIES OF ANY THIRD PARTY WEB SITES OR SERVICES THAT YOU VISIT.
        </p>
        <p>13. DISCLAIMER OF WARRANTY</p>
        <p>THESE SERVICES ARE PROVIDED BY COMPANY ON AN "AS IS" AND "AS AVAILABLE" BASIS. COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THEIR SERVICES, OR THE INFORMATION, CONTENT OR MATERIALS INCLUDED THEREIN. YOU EXPRESSLY AGREE THAT YOUR USE OF THESE SERVICES, THEIR CONTENT, AND ANY SERVICES OR ITEMS OBTAINED FROM US IS AT YOUR SOLE RISK.
        </p>
        <p>NEITHER COMPANY NOR ANY PERSON ASSOCIATED WITH COMPANY MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY,
          ACCURACY, OR AVAILABILITY OF THE SERVICES. WITHOUT LIMITING THE FOREGOING, NEITHER COMPANY NOR ANYONE ASSOCIATED WITH COMPANY REPRESENTS OR WARRANTS THAT THE SERVICES,
          THEIR CONTENT, OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES WILL BE ACCURATE, RELIABLE, ERROR-FREE, OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED,
          THAT THE SERVICES OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS OR THAT THE SERVICES OR ANY SERVICES OR ITEMS OBTAINED THROUGH
          THE SERVICES WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
        </p>
        <p>COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR PARTICULAR PURPOSE.
        </p>
        <p>THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.
        </p>
        <p>14. LIMITATION OF LIABILITY
        </p>
        <p>
          EXCEPT AS PROHIBITED BY LAW, YOU WILL HOLD US AND OUR OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS HARMLESS FOR ANY INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL,
          OR CONSEQUENTIAL DAMAGE, HOWEVER IT ARISES (INCLUDING ATTORNEYS’ FEES AND ALL RELATED COSTS AND EXPENSES OF LITIGATION AND ARBITRATION, OR AT TRIAL OR ON APPEAL,
          IF ANY, WHETHER OR NOT LITIGATION OR ARBITRATION IS INSTITUTED), WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE, OR OTHER TORTIOUS ACTION, OR ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT,
          INCLUDING WITHOUT LIMITATION ANY CLAIM FOR PERSONAL INJURY OR PROPERTY DAMAGE, ARISING FROM THIS AGREEMENT AND ANY VIOLATION BY YOU OF ANY FEDERAL, STATE, OR LOCAL LAWS, STATUTES, RULES,
          OR REGULATIONS, EVEN IF COMPANY HAS BEEN PREVIOUSLY ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. EXCEPT AS PROHIBITED BY LAW, IF THERE IS LIABILITY FOUND ON THE PART OF COMPANY,
          IT WILL BE LIMITED TO THE AMOUNT PAID FOR THE PRODUCTS AND/OR SERVICES, AND UNDER NO CIRCUMSTANCES WILL THERE BE CONSEQUENTIAL OR PUNITIVE DAMAGES. SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF PUNITIVE,
          INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE PRIOR LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU.
        </p>
        <p>15. TERMINATION</p>
        <p>We may terminate or suspend your account and bar access to Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of Terms.
        </p>
        <p>If you wish to terminate your account, you may simply discontinue using Service.</p>
        <p>All provisions of Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
        </p>
        <p>16. GOVERNING LAW
        </p>
        <p>These Terms shall be governed and construed in accordance with all applicable laws, which governing law applies to agreement without regard to its conflict of law provisions.
        </p>
        <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service and supersede and replace any prior agreements we might have had between us regarding Service.
        </p>
        <p>17. CHANGES TO SERVICE
        </p>
        <p>We reserve the right to withdraw or amend our Service, and any service or material we provide via Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of Service is unavailable at any time or for any period. From time to time, we may restrict access to some parts of Service, or the entire Service, to users, including registered users.
        </p>
        <p>18. AMENDMENTS TO TERMS</p>
        <p>We may amend Terms at any time by posting the amended terms on this site. It is your responsibility to review these Terms periodically.
        </p>
        <p>Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes. You are expected to check this page frequently so you are aware of any changes, as they are binding on you.
        </p>
        <p>By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use Service.
        </p>
        <p>19. WAIVER AND SEVERABILITY
        </p>
        <p>No waiver by Company of any term or condition set forth in Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure of Company to assert a right or provision under Terms shall not constitute a waiver of such right or provision.
        </p>
        <p>If any provision of Terms is held by a court or other tribunal of competent jurisdiction to be invalid, illegal or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of Terms will continue in full force and effect.
        </p>
        <p>20. ACKNOWLEDGEMENT
        </p>
        <p>BY USING SERVICE OR OTHER SERVICES PROVIDED BY US, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM.
        </p>
      </>
    )
  }
  // 隐私条款
  const privacyTexy = () => {
    return (
      <>
        <p>
          Thank you for choosing to be part of our community at HiSky ("HiSky," "we," "us," or "our").
          We are committed to protecting your personal information and your right to privacy.
          If you have any questions or concerns about this privacy notice or our practices with regard to your personal information,
          please contact us at hi@HiSky.com.
        </p>
        <p>
          When you visit our website https://HiSky.com, and use our services, you trust us with your personal information.
          We take your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way possible what information we collect,
          how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important.
          If there are any terms in this privacy notice that you do not agree with, please discontinue use of our Sites and our services.
        </p>
        <p>
          This privacy notice applies to all information collected through our website (such as https://HiSky.com),
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