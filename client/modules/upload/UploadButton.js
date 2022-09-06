import { useTranslation } from 'react-i18next';
import { GrUpload } from 'react-icons/gr';

export default function UploadButton() {
    const { t } = useTranslation();

    function handleFileChange() {

    }

    return (
        <div className="file is-boxed">
            <label className="file-label">
                <input
                    className="file-input"
                    type="file"
                    name="files"
                    id="file-input"
                    accept="video/*,audio/*"
                    multiple
                    onChange={handleFileChange}
                />
                <span className="file-cta">
                    <span className="file-icon">
                        <GrUpload />
                    </span>
                    <span className="file-label">
                        {t('modules.upload.select_files')}
                    </span>
                </span>
            </label>
        </div>
    );
}
