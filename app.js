const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.get('/api/capture-screenshot', async (req, res) => {
    try {
        debugger
        const url = req.query.url;
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }
        console.log(req.query)
        const browser = await puppeteer.launch({ headless: "new" });
        // Update launch options     
        const page = await browser.newPage();

        // Set the viewport size to capture the entire dashboard
        await page.setViewport({ width: 1920, height: 2400 });
        // const dashboardUrl = `http://localhost:4200/#/app/home-dashboard?Id=${dashboardId}`;
        // Navigate to your Angular app's URL
        await page.goto(url, { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 15000));

        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        // Capture a screenshot of the entire dashboard
        const screenshotBuffer = await page.screenshot({ fullPage: true });

        // Send the screenshot as a response
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': screenshotBuffer.length,
            'Content-Disposition': 'attachment; filename="dashboard-screenshot.png"'
        });
        res.end(screenshotBuffer);

        await browser.close();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
