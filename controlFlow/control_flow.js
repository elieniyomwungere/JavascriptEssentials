// Control Flow and Conditional statement

let userRole =  "admin";
let accessLevel ;

let isLoggedIn = true;
let userMessage ;
// else if statement
if(userRole === "admin"){
    accessLevel = "Full access granted!";
}else if(userRole === "manager"){
    accessLevel = "Limited access granted!";
}else{
    accessLevel = "No access granted!";
}
// nested else if statement

if(isLoggedIn){
    if(userRole === "admin"){
        userMessage = "Welcome , Admin !"
    }else{
        userMessage = "Welcome , User!"
    }
}else{
    userMessage = "Please log in to access the system."
}

//switch statement 

let userType = "subscriber";
let userCategory ;

switch(userType){
    case "admin":
        userCategory = "Administrator";
        break;
    case "manager":
        userCategory = "manager";
        break;
    case "subscriber":
        userCategory = "Subscriber";
        break;
    default:
        userCategory = "Unknown";
}

//use: ternary operator for isAuthenticated and authenticationStatus

let isAuthenticated = true;

let authenticationStatus = isAuthenticated ? "Authentificated" : "Not authentificated";

console.log("Access Level :", accessLevel);
console.log("User Message: ",userMessage);
console.log("User Category: ", userCategory);
console.log("Authentification Status: ", authenticationStatus);