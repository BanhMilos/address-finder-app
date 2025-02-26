document.addEventListener("DOMContentLoaded", function () {
    const provinceSelect = document.getElementById("province");
    const districtSelect = document.getElementById("district");
    const wardSelect = document.getElementById("ward");
    const addressInput = document.getElementById("specific-address");
    const searchInput = document.getElementById("search");
    const resultMessage = document.getElementById("result-message");

    const API_BASE_URL = "http://localhost:3000"; // Change to your backend URL

    let allLocations = [];

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
                option.value = province.id;
                option.textContent = province.name;
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
                option.value = district.id;
                option.textContent = district.name;
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
                option.value = ward.id;
                option.textContent = ward.name;
                wardSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading wards:", error);
        }
    };

    // Search function (case-insensitive, supports abbreviations & partial matches)
    const searchLocations = (query) => {
        if (!query) return;

        query = query.toLowerCase();
        const words = query.split(/\s+/); // Split into words for abbreviation search

        const results = allLocations.filter(loc => {
            const fullName = `${loc.ward}, ${loc.district}, ${loc.province}`.toLowerCase();

            // Exact match
            if (fullName.includes(query)) return true;

            // Abbreviation match (e.g., "dvh" → "Dich Vong Hau")
            const abbreviation = loc.ward
                .split(" ")
                .map(word => word[0])
                .join("")
                .toLowerCase();

            if (abbreviation === query) return true;

            // Partial match on any word (e.g., "am" → "Ha Nam", "Nam Dinh")
            return words.some(word => fullName.includes(word));
        });

        displaySearchResults(results);
    };

    // Display search results
    const displaySearchResults = (results) => {
        if (results.length === 0) {
            resultMessage.textContent = "No results found.";
            return;
        }

        resultMessage.innerHTML = results
            .map(loc => `${loc.ward}, ${loc.district}, ${loc.province}`)
            .join("<br>");
    };

    // Event Listeners
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

    searchInput.addEventListener("input", function () {
        searchLocations(searchInput.value);
    });

    // Load initial data
    loadAllLocations();
    loadProvinces();
});
