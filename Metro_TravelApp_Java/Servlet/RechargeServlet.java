package controller;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.WebServlet;
import java.io.IOException;
import java.sql.*;
import util.DBConnection;

@WebServlet("/RechargeServlet")
public class RechargeServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession();
        Integer userId = (Integer) session.getAttribute("userId");

        double amount = Double.parseDouble(request.getParameter("amount"));

        try(Connection con = DBConnection.getConnection()){

            // Get current balance
            String query = "SELECT metro_card_balance FROM users WHERE user_id=?";
            PreparedStatement ps = con.prepareStatement(query);
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();

            double balance = 0;
            if(rs.next()){
                balance = rs.getDouble("metro_card_balance");
            }

            double newBalance = balance + amount;

            // Update DB
            String update = "UPDATE users SET metro_card_balance=? WHERE user_id=?";
            PreparedStatement ps2 = con.prepareStatement(update);
            ps2.setDouble(1, newBalance);
            ps2.setInt(2, userId);
            ps2.executeUpdate();

            // Update session
            session.setAttribute("balance", newBalance);
            session.setAttribute("msg", "Recharge Successful!");

            response.sendRedirect("booking.jsp");

        } catch(Exception e){
            e.printStackTrace();
        }
       
    }
}