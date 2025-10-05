(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}})();function s(){return`
    <div class="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 class="text-5xl font-bold mb-4">Welcome to Transcendence</h1>
      <p class="text-lg mb-6">The next generation Pong platform 🚀</p>
      <a href="/home" class="px-6 py-3 bg-white text-indigo-600 rounded-lg shadow hover:bg-gray-200 z-10 relative">
        Enter
      </a>
    </div>
  `}document.querySelector("#app").innerHTML=s();
