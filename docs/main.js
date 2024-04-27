// JavaScript to toggle the portfolio section
document.getElementById('togglePortfolio').addEventListener('click', function() {
    var portfolioSection = document.getElementById('portfolioSection');
    if (portfolioSection.style.display === 'none') {
        portfolioSection.style.display = 'block';
    } else {
        portfolioSection.style.display = 'none';
    }
});


// JavaScript to handle form submission and display message
document.querySelector('.contact-form form').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    fetch('/send', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        var formMessage = document.getElementById('formMessage');
        formMessage.innerText = data.message;
        formMessage.classList.add('show-message');
        // Remove the message after 4 seconds
        setTimeout(function() {
            formMessage.classList.remove('show-message');
            // Reset the form
            document.querySelector('.contact-form form').reset();
        }, 4000);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');

// SMTP configuration
require('dotenv').config();

const smtpConfig = {
  host: 'mail.spacemail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'contact@xtpatdrive.site',
    pass: process.env.SMTP_PASSWORD,
  },
};

// MongoDB configuration
const mongoConfig = {
  url: 'mongodb+srv://patrickaxinte:' + process.env.MONGO_DB_PASSWORD + '@patrickcluster.cvdctdk.mongodb.net/contact_tree',
  dbName: 'contact_tree',
};

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(smtpConfig);

// Function to send email
async function sendEmail(formData) {
  try {
    // Setup email data
    let mailOptions = {
      from: '"Patrick Axinte" <contact@xtpatdrive.site>',
      to: 'nacc472@gmail.com',
      subject: 'Contact Form Submission',
      text: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
    };

    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    // Insert form data into MongoDB
    const client = new MongoClient(mongoConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      const db = client.db(mongoConfig.dbName);
      const collection = db.collection('contact_form_submissions');
      const result = await collection.insertOne(formData);
      console.log(`New contact form submission inserted with the following id: ${result.insertedId}`);
    } catch (err) {
      console.error('Error inserting form data into MongoDB:', err);
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

