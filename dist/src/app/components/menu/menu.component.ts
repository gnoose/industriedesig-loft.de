import { Component, OnInit, OnChanges } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public currentSiggnedUser;

  public projectName = "";

  public selectedPlate;
  public selectedLegs;

  public plateAvailableMaterials;
  public legsAvailableMaterials;

  public availablePlates;

  public selectePlateName;
  public availableLegs;
  public selecteLegsName;

  public clickedButton = 1;
  public selectedProjectsList;

  constructor(public uiService: UiService, private router: Router, private _router: ActivatedRoute, public dialog: MatDialog) { }

  public show3DView() {
    document.getElementById("user-panel").style.display = "none";
    document.getElementById("user-projects").style.display = "none";
    document.getElementById("plates-view").style.display = "none";
    document.getElementById("legs-view").style.display = "none";
    this.clickedButton = 1;
  }

  public showTableView() {
    document.getElementById("user-panel").style.display = "none";
    document.getElementById("user-projects").style.display = "none";
    document.getElementById("plates-view").style.display = "block";
    document.getElementById("legs-view").style.display = "block";
    this.clickedButton = 2;
  }

  public showProjectsView() {
    document.getElementById("user-panel").style.display = "block";
    document.getElementById("user-projects").style.display = "block";
    document.getElementById("plates-view").style.display = "none";
    document.getElementById("legs-view").style.display = "none";
    this.clickedButton = 3;
  }
  ngOnInit() {
    this.uiService.projectSubject.next(this._router.snapshot.paramMap.get('name'));
    this.uiService.php.checkLoginSession().then(res => {
      if (res["logged"]) {
        this.currentSiggnedUser = res["email"];
        this.loadUserProjects();
      }
      if (!this.isMobile) this.showFirstDialogBox();
      this.changeProjectList('default');
    });

    window.addEventListener('mousedown', () => {
      if (this.uiService.deleteStatus || this.uiService.saveStatusSuccess || this.uiService.saveStatusError || this.uiService.isSavedStatus) {
        this.uiService.deleteStatus = this.uiService.saveStatusSuccess = this.uiService.saveStatusError = this.uiService.isSavedStatus = '';
      }
    });
  }

  public setProjectName(name) {
    this.projectName = name;
  }

  // public orderNow() {
  //   this.uiService.sendToEmail(this.currentSiggnedUser).then(response => {
  //     if (response["success"]) {
  //       this.orderWarningLabel = response["message"];
  //       setTimeout(() => {
  //         this.orderWarningLabel = undefined;
  //       }, 4000);
  //     }
  //   });
  // }

  public changeProjectList(value) {
    this.selectedProjectsList = value;
  }

  public async loadUserProjects() {
    await this.uiService.showUserProjects();
  }

  public select(value) {
    this.uiService.currentProject = value;
    this.uiService.loadProject(this.uiService.currentProject);
  }

  public plateChanged(type, value) {
    if (value.target.value == "") return;
    this.uiService.valueChanged('plate', type, value.target.value);
  }

  public legsChanged(type, value) {
    if (value.target.value == "") return;
    let pValue = value.target ? value.target.value : value;
    this.uiService.valueChanged('leg', type, pValue);
  }

  public changeMaterial(category, value) {
    this.uiService.valueChanged(category, 'material', value);
  }

  public changeEdge(category, value) {
    this.uiService.valueChanged(category, 'edge', value);
  }
  public changeThickness(value) {
    this.uiService.valueChanged('plate', 'thickness', value);
  }

  public showFirstDialogBox() {
    const dialogRef = this.dialog.open(InitDialogBox, {
      width: '450px',
      data: { callback: this.showVideoTutorial.bind(this) }
    });
  }

  public showVideoTutorial() {
    const dialogRef = this.dialog.open(VideoTutorialDialogBox, {
      width: '800px',
      data: { videoURL: "https://www.youtube.com/watch?v=lF6nxufX74Q" }
    });
  }

  public login(callback?) {
    const dialogRef = this.dialog.open(LoginDialogBox, {
      width: '450px',
      data: { user: this.currentSiggnedUser, action: callback ? callback : undefined }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currentSiggnedUser = result.user;
        this.uiService.showUserProjects();
        if (result.callback) {
          this.saveProject(this.projectName, false);
        }
      }
    });
  }

  public openDeleteDialogBox() {
    const dialogRef = this.dialog.open(DeleteDialogBox, {
      width: '450px',
      data: { deleteCallback: this.deleteThisProject.bind(this), scope: this }
    });
  }

  public deleteThisProject(dialog) {
    let exist = false;
    this.uiService.data["Projects"].filter(element => {
      if (element.name === this.uiService.currentSelectedProject.name) {
        this.uiService.deleteStatus = "Standardprojekte können nicht gelöscht werden"
        exist = true;
        return;
      }
    });

    if (!exist) this.uiService.deleteProject(this.currentSiggnedUser).then((res) => {
      if (res) {
        dialog.close();
        this.router.navigate(['/projects/Rectangle']);
        this.uiService.loadProject(this.uiService.data["Projects"][0]);
      }
    });
  }

  public openSendToEmailDialogBox() {
    if (this.uiService.currentProject && this.uiService.currentProject.standard && this.uiService.currentProject.standard === 'TRUE') {
      this.uiService.isSavedStatus = "Bitte zuerst speichern";
      return;
    }
    const dialogRef = this.dialog.open(EmailDialogBox, {
      width: '450px',
      data: { callback: this.sendProjectToEmail.bind(this) }
    });
  }

  public sendProjectToEmail(values, dialog, dialogScope) {
    this.uiService.sendToEmail(this.currentSiggnedUser, values).then(response => {
      if (response["success"]) {
        dialogScope.orderSuccessLabel = response["message"];
      }
      setTimeout(() => {
        dialogScope.orderSuccessLabel = undefined;
        dialog.close();
      }, 15000);
    });
  }

  public saveProject(projectName, autoSignIn) {
    if (this.currentSiggnedUser) {
      this.uiService.saveProject(this.currentSiggnedUser, projectName, this.uiService.selectedPlateName, this.uiService.selectedLegsName);
      this.projectName = "";
    } else {
      this.uiService.saveStatusError = "Zum Speichern bitte anmelden oder unverbindlich registrieren"

      setTimeout(() => {
        if (autoSignIn) this.login(this.saveProject);
      }, 1000);
    }
  }

  get isMobile(): boolean {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
      return true;
    else
      return false;
  }
}

