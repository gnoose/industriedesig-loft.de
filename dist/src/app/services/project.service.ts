import { Injectable } from '@angular/core';
import { ThreeService } from './three.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public project = {
    leg: {
      price: 0,
      material: String
    },
    plate: {
      pricePerVolume: Number,
      thickness: Number,
      length: Number,
      width: Number,
      diameter: Number,
      material: String
    }
  }
  private _materials;

  public setMaterials(value) {
    this._materials = value;
  }

  private _price = 10;
  private _legsPrice = 0;
  private _platePrice = 0;
  private _platePriceFinishing = 0;
  constructor(public threeService: ThreeService) { }

  public updatePrice() {
    return {
      legs: this._legsPrice,
      plates: this._platePrice,
      platesFinishing: this._platePriceFinishing,
      total: this._legsPrice + this._platePrice + this._platePriceFinishing
    };
  }

  private _setPrice(type) {
    if (type === "leg") {
      this._legsPrice = Number(this.project.leg.price);
      let selectedLegMat;
      for (var i = 0; i < this._materials.length; i++) {
        if (this._materials[i].name === this.project.leg.material) {
          selectedLegMat = this._materials[i];
        }
      }
      this._platePriceFinishing = Number(selectedLegMat.priceFinishing);
    } else if (type === "plate") {
      let selectedMat;

      for (var i = 0; i < this._materials.length; i++) {
        if (this._materials[i].name === this.project.plate.material) {
          selectedMat = this._materials[i];
        }
      }
      const platePricePerVolume = Number(selectedMat.pricePerVolume);
      let plateVolume = 0;
      if(this.project.plate.width) {
        plateVolume = (Number(this.project.plate.thickness) * Number(this.project.plate.width) * Number(this.project.plate.length)) / 100000;
      } else if(this.project.plate.diameter) {
        plateVolume = (Number(this.project.plate.thickness) * Number(this.project.plate.diameter) * Math.PI) / 100000;
      }
      
      this._platePrice = Math.round(platePricePerVolume * plateVolume);
    }

  }

  public load(type, value) {
    this.project[type] = value;
    this.threeService.loadObject(type, value);
    this._setPrice(type);
  }

  public async init3D() {
    await this.threeService.init();
  }

  public valueChanged(type, property, value) {
    if (this.project[type]) {
      this.project[type][property] = value;
    }
    if (type === 'plate') {
      this.threeService.updatePlate(this.project[type]);
    }
    if (type === 'leg') {
      this.threeService.updateLegs(this.project[type]);
    }
    this._setPrice(type);
  }

  public getJSONProject() {
    const template = {
      plate: {
        material: String,
        length: Number,
        width: Number,
        thickness: Number,
        edge: String,
        extension: String
      },
      leg: {
        material: String,
        radius: Number,
        length: Number,
        width: Number,
        height: Number,
        xOffset: Number,
        yOffset: Number
      }
    }

    for (let i in template) {
      for (let j in template[i]) {
        template[i][j] = !isNaN(this.project[i][j]) ? Number(this.project[i][j]) : this.project[i][j];
      }
    }
    return template;
  }
}
