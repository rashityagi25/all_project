package com.legalai.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password; // will store BCrypt hashed password

    private String role; // USER, OFFICER, ADMIN

    private String phone;

    private String state;

    private LocalDateTime createdAt = LocalDateTime.now();
}