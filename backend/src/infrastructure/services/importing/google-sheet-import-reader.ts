/**
 * Google Sheet Import Reader
 * Utility for loading data from Google Sheets with headers
 * Converted from C# Infrastructure/Services/Importing/GoogleSheetImportReader.cs
 */

import { IGoogleSheetsService } from '@/application/common/interfaces/i-google-sheets-service';
import { GoogleSheetImportData } from './google-sheet-import-data';

export class GoogleSheetImportReader {
  /**
   * Loads data from a Google Sheet with separate header and data ranges
   * @param googleSheetsService The Google Sheets service instance
   * @param spreadsheetId The ID of the spreadsheet
   * @param sheetName The name of the sheet tab
   * @param headerRange The range containing headers (e.g., "A1:Z1")
   * @param dataRange The range containing data rows (e.g., "A2:Z1000")
   * @returns GoogleSheetImportData or null if no data found
   */
  static async loadAsync(
    googleSheetsService: IGoogleSheetsService,
    spreadsheetId: string,
    sheetName: string,
    headerRange: string,
    dataRange: string
  ): Promise<GoogleSheetImportData | null> {
    // Read headers
    const headers = await googleSheetsService.readSheetAsync(
      spreadsheetId,
      sheetName,
      headerRange
    );

    const headerRow = headers[0];
    if (!headerRow) {
      console.warn('No header row found in the sheet.');
      return null;
    }

    // Normalize headers: trim and lowercase
    const headerArray = headerRow.map((h: any) =>
      h?.toString()?.trim().toLowerCase() ?? ''
    );

    // Read data rows
    const rawRows = await googleSheetsService.readSheetAsync(
      spreadsheetId,
      sheetName,
      dataRange
    );

    if (rawRows.length === 0) {
      console.warn('No data found in the sheet.');
      return null;
    }

    // Convert to readonly arrays
    const dataRows: ReadonlyArray<ReadonlyArray<any>> = rawRows.map((row) =>
      Object.freeze([...row])
    );

    return new GoogleSheetImportData(headerArray, dataRows);
  }
}
