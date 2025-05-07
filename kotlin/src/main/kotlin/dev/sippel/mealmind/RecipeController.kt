package dev.sippel.mealmind

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.net.URI

@RestController
@RequestMapping("/")
class RecipeController(private val service: RecipeService) {


    @GetMapping
    fun listRecipes() = ResponseEntity.ok(service.findRecipes())

    @PostMapping
    fun post(@RequestBody recipe: Recipe): ResponseEntity<Recipe> {
        val savedRecipe = service.save(recipe)
        return ResponseEntity.created(URI("/${savedRecipe.id}")).body(savedRecipe)
    }

    @GetMapping("/{id}")
    fun getMessage(@PathVariable id: String): ResponseEntity<Recipe> =
        service.findRecipeById(id).toResponseEntity()

    private fun Recipe?.toResponseEntity(): ResponseEntity<Recipe> =
        // If the message is null (not found), set response code to 404
        this?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
}