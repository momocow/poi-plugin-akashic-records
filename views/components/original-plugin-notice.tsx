import { Callout } from '@blueprintjs/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

// poi runs every key through `escapeI18nKey` when it loads i18n/*.json, which
// strips `.`/`:` before whitespace or end of string, while `t()` looks the key up
// unescaped. Sentence keys would therefore never match, so the keys here are
// symbolic and the English wording lives in i18n/en-US.json like every other locale.
const NoticeCallout = styled(Callout)`
  margin-top: 16px;
`

// Shown in place of the logbook while the original plugin is running;
// `isOriginalPluginActive` in ../utils/original-plugin decides which one renders.
const OriginalPluginNotice: React.FC = () => {
  const { t } = useTranslation('poi-plugin-akashic-records-ex')

  return (
    <NoticeCallout
      intent="warning"
      icon="warning-sign"
      title={t('MigrationNoticeTitle')}
    >
      <p>{t('MigrationNoticeShared')}</p>
      <p>{t('MigrationNoticeConflict')}</p>
      <ol>
        <li>{t('MigrationNoticeStep1')}</li>
        <li>{t('MigrationNoticeStep2')}</li>
      </ol>
      <p>{t('MigrationNoticeAuto')}</p>
    </NoticeCallout>
  )
}

export default OriginalPluginNotice
