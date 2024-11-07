
# Luxembourg Population App

Luxembourg Population App is a Node.js web service for retrieving Luxembourg’s population data by year. This service provides the total population and a breakdown by gender and nationality for a specified year.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install dependencies.

```bash
npm install
```
## Usage

### Starting the server

To start the server, run : 

```bash
node app.js
```
The server will then start on defined port (3000 here).

http://localhost:3000

### Endpoint

GET /population/:year

	•	Description: Fetches the population data for Luxembourg for the specified year.

	•	Parameters:	:year (integer) – the year for which the population data is requested (e.g., 2022).

	•	Response: Returns a JSON object containing population information for Luxembourg in the specified year.

	•	If the exact year is not found, it returns data for the two closest years (before and after the input year).

### Exemple Request 

Retrieve population statistics for 2022 : 

```bash
GET http://localhost:3000/population/2022
```
 ### Exemple Response

```bash
 {
 	"year":"2022-12-31",
	"total_population":660809,
	"demographics":{
		"males":{
			"luxembourgish":171126,
			"foreign":161318,
			"total":332444},
		"females":{
			"luxembourgish":176276,	
			"foreign":152089,
			"total":328365
		}
	}
}
 ```

## Error Handling

The web app handles the following errors : 

#### Invalid Year Format
	
If the input year is not a valid integer, the server responds with a 400 Bad Request status and a message indicating an invalid format.

Exemple:

```bash
GET http://localhost:3000/population/abcdvfdaze
```

Response:

```bash
{
    "error": "Invalid year format. Please enter a valid year."
}
```

### Failed to Retrieve Data from Statec API or year not found: 

If there is an issue connecting to the Statec API, or if the selected year is not found, the server responds with a 500 Internal Server Error status and a message indicating the failure.

Exemple:

```bash
GET http://localhost:3000/population/2029
```

Response:

```bash
{
    "error": "Failed to retrieve data from Statec API.""
}
```


