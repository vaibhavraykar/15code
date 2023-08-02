import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import * as _moment from 'moment'

@Component({
  selector: 'app-new-secondary-transaction',
  templateUrl: './new-secondary-transaction.component.html',
  styleUrls: ['./new-secondary-transaction.component.scss'],
})
export class NewSecondaryTransactionComponent implements OnInit {
  matTabVisited = [true, false, false, false, false];
  userInfo: any;
  type = 'new';
  cloneTrans: boolean = false;
  preview: boolean = false;
  panelOpenState = false;
  secondPanelOpenState = false;
  transactionDetails: any;
  partnerBankList: any;
  from = '';
  tabState = {
    requirementType: '',
    secTransactionType: 'FUNDED',
    applicantCountry: '',
    applicantName: '',
    beneCountry: '',
    beneName: '',
    obligorBank: '',
    obligorCountry: '',
    lCValue: '',
    lCCurrency: '',
    goodsType: '',
    otherGoodsType: '',
    validity: '',
    minParticipationAmt: '',
    isESGComplaint: 'false',
    retentionAmt: '',
    loadingCountry: '',
    loadingPort: '',
    dischargeCountry: '',
    dischargePort: '',
    applicableLaw: '',
    commissionScheme: 'Front Ended',
    benchmark: '',
    lCMaturityDate: '',
    lCBookingDate: '',
    otherCondition: '',
    usanceDays: '',
    offeredPrice: '',
    participationBasis: 'DISCLOSED',
    otherLaw: '',
    transactionId: '',

    partnerBankList: [],

    finalDestinationOfGoods: '',
  };
  tabIndex: any = 0;
  previousTabIndex:any=0;
  @ViewChild('matTabGroup', { static: true }) matTabGroup: any;
  @ViewChild('bene', { static: true }) bene: any;
  @ViewChild('selectProduct', { static: true }) selectProduct: any;
  @ViewChild('transDetails', { static: true }) transDetails: any;
  @ViewChild('pricing', { static: true }) pricing: any;
  @ViewChild('selectBank', { static: true }) selectBank: any;

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.router.url.indexOf('edit?id') > 0) {
      this.type = 'edit';
      this.matTabVisited = [true, true, true, true, true];
      const navigation: any = this.router.getCurrentNavigation();
      const routerState = navigation?.extras?.state || { tabIndex: 0 };
      this.tabIndex = routerState.tabIndex;
      this.from = routerState.from;
    } else {
      this.type = 'new';
    }
    this.route.queryParams.subscribe((param: any) => {
      if (param.id) {
        this.fetchTransaction(param.id);
      }
      this.cloneTrans = param['clone'];
    });
  }
  ngOnInit(): void {
    const userInfoStr = localStorage.getItem('userDetails');
    const parsedUserInfo = JSON.parse(userInfoStr || '{}');
    this.userInfo = parsedUserInfo;
    this.transactionService.getPartnerBankList().subscribe({
      next: (res: any) => {
        this.partnerBankList = res?.data;
      },
    });
    // this.tabState.userId = this.userInfo.username;
  }
  selectedProductHandler(data: any, emit: boolean = true) {
    // this.tabState.selectedProductName = name;
    if (Object.keys(data).length) {
      const { product, secTransactionType, participationBasis } = data;

      this.tabState = {
        ...this.tabState,
        // selector: product,
        requirementType: product,
        participationBasis: participationBasis,
        secTransactionType: secTransactionType,
      };
    }
    if (emit) {
      this.tabChangeHandler({ index: 1 });
    }
  }
  tabChangeHandler(e: any) {
    console.log(this.matTabGroup);
    console.log(e.index);
    this.previousTabIndex = this.tabIndex;
    this.tabIndex = e.index;
    this.matTabVisited[e.index] = true;
    document.querySelector('.mat-drawer-content').scrollTop = 0;
    // this.saveOnTabChange(this.previousTabIndex);
  }

  saveOnTabChange(index) {
    if (index == 0) {
      this.selectedProductHandler(
        {
          product: this.selectProduct.selectedProduct,
          secTransactionType: this.selectProduct.secTransactionType,
          participationBasis: this.selectProduct.participationBasis,
        },
        false
      );
    } else if (index == 1) {
      this.applicantBenificaryHandler(this.bene?.form?.value, false);
    } else if (index == 2) {
      this.transactionDetailsHandler(this.transDetails?.form?.value, false);
    } else if (index == 3) {
      this.pricingHandler(this.pricing?.form?.value, false);
    } else if (index == 4) {
      this.BankHandler(this.selectBank?.form?.value, false);
    }
    console.log(this.tabState)
    document.querySelector('mat-sidenav-content').scrollTop=0
  }
  applicantBenificaryHandler(data: any, emit: boolean = true) {
    console.log(data);
    if (Object.keys(data).length > 0) {
      const {
        applicantCountryName,
        applicantName,
        beneficiaryCountryName,
        beneficiaryName,
        beneficiaryBankName,
        beneficiaryBankCountry,
        applicableLaw,
        otherApplicableLaw,
        comments,
      } = data;
      this.tabState = {
        ...this.tabState,
        applicantCountry: applicantCountryName?.toUpperCase(),
        applicantName: applicantName,
        beneCountry: beneficiaryCountryName?.toUpperCase(),
        beneName: beneficiaryName,
        obligorBank: beneficiaryBankName,
        obligorCountry: beneficiaryBankCountry?.toUpperCase(),
        applicableLaw: applicableLaw,
        otherLaw: otherApplicableLaw?.toUpperCase(),
      };
      if (emit) {
        this.tabChangeHandler({ index: 2 });
      }
    }
  }
  transactionDetailsHandler(data: any,emit:boolean=true) {
    if (Object.keys(data).length > 0) {
      const {
        transactionMaturityDate,
        transactionValidity,
        tenor,
        targetBookingDate,
        typeOfGood,
        currency,
        amount,
        esgCompliant,
        loadingCountry,
        loadingCountryport,
        dischargeCountry,
        dischargeCountryport,
        destinationGoods,
        otherGoodsType,
      } = data;

      this.tabState = {
        ...this.tabState,
        lCValue: amount,
        usanceDays: tenor,
        isESGComplaint: `${esgCompliant}`,
        lCBookingDate: this.formatDate(targetBookingDate || ''),
        loadingCountry: loadingCountry?.toUpperCase(),
        loadingPort: loadingCountryport,
        dischargeCountry: dischargeCountry.toUpperCase(),
        dischargePort: dischargeCountryport,
        lCCurrency: currency,
        finalDestinationOfGoods: destinationGoods.toUpperCase(),
        lCMaturityDate: this.formatDate(transactionMaturityDate || ''),
        validity: this.formatDate(transactionValidity || ''),
        goodsType: typeOfGood,
        otherGoodsType: otherGoodsType,
      };
      if(emit){
        this.tabChangeHandler({ index: 3 });
      }
    }
  }
  formatDate(date: any) {
    const d = new Date(date);
    console.table({
      date: date,
      d: d,
      moment: _moment(d).format('YYYY-MM-DD'),
    });
    // This will return an ISO string matching your local time.
    return  _moment(d).format('YYYY-MM-DD')
    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() - d.getTimezoneOffset()
    )
      ?.toISOString()
      .split('T')[0];
  }

  getVisited() {}
  pricingHandler(data: any,emit:boolean = true) {
    if (Object.keys(data).length > 0) {
      const {
        commissionScheme,
        minParticipationAmt,
        retentionAmt,
        offeredPrice,
        otherCondition,
        benchmark,
      } = data;
      this.tabState = {
        ...this.tabState,
        commissionScheme: commissionScheme,
        minParticipationAmt: minParticipationAmt,
        retentionAmt: retentionAmt,
        offeredPrice: offeredPrice,
        otherCondition: otherCondition,
        benchmark: benchmark,
      };
      if(emit){
        this.tabChangeHandler({ index: 4 });
      }
    }
  }
  BankHandler(data: any,emit:boolean = true) {
    if (Object.keys(data).length > 0) {
      const { selectBankName } = data;
      this.tabState = {
        ...this.tabState,
        partnerBankList: selectBankName,
      };
      if(emit){
        this.DraftSecondryTransaction();
      }
    }
  }
  joinPartnerBank(arr: any = []) {
    let newArr = [];
    for (let item of arr) {
      let bank = this.partnerBankList?.find((ele: any) => ele.id == item);
      if (bank) {
        newArr.push(bank.firstName);
      }
    }
    return newArr?.join(',') || '';
  }
  editTransaction(tabId: number) {
    // this.matTabVisited = [true, true, true, true, true];
    this.preview = false;
    this.tabIndex = tabId;
  }
  getValue(val) {
    let text = Number(val);
    if (isNaN(text)) {
      return val;
    } else {
      return text?.toLocaleString('en') || '';
    }
  }
  cancelTransaction() {
    const { transactionId } = this.tabState;
    this.transactionService
      .cancelSecondryTransaction({
        transactionId: transactionId,
        quotationId: '',
      })
      .subscribe({
        next: (res) => {
          this.preview = false;
          this.router.navigateByUrl(
            '/bank-underwriter/new-secondary-transaction'
          );
        },
      });
  }
  DraftSecondryTransaction() {
    if (this.type === 'edit' && !this.cloneTrans) {
      // this.transactionService
      //   .editSecondryTransaction({
      //     ...this.tabState,
      //   })
      //   .subscribe({
      //     next: (res: any) => {
      //       const { success } = res;
      //       if (success) {
      //         this.router.navigateByUrl(
      //           '/bank-underwriter/new-secondary-transaction-preview',
      //           {
      //             state: {
      //               transactionId: this.tabState.transactionId,
      //               data: this.tabState,
      //               type: this.type,
      //               from: this.from,
      //             },
      //           }
      //         );
      //       }
      //     },
      //   });
      this.preview = true;
    } else {
      this.transactionService
        .secondryTransactionDraft(this.tabState)
        .subscribe({
          next: (response: any) => {
            console.log(response);
            const { data, statusCode, success } = response;
            if (success && statusCode === 200) {
              this.router.navigateByUrl(
                '/bank-underwriter/new-secondary-transaction-preview',
                {
                  state: {
                    transactionId: data[0].transactionId,
                    data: data[0],
                    type: this.cloneTrans?'clone':this.type,
                  },
                }
              );
            }
          },
        });
    }
  }

  fetchTransaction(id: any) {
    this.transactionService.getSecondryTransactionByID(id).subscribe({
      next: (res: any) => {
        const { data } = res;
        console.log(data[0]);
        this.tabState = {
          ...this.tabState,
          // selector: data[0]?.requirementType || '',
          // userId: '',
          secTransactionType: data[0]?.secTransactionType || '',
          applicantCountry: data[0]?.applicantCountry || '',
          applicantName: data[0]?.applicantName || '',
          beneCountry: data[0]?.beneCountry || '',
          beneName: data[0]?.beneName || '',
          obligorBank: data[0]?.obligorBank || '',
          obligorCountry: data[0]?.obligorCountry || '',
          lCValue: data[0]?.lCValue || '',
          lCCurrency: data[0]?.lCCurrency || '',
          goodsType: data[0]?.goodsType || '',
          otherGoodsType: data[0]?.otherGoodsType || '',
          // otherType: '',
          validity: data[0]?.validity || '',
          minParticipationAmt: data[0]?.minParticipationAmt || '',
          isESGComplaint: `${data[0]?.isESGComplaint}`,
          retentionAmt: data[0]?.retentionAmt || '',
          loadingCountry: data[0]?.loadingCountry || '',
          loadingPort: data[0]?.loadingPort || '',
          dischargeCountry: data[0]?.dischargeCountry || '',
          dischargePort: data[0]?.dischargePort || '',
          applicableLaw: data[0]?.applicableLaw || '',
          otherLaw: data[0]?.otherLaw || '',
          requirementType: data[0]?.requirementType || '',
          commissionScheme: data[0]?.commissionScheme || '',
          lCMaturityDate: data[0]?.lCMaturityDate || '',
          lCBookingDate: data[0]?.lCBookingDate,
          benchmark: data[0]?.benchmark || '0',
          otherCondition: data[0]?.otherCondition || '',
          usanceDays: data[0]?.usanceDays || '',
          transactionId: data[0]?.transactionId || '',
          offeredPrice: data[0]?.offeredPrice || '',
          participationBasis: data[0]?.participationBasis || '',
          finalDestinationOfGoods: data[0]?.finalDestinationOfGoods || '',
          partnerBankList: data[0]?.partnerBankList || [],
        };
      },
    });
  }

  submit() {
    console.clear();
    console.log(this.type);
    if (this.type === 'edit') {
      if (this.from === 'draft') {
        console.log('from === draft');
        this.transactionService
          .saveSecondryTransaction({
            transactionId: this.tabState.transactionId,
          })
          .subscribe({
            next: (res: any) => {
              const { success } = res;
              if (success) {
                this.router.navigateByUrl(
                  '/bank-underwriter/secondary-success'
                );
              }
            },
          });
      } else {
        console.log('from !== draft');
        this.transactionService
        .editSecondryTransaction({
          ...this.tabState,
        })
        .subscribe({
          next: (res: any) => {
            const { success } = res;
            if (success) {
        this.router.navigateByUrl('/bank-underwriter/secondary-success', {
          state: { from: 'selling_edit' },
        });
            }
          },
        });
      }
    } else if (this.cloneTrans) {
      this.transactionService
        .saveSecondryTransaction({
          transactionId: this.tabState.transactionId,
        })
        .subscribe({
          next: (res: any) => {
            const { success } = res;
            if (success) {
              this.router.navigateByUrl('/bank-underwriter/secondary-success', {
                state: { from: 'selling_clone' },
              });
            }
          },
        });
    } else {
      console.log('from !== edit');
      this.transactionService
        .saveSecondryTransaction({
          transactionId: this.tabState.transactionId,
        })
        .subscribe({
          next: (res: any) => {
            const { success } = res;
            if (success) {
              this.router.navigateByUrl('/bank-underwriter/secondary-success', {
                state: { from: 'selling_new' },
              });
            }
          },
        });
    }
  }
}
