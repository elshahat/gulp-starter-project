# Gulp Starter Project
This gulp starter project will help you to start developing your own projects fast, easy and with less project structuring confusions.

### Running the project for the first time:
To run the project for the first time, execute the following command in your terminal while you are in the root directory of the project folder: **`npm install`**

### The list of features included in this starter project are as follows:
* **Compiling SCSS files into CSS:** You will have the option to output sourcemap file in development mode and also output minified production version. There is also an option to output a RTL version and with sourcemap file from the compiled CSS file in development mode. You will also have a detailed info if there are errors to fix them or enhancements needed to be done in your SCSS files.
* **Compiling .kit files into HTML:** A (\*_**.kit**_) file is just HTML with special comments. Kit adds two things to HTML: (_**imports**_) and (_**variables**_). Gulp compiles Kit files into HTML, so Kit is ideal for static sites. You can read more about "_kit_" files through [this link](https://codekitapp.com/help/kit/). 
* **Minifying and combining all JS files into one file:** This is useful to have less http requests and minifying the output file to save more files size. You can also compile the js files in custom order, you can do that by adding a number suffix to each file name inside the "/src/js/libs" folder with the order you want, e.g. (_01.jquery.min.js, 02.bootstrap.min.js, etc..._).
* **Minifying images:** It's easy now to add images to your project without caring about their sizes, Gulp will handle this task for you. In each time you run the project you will get details about the task results in your terminal.

***

### The project source folders structure:
* **src:**
    * **fonts:** _contains the fonts used in the project_
    * **images:** _contains the images used in the project_
    * **js:** _contains the "app.js" file for js custom code and "libs" folder for additional js libraries_
        * **libs:** _contains the jQuery or any additional js libraries to be used in the project_
    * **kit:** _contains the kit files of the project which contains the HTML code_
        * **components:** _contains the reusable HTML code in multiple pages_
        * **pages:** _contains the main structure of pages_
        * **shared:** _contains the shared HTML code across the project_ 
    * **scss:**
        * **components:** _contains the reusable SCSS code in multiple pages_
        * **libs:** _contains the additional CSS and SCSS libraries to be used in the project_
        * **pages:** _contains the main SCSS code for pages_
        * **shared:** _contains the the shared SCSS code across the project_
        * **utils:** _contains the fonts import code, SASS functions, SASS mixins and SASS variables_

***

### The list of commands to use with your project:
* **`gulp`**: _Get a production version of the project._
* **`gulpRTL`**: _Get a production version of the project with RTL support._
* **`gulpDev`**: _Run the development server with sourcemaps files._
* **`gulpDevRTL`**: _Run the development server with sourcemaps files and with RTL support._
* **`buildStyles`**: _Run the SCSS compilation process._
* **`buildStylesRTL`**: _Run the SCSS compilation process with RTL support._
* **`buildJS`**: _Run the JS combination and minification process._
* **`buildKitFiles`**: _Run the Kit files compilation process._
* **`copyFonts`**: _Copy the fonts from the src to the development or production folders._
* **`minifyImages`**: _Run the images minification process and copy them from the src to the development or production folders._
* **`watchStyleFiles`**: _Run the SCSS watch command to watch any files changes and compile them._
* **`watchStyleFilesRTL`**: _Run the SCSS watch command to watch any files changes and compile them with RTL support._
* **`watchJsFiles`**: _Run the JS watch command to watch any files changes and combine and minify them._
* **`watchKitFiles`**: _Run the kit files watch command to watch any files changes and compile them._
* **`watchFontsFiles`**: _Run the copy fonts watch command to copy them from the src to the development or production folders._
* **`watchImagesFiles`**: _Run the minify images watch command to minify images and copy them from the src to the development or production folders._