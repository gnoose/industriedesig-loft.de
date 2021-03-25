import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { PhpService } from './php.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private _basePath = "https://www.industriedesign-loft.de/table-configurator/";
  public selectedPlate; selectedPlateName; selectedLegs; selectedLegsName; availablePlates; availableLegs;
  public plateAvailableMaterials = []; legsAvailableMaterials = [];
  public projectSubject = new BehaviorSubject(<any>[]);
  public showSavePanel = false;
  public saveStatusSuccess = "";
  public saveStatusError = "";
  public deleteStatus = "";
  public genericProjects;
  public data;
  public userProjects = [];
  public currentProjectName; currentProjectThumbnailUrl;
  public toFilter = {
    plate: undefined,
    legs: undefined
  }
  public currentSelectedProject;
  public price = {};
  public isSavedStatus = "";
  public isSaved = false;

  public currentProject;

  constructor(public projectService: ProjectService, public php: PhpService) { }

  public initProjectByID() {
    return new Promise((resolve) => {
      this.projectSubject.subscribe(e => {
        let projects = this.genericProjects.concat(this.data["Projects"]);
        for (let i in projects) {
          if (projects[i].name === e) {
            resolve(projects[i]);
          }
        }
      });
    });
  }

  public showUserProjects() {
    this.php.checkLoginSession().then(res => {
      if (res["logged"]) {
        this.php.getUserProjects(res["email"]).then(res => {
          if (res["success"] == false) return;
          if (!this.data) {
            this.showUserProjects();
          } else {
            for (let i in <any>res) {
              res[i]["isSaved"] = true;
              this.userProjects.push(res[i]);
            }
          }
        });
      }
    });
  }

  public deleteProject(username) {
    return new Promise((resolve, reject) => {
      username = this.php.getUsernameFromEmail(username);
      this.php.deleteFromDatabase(username, this.currentSelectedProject.name).then((result) => {
        if (result["success"]) {
          this.deleteProjectFromList(this.currentSelectedProject.name);
          resolve(true);
        }
      });
    });
  }

  public deleteProjectFromList(arg) {
    for (let i = 0; i < this.userProjects.length; i++) {
      if (this.userProjects[i].name === arg) {
        this.userProjects.splice(i, 1);
      }
    }
  }

  public saveProject(username, name, plateName, legsName) {
    name = name ? name.trim() : name;
    username = this.php.getUsernameFromEmail(username);
    if (name) {
      this.projectService.threeService.makeProjectThumbnail(name).then(file => {
        this.php.uploadThumbnail(username, file).then(res => {
          let thumbUrl = this._basePath + res;
          let obj = this.projectService.getJSONProject();
          obj["name"] = name;
          this.currentProjectName = name;
          this.currentProjectThumbnailUrl = thumbUrl;
          let proj = JSON.stringify(obj, null, 4);
          if(this.currentProject && this.currentProject.standard) this.currentProject.standard = 'edited';
          this.php.setToDatabase(name, proj, thumbUrl, plateName, legsName).then(response => {
            if (response["success"]) {
              this.saveStatusSuccess = response["message"];
            } else {
              this.saveStatusError = response["message"];
            }
            this.putSavedProjectToList(name, proj, thumbUrl, plateName, legsName);
            this.isSaved = true;
          });
        });
      });
    } else {
      this.saveStatusError = "Bezeichnung eingeben";
    }
  }

  public sendToEmail(userEmail, values) {
    return new Promise((resolve, reject) => {
      let obj = this.projectService.getJSONProject();
      let proj = JSON.stringify(obj, null, 4);
      let projectUrl = `https://www.industriedesign-loft.de/table-configurator/#/projects/${this.php.getUsernameFromEmail(values.email)}@${this.currentProjectName}`
      this.php.sendToEmail(values.name, userEmail, values.email, values.phone, values.message, proj, projectUrl, this.currentProjectThumbnailUrl, this.selectedPlateName, this.selectedLegsName, this.price["total"]).then(response => {
        resolve(response);
      });
    })
  }

  public putSavedProjectToList(name?, proj?, thumbnail?, plates?, legs?) {
    let projectTemplate = {
      name: name,
      thumbnailPath: thumbnail,
      JSON: proj,
      plate: plates,
      legs: legs
    };
    this.userProjects.unshift(projectTemplate);
  }

  public filterMaterials(obj) {
    let plate = obj.plate;
    let leg = obj.legs;

    const fullList = this.getOption("Materials");
    this.plateAvailableMaterials = [];
    this.legsAvailableMaterials = [];

    for (let i = 0; i < fullList.length; i++) {
      for (let j = 0; j < plate.materialOptions.length; j++) {
        if (fullList[i].name === plate.materialOptions[j]) {
          this.plateAvailableMaterials.push(fullList[i])
        }
      }
      if (leg) {
        for (let k = 0; k < leg.materialOptions.length; k++) {
          if (fullList[i].name === leg.materialOptions[k]) {
            this.legsAvailableMaterials.push(fullList[i])
          }
        }
      }
    }
  }

  public loadProject(value) {
    if (!value.isSaved) this.isSaved = false;
    const properties = JSON.parse(value.JSON);
    this.currentProjectName = properties.name;
    this.currentSelectedProject = properties;
    const plate = this.getElementByName('Plates', value.plate);

    if (plate) {
      for (let prop in properties.plate) {
        if (plate[prop] !== undefined && properties.plate[prop] !== undefined) {
          plate[prop] = properties.plate[prop] + '';
        }
      }
      this.load('plate', plate);
      this.selectedPlate = plate;
      this.selectedPlateName = value.plate;
      this.toFilter.plate = plate;
    }

    const legs = this.getElementByName('Legs', value.legs);
    if (legs) {
      for (let prop in properties.leg) {
        if (legs[prop] !== undefined && properties.leg[prop] !== undefined) {
          legs[prop] = properties.leg[prop];
        }
      }
      this.load('leg', legs);
      this.selectedLegs = legs;
      this.selectedLegsName = value.legs;
      this.toFilter.legs = legs;
    }
    this.availablePlates = this.getOption("Plates");
    this.availableLegs = this.getOption("Legs");

    this.currentProject = value;
  }

  public load(type, value) {
    switch (type) {
      case "leg":
        this.selectedLegs = value;
        this.selectedLegsName = value.name;
        this.toFilter.legs = value;
        break;
      case "plate":
        this.selectedPlate = value;
        this.selectedPlateName = value.name;
        this.toFilter.plate = value;
        break;
    }
    this.filterMaterials(this.toFilter);
    this.projectService.load(type, value);
    this.price = this.projectService.updatePrice();
  }

  public async init3D() {
    return new Promise((resolve, reject) => {
      this.projectService.init3D().then(() => {
        this.php.getGenericProjectsTable().then(genericData => {
          this.genericProjects = genericData;
          this.php.getDatasFromDB().then(data => {
            this.data = data;
            resolve();
            this.projectService.setMaterials(this.data["Materials"]);
            this.initProjectByID().then((plm) => {
              this.loadProject(plm)
            })
          });
        });
      });
    });

  }

  public forgotPassword() {
    // this.php.forgotPassword("admin@aeche.ro");
  }

  public valueChanged(type, property, value) {
    this.projectService.valueChanged(type, property, value);
    this.price = this.projectService.updatePrice();
  }

  public getElementByName(type, name) {
    for (let i = 0; i < this.data[type].length; i++) {
      if (this.data[type][i].name === name) return this.data[type][i];
    }
  }

  public getOption(option) {
    return this.data[option]
  }

  private _projectExists(name) {
    let result = false;
    let projects = this.data['Projects'];
    for (let i in projects) {
      if (projects[i].name === name) {
        result = true;
      } else {
        result = false;
      }
    }
    return result;
  }
}
