# Tech Stack

This project uses javascript, react + tailwind css to run the app. 

We're using json files as a database because i love wizard of oz and i'm a supabase HATER.

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
npm start OR npm run dev
```

To quit testing, use:

```
^C 
``` 

For desktop, you can simple open the link shown in the terminal. For mobile, you can use USB Debugging with Chrome to see it on your android phone:

1. Connect your mobile phone to your laptop using USB Cable.
2. Enable Developer Options (tap Build number 7 times in Settings) and turn on USB debugging.
3. Open chrome://inspect (or chrome://inspect/#devices) and check the Discover USB devices box. Accept the debugging prompt on your phone.
4. In chrome inspect, enable "Discover USB devices" and click on "Port Forwarding...". 
5. Using the same port number as your development mode server, fill in port number and IP address as "localhost:{port number}"
6. As long as your webapp is running in development mode, you should now be able to open that link on your mobile chrome using the "http://localhost:{port number}"!! 

### Notes from a sleep-deprived dev:

1. For accessibility: text size toggle is working , as long as you use tailwind class in your className ('text-sm' using xs, sm, base, lg, xl or 2xl)
2. For "login": currently stimulated using 'profile_id' in local storage: if we see the person's profile id saved, stay on home. Else, go to the survey pages.
3. For data storage, i'm using a content folder to store json files that are codependent: e.g. event participant = array of profile ids
4. For languages, can look into using google translate api so we don't have to translate words ourselves? But i a bit lazy today HAHAHA
