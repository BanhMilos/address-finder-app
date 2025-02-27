document.addEventListener("DOMContentLoaded", function () {
    const provinceSelect = document.getElementById("province");
    const districtSelect = document.getElementById("district");
    const wardSelect = document.getElementById("ward");
    const addressInput = document.getElementById("specific-address");
    const searchInput = document.getElementById("search");
    const resultMessage = document.getElementById("result-message");
    const searchResultMessage = document.getElementById("search-result-message");
    const searchButton = document.getElementById("search-button");

    const API_BASE_URL = "https://address-finder-app.onrender.com";

    let allLocations = [];
    let searchResult = [];
    // Fetch all location data on page load
    const loadAllLocations = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/locations`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            allLocations = await response.json();
        } catch (error) {
            console.error("Error loading locations:", error);
        }
    };

    // Fetch and populate provinces
    const loadProvinces = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/provinces`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const provinces = await response.json();
            provinceSelect.innerHTML = '<option value="">--Select Province--</option>';
            provinces.forEach(province => {
                const option = document.createElement("option");
                option.value = province["ID Tỉnh thành"];
                option.textContent = province["Tên tỉnh thành"];
                provinceSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading provinces:", error);
        }
    };

    // Fetch districts based on province selection
    const loadDistricts = async (provinceId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/districts/${provinceId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const districts = await response.json();
            districtSelect.innerHTML = '<option value="">--Select District--</option>';
            wardSelect.innerHTML = '<option value="">--Select Ward--</option>';
            districts.forEach(district => {
                const option = document.createElement("option");
                option.value = district["ID quận huyện"];
                option.textContent = district["Tên Quận huyện"];
                districtSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading districts:", error);
        }
    };

    // Fetch wards based on district selection
    const loadWards = async (districtId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/wards/${districtId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const wards = await response.json();
            wardSelect.innerHTML = '<option value="">--Select Ward--</option>';
            wards.forEach(ward => {
                const option = document.createElement("option");
                option.value = ward["ID Phường xã"];
                option.textContent = ward["Tên Phường xã"];
                wardSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading wards:", error);
        }
    };

    // Search function 
    const searchLocations = (query) => {
        if (!query) return;
        searchButton.disabled = true;
        searchInput.disabled = true;
        searchResultMessage.textContent = "Searching...";
        query = query.toLowerCase();
        const words = query.split(/\s+/);

        const results = allLocations.filter(loc => {
            let fullName = "";

            if (loc["Tên tỉnh thành"]) {
                fullName = loc["Tên tỉnh thành"].toLowerCase();
            }
            else if (loc["Tên đầy đủ"] && loc["ID quận huyện"]) {
                fullName = loc["Tên đầy đủ"].toLowerCase();
            }
            else if (loc["Tên Phường xã"] && loc["ID Quận huyện"]) {
                const district = allLocations.find(d => d["ID quận huyện"] === loc["ID Quận huyện"] && d["Tên đầy đủ"]);
                const districtName = district ? district["Tên đầy đủ"] : "";
                fullName = `${loc["Tên Phường xã"]} ${districtName}`.toLowerCase();
            }
            // Exact match
            if (fullName.includes(query)) return true;
            console.log("wtf");

            // Abbreviation match 
            const checkAbbreviation = (field) => {
                if (loc[field] && typeof loc[field] === 'string') {
                    const abbreviation = loc[field]
                        .split(" ")
                        .map(word => word[0])
                        .join("")
                        .toLowerCase();
                    if (abbreviation === query) return true;
                }
                return false;
            };

            if (checkAbbreviation("Tên tỉnh thành")) return true;

            if (checkAbbreviation("Tên Quận huyện")) return true;

            if (checkAbbreviation("Tên Phường xã")) return true;

            return false;
        });
        searchButton.disabled = false;
        searchInput.disabled = false;
        searchResultMessage.textContent = `Found ${results.length} result(s).`;
        displaySearchResults(results);
    };


    // Display selected address
    const displayAddress = () => {
        const provinceId = provinceSelect.value;
        const districtId = districtSelect.value;
        const wardId = wardSelect.value;
        const province = provinceSelect.options[provinceSelect.selectedIndex]?.textContent || "";
        const district = districtSelect.options[districtSelect.selectedIndex]?.textContent || "";
        const ward = wardSelect.options[wardSelect.selectedIndex]?.textContent || "";
        const specificAddress = addressInput.value.trim();

        if (!provinceId || !districtId || !wardId) {
            resultMessage.textContent = "Please select Province, District, and Ward.";
            return;
        }

        // Format: Province ID, District ID, Ward ID, Specific address (if provided) Ward name
        let formattedAddress = `${provinceId}, ${districtId}, ${wardId}`;
        if (specificAddress) {
            formattedAddress += `, ${specificAddress}`;
        }
        formattedAddress += ` ${ward}`;

        resultMessage.textContent = formattedAddress;
    };

    // Search results
    const displaySearchResults = (results) => {
        if (results.length === 0) {
            searchResultMessage.textContent = "No results found.";
            return;
        }

        resultMessage.innerHTML = results
            .map(loc => {
                let fullName = "";
                if (loc["Tên tỉnh thành"]) {
                    fullName = loc["Tên tỉnh thành"];
                } else if (loc["Tên đầy đủ"] && loc["ID Quận huyện"]) {
                    fullName = loc["Tên đầy đủ"];
                } else if (loc["Tên Phường xã"] && loc["ID Quận huyện"]) {
                    const district = allLocations.find(d => d["ID Quận huyện"] === loc["ID Quận huyện"] && d["Tên đầy đủ"]);
                    const districtName = district ? district["Tên đầy đủ"] : "";
                    fullName = `${loc["Tên Phường xã"]} ${districtName}`;
                }
                return fullName;  
            })
            .join("<br>");
    };



    provinceSelect.addEventListener("change", function () {
        const provinceId = provinceSelect.value;
        if (provinceId) {
            loadDistricts(provinceId);
        } else {
            districtSelect.innerHTML = '<option value="">--Select District--</option>';
            wardSelect.innerHTML = '<option value="">--Select Ward--</option>';
        }
    });

    districtSelect.addEventListener("change", function () {
        const districtId = districtSelect.value;
        if (districtId) {
            loadWards(districtId);
        } else {
            wardSelect.innerHTML = '<option value="">--Select Ward--</option>';
        }
    });

    wardSelect.addEventListener("change", displayAddress);

    addressInput.addEventListener("input", displayAddress);

    searchButton.addEventListener("click", function (event) {
        const searchQuery = searchInput.value.trim();
        if (searchQuery == "") return;
        event.preventDefault(); 
        searchLocations(searchQuery); 
    });
    loadAllLocations();
    loadProvinces();
});
