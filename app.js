document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const welcomeMessage = document.getElementById('welcome-message');
  const colorsContainer = document.getElementById('colors-container');
  const logoutButton = document.getElementById('logout-button');

  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
        .then(response => response.json())
        .then(data => {
          if (data.token) {
            document.cookie = `token=${data.token}`;
            window.location.href = './home.html';
          } else {
            errorMessage.textContent = 'Login failed. Invalid credentials.';
          }
        })
        .catch(error => {
          console.error('Error:', error);
          errorMessage.textContent = 'An error occurred. Please try again.';
        });
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', function () {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = './index.html';
    });
  }

  if (welcomeMessage) {
    const token = getCookie('token');
    if (token) {
      welcomeMessage.textContent = 'Welcome, user!';
      fetchColors();
    } else {
      welcomeMessage.textContent = 'No one is logged in.';
      const loginButton = document.createElement('button');
      loginButton.textContent = 'Login';
      loginButton.addEventListener('click', function () {
        window.location.href = './index.html';
      });
      welcomeMessage.appendChild(loginButton);
    }
  }

  function fetchColors() {
    fetch('https://reqres.in/api/unknown')
      .then(response => response.json())
      .then(data => {
        data.data.forEach(color => {
          const colorDiv = document.createElement('div');
          colorDiv.style.backgroundColor = color.color;
          colorDiv.style.padding = '10px';
          colorDiv.style.margin = '10px';
          colorDiv.innerHTML = `<p>Name: ${color.name}</p>
                                    <p>Year: ${color.year}</p>`;
          colorsContainer.appendChild(colorDiv);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
});
