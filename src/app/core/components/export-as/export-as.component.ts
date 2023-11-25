import { Component, Input } from '@angular/core';
import { Column, logoBase64 } from '@methods/constants';
import { Workbook } from 'exceljs';
import { User } from '@models/auth-model';
import * as fs from 'file-saver';
import { transformDate } from '@methods/methods';
import { Subscription } from 'rxjs';
import { MediaResponse, MediaService } from '@services/media.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-export-as',
  templateUrl: './export-as.component.html'
})
export class ExportAsComponent {
  @Input() payloadData: any;
  @Input() exportColumns: any;
  @Input() pdfPayloadData: any;
  @Input() title: string;
  @Input() exportType: number;

  mediaSubscription: Subscription;
  Media: MediaResponse;
  userLogin: User;
  excelExtension: string = '.xlsx';
  pdfExtension:string = '.pdf';
  downloadExcel: string = '';
  downloadPdf: string = '';
  color: string = '';

  constructor(private _mediaService: MediaService, private _translateService: TranslateService){}

  ngOnInit(): void {
    this.userLogin = JSON.parse(localStorage.getItem('UserAccessCTS')!);
    this.mediaSubscription = this._mediaService.subscribeMedia().subscribe(media => {
      this.Media = media;
    });
  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        var titleHeader: any = [] 
        titleHeader = this.exportColumns.map(element =>  this.TranslateText(element.title) ); 
        (doc as any).autoTable(titleHeader, this.pdfPayloadData);
        doc.save(this.downloadPdf);
      });
    });
  }

  async generateExcel() {
    var titleHeader: any = [];
    titleHeader = this.exportColumns.map(element =>  element.title); 
    // Create workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Tickets Data');

    // Add Row and formatting
    const titleRow = worksheet.addRow([this.TranslateText(this.title)]);
    titleRow.font = { name: 'Calibri', family: 4, size: 16, bold: true, color: { argb: 'FFFFFF' } };
    worksheet.addRow([]);

    titleRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '006666' },
        bgColor: { argb: 'FFFFFF' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Add Image
    const logo = workbook.addImage({
      base64: logoBase64,
      extension: 'png',
    });

    worksheet.addImage(logo, 'H1:I2');
    worksheet.mergeCells('A1:I2');

    // Add Header Row
    const headerRow = worksheet.addRow(titleHeader);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E0E0E0' },
        bgColor: { argb: 'FFFFFF' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Add Data and Conditional Formatting
    this.payloadData.forEach((d:any) => {
      const row = worksheet.addRow(this.onReturnRowData(this.exportType, d));
      const status = row.getCell(7);

      if (status.value == "Open") {
        this.color = 'FF9999';
      }

      if (status.value == "In-Progress") {
        this.color = '0080FF';
      }

      if (status.value == "Resolved") {
        this.color = '00CC66';
      }

      status.font = { bold: true, color: { argb: this.color } };

    });
    let counter = 1;

    while (counter < this.exportType) {
        worksheet.getColumn(counter).width = (counter == 1) ? 10 : 20
        counter++;
    }
    worksheet.addRow([]);


    // Footer Row
    const footerRow = worksheet.addRow([ this.TranslateText('HEADER_REPORT.EXCEL_GENERATED') + ' ' +this.userLogin.name+ '.']);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCFFE5' }
    };
    footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    // Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:I${footerRow.number}`);

    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const titleReport = this.TranslateText(this.title);
      this.downloadExcel = titleReport + '-' + transformDate(new Date()) + this.excelExtension;
      this.downloadPdf = titleReport + '-' + transformDate(new Date()) + this.pdfExtension;
      fs.saveAs(blob, this.downloadExcel);
    });
  }

  TranslateText(text: string) {
    return this._translateService.instant(text);
  } 

  onReturnRowData(key: number, d: any){
    switch (key) {
      case 10: return [
        d.TicketInfo.TicketNumber, 
        d.TicketInfo.IdPlayer,                             
        d.Site, 
        d.TicketInfo.Department[0].DepartmentName,                             
        d.Subject,
        d.Relevance,
        d.Status,
        d.TicketInfo.AssignedUser,
        transformDate(d.TicketInfo.DateTransaction)
      ]
      case 6: return [
        transformDate(d.TransactionDate), 
        d.Account, 
        d.Issue, 
        d.SourceInfo.Name, 
        this.userLogin.name
      ]
    
      default: return null;
    }
  }

  padTo2Digits(num:any) {
    return num.toString().padStart(2, '0');
  }
}
