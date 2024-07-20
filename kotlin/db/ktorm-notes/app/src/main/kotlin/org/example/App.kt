@file:Suppress("ktlint:standard:no-wildcard-imports")

package org.example

import kotlinx.serialization.Serializable
import org.ktorm.database.*
import org.ktorm.dsl.*
import org.ktorm.schema.*
import org.ktorm.support.postgresql.*
import org.ktorm.support.postgresql.PostgreSqlDialect.*
import java.util.UUID

// ---
// Data classes
// ---

@Serializable
data class Ninja(
    val id: String,
    val firstName: String,
    val lastName: String,
    val age: Int,
    var jutsus: List<Jutsu>?,
) {
    fun greet() = println("Hello! My name is $firstName $lastName.")
}

@Serializable
data class NinjaUpdates(
    val firstName: String?,
    val lastName: String?,
    val age: Int?,
)

@Serializable
data class Jutsu(
    val id: String,
    val name: String,
    val chakraNature: String,
    val description: String,
)

@Serializable
data class JutsuUpdates(
    val name: String?,
    val chakraNature: String?,
    val description: String?,
)

// ---
// Tables
// ---

object Ninjas : Table<Nothing>("ninjas") {
    val id = uuid("id").primaryKey()
    val firstName = varchar("first_name")
    val lastName = varchar("last_name")
    val age = int("age")
}

object Jutsus : Table<Nothing>("jutsus") {
    val id = uuid("id").primaryKey()
    val name = varchar("name")
    val chakraNature = varchar("chakra_nature")
    val description = varchar("description")
}

object NinjasJutsus : Table<Nothing>("ninjas_jutsus") {
    val id = uuid("id").primaryKey()
    val ninjaId = uuid("ninja_id")
    val jutsuId = uuid("jutsu_id")
}

// ---
// DAL
// ---

class PgDal(
    val db: Database,
) {
    // ---
    // Ninjas
    // ---

    fun insertNinja(ninjaInput: Ninja) {
        db.insert(Ninjas) {
            set(it.id, UUID.fromString(ninjaInput.id))
            set(it.firstName, ninjaInput.firstName)
            set(it.lastName, ninjaInput.lastName)
            set(it.age, ninjaInput.age)
        }
    }

    fun getNinja(id: UUID): Ninja {
        val results =
            db
                .from(Ninjas)
                .select(Ninjas.id, Ninjas.firstName, Ninjas.lastName, Ninjas.age)
                .where { Ninjas.id eq id }
                .map { row ->
                    Ninja(
                        id = row[Ninjas.id].toString(),
                        firstName = row[Ninjas.firstName]!!,
                        lastName = row[Ninjas.lastName]!!,
                        age = row[Ninjas.age]!!,
                        jutsus = null,
                    )
                }
        return results.first()
    }

    fun updateNinja(
        id: UUID,
        updates: NinjaUpdates,
    ) {
        val (firstName, lastName, age) = updates
        db.update(Ninjas) {
            where {
                it.id eq id
            }
            if (firstName != null) {
                set(it.firstName, firstName)
            }
            if (lastName != null) {
                set(it.lastName, lastName)
            }
            if (age != null) {
                set(it.age, age)
            }
        }
    }

    fun deleteNinja(id: UUID) {
        db.delete(Ninjas) {
            it.id eq id
        }
    }

    // ---
    // Jutsus
    // ---

    fun insertJutsu(jutsuInput: Jutsu) {
        db.insert(Jutsus) {
            set(it.id, UUID.fromString(jutsuInput.id))
            set(it.name, jutsuInput.name)
            set(it.chakraNature, jutsuInput.chakraNature)
            set(it.description, jutsuInput.description)
        }
    }

    fun getJutsu(id: UUID): Jutsu {
        val results =
            db
                .from(Jutsus)
                .select(Jutsus.id, Jutsus.name, Jutsus.chakraNature, Jutsus.description)
                .where { Jutsus.id eq id }
                .map { row ->
                    Jutsu(
                        id = row[Jutsus.id].toString(),
                        name = row[Jutsus.name]!!,
                        chakraNature = row[Jutsus.chakraNature]!!,
                        description = row[Jutsus.description]!!,
                    )
                }
        return results.first()
    }

    fun updateJutsu(
        id: UUID,
        updates: JutsuUpdates,
    ) {
        val (name, chakraNature, description) = updates

        db.update(Jutsus) {
            where {
                it.id eq id
            }
            if (name != null) {
                set(it.name, name)
            }
            if (chakraNature != null) {
                set(it.chakraNature, chakraNature)
            }
            if (description != null) {
                set(it.description, description)
            }
        }
    }

    fun deleteJutsu(id: UUID) {
        db.delete(Jutsus) {
            it.id eq id
        }
    }

    // ---
    // Ninjas Jutsus
    // ---

    fun associateNinjaJutsu(
        ninjaId: UUID,
        jutsuId: UUID,
    ) {
        db.insert(NinjasJutsus) {
            set(it.id, UUID.randomUUID())
            set(it.ninjaId, ninjaId)
            set(it.jutsuId, jutsuId)
        }
    }

    fun dissociateNinjaJutsu(
        ninjaId: UUID,
        jutsuId: UUID,
    ) {
        db.delete(NinjasJutsus) {
            (it.ninjaId eq ninjaId) and (it.jutsuId eq jutsuId)
        }
    }

    private fun getNinjaJutsus(id: UUID): List<Jutsu> {
        // Ktorm doesn't support subqueries, so querying separately
        val jutsuIds =
            db
                .from(NinjasJutsus)
                .select(NinjasJutsus.jutsuId)
                .where { NinjasJutsus.ninjaId eq id }
                .map { row -> row[NinjasJutsus.jutsuId]!! }

        var jutsus = listOf<Jutsu>()
        if (jutsuIds.isNotEmpty()) {
            jutsus =
                db
                    .from(Jutsus)
                    .select(Jutsus.id, Jutsus.name, Jutsus.chakraNature, Jutsus.description)
                    .where { Jutsus.id.inList(jutsuIds) }
                    .map { row ->
                        Jutsu(
                            id = row[Jutsus.id].toString(),
                            name = row[Jutsus.name]!!,
                            chakraNature = row[Jutsus.chakraNature]!!,
                            description = row[Jutsus.description]!!,
                        )
                    }
        }

        return jutsus
    }

    fun getNinjaWithJutsus(id: UUID): Ninja {
        val ninja = getNinja(id)
        val jutsus = getNinjaJutsus(id)
        ninja.jutsus = jutsus
        return ninja
    }
}

