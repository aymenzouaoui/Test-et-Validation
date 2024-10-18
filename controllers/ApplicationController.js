import Application from '../models/application.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/authMiddleware.js';
import User from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
// Function to generate a random secret key
const generateSecretKey = () => {
  return crypto.randomBytes(20).toString('hex');
};
// Import nodemailer library


export async function createApplication(req, res) {
  authenticateUser(req, res, async () => {
    try {
      // Get user ID from authenticated request
      const userId = req.user;
      console.log(userId,"aaaaaaaaaaaaaaa");
      if (!userId) {
        return res.status(404).json({ error: 'User not found' });
      }
      const user = await User.findBy_id(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Destructure necessary fields from request body
      const { name, logo, languageOfDevelopment } = req.body;
      const secretKey = generateSecretKey();

      // Create the application using the Application model
      const application = await Application.create({ name, logo, user, secretKey, etat: true, languageOfDevelopment });

      // Email setup
      const transporter = nodemailer.createTransport({
        // Specify your email service provider and credentials here
        // For example, using Gmail SMTP:
        service: 'gmail',
        auth: {
          user: 'aymen.zouaoui@esprit.tn',
          pass: '223AMT0874a',
        },
      });

      const mailOptions = {
        from: 'aymen.zouaoui@esprit.tn', // Update the 'from' field to the correct email address
        to: user.email,
        subject: 'Your Application Secret Key',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Application Secret Key</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
        
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border: 1px solid #dddddd;
                    border-radius: 5px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                }
        
                .header {
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                }
        
                .content {
                    padding: 20px;
                    text-align: left;
                    line-height: 1.5;
                }
        
                .footer {
                    font-size: 12px;
                    text-align: center;
                    padding: 15px;
                    background-color: #f4f4f4;
                    border-radius: 0 0 5px 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Your Application Secret Key</h2>
                </div>
                <div class="content">
                    <p>Dear ${user.name},</p>
                    <p>Your secret key for the application "${name}" is:</p>
                    <p><strong>${secretKey}</strong></p>
                    <p>Please keep this key secure as it is required for accessing certain features of your application.</p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        
        `
      };

      transporter.sendMail(mailOptions, (emailError, info) => {
        if (emailError) {
          console.error('Error sending email:', emailError);
          // Send an error response indicating the failure to send the email
          return res.status(500).json({ error: 'Failed to send email' });
        } else {
          console.log('Email sent:', info.response);
          // Send a success response indicating the email was sent successfully
          return res.status(201).json(application);
        }
      });
    } catch (error) {
      console.error('Error creating application:', error);
      res.status(500).json({ error: 'An error occurred while creating the application' });
    }
  });
}


export async function getAllApplications(req, res) {
authorizeAdmin(req, res, async () => {
  try {
    const applications = await Application.find();
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des applications' });
  }
});
}


export async function getApplicationById(req, res) {

  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application non trouvée' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'application' });
  }
}

export async function updateApplication(req, res) {
  try {
    const { name, description } = req.body;
    const application = await Application.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    if (!application) {
      return res.status(404).json({ error: 'Application non trouvée' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'application' });
  }
}

export async function deleteApplication(req, res) {
  try {
    console.log('req', req.params.id);
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application non trouvée' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'application' });
  }
}
export async function getApplicationsByUserId(req, res) {
  // Use authenticateUser middleware to ensure user is authenticated
  authenticateUser(req, res, async () => {
   
    try {
      console.log("Fetching applications by user ID");

      console.log(req);
      // Get user ID from authenticated request
      const applications = await Application.find({ user: req.user }); // Fetch applications for the user
      console.log(applications);
      res.status(200).json(applications); // Respond with fetched applications
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ error: 'Error fetching user applications' }); // Handle error
    }
  });
}