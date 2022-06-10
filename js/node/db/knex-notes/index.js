import { providers } from './dal/providers.js';

const main = async () => {
  let ninja, jutsu, ninjaWithJutsus

  // Create ninja
  ninja = await providers.pgdal.ninjas.insert({
    firstName: "Kakashi",
    lastName: "Hatake",
    age: 27
  })
  console.log('insert ninja result: ', ninja)

  // Get ninja
  ninja = await providers.pgdal.ninjas.get(ninja.id)
  console.log('select ninja result: ', ninja)

  // Update ninja
  ninja = await providers.pgdal.ninjas.update(ninja.id, {
    firstName: 'Kaka',
    lastName: 'Sensei'
  })
  console.log('update ninja result: ', ninja)

  // Create jutsu
  jutsu = await providers.pgdal.jutsus.insert({
    name: "Chidori",
    chakraNature: "Lightning",
    description: "Plover / a thousand birds"
  })
  console.log('insert jutsu result: ', jutsu)

  // Get jutsu
  jutsu = await providers.pgdal.jutsus.get(jutsu.id)
  console.log('select jutsu result: ', jutsu)

  // Update jutsu
  jutsu = await providers.pgdal.jutsus.update(jutsu.id, {
    description: 'Lightning blade'
  })
  console.log('update jutsu result: ', jutsu)

  // Associate ninja & jutsu
  await providers.pgdal.ninjas.associateJutsu(ninja.id, jutsu.id);

  // Get ninja with jutsus
  ninjaWithJutsus = await providers.pgdal.ninjas.getNinjaWithJutsus(ninja.id);
  console.log('ninja with jutsus: ', ninjaWithJutsus)

  // Dissociate Jutsu
  await providers.pgdal.ninjas.disassociateJutsu(ninja.id, jutsu.id);

  // Get ninja with jutsus (post-dissociation)
  ninjaWithJutsus = await providers.pgdal.ninjas.getNinjaWithJutsus(ninja.id);
  console.log('ninja with jutsus (after dissociation): ', ninjaWithJutsus)

  // Delete ninja
  ninja = await providers.pgdal.ninjas.del(ninja.id);
  console.log('delete ninja result: ', ninja)

  // Delete jutsu
  jutsu = await providers.pgdal.jutsus.del(jutsu.id);
  console.log('delete jutsu result: ', jutsu)

  process.exit(0)
}

main()