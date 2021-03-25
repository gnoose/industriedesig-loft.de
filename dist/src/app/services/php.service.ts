import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PhpService {
  private tablesEnum = ["Plates", "Legs", "Projects", "Materials"];
  constructor(private http: HttpClient) {
  }


  public getDatasFromDB() {
    return new Promise((resolve, reject) => {
      let k = 0;
      const jsonData = {};
      for (let i = 0; i < this.tablesEnum.length; i++) {
        this.http.get(this._tableName(this.tablesEnum[i]), { responseType: "json" }).subscribe(res => {
          ;
          let json = JSON.parse(JSON.stringify(res));
          if (json.length > 1) {
            for (let j in json) {
              this._convertStringToArray(json[j]);
            }
          } else {
            this._convertStringToArray(json[0]);
          }
          json = this._convertToNumber(json);
          jsonData[this.tablesEnum[i]] = JSON.parse(JSON.stringify(json));
          k++
          if (k === this.tablesEnum.length) {
            resolve(jsonData);
          }
        });
      }
    })
  }

  public getGenericProjectsTable() {
    return new Promise((resolve, reject) => {
      this.http.get(this._tableName('GenericProjects'), { responseType: "json" }).subscribe(res => {
        resolve(res);
      });
    });
  }

  public getUserProjects(email) {
    return new Promise((resolve, reject) => {
      const url = this._tableName(this.getUsernameFromEmail(email));
      this.http.get(url, { responseType: 'json' }).subscribe(data => {
        let json = JSON.parse(JSON.stringify(data));
        if (json.length > 1) {
          for (let j in json) {
            this._convertStringToArray(json[j]);
          }
        } else {
          this._convertStringToArray(json[0]);
        }
        json = this._convertToNumber(json);
        let result = JSON.parse(JSON.stringify(json));
        resolve(result);
      });
    })
  }

  public async checkLoginSession() {
    return new Promise((resolve, reject) => {
      const url = "https://www.industriedesign-loft.de/table-configurator/loginSession.php"

      this.http.get(url, { responseType: 'json' })
        .subscribe(res => {
          resolve(res);
        }),
        error => {
          console.error(`Can't read php file. Error: ${error}`);
        }
    });
  }

  public login(email, password) {
    return new Promise((resolve, reject) => {
      const url = "https://www.industriedesign-loft.de/table-configurator/login.php"
      const frmData = new FormData();
      frmData.append("email", email);
      frmData.append("password", password);

      this.http.post(url, frmData, { responseType: 'json' }).subscribe(data => {
        resolve(data);
      },
        error => {
          console.error(`Can't read php file. Error: ${error}`);
        });
    });
  }

  public logout() {
    const url = "https://www.industriedesign-loft.de/table-configurator/logout.php"

    this.http.get(url, { responseType: 'json' })
      .toPromise()
      .then(res => {
        if (res["success"]) {
          window.location.reload();
        }
      });
  }

  public register(email, password) {
    return new Promise((resolve, reject) => {
      const url = "https://www.industriedesign-loft.de/table-configurator/register.php"
      const frmData = new FormData();
      frmData.append("email", email);
      frmData.append("password", password);

      this.http.post(url, frmData, { responseType: 'json' }).subscribe(data => {
        resolve(data);
      },
        error => {
          console.error(`Can't read php file. Error: ${error}`);
        });
    });
  }

  public deleteFromDatabase(username, projectName) {
    return new Promise((resolve, reject) => {
      const url = "https://www.industriedesign-loft.de/table-configurator/deleteFromDatabase.php"
      const frmData = new FormData();
      frmData.append("tableName", username);
      frmData.append("projectName", projectName);


      this.http.post(url, frmData, { responseType: 'json' }).subscribe(data => {
        resolve(data);
      },
        error => {
          console.error(`Can't read php file. Error: ${error}`);
        });
    });
  }

  public forgotPassword(email) {
    return new Promise((resolve, reject) => {
      const url = "https://www.industriedesign-loft.de/table-configurator/forgottenPassword.php";
      const randomPassword = Math.random().toString(36).slice(-8);

      const frmData = new FormData();
      frmData.append("email", email);
      frmData.append("password", randomPassword);

      this.http.post(url, frmData, { responseType: 'json' }).subscribe(data => {
        resolve(data);
      },
        error => {
          console.error(`Can't read php file. Error: `, error);
        });
    });
  }

  public sendToEmail(name, email, contactEmail, phone, message, project, projectUrl, thumbUrl, selectedPlate, selectedLegs, price) {
    return new Promise((resolve, reject) => {
      const url = "https://www.industriedesign-loft.de/table-configurator/sendToEmail.php"
      const frmData = new FormData();
      frmData.append("name", name);
      frmData.append("email", email);
      frmData.append("contactEmail", contactEmail);
      frmData.append("phone", phone);
      frmData.append("message", message);
      frmData.append("legsType", selectedLegs);
      frmData.append("plateType", selectedPlate);
      frmData.append("projectJSON", project);
      frmData.append("projectUrl", projectUrl);
      frmData.append("thumbUrl", thumbUrl);
      frmData.append("price", price)

      this.http.post(url, frmData, { responseType: 'json' }).subscribe(data => {
        resolve(data);
      },
        error => {
          console.error(`Can't read php file. Error: ${error}`);
        });
    });
  }


  public setToDatabase(name?, proj?, thumbnail?, plates?, legs?) {
    return new Promise((resolve, reject) => {
      this.checkLoginSession().then(user => {
        if (user["logged"]) {
          let projectTemplate = {
            projectName: name,
            projectURL: `https://www.industriedesign-loft.de/table-configurator/#/projects/${name}`,
            thumbnail_path: thumbnail,
            projectJson: proj,
            plate: plates,
            legs: legs
          };

          const url = "https://www.industriedesign-loft.de/table-configurator/postToDatabase.php"
          const params = new FormData();

          params.append("tableName", this.getUsernameFromEmail(user["email"]));
          for (let i in projectTemplate) {
            params.append(i, projectTemplate[i]);
          }
          this.http.post(url, params, { responseType: 'json' }).subscribe(data => {
            resolve(data);
          },
            error => {
              console.error(`Can't read php file. Error: ${error}`);
            });
        }
      })

    });
  }

  public uploadThumbnail(username, thumb) {
    return new Promise((resolve, reject) => {
      const url = "https://www.industriedesign-loft.de/table-configurator/uploadThumbnail.php"
      const frmData = new FormData();
      frmData.append("fileToUpload", thumb);
      frmData.append("username", username);
      this.http.post(url, frmData, { responseType: 'text' }).subscribe(data => {
        resolve(data);
      },
        error => {
          console.error(`Can't read php file. Error: ${error}`);
        });
    });
  }


  public getUsernameFromEmail(user) {
    let res = user.split("@");
    return `${res[0].replace(/[^\w\s]/gi, '')}_Projects`;
  }

  private _convertToNumber(items) {
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      for (let prop in item) {
        item[prop] = !isNaN(item[prop]) ? Number(item[prop]) : item[prop];
      }
    }
    return items;
  }

  private _convertStringToArray(string) {
    for (let k in string) {
      if (string[k] == null) { string[k] = undefined }
      if (k !== "Name" && k !== "Project_JSON" && string[k] != null && string[k].includes(",")) {
        string[k] = string[k].split(",");
      }
    }
  }

  private _tableName(arg) {
    return `https://www.industriedesign-loft.de/table-configurator/index.php?tablename=${arg}`;
  }

}
