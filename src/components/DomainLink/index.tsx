import useWindowDimensions from '../../utils/layout';
import { useTranslation, Trans } from 'react-i18next';
import React from 'react';
import './index.scss';

export const DomainLink = () => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  return (
    <>
      <div className={`domian-link`}>
        <Trans t={t} i18nKey='domainNotice'>
          The only official domain for Diffgalaxy is
          <a href='https://www.diffgalaxy.io'>https://www.diffgalaxy.io</a>
        </Trans>
      </div>
    </>
  );
};
