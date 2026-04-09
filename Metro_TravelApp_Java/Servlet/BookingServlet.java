package controller;

import util.BookingQueue;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.WebServlet;
import java.io.IOException;
import java.sql.*;
import util.DBConnection;

@WebServlet("/BookingServlet")
public class BookingServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession();
        Integer userId = (Integer) session.getAttribute("userId");

        // ✅ Step 1: Check login first
        if(userId == null) {
            response.sendRedirect("index.jsp");
            return;
        }

        // ✅ Step 2: Add to queue AFTER validation
        BookingQueue.addToQueue(userId);

        try {

            // ✅ Step 3: Check queue position
            if(!BookingQueue.isFirst(userId)){
                response.getWriter().println("<h3>Please wait... You are in queue. Position: " + BookingQueue.getSize() + "</h3>");
                return;
            }

            // ✅ Step 4: Get parameters safely
            String sourceParam = request.getParameter("source");
            String destParam = request.getParameter("destination");

            if(sourceParam == null || destParam == null){
                response.getWriter().println("<h3>Error: Source/Destination missing</h3>");
                return;
            }

            int sourceId = Integer.parseInt(sourceParam);
            int destinationId = Integer.parseInt(destParam);

            try (Connection con = DBConnection.getConnection()) {

                // ✅ Fetch fare
                String fareQuery = "SELECT fare FROM routes WHERE source_station_id=? AND destination_station_id=?";
                PreparedStatement ps1 = con.prepareStatement(fareQuery);
                ps1.setInt(1, sourceId);
                ps1.setInt(2, destinationId);
                ResultSet rs = ps1.executeQuery();

                if(rs.next()) {
                    double fare = rs.getDouble("fare");

                    // ✅ Get balance
                    String balanceQuery = "SELECT metro_card_balance FROM users WHERE user_id=?";
                    PreparedStatement psBalance = con.prepareStatement(balanceQuery);
                    psBalance.setInt(1, userId);
                    ResultSet rsBalance = psBalance.executeQuery();

                    double balance = 0;
                    if(rsBalance.next()){
                        balance = rsBalance.getDouble("metro_card_balance");
                    }

                    // ✅ Check balance
                    if(balance < fare){
                        response.getWriter().println("<h3>Insufficient Balance! Please recharge.</h3>");
                        return;
                    }

                    // ✅ Deduct balance
                    double newBalance = balance - fare;

                    String updateBalance = "UPDATE users SET metro_card_balance=? WHERE user_id=?";
                    PreparedStatement psUpdate = con.prepareStatement(updateBalance);
                    psUpdate.setDouble(1, newBalance);
                    psUpdate.setInt(2, userId);
                    psUpdate.executeUpdate();

                    // ✅ Insert booking
                    String insertQuery = "INSERT INTO bookings(user_id, source_station_id, destination_station_id, fare) VALUES (?, ?, ?, ?)";
                    PreparedStatement ps2 = con.prepareStatement(insertQuery);
                    ps2.setInt(1, userId);
                    ps2.setInt(2, sourceId);
                    ps2.setInt(3, destinationId);
                    ps2.setDouble(4, fare);

                    int i = ps2.executeUpdate();

                    if(i > 0) {
                        session.setAttribute("balance", newBalance);
                        response.sendRedirect("history.jsp");
                    } else {
                        response.getWriter().println("<h3>Booking Failed!</h3>");
                    }

                } else {
                    response.getWriter().println("<h3>Route not found!</h3>");
                }
            }

        } catch(Exception e) {
            e.printStackTrace();
            response.getWriter().println("<h3>Error: " + e.getMessage() + "</h3>");
        } finally {
            // ✅ VERY IMPORTANT (always remove from queue)
            BookingQueue.removeFromQueue();
        }
    }
}