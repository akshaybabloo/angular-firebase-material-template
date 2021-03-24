# Angular template with Firebase and Material Component

This is a [Cookiecutter](https://github.com/cookiecutter/cookiecutter) template, I use a lot for projects that use [Google Cloud Platform](https://cloud.google.com/) and it has the following features:

> This project is based on Angular 11

1. Authentication (lazy loading module)
   1. Login (component)
   2. Register (component)
   3. Forgot password request (component)
2. Core
   1. A nav-bar component with side-nav on small screens
   2. 404 page (empty)
3. Shared
   1. Password validator for Forms
   2. SnackBar component
4. Angular material
5. Full support for Firebase (with Angularfire)

**Table of Contents**

- [Requirements](#requirements)
- [Usage](#usage)
- [Adding Firebase Configuration](#adding-firebase-configuration)

## Requirements

Before you start using the template make sure you have the following:

1. Firebase project setup done (example: gollahalli-rex)
2. Firebase CLI logged in
3. Cookiecutter CLI
4. A project name for Angular (example: rex-ui)
5. Node JS with NPM and Yarn installed

## Usage

Install Cookiecutter CLI, do the following and follow the instructions:

```
> cookiecutter https://github.com/akshaybabloo/angular-firebase-material-template
project_name [Project-name]: rex-ui
firebase_project_name [Firebase-project-name]: gollahalli-rex
```

> make sure you have `-` (hyphen) instead of space for project names, example `hello world` -> `hollow-world`.

Now `cd rex-ui` and do `yarn install`.

## Adding Firebase Configuration

Copy the firebase configuration settings and paste them in:

1. `<project-name>/src/environments/environment.prod.ts` - this will be your production configuration, lookout for `TODO` comment
2. `<project-name>/src/environments/environment.ts` - this will be your development configuration, lookout for `TODO` comment
