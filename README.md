# Configuration

## Environment variables
Add environment variables to a file with the name .env in the root of the repository.
Prepend the Vue environment variables with VUE_APP_. For example:
```
VUE_APP_DEVICES_URL=http://localhost:3002/api/devices
VUE_APP_MEASUREMENTS_URL=http://localhost:3003/api/measurements
```

Valid environment variables are:
 * VUE_APP_DEVICES_URL
 * VUE_APP_MEASUREMENTS_URL

## VUE config
In the vue.config.js file the configuration of the VUE app can be found.
Here you can configure the base url for the application. For example the
configuration below means you have to load the application with the following
url: https://<url>/grondwatermeten (when developing this is
http://localhost:8080/grondwatermeten). This is usefull when deploying the
application on an S3 bucket.

```
// vue.config.js
module.exports = {
  publicPath: 'grondwatermeten'
}
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# Develop and deploy

## Project setup
Before running the application for either development or production run the
following command in order to install the required packages:

```
npm install
```

### Development: Compiles and hot-reloads for development
When developing the following command can be used to run the application in
development mode (including hot reload):

```
npm run serve
```

### Production
When deploying the application to production the following commands should be
used.

```
npm install
npm run build
```

The build command will create a distribution in the 'dist' folder in the root of
this project. The contents of this folder should be served by a web application,
for example Nginx or Apache. Alternatively the contents can be served from an S3
bucket. See the corresponding documentation for configuring the webservers or S3.

### Lints and fixes files
```
npm run lint
```
