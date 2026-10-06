export function syncDocumentLocale(documentElement, locale) {
  documentElement.lang = locale.lang;
  documentElement.dir = locale.dir;
}
