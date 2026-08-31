import { deleteImageByPublicId, deleteImageByUrl, uploadFileToCloud } from "../../../services/cloudinary.js";
import { sendMail } from "../../../services/mail.js";
import { Abuse } from "../../Users/controllers/abuse.js";
import lawyerModel from "../models/lawyers.js";
import ConnectionRequest from "../../Users/models/ConnectionRequest.js";

async function SaveLawyer(req, res) {
  let img = null;
  try {
    let { name, email, phone, desc, categories, barNumber, experience, speciality, fee, city, address } = req.body;
    let images = '/profile.png';
    if (!name || !email || !phone) return res.send({ status: 7, msg: "Name, email, and phone are required" });
    
    if (!Array.isArray(categories)) {
      categories = categories ? categories.split(',').map(cat => cat.trim()) : [];
    }

    if (req.file) {
      img = await uploadFileToCloud(req.file.path);
      images = img.url;
    }

    const l = new lawyerModel({
      name,
      email,
      phone,
      desc: desc || "Experienced legal practitioner specializing in comprehensive legal advisory and litigation.",
      categories,
      barNumber: barNumber || "",
      experience: experience || "5+ Years",
      speciality: speciality || "High Court & Civil Advocate",
      fee: fee || "₹1,500 / consultation",
      city: city || "New Delhi",
      address: address || "",
      images,
      verified: true
    });
    await l.save();
    return res.send({ status: 1, msg: "Lawyer saved successfully" });
  } catch (err) {
    if (img) {
      try {
        await deleteImageByUrl(img.url);
      } catch (err) {
        console.log(err);
      }
    }
    console.log(err);
    return res.send({ status: 0, msg: "Error occurred while saving lawyer" });
  }
}

async function fetchLawyer(req, res) {
  try {
    let r = await lawyerModel.find().sort({ createdAt: -1 });
    if (!r) return res.send({ status: 2, msg: "No Lawyers found" });
    return res.send({ status: 1, lawyers: r });
  } catch (err) {
    console.log(err);
    return res.send({ status: 0, msg: "Error occurred while fetching lawyers" });
  }
}

async function getLawyerById(req, res) {
  try {
    const { id } = req.params;
    let lawyer = await lawyerModel.findById(id);
    if (!lawyer) {
      // Fallback search by email if needed
      lawyer = await lawyerModel.findOne({ email: id });
    }
    if (!lawyer) return res.send({ status: 0, msg: "Lawyer not found" });
    return res.send({ status: 1, lawyer });
  } catch (err) {
    console.log(err);
    return res.send({ status: 0, msg: "Error fetching lawyer details" });
  }
}

async function UpdateLawyers(req, res) {
  try {
    let { id, name, email, phone, desc, categories, barNumber, experience, speciality, courts, languages, fee, city, address } = req.body;
    if (!Array.isArray(categories) && categories) {
      categories = categories.split(',').map(cat => cat.trim());
    }
    if (!Array.isArray(courts) && courts) {
      courts = courts.split(',').map(c => c.trim());
    }
    if (!Array.isArray(languages) && languages) {
      languages = languages.split(',').map(l => l.trim());
    }

    let updateData = {
      name,
      email,
      phone,
      desc,
      categories,
      barNumber,
      experience,
      speciality,
      courts,
      languages,
      fee,
      city,
      address
    };

    let r = await lawyerModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!r) return res.send({ status: 0, msg: "Lawyer not found" });
    return res.send({ status: 1, msg: "Lawyer updated successfully", lawyer: r });
  } catch (err) {
    console.log(err);
    return res.send({ status: 0, msg: "Error occurred while updating lawyer" });
  }
}

// Get logged-in lawyer's profile for the Lawyer Panel
async function getLawyerProfile(req, res) {
  try {
    if (!req.user) return res.send({ status: 0, msg: "Authentication required" });
    let lawyer = await lawyerModel.findOne({ email: req.user.email });
    if (!lawyer) {
      // Auto-create if user has role lawyer
      lawyer = new lawyerModel({
        userId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || "",
        desc: `Advocate ${req.user.name}, verified legal professional.`,
        categories: ["Civil Law", "Corporate Law"],
        speciality: "Advocate & Legal Advisor",
        experience: "5+ Years",
        fee: "₹1,500 / consultation",
        verified: true
      });
      await lawyer.save();
    }
    return res.send({ status: 1, lawyer });
  } catch (err) {
    console.log(err);
    return res.send({ status: 0, msg: "Error fetching lawyer profile" });
  }
}

