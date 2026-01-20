package org.example.Model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.Date

@Document(collection = "users")
data class User(
    @Id
    val id: String? = null,
    val name: String,
    val email: String,
    val password: String,
    val createdAt: Date,
    val updatedAt: Date
)
