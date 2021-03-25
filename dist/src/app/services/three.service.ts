import { Injectable } from '@angular/core';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, SphereGeometry, Object3D, GLTFLoader, OrbitControls, AmbientLight, SpotLight, GridHelper, CubeTextureLoader, Fog } from 'three-full'

@Injectable({
  providedIn: 'root'
})
export class ThreeService {

  private _renderer: WebGLRenderer;
  private _scene: Scene;
  private _legHolder: Object3D;
  private _plateHolder: Object3D;
  private _camera: PerspectiveCamera;
  private _mesh: Mesh;
  private _loader = new GLTFLoader();
  private _cubeMapLoader = new CubeTextureLoader()
  private _controls;
  private _cubeMap;
  private _materials;
  // private _basePath = "https://www.industriedesign-loft.de/table-configurator/";
  private _basePath = "";

  constructor() { }

  public updatePlate(values) {
    if (Number(values.length)) {
      this._plateHolder.children[0].scale.z = Number(values.length) / Number(values.defaultLength);
    }

    if (Number(values.width)) {
      this._plateHolder.children[0].scale.x = Number(values.width) / Number(values.defaultWidth);
    }

    if (Number(values.diameter)) {
      this._plateHolder.children[0].scale.x = Number(values.diameter) / Number(values.defaultDiameter);
      this._plateHolder.children[0].scale.z = Number(values.diameter) / Number(values.defaultDiameter);
    }
    if (values.thickness) {
      this._plateHolder.children[0].scale.y = Number(values.thickness) / Number(values.defaultThickness);
    }

    if (values.material) {
      const material = this._getMaterialByName(values.material);
      if (material) this._setMaterial(this._plateHolder.children[0], material);
    }
    if (values.edge) {
      this._plateHolder.children[0].traverse(child => {

        if (child.name === values.edge) {
          child.visible = true;
        } else if (child.material) {
          child.visible = false;
        }
      })
    }
  }

  public updateLegs(obj) {
    let values = JSON.parse(JSON.stringify(obj))
    const lengthMeshes = typeof values.lengthMeshes === "string" ? values.lengthMeshes.split(',') : values.lengthMeshes;
    const widthMeshes = typeof values.widthMeshes === "string" ? values.widthMeshes.split(',') : values.widthMeshes;
    const xOffsetMeshes = typeof values.xOffsetMeshes === "string" ? values.xOffsetMeshes.split(',') : values.xOffsetMeshes;
    const yOffsetMeshes = typeof values.yOffsetMeshes === "string" ? values.yOffsetMeshes.split(',') : values.yOffsetMeshes;

    if (values.radius != 0) {
      values.length = values.radius;
      values.xOffset = values.radius;
      values.width = values.radius;
      values.yOffset = values.radius;
    }

    if (values.material) {
      const material = this._getMaterialByName(values.material);
      if (material) this._setMaterial(this._legHolder.children[0], material);
    }

    if (lengthMeshes.length && Number(values.length)) {
      lengthMeshes.forEach(element => {
        const mesh = this._legHolder.children[0].getObjectByName(element);
        if (mesh) { mesh.scale.z = Number(values.length) / Number(values.defaultLength); }
      });
    }

    if (widthMeshes.length && Number(values.width)) {
      widthMeshes.forEach(element => {
        const mesh = this._legHolder.children[0].getObjectByName(element);
        if (mesh) { mesh.scale.x = Number(values.width) / Number(values.defaultWidth); }
      });
    }

    if (Number(values.height)) {
      this._legHolder.children[0].scale.y = Number(values.height) / Number(values.defaultHeight);
      this._plateHolder.position.y = Number(values.height);
    }

    if (widthMeshes.length && Number(values.width)) {
      widthMeshes.forEach(element => {
        const mesh = this._legHolder.children[0].getObjectByName(element);
        if (mesh) { mesh.scale.x = Number(values.width) / Number(values.defaultWidth); }
      });
    }
    if (xOffsetMeshes.length && values.xOffset) {

      const leftMesh = this._legHolder.children[0].getObjectByName(xOffsetMeshes[0]);
      const rightMesh = this._legHolder.children[0].getObjectByName(xOffsetMeshes[1]);

      const leftMesh1 = this._legHolder.children[0].getObjectByName(xOffsetMeshes[2]);
      const rightMesh1 = this._legHolder.children[0].getObjectByName(xOffsetMeshes[3]);

      if (leftMesh) leftMesh.position.z = -values.xOffset / 2;
      if (rightMesh) rightMesh.position.z = values.xOffset / 2;

      if (leftMesh1) leftMesh1.position.z = -values.xOffset / 2;
      if (rightMesh1) rightMesh1.position.z = values.xOffset / 2;

    }

    if (yOffsetMeshes.length && Number(values.yOffset)) {

      const leftMesh = this._legHolder.children[0].getObjectByName(yOffsetMeshes[0]);
      const rightMesh = this._legHolder.children[0].getObjectByName(yOffsetMeshes[1]);

      const leftMesh1 = this._legHolder.children[0].getObjectByName(yOffsetMeshes[2]);
      const rightMesh1 = this._legHolder.children[0].getObjectByName(yOffsetMeshes[3]);

      if (leftMesh) leftMesh.position.x = -Number(values.yOffset) / 2;
      if (rightMesh) rightMesh.position.x = Number(values.yOffset) / 2;

      if (leftMesh1) leftMesh1.position.x = Number(values.yOffset) / 2;
      if (rightMesh1) rightMesh1.position.x = -Number(values.yOffset) / 2;

    }
  }

