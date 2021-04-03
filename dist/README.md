# TablesConfigurator

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.0.

## Development server

- Make sure you have the latest version of Node and npm installed. Follow this link to install it: `https://www.npmjs.com/get-npm`
- Run `npm install` to install all packages
- Install Angular cli to use ng commands: `npm install -g @angular/cli`
- Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

- Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Exporting 3D Models

- The 3D file needs to be exported as a GLB file `https://www.khronos.org/gltf/`
- the units should be 1 unit = 1 cm
- There are sveral exporters that can export from FBX or OBJ to GLB
- If you're using 3D Max there is a special exporter that can be installed from here: `https://doc.babylonjs.com/resources/3dsmax_to_gltf`
- Each mesh should be properly named as the name will be used later on to configure the object
- Pivots should be placed in the right position according to the object type (tables should have the pivot on the center lower part, legs should have the pivot on the lower part, etc)

## Uploading the 3D Models

- Each 3D models should be uploaded to the ftp on `ftp.weboffice.de` in the folder `assets/models`
- Each 3D model should have a thumbnail of `256x256`. This thumbnail should be uploaded in the folder `assets/thumbnails`
- Remember the name of each mesh in the model as it will be used later on

## Adding new models in the DB

- Go to `http://phpmyadmin.tableconfigurator.weboffice.de/index.php`
- There are 2 tables where we need to configure the models: `Legs` and `Tables`

## Adding new Legs

- name - the name of the model
- UID - a unique ID of the object
- thumbnailPath - link to the thumbnail (`assets/thumbnails/thumbnail_name.jpg`)
- modelPath - link to the 3d model (`assets/models/legs/leg_name.glb`)
- price - the price
- defaultHeight - the overal height of the 3D model (needs to be extracted from the 3d file)
- defaultLength - the overal length of the 3D model (needs to be extracted from the 3d file)
- defaultWidth - the overal width of the 3D model (needs to be extracted from the 3d file)
- height - current height of the 3D model
- heightMax - max height of the 3D model
- heightMin - min height of the 3D model
- heightStep - increment step height of the 3D model
- length - current length of the 3D model
- lengthMax - max length of the 3D model
- lengthMin - min length of the 3D model
- lengthStep - increment step length of the 3D model
- width - current width of the 3D model
- widthMax - max width of the 3D model
- widthMin - min width of the 3D model
- widthStep - increment step width of the 3D model
- radius - if it's a circular type it represents the distance between legs
- radiusMax - max radius
- radiusMin - min radius
- xOffset - the default distance between x offset meshes
- xOffsetMax - the max distance between x offset meshes
- xOffsetMin - the mix distance between x offset meshes
- xOffsetStep - the step increment distance between x offset meshes
- yOffset - the default distance between y offset meshes
- yOffsetMax - the max distance between y offset meshes
- yOffsetMin - the mix distance between y offset meshes
- widthMeshes - this will accept comma separated values. Each value represent the name of the mesh that controls the width of the object
- lengthMeshes - this will accept comma separated values. Each value represent the name of the mesh that controls the length of the object
- xOffsetMeshes - this will accept comma separated values. Each value represent the name of the mesh that will be offseted on the x axis
- yOffsetMeshes - this will accept comma separated values. Each value represent the name of the mesh that will be offseted on the y axis

## Adding new Plates

- name - the name of the model
- UID - a unique ID of the object
- modelPath - link to the 3d model (`assets/models/plates/plate_name.glb`)
- thumbnailPath - link to the thumbnail (`assets/thumbnails/thumbnail_name.jpg`)
- pricePerVolume - the price for each cubic meter of the material
- edge - can be `fillet,chamfer,flat`
- edgeOptions - what edge options to show for the current model
- material - the default used material
- materialOptions - list with materials that can be used on this object
- thickness - current thickness
- thicknessOptions - this will accept comma separated values. Each available thickness should be listed here
- defaultDiameter - if it's a round plate this will be the diameter extracted from the 3d file
- defaultLength - the length extracted from the 3d file
- defaultThickness - the thickness extracted from the 3d file
- defaultWidth - the width extracted from the 3d file
- diameter - the current diameter value
- diameterMax - max diameter value
- diameterMin - min diameter value
- diameterStep - incremental step of diameter value
- length - the current length value
- lengthMax - max length value
- lengthMin - min length value
- lengthStep - incremental step of length value
- width - the current width value
- widthMax - max width value
- widthMin - min width value
- widthStep - incremental step of width value

## Adding new Materials

- Navigate to `https://threejs.org/editor/`
- In three editor got to File > Import and select file `materials.glb` form `\assets\materials\`
- On the top Right menu select Add > Plane
- Use the axis of the object to move it.
- In the right panel under Object change the name of the object to the name of the material you want. Please do not use special characters or spaces.
- Under Material change the name to the same name of the material.
- Adjust the material properties from this menu.
  - you can change color, opacity, metalness, roughness, and you can add maps for any available channel.
- When you finish setting up the material go to File > Export GLB and overwite `materials.glb`

## Adding a new material to an object as a possibility

- Navigate to `http://phpmyadmin.tableconfigurator.weboffice.de`
- Expand Materials and add new entry
- Use the name definde in the glb file here and add a path for the thumbnail

## Using the newly created material

- Expand Plates and then Columns.
- Select `materialOptions` and add the new material name to the list and Save
- Select Plates and then choose the plate that you want to use this material
- In the `materialOptions` make sure that all possibilities you want for this material are selected and Save
