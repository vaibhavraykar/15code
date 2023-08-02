import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { TransactionService } from 'src/app/modules/customer/transaction/services/transaction.service';
import { BankUnderwriterService } from '../../services/bank-underwriter.service';
import { ConfirmationPopupComponent } from '../../popup/confirmation-popup/confirmation-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { BuyingQuotationUpdatePopupComponent } from '../../popup/buying-quotation-update-popup/buying-quotation-update-popup.component';
@Component({
  selector: 'app-buying-quotes',
  templateUrl: './buying-quotes.component.html',
  styleUrls: ['./buying-quotes.component.scss'],
})
export class BuyingQuotesComponent implements OnInit {
  fieldNotRequired = ['UNFUNDED'];
  viewType = 'default';
  from = '';
  editFromNew = false;
  previewData: any = {};
  minDate: Date;
  routerState = false
  constructor(
    private bankService: BankUnderwriterService,
    private router: Router,
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private location: Location
  ) {
    let navigation = this.router.getCurrentNavigation();
    let routerState: any = navigation?.extras?.state || { from: '' };
    if (routerState?.from === 'newRequest') {
      this.from = 'new';
      routerState = true
    } else if (routerState?.from === 'active') {
      this.viewType = 'activeBuyingQuote';
      this.from = 'active';
      routerState = true
    } else if (routerState?.from === 'save') {
      this.from = 'save';
      routerState = true
    } else {
      routerState = false
      this.location.back();
    }
    this.minDate = new Date();
  }
  transactionId = '';
  transactionDetails: any = {};
  form!: FormGroup;
  acceptOfferedPrices: boolean = false;
  newQuote: boolean = false;
  defaultQuotes: boolean = true;
  defaultbutton: boolean = true;
  preview: boolean = false;
  acceptOffer = true;
  ngOnInit(): void {
    this.createForm();
    this.route.params.subscribe({
      next: (val: any) => {
        const { id } = val;

        this.fetchData(id);
      },
    });
  }
  fetchData(id: string) {
    if (this.from == 'new') {
      this.transactionService.getSecondryTransactionByID(id).subscribe({
        next: (response: any) => {
          const { data } = response;
          this.transactionDetails = data[0];
        },
      });
    } else if (this.from == 'active' || this.from == 'save') {
      this.bankService.getSecondryQuotationById(id).subscribe({
        next: (response: any) => {
          const { data } = response;
          this.transactionDetails = data[0];
          console.clear();
          console.log(this.transactionDetails);
          if (this.from === 'active') {
            this.setFormForActiveQuotes();
          }
        },
      });
    }

  }
  goBack(type?: any) {
    if (type === 'preview_accepted') {
      this.viewType = 'accept_offerForm';
    }

    if ('acceptOffer' === type) {
      this.viewType = 'default';
    }
    if ('preview_accepted_placequote' === type) {
      this.viewType = 'place_newQuote';
    }

    if ('place_newQuote' === type) {
      this.viewType = 'default';
    }

    if (type === 'goTable') {
      this.location.back();
    }
    if ('activeBuyingQuote' == type) {
      this.location.back();
    }
  }

  createForm() {
    this.form = new FormGroup({
      participationAmount: new FormControl('', [Validators.required,this.amountValidator]),
      applicableBenchmark: new FormControl('', [Validators.required]),
      commentsBenchmark: new FormControl('', []),
      marginBenchmark: new FormControl('', [Validators.required]),
      otherCharges: new FormControl('', []),
      minimumTransactionCharge: new FormControl('', []),
      bankQuoteValidity: new FormControl('', [Validators.required]),
      othertnc: new FormControl(''),
      typeOfCharge: new FormControl('', []),
      participationCommissionAmount: new FormControl('', [Validators.required]),
    });
  }

