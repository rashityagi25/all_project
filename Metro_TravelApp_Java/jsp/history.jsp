<%@ page import="java.sql.*, util.DBConnection" %>
<%@ page session="true" %>
<%
    Integer userId = (Integer) session.getAttribute("userId");
    if(userId == null) {
        response.sendRedirect("index.jsp");
        return;
    }

    Connection con = null;
    PreparedStatement ps = null;
    ResultSet rs = null;

    try {
        con = DBConnection.getConnection();
        String query = "SELECT b.booking_id AS id, s1.station_name AS source, s2.station_name AS destination, b.fare, b.booking_time " +
                "FROM bookings b " +
                "JOIN stations s1 ON b.source_station_id = s1.station_id " +
                "JOIN stations s2 ON b.destination_station_id = s2.station_id " +
                "WHERE b.user_id = ? " +
                "ORDER BY b.booking_time DESC";
        ps = con.prepareStatement(query);
        ps.setInt(1, userId);
        rs = ps.executeQuery();
%>

<h2>Your Booking History</h2>
<table border="1">
    <tr>
        <th>ID</th>
        <th>Source</th>
        <th>Destination</th>
        <th>Fare</th>
        <th>Booking Time</th>
    </tr>
<%
        while(rs.next()) {
%>
    <tr>
        <td><%= rs.getInt("id") %></td>
        <td><%= rs.getString("source") %></td>
        <td><%= rs.getString("destination") %></td>
        <td>₹<%= rs.getDouble("fare") %></td>
        <td><%= rs.getTimestamp("booking_time") %></td>
    </tr>
<%
        }
    } catch(Exception e) {
        out.println("Error: " + e.getMessage());
    } finally {
        if(rs != null) rs.close();
        if(ps != null) ps.close();
        if(con != null) con.close();
    }
%>
</table>

<hr>
<a href="welcome.jsp">Home</a> |
<a href="routeResult.jsp">Book Another Ticket</a> |
<a href="LogoutServlet">Logout</a>