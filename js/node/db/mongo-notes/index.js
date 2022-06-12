import { providers } from "./dal/providers.js";

const main = async () => {
  let ninja, jutsu, ninjaWithJutsus;

  // Create ninja
  ninja = await providers.mongodal.ninjas.insert({
    firstName: "Kakashi",
    lastName: "Hatake",
    age: 27,
  });
  console.log("insert ninja result: ", ninja);

  // Get ninja
  ninja = await providers.mongodal.ninjas.get(ninja._id);
  console.log("select ninja result: ", ninja);

  // Update ninja
  ninja = await providers.mongodal.ninjas.update(ninja._id, {
    firstName: "Kaka",
    lastName: "Sensei",
  });
  console.log("update ninja result: ", ninja);

  // Create jutsu
  jutsu = await providers.mongodal.jutsus.insert({
    name: "Chidori",
    chakraNature: "Lightning",
    description: "Plover / a thousand birds",
  });
  console.log("insert jutsu result: ", jutsu);

  // Get jutsu
  jutsu = await providers.mongodal.jutsus.get(jutsu._id);
  console.log("select jutsu result: ", jutsu);

  // Update jutsu
  jutsu = await providers.mongodal.jutsus.update(jutsu._id, {
    description: "Lightning blade",
  });
  console.log("update jutsu result: ", jutsu);

  // Associate ninja & jutsu
  await providers.mongodal.ninjas.associateJutsu(ninja._id, jutsu._id);

  // Get ninja with jutsus
  ninjaWithJutsus = await providers.mongodal.ninjas.getNinjaWithJutsus(ninja._id);
  console.log("ninja with jutsus: ", ninjaWithJutsus);

  // Dissociate Jutsu
  await providers.mongodal.ninjas.disassociateJutsu(ninja._id, jutsu._id);

  // Get ninja with jutsus (post-dissociation)
  ninjaWithJutsus = await providers.mongodal.ninjas.getNinjaWithJutsus(ninja._id);
  console.log("ninja with jutsus (after dissociation): ", ninjaWithJutsus);

  // Delete ninja
  ninja = await providers.mongodal.ninjas.del(ninja._id);
  console.log("delete ninja result: ", ninja);

  // Delete jutsu
  jutsu = await providers.mongodal.jutsus.del(jutsu._id);
  console.log("delete jutsu result: ", jutsu);

  process.exit(0);
};

main();
