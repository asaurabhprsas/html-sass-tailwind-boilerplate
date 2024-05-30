# Documentation for Sass, EJS, Tailwind, Gulp Boilerplate

This boilerplate provides a starting point for building static websites using Sass, EJS, TailwindCSS, and Gulp. It includes a Gulpfile with tasks for compiling Sass, EJS, and copying assets, as well as a development server with live reloading.

## Userful Links

[EJS Documentation](https://ejs.co/#docs)


## Getting Started

To get started, clone this repository and install the dependencies:

```console
git clone https://github.com/username/sass-ejs-tailwind-gulp-boilerplate.git
cd sass-ejs-tailwind-gulp-boilerplate
npm install
```

## Usage

### Development

To start the development server, run:

```console
npm run dev
```

This will start the development server and open the website in your default browser. Any changes made to the source files will automatically reload the browser.

### Build

To build the production-ready files, run:

```console
npm run build
```

This will generate the optimized files in the public directory.

## Gulp Tasks

- **compileStyles**: Compiles Sass files to CSS, runs PostCSS plugins, and outputs the files to the public/assets/css directory.
- **compileHTML**: Compiles EJS templates to HTML, replaces asset paths, formats the code using Prettier, and outputs the files to the public directory.
- **copyAssets**: Copies all assets from the src/assets directory to the public/assets directory.
- **cleanPublic**: Deletes the public directory and creates a new public/assets directory.
- **build**: Runs the cleanPublic, compileStyles, compileHTML, and copyAssets tasks in parallel.
- **watch**: Runs the build task and starts the development server with live reloading.
- **serve**: Starts the development server with live reloading.

## File Structure

- **gulpfile.mjs**: Contains the Gulp tasks for compiling Sass, EJS, and copying assets.
- **prettier.config.js**: Configuration file for Prettier code formatter.
- **src/sass**: Directory for Sass files.
- **src/pages**: Directory for EJS templates.
- **src/assets**: Directory for assets such as images, fonts, and JavaScript files.
- **public**: Directory for compiled files. Don't ever make and save your changes here because it gets deleted on each build / in watch mode.

## Dependencies

- **gulp**: Task runner for automating the build process.
- **gulp-sass**: Compiles Sass files.
- **sass**: Sass compiler.
- **gulp-postcss**: Runs PostCSS plugins.
- **gulp-clean-css**: Minifies CSS files.
- **gulp-rename**: Renames files.
- **browser-sync**: Live-reloading development server.
- **gulp-ejs**: Compiles EJS templates.
- **gulp-prettier**: Formats code using Prettier.
- **fs/promises**: Provides Promise-based versions of the fs module functions.
- **path**: Provides utilities for working with file and directory paths.

## License

This project is licenced under [MIT License](./LICENCE).