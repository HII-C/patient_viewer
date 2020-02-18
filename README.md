# Patient Viewer

Front-end project for context-driven clinical transactions.

## Preparing the Application

This is an [AngularJS 2](https://angular.io) project using `grunt` as the build system, [pug](https://pugjs.org/api/getting-started.html) for HTML templates, [SASS](http://sass-lang.com) for CSS and [Bootstrap](http://getbootstrap.com/) for layout. `npm` is the package manager. 

Assuming you already have node installed via `brew install node` or similar, begin by running the following commands in the terminal:
	
	git clone https://github.com/HII-C/patient_viewer.git
	cd patient_viewer
	npm install -g grunt typings
	npm install # to install project development dependencies
	typings install # to install TypeScript declarations

If you do not have `npm` installed and `brew install node` does not work as expected, you may need to [follow the instructions here](https://brew.sh/) to install the `brew` package manager.

You may need to downgrade `npm` and `node` to earlier versions for the setup to work. The setup was tested specifically for `node v7.10.1` and `npm v4.2.0`. You may download `npm v6.4.0` (which works as well) [here](https://nodejs.org/download/release/v6.4.0/)

## Development Guidelines
### Do's: 
- Prefer to use `let` rather than `var` for declaring variables. The scoping for variables declared with `var` is unintuitive and can result in strange bugs.
- Prefer to create models (such as `Encounter`) rather than dealing with JSON directly. By doing so, we can take advantage of Typescript's type checking and code completion.

### Dont's:
- Avoid using libraries like jQuery. Also avoid using any other approach to accessing the DOM directly (ie, `document.getElementById(..)`).
- Avoid leaving `console.log(..)` statements in the code when pushing to the repository. You can use them while developing locally but it can cause clutter in the repository.
- Write a brief comment above each component and method that you write giving a brief overview of the functionality. If some code is particularly complex, place comments within the body of the method too.
- Avoid writing components that are very similar to one another. Instead, create a generic component that supports all use cases through an interface (examples are `contextMenu.component.ts` and `hoverBox.component.ts`).

## Running the Application
To launch in development mode, run the following terminal command from the `patient_viewer` folder:

	grunt --force # to serve the project and automatically recompile on file changes

Then, do the following:
- Visit [HSPC Sandbox](https://sandbox.hspconsortium.org/), select the "HII-C" sandbox, choose the "Apps" option from the left menu, click on the "HII-C Confidential" app, and then click "Launch" on the right.
- Select the patient `Adams, Daniel X` in the popup. This should open the Patient Viewer application.
- Once you are done running Patient Viewer, make sure to terminate the `grunt --force` command in the terminal.

## Building for Production (Tech Team Only)

First, build:

	grunt clean # to remove all existing compiled files
	grunt build # to build your local copy with any local changes

Then, assuming you've already familiar with [Docker](https://www.docker.com) awesomeness and have it installed, plop the build into a wicked-fast [nginx](http://nginx.org) web server container using the including Dockerfile with:

	docker build -t p3000/healthcreek-ui:latest . # though you probably want your own repo and tag strings :)

## Production Deployment (Tech Team Only)

Extremely easy in your existing Dockerized hosting environment. Just:

	docker run -d -p 9000:80 --restart unless-stopped p3000/healthcreek-ui:latest # or any official tag

And you're done. No environment variables or further configuration are needed. Jedi's may use your existing Kubernetes, Open Shift etc installations as you see fit. :)


# License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
