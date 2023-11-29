class StudentAPI {
	constructor(baseUrl) {
		this.baseUrl = baseUrl;
	}

	async getStudentData(rollNo) {
		try {
			const cachedData = localStorage.getItem(`cachedData_${rollNo}`);
			const cachedTimestamp = localStorage.getItem(`cachedTimestamp_${rollNo}`);

			// If there is no data in the cache or the cached data has expired
			if (!cachedData || (cachedTimestamp && Date.now() - parseInt(cachedTimestamp, 10) > 5 * 30 * 24 * 60 * 60 * 1000)) {
				if (!navigator.onLine) {
					return null;
				}

				// Fetch data from the API
				const data = await this.updateDataFromApi(rollNo);

				// Return the API response data
				return data.results;
			}

			// If data is present in the cache and not expired, parse and return it
			const parsedData = JSON.parse(cachedData);

			if (navigator.onLine) {
				//this.updateDataFromApi(rollNo).then(updatedData => {
					// You can optionally perform actions with the updated data
				//});
			}

			return parsedData.results;
		} catch (error) {
			throw new Error(`Error fetching student data for rollNo ${rollNo}: ${error}`);
		}
	}


	async updateDataFromApi(rollNo) {
		try {
			const response = await fetch(`${this.baseUrl}${rollNo}`);
			const data = await response.json();


			localStorage.setItem(`cachedData_${rollNo}`, JSON.stringify(data));
			localStorage.setItem(`cachedTimestamp_${rollNo}`, Date.now().toString());
			return data;
		} catch (error) {
			throw new Error(`Error updating data from API for rollNo ${rollNo}: ${error}`);
		}
	}
}

// class Student {
// 	constructor(data) {
// 		this.name = data[data.length - 1].name;
// 		this.fatherName = data[data.length - 1].father_name;
// 		this.institute = data[data.length - 1].institute;
// 		this.degree = data[data.length - 1].degree;
// 		this.rollNo = data[data.length - 1].roll_no;
// 		this.regNo = data[data.length - 1].reg_no;
// 		this.semesterResults = this.createSemesterResults(data);
// 	}

// 	createSemesterResults(data) {
// 		return data.map(result => {
// 			return {
// 				semester: result.semester,
// 				creditHours: result.credit,
// 				cgpa: result.cgpa,
// 				gpa: result.gpa || 0,
// 				comparts: result.comparts,
// 				status: result.status,
// 				url: result.url
// 			};
// 		});
// 	}
// }

class Student {
	constructor(data) {
  
	  const studentInfo = data.student_information;
  
	  this.name = studentInfo.student_name || 'N/A';
	  this.fatherName = studentInfo.father_name || 'N/A';
	  this.institute = studentInfo.institute || 'N/A';
	  this.degree = studentInfo.degree || 'N/A';
	  this.rollNo = studentInfo.roll_number || 'N/A';
	  this.regNo = studentInfo.reg_no || 'N/A';
	  this.semesterResults = this.createSemesterResults(data.results);
	}
  
	createSemesterResults(data) {
		return data.map(result => {
			return {
				semester: result.semester,
				creditHours: result.credit,
				cgpa: result.cgpa,
				gpa: result.gpa || 0,
				comparts: result.comparts,
				status: result.status,
				url: result.url
			};
		});
	}
}


class UI {
	constructor() {
		this.table = document.getElementById("div_table");
		this.semesterResultsContainer = document.getElementById("semester-results");
	}

	makeTable(student) {
		this.table.innerHTML = `
      <table class="table table-bordered" id="table-results">
        <tbody>
          <tr>
            <th>Name</th>
            <td>${student.name}</td>
          </tr>
          <tr>
            <th>Father Name</th>
            <td>${student.fatherName}</td>
          </tr>
          <tr>
            <th>Roll Number</th>
            <td>${student.rollNo}</td>
          </tr>
          <tr>
            <th>Reg Number</th>
            <td>${student.regNo}</td>
          </tr>
          <tr>
            <th>Degree</th>
            <td>${student.degree}</td>
          </tr>
          <tr>
            <th>Institute</th>
            <td>${student.institute}</td>
          </tr>
        </tbody>
      </table>
    `;
	}

	hideEmptyCompartsRows() {
		const compartHeader = document.querySelector(".comparts-header");
		const compartRows = document.querySelectorAll("td:nth-child(5)");

		if (compartHeader) {
			compartHeader.style.display = "none";
		}

		compartRows.forEach((row) => {
			const tableRow = row;
			const tableBody = tableRow.parentElement;
			tableBody.removeChild(tableRow);
		});
	}

	hideGpaRows() {
		const gpaHeader = document.querySelector(".gpa-header");
		const gpaRows = document.querySelectorAll("td:nth-child(4)");

		if (gpaHeader) {
			gpaHeader.style.display = "none";
		}

		gpaRows.forEach((row) => {
			const tableRow = row;
			const tableBody = tableRow.parentElement;
			tableBody.removeChild(tableRow);
		});
	}

