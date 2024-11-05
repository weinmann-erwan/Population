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
        const populationData = await getPopulationData(year);
        res.json(populationData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch and format population data from Statec API
async function getPopulationData(year) {
    const url = `https://lustat.statec.lu/rest/data/LU1,DF_B1100,1.0/C08+C07+C06+C05+C04+C03+C01.A?endPeriod=${year}&lastNObservations=1`;

    try {
        const response = await axios.get(url);
        return formatPopulationData(response.data); 
    } catch (error) {
        throw new Error("Failed to retrieve data from Statec API.");
    }
}

// Format population data based on the API response structure
function formatPopulationData(data) {
    // Initialize data structure
    const population = {
        year: data.structure.dimensions.observation[0].values[0].name, // Extract year
        total_population: 0,
        demographics: {
            males: { luxembourgish: 0, foreign: 0, total: 0 },
            females: { luxembourgish: 0, foreign: 0, total: 0 }
        }
    };

    // Map each series to the relevant demographic group based on specification
    const series = data.dataSets[0].series;
    for (let key in series) {
        const specification = data.structure.dimensions.series[0].values[parseInt(key[0])].id; // Series specification code
        const populationValue = series[key].observations["0"] ? series[key].observations["0"][0] : 0;

        // Map specification codes to corresponding fields in population structure
        switch (specification) {
            case "C01": // Total population
                population.total_population = populationValue;
                break;
            case "C03": // Total males
                population.demographics.males.total = populationValue;
                break;
            case "C04": // Luxembourgish males
                population.demographics.males.luxembourgish = populationValue;
                break;
            case "C05": // Foreign males
                population.demographics.males.foreign = populationValue;
                break;
            case "C06": // Total females
                population.demographics.females.total = populationValue;
                break;
            case "C07": // Luxembourgish females
                population.demographics.females.luxembourgish = populationValue;
                break;
            case "C08": // Foreign females
                population.demographics.females.foreign = populationValue;
                break;
        }
    }

    return population;
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});