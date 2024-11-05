const express = require('express');
const app = express();
const PORT = 3000;
const axios = require('axios');

// Middleware to parse JSON requests
app.use(express.json());

// Simple route for population data by year
app.get('/population/:year', async (req, res) => {
    const year = parseInt(req.params.year, 10);

    // Validate the year input
    if (isNaN(year)) {
        return res.status(400).json({ error: "Invalid year format. Please enter a valid year." });
    }

    try {
        // Placeholder: Replace with actual function to retrieve data
        const populationData = await getPopulationData(year);
        res.json(populationData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Placeholder function for population data (you'll implement this with the Statec API)
async function getPopulationData(year) {
    // Example Statec API endpoint (adjust URL as needed)
    const url = `https://lustat.statec.lu/rest/data/LU1,DF_B1100,1.0/C08+C07+C06+C05+C04+C03+C01.A?endPeriod=${year}&lastNObservations=1`;

    try {
        const response = await axios.get(url);
        return response.data; // Modify according to actual response structure
    } catch (error) {
        throw new Error("Failed to retrieve data from Statec API.");
    }
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});