export function isObjectEmpty(input) {
  if (!input) return false;
  
  if (Object.keys(input).length === 0 && input.constructor === Object) { 
    return true;
  }
  return false;
} 

export function secondsToMinutesAndSeconds(secondsInput) {
  var minutes = Math.floor(secondsInput / 60);
  var seconds = (secondsInput % 60).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}