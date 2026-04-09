<!DOCTYPE html>
<html>
<head>
    <title>Recharge Metro Card</title>
</head>
<body>

<h2>Recharge Your Metro Card</h2>

<p>Current Balance: ₹<%= session.getAttribute("balance") %></p>

<form action="RechargeServlet" method="post">
    <input type="number" name="amount" placeholder="Enter Amount" required>
    <input type="submit" value="Recharge">
</form>

<a href="booking.jsp">Back</a>

</body>
</html>