// Update logged-in lawyer's profile with optional picture upload
async function updateLawyerProfile(req, res) {
  let img = null;
  try {
    if (!req.user) return res.send({ status: 0, msg: "Authentication required" });
    let { name, phone, desc, categories, barNumber, experience, speciality, courts, languages, fee, city, address } = req.body;

    let lawyer = await lawyerModel.findOne({ email: req.user.email });
    if (!lawyer) {
      lawyer = new lawyerModel({
        userId: req.user._id,
        email: req.user.email,
        name: name || req.user.name
      });
    }

    if (req.file) {
      img = await uploadFileToCloud(req.file.path);
      lawyer.images = img.url;
    }

    if (name) lawyer.name = name;
    if (phone !== undefined) lawyer.phone = phone;
    if (desc !== undefined) lawyer.desc = desc;
    if (barNumber !== undefined) lawyer.barNumber = barNumber;
    if (experience !== undefined) lawyer.experience = experience;
    if (speciality !== undefined) lawyer.speciality = speciality;
    if (fee !== undefined) lawyer.fee = fee;
    if (city !== undefined) lawyer.city = city;
    if (address !== undefined) lawyer.address = address;

    if (categories) {
      lawyer.categories = Array.isArray(categories) ? categories : categories.split(',').map(c => c.trim()).filter(Boolean);
    }
    if (courts) {
      lawyer.courts = Array.isArray(courts) ? courts : courts.split(',').map(c => c.trim()).filter(Boolean);
    }
    if (languages) {
      lawyer.languages = Array.isArray(languages) ? languages : languages.split(',').map(l => l.trim()).filter(Boolean);
    }

    await lawyer.save();
    return res.send({ status: 1, msg: "Profile updated successfully", lawyer });
  } catch (err) {
    if (img) {
      try {
        await deleteImageByUrl(img.url);
      } catch (e) {
        console.log(e);
      }
    }
    console.log(err);
    return res.send({ status: 0, msg: "Error updating lawyer profile" });
  }
}

// Get incoming connection requests for this lawyer
async function getLawyerRequests(req, res) {
  try {
    if (!req.user) return res.send({ status: 0, msg: "Authentication required" });
    const requests = await ConnectionRequest.find({ lawyerEmail: req.user.email }).sort({ createdAt: -1 });
    return res.send({ status: 1, requests: requests || [] });
  } catch (err) {
    console.log(err);
    return res.send({ status: 0, msg: "Error fetching consultation requests" });
  }
}

// Update status of a connection request (active, rejected, pending, completed)
async function updateRequestStatus(req, res) {
  try {
    const { requestId, status, responseMessage } = req.body;
    if (!requestId || !status) return res.send({ status: 7, msg: "Missing fields" });

    // Normalize accepted -> active
    const normalizedStatus = status === "accepted" ? "active" : status;

    const updated = await ConnectionRequest.findByIdAndUpdate(
      requestId,
      {
        status: normalizedStatus,
        responseMessage: responseMessage || ""
      },
      { new: true }
    );

    if (!updated) return res.send({ status: 0, msg: "Request not found" });
    return res.send({ status: 1, msg: `Request marked as ${normalizedStatus}`, request: updated });
  } catch (err) {
    console.log(err);
    return res.send({ status: 0, msg: "Error updating request status" });
  }
}

// Get logged-in client's connections with advocates
async function getUserConnections(req, res) {
  try {
    if (!req.user) return res.send({ status: 0, msg: "Authentication required" });
    const requests = await ConnectionRequest.find({
      $or: [
        { userId: req.user._id },
        { clientEmail: req.user.email }
      ]
    }).sort({ createdAt: -1 }).lean();

    // Attach lawyer details to each request
    const lawyerEmails = [...new Set(requests.map(r => r.lawyerEmail))];
    const lawyers = await lawyerModel.find({ email: { $in: lawyerEmails } }).lean();
    const lawyerMap = {};
    lawyers.forEach(l => {
      lawyerMap[l.email] = l;
    });

    const enriched = requests.map(r => ({
      ...r,
      lawyer: lawyerMap[r.lawyerEmail] || {
        name: "Advocate",
        email: r.lawyerEmail,
        speciality: "Legal Practitioner",
        images: "/profile.png"
      }
    }));

    return res.send({ status: 1, connections: enriched });
  } catch (err) {
    console.log(err);
    return res.send({ status: 0, msg: "Error fetching user connections" });
  }
}

