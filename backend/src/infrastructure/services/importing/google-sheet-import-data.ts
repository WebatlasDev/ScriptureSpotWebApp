/**
 * Google Sheet Import Data
 * Data class that holds headers and rows from a Google Sheet with helper methods
 * Converted from C# Infrastructure/Services/Importing/GoogleSheetImportData.cs
 */

export class GoogleSheetImportData {
  constructor(
    public readonly headers: string[],
    public readonly rows: ReadonlyArray<ReadonlyArray<any>>
  ) {}

  /**
   * Gets the column index for a given column name
   * @param columnName The column name to search for (case-insensitive)
   * @returns The index of the column, or -1 if not found
   */
  getColumnIndex(columnName: string): number {
    return this.headers.indexOf(this.normalizeHeader(columnName));
  }

  /**
   * Gets all column indices that match a prefix
   * @param prefix The prefix to search for
   * @returns Array of column indices sorted by column name
   */
  getPrefixedColumnIndices(prefix: string): readonly number[] {
    const normalizedPrefix = this.normalizeHeader(prefix);
    
    return this.headers
      .map((name, index) => ({ name, index }))
      .filter((item) =>
        item.name.toLowerCase().startsWith(normalizedPrefix.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
      .map((item) => item.index);
  }

  /**
   * Normalizes a header string for comparison
   * @param input The input string
   * @returns Trimmed and lowercased string
   */
  private normalizeHeader(input: string): string {
    return input.trim().toLowerCase();
  }
}
