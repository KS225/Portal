import db from "../config/db.js";

export const submitApplication = async (req, res) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // ✅ SAFETY: CHECK USER
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // ✅ SAFE JSON PARSE
    let formData;
    try {
      formData = JSON.parse(req.body.data);
    } catch (err) {
      await conn.rollback();
      return res.status(400).json({ error: "Invalid JSON data" });
    }

    // ✅ GET COMPANY ID
    const [companyRows] = await conn.query(
      `SELECT id FROM companies WHERE user_id = ?`,
      [req.user.id]
    );

    if (!companyRows.length) {
      await conn.rollback();
      return res.status(400).json({
        error: "No company found. Please register first.",
      });
    }

    const companyId = companyRows[0].id;

    // ================= APPLICATION =================
    const [appResult] = await conn.query(
      `INSERT INTO applications (
        user_id,
        company_id,
        legal_name,
        brand_name,
        website,
        hq_location,
        contact_email,
        employee_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, // ✅ removed fallback
        companyId,
        formData.companyDetails?.organisationName || "",
        formData.companyDetails?.brandName || "",
        formData.companyDetails?.website || "",
        `${formData.companyDetails?.city || ""}, ${formData.companyDetails?.state || ""}`,
        formData.companyDetails?.officialEmail || "",
        formData.companyDetails?.companySize || 0,
      ]
    );

    const applicationId = appResult.insertId;

    // ================= OWNERS =================
    for (let o of formData.owners || []) {
      await conn.query(
        `INSERT INTO company_people
        (company_id, name, designation, email, phone, role, aadhaar, pan, experience)
        VALUES (?, ?, ?, ?, ?, 'OWNER', ?, ?, ?)`,
        [
          companyId,
          o.name || "",
          o.designation || "",
          o.email || "",
          o.phone || "",
          o.aadhaar || "",
          o.pan || "",
          o.experience || "",
        ]
      );
    }

    // ================= PARTNERS =================
    for (let p of formData.partners || []) {
      await conn.query(
        `INSERT INTO company_people
        (company_id, name, designation, email, phone, role)
        VALUES (?, ?, ?, ?, ?, 'PARTNER')`,
        [
          companyId,
          p.name || "",
          p.designation || "",
          p.email || "",
          p.phone || "",
        ]
      );
    }

    // ================= PRODUCTS =================
    for (let p of formData.products || []) {
      await conn.query(
        `INSERT INTO products (
          application_id,
          product_name,
          category,
          description,
          industry_served,
          team_size,
          version,
          deployment_type,
          pricing_model,
          customers_count,
          major_clients,
          integrations,
          key_features,
          security_standards,
          uptime_sla,
          roadmap,
          package,
          remark
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          applicationId,
          p.productName || "",
          p.customCategory || p.category || "",
          p.description || "",
          p.customIndustry || p.industryServed || "",
          p.teamSize || "",
          p.version || "",
          p.customDeployment || p.deploymentType || "",
          p.customPricing || p.pricingModel || "",
          p.customersCount || 0,
          p.majorClients || "",
          p.integrations || "",
          p.keyFeatures || "",
          p.securityStandards || "",
          p.uptimeSLA || "",
          p.roadmap || "",
          (p.package || []).join(", "),
          p.remark || "",
        ]
      );

      for (let pkg of p.package || []) {
        await conn.query(
          `INSERT INTO application_items
          (application_id, item_name, package_type)
          VALUES (?, ?, ?)`,
          [applicationId, p.productName || "", pkg]
        );
      }
    }

    // ================= SOLUTIONS =================
    for (let s of formData.solutions || []) {
      await conn.query(
        `INSERT INTO solutions (
          application_id,
          solution_name,
          category,
          description,
          industry_served,
          team_size,
          services_provided,
          projects_completed,
          ongoing_projects,
          customers_count,
          major_clients,
          tools_used,
          integrations,
          methodology,
          certifications,
          package,
          remark
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          applicationId,
          s.solutionName || "",
          s.customCategory || s.category || "",
          s.description || "",
          s.customIndustry || s.industryServed || "",
          s.teamSize || "",
          s.customService || s.servicesProvided || "",
          s.projectsCompleted || 0,
          s.ongoingProjects || 0,
          s.customersCount || 0,
          s.majorClients || "",
          s.toolsUsed || "",
          s.integrations || "",
          s.customMethodology || s.methodology || "",
          s.certifications || "",
          (s.package || []).join(", "),
          s.remark || "",
        ]
      );

      for (let pkg of s.package || []) {
        await conn.query(
          `INSERT INTO application_items
          (application_id, item_name, package_type)
          VALUES (?, ?, ?)`,
          [applicationId, s.solutionName || "", pkg]
        );
      }
    }

    // ================= FILES =================
    const files = req.files || {};

    const saveFile = async (type, fileArr) => {
      if (!fileArr) return;

      for (let file of fileArr) {
        await conn.query(
          `INSERT INTO evidences (
            application_id,
            document_type,
            file_name,
            file_url,
            uploaded_by
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            applicationId,
            type,
            file.originalname,
            file.path,
            req.user.id,
          ]
        );
      }
    };

    await saveFile("GST", files.gstDoc);
    await saveFile("SEZ", files.sezDoc);
    await saveFile("PROFILE", files.companyProfile);
    await saveFile("PITCH", files.pitchDeck);
    await saveFile("CERT", files.certifications);

    await conn.commit();

    res.json({
      success: true,
      message: "Application submitted successfully",
      applicationId,
    });

  } catch (err) {
    await conn.rollback();
    console.error("SUBMIT ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};