	createSemesterResultsDivs(semesterResults) {
		this.semesterResultsContainer.innerHTML = "";
		this.semesterResultsContainer.innerHTML += `
		<table class="table table-bordered" id="table-results2">
		  <thead>
			<tr>
			  <th>Semester</th>
			  <th>Credit</th>
			  <th>CGPA</th>
			  <th class="gpa-header">GPA</th>
			  <th class="comparts-header">Comparts</th>
			  <th>Status</th>
			</tr>
		  </thead>
		  <tbody>
		`;

		const table = document.getElementById("table-results2");
		let compart_exists = false;
		let gpa_exists = false;

		for (let i = 0; i < semesterResults.length; i++) {
			const result = semesterResults[i];
			const row = table.insertRow(i + 1);
			const cell0 = row.insertCell(0);
			const cell1 = row.insertCell(1);
			const cell2 = row.insertCell(2);
			const cell3 = row.insertCell(3);
			const cell4 = row.insertCell(4);
			const cell5 = row.insertCell(5);

			cell0.innerHTML = result.semester;
			cell1.innerHTML = result.creditHours;
			cell2.innerHTML = result.cgpa;
			cell3.innerHTML = result.gpa;
			cell4.innerHTML = result.comparts;
			cell5.innerHTML = result.status;

			if (result.comparts.length !== 0) {
				compart_exists = true;
			}
			if (result.gpa) {
				gpa_exists = true;
			}
		}

		if (!gpa_exists) {
			this.hideGpaRows();
		}

		if (!compart_exists) {
			this.hideEmptyCompartsRows();
		}
	}

	hideResults() {
		document.getElementById("results-area").style.display = "none";
		document.getElementById("results").style.display = "none";
		document.getElementById("semester-results").style.display = "none";
		document.getElementById("div_table").style.display = "none";
	}

	showResults() {
		document.getElementById("results-area").style.display = "block";
		document.getElementById("results").style.display = "block";
		document.getElementById("semester-results").style.display = "block";
		document.getElementById("div_table").style.display = "block";
	}
}

function displayVisualization(data) {
	if (!Array.isArray(data) || data.length === 0 || data.length === 1) {
		console.error('Invalid data format for visualization.');
		return;
	}

	const semesterResults = data;
	const semesters = semesterResults.map(result => result.semester);
	const cgpaValues = semesterResults.map(result => result.cgpa);
	const gpaValues = semesterResults.map(result => result.gpa || 0);

	if (semesters.length === 0 || cgpaValues.length === 0) {
		console.error('No data available for visualization.');
		return;
	}

	const cgpaTrace = {
		x: semesters,
		y: cgpaValues,
		type: 'line',
		mode: 'lines+markers',
		marker: { color: '#25525E' },
		name: 'CGPA'
	};

	const chartData = [cgpaTrace];

	if (gpaValues.some(value => value !== 0)) {
		const gpaTrace = {
			x: semesters,
			y: gpaValues,
			type: 'line',
			mode: 'lines+markers',
			marker: { color: 'orange' },
			name: 'GPA'
		};
		chartData.push(gpaTrace);
	} else {
		chartData[0].text = "CGPA";
	}

	const layout = {
		title: 'Student Performance Across Semesters',
		xaxis: {
			title: 'Semester',
			tickmode: 'array',
			tickvals: semesters,
			ticktext: semesters.map(String),
		},
		yaxis: { title: 'Score' },
		autosize: true,
	};

	const config = {
		displayModeBar: false,
		staticPlot: false,
		responsive: true,
	};

	Plotly.newPlot('chart-container', chartData, layout, config);
}

function getResult() {
	// Display loading
	document.getElementById('loading').style.display = 'flex';

	const rollNo = document.querySelector("#roll_no").value;
	// OLD API
	// https://kanwaradnanpusms-vvicnw7txq-uc.a.run.app/
	const studentAPI = new StudentAPI("https://api_last-1-j0851899.deta.app/");

	const ui = new UI();
	ui.hideResults();

	if (rollNo.toLowerCase() === 'clear') {
		document.getElementById('loading').style.display = 'none';
		clearCacheRes();
		console.log('Cache cleared.');
		const input = document.getElementById("roll_no");
		input.value = '';
		input.focus();
		return;
	}

	// Clear the existing chart
	document.getElementById('chart-container').innerHTML = '';

	studentAPI
		.getStudentData(rollNo)
		.then(data => {
			console.log(data, 'this is the response'); // Log the entire data object

			const student = new Student(data);
			console.log(student,'this is student');
			ui.makeTable(student);
			ui.createSemesterResultsDivs(student.semesterResults);
			ui.showResults();

			// Display visualization
			displayVisualization(student.semesterResults);

			// Hide loading inside the .then() block
			document.getElementById('loading').style.display = 'none';
		})
		.catch(error => {
			alert(`${error}`);

			// Ensure loading is hidden even if there's an error
			document.getElementById('loading').style.display = 'none';
		});
}

document.addEventListener("DOMContentLoaded", function () {
	const cacheVersionKey = 'kanwar_rs_apiCacheVersion';
	const currentApiVersion = 1;
	initializeCache(cacheVersionKey , currentApiVersion);
	
	const input = document.getElementById("roll_no");
	input.focus();
	
	input.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			getResult();
		}
	});
});

function initializeCache(cacheVersionKey , currentApiVersion) {
	const cachedVersion = localStorage.getItem(cacheVersionKey);

	if (cachedVersion === null || parseInt(cachedVersion, 10) < currentApiVersion) {
		clearCacheRes();
		localStorage.setItem(cacheVersionKey, currentApiVersion);
	}
}

function clearCacheRes() {
	const keysToRemove = Object.keys(localStorage).filter(key => key.startsWith('cachedData_') || key.startsWith('cachedTimestamp_'));
	console.log('Keys to remove:', keysToRemove);
  
	keysToRemove.forEach(key => localStorage.removeItem(key));
  }
  
