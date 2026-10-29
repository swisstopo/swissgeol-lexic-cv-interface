export function waitForCsvPaint(signal: AbortSignal): Promise<boolean> {
  return new Promise(resolve => {
    if (signal.aborted) { resolve(false); return; }
    let frame = 0;
    const finish = (ready: boolean) => {
      cancelAnimationFrame(frame);
      signal.removeEventListener('abort', abort);
      resolve(ready);
    };
    const abort = () => finish(false);
    signal.addEventListener('abort', abort, { once: true });
    // The second frame lets the browser paint the busy state before serialization.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => finish(true));
    });
  });
}

export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  let anchor: HTMLAnchorElement | undefined;
  try {
    anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
  } finally {
    anchor?.remove();
    // Keep the URL alive through the browser's download handoff.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
