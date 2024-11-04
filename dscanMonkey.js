
(function() {
    'use strict';
    var lastScan;
    // Event listener for paste events
    document.addEventListener('paste', (event) => {
        // Get the pasted text from the clipboard data
        lastScan = JSON.parse(localStorage.getItem('lastFactionScan'));

        console.log(lastScan);
        const loadedArray = JSON.parse(localStorage.getItem('myArray'));
        if (loadedArray) {
            console.log(loadedArray); // Array is loaded successfully
        } else {
            console.log('No array found in localStorage.');
        }
        let elapsedTime = 0;
        var newInterval = setInterval(() => {
            gatherAndDisplayFactionIds();
            elapsedTime += 5000;
            if (elapsedTime >= 30000) {
                clearInterval(newInterval); // Stop running the script after 30 seconds
            }
        }, 5000);

    });
    // Function to gather and display the count of faction IDs
    function gatherAndDisplayFactionIds() {
        // Select all parent divs with id 'cell-3-undefined'
        const parentDivs = document.querySelectorAll("#cell-3-undefined");

        // Use 'let' to declare factionIds so it can be modified
        let factionIds = [];

        // Iterate through each parent div and collect faction elements
        parentDivs.forEach(parentDiv => {
            // Select all child elements within each parent div that have 'faction' in their id
            const factionElements = parentDiv.querySelectorAll("[id*='faction']");
            // Collect the ids from each element and add them to factionIds
            factionIds = factionIds.concat(Array.from(factionElements).map(element => element.id));
        });

        // Extract the values after the underscore and group them with counts
        const factionGroups = {};

        factionIds.forEach(id => {
            // Extract the part after the underscore
            const valueAfterUnderscore = id.split("_")[1];

            // Increment the count for this group
            if (factionGroups[valueAfterUnderscore]) {
                factionGroups[valueAfterUnderscore]++;
            } else {
                factionGroups[valueAfterUnderscore] = 1;
            }
        });

        localStorage.setItem('lastFactionScan', JSON.stringify(factionGroups));
        // Check if the display element already exists and remove it to update
        const existingDisplayDiv = document.getElementById("faction-groups-display");
        if (existingDisplayDiv) {
            existingDisplayDiv.remove();
        }

        // Create a new element to display the counts of faction IDs
        const displayDiv = document.createElement('div');
        displayDiv.id = "faction-groups-display"; // Set an ID for easy reference
        displayDiv.style.backgroundColor = "#161d31";
        displayDiv.style.padding = "10px";
        displayDiv.style.border = "1px solid #ccc";
        displayDiv.style.marginBottom = "10px";        
        displayDiv.style.position = "relative";        
        displayDiv.style.width = "280px";
        displayDiv.style.float = "left";

        // Format the output for display
        let outputHTML = "<h3>Faction Groups</h3>  Send ISK to Servanda";
        outputHTML += `<p>Number of Groups: ${Object.keys(factionGroups).length}</p>`;
        for (const [key, count] of Object.entries(factionGroups)) {
            let change = 0;
            if(lastScan && lastScan[key]){
            change = count - lastScan[key]
            }
            outputHTML += `<p ><strong >
            <img class="" src="https://images.evetech.net/corporations/${key}/logo" alt="" height="32" width="32">
            </strong></p><p> <span padding style="font-size: x-large; padding-left: 5px;" >  ${count} </span> change: +/- ${change}</p>`;
        }

        // Set the inner HTML of the display div
        displayDiv.innerHTML = outputHTML;

        // Append the display div at the top of the page
        document.body.prepend(displayDiv);
    }

    // Run the script every 5 seconds for the first 30 seconds
    let elapsedTime = 0;
    const interval = setInterval(() => {
        gatherAndDisplayFactionIds();
        elapsedTime += 5000;
        if (elapsedTime >= 30000) {
            clearInterval(interval); // Stop running the script after 30 seconds
        }
    }, 5000);
})();
