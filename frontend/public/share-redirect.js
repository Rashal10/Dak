const fallback = document.currentScript.dataset.fallback
location.replace('../' + (/^#\//.test(location.hash) ? location.hash : fallback))
