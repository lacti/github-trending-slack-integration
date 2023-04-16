import translateText, { TranslateOptions } from "./translateText.js";

import hasChinese from "../support/hasChinese.js";

const charsLimit = 2000;

export default async function translateBulk<T>({
  values,
  getText,
  setText,
  translatedPrefix = "[中]",
  translateOptions,
}: {
  values: T[];
  getText: (input: T) => string;
  setText: (input: T, text: string) => void;
  translatedPrefix?: string;
  translateOptions?: TranslateOptions;
}) {
  let length = 0;
  let chunk = "";
  let writebacks: ((text: string) => void)[] = [];

  async function flush() {
    if (!chunk) {
      return;
    }
    const result = await translateText(chunk.trim(), translateOptions);
    const translated = result.split(/\n/g);
    for (let i = 0; i < translated.length; ++i) {
      writebacks[i](translatedPrefix + translated[i]);
    }

    length = 0;
    chunk = "";
    writebacks = [];
  }

  for (let index = 0; index < values.length; ++index) {
    const value = values[index];
    const raw = getText(value);
    if (!hasChinese(raw)) {
      continue;
    }
    length += raw.length;
    chunk += raw + "\n";
    writebacks.push((translated) => setText(value, translated));
    if (length >= charsLimit) {
      await flush();
    }
  }
  await flush();
  return values;
}
