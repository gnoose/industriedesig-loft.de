import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhpService } from '../../services/php.service';
import { UiService } from '../../services/ui.service';
import { LoginDialogBox } from '../menu/menu.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  warning = "";
  success = "";

  constructor(private uiService: UiService, private phpService: PhpService, private _router: Router, public _loginDialog: LoginDialogBox, public dialog: MatDialog) { }

  ngOnInit() {
  }

  login(email, pass) {
    this.phpService.login(email, pass)
      .then(res => {
        if (!res["logged"]) {
          this.showResponse(Response.type.error, res["message"]);
        } else {
          this.showResponse(Response.type.success, res["message"], res["email"]);
        }
      });
  }

  showResponse(res: Response.type, value: string, user?: string) {
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
          this._loginDialog.closeDialog(user);
          //this._router.navigate(['/home']);
        }, 1000);
        break;
    }
  }

  goToRegister() {
    this._loginDialog.closeDialog()
    this._loginDialog.goToRegister();
  }

  openForgottenPasswordDialog() {
    const dialogRef = this.dialog.open(ForgottenPassword, {
      width: '600px',
      data: { sendToEmail: this.phpService.forgotPassword.bind(this.phpService) }
    });
  }

}

module Response {
  export enum type {
    success,
    error
  };

}


@Component({
  selector: 'forgot-password-dialog-box',
  templateUrl: 'forgot-password-dialog-box.html',
})
export class ForgottenPassword {
  public forgottenPasswordSuccess;
  public forgottenPasswordError;
  public hasProgressBar = false;
  public hasConfirmed = false;
  constructor(
    public dialogRef: MatDialogRef<ForgottenPassword>,
    @Inject(MAT_DIALOG_DATA) private data: LoginPageComponent, public dialog: MatDialog) {
  }

  confirm(email): void {
    this.hasProgressBar =  this.hasConfirmed = true;
    this.data["sendToEmail"](email).then(res => {
      setTimeout((): void => {
        if (res['success'])
          this.forgottenPasswordSuccess = res['message'];
        else
          this.forgottenPasswordError = res['message'];

        this.hasProgressBar = false;
      }, 1000);
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
