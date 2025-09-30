export function cleanNotes(input: string): string {
  return input
    .split("\n")                // break into lines
    .map(line => line.trim())   // trim whitespace on each line
    .filter(line => line !== "") // remove empty lines
    .join("\n");                 // join back into a single string
}