@Component({
  selector: 'login-dialog-box',
  templateUrl: 'login-dialog-box.html',
})
export class LoginDialogBox {

  constructor(
    public dialogRef: MatDialogRef<LoginDialogBox>,
    @Inject(MAT_DIALOG_DATA) public data: MenuComponent, public dialog: MatDialog) { }

  closeDialog(user?): void {
    this.dialogRef.close({ user: user ? user : undefined, callback: this.data["action"] });
  }

  public goToRegister() {
    const dialogRef = this.dialog.open(RegisterDialogBox, {
      width: '450px',
      data: {}
    });
  }

}


@Component({
  selector: 'register-dialog-box',
  templateUrl: 'register-dialog-box.html',
})
export class RegisterDialogBox {

  constructor(
    public dialogRef: MatDialogRef<RegisterDialogBox>,
    @Inject(MAT_DIALOG_DATA) public data: MenuComponent, public dialog: MatDialog) { }

  closeDialog(user?): void {
    this.dialogRef.close(user ? user : undefined);
  }


  public goToLogin() {
    const dialogRef = this.dialog.open(LoginDialogBox, {
      width: '450px',
      data: {}
    });
  }
}

@Component({
  selector: 'init-dialog-box',
  templateUrl: 'init-dialog-box.html',
})
export class InitDialogBox {

  constructor(
    public dialogRef: MatDialogRef<InitDialogBox>,
    @Inject(MAT_DIALOG_DATA) public data: MenuComponent, public dialog: MatDialog) { }

  openVideoTutorial() {
    this.data['callback']();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'tutorial-dialog-box',
  templateUrl: 'tutorial-dialog-box.html',
})
export class VideoTutorialDialogBox {
  public videoUrl;

  constructor(
    public dialogRef: MatDialogRef<VideoTutorialDialogBox>,
    private _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: MenuComponent, public dialog: MatDialog) {
    let url = data["videoURL"].replace("watch?v=", "embed/");
    this.videoUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'delete-dialog-box',
  templateUrl: 'delete-dialog-box.html',
})
export class DeleteDialogBox {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogBox>,
    private _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: MenuComponent, public dialog: MatDialog) {
  }

  confirmDialog(): void {
    this.data["deleteCallback"](this.dialogRef);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'email-dialog-box',
  templateUrl: 'email-dialog-box.html',
  styles: [`
    .full-width{
      width:100%;
    }
  `]
})
export class EmailDialogBox {
  public inputValues = {
    name: undefined,
    email: undefined,
    phone: undefined,
    message: undefined,
  }
  public orderWarningLabel;
  public orderSuccessLabel;

  constructor(
    public dialogRef: MatDialogRef<EmailDialogBox>,
    private _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: MenuComponent, public dialog: MatDialog) {
  }

  confirmDialog(): void {
    for (let i in this.inputValues) {
      if (this.inputValues[i] === undefined) {
        this.orderWarningLabel = 'Alle Felder sind erforderlich';
        setTimeout(() => {
          this.orderSuccessLabel = this.orderWarningLabel = undefined;
        }, 15000);
        return;
      }
    }

    this.orderWarningLabel = '';
    this.data["callback"](this.inputValues, this.dialogRef, this);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}




