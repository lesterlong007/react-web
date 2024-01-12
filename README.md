In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `dist` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

### Requirement background
We need to support for different lbu (just consider it as a corporation) custom requirements,so may will exist different versions for same feature, 
and different lbu has different permissions for feature and page. Even down to page content and component, need to customize requirements for different lbu.And published independently for different lub, just compile on-demand pages and codes which own that lbu.

### Why do we not use third frameworks (next.js) or cli (create-react-app)
We just depend some basic libraries or tools such as: react, jest, webpack. Due to third framework or cli is hard for us to expand and maintain, and can not satisfy our requirements(customize requirements for lbu, multiple versions, first screen loading optimization, compilation on-demand), to implement these points, we need to expand and write many scripts, loaders, plugins and some configuration files.

### Technical choice principle
universality, robustness, expansibility.

### Integrated library
Have integrated some basic libraries, such as: react-router, state manager (context), eslint, typescript, jest(unit test), postcss(transfer px to rem), lint-staged, prettier, an so on.

### Implemented functionality
Route lazy loading, generate routes automatically, css module, deploy individually for lbu, first screen loading optimization, built-in build optimization, service side rendering, encapsulate Fetch and some basic functions.

###  Need to conform to the rules when develop
Appointment is over than configuration.
One entire page must contain index.tsx and page.js files.
One feature must contain feature.js configuration file. 

### Customized for lbu
We can customize requirements for different lbu, according to four dimensions.(All of these points will apply in compilation stage, compile on-demand)
#### first: multiple versions for features
For example: if there is certain feature names 'feature-one', 'feature-one' is applied in many lbus, when one if lbus have many changes for this feature, so we need to customize for this lbu. In order to do not affect current feature for other lbus.If you need both of these versions exist in parallel, you should create a new folder names 'feature-one-alpha-1', alpha-1 is the version number. If you just need one of these versions exists,
you should create a new folder names 'feature-one-beta-1'.Of course, you can configure permissions in 'feature.js' for every feature. (we could discuss the version name)

#### second: config permission for pages 
You could configure the permissions in 'page.js' for every page, mean this page is opened for which lbus.

#### third: name with lbu extension in file name
If you want to customize requirements for certain lbu in some file (component), just like if there is a component file names 'content.tsx', you need to 
customize it for MY, because it is so different, then you can create a new file, names 'content.my.tsx', in compilation process, we will use this file's content replace previous file's content.

#### fourth: function configuration for feature or page 
If just exist some minor differences between different lbu requirements, you just need to configure them in a configuration file under feature or page.

### Module dependency graph
As the project grows, may will exist many feature versions and pages. Probably want to know which pages or files apply in current lbu, so you just need to run this command 'node ./scripts/module.analyzer.js', will generate a module dependency graph, to show you which files(pages, components) apply in 
current lbu.