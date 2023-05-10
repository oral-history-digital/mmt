import { useSWRConfig } from 'swr';
import { useTranslation } from 'react-i18next';

import { filesEndPoint, deleteFilesEndPoint } from '../api';
import { FILE_STATE_MISSING } from './constants';
import { UploadedFile } from './types';

export default function useHandleDeleteFile() {
  const { mutate } = useSWRConfig();
  const { t } = useTranslation();

  return async function handleDelete(file: UploadedFile) {
    let confirmed = true;
    if (file.state !== FILE_STATE_MISSING) {
      confirmed = confirm(t('modules.files.actions.delete_confirmation',
        { name: file.name }));
    }

    if (!confirmed) {
      return;
    }

    await fetch(deleteFilesEndPoint(file._id), {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    mutate(filesEndPoint);
  }
}
