const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const LoginContainer = document.getElementById('LoginContainer');

signUpButton.addEventListener('click', () => {
	LoginContainer.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	LoginContainer.classList.remove("right-panel-active");
});