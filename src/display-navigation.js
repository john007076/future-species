const DESTINATIONS=Object.freeze({openAirViews:'./air.html',openMarineViews:'./marine.html',openMainDisplay:'./'});
export function displayNavigationTarget(message){return typeof message?.type==='string'&&Object.hasOwn(DESTINATIONS,message.type)?DESTINATIONS[message.type]:null;}
