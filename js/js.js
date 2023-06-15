// Code By Kanwar Adnan

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
      this.name = data[0].name;
      this.fatherName = data[0].father_name;
      this.institute = data[0].institute;
      this.degree = data[0].degree;
      this.rollNo = data[0].roll_no;
      this.regNo = data[0].reg_no;
      this.semesterResults = this.createSemesterResults(data);
   }

   // createSemesterResults maps the data to an array of semester results
   createSemesterResults(data) {
      return data.map(result => {
         return {
            semester: result.semester,
            creditHours: result.credit,
            cgpa: result.cgpa,
            result: result.result,
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

   createSemesterResultsDivs(semesterResults) {
      this.semesterResultsContainer.innerHTML = "";
      this.semesterResultsContainer.innerHTML += `
    <table class="table table-bordered" id="table-results2">
      <thead>
        <tr>
          <th>Semester</th>
          <th>Credit</th>
          <th>CGPA</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
  `
      const table = document.getElementById("table-results2");
      for (let i = 0; i < semesterResults.length; i++) {
         const result = semesterResults[i];
         var row = table.insertRow(i + 1);
         var cell0 = row.insertCell(0);
         var cell1 = row.insertCell(1);
         var cell2 = row.insertCell(2);
         var cell3 = row.insertCell(3);
         cell0.innerHTML = result.semester;
         cell1.innerHTML = result.creditHours;
         cell2.innerHTML = result.cgpa;
         cell3.innerHTML = result.result;
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
   const studentAPI = new StudentAPI("https://pu_results-1-a8353996.deta.app/");
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

