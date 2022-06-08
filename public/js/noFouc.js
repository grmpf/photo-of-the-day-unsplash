// Based on https://github.com/donavon/use-dark-mode/blob/develop/noflash.js.txt
// TODO: test https://www.npmjs.com/package/next-themes

(function () {
    // Change to your needs
    const storageKey = 'darkMode';
    const classNameDark = 'dark';

	//document.documentElement.style.setProperty("border", '20px solid green'); // for debugging
	//document.documentElement.style.setProperty("background", 'steelblue'); // for debugging

    function setClassOnHtml(darkMode) {
        if(darkMode) {
            document.documentElement.classList.add(classNameDark)
        } else {
            document.documentElement.classList.remove(classNameDark)
        }
    }

    const preferDarkQuery = '(prefers-color-scheme: dark)';
    const mql = window.matchMedia(preferDarkQuery);
    const supportsColorSchemeQuery = mql.media === preferDarkQuery;
    let localStorageTheme = null;
    try {
        localStorageTheme = localStorage.getItem(storageKey);
    } catch (err) {}
    let localStorageExists = localStorageTheme !== null;
    if (localStorageExists) {
        localStorageTheme = JSON.parse(localStorageTheme);
    }

    // Determine the source of truth
    if (localStorageExists) {
        // source of truth from localStorage
        setClassOnHtml(localStorageTheme);
    } else if (supportsColorSchemeQuery) {
        // source of truth from system
        setClassOnHtml(localStorageTheme);
        localStorage.setItem(storageKey, mql.matches);
    } else {
        // source of truth from document.documentElement
        const isDarkMode = document.documentElement.classList.contains(classNameDark);
        localStorage.setItem(storageKey, JSON.stringify(isDarkMode));
    }

    //alert('noFouc.js - done'); // for debugging
})();
