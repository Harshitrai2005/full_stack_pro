import cron from "node-cron";
import { Borrow } from "../model/borrowModel.js";
import { User } from "../model/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const notifyUsers = () => {
  cron.schedule("*/10 * * * * *", async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const borrowers = await Borrow.find({
        dueDate: { $lt: oneDayAgo },
        returnDate: null,
        notified: false,
      });

      for (const element of borrowers) {
        const user = await User.findById(element.user.id);

        if (user && user.email) {
          await sendEmail({
            email: user.email,
            subject: "Book Return Reminder",
            message: `Hello ${user.name}, this is a reminder that the book you borrowed is overdue. Please return it as soon as possible.`,
          });

          element.notified = true;
          await element.save();

          console.log(`Email sent to ${user.email}`);
        }
      }
    } catch (error) {
      console.error(" Some error occurred while notifying users:", error);
    }
  });
};
