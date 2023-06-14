# Card Sorting Task

* Card sorting task react app for psychology research
* Based on the [Wisconsin Card Sorting Task (WCST)](https://en.wikipedia.org/wiki/Wisconsin_Card_Sorting_Test)

# Deployment

* Autodeploys to Netlify on push to `main` branch
* https://cardmatchingtask.netlify.app/

# Running the app locally

## Prerequisites
Before getting started, you need to install a few necessary tools.

### Node.js and NPM (Node Package Manager)

Firstly, we need to install Node.js, a runtime environment that lets us run JavaScript outside the browser. NPM (Node Package Manager), a package manager for Node.js, is included by default when you install Node.js.

1. Visit the [official Node.js website](https://nodejs.org/en/).
2. Download the LTS (Long Term Support) version. It's recommended for most users and is reliable for production use.
3. Open the downloaded file and follow the installation instructions.

### Yarn

After installing Node.js and NPM, we install Yarn, which is another package manager. It helps us to manage the packages (code libraries) that our project needs.

Open your computer's command line interface (Terminal on MacOS, Command Prompt on Windows).

Type in the following command and hit Enter:

```shell
npm install --global yarn
```
This command installs Yarn globally on your machine.

## Running the app
Now, let's get to building and running the React app.

Open your command line interface.
Navigate to the directory of your this repository. If you're not sure how to do this, type `cd [path to this directory]` and hit Enter. 

For example, if you cloned this repository on your Desktop, the command would look like this:

* On MacOS: `cd /Users/[Your Username]/Desktop/cardtask`
* On Windows: `cd C:\Users\[Your Username]\Desktop\cardtask`

Now, type the following command and hit Enter to install the necessary packages for your app:
```shell
yarn install
```

Once the previous command finishes, run the following command to start your app:
```shell
yarn start
```

The app will take a few moments to start. When it's ready, it will typically open automatically in your default web browser. If it doesn't, open your browser and navigate to http://localhost:3000.