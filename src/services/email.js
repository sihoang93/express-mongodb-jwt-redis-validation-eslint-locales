/* eslint-disable no-undef */
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async config => {
  try {
    const { to, from, subject, html } = config;
    await sgMail.send({ to, from, subject, html });
  } catch (err) {
    if (error.response) {
      console.error(error.response.body);
    }
  }
};
