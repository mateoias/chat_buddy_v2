import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export const createSpeechConfig = (voiceName = 'en-US-JennyNeural') => {
  const speechKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
  const speechRegion = import.meta.env.VITE_AZURE_SPEECH_REGION;
  
  if (!speechKey || !speechRegion) {
    throw new Error('Azure Speech credentials are missing. Check your .env file.');
  }
  
  console.log('Azure receiving voice name:', voiceName); // Debug line
  
  const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
  speechConfig.speechSynthesisVoiceName = voiceName; // Use the parameter, not hardcoded
  return speechConfig;
};

export const speakText = async (text, voiceName) => {
  const speechConfig = createSpeechConfig(voiceName); // Pass the voice parameter
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
  
  return new Promise((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      result => {
        synthesizer.close();
        resolve(result);
      },
      error => {
        synthesizer.close();
        reject(error);
      }
    );
  });
};