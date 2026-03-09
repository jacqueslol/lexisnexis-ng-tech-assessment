# LexisnexisNgTechAssessment

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.0.

## Install dependencies

Before trying to run anything, first install dependencies. Run this in the root of the project, and also in the `_mfe_demo/mfe-host-shell` directory for the MFE demo.

```bash
npm i
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

This will run the Cypress GUI and show all available E2E tests.

## Running MFE demo (\_mfe_demo/mfe-host-shell)

1. To run the MFE demo, make sure `npm i` has been run in the root and in `_mfe_demo/mfe-host-shell` so dependencies are installed first.

2. After this, run a development server for both projects by running `ng serve` in the root and in the `_mfe_demo/mfe-host-shell` directory.

3. The MFE Demo will be hosted at http://localhost:4201/. Navigate here to see the demo. The demo will show the following:
   3.1. A box in the top left with a control from the MFE host shell that changes what product data is sent into the product-details remote component to be rendered.
   3.2. Box in the top right that shows the product-details remote component. The products shown here can be changed from [3.1].
   3.3. Box at the bottom showing the catalog remote component. I did not add a lot of external controls to this, such as dealing with what happens when "View" is clicked on a product, but wanted to include this to show that the catalog component is MFE ready.
