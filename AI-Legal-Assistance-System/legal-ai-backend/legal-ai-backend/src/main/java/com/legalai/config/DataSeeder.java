package com.legalai.config;

import com.legalai.model.CrimeType;
import com.legalai.repository.CrimeTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CrimeTypeRepository crimeTypeRepository;

    @Override
    public void run(String... args) throws Exception {

        if (crimeTypeRepository.count() > 0) {
            System.out.println("Crime types already seeded — skipping.");
            return;
        }

        List<CrimeType> crimeTypes = List.of(
                createCrime("Theft", "IPC 378", "MEDIUM", true,
                        "Whoever intending to take dishonestly any moveable property out of the possession of any person without that person's consent."),
                createCrime("Assault", "IPC 351", "MEDIUM", true,
                        "Whoever makes any gesture or preparation intending or knowing it to be likely to cause apprehension of assault."),
                createCrime("Murder", "IPC 302", "HIGH", false,
                        "Whoever commits murder shall be punished with death or imprisonment for life."),
                createCrime("Fraud", "IPC 420", "HIGH", false,
                        "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property."),
                createCrime("Cybercrime", "IT Act 66", "HIGH", false,
                        "Whoever commits hacking or data theft using computer resources."),
                createCrime("Domestic Violence", "IPC 498A", "HIGH", false,
                        "Whoever subjects a woman to cruelty in matrimonial home."),
                createCrime("Robbery", "IPC 390", "HIGH", false,
                        "Theft is robbery if the offender uses force or threat of force."),
                createCrime("Kidnapping", "IPC 359", "HIGH", false,
                        "Kidnapping from India or from lawful guardianship."),
                createCrime("Harassment", "IPC 354", "MEDIUM", true,
                        "Assault or criminal force to woman with intent to outrage her modesty."),
                createCrime("Cheating", "IPC 415", "LOW", true,
                        "Whoever by deceiving any person fraudulently induces to deliver any property."),
                createCrime("Trespass", "IPC 441", "LOW", true,
                        "Whoever enters into or upon property in possession of another with intent to commit offence."),
                createCrime("Defamation", "IPC 499", "LOW", true,
                        "Whoever by words makes or publishes any imputation concerning any person intending to harm reputation.")
        );

        crimeTypeRepository.saveAll(crimeTypes);
        System.out.println("✅ Crime types seeded successfully! Total: " + crimeTypes.size());
    }

    private CrimeType createCrime(String name, String ipc, String severity,
                                  boolean bailable, String description) {
        CrimeType c = new CrimeType();
        c.setName(name);
        c.setIpcSection(ipc);
        c.setSeverity(severity);
        c.setBailable(bailable);
        c.setDescription(description);
        return c;
    }
}