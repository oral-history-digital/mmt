import React from 'react';
import { useTranslation } from 'react-i18next';

import { RequireAuth } from '../auth/index.js';
import UploadButton from './UploadButton.jsx';
import UploadedFiles from './UploadedFiles.jsx';

export default function UploadPage() {
  const { t } = useTranslation();

  return (
    <RequireAuth>
      <section className="section">
        <div className="container">
          <h1 className="title is-spaced">
            {t('modules.upload.title')}
          </h1>

          <UploadButton />

          <UploadedFiles className="mt-5" />
        </div>
      </section>
    </RequireAuth>
  );
}
