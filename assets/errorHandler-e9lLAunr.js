var d=Object.defineProperty;var m=(t,e,r)=>e in t?d(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var u=(t,e,r)=>m(t,typeof e!="symbol"?e+"":e,r);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function r(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=r(a);fetch(a.href,i)}})();class y{constructor(e={}){u(this,"config");this.config={baseDelay:e.baseDelay||300,errorRate:e.errorRate||.05,persistToLocalStorage:e.persistToLocalStorage||!0,storageKey:e.storageKey||"expert_review_data",verboseLogging:e.verboseLogging||!1},this.initializeStorage()}initializeStorage(){this.config.persistToLocalStorage&&(localStorage.getItem(this.config.storageKey)||localStorage.setItem(this.config.storageKey,JSON.stringify({})))}saveRowReview(e,r){return new Promise((s,a)=>{const i={...r,timestamp:new Date().toISOString()},o=this.config.baseDelay+Math.random()*200;setTimeout(()=>{if(Math.random()<this.config.errorRate){this.config.verboseLogging&&console.error("Mock API: Simulated error saving row",e),a({status:this._getRandomErrorCode(),message:"Error saving review data",rowId:e});return}if(this.config.persistToLocalStorage)try{const n=localStorage.getItem(this.config.storageKey),l=n?JSON.parse(n):{};l[e]=i,localStorage.setItem(this.config.storageKey,JSON.stringify(l))}catch(n){console.error("Failed to save to localStorage:",n)}this.config.verboseLogging&&console.log(`Mock API: Successfully saved row ${e}`,i),s({status:200,message:"Review data saved successfully",rowId:e,timestamp:i.timestamp})},o)})}getAllReviewData(){return new Promise(e=>{const r=this.config.baseDelay+Math.random()*100;setTimeout(()=>{if(this.config.persistToLocalStorage)try{const s=localStorage.getItem(this.config.storageKey),a=JSON.parse(s||"{}")||{};e({status:200,data:a})}catch(s){e({status:500,message:"Error retrieving data from storage",error:s instanceof Error?s.message:"Unknown error"})}else e({status:200,data:{}})},r)})}clearAllData(){return new Promise(e=>{const r=this.config.baseDelay;setTimeout(()=>{this.config.persistToLocalStorage&&localStorage.setItem(this.config.storageKey,JSON.stringify({})),e({status:200,message:"All review data cleared"})},r)})}_getRandomErrorCode(){const e=[400,403,408,429,500,502,503,504],r=Math.floor(Math.random()*e.length);return e[r]}}async function c(t){try{const e=await fetch(t);if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);return await e.json()}catch(e){throw console.error("Error fetching observations:",e),e}}const p=new y({errorRate:.15,verboseLogging:!0}),v={getObservations:(t,e)=>c(`./mock/observations.json?y=${t}&c=${e}`),getAvailableYears:()=>c("./mock/years.json"),getAvailableCategories:t=>c(`./mock/categories.json?y=${t}`),getResultsByYear:t=>c(`./mock/results.json?y=${t}`),saveExpertReview:(t,e)=>p.saveRowReview(t,e)};function h(t,e){const r=new URL(window.location.href);r.searchParams.set(t,e),window.history.pushState({},"",r)}function w(t){return new URLSearchParams(window.location.search).get(t)}const g=["Bandykite dar kartą vėliau.","Prarastas ryšys su serveriu. Kai kurie duomenys gali būti nepasiekiami.","Nepavyko gauti naujausių duomenų. Patikrinkite savo ryšį ir bandykite dar kartą.","Įvyko netikėta klaida. Mes jau ja rūpinamės!","Internetiniai vėjai šiandien šiek tiek pašėlę. Kai kurių duomenų gali trūkti.","Gamta kantri, bet internetas kartais ne. Pabandykite atnaujinti puslapį arba prisijungti vėliau.","Mūsų serveris šiuo metu ilsisi, bet netrukus grįš į darbą!","Atrodo, kad pradingome rūke... Bandykite dar kartą vėliau!","Ryšys su gamta tvirtas, bet internetas šį kartą silpnesnis. Bandykite dar kartą.","Duomenys nepasiekė mūsų lizdo. Patikrinkite savo ryšį ir pabandykite vėl!","Mūsų elektroniniai miškai šiuo metu patiria audrą. Grįžkite šiek tiek vėliau!","Kartais net ir technologijos reikalauja akimirkos poilsio. Bandykite dar kartą vėliau!","Žiogas perkirpo interneto laidą... Mėginame jį pataisyti!","Mūsų duomenų upė šiuo metu išdžiūvo. Bandome ją vėl pripildyti!","Atrodo, kad interneto paukščiai pasiklydo. Bandykite dar kartą vėliau.","Ryšys su serveriu nutrūko kaip nukritęs rudeninis lapas. Bandome jį pakelti!","Mūsų virtualus avilys patyrė gedimą. Bitutės jau taiso situaciją!","Žvaigždės danguje ryškios, bet mūsų serveris šiuo metu blyškus. Pabandykite vėliau!","Gamtos garsai pasiekiami, bet interneto bangos šiuo metu silpnos. Bandykite dar kartą!","Mūsų tinklas užmigo po žvaigždėtu dangumi... Bandome jį pažadinti!"];function f(){const t=Math.floor(Math.random()*g.length);return`Oi! Kažkas nepavyko. ${g[t]}`}function b(){const t=document.getElementById("alert-error-wrapper"),e=document.getElementById("loader-wrapper");e==null||e.classList.add("hide"),document.getElementById("error-text").innerText=f(),t.classList.remove("hide")}function S(){document.getElementById("alert-error-wrapper").classList.add("hide")}export{v as a,b as d,w as g,S as h,h as u};
