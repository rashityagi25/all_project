<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Metro Travel App</title>
    <style>
        body { font-family: Arial; text-align: center; margin-top: 30px; background:#f0f0f0; }
        h1 { color:#2c3e50; }
        .btn { display:inline-block; padding:10px 20px; margin:10px; font-size:14px; text-decoration:none; color:white; background:#3498db; border-radius:5px; transition:0.3s;}
        .btn:hover { background:#2980b9; }
        form { background:white; padding:20px; margin:20px auto; width:300px; border-radius:5px; box-shadow:0 0 10px rgba(0,0,0,0.2);}
        input { width:100%; padding:10px; margin:5px 0; }
        .success { background:#d4edda; color:#155724; padding:15px; border-radius:5px; margin:15px auto; width:300px; }
    </style>
</head>
<body>
<h1>Welcome to Metro Travel App</h1>

<!-- Show success message if present -->
<% String message = (String) request.getAttribute("message"); %>
<% if(message != null) { %>
    <div class="success">
        <%= message %> <br>
        <a href="#loginForm" class="btn">Go to Login</a>
    </div>
<% } %>

<!-- Registration Form -->
<form action="RegisterServlet" method="post">
    <h3>Register</h3>
    <input type="text" name="username" placeholder="Username" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="password" name="password" placeholder="Password" required>
    <input type="submit" value="Register" class="btn">
</form>

<% String loginMessage = (String) request.getAttribute("loginMessage"); %>
<% if(loginMessage != null) { %>
    <div class="success" style="background:#f8d7da; color:#721c24;">
        <%= loginMessage %>
    </div>
<% } %>

<!-- Login Form -->
<form id="loginForm" action="LoginServlet" method="post">
    <h3>Login</h3>
    <input type="email" name="email" placeholder="Email" required>
    <input type="password" name="password" placeholder="Password" required>
    <input type="submit" value="Login" class="btn">
</form>
</body>
</html>