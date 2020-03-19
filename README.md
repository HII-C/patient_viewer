# Patient Viewer

[![Documentation](https://i.imgur.com/49Z2ZHF.png)](https://hii-c.github.io/patient_viewer/)

Front-end project for context-driven clinical transactions.

## Preparing the Application

This is an [Angular 7](https://angular.io) project using `grunt` as the build system, [SASS](http://sass-lang.com) for CSS, and [Bootstrap](http://getbootstrap.com/) for layout. `npm` is the package manager. 

Assuming you already have node installed via `brew install node` or similar, begin by running the following commands in the terminal:
	
	git clone https://github.com/HII-C/patient_viewer.git
	cd patient_viewer
	npm install -g grunt
	npm install # to install project development dependencies

If you do not have `npm` installed, do the following:
- __Mac__: `brew install node` in Terminal
- __Windows__: [Instructions](https://www.guru99.com/download-install-node-js.html)
- __Linux__: [Instructions](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/)

The project was tested specifically with node version `10.19.0`.

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
- Visit [HSPC Sandbox](https://sandbox.hspconsortium.org/), select the "HII-C" sandbox, choose the "Apps" option from the left menu, click on the "HII-C Confidential [USE THIS]" app, and then click "Launch". 
- Select the persona "John Smith", and patient `Adams, Daniel X` in the popup. This should open the Patient Viewer application.
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
