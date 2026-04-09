<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Metro Ticket Booking</title>
    <style>
        body { font-family: Arial; text-align: center; margin-top: 30px; background:#f0f0f0; }
        form { background:white; padding:20px; margin:20px auto; width:300px; border-radius:5px; box-shadow:0 0 10px rgba(0,0,0,0.2);}
        input, select { width:100%; padding:10px; margin:5px 0; }
        .btn { padding:10px 20px; background:#3498db; color:white; border:none; border-radius:5px; cursor:pointer; }
        .btn:hover { background:#2980b9; }
        .success { background:#d4edda; color:#155724; padding:15px; border-radius:5px; margin:15px auto; width:300px; }
    </style>
</head>
<body>
    <h1>Book Your Metro Ticket</h1>
    <%
    String msg = (String) session.getAttribute("msg");
    if(msg != null){
%>
    <div class="success">
        <%= msg %>
    </div>
<%
        session.removeAttribute("msg");
    }
%>
<%
    Double balance = (Double) session.getAttribute("balance");
    if(balance == null) balance = 0.0;
%>
<p>Current Balance: ₹<%= balance %></p>
   <form action="RouteServlet" method="post">
        <select name="source" required>
            <option value="">Select Source Station</option>
            <option value="1">Station A</option>
            <option value="2">Station B</option>
            <option value="3">Station C</option>
            <option value="4">Station D</option>
            <option value="5">Station E</option>
        </select>

        <select name="destination" required>
            <option value="">Select Destination Station</option>
            <option value="1">Station A</option>
            <option value="2">Station B</option>
            <option value="3">Station C</option>
            <option value="4">Station D</option>
            <option value="5">Station E</option>
        </select>

> <!-- Replace with logged-in user's id dynamically -->

        <input type="submit" value="Find shortest Route" class="btn">
   
    </form>
    <a href="recharge.jsp" class="btn">Recharge Card</a>
    
</body>
</html>