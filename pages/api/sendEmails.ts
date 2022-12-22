// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { uniqueNamesGenerator, Config, animals, adjectives, colors } from 'unique-names-generator';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    console.log("Email sender API invoked: ", req.body);
    const config: Config = {
      dictionaries: [adjectives, colors, animals],
      separator: ' '
    }
    const email = req.body.to_email_address;
    const no_of_emails = parseInt(req.body.no_of_emails);

    if (!email || !no_of_emails) {
      console.log("Email and/or number of emails not given. Aborting!");
      return res.status(400).json({name: "Email and/or number of emails not given. Aborting!"})
    }
    
    for (let x = 0; x < no_of_emails; x++) {
      const characterName: string = await uniqueNamesGenerator(config);
      console.log("Created the subject");

      let transporter = await nodemailer.createTransport(process.env.EMAIL_SMTP_SERVER);

      console.log("Prepare to board!");
      
      let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM, // sender address
        to: email, // list of receivers
        subject: characterName, // Subject line
        //text: "Ahoy!", // plain text body
        html: "<b>Ahoy!!!</b>", // html body
      });
      console.log("Email sent: ", info); 
    }
    
    return res.status(200).json({ name: 'All emails sent successfully!' });
  } catch (error) {
    console.log("There was an error sending out emails: ", error);
    return res.status(400).json({ name: 'There was an error sending out emails' });
  }
}
