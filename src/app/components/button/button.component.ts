import { Component, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
})
export class ButtonComponent implements OnInit {
  @Input() showIcon: boolean;
  @Input() name: string;
  @Input() class: string;
  @Input() type: string;
  @Input() disable: boolean;

  constructor() {}

  ngOnInit() {}
}
