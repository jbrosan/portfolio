// Runs at module load (earliest), before router resolves & head/title runs
if (typeof window !== "undefined" && window.location.hash === "#_=_") {
    history.replaceState(null, "", window.location.href.replace(/#_=_$/, ""));
}

export default defineNuxtPlugin(() => { });
