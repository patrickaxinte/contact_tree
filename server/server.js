const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');
const path = require('path'); // Add this line to import the 'path' module

const app = express();
const port = 3003;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '..', 'public')));

// SMTP configuration
require('dotenv').config();

const smtpConfig = {
  host: 'mail.spacemail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'contact@xtpatdrive.site',
    pass:  process.env.SMTP_PASSWORD 
  }
};

  
// MongoDB configuration
const mongoConfig = {
  url: 'mongodb+srv://patrickaxinte:' + process.env.MONGO_DB_PASSWORD + '@patrickcluster.cvdctdk.mongodb.net/contact_tree',
  dbName: 'contact_tree'
};
  
app.set('view engine', 'ejs'); // Set EJS as the view engine

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(smtpConfig);

// Function to send email
async function sendEmail(formData) {
    // Setup email data
    let mailOptions = {
      from: '"Patrick Axinte" <contact@xtpatdrive.site>', // sender address
      to: 'nacc472@gmail.com', // list of receivers
      subject: 'Contact Form Submission', // Subject line
      text: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`, // plain text body
    };
  
    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  }
  
  // Function to insert form data into MongoDB
  async function insertFormData(formData) {
    const client = new MongoClient(mongoConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });
  
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      const db = client.db(mongoConfig.dbName);
      const collection = db.collection('contact_form_submissions');
      const result = await collection.insertOne(formData);
      console.log(`New contact form submission inserted with the following id: ${result.insertedId}`);
    } catch (err) {
      console.error(err);
    } finally {
      await client.close();
    }
  }

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// app.get('/', (req, res) => {
//   // Use path.join to create an absolute path, going up one directory level
//   res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });

app.get('/', (req, res) => {
  res.render('index', { message: '' }); // Pass any dynamic content as an object
});


// POST route to handle form submission
app.post('/send', async (req, res) => {
  try {
    // Call sendEmail and insertFormData with the form data
    await sendEmail(req.body);
    await insertFormData(req.body);
    // Send a JSON response with the success message
    res.json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});


app.listen(port, () => console.log(`Server running on port ${port}`));
