
var display = document.querySelector('#time');

//Starts Timer
startTimer(90 * 60, display);

//Global Vars - Const
const questionNumber = 60;
let questionCount = correctCount = 0;

//Shuffle and get a subset of 'questionNumber' questions for the mock Exam
var shuffled = jsontxt.sort(function(){ return 0.5 - Math.random() });
var questions_subset = shuffled.slice(0,questionNumber);

document.body.onload = generateQuiz;

function generateQuiz() {

  questions_subset.forEach(generateAccordionItems);

}

  function generateAccordionItems(item, index){

    const Question_ID = `# ${index + 1} ${item.Number}  - Category: ${item.Category}`
    const collapseNum = `collapse${index + 1}`
    const content = `${item["Front (html)"]}`
    const answer = cleanData(item.Guess);

    //Add the 'cleaner' answer data to compare results
    item['Answer'] = answer;
    item['candidates'] = [];

    const HTMLBuilder = `<div class='card'>
    <div class='card-header'>
      <a style='width: 100%;text-align: left;'  class='btn' data-bs-toggle='collapse' href='#`+collapseNum+`'>` +
      Question_ID+
        ` <span id=wrong_pill_${index} style='margin-left: 35px;' class="badge rounded-pill bg-danger d-none">WRONG</span>
          <span id=right_pill_${index} style='margin-left: 35px;' class="badge rounded-pill bg-success d-none">CORRECT</span>
      </a>
    </div>
    <div id='`+collapseNum+`' class='collapse' data-bs-parent='#accordion'>
      <div class='card-body'>
        <form class='pointer'>`+
        content.replaceAll('index',index.toString())+
          `<div id=alert_${index} class="alert alert-danger d-none" role="alert">
          You selected too many options!
        </div>
          <button type='button' class='btn btn-primary mt-3' onClick='submitAnswer(${index},this);'>Submit</button>
              <div class='Answer alert alert-dark m-4 d-none'><strong>Answer: </strong><br>`+
              answer.join("<br>")+
              `</div>
          </form>
      </div>
    </div>
  </div>`

    //Append the HTML code for the item
    $("#accordion").append(HTMLBuilder);  

  }



  function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else

    try {
      str = str.toString();    
    }catch(err) {
      console.log('missing answer');
      str = ''; 
    }
 
    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return str.replace(/(<([^>]+)>)/ig, '--').split('--').filter(removeBlanks);

  }



  function removeBlanks(value) {
      return value != '';
  }


  //This includes a fix for andwers that contain ">" char
  function cleanData(val){

    //Remove HTML tags
    var answer = removeTags(val);

    if(answer.indexOf(" > ") != -1){

      //If answer contains > char, then move all to a string and then move that string as the only item in the array
        var aux = answer.join('');
        answer = [];
        answer.push(aux);
        return answer;
    }
    return answer;
  }


  function selectCandidate(e,index){

    //gets index of the selected Candidate and marks / unmarks it
    const indexExists = questions_subset[index]['candidates'].indexOf(e.innerText);
    $(e).toggleClass("candidate");

    //If exsists, delete it, if not add it
    if (indexExists === -1) {   
     
      questions_subset[index]['candidates'].push(e.innerText);
    }else{  

      questions_subset[index]['candidates'].splice(indexExists,1);
    }

    //Checks if user selected more candidates than needed
    if (questions_subset[index]["Answer"].length < questions_subset[index]["candidates"].length) Show_Error_ManyCandidates(e, index);
        else Remove_Error_ManyCandidates(e, index);
}



function Show_Error_ManyCandidates(e, index){
  
  //Shows the Alert and removes the Submit Btn
  const bodyID = index + 1;
  $("#collapse"+bodyID).find('.btn-primary').addClass("d-none");
  $('#alert_'+index).removeClass("d-none");
}

function Remove_Error_ManyCandidates(e, index){

  //Removes the Alert and shows the Submit Btn
  const bodyID = index + 1;
  $("#collapse"+bodyID).find('.btn-primary').removeClass("d-none");
  $('#alert_'+index).addClass("d-none"); 
}


function submitAnswer(index,e) {

  questionCount++;
  const candidates = questions_subset[index]['candidates'];
  const correctAnswer = questions_subset[index]['Answer'];
  const bodyID = index + 1;

  e.disabled=true;
  e.innerText ="Done";
  $("#collapse"+bodyID).children().addClass("disable-div");
  $("#collapse"+bodyID).find('.alert-dark').removeClass("d-none");

  $("#questionCount").text(`Questions: ${questionCount}/60`);
  $("#correctCount").text(`Correct: ${correctCount}/60`);

  checkAnswer(index,candidates,correctAnswer);
}

function isWrong(index){

  $('#right_pill_'+index).addClass("d-none");
  $('#wrong_pill_'+index).removeClass("d-none");
}


function checkAnswer(index,candidates,correctAnswer){

  const equalsCheck = (a, b) =>
    a.length === b.length &&
    a.every((v, i) => v === b[i]);

    candidates.sort();
    correctAnswer.sort();     

    (equalsCheck(candidates, correctAnswer)) ? isCorrect(index):isWrong(index);
}


function isCorrect(index){

  correctCount++;
  $('#wrong_pill_'+index).addClass("d-none");
  $('#right_pill_'+index).removeClass("d-none");
  $("#correctCount").text(`Correct: ${correctCount}/60`);

}
