// Catch application/dependency load failures without exposing a second UI.
try{await import('./app.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717');}
catch(error){
 globalThis.kurumiPixelBoot?.fail();
 console.error('Game startup failed',error);
}
