import nodemailer from "nodemailer";
import { mailPassword, mailUsername } from "../setting";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailUsername,
    pass: mailPassword,
  },
});

const formatMessage = (name: string, email: string, password: string) => {
  return `Dear ${name},<br>
    <br>
    I hope this email finds you well.<br>
    I'm delighted to provide you with the access credentials to the April app.<br>
    Below are your login details:
    <br>
    Email: <strong>${email}</strong><br>
    Password: <strong>${password}</strong><br>
    <br>
    Please make sure to keep this information secure and do not disclose it to anyone else.<br>
    <br>
    Best regards,<br>
    <br>
    April
    `;
};

export const sendMail = (to: string, name: string, password: string) => {
  var mailOptions = {
    from: "April <no.reply.course.management@gmail.com>",
    to: to,
    subject: "April Password Information",
    html: formatMessage(name, to, password),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
