/**
 * Helpers for Strapi media files (PDF, Word, Excel etc.) — used by the
 * FileList block and by article attachments rendering.
 */

export interface StrapiFile {
	url: string;
	name: string;
	ext?: string;
	/** Strapi reports size in KB (decimal). */
	size?: number;
	mime?: string;
	alternativeText?: string;
}

export type FileKind = 'pdf' | 'doc' | 'sheet' | 'other';

/** "PDF" / "DOCX" / "FILE" — uppercase, no leading dot. */
export function getFileExt(file: { ext?: string; name?: string } | null | undefined): string {
	if (!file) return 'FILE';
	if (file.ext) return file.ext.replace(/^\./, '').toUpperCase();
	const m = file.name?.match(/\.([a-z0-9]+)$/i);
	return m ? m[1].toUpperCase() : 'FILE';
}

/** Bucket extension into a category that drives the icon color. */
export function getFileKind(file: { ext?: string; name?: string }): FileKind {
	const ext = getFileExt(file).toLowerCase();
	if (ext === 'pdf') return 'pdf';
	if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) return 'doc';
	if (['xls', 'xlsx', 'ods', 'csv'].includes(ext)) return 'sheet';
	return 'other';
}

/**
 * "1.2 MB" / "780 KB" / "" (when size is missing).
 * Strapi `size` is in KB; threshold below is in KB too.
 */
export function formatFileSize(kb: number | null | undefined): string {
	if (!kb) return '';
	if (kb < 1024) return `${Math.round(kb)} KB`;
	return `${(kb / 1024).toFixed(1)} MB`;
}
