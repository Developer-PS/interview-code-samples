package dev.sippel.mealmind

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MealmindApplication

fun main(args: Array<String>) {
	runApplication<MealmindApplication>(*args)
}
