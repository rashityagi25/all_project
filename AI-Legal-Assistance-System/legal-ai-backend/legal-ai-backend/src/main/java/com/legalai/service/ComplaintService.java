package com.legalai.service;

import com.legalai.dto.ComplaintRequest;
import com.legalai.model.Address;
import com.legalai.model.Complaint;
import com.legalai.model.TimelineEvent;
import com.legalai.model.User;
import com.legalai.repository.ComplaintRepository;
import com.legalai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final FirDraftService firDraftService;

    public Complaint fileComplaint(ComplaintRequest request, String userId) {

        Complaint complaint = new Complaint();
        complaint.setUserId(userId);
        complaint.setCrimeTypeId(request.getCrimeTypeId());
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setStatus("SUBMITTED");

        // Set address
        Address address = new Address();
        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        complaint.setAddress(address);

        // Add first timeline event
        TimelineEvent event = new TimelineEvent();
        event.setStatus("SUBMITTED");
        event.setMessage("Complaint submitted successfully");
        event.setTimestamp(LocalDateTime.now());
        event.setUpdatedBy(userId);
        complaint.getTimeline().add(event);

        // Auto assign officer
        String officerId = autoAssignOfficer();
        complaint.setOfficerId(officerId);

        // Save complaint first
        Complaint saved = complaintRepository.save(complaint);

        // Auto generate FIR draft via AI
        try {
            User user = userRepository.findById(userId).orElse(null);
            String complainantName = user != null ? user.getName() : "Unknown";
            firDraftService.generateAndSave(saved, complainantName);
        } catch (Exception e) {
            System.out.println("FIR auto-generation failed: " + e.getMessage());
        }

        return saved;
    }

    public List<Complaint> getUserComplaints(String userId) {
        return complaintRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Complaint getComplaintById(String id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));
    }

    public Complaint updateComplaintStatus(String id, String status, String message, String officerId) {
        Complaint complaint = getComplaintById(id);
        complaint.setStatus(status);
        complaint.setLastUpdatedAt(LocalDateTime.now());

        TimelineEvent event = new TimelineEvent();
        event.setStatus(status);
        event.setMessage(message);
        event.setTimestamp(LocalDateTime.now());
        event.setUpdatedBy(officerId);
        complaint.getTimeline().add(event);

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getOfficerComplaints(String officerId) {
        return complaintRepository.findByOfficerId(officerId);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    private String autoAssignOfficer() {
        List<User> officers = userRepository.findAll()
                .stream()
                .filter(u -> "OFFICER".equals(u.getRole()))
                .toList();

        if (officers.isEmpty()) {
            return null;
        }

        return officers.stream()
                .min((o1, o2) -> (int) (
                        complaintRepository.countByOfficerId(o1.getId()) -
                                complaintRepository.countByOfficerId(o2.getId())
                ))
                .map(User::getId)
                .orElse(null);
    }
}