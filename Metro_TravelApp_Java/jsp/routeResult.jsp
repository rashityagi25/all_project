<%@ page import="java.util.*" %>
<!DOCTYPE html>
<html>
<head>
    <title>Route Result</title>
</head>
<body>
<h1>Your Shortest Route</h1>

<%
    // Read route info from session if available
    List<String> path = (List<String>) session.getAttribute("routePath");
    String source = (String) session.getAttribute("routeSource");
    String destination = (String) session.getAttribute("routeDestination");

    if(path == null || source == null || destination == null){
%>
    <p>No route found. Please go back and select stations.</p>
    <a href="booking.jsp">Go Back to Booking Page</a>
<%
    } else {
        double distance = 0;
        try {
            // First element contains distance like "Distance: 8.5 km"
            String distanceStr = path.get(0).replace("Distance: ", "").replace(" km","").trim();
            distance = Double.parseDouble(distanceStr);
        } catch(Exception e){
%>
            <p>Error reading distance. Please go back and try again.</p>
            <a href="booking.jsp">Go Back to Booking Page</a>
<%
        }

        double fare = distance * 2; // example fare per km
%>

<p><strong>Route:</strong>
<%
    for(int i=1; i<path.size(); i++){
        out.print(path.get(i));
        if(i < path.size()-1) out.print(" → ");
    }
%>
</p>
<p><strong>Total Distance:</strong> <%= distance %> km</p>
<p><strong>Total Fare:</strong> ₹<%= fare %></p>

<!-- Send all info to BookingServlet via hidden fields -->
<form action="BookingServlet" method="post">
    <input type="hidden" name="source" value="<%= source %>">
    <input type="hidden" name="destination" value="<%= destination %>">
    <input type="hidden" name="distance" value="<%= distance %>">
    <input type="hidden" name="path" value="<%= String.join(",", path.subList(1, path.size())) %>">
    <input type="submit" value="Book Ticket">
</form>

<a href="booking.jsp">Back to Booking Page</a>

<%
    } // end else
%>
</body>
</html>