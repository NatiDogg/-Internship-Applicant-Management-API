import { PrismaClient } from "./generated/prisma/client";
import { InternshipTrack,ApplicationStatus } from "./generated/prisma/client";
import { hashPassword } from "../src/utils/bcryptJs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const main = async()=>{
    console.log('Starting database seeding...');
    const adminName = 'system admin'
     const adminEmail = 'admin@infonova.com'.toLowerCase()
     const adminPassword = 'admin123'
     const hashedPassword = await hashPassword(adminPassword)

     const admin = await prisma.admin.upsert({
        where: { email: adminEmail },
        update: {}, 
        create: {
           name: adminName,
           email: adminEmail,
            password: hashedPassword,
        },
      })
      console.log(`Admin account created/updated: ${admin.email}`);

      const sampleApplicants = [
    {
      name: 'Abebe Bikila',
      email: 'abebe.bikila@gmail.com'.toLowerCase(),
      phone: '+251911223344',
      track: InternshipTrack.BACKEND_DEVELOPMENT,
      status:  ApplicationStatus.ACCEPTED,
      notes: 'Strong knowledge of NestJS, PostgreSQL, and clean architecture principles.',
    },
    {
      name: 'Tigist Assefa',
      email: 'tigist.assefa@gmail.com'.toLowerCase(),
      phone: '+251922334455',
      track: InternshipTrack.FRONTEND_DEVELOPMENT,
      status:  ApplicationStatus.SHORTLISTED,
      notes: 'Excellent React performance optimization skills and UI component design.',
    },
    {
      name: 'Dawit Yohannes',
      email: 'dawit.y@yahoo.com'.toLowerCase(),
      phone: '+251933445566',
      track: InternshipTrack.FRONTEND_DEVELOPMENT,
      status:  ApplicationStatus.PENDING,
      notes: 'Applied recently. Good resume showcasing Express.js and React projects.',
    },
    {
      name: 'Makeda Alemu',
      email: 'makeda.alemu@gmail.com'.toLowerCase(),
      phone: '+251944556677',
      track: InternshipTrack.BACKEND_DEVELOPMENT,
      status:  ApplicationStatus.REJECTED,
      notes: 'Lacked required experience with relational databases and TypeScript.',
    },
    {
      name: 'Kebede Tadesse',
      email: 'kebede.t@hotmail.com'.toLowerCase(),
      phone: '+251955667788',
      track: InternshipTrack.FRONTEND_DEVELOPMENT,
      status: ApplicationStatus.PENDING,
      notes: 'Awaiting technical interview feedback.',
    },
  ];

  for (const applicant of sampleApplicants){
    await prisma.applicant.upsert({
      where: { email: applicant.email },
      update: {},
      create: applicant,
    });
  }
  console.log(` ${sampleApplicants.length} sample applicants created.`);
  console.log(' Seeding completed successfully!');

}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
