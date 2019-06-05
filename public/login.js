 async function checkIfLogin() {
     var password = document.getElementById("password").value;
     var userName = document.getElementById("login").value;

     if (password && userName && (password != null && password != undefined) && (userName != null && userName != undefined)) {
         var loginData = {
             "password": password,
             "user_name": userName
         }
         console.log(loginData)

         var options = {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(loginData)
         }

         const response = await fetch('/user', options)
         const successdata = await response.json();
         if (successdata.dataPresent) {
             window.location.href = "http://localhost:3000/chat";
         } else {
             document.getElementById("error").innerHTML = "The user name or password you entered is incorrect.";

             setTimeout(function() {
                 window.location.href = "http://localhost:3000/";
             }, 3000);
         }
     } else {
         document.getElementById("error").innerHTML = "Please Enter valid credentials";
     }
 }

 async function registerUser() {
     var regUserName = document.getElementById("regUserName").value;
     var regPassword = document.getElementById("regPassword").value;
     var regPlace = document.getElementById("regPlace").value;
     var regEmail = document.getElementById("regEmail").value;

     if (regUserName && regPassword && regPlace && regEmail &&(regUserName != null && regUserName != undefined) && (regPassword != null && regPassword != undefined)&&(regPlace != null && regPlace != undefined)&&(regEmail != null && regEmail != undefined)) {
         var registerData = {
             "password": regPassword,
             "user_name": regUserName,
             "place":regPlace,
             "email_address":regEmail
         }
         console.log(registerData)

         var options = {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(registerData)
         }

         const response = await fetch('/register', options)
         const successdata = await response.json();
         if (successdata.user) {            
             $('#RegModal').modal('hide');
         } else {
             document.getElementById("Regerror").innerHTML = "Something went wrong ..!";

             setTimeout(function() {
                 window.location.href = "http://localhost:3000/";
             }, 3000);
         }
     } else {
         document.getElementById("Regerror").innerHTML = "Please enter all the values";
     }
 }