package controller;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.WebServlet;
import java.io.IOException;
import java.sql.*;
import java.util.*;
import util.DBConnection;
import util.RoutePlanner;

@WebServlet("/RouteServlet")
public class RouteServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        int sourceId = Integer.parseInt(request.getParameter("source")) - 1; // 0-based
        int destinationId = Integer.parseInt(request.getParameter("destination")) - 1;

        try (Connection con = DBConnection.getConnection()) {
            // Fetch stations
            Statement stmt = con.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT station_name FROM stations ORDER BY station_id ASC");
            List<String> stationList = new ArrayList<>();
            while(rs.next()) stationList.add(rs.getString("station_name"));
            String[] stationNames = stationList.toArray(new String[0]);

            // Fetch routes and build graph
            RoutePlanner planner = new RoutePlanner(stationNames.length);
            rs = stmt.executeQuery("SELECT source_station_id, destination_station_id, distance FROM routes");
            while(rs.next()) {
                int u = rs.getInt("source_station_id") - 1;
                int v = rs.getInt("destination_station_id") - 1;
                double d = rs.getDouble("distance");
                planner.addEdge(u,v,d);
            }

            List<String> path = planner.findShortestPath(sourceId, destinationId, stationNames);

            HttpSession session = request.getSession();
            session.setAttribute("routePath", path);
            session.setAttribute("routeSource", stationNames[sourceId]);
            session.setAttribute("routeDestination", stationNames[destinationId]);
            
            session.setAttribute("sourceId", sourceId + 1);
            session.setAttribute("destinationId", destinationId + 1);
            response.sendRedirect("routeResult.jsp");

        } catch(Exception e) {
            e.printStackTrace();
            response.getWriter().println("Error: " + e.getMessage());
        }
    }
}