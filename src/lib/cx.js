/** Tiny classnames joiner — filters falsy values. */
export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export default cx;
