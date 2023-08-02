import { Component, OnInit } from '@angular/core';

import { ExcelService } from '../services/upload-bulk-transaction.service';
import { BulkUploadservice } from '../services/bulk-upload.service';
import { GeneralPopupComponent } from '../../../components/general-popup/general-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-bulk-upload-transcation',
  templateUrl: './bulk-upload-transcation.component.html',
  styleUrls: ['./bulk-upload-transcation.component.scss']
})


export class BulkUploadTranscationComponent implements OnInit{

 
  // dialog: MatDialog;
  myfilename2 ='Select File'
// for testing
countrylist = [
  "AFGHANISTAN","ALBANIA","ALGERIA","ANDORRA","ANGOLA","ANTIGUA AND BARBUDA","ARGENTINA","ARMENIA","AUSTRALIA","AUSTRIA",
        "AZERBAIJAN","BAHAMAS","BAHRAIN","BANGLADESH","BARBADOS","BELGIUM","BELIZE","BENIN","BHUTAN","BOLIVIA","BOSNIA AND HERZEGOVINA","BOTSWANA","BRAZIL","BRUNIE","BULGARIA","BURKINA FASO","BURUNDI",
        "CABO VERDE","CAMBODIA","CAMEROON","CANADA","CENTRAL AFRICAN REPUBLIC","CHAD","CHILE","CHINA","COLOMBIA","COMOROS","CONGO","COSTA RICA","COTE DIVOIRE","CROATIA (HRVATSKA)","CYPRUS","CZECHIA",
 "DENMARK","DJIBOUTI","DOMINICA","DOMINICAN REPUBLIC",
        "ECUADOR","EGYPT","EL SALVADOR","EQUATORIAL GUINEA","ERITREA","ESTONIA","ESWATINI","ETHIOPIA",
        "FIJI","FINLAND","FRANCE",
        "GABON","GAMBIA","GEORGIA","GERMANY","GHANA","GREECE","GRENADA","GUATEMALA","GUINEA","GUINEA-BISSAU","GUYANA",
        "HAITI","HONDURAS","HONG KONG","HUNGARY","ICELAND","INDIA","INDONESIA","IRELAND","ISRAEL","ITALY",
        "JAMAICA","JAPAN","JORDAN","KAZAKHSTAN","KENYA","KIRIBATI","KOSOVO","KUWAIT","KYRGYZSTAN",
        "LAOS","LATVIA","LEBANON","LESOTHO","LIBERIA","LIBYA","LIECHTENSTEIN","LITHUANIA","LUXEMBOURG","MADAGASCAR","MALAWI","MALAYSIA","MALDIVES","MALI","MALTA","MARSHALL ISLANDS","MAURITANIA","MAURITIUS","MEXICO","MICRONESIA","MOLDOA","MONACO","MONGOLIA","MONTENEGRO","MOROCCO","MOZAMBIQUE","MYANMAR",
        "NAMIBIA","NAURU","NEPAL","NETHERLANDS","NEW ZEALAND","NICARAGUA","NIGER","NIGERIA","NORTH MACEDONIA","NORWAY","OMAN",
        "PAKISTAN","PALAU","PALESTINIAN TERRITORY","PANAMA","PAPUA NEW GUINEA","PARAGUAY","PERU","PHILIPPINES","POLAND","PORTUGAL",
        "QATAR","ROMANIA","RUSSIA","RWANDA",
        "SAINT KITTS AND NEVIS","SAINT LUCIA","SAINT VINCENT AND THE GRENADINES","SAMOA","SAN MARINO","SAO TOME AND PRINCIPE","SAUDI ARABIA","SENEGAL","SERBIA","SEYCHELLES","SIERRA LEONE","SINGAPORE","SLOVAKIA","SLOVENIA","SOLOMON ISLANDS","SOMALIA","SOUTH AFRICA","SOUTH KOREA","SPAIN","SRI LANKA","SURINAME","SWEDEN","SWITZERLAND",
        "TAIWAN","TAJIKISTAN","TANZANIA","THAILAND","TIMOR-LESTE","TOGO","TONGA","TRINIDAD AND TOBAGO","TUNISIA","TURKEY","TURKMENISTAN","TUVALU",
        "UGANDA","UKRAINE","UNITED ARAB EMIRATES (UAE)","UNITED KINGDOM (UK)","UNITED STATES OF AMERICA (USA)","URUGUAY","UZBEKISTAN",
        "VANUATU","VATICAN CITY STATE (HOLY SEE)","VENEZUELA","VIETNAM",
        "YEMEN","ZAMBIA"
]
  productype:string="" ;
  excelData2: any;
  fileuploaded: boolean;
  currentFile: File;
  formData1: FormData;
  download: boolean;
  countries: any;
  filteredCountries: any;
  countryCodeList: any;
  filteredCountryCodes: any;
constructor(private excelService: ExcelService,private bulkservice :BulkUploadservice,private dialog: MatDialog,){
 
}

