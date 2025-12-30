const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Files from Parent Directory
app.use(express.static(path.join(__dirname, '../')));

// MongoDB Connection
// MongoDB Atlas Connection
const dbURI = 'mongodb+srv://learncorpin_db_user:Learncorp%40565@learncorp.qvbdpdi.mongodb.net/?appName=learncorp';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Schema
const MessageSchema = new mongoose.Schema({
    name: String,
    email: String,
    college: String,
    phone: String,
    service: String,
    message: String,
    portfolio: String,
    company: String,
    budget: String,
    date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'learncorp.in@gmail.com', // Updated email
        pass: 'qzih gjrn hxwu qqfg'     // App Password
    }
});

// Routes
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, college, phone, service, message, portfolio, company, budget } = req.body;

        const newMessage = new Message({
            name,
            email,
            college,
            phone,
            service,
            message,
            portfolio,
            company,
            budget
        });

        // Define file path for Excel
        const filePath = path.join(__dirname, 'submissions.xlsx');

        // Map service internal values to readable names
        const serviceMap = {
            'web-dev': 'Full Stack Developer',
            'machine-learning': 'Machine Learning',
            'mobile-app': 'Mobile Application Development',
            'cyber-security': 'Cybersecurity',
            'data-science': 'Data Science',
            'ui-ux': 'UI/UX Design',
            'general': 'General Inquiry',
            'software': 'Custom Software',
            'cloud': 'Cloud Solutions',
            'ai': 'AI & Machine Learning',
            'training': 'Corporate Training'
        };

        const readableService = serviceMap[service] || service;

        // Check if DB is connected before trying to save
        if (mongoose.connection.readyState === 1) {
            try {
                // Note: If Schema doesn't have these fields, MongoDB will ignore them unless strict: false
                await newMessage.save();
            } catch (dbError) {
                console.error('Warning: Could not save to database:', dbError);
            }
        } else {
            console.log('Database not connected. Skipping save to avoid timeout.');
        }

        // --- Save to Excel Logic ---
        try {
            // filePath is defined above
            let workbook;
            let worksheet;
            let existingData = [];

            // Check if file exists
            if (fs.existsSync(filePath)) {
                workbook = XLSX.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                worksheet = workbook.Sheets[sheetName];
                existingData = XLSX.utils.sheet_to_json(worksheet);
            } else {
                workbook = XLSX.utils.book_new();
            }

            // Prepare new row data
            const newRow = {
                'Full Name': name,
                'Email Address': email,
                'Phone Number': phone || 'N/A',
                'Company Name': company || 'N/A',
                'Position / Service': readableService,
                'Budget': budget || 'N/A',
                'Message': message,
                'University / College': college || 'N/A',
                'Portfolio / LinkedIn URL': portfolio || 'N/A'
            };

            // Append new data
            existingData.push(newRow);

            // Create new worksheet with updated data
            // Enforce specific column order
            const headers = [
                'Full Name',
                'Email Address',
                'Phone Number',
                'Company Name',
                'Position / Service',
                'Budget',
                'Message',
                'University / College',
                'Portfolio / LinkedIn URL'
            ];
            const newWorksheet = XLSX.utils.json_to_sheet(existingData, { header: headers });

            // If workbook didn't exist, append sheet, otherwise replace
            if (workbook.SheetNames.length === 0) {
                XLSX.utils.book_append_sheet(workbook, newWorksheet, 'Submissions');
            } else {
                workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
            }

            // Write to file
            XLSX.writeFile(workbook, filePath);
            console.log('✅ Saved to Excel');

        } catch (excelError) {
            console.error('❌ Error saving to Excel:', excelError);
        }
        // ---------------------------

        // Determine Subject based on Service Type
        let subjectLine = 'Internship Applied'; // Default for internships

        // Exact values from index.html contact form
        const projectServices = [
            'general',
            'software',
            'web-app',
            'mobile-app',
            'cloud',
            'ai',
            'corporate-training'
        ];

        if (projectServices.includes(service)) {
            subjectLine = 'Project Inquiry';
        }

        // Email Options
        const mailOptions = {
            from: 'learncorp.in@gmail.com', // Sent from the company email
            replyTo: email, // Reply to the user's email
            to: 'learncorp.in@gmail.com', // Receive at company email
            subject: `${subjectLine} - ${name}`, // Dynamic Subject
            text: `
                ${subjectLine}

                Contact Information:
                --------------------
                Full Name:      ${name}
                Business Email: ${email}
                Company Name:   ${company || 'Not Provided'}
                Phone Number:   ${phone || 'Not Provided'}
                
                Project Specifications:
                -----------------------
                Service Interest: ${readableService}
                Estimated Budget: ${budget || 'Not Provided'}
                
                Detailed Request:
                -----------------
                Project Details:
                ${message}

                (Additional Applicant Data if applicable: University: ${college || 'N/A'}, Portfolio: ${portfolio || 'N/A'})
                (The updated Excel database is attached to this email)
            `,
            attachments: [
                {
                    filename: 'submissions.xlsx',
                    path: filePath // Attach the updated Excel file
                }
            ]
        };

        // Send Email with Promise wrapper and error handling
        try {
            await new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        reject(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        resolve(info);
                    }
                });
            });
            res.status(201).json({ success: true, message: 'Message sent successfully to learncorp.in@gmail.com!' });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // If DB worked but email failed, we still warn the user
            res.status(500).json({ success: false, message: 'Saved to database, but failed to send email. Check server credentials.' });
        }
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});


// Serve index.html on root request
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Export for Vercel
module.exports = app;

// Start Server Only if Running Locally
if (require.main === module) {
    app.listen(PORT, () => {
        console.log('?? Server running on http://localhost:' + PORT);
        console.log('?? To test on mobile, use http://<YOUR_IP_ADDRESS>:' + PORT);
    });
}

