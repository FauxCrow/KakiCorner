# Tech Stack

This project uses react + javascript to run the app. 

Possibly incorporating firebase as our database later?

**NOTE: Add on here if any other libraries are added.**

# Development Guide

### Folder Navigation

As a rule of thumb, this is how the project is organised:

1. */public*: Media that is utilised throughout the app, such as icons or images
2. */src/components*: Contains reusable components such as buttons, navigation bars, etc. Best place to look to see what components everyone else is using already, for standardisation purposes.
3. */src/page*: Contains unique app pages, such as messages or profile pages. Each page most likely will be using the components created above.

But no one's really checking the code so go ham i guess :sob:

### Live Deployment

Upon pushing to main, project is automatically built to: https://FauxCrow.github.io/KakiCorner. 

However, for the sake of error handling, please push to your own respective branches first, then check for any merge conflicts before pushing to main. If you're worried about merge conflicts, just push to a new branch, ping Faus and she'll help you merge to main :D

### Local Testing

For testing within your own local environment in development mode, use:

``` 
cd kaki-corner
npm start 
```

To quit testing, use:

```
^C 
``` 