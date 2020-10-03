function getStylesheet()
{
    /*If it is between 10 am. and 7 pm. then use the light stylesheet.*/
    var currentTime = new Date().getHours();
    if ( 10 <= currentTime && currentTime < 19 ) {
        applyTheme('light_theme');
    }
    else {
        applyTheme('dark_theme');
    }
}

function applyTheme(theme) {
    document.write(`<link href="css/${theme}.css" type="text/css" rel="stylesheet" />`)
}

getStylesheet();
