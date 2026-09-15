'use client';

import { useState, useTransition } from 'react';
import { uploadMediaAction, updateAltAction, deleteMediaAction } from './actions';

type Item = {
  id: number; path: string; thumbPath: string | null; filename: string;
  alt: string | null; bytes: number; width: number | null; height: number | null;
  uploader: string | null; ownerKind: string | null;
};

export default function MediaGrid({ items }: { items: Item[] }) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState<Item | null>(null);
  const [error, setError] = useState('');

  const onFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setError('');
    start(async () => {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.set('file', file);
        const res = await uploadMediaAction(fd);
        if (res?.error) { setError(res.error); break; }
      }
    });
  };

  return (
    <>
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-rule-3 bg-white p-[clamp(26px,4vw,48px)] mt-[clamp(22px,3vw,36px)] cursor-pointer hover:border-orange"
      >
        <span className="font-serif text-[20px] text-ink">{pending ? 'Uploading…' : 'Drop images here'}</span>
        <span className="meta">or click to choose · JPEG, PNG, WebP, AVIF · up to 12 MB each</span>
        <input type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => onFiles(e.target.files)} />
      </label>
      {error && <p className="mt-3 text-[13px] text-[#B4441F]">{error}</p>}

      {items.length === 0 ? (
        <p className="mt-8 text-[15px] text-muted-2">Nothing uploaded yet.</p>
      ) : (
        <div className="grid gap-[clamp(10px,1.2vw,16px)] mt-[clamp(20px,2.6vw,32px)] [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))]">
          {items.map((m) => (
            <button key={m.id} onClick={() => setOpen(m)}
              className="text-left bg-white border border-rule hover:border-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.thumbPath || m.path} alt={m.alt || ''} loading="lazy"
                className="block w-full aspect-square object-cover" />
              <span className="block p-2.5">
                <span className="block text-[11px] font-medium text-ink truncate">{m.filename}</span>
                <span className="block text-[10px] text-muted mt-1">{(m.bytes / 1024).toFixed(0)} KB</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-[rgba(23,22,15,.6)] p-5" onClick={() => setOpen(null)}>
          <div className="bg-paper max-w-[620px] w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open.path} alt={open.alt || ''} className="block w-full max-h-[50vh] object-contain bg-ink" />
            <div className="p-6">
              <div className="font-serif text-[22px] leading-tight">{open.filename}</div>
              <div className="meta mt-2">
                {open.width}×{open.height} · {(open.bytes / 1024).toFixed(0)} KB
                {open.uploader && ` · ${open.uploader}`}
                {open.ownerKind && open.ownerKind !== 'library' && ` · attached to ${open.ownerKind}`}
              </div>

              <form action={async (fd) => { await updateAltAction(fd); setOpen(null); }} className="mt-5">
                <input type="hidden" name="id" value={open.id} />
                <label className="label block mb-2">Alt text</label>
                <input name="alt" defaultValue={open.alt ?? ''} placeholder="Describe the image for screen readers"
                  className="w-full border border-rule bg-white px-4 py-3 text-sm outline-none focus:border-teal" />
                <div className="flex flex-wrap gap-2 mt-4">
                  <button className="btn-primary">Save</button>
                  <button type="button" onClick={() => setOpen(null)} className="btn-outline">Close</button>
                  <span className="flex-1" />
                  <button type="button"
                    onClick={() => start(async () => {
                      const fd = new FormData(); fd.set('id', String(open.id));
                      await deleteMediaAction(fd); setOpen(null);
                    })}
                    className="btn border border-rule text-[#B4441F]">Delete</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
