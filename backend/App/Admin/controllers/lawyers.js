import { deleteImageByPublicId, deleteImageByUrl, uploadFileToCloud } from "../../../services/cloudinary.js";
import { sendMail } from "../../../services/mail.js";
import { Abuse } from "../../Users/controllers/abuse.js";
import lawyerModel from "../models/lawyers.js";

async function SaveLawyer(req, res) {
  let img = null
  try {
    let { name, email, phone, desc, categories } = req.body
    console.log(name, email, phone, desc, categories)
    let images = req.file ? req.file.path : '/profile.png';
    if (!name || !email || !phone || !desc || !categories) return res.send({ status: 7 })
    if (!Array.isArray(categories)) categories = categories ? categories.split(',').map(cat => cat.trim()) : [];
    img = await uploadFileToCloud(req.file.path)
    console.log(img.url, typeof (phone))
    const l = new lawyerModel({
      name,
      email,
      phone,
      desc,
      categories,
      images: img.url
    })
    await l.save()
    return res.send({ status: 1, msg: "lawyer saved succesfully" })
  }
  catch (err) {
    if (img) {
      try {
        await deleteImageByUrl(img.url)
      }
      catch (err) {
        console.log(err)
      }
    }
    console.log(err)
    return res.send({ status: 0, msg: "error occured while saving lawyer" })
  }
}

async function fetchLawyer(req, res) {
  try {
    let r = await lawyerModel.find()
    if (!r) return res.send({ status: 2, msg: "No Lawyers found" })
    return res.send({ status: 1, lawyers: r })
  }
  catch (err) {
    console.log(err)
    return res.send({ status: 0, msg: "Error occured while fetching lawyers" })
  }
}

async function UpdateLawyers(req, res) {
  try {
    let { id, name, email, phone, desc, categories } = req.body
    categories = categories ? categories.split(',').map(cat => cat.trim()) : [];
    let r = await lawyerModel.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      desc,
      categories
    })
    if (!r) return res.send({ status: 0, msg: "Lawyer not found" })
    return res.send({ status: 1, msg: "Lawyer updated successfully" })
  }
  catch (err) {
    console.log(err)
    return res.send({ status: 0, msg: "Error occured while updating lawyer" })
  }
}

async function sendMessageToLawyer(req, res) {
  try {
    let { query, email } = req.body
    if (!query || !email) return res.send({ status: 7, msg: "Invalid input" })
    let subject = 'Regarding Consultation'
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
                Trusted Legal Consultation Platform
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#1f2937;">

              <h2 style="margin-top:0; font-size:20px; color:#0f172a;">
                New Client Consultation Request
              </h2>

              <p style="font-size:15px; line-height:1.6; color:#374151;">
                A user from <strong>Apna Vakil</strong> has requested a legal consultation.
              </p>

              <!-- User Message -->
              <h3 style="font-size:16px; color:#1e3a8a; margin-bottom:10px;">
                Client Message
              </h3>

              <div style="margin:12px 0 24px; padding:18px; background-color:#f1f5f9; border-left:5px solid #1e3a8a; border-radius:6px;">
                <p style="margin:0; font-size:15px; line-height:1.6; color:#111827;">
                  ${query}
                </p>
              </div>

               <!-- USER DETAILS SECTION -->
              <div style="margin:24px 0; padding:20px; background-color:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                <h3 style="margin-top:0; font-size:16px; color:#1e3a8a;">
                  Client Details
                </h3>

                <p style="margin:8px 0; font-size:14px;">
                  <strong>Name:</strong> ${req.user.name}
                </p>

                <p style="margin:8px 0; font-size:14px;">
                  <strong>Email:</strong> ${req.user.email}
                </p>
              </div>

              <p style="font-size:14px; color:#374151;">
                Please review the message and respond to the client at your convenience
                through the Apna Vakil platform.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f1f5f9; padding:18px; text-align:center; font-size:13px; color:#64748b;">
              © 2026 Apna Vakil · All Rights Reserved<br />
              Mumbai, India
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
    let mail = await sendMail(email, subject, text)
    if (!mail) return res.send({ status: 2, msg: "Message not send" })
    return res.send({ status: 1, msg: "Message send successfully" })

  }
  catch (err) {
    console.log(err)
    return res.send({ status: 0, msg: "Internal server error" })
  }
}

export { SaveLawyer, fetchLawyer, UpdateLawyers, sendMessageToLawyer }