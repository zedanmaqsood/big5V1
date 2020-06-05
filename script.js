$(function () {
	var enumera,questions,answerBlock,pages;
	var currentPageNumber,nextBtn,submitBtn,submitState,warning;
	var answerValue,currentResult,ansHistory,resultHistory;

	//a paragraph containg warning


	//submit state is used while validation and changing the css of un ans quest 
	submitState = false;
	//enumerating 

	enumera = {
		1:'dis',
		2:'slytDis',
		3:'neutral',
		4:'slytAgree',
		5:'agree'
	}

	currentPageNumber = 0; //initial page

	pages = [{'start':'0','finish':'9'},{'start':'10','finish':'19'},{'start':'20','finish':'29'},
	{'start':'30','finish':'39'},{'start':'40','finish':'49'}];

	answerBlock = "<div class=\"answer\"><span class=\"disagree-text\">Disagree</span>";
	answerBlock += "<span class=\"radio big disagree\" data-value=\"1\"></span>";
	answerBlock += "<span class=\"radio medium disagree\" data-value=\"2\"></span>";
	answerBlock += "<span class=\"radio small \" data-value=\"3\"></span>";
	answerBlock += "<span class=\"radio medium agree\" data-value=\"4\"></span>";
	answerBlock += "<span class=\"radio big agree\" data-value=\"5\"></span>";
	answerBlock += "<span class=\"agree-text\">Agree</span></div>";
	
	
	questions = ['I am the life of the party.','I Feel little concern for others.',
	' Am always prepared.',' Get stressed out easily.,',' Have a rich vocabulary.',
	'Don\'t talk a lot.','Am interested in people.',' Leave my belongings around.',
	' Am relaxed most of the time.','Have difficulty understanding abstract ideas.',
	'Feel comfortable around people.','Insult people.',' Pay attention to details.',
	'Worry about things.','Have a vivid imagination.','Keep in the background.',
	'Sympathize with others\' feelings.',' Make a mess of things.',
	'Seldom feel blue.','Am not interested in abstract ideas.','Start conversations.',
	'Am not interested in other people\'s problems','Get chores done right away.',
	'Am easily disturbed','Have excellent ideas.','Have little to say.','Have a soft heart.',
	'Often forget to put things back in their proper place.','Get upset easily.',
	'Do not have a good imagination.',' Talk to a lot of different people at parties.',
	'Am not really interested in others','Like order.',' Change my mood a lot.',
	'Am quick to understand things.',' Don\'t like to draw attention to myself.',
	'Take time out for others.',' Shirk my duties.',' Have frequent mood swings.',
	' Use difficult words.','Don\'t mind being the center of attention.','Feel others\' emotions.',
	'Follow a schedule.','Get irritated easily.','Spend time reflecting on things.',
	'Am quiet around strangers.',' Make people feel at ease.','Am exacting in my work.',
	'Often feel blue.','Am full of ideas.'];

	submitBtn = "<div id=\"submit\" class=\"button\"><a href=\"#\">submit</a></div>";
	nextBtn = "<div id=\"next\" class=\"button\"><a href=\"#\">next</a></div>";
	prevBtn = "<div id=\"previous\" class=\"button\"><a href=\"#\">previous</a></div>"
	retakeBtn = "<div id=\"retake\" class=\"button\"><a href=\"#\">Retake the Test</a></div>"

	ansHistory = new Array();//for storing previouse answers
	resultHistory = new Array();

	function scroll2Page(){
		$('html, body').animate({
            scrollTop: $(".page").offset().top
        }, 500);
	}

	function pageFromQNum(qNum){
		//return the page number of the question
		if(qNum<10){
			return 0;
		}
		else {
			return qNum/10;
		}
	}

	function loadPage(pageNumber) {
		// generates html code of the page and loads to the index.html
		var start,stop,htmlCode,questStr,finalHtml;
		start = pages[pageNumber].start;
		stop = pages[pageNumber].finish;
		htmlCode = "";
		
		for (var i = start; i<= stop; i++) {
			questStr = questions[i];
			htmlCode += "<li id=\""+i+"\"><div class=\"question-block\"><div class=\"question\">";
			htmlCode += questStr+"</div>"+answerBlock;
			htmlCode += "</div></li>";
		}

		finalHtml = "<ul>"+htmlCode+"</ul>";

		$('.page ul').remove();
		$('.page').append(finalHtml);
		markAnswered();
		//this is only for testing
		populator();

	}

	function validate() {
		//checks the whole answers for any unanswered and return the list of unanswered else false
		var indexArray = new Array;
		answerValue.forEach(function(value,index) {
			if(value.attempted == false){
				indexArray.push(index);
			}
		});
		if(indexArray.length>0){
			return indexArray;
		}
		else{
			return false;
		}
	}

	function computeResult() {
		// computes the result of the current answerValue set returns an object with result

	}

	function saveUnAns(){
		//scans the current page on transiton to tother and check of un ticked radios and
		//marks them as unanswered in the answerValue Array
		$('.answer').each(function(){
			if(!($(this).children('.radio').hasClass('true'))){
				var $id = $(this).parent().parent().attr('id');
				//console.log($id);
				answerValue[$id].attempted = false;
				answerValue[$id].answer = null;
				//console.log(answerValue[$id].attempted);
				//console.log(answerValue[$id].answer);
			}
		});
	}

	function markAnswered(){
		//on loading a page checkes the answerValue array for answered question is the perticular
		//page and marks accordingly
		var start,stop,i,id,value;
		start = pages[currentPageNumber].start;
		finish = pages[currentPageNumber].finish;
		for(i=start;i<=finish;i++){
			id ='#' + i;
			$id = $(id);
			if(answerValue[i].attempted){
				value = answerValue[i].answer;
				$id.find('.radio').each(function(){
					if($(this).attr('data-value')==value){
						$(this).addClass('true');
					}
				});
			}
			else{
				if(submitState){
					$id.addClass('warning');
				}
			}
		}

	}

	function initializeAnsVal() {
		for(var i = 0;i<50;i++){
			var tempObj = {
			'attempted':false,
			'answer':null
			};
			answerValue[i]=tempObj;
		}
	}

	function computeScore(offset,pivot1,pivot2){
	//pivot 1 gets added, and pivot 2 get subtracted
	//only used for ComputeResult();
		var total = offset;
		var i = pivot1;
		if(i==0){
			while(i<5){
				total += parseInt(answerValue[i].answer); 
				i += 10;
			}
		}
		while((i!=0) && (i/10 < 5)){
			total += parseInt(answerValue[i].answer); 
			i += 10;
		}
		i = pivot2;
		while((i!=0) && (i/10 < 5)){
			total -= parseInt(answerValue[i].answer); 
			i += 10;
		}
		return total;
	}	

	function computeResult(){
		var extro,agreeness,consci,neuro,openess,result;
		extro = computeScore(20,0,5);
		agreeness = computeScore(14,6,1);
		consci = computeScore(14,2,7);
		neuro = computeScore(38,8,3);
		openess = computeScore(8,4,9);
		result = {
			'Extraversion':extro,
			'Agreeableness':agreeness,
			'Conscientiousness':consci,
			'Neuroticism':neuro,
			'Openeness':openess,
		};
		return result;
	}

	function dispResult(result){
		//input : onject containig the result; output display the output on html
		var finalHtml,htmlCode,key,value,colors,i;
		var $pageUl =$('.page ul');
		if($pageUl){
			$pageUl.remove();
		}	
		colors = [
			'#11BCD3',
			'rgba(17, 48, 211,0.82)',
			'rgba(184, 17, 211,0.82)',
			'rgba(211, 17, 52,0.82)',
			'rgba(102, 211, 17,0.82)'
		];
		i = 0; //index for colors array
		htmlCode ="<ul class = \"result\">";
		Object.entries(result).forEach( entry =>{
			key = entry[0];
			value = entry[1];
			valuePercent = Math.floor((entry[1]/40)*100);
			console.log(key,value,valuePercent)
			htmlCode += "<li><h3>"+key+"</h3>"+"<div class=\"progressBar\">";
            htmlCode += "<span style=\"width:"+valuePercent+"%;background-color:"+colors[i++]+";\">";
            htmlCode += "<span>"+value+"</span></span></div></li>";
		});
		htmlCode +="</ul>";
		$('.page').css({
			"box-sizing": "border-box",
   			"padding": "10%"
		});	
		$('.page').append(htmlCode);
		$('.hero-text').text("Result.");
	}

	function populator(){
		//this function populates the form for tsting puropes
		//to be called inside the loadpage()function
		$li = $('li');
		$li.each(function(){
			var $this = $(this)
			var $id = $this.attr('id');
			//console.log($this.find('.neutral'));
			$this.find('.small').addClass('true');
			answerValue[$id].attempted = true;
			answerValue[$id].answer = 3;
		});	
	}

	answerValue = new Array();
	initializeAnsVal(); //154

	//on first opening
	loadPage(0);

	$(".buttons").on('click',function(e){
		e.preventDefault();
		var unAns;
		var $target = $(e.target);
		var $parentId = $target.parent().attr('id');
		if($parentId=='previous'){
			if(currentPageNumber===4){
				$("#submit").remove();
				$('#previous').after(nextBtn);
			}
			if(currentPageNumber>0){
				saveUnAns();
				loadPage(--currentPageNumber);
				//markAnswered();
			}
		}
		if($parentId=='next'){
			++currentPageNumber;
			if(currentPageNumber<4){
				saveUnAns();
				loadPage(currentPageNumber);
				//markAnswered();
			}
			if(currentPageNumber===4){
				saveUnAns();
				loadPage(currentPageNumber);
				//markAnswered();
				$("#next").remove();
				$('#previous').after(submitBtn);
			}
		}
		if($parentId=='submit'){
			submitState = true;
			var unAns = validate(); //an array of question numbers
			//console.log(unAns);
			if(unAns){
				$("#submit").remove();
				$('#previous').after(nextBtn);
				currentPageNumber = unAns[0];
				loadPage(pageFromQNum(unAns[0]));
			}
			else{
				//changing the buttons
				$("#submit").remove();
				$("#previous").remove();
				$(".buttons").append(retakeBtn);
				currentResult =computeResult(); 
				dispResult(currentResult);//display the result
			}
		}
		if($parentId=='retake'){
			submitState = false;
			ansHistory.push(answerValue);
			resultHistory.push(currentResult);
			$('.hero-text').text("Take the Test Now.");
			currentPageNumber = 0;
			loadPage(currentPageNumber)
			$("#retake").remove();
			$(".buttons").append(prevBtn);
			$(".buttons").append(nextBtn);
			$('.page').css({
			"box-sizing": "none",
   			"padding": "5%"
			});
		}
		//scroll2Page();
	});

	$(".page").on('click',function(e){
		var $elem = $(e.target);
		var id = $elem.parents().filter("li").attr('id');
		//console.log(id);
		if($elem.hasClass('radio')){
			answerValue[id].attempted = true;
			answerValue[id].answer = $elem.attr('data-value');//same
		 	if($elem.siblings().hasClass('true')){
		 		$elem.siblings().each(function(){
		 			if($(this).hasClass('true')){
		 				$(this).removeClass('true');
		 			}
		 		});
		 	}
		 	$elem.toggleClass('true');	
		 }
		
	});

});