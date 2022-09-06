import { useTranslation } from 'react-i18next';

import { RequireAuth } from '../auth';
import UploadButton from './UploadButton';
import UploadedFiles from './UploadedFiles';

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
