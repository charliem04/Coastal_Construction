/** "BUILDING [STRONGER] FOUNDATIONS" as words, so each can rise on its own. */
export function headlineWords(text: string): { word: string; red: boolean }[] {
  return (text.match(/\[[^\]]+\]|[^\s[\]]+/g) ?? []).flatMap((part) => {
    const red = part.startsWith("[");
    return part
      .replace(/[[\]]/g, "")
      .split(/\s+/)
      .map((word) => ({ word, red }));
  });
}
