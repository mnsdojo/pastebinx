import cron from "node-cron";
import { PasteService } from "../services/paste.service";

export const initCronJobs = () => {
  // Run every hour: '0 * * * *'
  // For testing purposes, we might want to run it more frequently, but let's stick to hour for prod.
  // We can easily change this or make it configurable.
  const schedule = process.env.CRON_SCHEDULE || "0 * * * *";

  cron.schedule(schedule, async () => {
    console.log("Running expired paste cleanup job...");
    try {
      const count = await PasteService.deleteExpired();
      if (count > 0) {
        console.log(`Deleted ${count} expired pastes.`);
      } else {
        console.log("No expired pastes found.");
      }
    } catch (error) {
      console.error("Error running expired paste cleanup job:", error);
    }
  });

  console.log(`Cron jobs initialized with schedule: ${schedule}`);
};
