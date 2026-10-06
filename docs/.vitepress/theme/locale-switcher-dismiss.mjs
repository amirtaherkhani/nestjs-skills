export function installLocaleSwitcherDismiss(details, document) {
  if (!details || !document) return () => {};

  const closeOnOutsidePointer = (event) => {
    if (!details.contains(event.target)) details.open = false;
  };
  const closeOnEscape = (event) => {
    if (event.key !== 'Escape') return;
    details.open = false;
    details.querySelector('summary')?.focus();
  };

  document.addEventListener('pointerdown', closeOnOutsidePointer);
  document.addEventListener('keydown', closeOnEscape);
  return () => {
    document.removeEventListener('pointerdown', closeOnOutsidePointer);
    document.removeEventListener('keydown', closeOnEscape);
  };
}