  excelData:{ name: string, values: { header: string, value: string | { name: string }[] }[] }[] = [
    {
      name: "data1", //sheet1 with name data1
      values: [
        // { header: "Select Product", value: [{name:'Confirmation'},{name:'Discounting'},{name:'Confirmation and Discounting'},{name:'Refinancing'},{name:'Banker Acceptance'},{name:'Avalisation'},{name:'Bank Guarantee'}] },
        { header: "requirementType", value: [{name: this.productype}] },
        { header: "userType", value: [{name:"Applicant"},{name:"Beneficiary"}]},

        { header: "applicantCountry", value: [{name:"Applicant"},{name:"Beneficiary"}] },
        { header: "applicantName", value: "" },
        { header: "beneName", value: "" },
        { header: "beneCountry", value:[{name:"AFGHANISTAN"},{name:"ALBANIA"},{name:"ALGERIA"},{name:"ANDORRA"},{name:"ANGOLA"},{name:"ANTIGUA AND BARBUDA"},{name:"ARGENTINA"},{name:"ARMENIA"},{name:"AUSTRALIA"},{name:"AUSTRIA"},
        {name:"AZERBAIJAN"},{name:"BAHAMAS"},{name:"BAHRAIN"},{name:"BANGLADESH"},{name:"BARBADOS"},{name:"BELGIUM"},{name:"BELIZE"},{name:"BENIN"},{name:"BHUTAN"},{name:"BOLIVIA"},{name:"BOSNIA AND HERZEGOVINA"},{name:"BOTSWANA"},{name:"BRAZIL"},{name:"BRUNIE"},{name:"BULGARIA"},{name:"BURKINA FASO"},{name:"BURUNDI"},
        {name:"CABO VERDE"},{name:"CAMBODIA"},{name:"CAMEROON"},{name:"CANADA"},{name:"CENTRAL AFRICAN REPUBLIC"},{name:"CHAD"},{name:"CHILE"},{name:"CHINA"},{name:"COLOMBIA"},{name:"COMOROS"},{name:"CONGO"},{name:"COSTA RICA"},{name:"COTE DIVOIRE"},{name:"CROATIA (HRVATSKA)"},{name:"CYPRUS"},{name:"CZECHIA"},
 {name:"DENMARK"},{name:"DJIBOUTI"},{name:"DOMINICA"},{name:"DOMINICAN REPUBLIC"},
        {name:"ECUADOR"},{name:"EGYPT"},{name:"EL SALVADOR"},{name:"EQUATORIAL GUINEA"},{name:"ERITREA"},{name:"ESTONIA"},{name:"ESWATINI"},{name:"ETHIOPIA"},
        {name:"FIJI"},{name:"FINLAND"},{name:"FRANCE"},
        {name:"GABON"},{name:"GAMBIA"},{name:"GEORGIA"},{name:"GERMANY"},{name:"GHANA"},{name:"GREECE"},{name:"GRENADA"},{name:"GUATEMALA"},{name:"GUINEA"},{name:"GUINEA-BISSAU"},{name:"GUYANA"},
        {name:"HAITI"},{name:"HONDURAS"},{name:"HONG KONG"},{name:"HUNGARY"},{name:"ICELAND"},{name:"INDIA"},{name:"INDONESIA"},{name:"IRELAND"},{name:"ISRAEL"},{name:"ITALY"}
      
      ]},
        { header: "beneContactPerson", value: "" },
        { header: "beneContactPersonEmail", value: "" },
        { header: "applicantContactPerson", value: "" },
        { header: "applicantContactPersonEmail", value: "" },
        { header: "beneSwiftCode", value: "" },
        { header: "beneBankCountry", value: [{name:"Applicant"},{name:"Beneficiary"}] },
        { header: "beneBankName", value: ""},
        { header: "swiftCode", value: "" },
        { header: "lCIssuanceCountry", value: [{name:"Applicant"},{name:"Beneficiary"}] },
        { header: "lCIssuanceBank", value: "" },
        { header: "lCIssuanceBranch", value: "" },
        { header: "lCCurrency", value: [{name:"AED"},{name:"ARS"},{name:"AUD"},{name:"BAM"},{name:"BGN"},{name:"BRL"},{name:"CAD"},{name:"CHF"},{name:"CLP"},{name:"CNY"},{name:"COP"},{name:"CZK"},{name:"DKK"},{name:"DOP"},{name:"EGP"},{name:"EURO"},{name:"FJD"},{name:"GBP"},{name:"HKD"},{name:"HRK"},{name:"HUF"},{name:"IDR"},{name:"ILS"},{name:"INR"},{name:"JMD"},{name:"JOD"},{name:"JPY"},{name:"KES"},{name:"KRW"},{name:"KWD"},{name:"MAD"},{name:"MXN"},{name:"MYR"},{name:"NOK"},{name:"NZD"},{name:"PEN"},{name:"PHP"},{name:"PKR"},{name:"PLN"},
        { name:"QAR"},{name:"RON"},{name:"RUB"},{name:"SAR"},{name:"SEK"},{name:"SGD"},{name:"THB"},{name:"TRY"},{name:"TWD"},{name:"USD"},{name:"VND"},{name:"ZAR"}] },
        { header: "lCValue", value: "" },
        { header: "lCIssuingDate", value: ""},
        { header: "lastShipmentDate", value: "" },
        { header: "negotiationDate", value: "" },
        { header: "validity", value: ""}, 
        { header: "goodsType", value: [
        { "name": "Agri Product",}, {"name": "Dairy Product",},{"name": "Metal (Steel, Copper, Zinc etc.)",},{"name": "Machinery", },{"name": "Construction Material (Cement etc.)",},{"name": "Paper",},
        {"name": "Pipes",},{"name": "Fruit / Vegetable / Dry Fruit",},{"name": "Animal meat / Sea Food / Poultry",},{"name": "Electricals / Electrical Equipments",},{"name": "Electronics (Laptops, TV, Mobile Phones etc.)",},{"name": "Telecom Equipment",},{"name": "Medical Equipment",},{"name": "Pharma",},{"name": "Plastic Product",},{"name": "Chemicals",},{"name": "Cosmetics",},{"name": "Crude Oil",},{"name": "Textile",},{"name": "Furniture/ Timber",},{ "name": "Cotton",}, {"name": "Fire Equipments",},{"name": "Leather",},{"name": "Automobile"},{"name": "Food / Beverages / Bakery"},{  "name": "Rubber"},{"name": "Scrap products"},{"name": "Services"},{"name": "IT Software / Hardware" },{ "name": "Baby Products / Toys / Games",},{  "name": "Stationery Products",}
      ] },
        { header: "otherGoodsType", value: "" },
        { header: "usanceDays", value: "" },
        { header: "paymentTerms", value: "" },
        { header: "loadingCountry", value: [{name:"Applicant"},{name:"Beneficiary"}] },
        { header: "loadingPort", value: [{name:"Applicant"},{name:"Beneficiary"}] },
        { header: "dischargeCountry", value: [{name:'Yes'},{name:'No'}] },
        { header: "dischargePort", value: [{name:"Applicant"},{name:"Beneficiary"}] },
        { header: "finalDestinationOfGoods", value: "" },
        { header: "chargesType", value: [{name:"Applicant"},{name:"Beneficiary"}] },
        { header: "isESGComplaint", value: [{name:'Yes'},{name:'No'}] },
        { header: "userId", value: "" },

    
     
      ]
      // ok 
      
    }
  ];

// for BG Type
excelDatabg:{ name: string, values: { header: string, value: string | { name: string }[] }[] }[] = [
  {
    name: "data1", //sheet1 with name data1
    values: [
      // { header: "Select Product", value: [{name:'Confirmation'},{name:'Discounting'},{name:'Confirmation and Discounting'},{name:'Refinancing'},{name:'Banker Acceptance'},{name:'Avalisation'},{name:'Bank Guarantee'}] },
      { header: "requirementType", value: [{name: this.productype}] },
      { header: "userType", value: [{name:"Applicant"},{name:"Beneficiary"}]},

      { header: "applicantCountry", value: [{name:"Applicant"},{name:"Beneficiary"}] },
      { header: "applicantName", value: "" },
      { header: "beneName", value: "" },
      { header: "beneCountry", value:[{name:"AFGHANISTAN"},{name:"ALBANIA"},{name:"ALGERIA"},{name:"ANDORRA"},{name:"ANGOLA"},{name:"ANTIGUA AND BARBUDA"},{name:"ARGENTINA"},{name:"ARMENIA"},{name:"AUSTRALIA"},{name:"AUSTRIA"},
      {name:"AZERBAIJAN"},{name:"BAHAMAS"},{name:"BAHRAIN"},{name:"BANGLADESH"},{name:"BARBADOS"},{name:"BELGIUM"},{name:"BELIZE"},{name:"BENIN"},{name:"BHUTAN"},{name:"BOLIVIA"},{name:"BOSNIA AND HERZEGOVINA"},{name:"BOTSWANA"},{name:"BRAZIL"},{name:"BRUNIE"},{name:"BULGARIA"},{name:"BURKINA FASO"},{name:"BURUNDI"},
      {name:"CABO VERDE"},{name:"CAMBODIA"},{name:"CAMEROON"},{name:"CANADA"},{name:"CENTRAL AFRICAN REPUBLIC"},{name:"CHAD"},{name:"CHILE"},{name:"CHINA"},{name:"COLOMBIA"},{name:"COMOROS"},{name:"CONGO"},{name:"COSTA RICA"},{name:"COTE DIVOIRE"},{name:"CROATIA (HRVATSKA)"},{name:"CYPRUS"},{name:"CZECHIA"},
{name:"DENMARK"},{name:"DJIBOUTI"},{name:"DOMINICA"},{name:"DOMINICAN REPUBLIC"},
      {name:"ECUADOR"},{name:"EGYPT"},{name:"EL SALVADOR"},{name:"EQUATORIAL GUINEA"},{name:"ERITREA"},{name:"ESTONIA"},{name:"ESWATINI"},{name:"ETHIOPIA"},
      {name:"FIJI"},{name:"FINLAND"},{name:"FRANCE"},
      {name:"GABON"},{name:"GAMBIA"},{name:"GEORGIA"},{name:"GERMANY"},{name:"GHANA"},{name:"GREECE"},{name:"GRENADA"},{name:"GUATEMALA"},{name:"GUINEA"},{name:"GUINEA-BISSAU"},{name:"GUYANA"},
      {name:"HAITI"},{name:"HONDURAS"},{name:"HONG KONG"},{name:"HUNGARY"},{name:"ICELAND"},{name:"INDIA"},{name:"INDONESIA"},{name:"IRELAND"},{name:"ISRAEL"},{name:"ITALY"}
    
    ]},
      { header: "beneContactPerson", value: "" },
      { header: "beneContactPersonEmail", value: "" },
      { header: "applicantContactPerson", value: "" },
      { header: "applicantContactPersonEmail", value: "" },
      { header: "beneSwiftCode", value: "" },
      { header: "beneBankCountry", value: [{name:"Applicant"},{name:"Beneficiary"}] },
      { header: "beneBankName", value: ""},
      { header: "swiftCode", value: "" },
      { header: "lCIssuanceCountry", value: [{name:"Applicant"},{name:"Beneficiary"}] },
      { header: "lCIssuanceBank", value: "" },
      { header: "lCIssuanceBranch", value: "" },
      { header: "lCCurrency", value: [{name:"AED"},{name:"ARS"},{name:"AUD"},{name:"BAM"},{name:"BGN"},{name:"BRL"},{name:"CAD"},{name:"CHF"},{name:"CLP"},{name:"CNY"},{name:"COP"},{name:"CZK"},{name:"DKK"},{name:"DOP"},{name:"EGP"},{name:"EURO"},{name:"FJD"},{name:"GBP"},{name:"HKD"},{name:"HRK"},{name:"HUF"},{name:"IDR"},{name:"ILS"},{name:"INR"},{name:"JMD"},{name:"JOD"},{name:"JPY"},{name:"KES"},{name:"KRW"},{name:"KWD"},{name:"MAD"},{name:"MXN"},{name:"MYR"},{name:"NOK"},{name:"NZD"},{name:"PEN"},{name:"PHP"},{name:"PKR"},{name:"PLN"},
      { name:"QAR"},{name:"RON"},{name:"RUB"},{name:"SAR"},{name:"SEK"},{name:"SGD"},{name:"THB"},{name:"TRY"},{name:"TWD"},{name:"USD"},{name:"VND"},{name:"ZAR"}] },
      { header: "lCValue", value: "" },
      { header: "lCIssuingDate", value: ""},
      { header: "bgExpiryDate", value: "" },
      { header: "claimExpiringDate", value: "" },
      { header: "validity", value: ""}, 
      { header: "bgType", value: [{name:'Deferred payment guarantee'},{name:'Financial guarantee'},{name:'Advance payment guarantee'},{name:'Foreign bank guarantee'},{name:'Performance guarantee'},{name:'Bid bond guarantee'},{name:'Others'}] },
      { header: "otherbgtype", value: "" },
      { header: "usanceDays", value: "" },
      { header: "paymentTerms", value: "" },

      { header: "chargesType", value: [{name:"Applicant"},{name:"Beneficiary"}] },
      { header: "isESGComplaint", value: [{name:'Yes'},{name:'No'}] },
      { header: "userId", value: "" },

  
   
    ]
    // ok 
    
  }
];

//  for bill availsition
excelDatabill:{ name: string, values: { header: string, value: string | { name: string }[] }[] }[] = [
  {
    name: "data1", //sheet1 with name data1
    values: [
      // { header: "Select Product", value: [{name:'Confirmation'},{name:'Discounting'},{name:'Confirmation and Discounting'},{name:'Refinancing'},{name:'Banker Acceptance'},{name:'Avalisation'},{name:'Bank Guarantee'}] },
      { header: "requirementType", value: [{name: this.productype}] },
      { header: "userType", value: [{name:"Applicant"},{name:"Beneficiary"}]},

      { header: "applicantCountry", value: [{name:"Applicant"},{name:"Beneficiary"}] },
      { header: "applicantName", value: "" },
      { header: "beneName", value: "" },
      { header: "beneCountry", value:[{name:"AFGHANISTAN"},{name:"ALBANIA"},{name:"ALGERIA"},{name:"ANDORRA"},{name:"ANGOLA"},{name:"ANTIGUA AND BARBUDA"},{name:"ARGENTINA"},{name:"ARMENIA"},{name:"AUSTRALIA"},{name:"AUSTRIA"},
      {name:"AZERBAIJAN"},{name:"BAHAMAS"},{name:"BAHRAIN"},{name:"BANGLADESH"},{name:"BARBADOS"},{name:"BELGIUM"},{name:"BELIZE"},{name:"BENIN"},{name:"BHUTAN"},{name:"BOLIVIA"},{name:"BOSNIA AND HERZEGOVINA"},{name:"BOTSWANA"},{name:"BRAZIL"},{name:"BRUNIE"},{name:"BULGARIA"},{name:"BURKINA FASO"},{name:"BURUNDI"},
      {name:"CABO VERDE"},{name:"CAMBODIA"},{name:"CAMEROON"},{name:"CANADA"},{name:"CENTRAL AFRICAN REPUBLIC"},{name:"CHAD"},{name:"CHILE"},{name:"CHINA"},{name:"COLOMBIA"},{name:"COMOROS"},{name:"CONGO"},{name:"COSTA RICA"},{name:"COTE DIVOIRE"},{name:"CROATIA (HRVATSKA)"},{name:"CYPRUS"},{name:"CZECHIA"},
{name:"DENMARK"},{name:"DJIBOUTI"},{name:"DOMINICA"},{name:"DOMINICAN REPUBLIC"},
      {name:"ECUADOR"},{name:"EGYPT"},{name:"EL SALVADOR"},{name:"EQUATORIAL GUINEA"},{name:"ERITREA"},{name:"ESTONIA"},{name:"ESWATINI"},{name:"ETHIOPIA"},
      {name:"FIJI"},{name:"FINLAND"},{name:"FRANCE"},
      {name:"GABON"},{name:"GAMBIA"},{name:"GEORGIA"},{name:"GERMANY"},{name:"GHANA"},{name:"GREECE"},{name:"GRENADA"},{name:"GUATEMALA"},{name:"GUINEA"},{name:"GUINEA-BISSAU"},{name:"GUYANA"},
      {name:"HAITI"},{name:"HONDURAS"},{name:"HONG KONG"},{name:"HUNGARY"},{name:"ICELAND"},{name:"INDIA"},{name:"INDONESIA"},{name:"IRELAND"},{name:"ISRAEL"},{name:"ITALY"}
    
    ]},
      { header: "beneContactPerson", value: "" },
      { header: "beneContactPersonEmail", value: "" },
      { header: "beneSwiftCode", value: "" },
      { header: "beneBankCountry", value: "" },
      { header: "beneBankName", value: "" },
      { header: "swiftCode", value: "" },
      { header: "lCIssuanceCountry", value: ""},
      { header: "lCIssuanceBank", value: "" },
      { header: "lCIssuanceBranch", value: ""},
      { header: "lCCurrency", value: [{name:"AED"},{name:"ARS"},{name:"AUD"},{name:"BAM"},{name:"BGN"},{name:"BRL"},{name:"CAD"},{name:"CHF"},{name:"CLP"},{name:"CNY"},{name:"COP"},{name:"CZK"},{name:"DKK"},{name:"DOP"},{name:"EGP"},{name:"EURO"},{name:"FJD"},{name:"GBP"},{name:"HKD"},{name:"HRK"},{name:"HUF"},{name:"IDR"},{name:"ILS"},{name:"INR"},{name:"JMD"},{name:"JOD"},{name:"JPY"},{name:"KES"},{name:"KRW"},{name:"KWD"},{name:"MAD"},{name:"MXN"},{name:"MYR"},{name:"NOK"},{name:"NZD"},{name:"PEN"},{name:"PHP"},{name:"PKR"},{name:"PLN"},
      { name:"QAR"},{name:"RON"},{name:"RUB"},{name:"SAR"},{name:"SEK"},{name:"SGD"},{name:"THB"},{name:"TRY"},{name:"TWD"},{name:"USD"},{name:"VND"},{name:"ZAR"}] },
      { header: "lCValue", value: "" },
      { header: "lCIssuingDate", value: ""},
      { header: "lastShipmentDate", value: "" },
      {header:"negotiationDate",value:""},
      { header: "validity", value: ""}, 
      {header:"lcMaturityDate", value:""},
      { header: "goodsType", value: [{name:'Deferred payment guarantee'},{name:'Financial guarantee'},{name:'Advance payment guarantee'},{name:'Foreign bank guarantee'},{name:'Performance guarantee'},{name:'Bid bond guarantee'},{name:'Others'}] },
      { header: "otherbgtype", value: "" },
      { header: "usanceDays", value: "" },
      { header: "loadingCountry", value: [{name:"Applicant"},{name:"Beneficiary"}] },
      { header: "loadingPort", value: [{name:"Applicant"},{name:"Beneficiary"}] },
      { header: "dischargeCountry", value: [{name:'Yes'},{name:'No'}] },
      { header: "dischargePort", value: [{name:"Applicant"},{name:"Beneficiary"}] },
      { header: "finalDestinationOfGoods", value: "" },
      { header: "chargesType", value: [{name:"Applicant"},{name:"Beneficiary"}] },
      { header: "isESGComplaint", value: [{name:'Yes'},{name:'No'}] },
      { header: "userId", value: "" },

  
   
    ]
    // ok 
    
  }
];

  // excelData2 = this.transform(this.excelData);
  portLisit: { id: number; country: string; port: string; code: string; }[];

  portLisit1



  transform (data) {
    const noOfRowaToGenerate = 650;
console.log(data,'line no 74');
    return data.map(({name, values}) => {
      console.log(name,values,'line no 77');
      const headers = values.reduce((prev, next) => 
        ({...prev, [next.header]: Array.isArray
        (next.value) ? next.value.map(({name}) => name): next.value}), {})
      return {
        workSheet: name,
        rows: Array(noOfRowaToGenerate).fill(headers)
      }
    })
  }



  ngOnInit(): void {
    this.countryPort()
    this.bulkservice.getAllCountryCode().subscribe((res: any) => {
      this.countries = res.data[0].countryList;

      this.countryCodeList = this.countries.map(x => x.countryName).sort((a,b) => a-b);

      localStorage.setItem('countryName', JSON.stringify(this.countryCodeList));

    });
    this.bulkservice.getAllPortList().subscribe((res) =>{
      console.log(res,'res port list')
      // let newdata:any = res;
      this.portLisit1 = JSON.parse(JSON.stringify(res)).data
     
    
      sessionStorage.setItem('portlist', JSON.stringify(this.portLisit1.map(x => x.port)));
    });
   
  }
  reportType:any
  downloads:boolean;

  
  

  sample(){
    this.downloads = true;
    this.download = true;
  }
  uploadfile(){
    this.downloads = true;
    this.download = false;
  }

 
  submitDownload(e){
//     console.log(e)
    
 
//     this.excelData[0].values[0].value = [{ name: e }];
//     console.log(this.excelData,'excel data')
//     this.excelDatabg[0].values[0].value = [{ name: e }];
//     this.excelData2 = this.transform(this.excelData);
//     if(e == "BANKGUARANTEE"){
//     this.excelData2 = this.transform(this.excelDatabg)
//   }
//     if(e == "BILLAVALISATION"){
//       this.excelData2 = this.transform(this.excelDatabill)
//     }
//  this.exportAsXLSX(e);

this.bulkservice.sampleDownload(e).subscribe(
  
  (res:any) => {
  console.log(res,'res')
  const url = window.URL.createObjectURL(res);

  const a = document.createElement('a');

  document.body.appendChild(a);

  a.setAttribute('style', 'display:none');

  a.href = url;

  a.download = e + '.xlsx';

  a.click();

  window.URL.revokeObjectURL(url);

  a.remove();
},



)

  }
  
  exportAsXLSX(e): void {
    if(this.excelData2){
    }
  
    console.log(this.excelData2 , 'excel data')
  let newarray =[];
let nvc = []
this.countrylist.map((product, index) => {
  let newobject = product;
  if(newobject){
    let newvaule:any = {
      index: index,
      country: newobject,
    }
nvc.push(newvaule);
  }
})

this.countrylist = nvc
let newexceldata =[];
 newexceldata = this.excelData2
newexceldata.forEach(e => {
    this.countrylist.forEach(element => {
      let newv:any = [ ]
      newv = element
    
   
    if(e.rows){
      e.rows.map((product, inde) => {
let newobject = {...product}
   
      
 if(newv.index == inde){
   newobject.countrylist = newv.country;

 newarray.push(newobject)
 }
// 
      })
    
    }
    
  })
  })
 


  this.excelData2.forEach(e => {
if(e.rows){

  let newvalue =newarray.concat(e.rows);
  e.rows = newvalue
}
  })

  // for dicharging port
   {
  var newarrayport =[]
  let newexceldatacounrty =[];
  newexceldatacounrty = this.excelData2

  newexceldatacounrty.forEach(e => {
     this.portLisit.forEach(element => {
       let newv:any = [ ]
       newv = element
      
    
     if(e.rows){
       e.rows.map((product, inde) => {
let newobject = {...product}
       
 
  if((newv.id) == (inde + 1)){
    newobject.countryportlist = newv.port;
    newarrayport.push(newobject)
  }
// 
       })
     
     }
     
   })
   })


   this.excelData2.forEach(e => {
    if(e.rows){
  
      e.rows = newarrayport
    }
      })
    }
//  End

// for new changes 
console.log(this.excelData2,'this.excelData2')
var newDataObject = { workSheet: 'data2', rows: [1, 2, 34] };
// this.excelData2.push(newDataObject);
console.log(this.excelData2,'this.excelDatalast')
if(e != 'BANKGUARANTEE' && e != 'BILLAVALISATION'){
  this.excelData2.push(newDataObject);
    this.excelService.exportAsExcelFile(this.excelData2, "sample",e);
}else if(e == 'BANKGUARANTEE'){
  // this.excelData2.push(newDataObject);
this.excelService.exportAsExcelFileBgtype(this.excelData2,"sample",e);

}else if(e == 'BILLAVALISATION'){
this.excelService.exportAsExcelFilebillAval(this.excelData2,"sample",e)
}
    
  }





