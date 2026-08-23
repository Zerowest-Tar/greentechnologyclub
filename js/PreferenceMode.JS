
username = window.sessionStorage.getItem('loggedInUser');
function getCookie(cname, username) {


    let name = cname + "_" + username + "=";
    let ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {

        let c = ca[i].trim();

        if (c.indexOf(name) == 0) {
            return c.substring(name.length);
        }
    }

    return "";
}


function changeTheme(theme) {

    if (theme == "dark") {
        document.body.style.backgroundColor = "rgb(6, 6, 6)";
    }  
    else { 
        document.body.style.backgroundColor = "rgb(33, 112, 102)";
    } 
}


let theme = getCookie("theme", username);

if (theme != "") {
    changeTheme(theme);
}