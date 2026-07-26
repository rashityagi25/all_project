package com.legalai.service;

import com.legalai.model.Helpline;
import com.legalai.model.HelplineContact;
import com.legalai.repository.HelplineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HelplineService {

    private final HelplineRepository helplineRepository;

    // ── Get helpline by crime type ───────────────
    public Optional<Helpline> getHelplineByCrimeType(String crimeType) {
        return helplineRepository.findByCrimeTypeIgnoreCase(crimeType);
    }

    // ── Get all helplines ────────────────────────
    public List<Helpline> getAllHelplines() {
        return helplineRepository.findAll();
    }

    // ── Seed helplines on startup ────────────────
    @EventListener(ApplicationReadyEvent.class)
    public void seedHelplines() {
        if (helplineRepository.count() > 0) {
            System.out.println("Helplines already seeded — skipping.");
            return;
        }

        helplineRepository.saveAll(List.of(
                createHelpline("general", "General Emergency",
                        List.of(
                                contact("Police", "100", "Emergency police assistance", true),
                                contact("Ambulance", "108", "Medical emergency", true),
                                contact("Fire Brigade", "101", "Fire emergency", true),
                                contact("National Emergency", "112", "All emergencies", true)
                        ), "General emergency helplines"),

                createHelpline("women", "Women Safety",
                        List.of(
                                contact("Women Helpline", "1091", "Women in distress", true),
                                contact("Domestic Violence", "181", "Domestic abuse helpline", true),
                                contact("NCW Helpline", "7827170170", "National Commission for Women", false),
                                contact("Police", "100", "Emergency police", true)
                        ), "Helplines for women safety and domestic violence"),

                createHelpline("child", "Child Safety",
                        List.of(
                                contact("Childline", "1098", "Child abuse and missing children", true),
                                contact("Police", "100", "Emergency police", true),
                                contact("NCPCR", "1800-121-2830", "Child rights commission", false)
                        ), "Helplines for child abuse and safety"),

                createHelpline("cybercrime", "Cyber Crime",
                        List.of(
                                contact("Cyber Crime Helpline", "1930", "Online fraud and cybercrime", true),
                                contact("Cyber Crime Portal", "cybercrime.gov.in", "Report online", false),
                                contact("Police", "100", "Emergency police", true)
                        ), "Helplines for cybercrime and online fraud"),

                createHelpline("robbery", "Robbery & Theft",
                        List.of(
                                contact("Police", "100", "Emergency police assistance", true),
                                contact("PCR Van", "112", "Police Control Room", true),
                                contact("Legal Aid", "15100", "Free legal assistance", false)
                        ), "Helplines for robbery and theft"),

                createHelpline("murder", "Murder & Violence",
                        List.of(
                                contact("Police", "100", "Emergency police assistance", true),
                                contact("PCR Van", "112", "Police Control Room", true),
                                contact("Ambulance", "108", "Medical emergency", true)
                        ), "Helplines for murder and serious violence"),

                createHelpline("legal", "Legal Aid",
                        List.of(
                                contact("Legal Aid", "15100", "Free legal aid services", false),
                                contact("NALSA", "1800-200-5800", "National Legal Services Authority", false),
                                contact("Police", "100", "Emergency police", true)
                        ), "Legal aid and assistance helplines")
        ));

        System.out.println("✅ Helplines seeded successfully!");
    }

    private Helpline createHelpline(String crimeType, String title,
                                    List<HelplineContact> contacts, String description) {
        Helpline h = new Helpline();
        h.setCrimeType(crimeType);
        h.setTitle(title);
        h.setContacts(contacts);
        h.setDescription(description);
        return h;
    }

    private HelplineContact contact(String name, String number,
                                    String description, boolean available24x7) {
        HelplineContact c = new HelplineContact();
        c.setName(name);
        c.setNumber(number);
        c.setDescription(description);
        c.setAvailable24x7(available24x7);
        return c;
    }
}