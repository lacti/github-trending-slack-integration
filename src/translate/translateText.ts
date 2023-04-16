import { translate } from "@vitalets/google-translate-api";

const context = {
  errorOccurred: 0,
};
const errorSkipMillis = 12 * 60 * 1000;

export interface TranslateOptions {
  from?: string;
  to?: string;
  prefilter?: (input: string) => boolean;
  translatedPrefix?: string;
}

export default async function translateText(
  text: string,
  {
    from = "zh-CN",
    to = "en",
    prefilter,
    translatedPrefix,
  }: TranslateOptions = {}
): Promise<string> {
  const now = new Date().getTime();
  if (context.errorOccurred + errorSkipMillis > now) {
    console.warn({ context }, "translateText: Error skip");
    return text;
  }
  if (prefilter && !prefilter(text)) {
    return text;
  }
  try {
    console.debug({ text }, "Start to translateText");
    const translated = await translate(text, { from, to });
    console.debug({ from: text, to: translated.text }, "Finish translateText");
    return `${translatedPrefix ?? ""}${translated.text}`;
  } catch (error) {
    console.error({ error }, "translateText");
    context.errorOccurred = now;
    return text;
  }
}
