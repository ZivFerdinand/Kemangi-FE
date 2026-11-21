// html-diff.util.ts
import { diffWords } from 'diff';

export function highlightHtmlDiff(
  originalHtml: string,
  updatedHtml: string,
): string {
  const parser = new DOMParser();

  const originalDoc = parser.parseFromString(originalHtml, 'text/html');
  const updatedDoc = parser.parseFromString(updatedHtml, 'text/html');

  const originalText = originalDoc.body.textContent || '';
  const updatedText = updatedDoc.body.textContent || '';

  const diff = diffWords(originalText, updatedText);

  return diff
    .map((part) => {
      if (part.added) {
        return `<span class="word-added">${part.value}</span>`;
      }
      if (part.removed) {
        return `<span class="word-removed">${part.value}</span>`;
      }
      return part.value;
    })
    .join('');
}
