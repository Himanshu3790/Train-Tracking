document.addEventListener('DOMContentLoaded', () => {
    // Get the elements by their IDs
    const trainNameElement = document.getElementById('train-name');
    const trainMessageElement = document.getElementById('train-message');
    const updatedTimeElement = document.getElementById('updated-time');
    const trainDataElement = document.getElementById('train-data');
    const trainNumberInput = document.getElementById('train-number-input');
    const fetchTrainDataBtn = document.getElementById('fetch-train-data-btn');

    // Add click event listener to the button
    fetchTrainDataBtn.addEventListener('click', () => {
        const trainNumber = trainNumberInput.value.trim(); // Get train number from input

        if (!trainNumber) {
            alert('Please enter a valid train number.');
            return;
        }

        // Call the fetchTrainData function with the entered train number
        fetchTrainData(trainNumber);
    });

    // Function to fetch train data
    function fetchTrainData(trainNumber) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // CORS proxy
        const targetUrl = `https://rappid.in/apis/train.php?train_no=${trainNumber}`;
        const apiUrl = proxyUrl + targetUrl;

        console.log("Fetching data from API:", apiUrl); // Debugging API URL

        // Fetch API data
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("API Response:", data); // Debugging API response

                if (data.success) {
                    updateTrainDetails(data);
                } else {
                    showError('Failed to retrieve train data. Please try again later.');
                }
            })
            .catch(error => {
                console.error('Error fetching train data:', error);
                showError('An error occurred while fetching train data.');
            });
    }

    // Function to update the train details on the page
    function updateTrainDetails(data) {
        trainNameElement.textContent = data.train_name || 'Train Details';
        trainMessageElement.textContent = data.message || 'Train is running on time.';
        updatedTimeElement.textContent = `Last updated: ${data.updated_time || 'N/A'}`;

        // Populate train data in the table
        if (data.data && data.data.length > 0) {
            let rows = '';
            data.data.forEach(station => {
                rows += `
                    <tr>
                        <td>${station.station_name}</td>
                        <td>${station.distance}</td>
                        <td>${station.timing}</td>
                        <td>${station.delay}</td>
                        <td>${station.platform}</td>
                        <td>${station.halt}</td>
                    </tr>
                `;
            });
            trainDataElement.innerHTML = rows;
        } else {
            trainDataElement.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">No station data available.</td>
                </tr>
            `;
        }
    }

    // Function to show error messages
    function showError(message) {
        trainMessageElement.textContent = message;
        trainDataElement.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger">${message}</td>
            </tr>
        `;
    }
});
