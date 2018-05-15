import express from 'express';
import path from 'path';

const app = express();


//--- route ---//
app.post('/api/auth', (req, res) => {
    res.status(400).json({
        errors: {
            global: "Invalid credentials"
        }
    })
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(8080, (err, res) => {
    if (err) throw err;
    console.log('Server running on localhost:8080')
})