  countryPort(){
    var portlist =[
        {"id": 1,"country": "Albania","port": "Sarande","code": "AL SAR"
        },
        {"id": 2,"country": "Albania","port": "Shengjjin","code": "AL SHG"
        },
        {"id": 3,"country": "Albania","port": "Vlore (Vlora, Vlone)","code": "AL VOA"
        },
        {"id": 4,"country": "Algeria","port": "Algiers","code": "DZ ALG"
        },
        {"id": 5,"country": "Algeria","port": "Annaba (Ex Bone)","code": "DZ AAE"
        },
        {"id": 6,"country": "Algeria","port": "Arzew","code": "DZ AZW"
        },
        {"id": 7,"country": "Algeria","port": "Bejaia (Ex Bougie)","code": "DZ BJA"
        },
        {"id": 8,"country": "Algeria","port": "Dellys","code": "DZ DEL"
        },
        {"id": 9,"country": "Algeria","port": "Ghazaouet","code": "DZ GHA"
        },
        {"id": 10,"country": "Algeria","port": "Mostaganem","code": "DZ MOS"
        },
        {"id": 11,"country": "Algeria","port": "Oran","code": "DZ ORN"
        },
        {"id": 12,"country": "Algeria","port": "Skikda (Ex Philippeville)","code": "DZ SKI"
        },
        {"id": 13,"country": "Algeria","port": "Tenes","code": "DZ TEN"
        },
        {"id": 14,"country": "American Samoa","port": "Pago Pago","code": "AS PPG"
        },
        {"id": 15,"country": "Angola","port": "Cabinda","code": "AO CAB"
        },
        {"id": 16,"country": "Angola","port": "Lobito","code": "AO LOB"
        },
        {"id": 17,"country": "Angola","port": "Luanda","code": "AO LAD"
        },
        {"id": 18,"country": "Angola","port": "Namibe","code": "AO MSZ"
        },
        {"id": 19,"country": "Angola","port": "Porto Amboim","code": "AO PBN"
        },
        {"id": 20,"country": "Angola","port": "Soyo","code": "AO SOQ"
        },
        {"id": 21,"country": "Argentina","port": "Bahia Blanca","code": "AR BHI"
        },
        {"id": 22,"country": "Argentina","port": "Buenos Aires","code": "AR BUE"
        },
        {"id": 23,"country": "Argentina","port": "Comodoro Rivadavia","code": "AR CRD"
        },
        {"id": 24,"country": "Argentina","port": "Concepcion del Uruguay","code": "AR COU"
        },
        {"id": 25,"country": "Argentina","port": "Mar del Plata","code": "AR MDQ"
        },
        {"id": 26,"country": "Argentina","port": "Necochea","code": "AR NEC"
        },
        {"id": 27,"country": "Argentina","port": "Puerto Madryn","code": "AR PMY"
        },
        {"id": 28,"country": "Argentina","port": "Rio Gallegos","code": "AR RGL"
        },
        {"id": 29,"country": "Argentina","port": "Rosario","code": "AR ROS"
        },
        {"id": 30,"country": "Argentina","port": "Santa Fe","code": "AR SFN"
        },
        {"id": 31,"country": "Argentina","port": "Ushuaia","code": "AR USH"
        },
        {"id": 32,"country": "Aruba","port": "Oranjestad","code": "AW ORJ"
        },
        {"id": 33,"country": "Ascension Island","port": "Georgetown","code": "SH ASI"
        },
        {"id": 34,"country": "Australia","port": "Adelaide","code": "AU PAE"
        },
        {"id": 35,"country": "Australia","port": "Brisbane","code": "AU BNE"
        },
        {"id": 36,"country": "Australia","port": "Cairns","code": "AU CNS"
        },
        {"id": 37,"country": "Australia","port": "Darwin","code": "AU DRW"
        },
        {"id": 38,"country": "Australia","port": "Devonport","code": "AU DPO"
        },
        {"id": 39,"country": "Australia","port": "Fremantle","code": "AU FRE"
        },
        {"id": 40,"country": "Australia","port": "Geelong","code": "AU GEX"
        },
        {"id": 41,"country": "Australia","port": "Hobart","code": "AU HBA"
        },
        {"id": 42,"country": "Australia","port": "Mackay","code": "AU MKY"
        },
        {"id": 43,"country": "Australia","port": "Melbourne","code": "AU MEL"
        },
        {"id": 44,"country": "Australia","port": "Sydney","code": "AU SYD"
        },
        {"id": 45,"country": "Australia","port": "Townsville","code": "AU TSV"
        },
        {"id": 46,"country": "Azerbaijan","port": "Baku","code": "AZ BAK"
        },
        {"id": 47,"country": "Bahamas","port": "Freeport","code": "BS FPO"
        },
        {"id": 48,"country": "Bahamas","port": "Nassau","code": "BS NAS"
        },
        {"id": 49,"country": "Bahrain","port": "Mina Salman","code": "BH MIN"
        },
        {"id": 50,"country": "Bahrain","port": "Sitra","code": "BH SIT"
        },
        {"id": 51,"country": "Bangladesh","port": "Chittagong","code": "BD CGP"
        },
        {"id": 52,"country": "Bangladesh","port": "Mongla","code": "BD MGL"
        },
        {"id": 53,"country": "Barbados","port": "Bridgetown","code": "BB BGI"
        },
        {"id": 54,"country": "Belgium","port": "Antwerp","code": "BE ANR"
        },
        {"id": 55,"country": "Belgium","port": "Brussels (Bruxelles)","code": "BE BRU"
        },
        {"id": 56,"country": "Belgium","port": "Ghent","code": "BE GNE"
        },
        {"id": 57,"country": "Belgium","port": "Liege","code": "BE LGG"
        },
        {"id": 58,"country": "Belgium","port": "Zeebrugge","code": "BE ZEE"
        },
        {"id": 59,"country": "Belize","port": "Belize City","code": "BZ BZE"
        },
        {"id": 60,"country": "Benin","port": "Cotonou","code": "BJ COO"
        },
        {"id": 61,"country": "Bermuda","port": "Hamilton","code": "BM BDA"
        },
        {"id": 62,"country": "Bermuda","port": "St Georges","code": "BM SGE"
        },
        {"id": 63,"country": "Brazil","port": "Belem","code": "BR BEL"
        },
        {"id": 64,"country": "Brazil","port": "Fortaleza","code": "BR FOR"
        },
        {"id": 65,"country": "Brazil","port": "Imbituba","code": "BR IBB"
        },
        {"id": 66,"country": "Brazil","port": "Manaus","code": "BR MAO"
        },
        {"id": 67,"country": "Brazil","port": "Paranagua","code": "BR PNG"
        },
        {"id": 68,"country": "Brazil","port": "Porto Alegre","code": "BR POA"
        },
        {"id": 69,"country": "Brazil","port": "Recife","code": "BR REC"
        },
        {"id": 70,"country": "Brazil","port": "Rio De Janeiro","code": "BR RIO"
        },
        {"id": 71,"country": "Brazil","port": "Rio Grande","code": "BR RIG"
        },
        {"id": 72,"country": "Brazil","port": "Salvador","code": "BR SSA"
        },
        {"id": 73,"country": "Brazil","port": "Santos","code": "BR SSZ"
        },
        {"id": 74,"country": "Brazil","port": "Vitoria","code": "BR VIX"
        },
        {"id": 75,"country": "Brunei Darussalam","port": "Kuala Belait","code": "BN KUB"
        },
        {"id": 76,"country": "Brunei Darussalam","port": "Muara","code": "BN MUA"
        },
        {"id": 77,"country": "Bulgaria","port": "Varna","code": "BG VAR"
        },
        {"id": 78,"country": "Cambodia","port": "Kompongsom","code": "KH KOS"
        },
        {"id": 79,"country": "Cambodia","port": "Phnom Penh","code": "KH PNH"
        },
        {"id": 80,"country": "Cameroon","port": "Douala","code": "CM DLA"
        },
        {"id": 81,"country": "Cameroon","port": "Kribi","code": "CM KBI"
        },
        {"id": 82,"country": "Cameroon","port": "Tiko","code": "CM TKC"
        },
        {"id": 83,"country": "Canada","port": "Alberni","code": "CM PAB"
        },
        {"id": 84,"country": "Canada","port": "Becancour","code": "CA BEC"
        },
        {"id": 85,"country": "Canada","port": "Churchill","code": "CA CHV"
        },
        {"id": 86,"country": "Canada","port": "Fraser River Port (Port of New Westminster)","code": "CA NWE"
        },
        {"id": 87,"country": "Canada","port": "Halifax","code": "CA HAL"
        },
        {"id": 88,"country": "Canada","port": "Hamilton","code": "CA HAM"
        },
        {"id": 89,"country": "Canada","port": "Halifax","code": "CA HAL"
        },
        {"id": 90,"country": "Canada","port": "Montreal","code": "CA MTR"
        },
        {"id": 91,"country": "Canada","port": "Nanaimo","code": "CA NNO"
        },
        {"id": 92,"country": "Canada","port": "Saguenay","code": "n/a"
        },
        {"id": 93,"country": "Canada","port": "Sept Iles (Seven Islands)","code": "CA SEI"
        },
        {"id": 94,"country": "Canada","port": "St Johns","code": "CA SJF"
        },
        {"id": 95,"country": "Canada","port": "Sydney","code": "CA SYD"
        },
        {"id": 96,"country": "Canada","port": "Thunder Bay","code": "CA THU"
        },
        {"id": 97,"country": "Canada","port": "Toronto","code": "CA TOR"
        },
        {"id": 98,"country": "Canada","port": "Trois-Rivieres","code": "CA TRR"
        },
        {"id": 99,"country": "Canada","port": "Vancouver","code": "CA VAN"
        },
        {"id": 100,"country": "Canada","port": "Windsor","code": "CA WND"
        },
        {"id": 101,"country": "Canary Islands","port": "Las Palmas","code": "ES LPA"
        },
        {"id": 102,"country": "Canary Islands","port": "Santa Cruz de Tenerife","code": "ES SCT"
        },
        {"id": 103,"country": "Cape Verde","port": "Porto Grande","code": "CV PGR"
        },
        {"id": 104,"country": "Cayman Islands","port": "Georgetown, Grand Cayman","code": "KY GEC"
        },
        {"id": 105,"country": "Chile","port": "Antofagasta","code": "CL ANF"
        },
        {"id": 106,"country": "Chile","port": "Arica","code": "CL ARI"
        },
        {"id": 107,"country": "Chile","port": "Chanaral","code": "CL CNR"
        },
        {"id": 108,"country": "Chile","port": "Iquique","code": "CL IQQ"
        },
        {"id": 109,"country": "Chile","port": "Puerto Montt","code": "CL PMC"
        },
        {"id": 110,"country": "Chile","port": "Punta Arenas","code": "CL PUQ"
        },
        {"id": 111,"country": "Chile","port": "San Antonio","code": "CL SAI"
        },
        {"id": 112,"country": "Chile","port": "San Vicente","code": "CL SVE"
        },
        {"id": 113,"country": "Chile","port": "Talcahuano","code": "CL TAL"
        },
        {"id": 114,"country": "Chile","port": "Valparaiso","code": "CL VAP"
        },
        {"id": 115,"country": "China","port": "Dalian","code": "CN DLC"
        },
        {"id": 116,"country": "China","port": "Fuzhou","code": "CN FOC"
        },
        {"id": 117,"country": "China","port": "Guangzhou","code": "CN CAN"
        },
        {"id": 118,"country": "China","port": "Haikou","code": "CN HAK"
        },
        {"id": 119,"country": "China","port": "Lianyungang","code": "CN LYG"
        },
        {"id": 120,"country": "China","port": "Nantong","code": "CN NTG"
        },
        {"id": 121,"country": "China","port": "Ningbo","code": "CN NGB"
        },
        {"id": 122,"country": "China","port": "Qingdao","code": "CN TAO"
        },
        {"id": 123,"country": "China","port": "Qinhuangdao","code": "CN SHP"
        },
        {"id": 124,"country": "China","port": "Shanghai","code": "CN SHA"
        },
        {"id": 125,"country": "China","port": "Shantou","code": "CN SWA"
        },
        {"id": 126,"country": "China","port": "Tianjin","code": "CN TSN"
        },
        {"id": 127,"country": "China","port": "Xiamen","code": "CN XMN"
        },
        {"id": 128,"country": "China","port": "Zhanjiang","code": "CN ZHA"
        },
        {"id": 129,"country": "Colombia","port": "Barranquilla","code": "CO BAQ"
        },
        {"id": 130,"country": "Colombia","port": "Buenaventura","code": "CO BUN"
        },
        {"id": 131,"country": "Colombia","port": "Cartagena","code": "CO CTG"
        },
        {"id": 132,"country": "Colombia","port": "Puerto Bolivar","code": "CO PBO"
        },
        {"id": 133,"country": "Colombia","port": "Tumaco","code": "CO TCO"
        },
        {"id": 134,"country": "Colombia","port": "Turbo","code": "CO TRB"
        },
        {"id": 135,"country": "Comoros","port": "Moroni","code": "KM YVA"
        },
        {"id": 136,"country": "Comoros","port": "Mutsamudu","code": "KM MUT"
        },
        {"id": 137,"country": "Congo","port": "Pointe Noire","code": "CG PNR"
        },
        {"id": 138,"country": "Congo, Dem. Republic of","port": "Banana","code": "ZR BNW"
        },
        {"id": 139,"country": "Congo, Dem. Republic of","port": "Boma","code": "ZR BOA"
        },
        {"id": 140,"country": "Costa Rica","port": "Caldera","code": "CR CAL"
        },
        {"id": 141,"country": "Costa Rica","port": "Golfito","code": "CR GLF"
        },
        {"id": 142,"country": "Costa Rica","port": "Puntarenas","code": "CR PAS"
        },
        {"id": 143,"country": "Costa Rica","port": "Quepos","code": "CR XQP"
        },
        {"id": 144,"country": "CÃ´te d'Ivoire","port": "Abidjan","code": "CI ABJ"
        },
        {"id": 145,"country": "Croatia","port": "Rijeka Bakar","code": "HR RJK"
        },
        {"id": 146,"country": "Croatia","port": "Zadar","code": "HR ZAD"
        },
        {"id": 147,"country": "Croatia","port": "Dubrovnik","code": "HR DBV"
        },
        {"id": 148,"country": "Croatia","port": "Omisalj","code": "HR OMI"
        },
        {"id": 149,"country": "Croatia","port": "Ploce","code": "HR PLE"
        },
        {"id": 150,"country": "Croatia","port": "Pula","code": "HR PUY"
        },
        {"id": 151,"country": "Croatia","port": "Sibenik","code": "HR SIB"
        },
        {"id": 152,"country": "Croatia","port": "Split","code": "HR SPU"
        },
        {"id": 153,"country": "Cuba","port": "Havana","code": "CU HAV"
        },
        {"id": 154,"country": "Cuba","port": "Manzanillo","code": "CU MZO"
        },
        {"id": 155,"country": "Cuba","port": "Matanzas","code": "CU QMA"
        },
        {"id": 156,"country": "Cuba","port": "Nuevitas","code": "CU NVT"
        },
        {"id": 157,"country": "Cuba","port": "Santiago de Cuba","code": "CU SCU"
        },
        {"id": 158,"country": "Cyprus","port": "Akrotiri","code": "CY AKT"
        },
        {"id": 159,"country": "Cyprus","port": "Famagusta","code": "CY FMG"
        },
        {"id": 160,"country": "Cyprus","port": "Larnaca","code": "CY LAT"
        },
        {"id": 161,"country": "Cyprus","port": "Limassol","code": "CY LMS"
        },
        {"id": 162,"country": "Cyprus","port": "Paphos","code": "CY PFO"
        },
        {"id": 163,"country": "Cyprus","port": "Vassiliko","code": "CY VAS"
        },
        {"id": 164,"country": "Denmark","port": "Aarhus","code": "DK AAR"
        },
        {"id": 165,"country": "Denmark","port": "Esbjerg","code": "DK EBJ"
        },
        {"id": 166,"country": "Denmark","port": "Fredericia","code": "DK FRC"
        },
        {"id": 167,"country": "Denmark","port": "Frederikshavn","code": "DK FDH"
        },
        {"id": 168,"country": "Denmark","port": "Grenaa","code": "DK GRE"
        },
        {"id": 169,"country": "Denmark","port": "Odense","code": "DK ODE"
        },
        {"id": 170,"country": "Denmark","port": "Ronne","code": "DK RNN"
        },
        {"id": 171,"country": "Djibouti","port": "Djibouti","code": "DJ JIB"
        },
        {"id": 172,"country": "Dominica","port": "Portsmouth","code": "DM POR"
        },
        {"id": 173,"country": "Dominica","port": "Roseau","code": "DM RSU"
        },
        {"id": 174,"country": "Dominican Republic","port": "Barahona","code": "DO BRX"
        },
        {"id": 175,"country": "Dominican Republic","port": "La Romana","code": "DO LRM"
        },
        {"id": 176,"country": "Dominican Republic","port": "Puerto Plata","code": "DO POP"
        },
        {"id": 177,"country": "Dominican Republic","port": "Rio Haina","code": "DO HAI"
        },
        {"id": 178,"country": "Dominican Republic","port": "San Pedro de Macoris","code": "DO SPM"
        },
        {"id": 179,"country": "Dominican Republic","port": "Santo Domingo","code": "DO SDQ"
        },
        {"id": 180,"country": "Ecuador","port": "Esmeraldas","code": "EC ESM"
        },
        {"id": 181,"country": "Ecuador","port": "Guayaquil","code": "EC GYE"
        },
        {"id": 182,"country": "Ecuador","port": "La Libertad","code": "EC LLD"
        },
        {"id": 183,"country": "Ecuador","port": "Manta","code": "EC MEC"
        },
        {"id": 184,"country": "Ecuador","port": "Puerto Bolivar","code": "EC PBO"
        },
        {"id": 185,"country": "Ecuador","port": "San Lorenzo","code": "EC SLR"
        },
        {"id": 186,"country": "Egypt","port": "Alexandria","code": "EG EDK"
        },
        {"id": 187,"country": "Egypt","port": "Damietta","code": "EG DAM"
        },
        {"id": 188,"country": "Egypt","port": "Port Said","code": "EG PSD"
        },
        {"id": 189,"country": "Egypt","port": "Suez (Al Suweis)","code": "EG"
        },
        {"id": 190,"country": "El Salvador","port": "Acajutla","code": "SV AQJ"
        },
        {"id": 191,"country": "El Salvador","port": "Cutuco","code": "SV CUT"
        },
        {"id": 192,"country": "Equatorial Guinea","port": "Bata","code": "GQ BSG"
        },
        {"id": 193,"country": "Equatorial Guinea","port": "Ceiba Marine Terminal","code": "n/a"
        },
        {"id": 194,"country": "Equatorial Guinea","port": "Malabo (Rey Malabo)","code": "GQ SSG"
        },
        {"id": 195,"country": "Estonia","port": "PÃ¤rnu","code": "EE PYA"
        },
        {"id": 196,"country": "Estonia","port": "Tallinn","code": "EE TLL"
        },
        {"id": 197,"country": "Faroe Islands","port": "Klaksvik","code": "FO KVI"
        },
        {"id": 198,"country": "Faroe Islands","port": "Torshavn","code": "FO THO"
        },
        {"id": 199,"country": "Fiji","port": "Labasa (Lambasa)","code": "FJ LBS"
        },
        {"id": 200,"country": "Fiji","port": "Lautoka","code": "FJ LTK"
        },
        {"id": 201,"country": "Fiji","port": "Levuka","code": "FJ LEV"
        },
        {"id": 202,"country": "Fiji","port": "Savu Savu","code": "FJ SVU"
        },
        {"id": 203,"country": "Fiji","port": "Suva","code": "FJ SUV"
        },
        {"id": 204,"country": "Finland","port": "Hamina","code": "FI HMN"
        },
        {"id": 205,"country": "Finland","port": "Helsinki","code": "FI HEL"
        },
        {"id": 206,"country": "Finland","port": "Kokkola","code": "FI KOK"
        },
        {"id": 207,"country": "Finland","port": "Kotka","code": "FI KTK"
        },
        {"id": 208,"country": "Finland","port": "Loviisa","code": "FI LOV"
        },
        {"id": 209,"country": "Finland","port": "Oulu","code": "FI OUL"
        },
        {"id": 210,"country": "Finland","port": "Pori","code": "FI POR"
        },
        {"id": 211,"country": "Finland","port": "Rauma","code": "FI RAU"
        },
        {"id": 212,"country": "Finland","port": "Turku","code": "FI TKU"
        },
        {"id": 213,"country": "Finland","port": "Uusikaupunki","code": "FI UKI"
        },
        {"id": 214,"country": "Finland","port": "Vaasa","code": "FI VAA"
        },
        {"id": 215,"country": "France","port": "Bordeaux","code": "FR BOD"
        },
        {"id": 216,"country": "France","port": "Boulogne Sur Mer","code": "FR BOL"
        },
        {"id": 217,"country": "France","port": "Cherbourg","code": "FR CER"
        },
        {"id": 218,"country": "France","port": "Dunkerque","code": "FR DKK"
        },
        {"id": 219,"country": "France","port": "La Rochelle-Pallice","code": "FR LPE"
        },
        {"id": 220,"country": "France","port": "Le Havre","code": "FR LEH"
        },
        {"id": 221,"country": "France","port": "Marseille","code": "FR MRS"
        },
        {"id": 222,"country": "France","port": "Nantes-St. Nazaire","code": "FR NTE"
        },
        {"id": 223,"country": "France","port": "Paris","code": "FR PAR"
        },
        {"id": 224,"country": "France","port": "Rouen","code": "FR URO"
        },
        {"id": 225,"country": "France","port": "St Malo","code": "FR SML"
        },
        {"id": 226,"country": "France","port": "Strasbourg","code": "FR SXB"
        },
        {"id": 227,"country": "France","port": "Toulon","code": "FR TLN"
        },
        {"id": 228,"country": "French Guiana","port": "Cayenne","code": "GF CAY"
        },
        {"id": 229,"country": "French Polynesia","port": "Papeete","code": "PF PPT"
        },
        {"id": 230,"country": "Gabon","port": "Cap Lopez","code": "GA CLZ"
        },
        {"id": 231,"country": "Gabon","port": "Libreville","code": "GA LBV"
        },
        {"id": 232,"country": "Gabon","port": "Owendo","code": "GA OWE"
        },
        {"id": 233,"country": "Gabon","port": "Port Gentil","code": "GA POG"
        },
        {"id": 234,"country": "Gambia","port": "Banjul","code": "GM BJL"
        },
        {"id": 235,"country": "Georgia","port": "Batumi","code": "GE BUS"
        },
        {"id": 236,"country": "Georgia","port": "Poti","code": "GE PTI"
        },
        {"id": 237,"country": "Georgia","port": "Sukhumi","code": "GE SUI"
        },
        {"id": 238,"country": "Germany","port": "Brake","code": "DE BKE"
        },
        {"id": 239,"country": "Germany","port": "Bremen","code": "DE BRE"
        },
        {"id": 240,"country": "Germany","port": "Bremerhaven","code": "DE BRV"
        },
        {"id": 241,"country": "Germany","port": "Duisburg","code": "DE DUI"
        },
        {"id": 242,"country": "Germany","port": "Dusseldorf","code": "DE DUS"
        },
        {"id": 243,"country": "Germany","port": "Emden","code": "DE EME"
        },
        {"id": 244,"country": "Germany","port": "Hamburg","code": "DE HAM"
        },
        {"id": 245,"country": "Germany","port": "Karlsruhe","code": "DE KAE"
        },
        {"id": 246,"country": "Germany","port": "Kiel","code": "DE KEL"
        },
        {"id": 247,"country": "Germany","port": "Lubeck","code": "DE LBC"
        },
        {"id": 248,"country": "Germany","port": "Mannheim","code": "DE MHG"
        },
        {"id": 249,"country": "Germany","port": "Rostock","code": "DE RSK"
        },
        {"id": 250,"country": "Germany","port": "Wilhelmshavn","code": "DE WVN"
        },
        {"id": 251,"country": "Ghana","port": "Takoradi","code": "GH TKD"
        },
        {"id": 252,"country": "Ghana","port": "Tema","code": "GH TEM"
        },
        {"id": 253,"country": "Gibraltar","port": "Gibraltar","code": "GI GIB"
        },
        {"id": 254,"country": "Greece","port": "Eleusis","code": "GR EEU"
        },
        {"id": 255,"country": "Greece","port": "Iraklion (Heraklion)","code": "GR HER"
        },
        {"id": 256,"country": "Greece","port": "Kavala","code": "GR KVA"
        },
        {"id": 257,"country": "Greece","port": "Patras","code": "GR GPA"
        },
        {"id": 258,"country": "Greece","port": "Piraeus","code": "GR PIR"
        },
        {"id": 259,"country": "Greece","port": "Thessaloniki","code": "GR SKG"
        },
        {"id": 260,"country": "Greece","port": "Volos","code": "GR VOL"
        },
        {"id": 261,"country": "Greenland","port": "Holsteinsborg (Sisimiut)","code": "GL JHS"
        },
        {"id": 262,"country": "Greenland","port": "Nanortalik","code": "GL JNN"
        },
        {"id": 263,"country": "Greenland","port": "Narsarsuaq","code": "GL UAK"
        },
        {"id": 264,"country": "Greenland","port": "Nuuk (Godthaab)","code": "GL GOH"
        },
        {"id": 265,"country": "Guadeloupe","port": "Gustavia","code": "GP GUS"
        },
        {"id": 266,"country": "Guadeloupe","port": "Pointe-a-Pitre","code": "GP PTP"
        },
        {"id": 267,"country": "Guam","port": "Apra (Agana)","code": "GU APR"
        },
        {"id": 268,"country": "Guatemala","port": "Champerico","code": "GT CHR"
        },
        {"id": 269,"country": "Guatemala","port": "Puerto Barrios","code": "GT PBR"
        },
        {"id": 270,"country": "Guatemala","port": "Santo Tomas De Castilla","code": "GT STC"
        },
        {"id": 271,"country": "Guinea","port": "Conakry","code": "GN CKY"
        },
        {"id": 272,"country": "Guinea","port": "Port Kamsar","code": "GN KMR"
        },
        {"id": 273,"country": "Guinea-Bissau","port": "Bissau","code": "GW BXO"
        },
        {"id": 274,"country": "Guyana","port": "Georgetown","code": "GY GEO"
        },
        {"id": 275,"country": "Guyana","port": "New Amsterdam","code": "GY QSK"
        },
        {"id": 276,"country": "Haiti","port": "Port Au Prince","code": "HT PAP"
        },
        {"id": 277,"country": "Honduras","port": "La Ceiba","code": "HN LCE"
        },
        {"id": 278,"country": "Honduras","port": "Puerto Castilla","code": "HN PCA"
        },
        {"id": 279,"country": "Honduras","port": "Puerto Cortes","code": "HN PCR"
        },
        {"id": 280,"country": "Honduras","port": "San Lorenzo","code": "HN SLO"
        },
        {"id": 281,"country": "Honduras","port": "Tela","code": "HN TEA"
        },
        {"id": 282,"country": "Hong Kong","port": "Hong Kong","code": "HK HKG"
        },
        {"id": 283,"country": "Iceland","port": "Akureyri","code": "IS AKU"
        },
        {"id": 284,"country": "Iceland","port": "Hafnarfjordur","code": "IS HAF"
        },
        {"id": 285,"country": "Iceland","port": "Isafjordur","code": "IS ISA"
        },
        {"id": 286,"country": "Iceland","port": "Keflavik","code": "IS KEV"
        },
        {"id": 287,"country": "Iceland","port": "Reykjavik","code": "IS REY"
        },
        {"id": 288,"country": "Iceland","port": "Vestmannaeyjar","code": "IS VES"
        },
        {"id": 289,"country": "India","port": "Bombay (Mumbai)","code": "IN BOM"
        },
        {"id": 290,"country": "India","port": "Calcutta (Kolkata)","code": "IN CCU"
        },
        {"id": 291,"country": "India","port": "Chennai (Madras)","code": "IN MAA"
        },
        {"id": 292,"country": "India","port": "Cochin","code": "IN COK"
        },
        {"id": 293,"country": "India","port": "Kandla","code": "IN IXY"
        },
        {"id": 294,"country": "India","port": "Nhava Sheva (Jawaharlal Nehru)","code": "IN NSA"
        },
        {"id": 295,"country": "India","port": "Tuticorin","code": "IN TUT"
        },
        {"id": 296,"country": "India","port": "Vishakhapatnam","code": "IN VTZ"
        },
        {"id": 297,"country": "Indonesia","port": "Cilacap, Java (Tanjung Intan)","code": "ID CXP"
        },
        {"id": 298,"country": "Indonesia","port": "Cirebon, Java","code": "ID CBN"
        },
        {"id": 299,"country": "Indonesia","port": "Jakarta, Java (Tanjung Priok)","code": "ID TPP"
        },
        {"id": 300,"country": "Indonesia","port": "Kupang, Timor","code": "ID KOE"
        },
        {"id": 301,"country": "Indonesia","port": "Palembang, Sumatra","code": "ID PLM"
        },
        {"id": 302,"country": "Indonesia","port": "Semarang, Java (Tanjung Emas)","code": "ID SRG"
        },
        {"id": 303,"country": "Indonesia","port": "Surabaya, Java (Tanjung Perak)","code": "ID SUB"
        },
        {"id": 304,"country": "Indonesia","port": "Ujung Pandang, (Sulawesi (Makassar)","code": "ID UPG"
        },
        {"id": 305,"country": "Iran","port": "Abadan","code": "IR ABD"
        },
        {"id": 306,"country": "Iran","port": "Bandar Abbas","code": "IR BND"
        },
        {"id": 307,"country": "Iran","port": "Bandar Anzali","code": "IR BAZ"
        },
        {"id": 308,"country": "Iran","port": "Bandar Mahshahr","code": "IR MRX"
        },
        {"id": 309,"country": "Iran","port": "Bushehr","code": "IR BUZ"
        },
        {"id": 310,"country": "Iran","port": "Imam Khomeini","code": "IR BKM"
        },
        {"id": 311,"country": "Iran","port": "Khorramshahr","code": "IR KHO"
        },
        {"id": 312,"country": "Iran","port": "Lavan","code": "IR LVP"
        },
        {"id": 313,"country": "Iran","port": "Sirri Island","code": "IR SXI"
        },
        {"id": 314,"country": "Iraq","port": "Basra","code": "IQ BSR"
        },
        {"id": 315,"country": "Iraq","port": "Khor al Zubair","code": "IQ KAZ"
        },
        {"id": 316,"country": "Iraq","port": "Umm Qasr","code": "IQ UQR"
        },
        {"id": 317,"country": "Ireland","port": "Arklow","code": "IE ARK"
        },
        {"id": 318,"country": "Ireland","port": "Cork","code": "IE ORK"
        },
        {"id": 319,"country": "Ireland","port": "Drogheda","code": "IE DRO"
        },
        {"id": 320,"country": "Ireland","port": "Dublin","code": "IE DUB"
        },
        {"id": 321,"country": "Ireland","port": "Foynes (Shannon Foynes Port)","code": "IE FOV"
        },
        {"id": 322,"country": "Ireland","port": "Galway","code": "IE GWY"
        },
        {"id": 323,"country": "Ireland","port": "New Ross","code": "IE NRS"
        },
        {"id": 324,"country": "Ireland","port": "Waterford","code": "IE WAT"
        },
        {"id": 325,"country": "Israel","port": "Ashdod","code": "IL ASH"
        },
        {"id": 326,"country": "Israel","port": "Ashkelon","code": "IL AKL"
        },
        {"id": 327,"country": "Israel","port": "Eilat","code": "IL ETH"
        },
        {"id": 328,"country": "Israel","port": "Hadera","code": "IL HAD"
        },
        {"id": 329,"country": "Israel","port": "Haifa","code": "IL HFA"
        },
        {"id": 330,"country": "Italy","port": "Augusta","code": "IT AUG"
        },
        {"id": 331,"country": "Italy","port": "Bagnoli","code": "IT BLN"
        },
        {"id": 332,"country": "Italy","port": "Bari","code": "IT BRI"
        },
        {"id": 333,"country": "Italy","port": "Brindisi","code": "IT BDS"
        },
        {"id": 334,"country": "Italy","port": "Gela","code": "IT GEA"
        },
        {"id": 335,"country": "Italy","port": "Genoa","code": "IT GOA"
        },
        {"id": 336,"country": "Italy","port": "La Spezia","code": "IT SPE"
        },
        {"id": 337,"country": "Italy","port": "Livorno","code": "IT LIV"
        },
        {"id": 338,"country": "Italy","port": "Messina","code": "IT MSN"
        },
        {"id": 339,"country": "Italy","port": "Milazzo","code": "IT MLZ"
        },
        {"id": 340,"country": "Italy","port": "Napoli (Naples)","code": "IT NAP"
        },
        {"id": 341,"country": "Italy","port": "Palermo","code": "IT PMO"
        },
        {"id": 342,"country": "Italy","port": "Porto Torres","code": "IT PTO"
        },
        {"id": 343,"country": "Italy","port": "Ravenna","code": "IT RAN"
        },
        {"id": 344,"country": "Italy","port": "Sarroch (Porto Foxi)","code": "IT PFX"
        },
        {"id": 345,"country": "Italy","port": "Savona-Vado","code": "IT SVN"
        },
        {"id": 346,"country": "Italy","port": "Taranto","code": "IT TAR"
        },
        {"id": 347,"country": "Italy","port": "Trieste","code": "IT TRS"
        },
        {"id": 348,"country": "Italy","port": "Venice","code": "IT VCE"
        },
        {"id": 349,"country": "Jamaica","port": "Kingston","code": "JM KIN"
        },
        {"id": 350,"country": "Jamaica","port": "Montego Bay","code": "JM MBJ"
        },
        {"id": 351,"country": "Jamaica","port": "Ocho Rios","code": "JM OCJ"
        },
        {"id": 352,"country": "Jamaica","port": "Port Antonio","code": "JM POT"
        },
        {"id": 353,"country": "Jamaica","port": "Port Esquivel","code": "JM PEV"
        },
        {"id": 354,"country": "Jamaica","port": "Rocky Point","code": "JM ROP"
        },
        {"id": 355,"country": "Japan","port": "Akita","code": "JP AXT"
        },
        {"id": 356,"country": "Japan","port": "Amagasaki","code": "JP AMA"
        },
        {"id": 357,"country": "Japan","port": "Chiba","code": "JP CHB"
        },
        {"id": 358,"country": "Japan","port": "Hachinohe","code": "JP HHE"
        },
        {"id": 359,"country": "Japan","port": "Hakodate, Hokkaido","code": "JP HKD"
        },
        {"id": 360,"country": "Japan","port": "Higashiharima","code": "JP HHR"
        },
        {"id": 361,"country": "Japan","port": "Himeji","code": "JP HIM"
        },
        {"id": 362,"country": "Japan","port": "Hiroshima","code": "JP HIJ"
        },
        {"id": 363,"country": "Japan","port": "Kawasaki","code": "JP KWS"
        },
        {"id": 364,"country": "Japan","port": "Kinuura","code": "JP KNU"
        },
        {"id": 365,"country": "Japan","port": "Kobe","code": "JP UKB"
        },
        {"id": 366,"country": "Japan","port": "Kushiro, Hokkaido","code": "JP KUH"
        },
        {"id": 367,"country": "Japan","port": "Mizushima","code": "JP MIZ"
        },
        {"id": 368,"country": "Japan","port": "Moji","code": "JP MOJ"
        },
        {"id": 369,"country": "Japan","port": "Nagoya","code": "JP NGO"
        },
        {"id": 370,"country": "Japan","port": "Osaka","code": "JP OSA"
        },
        {"id": 371,"country": "Japan","port": "Sakai","code": "JP SAK"
        },
        {"id": 372,"country": "Japan","port": "Sakata","code": "JP SKT"
        },
        {"id": 373,"country": "Japan","port": "Shimizu","code": "JP SMZ"
        },
        {"id": 374,"country": "Japan","port": "Tokyo","code": "JP TYO"
        },
        {"id": 375,"country": "Japan","port": "Tomakomai, Hokkaido","code": "JP TMK"
        },
        {"id": 376,"country": "Japan","port": "Yokohama","code": "JP YOK"
        },
        {"id": 377,"country": "Jordan","port": "Aqaba (El Akaba)","code": "JO AQJ"
        },
        {"id": 378,"country": "Kenya","port": "Lamu","code": "KE LAU"
        },
        {"id": 379,"country": "Kenya","port": "Mombasa","code": "KE MBA"
        },
        {"id": 380,"country": "Kiribati","port": "Betio (Tarawa)","code": "KI TRW"
        },
        {"id": 381,"country": "Korea (North)","port": "Chongjin","code": "KP CHO"
        },
        {"id": 382,"country": "Korea (North)","port": "Haeju","code": "KP HAE"
        },
        {"id": 383,"country": "Korea (North)","port": "Nampo","code": "KP NAM"
        },
        {"id": 384,"country": "Korea (North)","port": "Wonsan","code": "KP WON"
        },
        {"id": 385,"country": "SOUTH KOREA","port": "Busan (Pusan)","code": "KR PUS"
        },
        {"id": 386,"country": "SOUTH KOREA","port": "Chinhae","code": "KR CHF"
        },
        {"id": 387,"country": "SOUTH KOREA","port": "Inchon","code": "KR INC"
        },
        {"id": 388,"country": "SOUTH KOREA","port": "Masan","code": "KR MAS"
        },
        {"id": 389,"country": "SOUTH KOREA","port": "Mokpo","code": "KR MOK"
        },
        {"id": 390,"country": "SOUTH KOREA","port": "Pohang","code": "KR KPO"
        },
        {"id": 391,"country": "SOUTH KOREA","port": "Tonghae","code": "KR TGH"
        },
        {"id": 392,"country": "SOUTH KOREA","port": "Ulsan","code": "KR USN"
        },
        {"id": 393,"country": "SOUTH KOREA","port": "Yosu (Yeosu)","code": "KR YOS"
        },
        {"id": 394,"country": "Kuwait","port": "Mina al Ahmadi","code": "KW MEA"
        },
        {"id": 395,"country": "Kuwait","port": "Mina Saud","code": "KW MIS"
        },
        {"id": 396,"country": "Kuwait","port": "Shuwaikh","code": "KW SWK"
        },
        {"id": 397,"country": "Latvia","port": "Liepaja","code": "LV LPX"
        },
        {"id": 398,"country": "Latvia","port": "Riga","code": "SU RIX"
        },
        {"id": 399,"country": "Latvia","port": "Ventspils","code": "LV VNT"
        },
        {"id": 400,"country": "Lebanon","port": "Beirut","code": "LB BEY"
        },
        {"id": 401,"country": "Lebanon","port": "Chekka","code": "LB CHK"
        },
        {"id": 402,"country": "Lebanon","port": "Selaata","code": "LB SEL"
        },
        {"id": 403,"country": "Lebanon","port": "Sidon","code": "LB SDN"
        },
        {"id": 404,"country": "Lebanon","port": "Tripoli","code": "LB KYE"
        },
        {"id": 405,"country": "Liberia","port": "Buchanan","code": "LR UCN"
        },
        {"id": 406,"country": "Liberia","port": "Greenville","code": "LR GRE"
        },
        {"id": 407,"country": "Liberia","port": "Monrovia","code": "LR MLW"
        },
        {"id": 408,"country": "Libya","port": "Bingazi (Benghazi)","code": "LY BEN"
        },
        {"id": 409,"country": "Libya","port": "Derna","code": "LY DNF"
        },
        {"id": 410,"country": "Libya","port": "Marsa El Brega","code": "LY LMQ"
        },
        {"id": 411,"country": "Libya","port": "Misurata (Qasr Ahmed)","code": "LY MRA"
        },
        {"id": 412,"country": "Libya","port": "Ras Lanuf","code": "LY RLA"
        },
        {"id": 413,"country": "Libya","port": "Tobruk","code": "LY TOB"
        },
        {"id": 414,"country": "Libya","port": "Tripoli","code": "LY TIP"
        },
        {"id": 415,"country": "Libya","port": "Zuara","code": "LY ZUA"
        },
        {"id": 416,"country": "Lithuania","port": "Klaipeda","code": "LT KLJ"
        },
        {"id": 417,"country": "Macau","port": "Macau (Macao, Aomen)","code": "MOMFM"
        },
        {"id": 418,"country": "Madagascar","port": "Antsiranana (Diego Suarez)","code": "MG DIE"
        },
        {"id": 419,"country": "Madagascar","port": "Majunga (Mahajanga)","code": "MG MJN"
        },
        {"id": 420,"country": "Madagascar","port": "Toamasina (Tamatave)","code": "MG TOA"
        },
        {"id": 421,"country": "Madagascar","port": "Tulear (Toliara)","code": "MG TLE"
        },
        {"id": 422,"country": "Malaysia","port": "Bintulu, Sarawak","code": "MY BTU"
        },
        {"id": 423,"country": "Malaysia","port": "Kota Kinabalu, Sabah","code": "MY BKI"
        },
        {"id": 424,"country": "Malaysia","port": "Kuantan (Tanjong Gelang)","code": "MY KUA"
        },
        {"id": 425,"country": "Malaysia","port": "Kuching, Sarawak","code": "MY KCH"
        },
        {"id": 426,"country": "Malaysia","port": "Kudat, Sabah","code": "MY KUD"
        },
        {"id": 427,"country": "Malaysia","port": "Labuan, Sabah","code": "MY LBU"
        },
        {"id": 428,"country": "Malaysia","port": "Lahad Datu, Sabah","code": "MY LDU"
        },
        {"id": 429,"country": "Malaysia","port": "Lumut","code": "MY LUM"
        },
        {"id": 430,"country": "Malaysia","port": "Miri, Sarawak","code": "MY MYY"
        },
        {"id": 431,"country": "Malaysia","port": "Pasir Gudang, Johor","code": "MY PGU"
        },
        {"id": 432,"country": "Malaysia","port": "Penang (Georgetown)","code": "MY PEN"
        },
        {"id": 433,"country": "Malaysia","port": "Port Dickson","code": "MY PDI"
        },
        {"id": 434,"country": "Malaysia","port": "Port Klang (Kelang)","code": "MY PKL"
        },
        {"id": 435,"country": "Malaysia","port": "Sandakan, Sabah","code": "MY SDK"
        },
        {"id": 436,"country": "Malaysia","port": "Sibu, Sarawak","code": "MY SBW"
        },
        {"id": 437,"country": "Malaysia","port": "Tanjung Pelepas, Johor","code": "MY TPP"
        },
        {"id": 438,"country": "Malaysia","port": "Tawau, Sabah","code": "MY TWU"
        },
        {"id": 439,"country": "Malta","port": "Valletta","code": "MT MLA"
        },
        {"id": 440,"country": "Martinique","port": "Fort de France","code": "MQ FDF"
        },
        {"id": 441,"country": "Mauritania","port": "Nouadhibou","code": "MR NDB"
        },
        {"id": 442,"country": "Mauritania","port": "Nouakchott","code": "MR NKC"
        },
        {"id": 443,"country": "Mauritius","port": "Port Louis","code": "MU PLU"
        },
        {"id": 444,"country": "Mexico","port": "Acapulco","code": "MX ACA"
        },
        {"id": 445,"country": "Mexico","port": "Coatzacoalcos","code": "MX COA"
        },
        {"id": 446,"country": "Mexico","port": "Guaymas","code": "MX GYM"
        },
        {"id": 447,"country": "Mexico","port": "La Paz","code": "MX LAP"
        },
        {"id": 448,"country": "Mexico","port": "Lazaro Cardenas","code": "MX LZC"
        },
        {"id": 449,"country": "Mexico","port": "Manzanillo","code": "MX ZLO"
        },
        {"id": 450,"country": "Mexico","port": "Mazatlan","code": "MX MZT"
        },
        {"id": 451,"country": "Mexico","port": "Progreso","code": "MX PGO"
        },
        {"id": 452,"country": "Mexico","port": "Salina Cruz","code": "MX SCX"
        },
        {"id": 453,"country": "Mexico","port": "Tampico","code": "MX TAM"
        },
        {"id": 454,"country": "Mexico","port": "Topolobampo","code": "MX TPB"
        },
        {"id": 455,"country": "Mexico","port": "Tuxpan","code": "MX TUX"
        },
        {"id": 456,"country": "Mexico","port": "Veracruz","code": "MX VER"
        },
        {"id": 457,"country": "Micronesia","port": "Pohnpei (Ex Ponape)","code": "FM PNI"
        },
        {"id": 458,"country": "Monaco","port": "Monaco","code": "MC MON"
        },
        {"id": 459,"country": "Montenegro","port": "Bar","code": "CS BAR"
        },
        {"id": 460,"country": "Montenegro","port": "Kotor","code": "CS KOT"
        },
        {"id": 461,"country": "Montserrat","port": "Plymouth","code": "MS PLY"
        },
        {"id": 462,"country": "Morocco","port": "Agadir","code": "MA AGA"
        },
        {"id": 463,"country": "Morocco","port": "Casablanca","code": "MA CAS"
        },
        {"id": 464,"country": "Morocco","port": "El Jadida","code": "MA ELJ"
        },
        {"id": 465,"country": "Morocco","port": "Kenitra","code": "MA NNA"
        },
        {"id": 466,"country": "Morocco","port": "Mohammedia","code": "MA MOH"
        },
        {"id": 467,"country": "Morocco","port": "Safi","code": "MA SFI"
        },
        {"id": 468,"country": "Morocco","port": "Tangier","code": "MA TNG"
        },
        {"id": 469,"country": "Mozambique","port": "Beira","code": "MZ BEW"
        },
        {"id": 470,"country": "Mozambique","port": "Inhambane","code": "MZ INH"
        },
        {"id": 471,"country": "Mozambique","port": "Maputo","code": "MZ MPM"
        },
        {"id": 472,"country": "Mozambique","port": "Nacala","code": "MZ MNC"
        },
        {"id": 473,"country": "Mozambique","port": "Pemba","code": "MZ POL"
        },
        {"id": 474,"country": "Mozambique","port": "Quelimane","code": "MZ UEL"
        },
        {"id": 475,"country": "Myanmar","port": "Bassein","code": "MM BSX"
        },
        {"id": 476,"country": "Myanmar","port": "Moulmein","code": "MM MNU"
        },
        {"id": 477,"country": "Myanmar","port": "Yangon","code": "MM RGN"
        },
        {"id": 478,"country": "Namibia","port": "Luderitz","code": "NA LUD"
        },
        {"id": 479,"country": "Namibia","port": "Walvis Bay","code": "NA WVB"
        },
        {"id": 480,"country": "Nauru","port": "Nauru Island","code": "NR INU"
        },
        {"id": 481,"country": "Netherlands","port": "Amsterdam","code": "NL AMS"
        },
        {"id": 482,"country": "Netherlands","port": "Delfzijl","code": "NL DZL"
        },
        {"id": 483,"country": "Netherlands","port": "Dordrecht","code": "NL DOR"
        },
        {"id": 484,"country": "Netherlands","port": "Eemshaven","code": "NL EEM"
        },
        {"id": 485,"country": "Netherlands","port": "Groningen","code": "NL GRQ"
        },
        {"id": 486,"country": "Netherlands","port": "IJmuiden","code": "NL IJM"
        },
        {"id": 487,"country": "Netherlands","port": "Rotterdam","code": "NL RTM"
        },
        {"id": 488,"country": "Netherlands","port": "Terneuzen","code": "NL TNZ"
        },
        {"id": 489,"country": "Netherlands Antilles","port": "Kralendijk, Bonaire","code": "AN KRA"
        },
        {"id": 490,"country": "Netherlands Antilles","port": "Philipsburg","code": "AN PHI"
        },
        {"id": 491,"country": "Netherlands Antilles","port": "Willemstad","code": "AN WIL"
        },
        {"id": 492,"country": "New Caledonia","port": "Noumea","code": "NC NOU"
        },
        {"id": 493,"country": "New Caledonia","port": "Thio","code": "NC THI"
        },
        {"id": 494,"country": "New Zealand","port": "Auckland","code": "NZ AKL"
        },
        {"id": 495,"country": "New Zealand","port": "Otago Harbour (Dunedin, Port Chalmers, Ravensbourne)","code": "NZ ORR"
        },
        {"id": 496,"country": "New Zealand","port": "Tauranga","code": "NZ TRG"
        },
        {"id": 497,"country": "New Zealand","port": "Wellington","code": "NZ WLG"
        },
        {"id": 498,"country": "Nicaragua","port": "Bluefields","code": "NI BEF"
        },
        {"id": 499,"country": "Nicaragua","port": "Corinto","code": "NI CIO"
        },
        {"id": 500,"country": "Nicaragua","port": "El Bluff","code": "NI ELB"
        },
        {"id": 501,"country": "Nicaragua","port": "Puerto Cabezas","code": "NI PUZ"
        },
        {"id": 502,"country": "Nicaragua","port": "Puerto Sandino","code": "NI PSN"
        },
        {"id": 503,"country": "Nicaragua","port": "San Juan Del Sur","code": "NI SJS"
        },
        {"id": 504,"country": "Nigeria","port": "Calabar","code": "NG CBQ"
        },
        {"id": 505,"country": "Nigeria","port": "Lagos","code": "NG LOS"
        },
        {"id": 506,"country": "Nigeria","port": "Onne","code": "NG ONN"
        },
        {"id": 507,"country": "Nigeria","port": "Port Harcourt","code": "NG PHC"
        },
        {"id": 508,"country": "Nigeria","port": "Sapele","code": "NG SPL"
        },
        {"id": 509,"country": "Nigeria","port": "Tin Can Island","code": "NG TIN"
        },
        {"id": 510,"country": "Nigeria","port": "Warri","code": "NG WAR"
        },
        {"id": 511,"country": "Northern Mariana Islands","port": "Saipan","code": "MP SPN"
        },
        {"id": 512,"country": "Norway","port": "Bergen","code": "NO BGO"
        },
        {"id": 513,"country": "Norway","port": "Drammen","code": "NO DRM"
        },
        {"id": 514,"country": "Norway","port": "Grenland Harbour (Rafnes, Heroya,","code": "n/a"
        },
        {"id": 515,"country": "Norway","port": "Hammerfest","code": "NO HFT"
        },
        {"id": 516,"country": "Norway","port": "Harstad","code": "NO HRD"
        },
        {"id": 517,"country": "Norway","port": "Haugesund","code": "NO HAU"
        },
        {"id": 518,"country": "Norway","port": "Kristiansand","code": "NO KRS"
        },
        {"id": 519,"country": "Norway","port": "Larvik","code": "NO LAR"
        },
        {"id": 520,"country": "Norway","port": "Oslo","code": "NO OSL"
        },
        {"id": 521,"country": "Norway","port": "Stavanger","code": "NO SVG"
        },
        {"id": 522,"country": "Norway","port": "Trondheim","code": "NO TRD"
        },
        {"id": 523,"country": "Pakistan","port": "Karachi","code": "PK KHI"
        },
        {"id": 524,"country": "Pakistan","port": "Muhammad Bin Qasim","code": "PK BQM"
        },
        {"id": 525,"country": "Panama","port": "Colon","code": "PA ONX"
        },
        {"id": 526,"country": "Panama","port": "Cristobal","code": "PA CTB"
        },
        {"id": 527,"country": "Panama","port": "Vacamonte","code": "PA VAC"
        },
        {"id": 528,"country": "Papua New  Guinea","port": "Kieta","code": "PG KIE"
        },
        {"id": 529,"country": "Papua New  Guinea","port": "Lae","code": "PG LAE"
        },
        {"id": 530,"country": "Papua New  Guinea","port": "Madang","code": "PG MAG"
        },
        {"id": 531,"country": "Papua New  Guinea","port": "Port Moresby","code": "PG POM"
        },
        {"id": 532,"country": "Papua New  Guinea","port": "Rabaul","code": "PG RAB"
        },
        {"id": 533,"country": "Peru","port": "Callao","code": "PE CLL"
        },
        {"id": 534,"country": "Peru","port": "Chimbote","code": "PE CHM"
        },
        {"id": 535,"country": "Peru","port": "Ilo","code": "PE ILO"
        },
        {"id": 536,"country": "Peru","port": "Matarani","code": "PE MRI"
        },
        {"id": 537,"country": "Peru","port": "Paita","code": "PE PAI"
        },
        {"id": 538,"country": "Peru","port": "Salaverry","code": "PE SVY"
        },
        {"id": 539,"country": "Peru","port": "Talara","code": "PE TYL"
        },
        {"id": 540,"country": "Philippines","port": "Batangas","code": "PH BTG"
        },
        {"id": 541,"country": "Philippines","port": "Cagayan de Oro, Mindanao","code": "PH CGY"
        },
        {"id": 542,"country": "Philippines","port": "Cebu","code": "PH CEB"
        },
        {"id": 543,"country": "Philippines","port": "Davao, Mindanao","code": "PH DVO"
        },
        {"id": 544,"country": "Philippines","port": "Iligan, Mindanao","code": "PH IGN"
        },
        {"id": 545,"country": "Philippines","port": "Iloilo","code": "PH ILO"
        },
        {"id": 546,"country": "Philippines","port": "Jolo","code": "PH JOL"
        },
        {"id": 547,"country": "Philippines","port": "Legaspi, Davao","code": "PH LGP"
        },
        {"id": 548,"country": "Philippines","port": "Manila","code": "PH MNL"
        },
        {"id": 549,"country": "Philippines","port": "Puerto Princesa, Palawan","code": "PH PPS"
        },
        {"id": 550,"country": "Philippines","port": "San Fernando, Luzon","code": "PH SFE"
        },
        {"id": 551,"country": "Philippines","port": "Subic Bay","code": "PH SFS"
        },
        {"id": 552,"country": "Philippines","port": "Zamboanga, Mindanao","code": "PH ZAM"
        },
        {"id": 553,"country": "Poland","port": "Gdansk","code": "PL GDN"
        },
        {"id": 554,"country": "Poland","port": "Gdynia","code": "PL GDY"
        },
        {"id": 555,"country": "Poland","port": "Kolobrzeg","code": "PL KOL"
        },
        {"id": 556,"country": "Poland","port": "Swinoujscie","code": "PL SWI"
        },
        {"id": 557,"country": "Poland","port": "Szczecin","code": "PL SZZ"
        },
        {"id": 558,"country": "Poland","port": "Ustka","code": "PL UST"
        },
        {"id": 559,"country": "Portugal","port": "Aveiro","code": "PT AVE"
        },
        {"id": 560,"country": "Portugal","port": "Leixoes","code": "PT LEI"
        },
        {"id": 561,"country": "Portugal","port": "Lisbon","code": "PT LIS"
        },
        {"id": 562,"country": "Portugal","port": "Portimao","code": "PT PRM"
        },
        {"id": 563,"country": "Portugal","port": "Setubal","code": "PT SET"
        },
        {"id": 564,"country": "Portugal","port": "Viana Do Castelo","code": "PT VDC"
        },
        {"id": 565,"country": "Puerto Rico","port": "Guanica Harbour","code": "PR GUX"
        },
        {"id": 566,"country": "Puerto Rico","port": "Guayanilla","code": "PR GUY"
        },
        {"id": 567,"country": "Puerto Rico","port": "Las Mareas","code": "PR LAM"
        },
        {"id": 568,"country": "Puerto Rico","port": "Ponce","code": "PR PSE"
        },
        {"id": 569,"country": "Puerto Rico","port": "San Juan","code": "PR SJU"
        },
        {"id": 570,"country": "Qatar","port": "Doha","code": "QA DOH"
        },
        {"id": 571,"country": "Qatar","port": "Halul Island","code": "QA HAL"
        },
        {"id": 572,"country": "Qatar","port": "Ras Laffan","code": "QA RLF"
        },
        {"id": 573,"country": "Qatar","port": "Umm Said (Mesaieed)","code": "QA UMS"
        },
        {"id": 574,"country": "Reunion","port": "Port Reunion (Pointe des Galets)","code": "RE PDG"
        },
        {"id": 575,"country": "Romania","port": "Braila","code": "RO BRA"
        },
        {"id": 576,"country": "Romania","port": "Constantza","code": "RO CND"
        },
        {"id": 577,"country": "Romania","port": "Mangalia","code": "RO MAG"
        },
        {"id": 578,"country": "Romania","port": "Sulina","code": "RO SUL"
        },
        {"id": 579,"country": "Russia","port": "Kaliningrad","code": "SU KGD"
        },
        {"id": 580,"country": "Russia","port": "Kholmsk","code": "RU KHO"
        },
        {"id": 581,"country": "Russia","port": "Murmansk","code": "RU MMK"
        },
        {"id": 582,"country": "Russia","port": "Nakhodka","code": "RU NJK"
        },
        {"id": 583,"country": "Russia","port": "Novorossiysk","code": "RU NVS"
        },
        {"id": 584,"country": "Russia","port": "St Petersburg","code": "RU LED"
        },
        {"id": 585,"country": "Russia","port": "Tuapse","code": "RU TUA"
        },
        {"id": 586,"country": "Russia","port": "Vladivostok","code": "RU VVO"
        },
        {"id": 587,"country": "Russia","port": "Vyborg","code": "RU VYG"
        },
        {"id": 588,"country": "Saint Kitts and Nevis","port": "Basseterre","code": "KN BAS"
        },
        {"id": 589,"country": "Saint Lucia","port": "Castries (St Lucia)","code": "LC SLU"
        },
        {"id": 590,"country": "Saint Lucia","port": "Vieux Fort","code": "LC VIF"
        },
        {"id": 591,"country": "Saint Vincent and the Grenadines","port": "Kingstown","code": "VC KTN"
        },
        {"id": 592,"country": "Samoa","port": "Apia","code": "WS APW"
        },
        {"id": 593,"country": "Sao Tome and Principe","port": "Santo Antonio","code": "ST SAA"
        },
        {"id": 594,"country": "Sao Tome and Principe","port": "Sao Tome","code": "ST TMS"
        },
        {"id": 595,"country": "Saudi Arabia","port": "Dammam","code": "SA DMN"
        },
        {"id": 596,"country": "Saudi Arabia","port": "Dhuba","code": "SA DHU"
        },
        {"id": 597,"country": "Saudi Arabia","port": "Gizan","code": "SA GIZ"
        },
        {"id": 598,"country": "Saudi Arabia","port": "Jeddah","code": "SA JED"
        },
        {"id": 599,"country": "Saudi Arabia","port": "Jubail","code": "SA JUB"
        },
        {"id": 600,"country": "Saudi Arabia","port": "Rabigh","code": "SA RAB"
        },
        {"id": 601,"country": "Saudi Arabia","port": "Ras al Mishab","code": "SA RAM"
        },
        {"id": 602,"country": "Saudi Arabia","port": "Ras Tanura","code": "SA RTA"
        },
        {"id": 603,"country": "Saudi Arabia","port": "Yanbu","code": "SA YNB"
        },
        {"id": 604,"country": "Senegal","port": "Dakar","code": "SN DKR"
        },
        {"id": 605,"country": "Seychelles","port": "Port Victoria","code": "SC POV"
        },
        {"id": 606,"country": "Sierra Leone","port": "Freetown","code": "SL FNA"
        },
        {"id": 607,"country": "Sierra Leone","port": "Pepel","code": "SL PEP"
        },
        {"id": 608,"country": "Singapore","port": "Singapore","code": "SG SIN"
        },
        {"id": 609,"country": "Slovenia","port": "Izola","code": "SI IZO"
        },
        {"id": 610,"country": "Slovenia","port": "Koper","code": "SI KOP"
        },
        {"id": 611,"country": "Slovenia","port": "Piran","code": "SI PIR"
        },
        {"id": 612,"country": "Solomon Islands","port": "Honiara","code": "SB HIR"
        },
        {"id": 613,"country": "Solomon Islands","port": "Noro, New Georgia","code": "SB NOR"
        },
        {"id": 614,"country": "Solomon Islands","port": "Viru Harbour","code": "SB VIU"
        },
        {"id": 615,"country": "Solomon Islands","port": "Yandina, Pavuvu Island","code": "SB XYA"
        },
        {"id": 616,"country": "Somalia","port": "Berbera","code": "SO BBO"
        },
        {"id": 617,"country": "Somalia","port": "Kismayu","code": "SO KMU"
        },
        {"id": 618,"country": "Somalia","port": "Merca","code": "SO MER"
        },
        {"id": 619,"country": "Somalia","port": "Mogadishu","code": "SO MGQ"
        },
        {"id": 620,"country": "South Africa","port": "Cape Town","code": "ZA CPT"
        },
        {"id": 621,"country": "South Africa","port": "Durban","code": "ZA DUR"
        },
        {"id": 622,"country": "South Africa","port": "Mossel Bay","code": "ZA MZY"
        },
        {"id": 623,"country": "South Africa","port": "Port Elizabeth","code": "ZA PLZ"
        },
        {"id": 624,"country": "South Africa","port": "Richards Bay","code": "ZA RCB"
        },
        {"id": 625,"country": "South Africa","port": "Saldanha Bay","code": "ZA SDB"
        },
        {"id": 626,"country": "Spain","port": "Aviles","code": "ES AVS"
        },
        {"id": 627,"country": "Spain","port": "Barcelona","code": "ES BCN"
        },
        {"id": 628,"country": "Spain","port": "Bilbao","code": "ES BIO"
        },
        {"id": 629,"country": "Spain","port": "Cadiz","code": "ES CAD"
        },
        {"id": 630,"country": "Spain","port": "Cartagena","code": "ES CAR"
        },
        {"id": 631,"country": "Spain","port": "Castellon","code": "ES CAS"
        },
        {"id": 632,"country": "Spain","port": "Ceuta","code": "ES CEU"
        },
        {"id": 633,"country": "Spain","port": "Huelva","code": "ES HUV"
        },
        {"id": 634,"country": "Spain","port": "Malaga","code": "ES AGP"
        },
        {"id": 635,"country": "Spain","port": "Pasajes","code": "ES PAS"
        },
        {"id": 636,"country": "Spain","port": "Santander","code": "ES SDR"
        },
        {"id": 637,"country": "Spain","port": "Tarragona","code": "ES TAR"
        },
        {"id": 638,"country": "Spain","port": "Valencia","code": "ES VLC"
        },
        {"id": 639,"country": "Spain","port": "Vigo","code": "ES VGO"
        },
        {"id": 640,"country": "Sri Lanka","port": "Colombo","code": "LK CMB"
        },
        {"id": 641,"country": "Sri Lanka","port": "Jaffna","code": "LK JAF"
        },
        {"id": 642,"country": "Sri Lanka","port": "Trincomalee","code": "LK TRR"
        },
        {"id": 643,"country": "St. Helena","port": "Jamestown","code": "SH SHN"
        },
        {"id": 644,"country": "St. Pierre and Miquelon","port": "St Pierre","code": "PM FSP"
        },
        {"id": 645,"country": "Sudan","port": "Port Sudan","code": "SD PZU"
        },
        {"id": 646,"country": "Suriname","port": "Moengo","code": "SR MOJ"
        },
        {"id": 647,"country": "Suriname","port": "Nieuw Nickerie","code": "SR ICK"
        },
        {"id": 648,"country": "Suriname","port": "Paramaribo","code": "SR PBM"
        },
        {"id": 649,"country": "Suriname","port": "Paranam","code": "SR PRM"
        },
        {"id": 650,"country": "Suriname","port": "Wageningen","code": "SR AGI"
        },
        {"id": 651,"country": "Sweden","port": "Gavle","code": "SE GVX"
        },
        {"id": 652,"country": "Sweden","port": "Gothenburg (Goteborg)","code": "SE GOT"
        },
        {"id": 653,"country": "Sweden","port": "Halmstad","code": "SE HAD"
        },
        {"id": 654,"country": "Sweden","port": "Kalmar","code": "SE KLR"
        },
        {"id": 655,"country": "Sweden","port": "Karlshamn","code": "SE KAN"
        },
        {"id": 656,"country": "Sweden","port": "Malmo","code": "SE MMA"
        },
        {"id": 657,"country": "Sweden","port": "Solvesborg","code": "SE SOL"
        },
        {"id": 658,"country": "Sweden","port": "Stockholm","code": "SE STO"
        },
        {"id": 659,"country": "Sweden","port": "Sundsvall","code": "SE SDL"
        },
        {"id": 660,"country": "Switzerland","port": "Basel","code": "CH BSL"
        },
        {"id": 661,"country": "Syria","port": "Baniyas","code": "SY BAN"
        },
        {"id": 662,"country": "Taiwan","port": "Hualien","code": "TW HUN"
        },
        {"id": 663,"country": "Taiwan","port": "Kaohsiung","code": "TW KHH"
        },
        {"id": 664,"country": "Taiwan","port": "Kaohsiung","code": "TW KHH"
        },
        {"id": 665,"country": "Taiwan","port": "Keelung (Chilung)","code": "TW KEL"
        },
        {"id": 666,"country": "Taiwan","port": "Suao","code": "TW SUO"
        },
        {"id": 667,"country": "Taiwan","port": "Taichung","code": "TW TXG"
        },
        {"id": 668,"country": "Tanzania","port": "Dar Es Salaam","code": "TZ DAR"
        },
        {"id": 669,"country": "Tanzania","port": "Kilwa Masoko","code": "TZ KIM"
        },
        {"id": 670,"country": "Tanzania","port": "Lindi","code": "TZ LDI"
        },
        {"id": 671,"country": "Tanzania","port": "Mtwara","code": "TZ MYW"
        },
        {"id": 672,"country": "Tanzania","port": "Pangani","code": "TZ PAN"
        },
        {"id": 673,"country": "Tanzania","port": "Tanga","code": "TZ TGT"
        },
        {"id": 674,"country": "Thailand","port": "Bangkok","code": "TH BKK"
        },
        {"id": 675,"country": "Thailand","port": "Laem Chabang","code": "TH LCH"
        },
        {"id": 676,"country": "Thailand","port": "Pattani","code": "TH PAN"
        },
        {"id": 677,"country": "Thailand","port": "Phuket","code": "TH HKT"
        },
        {"id": 678,"country": "Thailand","port": "Sattahip","code": "TH SAT"
        },
        {"id": 679,"country": "Thailand","port": "Songkhla","code": "TH SGZ"
        },
        {"id": 680,"country": "Thailand","port": "Sriracha","code": "TH SRI"
        },
        {"id": 681,"country": "Togo","port": "Kpeme","code": "TG KPE"
        },
        {"id": 682,"country": "Togo","port": "Lome","code": "TG LFW"
        },
        {"id": 683,"country": "Tonga","port": "Neiafu","code": "TO NEI"
        },
        {"id": 684,"country": "Tonga","port": "Nukualofa","code": "TO TBU"
        },
        {"id": 685,"country": "Tonga","port": "Pangai","code": "TO PAN"
        },
        {"id": 686,"country": "Trinidad and Tobago","port": "Point Fortin","code": "TT PTF"
        },
        {"id": 687,"country": "Trinidad and Tobago","port": "Point Lisas","code": "TT PTS"
        },
        {"id": 688,"country": "Trinidad and Tobago","port": "Pointe a Pierre","code": "TT PTP"
        },
        {"id": 689,"country": "Trinidad and Tobago","port": "Scarborough","code": "TT SCA"
        },
        {"id": 690,"country": "Trinidad and Tobago","port": "Spain","code": "TT POS"
        },
        {"id": 691,"country": "Trinidad and Tobago","port": "Tembladora","code": "TT TEM"
        },
        {"id": 692,"country": "Tunisia","port": "Bizerte","code": "TN BIZ"
        },
        {"id": 693,"country": "Tunisia","port": "Gabes","code": "TN GAE"
        },
        {"id": 694,"country": "Tunisia","port": "La Goulette","code": "TN LGN"
        },
        {"id": 695,"country": "Tunisia","port": "Sfax","code": "TN SFA"
        },
        {"id": 696,"country": "Tunisia","port": "Sousse","code": "TN SUS"
        },
        {"id": 697,"country": "Tunisia","port": "Tunis","code": "TN TUN"
        },
        {"id": 698,"country": "Turkey","port": "Derince","code": "TR DRC"
        },
        {"id": 699,"country": "Turkey","port": "Dikili","code": "TR DIK"
        },
        {"id": 700,"country": "Turkey","port": "Gemlik","code": "TR GEM"
        },
        {"id": 701,"country": "Turkey","port": "Hopa, Artvin","code": "TR HOP"
        },
        {"id": 702,"country": "Turkey","port": "Iskenderun, Hatay","code": "TR ISK"
        },
        {"id": 703,"country": "Turkey","port": "Istanbul","code": "TR IST"
        },
        {"id": 704,"country": "Turkey","port": "Trabzon","code": "TR TZX"
        },
        {"id": 705,"country": "Turks and Caicos Islands","port": "Grand Turk Island","code": "TC GDT"
        },
        {"id": 706,"country": "Turks and Caicos Islands","port": "Providenciales","code": "TC PLS"
        },
        {"id": 707,"country": "Tuvalu","port": "Funafuti","code": "TV FUN"
        },
        {"id": 708,"country": "United Kingdom (UK)","port": "Aberdeen","code": "GB ABD"
        },
        {"id": 709,"country": "United Kingdom (UK)","port": "Belfast","code": "GB BEL"
        },
        {"id": 710,"country": "United Kingdom (UK)","port": "Bristol","code": "GB BRS"
        },
        {"id": 711,"country": "United Kingdom (UK)","port": "Dover","code": "GB DVR"
        },
        {"id": 712,"country": "United Kingdom (UK)","port": "Falmouth","code": "GB FAL"
        },
        {"id": 713,"country": "United Kingdom (UK)","port": "Felixstowe","code": "GB FXT"
        },
        {"id": 714,"country": "United Kingdom (UK)","port": "Glasgow","code": "GB GLW"
        },
        {"id": 715,"country": "United Kingdom (UK)","port": "Grangemouth","code": "GB GRG"
        },
        {"id": 716,"country": "United Kingdom (UK)","port": "Hull","code": "GB HUL"
        },
        {"id": 717,"country": "United Kingdom (UK)","port": "Leith","code": "GB LEI"
        },
        {"id": 718,"country": "United Kingdom (UK)","port": "Liverpool","code": "GB LIV"
        },
        {"id": 719,"country": "United Kingdom (UK)","port": "London","code": "GB LON"
        },
        {"id": 720,"country": "United Kingdom (UK)","port": "Manchester","code": "GB MNC"
        },
        {"id": 721,"country": "United Kingdom (UK)","port": "Peterhead Bay","code": "GB PHD"
        },
        {"id": 722,"country": "United Kingdom (UK)","port": "Plymouth","code": "GB PLY"
        },
        {"id": 723,"country": "United Kingdom (UK)","port": "Portsmouth","code": "GB PME"
        },
        {"id": 724,"country": "United Kingdom (UK)","port": "Scapa Flow","code": "GB SFW"
        },
        {"id": 725,"country": "United Kingdom (UK)","port": "Southampton","code": "GB SOU"
        },
        {"id": 726,"country": "United Kingdom (UK)","port": "Sullom Voe","code": "GB SUL"
        },
        {"id": 727,"country": "United Kingdom (UK)","port": "Teesport","code": "GB TEE"
        },
        {"id": 728,"country": "United Kingdom (UK)","port": "Thamesport","code": "GB RCS"
        },
        {"id": 729,"country": "United Kingdom (UK)","port": "Tyne","code": "GB TYN"
        },
        {"id": 730,"country": "Ukraine","port": "Berdyansk","code": "UA ERD"
        },
        {"id": 731,"country": "Ukraine","port": "Kherson","code": "UA KHE"
        },
        {"id": 732,"country": "Ukraine","port": "Odessa","code": "UA ODS"
        },
        {"id": 733,"country": "Ukraine","port": "Reni","code": "UA RNI"
        },
        {"id": 734,"country": "Ukraine","port": "Sevastopol","code": "UA SVP"
        },
        {"id": 735,"country": "United Arab Emirates (UAE)","port": "Ajman","code": "AE AJM"
        },
        {"id": 736,"country": "United Arab Emirates (UAE)","port": "Das Island","code": "AE DAS"
        },
        {"id": 737,"country": "United Arab Emirates (UAE)","port": "Dubai (Port Rashid)","code": "AE DXB"
        },
        {"id": 738,"country": "United Arab Emirates (UAE)","port": "Fujairah","code": "AE FJR"
        },
        {"id": 739,"country": "United Arab Emirates (UAE)","port": "Jebel Dhanna/Ruwais","code": "AE JEA"
        },
        {"id": 740,"country": "United Arab Emirates (UAE)","port": "Khor Fakkan","code": "AE KLF"
        },
        {"id": 741,"country": "United Arab Emirates (UAE)","port": "Mina Saqr","code": "AE MSA"
        },
        {"id": 742,"country": "United Arab Emirates (UAE)","port": "Mina Zayed","code": "AE MZD"
        },
        {"id": 743,"country": "United States Of America (USA)","port": "Anacortes","code": "US AOT"
        },
        {"id": 744,"country": "United States Of America (USA)","port": "Ashtabula","code": "US ASF"
        },
        {"id": 745,"country": "United States Of America (USA)","port": "Baltimore","code": "US BAL"
        },
        {"id": 746,"country": "United States Of America (USA)","port": "Baton Rouge","code": "US BTR"
        },
        {"id": 747,"country": "United States Of America (USA)","port": "Beaumont","code": "US BPT"
        },
        {"id": 748,"country": "United States Of America (USA)","port": "Boston","code": "US BOS"
        },
        {"id": 749,"country": "United States Of America (USA)","port": "Charleston","code": "US CHS"
        },
        {"id": 750,"country": "United States Of America (USA)","port": "Chicago","code": "US CHI"
        },
        {"id": 751,"country": "United States Of America (USA)","port": "Cleveland","code": "US CLE"
        },
        {"id": 752,"country": "United States Of America (USA)","port": "Corpus Christi","code": "US CRP"
        },
        {"id": 753,"country": "United States Of America (USA)","port": "Detroit","code": "US DET"
        },
        {"id": 754,"country": "United States Of America (USA)","port": "Duluth-Superior","code": "US DLH"
        },
        {"id": 755,"country": "United States Of America (USA)","port": "Freeport","code": "US FRP"
        },
        {"id": 756,"country": "United States Of America (USA)","port": "Hampton Roads (Norfolk, Chesapeake,","code": "US HNV"
        },
        {"id": 757,"country": "United States Of America (USA)","port": "Honolulu","code": "US HNL"
        },
        {"id": 758,"country": "United States Of America (USA)","port": "Houston","code": "US HOU"
        },
        {"id": 759,"country": "United States Of America (USA)","port": "Huntington â€“ Tri-State (WV)","code": "US HTS"
        },
        {"id": 760,"country": "United States Of America (USA)","port": "Jacksonville","code": "US JAX"
        },
        {"id": 761,"country": "United States Of America (USA)","port": "Lake Charles","code": "US LCH"
        },
        {"id": 762,"country": "United States Of America (USA)","port": "Long Beach","code": "US LGB"
        },
        {"id": 763,"country": "United States Of America (USA)","port": "Los Angeles","code": "US LAX"
        },
        {"id": 764,"country": "United States Of America (USA)","port": "Manatee","code": "US MEE"
        },
        {"id": 765,"country": "United States Of America (USA)","port": "Memphis","code": "US MEM"
        },
        {"id": 766,"country": "United States Of America (USA)","port": "Miami","code": "US MIA"
        },
        {"id": 767,"country": "United States Of America (USA)","port": "Mobile","code": "US MOB"
        },
        {"id": 768,"country": "United States Of America (USA)","port": "New Orleans","code": "US"
        },
        {"id": 769,"country": "United States Of America (USA)","port": "New York/New Jersey","code": "US NYC"
        },
        {"id": 770,"country": "United States Of America (USA)","port": "Oakland","code": "US OAK"
        },
        {"id": 771,"country": "United States Of America (USA)","port": "Pascagoula","code": "US PGL"
        },
        {"id": 772,"country": "United States Of America (USA)","port": "Philadelphia","code": "US PHL"
        },
        {"id": 773,"country": "United States Of America (USA)","port": "Pittsburgh","code": "US PIT"
        },
        {"id": 774,"country": "United States Of America (USA)","port": "Plaquemines (Louisiana)","code": "US PLQ"
        },
        {"id": 775,"country": "United States Of America (USA)","port": "Port Arthur","code": "US POA"
        },
        {"id": 776,"country": "United States Of America (USA)","port": "Port Everglades","code": "US PEF"
        },
        {"id": 777,"country": "United States Of America (USA)","port": "Portland (Maine)","code": "US PWM"
        },
        {"id": 778,"country": "United States Of America (USA)","port": "Portland (Oregon)","code": "US PDX"
        },
        {"id": 779,"country": "United States Of America (USA)","port": "Richmond (CA)","code": "US RCH"
        },
        {"id": 780,"country": "United States Of America (USA)","port": "Richmond (VA)","code": "US RIC"
        },
        {"id": 781,"country": "United States Of America (USA)","port": "Savannah","code": "US SAV"
        },
        {"id": 782,"country": "United States Of America (USA)","port": "Seattle","code": "US SEA"
        },
        {"id": 783,"country": "United States Of America (USA)","port": "South Louisiana","code": "US LUA"
        },
        {"id": 784,"country": "United States Of America (USA)","port": "Tacoma","code": "US ACI"
        },
        {"id": 785,"country": "United States Of America (USA)","port": "Tampa","code": "US TPA"
        },
        {"id": 786,"country": "United States Of America (USA)","port": "Texas City","code": "US TXT"
        },
        {"id": 787,"country": "United States Of America (USA)","port": "Valdez","code": "US VDZ"
        },
        {"id": 788,"country": "United States Of America (USA)","port": "Wilmington (DE)","code": "US ILM"
        },
        {"id": 789,"country": "United States Of America (USA)","port": "Wilmington (NC)","code": "US ILG"
        },
        {"id": 790,"country": "United States Of America (USA)","port": "Yakutat","code": "US YAK"
        },
        {"id": 791,"country": "Uruguay","port": "Fray Bentos","code": "UY FZB"
        },
        {"id": 792,"country": "Uruguay","port": "Montevideo","code": "UY MVD"
        },
        {"id": 793,"country": "Uruguay","port": "Nueva Palmira","code": "UY NVP"
        },
        {"id": 794,"country": "Uruguay","port": "Paysandu","code": "UY PDU"
        },
        {"id": 795,"country": "Vanuatu","port": "Port Vila","code": "VU VLI"
        },
        {"id": 796,"country": "Vanuatu","port": "Santo","code": "VU SAN"
        },
        {"id": 797,"country": "Venezuela","port": "Bajo Grande Refinery","code": "VE BJV"
        },
        {"id": 798,"country": "Venezuela","port": "Cumana (Puerto Sucre)","code": "VE CUM"
        },
        {"id": 799,"country": "Venezuela","port": "La Guaira","code": "VE LAG"
        },
        {"id": 800,"country": "Venezuela","port": "La Salina","code": "VE LSV"
        },
        {"id": 801,"country": "Venezuela","port": "Maracaibo","code": "VE MAR"
        },
        {"id": 802,"country": "Venezuela","port": "Matanzas","code": "VE MTV"
        },
        {"id": 803,"country": "Venezuela","port": "Palua","code": "VE PLA"
        },
        {"id": 804,"country": "Venezuela","port": "Puerto Cabello","code": "VE PBL"
        },
        {"id": 805,"country": "Venezuela","port": "Puerto La Cruz","code": "VE PCZ"
        },
        {"id": 806,"country": "Venezuela","port": "Punta Cardon","code": "VE PCN"
        },
        {"id": 807,"country": "Vietnam","port": "Danang","code": "VN DAD"
        },
        {"id": 808,"country": "Vietnam","port": "Haiphong","code": "VN HPH"
        },
        {"id": 809,"country": "Vietnam","port": "Ho Chi Minh City","code": "VN SGN"
        },
        {"id": 810,"country": "Vietnam","port": "Hon Gay","code": "VN HON"
        },
        {"id": 811,"country": "Vietnam","port": "Nha Trang","code": "VN NHA"
        },
        {"id": 812,"country": "Virgin Isl. (US)","port": "Charlotte Amalie, St. Thomas","code": "VI STT"
        },
        {"id": 813,"country": "Virgin Islands (US)","port": "Christiansted, St. Croix","code": "VI CTD"
        },
        {"id": 814,"country": "Virgin Islands (US)","port": "Limetree Bay","code": "VI LIB"
        },
        {"id": 815,"country": "Yemen","port": "Aden","code": "YE ADE"
        },
        {"id": 816,"country": "Yemen","port": "Hodeidah","code": "YE HOD"
        },
        {"id": 817,"country": "Yemen","port": "Mokha","code": "YE MOK"
        },
        {"id": 818,"country": "Yemen","port": "Mukalla","code": "YE MKX"
        },
        {"id": 819,"country": "Albania","port": "Durres (Durazzo)","code": "AL DRZ"
        },
        {"id": 820,"country": "OMAN","port": "Others","code": "NA"
        }
      ]
  
    this.portLisit = portlist
   var portdp = this.portLisit.map(x => x.port);
  //  sessionStorage.setItem('portlist', JSON.stringify(portdp));
    // endd
  var goodTypes =[
    'Agri Product',
    'Dairy Product',
    'Metal (Steel, Copper, Zinc etc.)',
    'Machinery',
    'Construction Material (Cement etc.)',
    'Paper',
    'Pipes',
    'Fruit / Vegetable / Dry Fruit',
    'Animal meat / Sea Food / Poultry',
    'Electricals / Electrical Equipments',
    'Electronics (Laptops, TV, Mobile Phones etc.)',
    'Telecom Equipment',
    'Medical Equipment',
    'Pharma',
    'Plastic Product',
    'Chemicals',
    'Cosmetics',
    'Crude Oil',
    'Textile',
    'Furniture/ Timber',
    'Cotton',
    'Fire Equipments',
    'Leather',
    'Automobile',
    'Food / Beverages / Bakery',
    'Rubber',
    'Scrap products',
    'Services',
    'IT Software / Hardware',
    'Baby Products / Toys / Games',
    'Stationery Products',
    'Others'
  ]
  sessionStorage.setItem('goodTypes', JSON.stringify(goodTypes));
  }
  upload(event){
    console.log(event,'event')
    this.fileuploaded = true;
    const selectedFiles = event.target.files;
 
    const file: File | null = selectedFiles.item(0);
    this.currentFile = file;
 
    const formdata = new FormData();

    if(this.currentFile == null){
      this.myfilename2 = 'Select File'
    }else{
    this.myfilename2 = this.currentFile.name;
  
    formdata.append('file', this.currentFile, this.currentFile.name);
    this.formData1 = formdata
    console.log(this.formData1,'this.formData1')
    }
   
  }
  downloadSample(){}


