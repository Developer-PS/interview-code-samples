package dev.sippel.mealmind

data class Recipe(
    val id: String?,
    val title: String,
    val description: String? = null,
    val ingredients: Set<String> = emptySet(), // TODO objekt mit menge/name
    val steps: List<String> = emptyList(),
    val prepTimeMinutes: Int? = null,
    val cookTimeMinutes: Int? = null,
    val servings: Int? = null,
    val imageUrl: String? = null
){
    init {
        // Validate servings if it's not null
        require(servings == null || servings > 0) { "Servings must be a positive number." }
    }
}