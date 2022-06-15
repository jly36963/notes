// dotenv
require("dotenv").config();
// imports
import mongoDAL from "./utils/mongo";
// main
const main = async (): Promise<void> => {
  try {
    // insert ninja
    const insertedNinja = await mongoDAL.insertNinja({
      firstName: "Kakashi",
      lastName: "Hatake",
    });
    // select ninja
    const selectedNinja = await mongoDAL.getNinja(insertedNinja._id);
    // update ninja
    const updatedNinja = await mongoDAL.updateNinja(selectedNinja._id, {
      firstName: "Kaka",
      lastName: "Sensei",
    });
    // create jutsu
    const insertedJutsu = await mongoDAL.insertJutsu({
      name: "Chidori",
      chakraNature: "Lightning",
      description: "Lightning blade",
    });
    // select jutsu
    const selectedJutsu = await mongoDAL.getJutsu(insertedJutsu._id);
    // update jutsu
    const updatedJutsu = await mongoDAL.updateJutsu(selectedJutsu._id, {
      description: "A thousand birds",
    });
    // add association
    await mongoDAL.addKnownJutsu(selectedNinja._id, selectedJutsu._id);
    // get ninja & jutsus
    const ninjaWithRelatedJutsus = await mongoDAL.getNinjaWithRelatedJutsus(selectedNinja._id);
    // print results
    console.log("selectedNinja", selectedNinja);
    console.log("selectedJutsu", selectedJutsu);
    console.log("updatedNinja", updatedNinja);
    console.log("updatedJutsu", updatedJutsu);
    console.log("ninjaWithRelatedJutsus", ninjaWithRelatedJutsus);
  } catch (err) {
    console.log(err);
  }
};
// run
main();