// ---
// Main
// ---

fun main() {
    println("Connecting to db")
    val db = Database.connect(url = "jdbc:postgresql://localhost:5432/practice", user = "postgres", password = "postgres")

    val pgdal = PgDal(db)

    // Insert ninja
    val ninjaId = UUID.randomUUID()
    println("ninjaId: $ninjaId")
    val ninjaInput =
        Ninja(
            id = ninjaId.toString(),
            firstName = "Kakashi",
            lastName = "Hatake",
            age = 27,
            jutsus = null,
        )
    println("ninjaInput: $ninjaInput")
    pgdal.insertNinja(ninjaInput)
    // Get ninja
    val ninja = pgdal.getNinja(ninjaId)
    println("ninja: $ninja")
    // Update ninja
    val ninjaUpdates =
        NinjaUpdates(
            firstName = "Kaka",
            lastName = "Sensei",
            age = null,
        )
    println("ninjaUpdates: $ninjaUpdates")
    pgdal.updateNinja(ninjaId, ninjaUpdates)
    val ninjaUpdated = pgdal.getNinja(ninjaId)
    println("ninjaUpdated: $ninjaUpdated")

    // Create jutsu
    val jutsuId = UUID.randomUUID()
    println("jutsuId: $jutsuId")
    val jutsuInput =
        Jutsu(
            id = jutsuId.toString(),
            name = "Chidori",
            chakraNature = "Lightning",
            description = "Plover / A thousand birds",
        )
    println("jutsuInput: $jutsuInput")
    pgdal.insertJutsu(jutsuInput)
    // Get jutsu
    val jutsu = db.from(Jutsus).select().where { Jutsus.id eq jutsuId }
    println("jutsu: $jutsu")
    // Update Jutsu
    val jutsuUpdates = JutsuUpdates(name = null, chakraNature = null, description = "Lightning blade")
    pgdal.updateJutsu(jutsuId, jutsuUpdates)
    val jutsuUpdated = pgdal.getJutsu(jutsuId)
    println("jutsuUpdated: $jutsuUpdated")

    // Associate ninja/jutsu
    pgdal.associateNinjaJutsu(ninjaId, jutsuId)
    println("Associated ninja & jutsu")
    // Get ninja with jutsus (after associtaion)
    val ninjaWithJutsus = pgdal.getNinjaWithJutsus(ninjaId)
    println("ninjaWithJutsus: $ninjaWithJutsus")

    // Dissociate ninja/jutsu
    pgdal.dissociateNinjaJutsu(ninjaId, jutsuId)
    println("Dissociated ninja & jutsu")
    // Get ninja with jutsus (after dissociation)
    val ninjaWithoutJutsus = pgdal.getNinjaWithJutsus(ninjaId)
    println("ninjaWithoutJutsus: $ninjaWithoutJutsus")

    // Delete jutsu
    pgdal.deleteJutsu(jutsuId)
    // Delete Ninja
    pgdal.deleteNinja(ninjaId)
}
