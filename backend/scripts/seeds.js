//TODO: seeds script should come here, so we'll be able to put some data in our local env

const mongoose = require("mongoose");
const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");

const connection = process.env.MONGODB_URI;
mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true });

async function seedDatabase() {
  try {
    for (let i = 0; i < 100; i++) {
      // Add user
      const user = { username: `user${i}`, email: `user${i}@gmail.com` };
      const options = { upsert: true, new: true };
      const createdUser = await User.findOneAndUpdate(user, {}, options);
      
      // Add item to user
      const item = {
        slug: `slug${i}`,
        title: `title ${i}`,
        description: `description ${i}`,
        seller: createdUser._id,
      };
      const createdItem = await Item.findOneAndUpdate(item, {}, options);
      
      // Add comments to item
      if (!createdItem.comments || !createdItem.comments.length) {
        let commentIds = [];
        for (let j = 0; j < 100; j++) {
          const comment = new Comment({
            body: `body ${j}`,
            seller: createdUser._id,
            item: createdItem._id,
          });
          await comment.save();
          commentIds.push(comment._id);
        }
        createdItem.comments = commentIds;
        await createdItem.save();
      }
    }
    console.log("Finished DB seeding");
    process.exit(0);
  } catch (err) {
    console.log(`Error while running DB seed: ${err.message}`);
    process.exit(1);
  }
}

seedDatabase();