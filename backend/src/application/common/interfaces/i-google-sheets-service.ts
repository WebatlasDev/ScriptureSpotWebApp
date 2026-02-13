/**
 * Google Sheets Service Interface
 * Defines contract for reading data from Google Sheets
 * Converted from C# Application/Common/Interfaces/IGoogleSheetsService.cs
 */

export interface IGoogleSheetsService {
  /**
   * Reads data from a Google Sheet
   * @param spreadsheetId The ID of the spreadsheet
   * @param sheetName The name of the sheet tab
   * @param range The cell range (e.g., "A1:Z1000")
   * @returns 2D array of cell values
   */
  readSheetAsync(
    spreadsheetId: string,
    sheetName: string,
    range: string
  ): Promise<any[][]>;
}
