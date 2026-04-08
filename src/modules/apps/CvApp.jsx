const cvFileUrl = new URL('../../../CV ALEXANDER FILCHEL.pdf', import.meta.url).href;

function closeDialog() {
  window.dispatchEvent(new CustomEvent('portfolio:close-window', { detail: { id: 'cv' } }));
}

function downloadFile() {
  const link = document.createElement('a');
  link.href = cvFileUrl;
  link.download = 'CV ALEXANDER FILCHEL.pdf';
  document.body.append(link);
  link.click();
  link.remove();
  closeDialog();
}

export function CvApp() {
  return (
    <div className="space-y-4">
      <div className="rounded-[18px] border border-sky-100 bg-[linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
        <p className="text-center text-[15px] font-medium text-slate-700">
          Estas seguro que desea descargar el CV de Alexander?
        </p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={downloadFile}
            className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Aceptar
          </button>
          <button
            type="button"
            onClick={closeDialog}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
