'use strict';

/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to PoffinDex. ' +
        'You can ask for types of berries, for example, you could say, sour berries.  Go ahead.';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'You can ask for a type of berry by saying, bitter berries.  ';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thanks for using PoffinDex. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function getBerriesByFlavor(intent, session, callback) {
    const cardTitle = intent.name;
    const flavorSlot = intent.slots.flavor;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = '';

    var flavor = flavorSlot.value;
    var flavorInfo = { 
        "bitter": {
            "category": "smart",
            "berries": ["rawst", "lum", "nanab", "aguav", "haban", "jaboca"]
        },
        "spicy": {
            "category": "cool",
            "berries": ["cheri", "leppa", "figy", "pinap", "tanga", "enigma"]
        },
        "sweet": {
            "category": "cute",
            "berries": ["pecha", "persim", "mago", "bluk", "kasib", "custap"]
        },
        "dry": {
            "category": "beauty",
            "berries": ["chesto", "oran", "wiki", "pamtre", "charti", "micle"]
        },
        "sour": {
            "category": "tough",
            "berries": ["aspear", "sitrus", "iapapa", "wepear", "colbur", "rowap"]
        }
     };

    if (flavorInfo[flavor]) {

        var berries = "";
        for (var i = 0; i < 6; i++) { 
            if (i != 5) { 
                berries += flavorInfo[flavor]["berries"][i] + ", "; 
            } else { 
                berries += "and " + flavorInfo[flavor]["berries"][i]; 
            } 
        }               

        speechOutput = `Here are the berries that are ${flavor} flavor.  ${berries}.`
        shouldEndSession = true;
    } else {
        speechOutput = "Hm, I couldn't find the flavor you asked for. Please try again.";
        repromptText = "I'm not sure what flavor you're asking for. You can ask for a different " +
            'flavor by saying, for example, what berries are sour flavor.';
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getBerriesByCategory(intent, session, callback) {
    const cardTitle = intent.name;
    const categorySlot = intent.slots.category;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = '';

    var category = categorySlot.value;
    var categoryInfo = { 
        "smartness": {
            "flavor": "bitter",
            "berries": ["rawst", "lum", "nanab", "aguav", "haban", "jaboca"]    
        },
        "coolness": {
            "flavor": "spicy",
            "berries": ["cheri", "leppa", "figy", "pinap", "tanga", "enigma"]
        },
        "cuteness": {
            "flavor": "sweet",
            "berries": ["pecha", "persim", "mago", "bluk", "kasib", "custap"]
        },
        "beauty": {
            "flavor": "dry",
            "berries": ["chesto", "oran", "wiki", "pamtre", "charti", "micle"]
        },
        "toughness": {
            "flavor": "sour",
            "berries": ["aspear", "sitrus", "iapapa", "wepear", "colbur", "rowap"]
        }
    };   

    if (categoryInfo[category]) {

        var berries = "";
        for (var i = 0; i < 6; i++) { 
            if (i != 5) { 
                berries += categoryInfo[category]["berries"][i] + ", "; 
            } else { 
                berries += "and " + categoryInfo[category]["berries"][i]; 
            } 
        }               

        speechOutput = `Here are the berries that support ${category}.  ${berries}.`;
        shouldEndSession = true; 
    } else {
        speechOutput = "Hm, I couldn't find the category you asked for. Please try again.";
        repromptText = "I'm not sure what category you're asking for. You can ask for a different " +
            'category by saying, for example, which berries support toughness.';
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}


// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'GetBerriesByFlavorIntent') {
        getBerriesByFlavor(intent, session, callback);
    } else if (intentName === 'GetBerriesByCategoryIntent') {
        getBerriesByCategory(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);


        if (event.session.application.applicationId !== 'amzn1.ask.skill.7120dd31-5d17-4e6f-821e-43e17783ea7e') {
             callback('Invalid Application ID');
        }
        

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};