// Helper to mask phone numbers and email addresses to protect privacy
function maskDirectContactInfo(text) {
  if (!text || typeof text !== "string") return text;
  let masked = text;
  // Mask phone numbers (10 digits, +91, with or without spaces/dashes)
  masked = masked.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, "[Contact Info Restricted]");
  masked = masked.replace(/\b[6-9]\d{9}\b/g, "[Phone Restricted]");
  // Mask email addresses
  masked = masked.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[Email Restricted]");
  return masked;
}

// Connect / Send message to lawyer + save in ConnectionRequest DB
async function sendMessageToLawyer(req, res) {
  try {
    let { query, email, caseType, name } = req.body;
    if (!query || !email) return res.send({ status: 7, msg: "Message query and lawyer email are required" });

    // Mask any direct contact numbers or emails typed in the query
    const sanitizedQuery = maskDirectContactInfo(query);
    const clientName = (req.user && req.user.name) ? req.user.name : (name || "ApnaVakil Client");
    const clientEmail = (req.user && req.user.email) ? req.user.email : (req.body.clientEmail || "client@apnavakil.in");

    // Save in ConnectionRequest Collection without sharing direct raw phone details
    try {
      const connReq = new ConnectionRequest({
        lawyerEmail: email,
        userId: req.user ? req.user._id : null,
        clientName,
        clientEmail,
        clientPhone: "[Protected on Platform]",
        caseType: caseType || "Legal Consultation Request",
        message: sanitizedQuery,
        status: "pending"
      });
      await connReq.save();
    } catch (e) {
      console.log("Error saving connection request record:", e);
    }

    let subject = `New Legal Consultation Request from ${clientName} - Apna Vakil`;
    let text = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>New Consultation Request - Apna Vakil</title>
</head>

<body style="margin:0; padding:0; background-color:#f5f7fb; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fb; padding:30px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#0f172a,#1e3a8a); padding:26px; text-align:center;">
              <h1 style="margin:0; font-size:26px; color:#ffffff;">
                Apna Vakil
              </h1>
              <p style="margin:6px 0 0; color:#cbd5e1; font-size:14px;">
                Secure Advocate Consultation Network
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#1f2937;">

              <h2 style="margin-top:0; font-size:20px; color:#0f172a;">
                New Client Connection Request
              </h2>

              <p style="font-size:15px; line-height:1.6; color:#374151;">
                A client on <strong>Apna Vakil</strong> has sent you a direct consultation inquiry regarding: <strong>${caseType || "Legal Consultation"}</strong>.
              </p>

              <!-- User Message -->
              <h3 style="font-size:16px; color:#1e3a8a; margin-bottom:10px;">
                Case Query Description
              </h3>

              <div style="margin:12px 0 24px; padding:18px; background-color:#f1f5f9; border-left:5px solid #1e3a8a; border-radius:6px;">
                <p style="margin:0; font-size:15px; line-height:1.6; color:#111827;">
                  ${sanitizedQuery}
                </p>
              </div>

               <!-- PRIVACY NOTICE SECTION -->
              <div style="margin:24px 0; padding:18px; background-color:#eff6ff; border-radius:8px; border:1px solid #bfdbfe;">
                <h3 style="margin-top:0; font-size:15px; color:#1e3a8a;">
                  🔒 Client Privacy & Platform Security
                </h3>
                <p style="margin:6px 0 0; font-size:13px; line-height:1.5; color:#1e40af;">
                  Client: <strong>${clientName}</strong><br />
                  Direct personal contact details are kept strictly confidential. Please log in to your <strong>Apna Vakil Lawyer Panel</strong> to review and accept/reject this request.
                </p>
              </div>

              <p style="font-size:14px; color:#374151;">
                Manage this inquiry securely from your <strong>Apna Vakil Lawyer Panel</strong>.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f1f5f9; padding:18px; text-align:center; font-size:13px; color:#64748b;">
              © 2026 Apna Vakil · Legal Intelligence & Practitioner Platform<br />
              India
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
    let mail = await sendMail(email, subject, text);
    return res.send({ status: 1, msg: "Connection request sent successfully to advocate" });
  } catch (err) {
    console.log(err);
    return res.send({ status: 0, msg: "Internal server error" });
  }
}

export {
  SaveLawyer,
  fetchLawyer,
  getLawyerById,
  UpdateLawyers,
  getLawyerProfile,
  updateLawyerProfile,
  getLawyerRequests,
  updateRequestStatus,
  sendMessageToLawyer,
  getUserConnections
};