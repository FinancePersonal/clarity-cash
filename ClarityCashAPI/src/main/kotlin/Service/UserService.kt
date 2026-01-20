package org.example.Service

import org.example.Model.User
import org.example.Repository.UserRepository
import org.springframework.stereotype.Service
import java.util.Date

@Service
class UserService(
    private val repository: UserRepository
) {

    fun create(user: User): User {
        return repository.save(user)
    }

    fun findAll(): List<User> {
        return repository.findAll()
    }

    fun findById(id: String): User {
        return repository.findById(id)
            .orElseThrow { RuntimeException("Usuário não encontrado") }
    }

    fun update(id: String, user: User): User {
        val existing = findById(id)
        val updated = existing.copy(
            name = user.name,
            email = user.email,
            password = user.password,
            updatedAt = Date()
        )
        return repository.save(updated)
    }

    fun delete(id: String) {
        repository.deleteById(id)
    }
}
