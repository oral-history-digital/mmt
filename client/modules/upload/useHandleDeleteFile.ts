import { useSWRConfig } from 'swr';
import { useTranslation } from 'react-i18next';

import { filesEndPoint, deleteFilesEndPoint } from '../api';
import { RegisteredFile } from '../upload_queue';
import { FILE_STATE_COMPLETE } from './constants';

export default function useHandleDeleteFile() {
  const { mutate } = useSWRConfig();
  const { t } = useTranslation();

  return async function handleDelete(file: RegisteredFile) {
    let confirmed = true;
    if (file.state === FILE_STATE_COMPLETE) {
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