  // fileupload() {
  //   this.bulkservice.UploadbulkTrxn(this.formData1).subscribe((res: any) => {


      
  //     const popup = this.dialog.open(GeneralPopupComponent, {
  //       width: '500px',
  //       height: '350px',
  //       data: {
  //         title: 'isAllGood',
  //         message: res['message'],
  //         status: res['success']
  //       },
  //       disableClose:true
  //     });
  //     if (res['success'] == true) {
   
  //       this.fileuploaded = false;
  //       // this.attachment.nativeElement.value = '';
  //     }else{
  //       console.log(' im false')
  //     }
  //   })
  // } 

  fileupload() {
    this.bulkservice.UploadbulkTrxn(this.formData1).subscribe(
      (res: any) => {
console.log(res,'res')
console.log(res,'res')
// if(res == null)
{
        const popup = this.dialog.open(GeneralPopupComponent, {
          width: '500px',
          height: '350px',
          data: {
            title: 'isAllGood',
            message: 'File Uploaded sucessfully',
            status: 'success',
          },
          disableClose: true,
        });
  
        
}
        // else
         {
          console.log('I am false');
        }
      },
   
      (error) => {
      console.log(error,'error')
        if (error.status === 502) {
          // Handle the 502 error by downloading the Excel form
          console.log('i m here in error')
          this.downloadErrorExcel(error.error, null);
        } else {
          // console.error('Unknown error occurred:', error);
          console.log(' im here')
          const popup = this.dialog.open(GeneralPopupComponent, {
            width: '500px',
            height: '350px',
            data: {
              title: 'isAllGood',
              message: 'File Uploaded sucessfully',
            status: 'success',
            },
            disableClose: true,
          });
    
        }
      }
      
    );
  }
  
  // Function to download the error Excel form
  downloadErrorExcel(errorData: any, e) {
    console.log(errorData,'data')
    const blob = new Blob([errorData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    if(e != null){
    a.download = e+'.xlsx';
    }else {

    }
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
}

