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
            gpa: result.gpa,
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

   // createSemesterResultsDivs creates the divs displaying the semester results
   createSemesterResultsDivs(semesterResults) {
      console.log(this.semesterResultsContainer);
      this.semesterResultsContainer.innerHTML = "";
      for (let i = 0; i < semesterResults.length; i++) {
         const result = semesterResults[i];
         this.semesterResultsContainer.innerHTML += `
        <div class="semester-result card">
          <div class="card-body">
            <h5 class="card-title">Semester ${result.semester}</h5>
            <p>Credit Hours: ${result.creditHours}</p>
            <p>CGPA: ${result.cgpa}</p>
            <p>Result: ${result.result}</p>
            <p>GPA: ${result.gpa}</p>
          </div>
        </div>
      `;
         //            <p>URL: ${result.url}</p>
      }
   }
   // hideResults hides the student data display
   hideResults() {
      document.getElementById("results-area").style.display = "none";
      document.getElementById("results").style.display = "none";
      document.getElementById("semester-results").style.display = "none";
   }

   // hideResults shows the student data display
   showResults() {
      document.getElementById("results-area").style.display = "block";
      document.getElementById("results").style.display = "block";
      document.getElementById("semester-results").style.display = "block";
   }

}

// getResult is the event listener for the form submission
function getResult() {
   const rollNo = document.querySelector("#roll_no").value;
   const studentAPI = new StudentAPI("https://u3kbdc.deta.dev/");
   const ui = new UI();

   ui.hideResults();

   studentAPI
      .getStudentData(rollNo)
      .then(data => {
         const student = new Student(data);
         ui.makeTable(student);
         console.log(student.semesterResults);
         ui.createSemesterResultsDivs(student.semesterResults);
         ui.showResults();
      })
      .catch(error => {
         alert(`Error: ${error}`);
      });
}