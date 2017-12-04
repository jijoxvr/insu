# [Kupukoo - P2P Insurance Web UI]

This is a new type of insurance where you and your friends, family, work colleagues, neighbours, members of your clubs etc are included in a social group and claims are paid from the money paid in by your social group. Any money that your social group does not spend on Claims is given back to you and the members of the group, after taking out the costs for providing the service and also secondary insurance, so you have peace of mind that your phone always covered.

## Links:

+ [Live Preview](https://test.kupukoo.com/index.html)
+ [Kupukoo - P2P Insurance Web UI]
+ [Angular docs] (https://angular.io/api)

## Quick start

Quick start options:

-[Download from SVN]
Please add SVN URL here.

## Terminal Commands

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0 and angular 4.x.

1. Install NodeJs from [NodeJs Official Page](https://nodejs.org/en).
2. Open Terminal
3. Go to your file project
4. Make sure you have installed [Angular CLI](https://github.com/angular/angular-cli) already. If not, please install.
5. Run in terminal: ```npm install```
6. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
7. For production build Run `ng build` (build files will be generated in dist folder)

## Adding new Dependencies

1. Use yarn or npm
2. yarn add <packagename> / npm install <packagename> --save


### What's included

Within the repo you'll find the following directories and files:

```
├── README.md
├── angular-cli.json
├── e2e
├── karma.conf.js
├── package.json (All dependencies are listed here)
├── protractor.conf.js
├── src
│   ├── app
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── app.config.ts (client side contands and configs)
│   │   ├── app.routing.ts (main router module restricted using AuthGaurd)
│   │   ├── layout
│   │   │   ├── layout.module.ts
│   │   │   ├── layout.routing.ts (inner routing)
│   │   │   ├── footer
│   │   │   │   ├── footer.component.css
│   │   │   │   ├── footer.component.html
│   │   │   │   ├── footer.component.spec.ts
│   │   │   │   └── footer.component.ts
│   │   │   ├── navbar
│   │   │   │   ├── navbar.component.css
│   │   │   │   ├── navbar.component.html
│   │   │   │   ├── navbar.component.spec.ts
│   │   │   │   └── navbar.component.ts
│   │   │   ├── layout-container (this holds footer, navbar and sidebar)
│   │   │   │   ├── layout-container.component.css
│   │   │   │   ├── layout-container.component.html
│   │   │   │   ├── layout-container.component.spec.ts
│   │   │   │   └── layout-container.component.ts
│   │   │   └── sidebar (menu and routerLink came under here)
│   │   │       ├── sidebar.component.css
│   │   │       ├── sidebar.component.html
│   │   │       ├── sidebar.component.spec.ts
│   │   │       └── sidebar.component.ts
│   │   ├── irene
│   │   │   ├── iren.module.ts
│   │   │   ├── assist-to-claim (new component based on backend workflow)
│   │   │   │   ├── assist-to-claim.component.css
│   │   │   │   ├── assist-to-claim.component.html
│   │   │   │   ├── assist-to-claim.component.spec.ts
│   │   │   │   └── assist-to-claim.component.ts
│   │   │   └── claim-with-irene (new component based on frontend config)
│   │   │       ├── claim-with-irene.component.css
│   │   │       ├── claim-with-irene.component.html
│   │   │       ├── claim-with-irene.component.spec.ts
│   │   │       └── claim-with-irene.component.ts
│   │   ├── dashboard (stats, policies and other components are placed here)
│   │   │   ├── dashboard.component.css
│   │   │   ├── dashboard.component.html
│   │   │   ├── dashboard.component.spec.ts
│   │   │   ├── dashboard.module.ts
│   │   │   └── dashboard.component.ts
│   │   ├── core
│   │   │   ├── app-config.service.ts
│   │   │   ├── app-provider.service.ts (to share app config from server)
│   │   │   └── user-service.service.ts (used to share userdata between components)
│   │   ├── login (using direct facebook sdk and firebase(supports multiple login))
│   │   │   ├── login.component.css
│   │   │   ├── login.component.html
│   │   │   ├── login.component.spec.ts
│   │   │   ├── login.gaurd.ts (router gaurd that make sure user is logged in)
│   │   │   └── login.component.ts
│   │   ├── claims
│   │   │   ├── claims.module.ts
│   │   │   └── group-claim-status (component to show claim status of user group
|   |   |       |                  TODO: Integrate with service once API is ready)
│   │   │       ├── group-claim-status.component.css
│   │   │       ├── group-claim-status.component.html
│   │   │       ├── group-claim-status.component.spec.ts
│   │   │       └── group-claim-status.component.ts (Current Usage: Dashboard)
│   │   ├── policies
│   │   │   ├── policies.module.ts
│   │   │   └── user-policies (component to show policies of user
|   |   |       |                  Integrated with service)
│   │   │       ├── user-policies.component.css
│   │   │       ├── user-policies.component.html
│   │   │       ├── user-policies.component.spec.ts
│   │   │       └── user-policies.component.ts (Current Usage: Dashboard)
│   │   ├── shared
│   │   │   ├── shared.module.ts
│   │   │   ├── ajax-api
│   │   │   │   ├── ajax.service.ts
│   │   │   │   ├── json-api.service.ts
│   │   │   │   ├── upload-file.service.ts
│   │   │   │   └── web-storage.service.ts (local/session storage)
│   │   │   ├── loader (common loader component)
│   │   │   ├── socket (used to establish socket connection)
│   │   │   │   ├── chat.service.ts
│   │   │   │   └── web-socket.service.ts
│   │   │   └── video-record (video recorder component)
│   │   │       ├── video-record.component.css
│   │   │       ├── video-record.component.html
│   │   │       ├── video-record.component.spec.ts
│   │   │       └── video-record.component.ts
│   │   └── user-profile (view/edit/upload-docs)
│   │       ├── user-profile.component.css
│   │       ├── user-profile.component.html
│   │       ├── user-profile.component.spec.ts
│   │       └── user-profile.component.ts
│   ├── assets
│   │   ├── css
│   │   ├── img
│   │   └── sass
│   │       ├── material-dashboard.scss
│   │       └── md
│   ├── environments
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.css
│   ├── test.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.spec.json
│   └── typings.d.ts
├── tsconfig.json
├── firebase.json (deployment configuration for firebase)
├── tslint.json
└── typings
```

### Configs

1. Facebook,Firebase and Google maps key and configurations are included in app.config.ts