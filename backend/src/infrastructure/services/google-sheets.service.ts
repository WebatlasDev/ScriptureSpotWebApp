/**
 * Google Sheets Service
 * Service for reading data from Google Sheets using the Google Sheets API
 * Converted from C# Infrastructure/Services/GoogleSheetsService.cs
 */

import { google } from 'googleapis';
import { IGoogleSheetsService } from '@/application/common/interfaces/i-google-sheets-service';

export class GoogleSheetsService implements IGoogleSheetsService {
  private readonly apiKey: string;
  private readonly sheetsService: any;

  constructor() {
    // Get API key from environment variable or use default
    this.apiKey = process.env.GOOGLE_SHEETS_API_KEY || 'AIzaSyBhXi8KIP15qYpGNrfY0eVJyFlEZQJkQDI';
    
    this.sheetsService = google.sheets({
      version: 'v4',
      auth: this.apiKey,
    });
  }

  /**
   * Reads data from a Google Sheet
   * @param spreadsheetId The ID of the spreadsheet
   * @param sheetName The name of the sheet tab
   * @param range The cell range (e.g., "A1:Z1000")
   * @returns 2D array of cell values
   */
  async readSheetAsync(
    spreadsheetId: string,
    sheetName: string,
    range: string
  ): Promise<any[][]> {
    try {
      const fullRange = `${sheetName}!${range}`;
      
      console.log(`Fetching data from Google Sheets (Sheet: ${sheetName}, Range: ${range})`);

      const response = await this.sheetsService.spreadsheets.values.get({
        spreadsheetId,
        range: fullRange,
      });

      if (!response.data.values || response.data.values.length === 0) {
        console.warn(`No data found in the range: ${range} of sheet ${sheetName}`);
        return [];
      }

      console.log(`Successfully retrieved ${response.data.values.length} rows from ${sheetName}.`);
      return response.data.values;
    } catch (error) {
      console.error(`Error fetching data from Google Sheets (Sheet: ${sheetName}, Range: ${range})`, error);
      return [];
    }
  }
}
