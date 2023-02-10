/*
 * Partially taken from:
 * https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
 */
export default function formatBytes(bytes, locale, decimals = 2) {
  if (!+bytes) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const number = parseFloat((bytes / Math.pow(k, i)).toFixed(dm)).toLocaleString(locale);
  const unit = sizes[i];

  return `${number} ${unit}`;
}