  editActive() {
    this.viewType = 'default_active';
  }
  latestacceptedtransactions() { }
  save(type?: any) {
    console.log(this.from, type)
    if (this.from === 'new') {
      if (type === 'preview_accepted') {
        if (!this.form.valid) {
          return;
        }
        this.previewData = {
          transactionId: this.transactionDetails?.transactionId,
          secTransactionType: this.transactionDetails?.secTransactionType,
          requirementType: this.transactionDetails?.requirementType,
          applicableBenchmark: this.transactionDetails?.benchmark,
          commentsBenchmark: '',
          riskBenchmark: 0,
          minTransactionCharges: 0,
          otherCharges: '',
          otherChargesType: '',
          participationAmount:
            Number(this.transactionDetails?.lCValue || 0) -
            Number(this.transactionDetails?.retentionAmt || 0),
          termConditionComments: this.form.value.othertnc,
          participationCommission:
            this.form.controls['participationCommissionAmount'].value,
          participationCommissionAmount: '',
          isOfferdPriceAccepted: true,
          validity: _moment(this.form.value.bankQuoteValidity).format(
            'YYYY-MM-DD'
          ),
        };
        this.draftQuotation(this.previewData, type, this.from);
      }

      if (type === 'preview_accepted_placeQuote') {
        if (!this.form.valid) {
          return;
        }
        this.previewData = {
          transactionId: this.transactionDetails?.transactionId,
          secTransactionType: this.transactionDetails?.secTransactionType,
          requirementType: this.transactionDetails?.requirementType,
          applicableBenchmark: this.transactionDetails?.benchmark,
          commentsBenchmark: this.form.controls['commentsBenchmark'].value,
          riskBenchmark: this.form.controls['marginBenchmark'].value,
          minTransactionCharges:
            this.parseAmount({target:{value:this.form.controls['minimumTransactionCharge'].value}}),
          otherCharges: this.parseAmount({target:{value:this.form.controls['otherCharges'].value}}),
          otherChargesType: this.form.controls['typeOfCharge'].value,
          participationAmount: this.parseAmount({target:{value:this.form.controls['participationAmount'].value}}),
          termConditionComments: this.form.value.othertnc,
          participationCommission: this.form.value.participationCommissionAmount,
          participationCommissionAmount: '',
          isOfferdPriceAccepted: false,
          validity: _moment(this.form.value.bankQuoteValidity).format(
            'YYYY-MM-DD'
          ),
        };
        this.draftQuotation(this.previewData, type, this.from);
      }
    }
    if (this.from === 'save') {
      if (type === 'preview_accepted') {
        if (!this.form.valid) {
          return;
        }
        this.previewData = {
          transactionId: this.transactionDetails?.transactionId,
          secTransactionType: this.transactionDetails?.secTransactionType,
          requirementType: this.transactionDetails?.requirementType,
          applicableBenchmark: this.transactionDetails?.benchmark,
          commentsBenchmark: '',
          riskBenchmark: 0,
          minTransactionCharges: 0,
          otherCharges: '',
          otherChargesType: '',
          participationAmount:
            Number(this.transactionDetails?.lCValue || 0) -
            Number(this.transactionDetails?.retentionAmt || 0),
          termConditionComments: this.form.value.othertnc,
          participationCommission:
            this.form.controls['participationCommissionAmount'].value,
          participationCommissionAmount: '',
          isOfferdPriceAccepted: true,
          validity: _moment(this.form.value.bankQuoteValidity).format(
            'YYYY-MM-DD'
          ),
        };
        this.draftQuotation(this.previewData, type, this.from);
      }
      if (type === 'preview_accepted_placeQuote') {
        if (!this.form.valid) {
          return;
        }
        this.previewData = {
          transactionId: this.transactionDetails?.transactionId,
          secTransactionType: this.transactionDetails?.secTransactionType,
          requirementType: this.transactionDetails?.requirementType,
          applicableBenchmark: this.transactionDetails?.benchmark,
          commentsBenchmark: this.form.controls['commentsBenchmark'].value,
          riskBenchmark: this.form.controls['marginBenchmark'].value,
          minTransactionCharges:
            this.form.controls['minimumTransactionCharge'].value,
          otherCharges: this.form.controls['otherCharges'].value,
          otherChargesType: this.form.controls['typeOfCharge'].value,
          participationAmount: this.form.controls['participationAmount'].value,
          termConditionComments: this.form.value.othertnc,
          participationCommission: this.form.value.participationCommissionAmount,
          participationCommissionAmount: '',
          isOfferdPriceAccepted: false,
          validity: _moment(this.form.value.bankQuoteValidity).format(
            'YYYY-MM-DD'
          ),
        };
        this.draftQuotation(this.previewData, type, this.from);
      }
    }
    if (this.from === 'active') {
      if (type === 'preview_accepted') {
        if (!this.form.valid) {
          return;
        }
        this.previewData = {
          transactionId: this.transactionDetails?.transactionId,
          secTransactionType: this.transactionDetails?.secTransactionType,
          requirementType: this.transactionDetails?.requirementType,
          applicableBenchmark: this.transactionDetails?.benchmark,
          commentsBenchmark: '',
          riskBenchmark: 0,
          minTransactionCharges: 0,
          otherCharges: '',
          otherChargesType: '',
          participationAmount:
            Number(this.transactionDetails?.lCValue || 0) -
            Number(this.transactionDetails?.retentionAmt || 0),
          termConditionComments: this.form.value.othertnc,
          participationCommission:
            this.form.controls['participationCommissionAmount'].value,
          participationCommissionAmount: '',
          isOfferdPriceAccepted: true,
          validity: _moment(this.form.value.bankQuoteValidity).format(
            'YYYY-MM-DD'
          ),
        };
        this.draftQuotation(this.previewData, type, this.from);
      }
      if (type === 'preview_accepted_placeQuote') {
        if (!this.form.valid) {
          return;
        }
        this.previewData = {
          transactionId: this.transactionDetails?.transactionId,
          secTransactionType: this.transactionDetails?.secTransactionType,
          requirementType: this.transactionDetails?.requirementType,
          applicableBenchmark: this.transactionDetails?.benchmark,
          commentsBenchmark: this.form.controls['commentsBenchmark'].value,
          riskBenchmark: this.form.controls['marginBenchmark'].value,
          minTransactionCharges:
            this.form.controls['minimumTransactionCharge'].value,
          otherCharges: this.form.controls['otherCharges'].value,
          otherChargesType: this.form.controls['typeOfCharge'].value,
          participationAmount: this.form.controls['participationAmount'].value,
          termConditionComments: this.form.value.othertnc,
          participationCommission: this.form.value.participationCommissionAmount,
          participationCommissionAmount: '',
          isOfferdPriceAccepted: false,
          validity: _moment(this.form.value.bankQuoteValidity).format(
            'YYYY-MM-DD'
          ),
        };
        this.draftQuotation(this.previewData, type, this.from);
      }
    }



  }
  editQuote(type?: any) {
    if (type === 'accepted_preview') {
      this.editFromNew = true;
      this.viewType = 'accept_offerForm';
    }
    if (type === 'accepted_preview_placequote') {
      this.editFromNew = true;
      this.viewType = 'place_newQuote';
    }
  }
  acceptOfferedPrice() {
    this.setFormForAccepted();
    this.viewType = 'accept_offerForm';
  }
  placeNewQuote() {
    this.viewType = 'place_newQuote';
    this.setFormForPlaceQuote();
  }
  confirm(type?: any) {
    console.log(type)
    if (this.from === 'new') {
      if (this.editFromNew) {
        let quoteDetails: any = this.transactionDetails?.quotationList[0];
        let payload: any = {
          transactionId: this.transactionDetails.transactionId,
        };
        payload.quotationId = quoteDetails?.quotationId;
        if (quoteDetails?.quotationStatus === 'DRAFT') {
          this.bankService.saveSecondryTransaction(payload).subscribe({
            next: (res: any) => {
              this.transactionDetails = res?.data[0];
              this.viewType = type;
            },
          });
        }
        else{
          this.router.navigateByUrl('/bank-underwriter/secondary-success', {
            state: { from: 'buying' },
          });
        }
      } else {
        let userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
        let quoteDetails: any = this.transactionDetails?.quotationList[0];
        let payload: any = {
          transactionId: this.transactionDetails.transactionId,
        };
        payload.quotationId = quoteDetails?.quotationId;
        this.bankService.saveSecondryTransaction(payload).subscribe({
          next: (res: any) => {
            console.log(res);
            this.router.navigateByUrl('/bank-underwriter/secondary-success', {
              state: { from: 'buying' },
            });
          },
        });
      }

    }
    if(this.from==='active'){
      this.router.navigateByUrl('/bank-underwriter/secondary-success', {
        state: { from: 'buying' },
      });
    }
    if(this.from==='save'){
      let userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
      let quoteDetails: any = this.transactionDetails?.quotationList[0];
      let payload: any = {
        transactionId: this.transactionDetails.transactionId,
      };
      payload.quotationId = quoteDetails?.quotationId;
      this.bankService.saveSecondryTransaction(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          this.router.navigateByUrl('/bank-underwriter/secondary-success', {
            state: { from: 'buying' },
          });
        },
      });
    }






    // if (type === 'accepted_preview') {
    //   this.saveQuote();
    // }
    // if (type === 'accepted_preview_placequote') {
    //   this.saveQuote();
    // }

    // popup.afterClosed().subscribe(() => {
    // if (type === 'accepted_preview') {
    // this.saveQuote(type);
    // }
    // if (type === 'accepted_preview_placequote') {
    //   this.saveQuote(type);
    // }
    // });
  }
  saveQuote(type?: any) {
    if (this.from === 'new') {
      let userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
      let quoteDetails: any = this.transactionDetails?.quotationList[0];
      let payload: any = {
        transactionId: this.transactionDetails.transactionId,
      };
      // if (this.transactionDetails?.quotationList?.length > 0) {
      //   for (let i of this.transactionDetails.quotationList) {
      //     if (i.bankId === userDetails?.username) {
      //       quoteDetails = i;
      //     }
      //   }
      // }
      payload.quotationId = quoteDetails?.quotationId;
      this.bankService.saveSecondryTransaction(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          // const popup= this.dialog.open(BuyingQuotationUpdatePopupComponent,{ data: { viewType: type, } });
          // popup.afterClosed().subscribe(() => {
          this.router.navigateByUrl('/bank-underwriter/secondary-success', {
            state: { from: 'buying' },
          });
          // });
        },
      });
    }

    if (this.from === 'active') {
      let userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
      let quoteDetails: any = this.transactionDetails?.quotationList[0];
      let payload: any = {
        transactionId: this.transactionDetails.transactionId,
        ...this.previewData,
      };
      // if (this.transactionDetails?.quotationList?.length > 0) {
      //   for (let i of this.transactionDetails.quotationList) {
      //     if (i.bankId === userDetails?.username) {
      //       quoteDetails = i;
      //     }
      //   }
      // }
      payload.quotationId = quoteDetails?.quotationId;
      this.bankService.updateSecondryTransaction(payload).subscribe({
        next: (res) => {
          const popup = this.dialog.open(BuyingQuotationUpdatePopupComponent, {
            data: { viewType: type },
          });
          popup.afterClosed().subscribe(() => {
            this.location.back();
          });
        },
      });
    }
    if (this.from === 'save') {
      let userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
      let quoteDetails: any = this.transactionDetails?.quotationList[0];
      let payload: any = {
        transactionId: this.transactionDetails.transactionId,
        ...this.previewData,
      };
      // if (this.transactionDetails?.quotationList?.length > 0) {
      //   for (let i of this.transactionDetails.quotationList) {
      //     if (i.bankId === userDetails?.username) {
      //       quoteDetails = i;
      //     }
      //   }
      // }
      payload.quotationId = quoteDetails?.quotationId;
      this.bankService.updateSecondryTransaction(payload).subscribe({
        next: (res) => {
          const popup = this.dialog.open(BuyingQuotationUpdatePopupComponent, {
            data: { viewType: type },
          });
          popup.afterClosed().subscribe(() => {
            this.location.back();
          });
        },
      });
    }
  }
  setFormForPlaceQuote() {
    this.form.setValue({
      participationAmount:
        this.formatAmount((Number(this.transactionDetails?.lCValue || 0) -
        Number(this.transactionDetails?.retentionAmt || 0)).toString()),
      applicableBenchmark: this.transactionDetails?.benchmark,
      commentsBenchmark: '',
      marginBenchmark: '',
      otherCharges: '',
      minimumTransactionCharge: '',
      bankQuoteValidity: '',
      othertnc: '',
      typeOfCharge: '',
      participationCommissionAmount: '',
    });

    this.form.controls['participationAmount'].enable();
    this.form.controls['commentsBenchmark'].enable();

    this.form.controls['otherCharges'].enable();
    this.form.controls['typeOfCharge'].enable();
    this.form.controls['minimumTransactionCharge'].enable();
    this.form.controls['bankQuoteValidity'].enable();
    this.form.controls['othertnc'].enable();
    if (
      this.fieldNotRequired.includes(
        this.transactionDetails?.secTransactionType
      )
    ) {
      this.form.controls['participationCommissionAmount'].enable();
      this.form.controls['applicableBenchmark'].disable();
      this.form.controls['marginBenchmark'].disable();
    } else {
      this.form.controls['marginBenchmark'].enable();
      this.form.controls['applicableBenchmark'].disable();
      this.form.controls['participationCommissionAmount'].disable();
    }
  }

  setFormForAccepted() {
    // this.transactionDetails

    this.form.setValue({
      participationAmount:
        this.formatAmount((Number(this.transactionDetails?.lCValue || 0) -
        Number(this.transactionDetails?.retentionAmt || 0)).toString()),
      applicableBenchmark: this.transactionDetails?.benchmark,
      commentsBenchmark: '',
      marginBenchmark: 0,
      otherCharges: 0,
      minimumTransactionCharge: 0,
      bankQuoteValidity: '',
      othertnc: '',
      typeOfCharge: '',
      participationCommissionAmount: 0,
    });
    this.form.controls['participationAmount'].disable();
    this.form.controls['commentsBenchmark'].disable();
    this.form.controls['otherCharges'].disable();
    this.form.controls['typeOfCharge'].disable();
    this.form.controls['minimumTransactionCharge'].disable();
    this.form.controls['bankQuoteValidity'].enable();
    this.form.controls['othertnc'].enable();
    this.form.controls['applicableBenchmark'].disable();
    this.form.controls['participationCommissionAmount'].disable();
    this.form.controls['marginBenchmark'].disable();
  }

  draftQuotation(payload: any, type: any, from: any) {
    console.log(payload, from, type)
    if (this.from === 'new') {
      if (this.editFromNew) {
        let userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
        let quoteDetails: any = this.transactionDetails?.quotationList[0];
        payload.quotationId = quoteDetails?.quotationId;
        if(quoteDetails?.quotationStatus === 'DRAFT'){
          this.bankService.saveSecondryTransaction(payload).subscribe({
            next: (res: any) => {
              console.log(res);
              this.transactionDetails = res?.data[0];
              this.viewType = type;
            },
          });
        }
        else{
          this.bankService.updateSecondryTransaction(payload).subscribe({
            next: (res: any) => {
              console.log(res);
              this.transactionDetails = res?.data[0];
              this.viewType = type;
            },
          });
        }
        console.log(payload)
      } else {
        this.bankService.draftSecondryTransaction(payload).subscribe({
          next: (res: any) => {
            console.log(res);
            this.transactionDetails = res?.data[0];
            this.viewType = type
          },
        });
      }

    }
    if(this.from === 'active'){
      let userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
      let quoteDetails: any = this.transactionDetails?.quotationList[0];
      payload.quotationId = quoteDetails?.quotationId;
      console.log(payload)
      this.bankService.updateSecondryTransaction(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          this.transactionDetails = res?.data[0];
          this.viewType = type
        },
      });
    }

    if(this.from === 'save'){
      let userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
      let quoteDetails: any = this.transactionDetails?.quotationList[0];
      payload.quotationId = quoteDetails?.quotationId;
      console.log(payload)
      this.bankService.updateSecondryTransaction(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          this.transactionDetails = res?.data[0];
          this.viewType = type
        },
      });
    }

    // this.bankService.draftSecondryTransaction(payload).subscribe({
    //   next: (res: any) => {
    //     console.log(res);
    //     this.transactionDetails = res?.data[0];
    //     this.viewType = type
    //   },
    // });
  }
  saveAndUpdateQuotation(payload: any, type: any) {
    let userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    let quoteDetails: any = this.transactionDetails?.quotationList[0];
    payload.quotationId = quoteDetails?.quotationId;
    console.log(payload)
    this.bankService.updateSecondryTransaction(payload).subscribe({
      next: (res: any) => {
        console.log(res);
        this.transactionDetails = res?.data[0];
        this.viewType = type
      },
    });
  }
  setFormForActiveQuotes() {
    let userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    let quoteDetails: any = this.transactionDetails?.quotationList[0];
    // if (this.transactionDetails?.quotationList?.length > 0) {
    //   for (let i of this.transactionDetails.quotationList) {
    //     if (i.bankId === userDetails?.username) {
    //       quoteDetails = i;
    //     }
    //   }
    // }

    this.form.setValue({
      participationAmount: Number(
        quoteDetails?.participationAmount || 0
      )?.toFixed(2),
      applicableBenchmark: Number(
        quoteDetails?.applicableBenchmark || 0
      )?.toFixed(2),
      commentsBenchmark: quoteDetails?.commentsBenchmark || '',
      marginBenchmark: Number(quoteDetails?.riskBenchmark || 0)?.toFixed(2),
      otherCharges: Number(quoteDetails?.otherCharges || 0)?.toFixed(2),
      minimumTransactionCharge: Number(
        quoteDetails?.minTransactionCharges || 0
      )?.toFixed(2),
      bankQuoteValidity: quoteDetails?.validity,
      othertnc: quoteDetails?.termConditionComments,
      typeOfCharge: quoteDetails?.otherChargesType,
      participationCommissionAmount: quoteDetails?.participationCommission || 0,
    });
    this.form.controls['participationAmount'].disable();
    this.form.controls['applicableBenchmark'].disable();
    this.form.controls['commentsBenchmark'].disable();
    this.form.controls['marginBenchmark'].disable();
    this.form.controls['otherCharges'].disable();
    this.form.controls['typeOfCharge'].disable();
    this.form.controls['minimumTransactionCharge'].disable();
    this.form.controls['bankQuoteValidity'].disable();
    this.form.controls['othertnc'].disable();
  }
  withdrawQuotation() {
    let payload = {
      transactionId: this.transactionDetails.transactionId,
      quotationId: this.getQuoteId().quotationId,
    };
    const dialog = this.dialog.open(ConfirmationPopupComponent, {
      autoFocus: false,
      data: {
        title: 'Withdraw Quotation',
        type: 'Quotation',
        mode: 'withdraw',
      },
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.bankService.withdrawSecondryTransaction(payload).subscribe({
          next: (resp) => {
            this.location.back();
          },
        });
      }
    });
  }

  getQuoteId() {
    let userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    let quoteDetails: any = this.transactionDetails?.quotationList[0];
    // if (this.transactionDetails?.quotationList?.length > 0) {
    //   for (let i of this.transactionDetails.quotationList) {
    //     if (i.bankId === userDetails?.username) {
    //       quoteDetails = i;
    //     }
    //   }
    //   return quoteDetails;
    // }
    return quoteDetails;
  }
  checkPartAmount(controlName: any) {
    let minParAmount = Number(
      this.transactionDetails?.minParticipationAmt || 0
    );
    let transAmnt = Number(this.transactionDetails?.transactionAmount || 0);
    let renAmount = Number(this.transactionDetails?.retentionAmt || 0);
    let formControl: any = this.form.controls[controlName];
    let currentVal = Number(formControl?.value || 0);
    if (formControl.value !== '') {
      if (currentVal < minParAmount) {
        formControl.setErrors({
          invalidAmnt:
            'Amount Entered should not be less than min participation amount',
        });
      } else if (currentVal > transAmnt - renAmount && currentVal > transAmnt) {
        formControl.setErrors({
          invalidAmnt:
            'Amount Entered should not be greater than difference of Transaction amount and Retention Amount',
        });
      } else {
        formControl.setErrors(null);
      }
    }
  }

  getDistributionBank() {
    if (this.from === 'new') {
      let userDetails = JSON.parse(localStorage.getItem('userInfo') || '{}');
      let bankName = `${userDetails.firstName} ${userDetails.lastName}`;
      return bankName;
    } else if (this.from === 'active') {
      return this.transactionDetails?.quotationList?.[0]?.distributedBank;
    } else if (this.from === 'save') {
      return this.transactionDetails?.quotationList?.[0]?.distributedBank;
    } else {
      return '-';
    }
  }
  restrictKeys(event: any) {
    return (
      (event.keyCode >= 96 && event.keyCode <= 105) ||
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      event.keyCode == 8 ||
      event.keyCode == 190 ||
      event.keyCode == 110 ||
      event.keyCode == 37 || // Left arrow
      event.keyCode == 39 || // Right arrow
      event.keyCode == 9  // Tab Key
    );
  }

  amountValidator(control: FormControl) {
  const value = control.value.replace(/,/g, '');
  // console.log(value)
  const isValid = /^(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/.test(value) && +value >= 0.1;
  return isValid ? null : {invalid:true};
}

formatAmount(value: string) {
  const number = +value?.toString().replace(/[^0-9.]/g, '');
  return isNaN(number) ? '' :number>0? number.toLocaleString('en-US',{
    maximumFractionDigits:2,
  }):'';
}

parseAmount(e: any) {
  // console.log(e)
  let target=e.target.value||''
  return target.replace(/,/g, '');
}

onBlur(formName:any) {
  const value = this.parseAmount({ target: { value: this.form.controls[formName].value } });
  this.form.controls[formName].setValue(this.formatAmount(value));
  // console.log(this.form.controls[formName])
  // this.focusOutEvent.emit(value);
  // this.validField.emit(true);
}

onPaste(event: ClipboardEvent) {
  event.preventDefault();
  const clipboardData = event.clipboardData || window['clipboardData'];
  const pastedText = clipboardData.getData('text');
  const formattedText = this.formatAmount(pastedText);
  document.execCommand('insertText', false, formattedText);
}

onKeyDown(event: KeyboardEvent) {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End','.'];
  const key = event.key;
  const isValidKey = !isNaN(key as any) || allowedKeys.includes(key);
  if (!isValidKey) {
    event.preventDefault();
  }
}
}
