package dev.sippel.mealmind

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import java.util.*
// TODO in eigenen Ordner
@Service
class RecipeService(private val db: JdbcTemplate) {
    fun findRecipes(): List<Recipe> = db.query("select * from recipes") { response, _ ->
        Recipe(response.getString("id"), response.getString("title"))
    }
    fun findRecipeById(id: String): Recipe? = db.query("select * from recipes where id = ?", id) { response, _ ->
        Recipe(response.getString("id"), response.getString("title"))
    }.singleOrNull()

    fun save(recipe: Recipe): Recipe {
        val id = recipe.id ?: UUID.randomUUID().toString() // Generate new id if it is null
        db.update(
            "insert into recipes values ( ?, ? )",
            id, recipe.title
        )
        return recipe.copy(id = id) // Return a copy of the recipe with the new id
     }
}