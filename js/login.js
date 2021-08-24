var firebaseConfig = {
    apiKey: "AIzaSyBGtxT88bQmh6nFkUowZrFI36mH0Y9ZJTc",
    authDomain: "proj-databank-01.firebaseapp.com",
    projectId: "proj-databank-01",
    storageBucket: "proj-databank-01.appspot.com",
    messagingSenderId: "429010991754",
    appId: "1:429010991754:web:68197f258dfd63eeb58b73",
    measurementId: "G-VBM7WD6BTF"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();


function validateEmail($email) {
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return emailReg.test($email);
}

function toggleSignIn() {
	// if (firebase.auth().currentUser) {
	// 	location.href = 'home.html';
	//
	// } else {
	var email = $('#email').val();
	var password = $('#password').val();
	if (!validateEmail(email)) {
		// $("#alert").html(
		// 	"<div class='alert alert-info alert-dismissable alert-style-1'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>×</button><i class='zmdi zmdi-info-outline'></i>Please enter an valid email address.</div>");
		alert_msg('E-mail inválido', heading='Atenção', icon = 'warning')
		console.log("E-mail inválido!");
		return;
	}
	if (password.length < 4) {

		// $("#alert").html(
		// 	"<div class='alert alert-info alert-dismissable alert-style-1'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>×</button><i class='zmdi zmdi-info-outline'></i>Please enter a password.</div>");
		alert_msg('Password inválido', heading='Atenção', icon = 'warning')
		console.log("Password Inválido");
		return;
	}

	if ($('#remember').is(":checked"))
	{
		var session_type = firebase.auth.Auth.Persistence.LOCAL;
	} else{

		var session_type = firebase.auth.Auth.Persistence.SESSION;
	}
	firebase.auth().setPersistence(session_type)
	  .then(() => {
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				if (errorCode === 'auth/wrong-password') {
					alert_msg('Password incorreto!');

				} else {

					alert_msg('Falha ao realizar o login!');
					console.log(errorMessage);
				}
				console.log(error);
				//document.getElementById('quickstart-sign-in').disabled = false;
			});
	  })
	  .catch((error) => {
		console.log(error);
	  });
	// }
}

function initApp() {
	// Listening for auth state changes.
	firebase.auth().onAuthStateChanged(function(user) {
		//document.getElementById('quickstart-verify-email').disabled = true;
		// console.log(user);
		if (user) {
			alert_msg('Sucesso ao realizar login!',heading='Sucesso!',icon = 'success');
			// // User is signed in.
			// var displayName = user.displayName;
			// var email = user.email;
			// var emailVerified = user.emailVerified;
			// var photoURL = user.photoURL;
			// var isAnonymous = user.isAnonymous;
			// var uid = user.uid;
			// var providerData = user.providerData;
			window.location = 'home.html'
			//document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
			//document.getElementById('quickstart-sign-in').textContent = 'Sign out';
			//document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
			//if (!emailVerified) {
			//	document.getElementById('quickstart-verify-email').disabled = false;
			//}
		} // else {
			// User is signed out.
			//document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
			//document.getElementById('quickstart-sign-in').textContent = 'Sign in';
			//document.getElementById('quickstart-account-details').textContent = 'null';

		//}
		//document.getElementById('quickstart-sign-in').disabled = false;
	});
	document.getElementById('login').addEventListener('click', toggleSignIn, false);
	//document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
	//document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
	//document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
}

function alert_msg(msg,heading='Error!',icon='error'){

	if (icon == 'error'){
		var loadbg = '#fec107';
	} else if (icon == 'warning'){
		var loadbg = '#ff2a00';
	} else if (icon == 'info' ){
		var loadbg = '#fec107';
	} else {
		var loadbg = '#fec107'
	}
	// $.toast().reset('all');
	// $.toast({
    //     heading: heading,
    //     text: msg,
    //     position: 'top-right',
    //     loaderBg:loadbg,
    //     icon: icon,
    //     hideAfter: 3000,
    //     stack: 6
    // });

	console.log(msg);
}

window.onload = function() {
	// if (firebase.auth().currentUser) {
	// 	firebase.auth().signOut();
	// }
	initApp();
};