  private _setMaterial(object, material) {
    material.envMap = this._cubeMap;
    object.traverse(child => {
      if (child.material) {
        child.material = material;
      }
    })
    // for (let i = 0; i < object.children.length; i++) {

    // }
  }

  private _getMaterialByName(name) {
    for (let i = 0; i < this._materials.scene.children.length; i++) {
      if (this._materials.scene.children[i].name === name) {
        return this._materials.scene.children[i].material;
      }
    }
  }

  public loadMaterials() {
    return new Promise((resolve, reject) => {
      this._loader.load(this._basePath + "assets/materials/materials.glb", (gltf) => {
        resolve(gltf);
      });
    })


  }

  public loadObject(type, value) {
    // const path = value.modelPath.replace("https://www.industriedesign-loft.de/table-configurator", "");
    const path = this._basePath + value.modelPath;
    if (type === "leg") {
      this._legHolder.traverse(child => {
        this._legHolder.remove(child);
      });

      this._loader.load(path, (gltf) => {
       this._legHolder.add(gltf.scene);
        this.updateLegs(value);
      })
    } else if (type === "plate") {
      this._plateHolder.traverse(child => {
        this._plateHolder.remove(child);
      })

      this._loader.load(path, (gltf) => {
        this._plateHolder.add(gltf.scene);
        this.updatePlate(value);
      })
    }
  }

  public init() {
    const animate = () => {
      requestAnimationFrame(animate);
      this._renderer.render(this._scene, this._camera);
    };
    
    const onWindowResize = () => {
      this._camera.aspect = window.innerWidth / window.innerHeight;
      this._camera.updateProjectionMatrix();
      this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    
    return new Promise((resolve, reject) => {
      const path = this._basePath + "assets/cubemap/";
      var format = '.jpg';
      var urls = [
        path + 'BK_RT' + format, path + 'BK_LF' + format,
        path + 'BK_UP' + format, path + 'BK_DN' + format,
        path + 'BK_BK' + format, path + 'BK_FR' + format
      ];

      this._cubeMapLoader.load(urls, (result) => {
        this._cubeMap = result;
      })

      this._loader.setCrossOrigin('anonymous');

      this._scene = new Scene();
      this._scene.fog = new Fog(0xeeeeee, 300, 900);

      this._camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      this._camera.position.set(150, 150, 150);

      this._renderer = new WebGLRenderer({ antialias: true });
      this._renderer.setSize(window.innerWidth, window.innerHeight);
      this._renderer.gammaOutput = true;
      this._renderer.gammaFactor = 2.2;
      this._renderer.setClearColor(0xeeeeee, 1);

      document.getElementById("webGL").appendChild(this._renderer.domElement);

      this._controls = new OrbitControls(this._camera, this._renderer.domElement);
      this._controls.maxDistance = 420;
      this._controls.minDistance = 100;
      this._controls.target.setY(50);
      this._controls.update();

      this._legHolder = new Object3D();
      this._plateHolder = new Object3D();
      this._scene.add(this._legHolder);
      this._scene.add(this._plateHolder);

      this._scene.add(new AmbientLight(0xffffff));

      const light1 = new SpotLight(0xffffff, 1, 1000);
      light1.position.set(450, 350, 150);
      this._scene.add(light1);

      const light2 = new SpotLight(0xffffff, 1, 1000);
      light2.position.set(-450, 350, 150);
      this._scene.add(light2);

      const light3 = new SpotLight(0xffffff, 1, 1000);
      light3.position.set(450, 350, -150);
      this._scene.add(light3);

      const light4 = new SpotLight(0xffffff, 1, 1000);
      light4.position.set(-450, 350, -150);
      this._scene.add(light4);

      const gridHelper = new GridHelper(2000, 50);
      this._scene.add(gridHelper);
      this.loadMaterials().then(mats => {
        this._materials = mats;
        animate();
        resolve();
      })
      window.addEventListener('resize', onWindowResize, false);
    });

  }

  public makeProjectThumbnail(fileName) {
    return new Promise((resolve) => {
      this._camera.aspect = 1;
      this._camera.updateProjectionMatrix();
      this._renderer.setSize(500, 500);
      this._renderer.render(this._scene, this._camera);
      this._renderer.domElement.toBlob((blob) => {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        let file = new File([blob], `${fileName}.png`, {type:"image/png"});
        resolve(file)
      }, 'image/png', 1.0);
    })
  }
}
