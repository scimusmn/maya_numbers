# Maya Numbers

## Main Message
The Maya developed a mathematical system that allowed them to denote and calculate very large numbers. Can you match numbers with the corresponding glyphs?

## Dev setup 
If you're making code changes, you can use Grunt to create new builds.

#### Install [Homebrew](http://mxcl.github.io/homebrew/)

    $ ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"

#### Use Homebrew to install Node.js and NPM

    $ brew install node
    $ curl http://npmjs.org/install.sh | sh
    $ export NODE_PATH="/usr/local/lib/node"
    $ export PATH="/usr/local/share/npm/bin:$PATH"

Put those last two export commands in your bash or shell profile if you want them to work all the time.

#### Install [Grunt](http://http://gruntjs.com/getting-started)
Grunt is a task runner we use here to minify and concatenate JavaScript and CSS files after making any code changes. It can optionally be used here to optimize images.

Uninstall any previous versions of Grunt and then install the Grunt command line interface.

    $ npm uninstall -g grunt
    $ npm install -g grunt-cli

Note: Grunt 0.4.x requires Node.js version >= 0.8.0.

### Create a new build 
If you change any CSS, JavaScript, or images, you should create a new build using Grunt. 

To minify and concatenate CSS and JavaScript files, run `grunt`.

To optimize images, run `grunt smushit`.

## Install
+ Copy the build and assets directories into a folder on the exhibit PC's Desktop. 
+ Install [Stele](https://github.com/scimusmn/stele) and configure kiosk options. 
