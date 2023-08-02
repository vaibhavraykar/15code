import { Injectable } from "@angular/core";
import * as FileSaver from "file-saver";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";

const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable({
   providedIn: 'root',
 })
export class ExcelService {
   result2: string;
   constructor() {
    
   }

   public async exportAsExcelFile(workbookData: any[], excelFileName: string,productTye:string) {
    console.log(workbookData,'workbookData');
    console.log(productTye,'excelFileName')
      const workbook = new ExcelJS.Workbook();
      let sheet1book:any[] =[];
      sheet1book.push(workbookData[0])

      
     
      
      // Populate data in Sheet2
      sheet1book.forEach(({ workSheet, rows}) => {
      

        

         const sheet = workbook.addWorksheet(workSheet);

         var data = new Set((rows.reduce((prev, next) => [...prev, ...Object.keys(next)], [])));
         let newExcelData = []
         console.log(data,'data')
         data.forEach(e => {
         
            if (e) {
               newExcelData.push(e);
            }
         })
    
       
         sheet.columns = newExcelData.map(x => ({ header: x, key: x ,style:{


         }}));
       
      
   
      sheet.protect();
          
          console.log(sheet,'sheet')
    
         sheet.spliceColumns(30,31);
    
         rows.forEach((jsonRow, i) => {



            let cellValues = { ...jsonRow };
            newExcelData.forEach((header, j) => {
              
               if (Array.isArray(jsonRow[header])) {
                  cellValues[header] = "";
               }
            });
            sheet.addRow(cellValues);
            // new changes
            newExcelData.forEach((header, j) => {
           
                 // for testing for each cell
  sheet.getCell(this.getSpreadSheetCellNumber12(i,j),

  )
  
 if(i == 0){
 
  sheet.getCell(this.result2).fill ={
   type: 'pattern',
   pattern:'solid',
   fgColor:{argb:'FFFFFF00'},
   bgColor:{argb:'FF0000FF'}
  }

  sheet.getCell(this.result2).border = {
     top: {style:'thin'},
       left: {style:'thin'},
       bottom: {style:'thin'},
       right: {style:'thin'}
  }
 
  
 }
 if(i > 0 ){
   sheet.getCell(this.result2).protection = {
      locked: false,
      // hidden: true,
    };
 }



  // End
               if (Array.isArray(jsonRow[header])) {
                  const jsonDropdown = jsonRow[header];
                
                  
                  
                
                  // old code;
 
 if(i>0){
if(j != 2 && j != 5 && j != 11 && j != 14  && j != 19 && j != 22  && j != 27 && j != 29 && j != 36 && j != 28 && j != 30){
   if(j != 12 && j != 45)
   {
                  sheet.getCell(
                     this.getSpreadSheetCellNumber(i + 1, j),
                   
                  ).dataValidation={
                     type: "list",
                     allowBlank:false,
                     formulae: [`"${jsonDropdown.join(",")}"`],
                     showErrorMessage : true,
                      errorStyle : "error",
                     errorTitle : "Error",
                     error : "Please select value from given dropdown"
                  }
               }
               else 
               {
                  sheet.getCell(
                     this.getSpreadSheetCellNumber(i + 1, j),
                   
                  ).dataValidation={
                     type: "list",
                     showErrorMessage : true,
                      errorStyle : "error",
                     errorTitle : "Error",
                     error : "Please select value from given dropdown",
                     formulae: [`"${jsonDropdown.join(",")}"`],
                    
                  }
               }
               }
               // else{
               //    if(j == 28 || j == 30){
               //       // sheet.getCell(
               //       //    this.getSpreadSheetCellNumber(i + 1, j),
                       
               //       // ).dataValidation={
               //       //    type: "list",
                        
               //       //    formulae: ['=$AY$3:$AY$821'],
               //       //    showErrorMessage : true,
               //       //    errorStyle : "error",
               //       //   errorTitle : "Error",
               //       //   error : "Please select value from given dropdown"
               //       // }
               //    }
               //    else{
               //    // sheet.getCell(
               //    //    this.getSpreadSheetCellNumber(i + 1, j),
                   
               //    // ).dataValidation={
               //    //    type: "list",
                     
               //    //    formulae: ['=$AX$3:$AX$190'],
               //    //    showErrorMessage : true, 
               //    //    errorStyle : "error",
               //    //   errorTitle : "Error",
               //    //   error : "Please select value from given dropdown"
               //    // }
               // }
               // }
            
               }
            }
              });
         });

        

      
      
      
    sheet.protect('the-password');


 

// const dateColumn = sheet.getColumn(20);


// this.columnNo1.forEach(e => {
// const columnNumber = 20; 

// const dateColumn = sheet.getColumn(columnNumber);
// dateColumn.numFmt = 'yyyy-mm-dd';
// const columnNumber21 = 21;

// const dateColumn21 = sheet.getColumn(columnNumber21);
// dateColumn21.numFmt = 'yyyy-mm-dd';
// const columnNumber22 = 22; 

// const dateColumn22 = sheet.getColumn(columnNumber22);
// dateColumn22.numFmt = 'yyyy-mm-dd';
// const columnNumber23 = 23; 
// console.log(sheet.getColumn(columnNumber23),'sheet.getColumn(columnNumber23)');
console.log(sheet.columns[22],'columns 23')
// const dateColumn23 = sheet.getColumn(columnNumber23);
// dateColumn23.numFmt = 'yyyy-mm-dd';
this.columnNo1.forEach(e => {
   // if(e == 23)
   {
    let col23 =  sheet.columns[e];
    col23.numFmt = 'yyyy-mm-dd'
   }
})
// console.log(sheet.getColumn(columnNumber23),'final sheet.getColumn(columnNumber23)');
console.log(sheet.columns[22],'final columns 23')

// const columnNumber24 = 24;

// const dateColumn24 = sheet.getColumn(columnNumber24);
// dateColumn24.numFmt = 'yyyy-mm-dd';
// })


//End
this.columnNo1.forEach(e => {
   // if(e == 23)
   {
    let col23 =  sheet.columns[e];
    col23.numFmt = 'yyyy-mm-dd'
   }
})
       const headerRow = sheet.getRow(1);
  headerRow.hidden = true;
  if(productTye == "CONFIRMATION" || productTye == "DISCOUNTING"|| productTye =="CONFIRMANDDISCOUNT"){
const newRowData = [
   'Requirement Type',
   'App/Bene',
   "Applicant's Country",
   "Applicant's Name",
   "Beneficiary's Name",
   "Beneficiary's Country",
   "Beneficiary's Contact Person",
   "Beneficiary's Contact Person Email",
   "Applicant's Contact Person",
   "Applicant's Contact Person Email",
   "Beneficiary's Bank SWIFT Code",
   'Country of Beneficiary Bank',
   "Beneficiary's Bank Name",
   'Issuing Bank Shift Code',
   'Country of Issuing Bank',
   'Issuing Bank Name',
   'Issuing Branch',
   'Currency',
   'Amount',
   'Issuance Date (yyyy-mm-dd)',
   'Last Shipment Date (yyyy-mm-dd)',
   'Negotiation Date (yyyy-mm-dd)',
   'Transaction Validity',
   'Type of Goods',
   'Others Goods',
   'Usance(Days)',
   'Payment terms to seller as per Lc',
   'Country of Port of Loading',
   'Port of Loading',
   'Country of Port of Discharge',
   'Port of Discharge',
   'Final Destination of Goods',
   'Charges are on',
   'ESG Compliant',
   'User ID'
 ];
 
  sheet.spliceRows(2, 0, newRowData);
  }

  if(productTye == "BANKER"){
   const newRowData = [
      'Requirement Type',
      'App/Bene',
      "Applicant's Country",
      "Applicant's Name",
      "Beneficiary's Name",
      "Beneficiary's Country",
      "Beneficiary's Contact Person",
      "Beneficiary's Contact Person Email",
      "Applicant's Contact Person",
      "Applicant's Contact Person Email",
      "Beneficiary's Bank SWIFT Code",
      'Country of Beneficiary Bank',
      "Beneficiary's Bank Name",
      'Issuing Bank Shift Code',
      'Country of Issuing Bank',
      'Issuing Bank Name',
      'Issuing Branch',
      'Currency',
      'Amount',
      'Issuance Date (yyyy-mm-dd)',
      'Last Shipment Date (yyyy-mm-dd)',
      'Negotiation Date (yyyy-mm-dd)',
      'Transaction Validity',
      'Type of Goods',
      'Others Goods',
      'Refinancing Period (Days)',
      'Payment terms to seller as per Lc',
      'Country of Port of Loading',
      'Port of Loading',
      'Country of Port of Discharge',
      'Port of Discharge',
      'Final Destination of Goods',
      'Charges are on',
      'ESG Compliant',
      'User ID'
    ];
    
     sheet.spliceRows(2, 0, newRowData);
   //   console.log(sheet.getCell('Z1'),'z1 cell vaule')
     sheet.getCell('Z1').vaule = 'refinancingPeriod';

     sheet.columns[25].header = 'refinancingPeriod'
   //   console.log(sheet.columns[25].header ,'final header vaule')
     }



   //  }
  
      });






      let sheet1book2:any[] =[];
      sheet1book2.push(workbookData[1])
      console.log(sheet1book2,'sheet1book2')
  

      
      sheet1book2.forEach(({workSheet,rows}) => {


         const sheet = workbook.addWorksheet(workSheet);

       
         const dataRows:any = JSON.parse(localStorage.getItem('countryName'));
        
          const dataRows2 = JSON.parse(sessionStorage.getItem('portlist'))
          const dataRows3 = JSON.parse(sessionStorage.getItem('goodTypes'))
          sheet.getColumn('A').values = dataRows.map(country => country);
          sheet.getColumn('B').values = dataRows2.map(port => port);
          sheet.getColumn('C').values = dataRows3.map(type => type)
     
      })

      const data2Sheet = workbook.getWorksheet('data2');
     
      data2Sheet.state = 'hidden';
      data2Sheet.protect('the-password');
    
    


 
  const data1Rows = workbookData.find((item) => item.workSheet === 'data1')?.rows;


if (data1Rows) {
const data1Sheet = workbook.getWorksheet('data1');


this.columnNo.forEach(c => {
const columnD = data1Sheet.getColumn(c);
console.log(columnD,'columnD')
if(c != 29 && c != 31 && c != 24){
columnD.eachCell((cell, rowNumber) => {
  if (rowNumber > 2) {
 
 
 

   cell.dataValidation = {
     type: 'list',
  
   formulae :["'data2'!$A$1:$A$188"],
  
   showErrorMessage : true,
   showInputMessage: true,
   errorStyle : "error",
  errorTitle : "Error",
  error : "Please select value from given dropdown",
  promptTitle: 'Select Country',
  prompt: 'Select Country',
   
   // };

   }
  }
});
}else if( c == 24) {
   columnD.eachCell((cell, rowNumber) => {
      if (rowNumber > 2) {
     
     
     
    
       cell.dataValidation = {
         type: 'list',
      
       formulae :["'data2'!$C$1:$C$32"],
      
       showErrorMessage : true,
       showInputMessage: true,
       errorStyle : "error",
      errorTitle : "Error",
      error : "Please select value from given dropdown",
      // promptTitle: 'Port of Loading/Discharge',
      // prompt:  'Select Port',
      
       // };
    
       }
      }
    });
}else {
   columnD.eachCell((cell, rowNumber) => {
      if (rowNumber > 2) {
     
     
     
    
       cell.dataValidation = {
         type: 'list',
      
       formulae :["'data2'!$B$1:$B$819"],
      
       showErrorMessage : true,
       showInputMessage: true,
       errorStyle : "error",
      errorTitle : "Error",
      error : "Please select value from given dropdown",
      promptTitle: 'Port of Loading/Discharge',
      prompt:  'Select Port',
      
       // };
    
       }
      }
    });
}
})





}

      const buffer = await workbook.xlsx.writeBuffer();
     
      this.saveAsExcelFile(buffer, excelFileName);
   }



