<%@ page session="true" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Welcome</title>
</head>
<body>


    <h1>Welcome, <%= session.getAttribute("user") %>!</h1>
    <p>You have successfully logged in.</p>
    <form action="LogoutServlet" method="post">
        <input type="submit" value="Logout">
    </form>
</body>
</html>