import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhpService } from '../../services/php.service';
import { RegisterDialogBox } from '../menu/menu.component';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  warning = "";
  success = "";

  constructor(private phpService: PhpService, private _router: Router, public _registerDialog: RegisterDialogBox) { }

  ngOnInit() {
  }

  register(email, pass, passConfirm) {
    if (pass !== passConfirm) {
      this.showResponse(Response.type.error, "Confirm password doesn't match the password.");
    } else {
      this.phpService.register(email, pass)
        .then(res => {
          if (res["type"] === "error") {
            this.showResponse(Response.type.error, res["message"]);
          } else {
            this.showResponse(Response.type.success, res["message"]);
          }
        });
    }
  }

  showResponse(res: Response.type, value: string) {
    switch (res) {
      case Response.type.error:
        this.success = "";
        this.warning = value;
        setTimeout(() => {
          this.warning = "";
        }, 3000);
        break;
      case Response.type.success:
        this.warning = "";
        this.success = value;
        setTimeout(() => {
          this.success = "";
          this.goToLogin();
        }, 2000);
        break;
    }
  }

  goToLogin() {
    this._registerDialog.closeDialog();
    this._registerDialog.goToLogin();
  }
}

module Response {
  export enum type {
    success,
    error
  };
}
