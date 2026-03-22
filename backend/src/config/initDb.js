import db from "./db.js";

export const initDatabase = async () => {
  try {
    console.log("🔄 Initializing Database...");


   // ================= USERS =================
await db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(50) UNIQUE NULL,
    email VARCHAR(100) UNIQUE NULL,
    password VARCHAR(255),

    role ENUM(
      'APPLICANT',
      'OPERATIONS',
      'ADMIN',
      'SUPERADMIN'
    ) DEFAULT 'APPLICANT',

    is_verified BOOLEAN DEFAULT FALSE,
    is_temp_password BOOLEAN DEFAULT TRUE,   -- 🔥 ADD THIS
    is_active BOOLEAN DEFAULT TRUE,          -- 🔥 ADD THIS

    otp VARCHAR(10),
    otp_expiry DATETIME,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);
await db.query(`
  CREATE TABLE IF NOT EXISTS internal_users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNIQUE,

    full_name VARCHAR(255),
    designation VARCHAR(100),
    department VARCHAR(100),
    phone VARCHAR(20),

    created_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);
    // ================= COMPANIES =================
    await db.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        company_name VARCHAR(255),
        registration_number VARCHAR(50),
        industry VARCHAR(100),
        contact_person VARCHAR(100),
        designation VARCHAR(100),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // ================= APPLICATIONS =================
    await db.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,

        user_id INT,

        legal_name VARCHAR(255),
        brand_name VARCHAR(255),
        website VARCHAR(255),
        hq_location VARCHAR(255),

        contact_name VARCHAR(255),
        contact_email VARCHAR(255),

        service_scope TEXT,
        customer_count INT,
        employee_count INT,
        years_in_business FLOAT,

        assigned_auditor_id INT,
        assigned_reviewer_id INT,

        status ENUM(
          'SUBMITTED',
          'UNDER_REVIEW_OPS',
          'PRICING_DEFINED',
          'INVOICE_SENT',
          'NEGOTIATION',
          'INVOICE_ACCEPTED',
          'PAID',
          'AUDITOR_ASSIGNED',
          'AUDIT_COMPLETED',
          'REVIEW_IN_PROGRESS',
          'SENT_BACK_TO_AUDITOR',
          'ADMIN_APPROVED',
          'FINAL_APPROVED',
          'REJECTED'
        ) DEFAULT 'SUBMITTED',

        total_amount DECIMAL(10,2) DEFAULT 0,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // ================= APPLICATION ITEMS =================
    await db.query(`
      CREATE TABLE IF NOT EXISTS application_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        application_id INT,
        item_name VARCHAR(255),

        package_type ENUM(
          'VERIFICATION',
          'VERIFICATION_CERTIFICATION',
          'FULL_PACKAGE'
        ),

        price DECIMAL(10,2) DEFAULT 0,
        final_price DECIMAL(10,2) DEFAULT 0,

        status VARCHAR(50) DEFAULT 'PENDING',

        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
      )
    `);

    // ================= EVIDENCES =================
    await db.query(`
      CREATE TABLE IF NOT EXISTS evidences (
        id INT AUTO_INCREMENT PRIMARY KEY,

        application_id INT,

        document_type ENUM(
          'CIN',
          'GST',
          'INCORPORATION',
          'PAN',
          'ADDRESS_PROOF',
          'LICENSE',
          'OTHER'
        ),

        file_name VARCHAR(255),
        drive_file_id VARCHAR(255),
        file_url TEXT,

        uploaded_by INT,

        verified BOOLEAN DEFAULT FALSE,
        verified_by INT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
      )
    `);

    // ================= INVOICES ================= 🔥
    await db.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,

        application_id INT,

        total_amount DECIMAL(10,2),

        status ENUM(
          'DRAFT',
          'SENT',
          'NEGOTIATION',
          'ACCEPTED',
          'PAID'
        ) DEFAULT 'DRAFT',

        version INT DEFAULT 1,

        created_by INT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
      )
    `);

    // ================= INVOICE MESSAGES ================= 🔥
    await db.query(`
      CREATE TABLE IF NOT EXISTS invoice_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,

        invoice_id INT,
        sender_id INT,

        sender_role ENUM(
          'APPLICANT',
          'OPERATIONS',
          'ADMIN'
        ),

        message TEXT,

        message_type ENUM(
          'TEXT',
          'PRICE_UPDATE',
          'SYSTEM'
        ) DEFAULT 'TEXT',

        is_read BOOLEAN DEFAULT FALSE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // ================= CERTIFICATES =================
    await db.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,

        application_id INT,
        item_id INT,

        certificate_name VARCHAR(255),
        drive_file_id VARCHAR(255),
        certificate_url TEXT,

        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES application_items(id) ON DELETE CASCADE
      )
    `);

    await db.query(`CREATE TABLE if not exists auditor_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT,
  full_name VARCHAR(255),
  company_name VARCHAR(255),
  experience_years INT,
  certifications TEXT,
  documents TEXT,

  status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`);
    // ================= ADMIN CREATION =================
    // ================= ADMIN CREATION =================
const [superadmin] = await db.query(
  "SELECT * FROM users WHERE role = 'SUPERADMIN'"
);

if (superadmin.length === 0) {
  const bcrypt = (await import("bcryptjs")).default;

  const password = process.env.SUPERADMIN_PASSWORD || "SuperAdmin@123";
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
  `INSERT INTO users 
   (username, email, password, role, is_verified, is_temp_password, is_active) 
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [
    "superadmin",
    "superadmin@cioverified.com",
    hashedPassword,
    "SUPERADMIN",
    true,
    false,  // ✅ no temp password
    true
  ]
);

  console.log("✅ Super Admin created (superadmin@cioverified.com)");
}

    console.log("✅ Database initialized successfully");

  } catch (error) {
    console.error("❌ DB Init Error:", error.message);
  }
};