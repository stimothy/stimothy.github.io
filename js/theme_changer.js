function getStylesheet()
{
    var currentTime = new Date().getHours();
    /*If it is between 12 and 10 am. then use the dark stylesheet.*/
    if (0 <= currentTime && currentTime < 10) {
        document.write('<link href="css/dark_theme.css" type="text/css" rel="stylesheet" />');
    }
    /*If it is between 10 am. and 7 pm. then use the light stylesheet.*/
    if (10 <= currentTime && currentTime < 19) {
        document.write('<link href="css/light_theme.css" type="text/css" rel="stylesheet" />');
    }
    /*If it is between 7 pm. and 12 am. then use the dark stylesheet.*/
    if (19 <= currentTime && currentTime < 24) {
        document.write('<link href="css/dark_theme.css" type="text/css" rel="stylesheet" />');
    }
}

getStylesheet();