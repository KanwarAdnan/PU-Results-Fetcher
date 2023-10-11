// Code By Kanwar Adnan
// improved

// StudentAPI is a class that handles the fetching of student data from the API
class StudentAPI {
	constructor(baseUrl) {
		this.baseUrl = baseUrl;
	}

	// getStudentData makes the API call and returns a promise with the student data
	async getStudentData(rollNo) {
		try {
			const response = await fetch(`${this.baseUrl}${rollNo}`);
			const data = await response.json();
			return data.results;
		} catch (error) {
			throw new Error(`Error fetching student data: ${error}`);
		}
	}
}

// Student is a class that represents a student
class Student {
	constructor(data) {
		this.name = data[ data.length - 1 ].name;
		this.fatherName = data[ data.length - 1 ].father_name;
		this.institute = data[ data.length - 1 ].institute;
		this.degree = data[ data.length - 1 ].degree;
		this.rollNo = data[ data.length - 1 ].roll_no;
		this.regNo = data[ data.length - 1 ].reg_no;
		this.semesterResults = this.createSemesterResults(data);
	}

	// createSemesterResults maps the data to an array of semester results
	createSemesterResults(data) {
		return data.map(result => {
			return {
				semester: result.semester,
				creditHours: result.credit,
				cgpa: result.cgpa,
				gpa: result.gpa, // Add GPA if available
				comparts: result.comparts,
				status: result.status,
				url: result.url
			}
		});
	}
}

// UI is a class that handles the display of student data
class UI {
	constructor() {
		this.table = document.getElementById("div_table");
		this.semesterResultsContainer = document.getElementById("semester-results");
	}

	// makeTable creates the table displaying the student information
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
			cell3.innerHTML = result.gpa; // Display GPA if available, or an empty string
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
	

	// hideResults hides the student data display
	hideResults() {
		document.getElementById("results-area").style.display = "none";
		document.getElementById("results").style.display = "none";
		document.getElementById("semester-results").style.display = "none";
		document.getElementById("div_table").style.display = "none";
	}

	// hideResults shows the student data display
	showResults() {
		document.getElementById("results-area").style.display = "block";
		document.getElementById("results").style.display = "block";
		document.getElementById("semester-results").style.display = "block";
		document.getElementById("div_table").style.display = "block";
	}

}

// getResult is the event listener for the form submission
function getResult() {
	const rollNo = document.querySelector("#roll_no").value;
	const studentAPI = new StudentAPI("https://api_last-1-j0851899.deta.app/");
	const ui = new UI();

	ui.hideResults();

	studentAPI
		.getStudentData(rollNo)
		.then(data => {
			const student = new Student(data);
			ui.makeTable(student);
			ui.createSemesterResultsDivs(student.semesterResults);
			ui.showResults();
		})
		.catch(error => {
			alert(`${error}`);
		});
}

document.addEventListener("DOMContentLoaded", function() {
	const input = document.getElementById("roll_no");

	// Bind function to Enter key press
	input.addEventListener("keydown", function(event) {
		if (event.key === "Enter") {
			getResult();
		}
	});
});
