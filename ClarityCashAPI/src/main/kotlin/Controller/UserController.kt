package org.example.Controller

import org.example.Model.User
import org.example.Service.UserService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/users")
class UserController(
    private val service: UserService
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody user: User): User =
        service.create(user)

    @GetMapping
    fun findAll(): List<User> =
        service.findAll()

    @GetMapping("/{id}")
    fun findById(@PathVariable id: String): User =
        service.findById(id)

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: String,
        @RequestBody user: User
    ): User =
        service.update(id, user)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: String) =
        service.delete(id)
}
