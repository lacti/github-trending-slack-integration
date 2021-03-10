export default function isAny(value?: string) {
  return !value || /any/i.test(value);
}
