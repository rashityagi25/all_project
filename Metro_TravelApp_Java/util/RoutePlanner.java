package util;

import java.util.*;

public class RoutePlanner {

    private int n; // number of stations
    private double[][] graph; // adjacency matrix

    public RoutePlanner(int n) {
        this.n = n;
        graph = new double[n][n];
        for(int i=0;i<n;i++){
            Arrays.fill(graph[i], Double.MAX_VALUE);
        }
    }

    public void addEdge(int u, int v, double distance) {
        graph[u][v] = distance;
        // If metro is bidirectional
        graph[v][u] = distance;
    }

    public List<String> findShortestPath(int start, int end, String[] stationNames) {
        double[] dist = new double[n];
        int[] prev = new int[n];
        boolean[] visited = new boolean[n];

        Arrays.fill(dist, Double.MAX_VALUE);
        Arrays.fill(prev, -1);

        dist[start] = 0;

        for(int i=0;i<n;i++){
            int u = -1;
            double minDist = Double.MAX_VALUE;
            for(int j=0;j<n;j++){
                if(!visited[j] && dist[j]<minDist){
                    minDist = dist[j];
                    u = j;
                }
            }

            if(u==-1) break;
            visited[u] = true;

            for(int v=0;v<n;v++){
                if(graph[u][v]!=Double.MAX_VALUE && dist[u]+graph[u][v]<dist[v]){
                    dist[v] = dist[u]+graph[u][v];
                    prev[v] = u;
                }
            }
        }

        // Build path
        List<String> path = new ArrayList<>();
        int at = end;
        while(at != -1){
            path.add(stationNames[at]);
            at = prev[at];
        }
        Collections.reverse(path);
        path.add(0, "Distance: " + dist[end] + " km"); // first element is distance
        return path;
    }
}