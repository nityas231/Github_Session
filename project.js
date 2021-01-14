var type = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
  };
  
  var currentQuestion = 1;
  var qLength = 0;
  var viewingAns = 0;
  var correctAnswers = 0;
  var quizOver = false;
  var iSelectedAnswer = [];
  var correctAns = [];
  var c = 600;
  var t;
  
  var questions = [];
  
  $(document).ready(function () {
    $("#CPP").click(function (e) {
      var id = this.id;
      clickEvent(id);
      e.preventDefault();
    });
  
    $("#C").click(function (e) {
      var id = this.id;
      clickEvent(id);
      e.preventDefault();
    });
  
    function clickEvent(id) {
      $.ajax({
        method: "GET",
        url: "http://localhost:3000/Category/" + "C",
        success: function (x) {
          c = x["questionset1"][0]["time"] * 60;
         // c = 10;
          //   console.log(x["questionset1"][0]["time"]);
          x["questionset1"].forEach((items) => {
            correctAns.push(JSON.stringify(items["answer"]));
            questions.push(items);
          });
          console.log(correctAns);
        },
        complete: function (data) {
          qLength = questions.length - 1;
          displayCurrentQuestion();
          navButtons();
        },
        error: (e) => {
          alert("Error" + e);
        },
      });
    }
    $(document).on("click", ".questionNav button", function () {
      currentQuestion = this.id;
      displayCurrentQuestion();
      if (qLength === currentQuestion + 2) {
        $(document).find(".nextButton").attr("disabled", true);
      } else {
        $(document).find(".nextButton").attr("disabled", false);
      }
    });
    // $(this).find(".quizMessage").hide();
  
    timedCount();
  
    $(this)
      .find(".preButton")
      .on("click", function () {
        // console.log("current in prev"+currentQuestion)
        if (!quizOver) {
          currentQuestion--; // Since we have already displayed the first question on DOM ready
          if (currentQuestion < questions.length) {
            displayCurrentQuestion();
          }
        } else {
          if (viewingAns == 3) {
            return false;
          }
          currentQuestion = 1;
          viewingAns = 3;
          // viewResults();
        }
  
        if (qLength === currentQuestion + 2) {
          $(document).find(".nextButton").attr("disabled", true);
        } else {
          $(document).find(".nextButton").attr("disabled", false);
        }
      });
  
    // On clicking next, display the next question
    $(this)
      .find(".nextButton")
      .on("click", function () {
        console.log(this);
        console.log("Qleng" + qLength);
        console.log("Current" + currentQuestion);
        if (qLength === currentQuestion + 1) {
          $(document).find(".nextButton").attr("disabled", true);
        } else {
          $(document).find(".nextButton").attr("disabled", false);
        }
        if (!quizOver) {
          var val = $("input[type='radio']:checked").val();
          console.log("value is:" + type[val]);
          console.log(questions[currentQuestion]["answer"]);
          // TODO: Remove any message -> not sure if this is efficient to call this each time....
          // $(document).find(".quizMessage").hide();
          if (type[val] == questions[currentQuestion]["answer"]) {
            correctAnswers++;
          }
          iSelectedAnswer[currentQuestion] = val;
  
          currentQuestion++; // Since we have already displayed the first question on DOM ready
  
          if (currentQuestion >= 1) {
            $(".preButton").prop("disabled", false);
          }
          if (currentQuestion < questions.length) {
            displayCurrentQuestion();
          } else {
            $("#iTimeShow").html("Quiz Time Completed!");
            c = 185;
            // $(document).find(".preButton").text("View Answer");
  
            quizOver = true;
            return false;
          }
        } else {
          // quiz is over and clicked the next button (which now displays 'Play Again?'
          quizOver = false;
          $("#iTimeShow").html("Time Remaining:");
          iSelectedAnswer = [];
          $(document).find(".nextButton").text("Next Question");
          $(document).find(".preButton").text("Previous Question");
          $(".preButton").attr("disabled", "disabled");
          resetQuiz();
          viewingAns = 1;
          displayCurrentQuestion();
          hideScore();
        }
      });
  
    $("#submit").click(function (e) {
      alert(correctAnswers);
      // console.log(iSelectedAnswer)
      var r = confirm("Submit test!");
      if (r == true) {
          showResult()
      }
      e.preventDefault();
    });
  });
  
  function timedCount() {
    if (c == 185) {
      return false;
    }
  
    var hours = parseInt(c / 3600) % 24;
    var minutes = parseInt(c / 60) % 60;
    var seconds = c % 60;
    var result =
      (hours < 10 ? "0" + hours : hours) +
      ":" +
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);
    $("#timer").html(result);
  
    if (c == 0) {
      displayScore();
      $("#iTimeShow").html("Quiz Time Completed!");
      $("#timer").html(
        "You scored: " + correctAnswers + " out of: " + questions.length
      );
      c = 185;
      // $(document).find(".preButton").text("View Answer");
      // $(document).find(".nextButton").text("Play Again?");
      quizOver = true;
      return false;
    }
  
    c = c - 1;
    t = setTimeout(function () {
      timedCount();
    }, 1000);
  }
  
  // This displays the current question AND the choices
  function displayCurrentQuestion() {
    // console.log("current question:" + currentQuestion);
    if (c == 185) {
      c = 180;
      timedCount();
    }
  
    //console.log("In display current Question");
    var question = questions[currentQuestion].question;
    var questionClass = $(document).find(".quizContainer > .question");
    var choiceList = $(document).find(".quizContainer > .choiceList");
  
    // console.log(" dfsljkg"+Object.keys(questions[currentQuestion]))
    //console.log(" dfsljkg"+(Object.keys(questions[1]['answers']).length))
  
    var numChoices = Object.keys(questions[currentQuestion]["answers"]).length;
    // Set the questionClass text to the current question
    $(questionClass).text(currentQuestion + ".   " + question);
    // Remove all current <li> elements (if any)
    $(choiceList).find("li").remove();
    var choice;
  
    for (i = 0; i < numChoices; i++) {
      // console.log(questions[currentQuestion]["answers"][type[i]]);
      //  console.log(i);
      choice = questions[currentQuestion]["answers"][type[i]];
  
      if (iSelectedAnswer[currentQuestion] == i) {
        $(
          '<li><input type="radio" class="radio-inline" checked="checked"  value=' +
            i +
            ' name="dynradio" />' +
            " " +
            choice +
            "</li>"
        ).appendTo(choiceList);
      } else {
        $(
          '<li><input type="radio" class="radio-inline" value=' +
            i +
            ' name="dynradio" />' +
            " " +
            choice +
            "</li>"
        ).appendTo(choiceList);
      }
    }
  }
  
  function resetQuiz() {
    currentQuestion = 1;
    correctAnswers = 0;
    hideScore();
  }
  
  function displayScore() {
    $(document)
      .find(".quizContainer > .result")
      .text("You scored: " + correctAnswers + " out of: " + questions.length);
    $(document).find(".quizContainer > .result").show();
  }
  
  function hideScore() {
    $(document).find(".result").hide();
  }
  function navButtons() {
    for (var i = 0; i < qLength; i++) {
      $(".questionNav").append(`<button id=${i + 1}>${i + 1}</button`);
    }
  }
  
  function showResult() {
    console.log(qLength)
    for (let i = 1; i < qLength; i++) {
      currentQuestion = i
      
      displayCurrentQuestion(i);
    }
  }
  