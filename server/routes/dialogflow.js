const express = require('express');
const router = express.Router();
const structjson = require('./structjson.js');
const dialogflow = require('@google-cloud/dialogflow').v2;
const uuid = require('uuid');

const config = require('../config/keys');

const projectId = config.googleProjectID
const sessionId = config.dialogFlowSessionID
const languageCode = config.dialogFLowSessionLanguageCode


// Create a new session
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

// line reguarding TTS
const fs = require('fs');
const util = require('util');
const outputFile1 = './client/src/Chatbot/Event.wav'
const outputFile2 = './client/src/Chatbot/Text.wav'



/*async function detectIntentwithTTSResponse(req, res) {
    // The audio query request
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: req.body.text,
          languageCode: languageCode,
        },
      },
      outputAudioConfig: {
        audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
      },
    };
    sessionClient.detectIntent(request).then(responses => {
      console.log('Detected intent:');
      const audioFile = responses[0].outputAudio;
      util.promisify(fs.writeFile)(outputFile, audioFile, 'binary');
      console.log(`Audio content written to file: ${outputFile}`);
    });
  }
detectIntentwithTTSResponse();
*/
//My Version TTS
router.post('/eventQuery', async (req, res) => {
    const request = {
        session : sessionPath,
        queryInput: {
            event: {
              name: req.body.event,
              languageCode: languageCode,
            },
        },
        outputAudioConfig: {
            audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
        }
    };
    
    //My
    const responses = await sessionClient.detectIntent(request).then(responses => {
        console.log('Detected intent:');
        const result = responses[0].queryResult;
        const audioFile1 = responses[0].outputAudio;
        util.promisify(fs.writeFile)(outputFile1, audioFile1, 'binary');
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        console.log(`Audio content written to file: ${outputFile1}`);

        res.send(result)
    })
})
// We will make two routes 


// Text Query Route

router.post('/textQuery', async (req, res) => {
    //We need to send some information that comes from the client to Dialogflow API 
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: req.body.text,
                // The language used by the client (en-US)
                languageCode: languageCode,
            },
        },
        outputAudioConfig: {
            audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
        }
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request).then(responses => {
    console.log('Detected intent');
    const result = responses[0].queryResult;
    const audioFile2 = responses[0].outputAudio;
    console.log(`  Query: ${result.queryText}`);
    util.promisify(fs.writeFile)(outputFile2, audioFile2, 'binary');
    console.log(`  Response: ${result.fulfillmentText}`);
    console.log(`Audio content written to file: ${outputFile2}`);

    res.send(result)
    })
})



//Event Query Route

router.post('/eventQuery', async (req, res) => {
    //We need to send some information that comes from the client to Dialogflow API 
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            event: {
                // The query to send to the dialogflow agent
                name: req.body.event,
                // The language used by the client (en-US)
                languageCode: languageCode,
            },
        },
    };

    // Send request and log result
    const responses = await detectIntentwithTTSResponse();
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    
    res.send(result)
})









/*async function detectIntentwithTTSResponseEvent(req, res) {
    // The audio query request
    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          name: req.body.event,
          languageCode: languageCode,
        },
      },
      outputAudioConfig: {
        audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
      },
    };
    //detectIntent하면서 Audio출력
    sessionClient.detectIntent(request).then(responses => {
      console.log('Detected intent:');
      const result = responses[0].queryResult;
      const audioFile = responses[0].outputAudio;
      util.promisify(fs.writeFile)(outputFile1, audioFile, 'binary');
      console.log(`Audio content written to file: ${outputFile1}`);
      console.log(`  Response: ${result.fulfillmentText}`);
      console.log(`Audio content written to file: ${outputFile1}`);
    //화면에 Text표시
        try{
          let content = result.fulfillmentMessages;

        let conversation = {
            who: 'bot',
            content: content
        }
        dispatch(saveMessage(conversation))  
        }
        catch (error) {
            let conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "Error in Eventresponse, please resolve problem"
                    }
                }
            }
            dispatch(saveMessage(conversation))
        }    
        });
    }

    async function detectIntentwithTTSResponseText(req, res) {
        // The audio query request
        const request = {
          session: sessionPath,
          queryInput: {
            text: {
              text: req.body.text,
              languageCode: languageCode,
            },
          },
          outputAudioConfig: {
            audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
          },
        };
        //detectIntent하면서 Audio출력
        sessionClient.detectIntent(request).then(responses => {
          console.log('Detected intent:');
          const result = responses[0].queryResult;
          const audioFile = responses[0].outputAudio;
          util.promisify(fs.writeFile)(outputFile2, audioFile, 'binary');
          console.log(`Audio content written to file: ${outputFile2}`);
          console.log(`  Response: ${result.fulfillmentText}`);
          console.log(`Audio content written to file: ${outputFile2}`);
        //화면에 Text표시
            try{
              let content = result.fulfillmentMessages;
    
            let conversation = {
                who: 'bot',
                content: content
            }
            dispatch(saveMessage(conversation))  
            }
            catch (error) {
                let conversation = {
                    who: 'bot',
                    content: {
                        text: {
                            text: "Error in Textresponse, please resolve problem"
                        }
                    }
                }
                dispatch(saveMessage(conversation))
            }    
            });
        }
    */

module.exports = router