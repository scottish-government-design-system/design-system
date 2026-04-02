/**
 * Format bytes as human-readable text.
 *
 * @param {number} bytes Number of bytes.
 * @param {boolean} isSI True to use metric (SI) units, aka powers of 1000. False to use binary (IEC), aka powers of 1024.
 * @param {number} dp Number of decimal places to display.
 *
 * @return {string} Formatted string.
 */
export default function (bytes: number, isSI: boolean=true, dp: number=1): string {
  const thresh = isSI ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = isSI
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let unitIndex = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++unitIndex;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && unitIndex < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[unitIndex];
}
