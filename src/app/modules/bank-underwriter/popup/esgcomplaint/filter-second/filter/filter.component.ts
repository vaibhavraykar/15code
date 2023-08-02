import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
})
export class FilterComponent implements OnInit {

  checkedFilter = 'ALL';


  constructor(
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    console.log(this.data);
    this.checkedFilter =
      this.data.filterBy.length === 1 ? this.data.filterBy[0] : 'ALL';
  }

  close() {
    this.dialogRef.close({
      filter: false,
      filterBy: this.checkedFilter,
    });
  }
  
  check(name: string) {
    if (this.checkedFilter === name) {
      this.checkedFilter = 'ALL';
    } else {
      this.checkedFilter = name;
    }
  }
  submit() {
    this.dialogRef.close({
      filter: true,
      filterBy: this.checkedFilter,
    });
  }
}
