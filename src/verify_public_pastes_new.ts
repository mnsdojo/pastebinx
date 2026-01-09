
import { PasteService } from "./services/paste.service";
import { prisma } from "./lib/prisma";

async function main() {
  console.log("Verifying getPublicPastes...");

  // 1. Create a dummy user
  console.log("Creating dummy user...");
  // Use a random email to avoid collision if script runs multiple times
  const user = await prisma.user.create({
    data: {
      username: `testuser_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      email: `testuser_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`,
      password: "dummyhash",
    },
  });

  // 2. Create some dummy public pastes
  console.log("Creating dummy pastes...");
  await prisma.paste.create({
    data: {
      title: "Public Paste 1",
      content: "Content 1",
      visibility: "public",
      userId: user.id,
    },
  });
  await prisma.paste.create({
    data: {
      title: "Public Paste 2",
      content: "Content 2",
      visibility: "public",
      userId: user.id,
    },
  });
   await prisma.paste.create({
    data: {
      title: "Private Paste",
      content: "Content Private",
      visibility: "private",
      userId: user.id,
    },
  });

  // 3. Fetch public pastes with pagination via Service
  console.log("Fetching page 1 with limit 10 (Direct Service Call)...");
  const result = await PasteService.getPublicPastes(1, 10);
  
  console.log("Total:", result.metadata.total);
  console.log("Page:", result.metadata.page);
  console.log("Limit:", result.metadata.limit);
  console.log("Total Pages:", result.metadata.totalPages);
  console.log("Pastes found:", result.pastes.length);

  result.pastes.forEach(p => {
      console.log(`- [${p.visibility}] ${p.title} (ID: ${p.id})`);
  });

  if (result.pastes.some(p => p.visibility !== 'public')) {
      console.error("ERROR: Found non-public paste!");
      process.exit(1);
  } else {
      console.log("SUCCESS: Only public pastes returned.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