   public async exportAsExcelFileBgtype(workbookData: any[], excelFileName: string,productType:string) {
      const workbook = new ExcelJS.Workbook();
  
      workbookData.forEach(({ workSheet, rows }) => 

{
        const sheet = workbook.addWorksheet(workSheet);
      //   const uniqueHeaders = [
      //     ...new Set(
      //       rows.reduce((prev, next) => [...prev, ...Object.keys(next)], [])
      //     )
      //   ];
      var data = new Set((rows.reduce((prev, next) => [...prev, ...Object.keys(next)], [])));
      //   sheet.columns = uniqueHeaders.map(x => ({ header: x, key: x }));
      let newExcelDatabg = []
      console.log(data,'data')
      data.forEach(e => { if (e) {
            newExcelDatabg.push(e);
         }
      })
 
    
      sheet.columns = newExcelDatabg.map(x => ({ header: x, key: x ,style:{


      }}));
   
  sheet.spliceColumns(30,31);
      
sheet.protect('the-password');
if(productType =="BANKGUARANTEE"){
        rows.forEach((jsonRow, i) => {
          let cellValues = { ...jsonRow };
  
          newExcelDatabg.forEach((header, j) => {
            if (Array.isArray(jsonRow[header])) {
              cellValues[header] = "";
            }
          });
          sheet.addRow(cellValues);


          newExcelDatabg.forEach((header, j) => {
            sheet.getCell(this.getSpreadSheetCellNumber12(i,j),)

            if(i > 0 ){
               sheet.getCell(this.result2).protection = {
                  locked: false,
                  // hidden: true,
                };
               }



            if (Array.isArray(jsonRow[header])) {
              const jsonDropdown = jsonRow[header];
              sheet.getCell(
                this.getSpreadSheetCellNumber(i + 1, j)
              ).dataValidation = {
                type: "list",
                allowBlank:false,
                formulae: [`"${jsonDropdown.join(",")}"`],
                showErrorMessage : true,
                errorStyle : "error",
               errorTitle : "Error",
               error : "Please select value from given dropdown",
               promptTitle: 'Select Country',
               prompt: 'Select Country',
              };
            }
          });
        });

        const headerRow = sheet.getRow(1);
        headerRow.hidden = true;
        const requirementFields = [
         "Requirement Type",
         "App/Bene",
         "Applicant's Country",
         "Applicant's Name",
         "Beneficiary's Name",
         "Beneficiary's Country",
         "Beneficiary's Contact Person",
         "Beneficiary's Contact Person Email",
         "Applicant's Contact Person",
         "Applicant's Contact Person Email",
         "Beneficiary's Bank SWIFT Code",
         "Country of Beneficiary Bank",
         "Beneficiary's Bank Name",
         "Issuing Bank SWIFT Code",
         "Country of Issuing Bank",
         "Issuing Bank Name",
         "Issuing Branch",
         "Currency",
         "Amount",
         "Issuance Date (yyyy-mm-dd)",
         "BANKGUARANTEE Expiring Date (yyyy-mm-dd)",
         "Claim Expiring Date (yyyy-mm-dd)",
         "Transaction Validity",
         "Bank Guarantee Type",
         "Other Bank Guarantee Type",
         "Usance(Days)",
         "Payment terms to seller as per Lc",
         "Charges are on",
         "ESG Compliant",
         "User ID"
       ];
       sheet.spliceRows(2, 0, requirementFields);
}else 
{
   rows.forEach((jsonRow, i) => {
      let cellValues = { ...jsonRow };

      newExcelDatabg.forEach((header, j) => {
        if (Array.isArray(jsonRow[header])) {
          cellValues[header] = "";
        }
      });
      sheet.addRow(cellValues);


      newExcelDatabg.forEach((header, j) => {
        sheet.getCell(this.getSpreadSheetCellNumber12(i,j),)

        if(i > 0 ){
           sheet.getCell(this.result2).protection = {
              locked: false,
              // hidden: true,
            };
           }



        if (Array.isArray(jsonRow[header])) {
          const jsonDropdown = jsonRow[header];
          sheet.getCell(
            this.getSpreadSheetCellNumber(i + 1, j)
          ).dataValidation = {
            type: "list",
            allowBlank:false,
            formulae: [`"${jsonDropdown.join(",")}"`],
            showErrorMessage : true,
            errorStyle : "error",
           errorTitle : "Error",
           error : "Please select value from given dropdown",
           promptTitle: 'Select Country',
           prompt: 'Select Country',
          };
        }
      });
    });

 
}

      }
      );
   

      // 
      const sheet = workbook.addWorksheet('data2');

       
         const dataRows:any = JSON.parse(localStorage.getItem('countryName'));
        
          const dataRows2 = JSON.parse(sessionStorage.getItem('portlist'))
          const dataRows3 = JSON.parse(sessionStorage.getItem('goodTypes'))
          sheet.getColumn('A').values = dataRows.map(country => country);
          sheet.getColumn('B').values = dataRows2.map(port => port);
          sheet.getColumn('C').values = dataRows3.map(type => type)

          const data2Sheet = workbook.getWorksheet('data2');
     
          data2Sheet.state = 'hidden';
          data2Sheet.protect('the-password');
        
        
    
    
     
      const data1Rows = workbookData.find((item) => item.workSheet === 'data1')?.rows;
      if(productType =="BANKGUARANTEE"){
      if(data1Rows){
         const data1Sheet = workbook.getWorksheet('data1');

         this.columnNo.forEach(e => {
            const columnD = data1Sheet.getColumn(e);
            if(e <= 15){
               columnD.eachCell((cell, rowNumber) => {
                  if (rowNumber > 2) {
                 
                 
                 
                
                   cell.dataValidation = {
                     type: 'list',
                  
                   formulae :["'data2'!$A$1:$A$188"],
                  
                   showErrorMessage : true,
                   showInputMessage: true,
                   errorStyle : "error",
                  errorTitle : "Error",
                  error : "Please select value from given dropdown",
                  promptTitle: 'Select Country',
                  prompt: 'Select Country',
                   
                   // };
                
                   }
                  }
                });  
            }
         })
      }}
      else{

      }
     
      // End
      const buffer = await workbook.xlsx.writeBuffer();
      this.saveAsExcelFile(buffer, excelFileName);
    }

// bill Aval
public async exportAsExcelFilebillAval(workbookData: any[], excelFileName: string,productType:string) {
   const workbook = new ExcelJS.Workbook();

   workbookData.forEach(({ workSheet, rows }) => {
     const sheet = workbook.addWorksheet(workSheet);
     var data = new Set((rows.reduce((prev, next) => [...prev, ...Object.keys(next)], [])));
     //   sheet.columns = uniqueHeaders.map(x => ({ header: x, key: x }));
     let newExcelDatabill = []
     console.log(data,'data')
     data.forEach(e => { if (e) {
      newExcelDatabill.push(e);
        }
     })
     sheet.columns = newExcelDatabill.map(x => ({ header: x, key: x }));
     sheet.protect('the-password');
     rows.forEach((jsonRow, i) => {
       let cellValues = { ...jsonRow };

       newExcelDatabill.forEach((header, j) => {
         if (Array.isArray(jsonRow[header])) {
           cellValues[header] = "";
         }
       });
       sheet.addRow(cellValues);
       newExcelDatabill.forEach((header, j) => {
         sheet.getCell(this.getSpreadSheetCellNumber12(i,j),)

         if(i > 0 ){
            sheet.getCell(this.result2).protection = {
               locked: false,
               // hidden: true,
             };
            }


         if (Array.isArray(jsonRow[header])) {
           const jsonDropdown = jsonRow[header];
           sheet.getCell(
             this.getSpreadSheetCellNumber(i + 1, j)
           ).dataValidation = {
             type: "list",
             formulae: [`"${jsonDropdown.join(",")}"`]
           };
         }
       });
     });
     const headerRow = sheet.getRow(1);
     headerRow.hidden = true;
     const nameField = [
       "Requirement Type",
       "App/Bene",
       "Applicant's Country",
       "Applicant's Name",
       "Beneficiary's Name",
       "Beneficiary's Country",
       "Applicant's Contact Person",
       "Applicant's Contact Person Email",
       "Beneficiary's Bank SWIFT Code",
       "Country of Beneficiary Bank",
       "Beneficiary's Bank Name",
       "Issuing Bank Shift Code",
       "Country of Issuing Bank",
       "Issuing Bank Name",
       "Issuing Branch",
       "Currency",
       "Amount",
       "Issuance Date (yyyy-mm-dd)",
       "Last Shipment Date (yyyy-mm-dd)",
       "Negotiation Date (yyyy-mm-dd)",
       "Transaction Validity",
       "LC Maturity Date",
       "Type of Goods",
       "Others Goods",
       "Usance (Days)",
       "Country of Port of Loading",
       "Port of Loading",
       "Country of Port of Discharge",
       "Port of Discharge",
       "Final Destination of Goods",
       "Charges are on",
       "ESG Compliant",
       "User ID",
     ];
     
     
    sheet.spliceRows(2, 0, nameField);

   });

   const sheet = workbook.addWorksheet('data2');

       
   const dataRows:any = JSON.parse(localStorage.getItem('countryName'));
  
    const dataRows2 = JSON.parse(sessionStorage.getItem('portlist'))
    const dataRows3 = JSON.parse(sessionStorage.getItem('goodTypes'))
    sheet.getColumn('A').values = dataRows.map(country => country);
    sheet.getColumn('B').values = dataRows2.map(port => port);
    sheet.getColumn('C').values = dataRows3.map(type => type)

    const data2Sheet = workbook.getWorksheet('data2');

    data2Sheet.state = 'hidden';
    data2Sheet.protect('the-password');
  
  



const data1Rows = workbookData.find((item) => item.workSheet === 'data1')?.rows;


   const buffer = await workbook.xlsx.writeBuffer();
   this.saveAsExcelFile(buffer, excelFileName);
 }

   private getSpreadSheetCellNumber(row, column) {
    
      let result = "";
      // Get spreadsheet column letter
      let n = column;
      while (n >= 0) {
         result = String.fromCharCode((n % 26) + 65) + result;
         n = Math.floor(n / 26) - 1;
      }
      // Get spreadsheet row number  
      result += `${row + 1}`;
   
      return result;
   }
   private saveAsExcelFile(buffer: any, fileName: string):void {
    
      const data: Blob = new Blob([buffer], {
         type: EXCEL_TYPE
      });

   
      if(data){
         // this.newcheckvaule.checkvalue.hid();
       
    
      }
      FileSaver.saveAs(
         data,
         fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
      );
   }

   private getSpreadSheetCellNumber12(row, column) {
   
      this.result2 = "";
      // Get spreadsheet column letter
      let n = column;
 
      while (n >= 0) {
         this.result2 = String.fromCharCode((n % 26) + 65) + this.result2;
         n = Math.floor(n / 26) - 1;
      }
      // Get spreadsheet row number  
      this.result2 += `${row + 1}`;

      return this.result2;

   }


   columnNo=[3,6,12,15,28,30,29,31,24,32]
   columnNo1=[19,20,21,22]
}