package com.legalai.service;

import com.legalai.model.Complaint;
import com.legalai.model.User;
import com.legalai.repository.ComplaintRepository;
import com.legalai.repository.CrimeTypeRepository;
import com.legalai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final CrimeTypeRepository crimeTypeRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total counts
        long totalComplaints = complaintRepository.count();
        long totalUsers = userRepository.count();
        long totalCrimeTypes = crimeTypeRepository.count();

        stats.put("totalComplaints", totalComplaints);
        stats.put("totalUsers", totalUsers);
        stats.put("totalCrimeTypes", totalCrimeTypes);

        // Complaints by status
        List<Complaint> allComplaints = complaintRepository.findAll();

        Map<String, Long> byStatus = allComplaints.stream()
                .collect(Collectors.groupingBy(
                        Complaint::getStatus,
                        Collectors.counting()
                ));
        stats.put("complaintsByStatus", byStatus);

        // Complaints by crime type
        Map<String, Long> byCrimeType = allComplaints.stream()
                .filter(c -> c.getCrimeTypeId() != null)
                .collect(Collectors.groupingBy(
                        Complaint::getCrimeTypeId,
                        Collectors.counting()
                ));
        stats.put("complaintsByCrimeType", byCrimeType);

        // Resolution rate
        long resolved = byStatus.getOrDefault("RESOLVED", 0L);
        double resolutionRate = totalComplaints > 0
                ? (double) resolved / totalComplaints * 100
                : 0;
        stats.put("resolutionRate", Math.round(resolutionRate * 100.0) / 100.0);

        // Officers list with complaint count
        List<Map<String, Object>> officerStats = userRepository.findAll()
                .stream()
                .filter(u -> "OFFICER".equals(u.getRole()))
                .map(officer -> {
                    Map<String, Object> o = new HashMap<>();
                    o.put("id", officer.getId());
                    o.put("name", officer.getName());
                    o.put("email", officer.getEmail());
                    o.put("complaintCount",
                            complaintRepository.countByOfficerId(officer.getId()));
                    return o;
                })
                .collect(Collectors.toList());
        stats.put("officerStats", officerStats);

        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserRole(String userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        return userRepository.save(user);
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    public Complaint assignOfficer(String complaintId, String officerId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setOfficerId(officerId);
        return complaintRepository.save(complaint);
    }
}