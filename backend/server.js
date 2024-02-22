import { app } from "./app.js";
import { connectDB } from "./config/db.js";


 app.listen(process.env.PORT, async (error) => {
    if (error) {
      console.log(`server failed with error ${error}`);
    } else {
      await connectDB();
      console.log(`server is running at http://localhost:${process.env.PORT}`);
    }
  });