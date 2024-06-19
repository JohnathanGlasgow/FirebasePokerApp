# Project Name

**Very Fun Poker Game**

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Playing the game](#playing-the-game)
- [Testing](#testing)
- [Building](#building)
- [Deployment](#deployment)
- [Offline Use](#offline-use)
- [Created By](#created-by)

## Introduction

This is a project to create a progressive web app for a simple online Poker game with a React front end and a Firebase back end.
It is for the class ID730 Advanced App Dev at Otago Polytechnic.

## Installation

To install the project dependencies, run the following command:
    
    npm install

## Usage

To start the development server, run the following command:

    npm start

## Playing the game
Choose a login option. Anonymous users are given a random name.

Upon logging in, the Games dropdown will be open. Here you can create a new game or join an existing game.

If you are not currently in a game, you will be navigated to any game you create or join.

Once all the players have joined, the game will begin when any player presses the "Start Game" button.

There is a maximum of 5 players per game.

If it is your turn, select the cards you want to swap out and press the "Swap Cards" button, then press the "End Turn" button.

When all players have ended their turn, the game will end and the winner will be displayed.

You can then start a new game or join an existing game.

## Testing

To run the component tests, run the following command:
    
    npm test

To run an individual component test, use:
    
    npm test src/tests/components/<ComponentName>

To start the emulator and run the test suite for firestore rules, run the following command:
    
    npm run test:rules

## Building

To build the project, run the following command:
        
    npm build

## Deployment

To build and deploy the project on firebase, run the following command:
        
    npm run deploy

The app is currently deployed at [https://veryfunpokergame.web.app/](https://veryfunpokergame.web.app/)

## Offline Use
I have enabled the service worker and enabled local caching. However the app is still reliant on the deckofcardsapi.com API for card images and deck management. So unfortunately offline use is not available at this time.
    
## Created By

- [Johnathan Glasgow](https://github.com/JohnathanGlasgow)
    


