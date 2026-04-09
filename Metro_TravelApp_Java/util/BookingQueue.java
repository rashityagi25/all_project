package util;

import java.util.*;

public class BookingQueue {

    // Queue to store user booking requests
    private static Queue<Integer> queue = new LinkedList<>();

    // Add user to queue
    public static void addToQueue(int userId){
        queue.add(userId);
    }

    // Remove user from queue
    public static void removeFromQueue(){
        if(!queue.isEmpty()){
            queue.poll();
        }
    }

    // Check if user is first
    public static boolean isFirst(int userId){
        return !queue.isEmpty() && queue.peek() == userId;
    }

    // Get queue size
    public static int getSize(){
        return queue.size();
    }
}