/* ************************************ */
/* Define helper functions */
/* ************************************ */
function assessPerformance() {
	/* Function to calculate the "credit_var", which is a boolean used to
	credit individual experiments in expfactory. */
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	choice_counts[32] = 0
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].possible_responses != 'none') {
			trial_count += 1
			rt = experiment_data[i].rt
			key = experiment_data[i].key_press
			choice_counts[key] += 1
			if (rt == -1) {
				missed_count += 1
			} else {
				rt_array.push(rt)
			}
		}
	}
	//calculate average rt
	var avg_rt = -1
	if (rt_array.length !== 0) {
		avg_rt = math.median(rt_array)
	} 
	var missed_percent = missed_count/experiment_data.length
	//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.85) {
			responses_ok = false
		}
	})
	credit_var = (missed_percent < 0.4 && (avg_rt > 200) && responses_ok)
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text + '</p></div>'
}

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
};


// Runs on last trial
var record_acc = function(data, t) {
	var target = t || data.target
	var stim = data.stim
	var key = data.key_press
	
	if (stim == target && key == 39) {
		correct = true
		if (block_trial >= delay) {
			block_acc += 1
		}
	} else if (stim != target && key == 40) {
		correct = true
		if (block_trial >= delay) {
			block_acc += 1
		}
	} else {
		correct = false
	}
	
	jsPsych.data.addDataToLastTrial({
		correct: correct,
		stim: curr_stim,
		trial_num: current_trial
	})
	
	current_trial = current_trial + 1
	within_block_trial = within_block_trial + 1
	block_trial = block_trial + 1
	return correct;
};

// Update variables
// 	** within_block_trial 	tracks trial within a block
//	** current_block		tracks the block we're on
//	** delay				tracks the "N-back load"
//	** new_block			tracks if the block is of a new type
//								if it is, we show a different set of instructions
var update_params = function() {
	
	// Check if we need to increase or decrease the response deadline
	var count_timeouts = 0
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	for(var i = 0; i < experiment_data.length; ++i){
		if(experiment_data[i].rt == -1 & experiment_data[i].block_num == current_block)
			count_timeouts++;
	}
	
	// SLOW DOWN
	// If we have more than 7 timeouts (40%)
	//	and deadline is not already 3500ms (max)
	//	then slow it down by 500ms
	if(count_timeouts > 7 & deadline < 3500) deadline += 500
	
	// SPEED UP
	// If we have fewer than 3 timeouts (10%)
	//	and deadline is not already 2000ms
	//	then speed it up by 500ms
	else if(count_timeouts < 3 & deadline > 2000) deadline -= 500
	
	
	// ALERT
	// If we have more than 12 timeouts (60%)
	//	then show an alert
	if(count_timeouts >= 12) $.alertable.alert("Whoa! Don't take this the wrong way, but you were going too slow on that last round. Please respond to each animal *before* the next animal appears on the screen.");
	
	
	// Trial within block
	within_block_trial = 0;	
	
	// Current block
	current_block += 1
	
	// Update delay
	if(current_block == 1) delay = 1
	else if(current_block == 2 | current_block == 3 | current_block == 4) delay = 2
	else if(current_block == 5 | current_block == 6 | current_block == 7) delay = 3
	
	// Determine if this is a new delay/load
	//	if so, show "first time" instructions (more verbose)
	if(current_block == 1 | current_block == 2 | current_block == 5) new_block = 1
	else new_block = 0
	
}

var update_target = function() {
	if (stims.length >= delay) {
		target = stims.slice(-delay)[0]
	} else {
		target = ""
	}
};

var getStim = function() {
	var trial_type = 'target'
	curr_stim = array[delay][within_block_trial]
	stims.push(curr_stim)
	
	// Refresh if we got to the end
	if(within_block_trial == num_trials + delay){
		array[delay] = genSet(objects, delay)
	}
	
	return '<div class = centerbox><div class = center-text><div class = svg><img class="img" src="stims/'+curr_stim+'" style="max-width:150px"></div></div></div>'
}

var getDeadline = function() {	
	return deadline;
}

var getTarget = function() {
	if(within_block_trial >= delay)
		return array[delay][within_block_trial - delay];
	else return "";
}

var getData = function() {
	return {
		trial_id: "stim",
		exp_stage: "test",
		load: delay,
		target: target,
		block_num: current_block,
		stim: array[delay][within_block_trial]
	}
}

// Instructions for the different N-Backs
//	different instructions are shown for first time and repetitions
var getText = function() {
	
	// First time this type of delay is shown
	if(new_block == 1){
		if(delay == 1)
			return '<div class = centerbox style="height:80vh;text-align:center;"><p class = block-text><font size=24>1 Back (round '+current_block+' of '+num_blocks+')</font><br /><br />Now we\'re going to play the 1-back for real.<br \><br \>Remember: The object of the 1-back is to identify when the animal you see is the same or different from the animal you saw <strong><u>1 item back</u></strong>.<br \><br \>In the example below, the current animal is a <strong><u>bee</u></strong>, and 1-back animal was also a <strong><u>bee</u></strong>, so we have a 1-back match.</p><img src="imgs/1back_diagram.svg" style="max-width:500px"><br /><p class = block-text>This is a test round, so there won\'t be any feedback. Although you won\'t know if you are responding correctly, it is important that you <strong><u>be as accurate as you can</u></strong>. It is also important that you <strong><u>respond</u></strong> to each animal <strong><u>before the next animal appears</u></strong> on the screen.  <br /><br />Get ready, it will move quickly!<br /><br />Press <strong>enter</strong> to begin.</p><br /><br /></div>';	
		else if(delay == 2)
			return '<div class = centerbox style="height:80vh;text-align:center;"><p class = block-text><font size=24>2 Back (round '+current_block+' of '+num_blocks+')</font><br /><br />Now we\'re going to play the 2-back.<br \><br \>The object of the 2-back is to identify when the animal you see is the same or different from the animal you saw <strong><u>2 items back</u></strong>.<br \><br \>In the example below, the current animal is a <strong><u>bee</u></strong>, and 2-back animal was also a <strong><u>bee</u></strong>, so we have a 2-back match.</p><img src="imgs/2back_diagram.svg" style="max-width:500px"><br /><br /><p class = block-text>This is a test round, so there won\'t be any feedback. Although you won\'t know if you are responding correctly, it is important that you <strong><u>be as accurate as you can</u></strong>. It is also important that you <strong><u>respond</u></strong> to each animal <strong><u>before the next animal appears</u></strong> on the screen. <br /><br />Get ready, it will move quickly!<br /><br />Press <strong>enter</strong> to begin.</p><br /><br /></div>';
		else
			return '<div class = centerbox style="height:80vh;text-align:center;"><p class = block-text><font size=24>3 Back (round '+current_block+' of '+num_blocks+')</font><br /><br />Now we\'re going to play the 3-back.<br \><br \>The object of the 3-back is to identify when the animal you see is the same or different from the animal you saw <strong><u>3 items back</u></strong>.<br \><br \>In the example below, the current animal is a <strong><u>bee</u></strong>, and 3-back animal was also a <strong><u>bee</u></strong>, so we have a 3-back match.</p><img src="imgs/3back_diagram.svg" style="max-width:500px"><br /><br /><p class = block-text>This is a test round, so there won\'t be any feedback. Although you won\'t know if you are responding correctly, it is important that you <strong><u>be as accurate as you can</u></strong>. It is also important that you <strong><u>respond</u></strong> to each animal <strong><u>before the next animal appears</u></strong> on the screen.  <br /><br />Prepare yourself, this one is a real challenge!<br /><br />Press <strong>enter</strong> to begin.</p><br /><br /></div>';
	} 
	
	// Not the first time this type of delay is shown
	else if(new_block == 0)
		return '<div  class = centerbox style="height:80vh;text-align:center;"><p class = block-text><font size=24>'+delay+' Back (round '+current_block+' of '+num_blocks+')</font><br /><br />Great! If you need to, you can take a short break before continuing (please no more than a few minutes).<br /><br />This will be another round of <strong><u>'+delay+' Back</u></strong>.<br /><br />In case you need a refresher, here is the task diagram once more.</p><img src="imgs/'+delay+'back_diagram.svg" style="max-width:500px"><br /><br /><p class = block-text><br />This is a test round so there won\'t be any feedback. As you play, be as accurate as you can and respond to each animal before the next one appears. <br /><br />Whenever you\'re ready, press <strong>enter</strong> to begin.</p><br /><br /></div>';
}

// Get a random number between min and max
function getRand(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

//	CNBM = Count N Back Matches, where N is the N-back level
//		helper to genSet (below)
var cnbm = function(stim_arr, n) {
	count_matches = 0;
	for (var i = n; i < stim_arr.length; i++) {
		if(stim_arr[i] == stim_arr[i-n]){
			count_matches++;
		}
	}
	return count_matches;
}

// Generate a block
//	this is set to generate a block of length 20 with 7 targets
function genSet(array, n){
	
	// Loop until we have exactly 7 targets
	while ( cnbm(array, n) != 7 ) {
		
		len = 20		
		array = objects;
		
		// Generate intial array by concatenation up to length, then shuffle
		for (var i = 1; i < len / objects.length; i++) {
			array = jsPsych.randomization.shuffle( array.concat(objects) )
		}	
		
		// Append n objects to end of array
		//	because first n objects don't have any targets
		for (var i = 1; i <= n; i++) {
			array = array.concat(objects[getRand(0, objects.length - 1)])
		}	
	   
	   // Add targets to array at random
		for (var i = n; i < 7; i++) {
			x = getRand(n + n, array.length - 1)
			array[x] = array[x - n]
		}		
	}
	
	return array;
}


// Used to present a demo of the stimulus presentation in instructions
var slides = function(){
	
	function nextSlide() {
		slides[currentSlide].className = 'slide';
		currentSlide = (currentSlide+1)%slides.length;
		slides[currentSlide].className = 'slide showing';
	}	
	var slides = document.querySelectorAll('#slides .slide');
	var currentSlide = 0;
	var slideInterval = setInterval(nextSlide,1000);

};


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true //default to true

// task specific variables
var num_blocks = 7 // number of test blocks
var num_trials = 20 // total num_trials
var block_acc = 0 // record block accuracy to determine next blocks delay
var delay = 1 // starting delay
var trials_left = 0 // counter used by test_node
var target_trials = [] // array defining whether each trial in a block is a target trial
var current_trial = 0
var within_block_trial = 1
var current_block = 0
var block_trial = 0
var target = ""
var curr_stim = ''
var new_block = 0
var deadline = 2000 // Start at 2000ms, and "adapt" to performance
					// 		since the N-Back is primarily about accuracy
					// 		and not speed, we don't want to put those with
					// 		slower response times at a disadvantage
var timeouts_last_block = 0 // hold # of timeouts on last block
var stims = [] //hold stims per block
var correct_response = ""



/*
###############
Credits
	for images
###############

	fish.svg
	lobster.svg
	whale.svg
	bee.svg
	butterfly.svg
	tortoise.svg
	pig.svg
	elephant.svg
	parrot.svg

	Author: Freepik
	Sources: 
	https://www.flaticon.com/packs/sea-life-collection
	https://www.flaticon.com/packs/animals-19/2
	https://www.flaticon.com/free-icon/tortoise_1045269
	https://www.flaticon.com/free-icon/elephant_427560
	https://www.flaticon.com/free-icon/pig_616547X
	https://www.flaticon.com/free-icon/parrot_427487
	
###############
*/

var objects = [
	"fish.svg",
	"lobster.svg",
	"whale.svg",
	"bee.svg",
	"butterfly.svg",
	"tortoise.svg",
	"pig.svg",
	"elephant.svg",
	"parrot.svg",
	"lion.svg"
]

// Initial shuffle
objects = jsPsych.randomization.shuffle(objects)

// Preload all images
if (document.images) {
	for (var i = 0; i < objects.length; i++) {
		window["stims_"+i] = new Image();
		window["stims_"+i].src = "stims/"+objects[i];
	}
	window["instr1"] = new Image();
	window["instr2"] = new Image();
	window["instr3"] = new Image();
	window["instr4"] = new Image();
	window["instr5"] = new Image();
	window["instr1"].src = "imgs/1back_diagram.svg";
	window["instr2"].src = "imgs/1back_diagram_nonmatch.svg";
	window["instr3"].src = "imgs/2back_diagram.svg";
	window["instr4"].src = "imgs/3back_diagram.svg";
	window["instr5"].src = "imgs/arrow_keys.svg";
}

//####################################################
//####################################################


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
//	 give 7.5 seconds to respond to each

var my_attn_qs = [{'Q': '<p>ATTENTION CHECK</p> <p>Press the Spacebar</p>', 'A': 32}, 
						{'Q': '<p>ATTENTION CHECK</p> <p>Press the "8" key</p>', 'A': 56}]

var attention_index = 0
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: "attention"
	},
	timing_response: 7500,
	response_ends_trial: true,
	timing_post_trial: 200
}

var getAttentionQ = function() {
	if(attention_index == 1) attention_index += 1
	return my_attn_qs[attention_index]['Q']
}
var getAttentionA = function() {
	if(attention_index == 1) attention_index += 1
	return my_attn_qs[attention_index]['A']
}

var attention_node = {
	timeline: [attention_check_block],
	question: getAttentionQ,
	key_answer: getAttentionA,
	conditional_function: function() {
		return run_attention_checks
	}
}


/* define static blocks */
var feedback_instruct_text =
	'<div class = centerbox style="height:80vh"><p class = block-text>Let\'s play a memory game! Focus will be important here, so before we begin please make sure you\'re ready for about <u><strong>ten minutes</strong></u> of uninterrupted game time! You will have opportunity to take short breaks throughout.</p> <p class = block-text>Press <strong>enter</strong> to continue.</p></div>'
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	data: {
		trial_id: 'instruction'
	},
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
var instructions_block = {
	type: 'poldrack-instructions',
	pages: [
		'<div class = centerbox style="height:80vh"><p class = block-text>In this game you will see a series of animals.<br/></p><table style="width:100%"> <tr> <td style="text-align:center;width:50%"><img src="stims/'+objects[1]+'" style="max-width:150px"></td> <td style="text-align:center;width:50%"><img src="stims/'+objects[2]+'" style="max-width:150px"></td> </tr> </table><br/><p class = block-text>Your goal is to identify when an animal is the same or different from the one you saw <strong><u>N-items back</u></strong> in the sequence.<br \><br \>"N" is the number of items that you need to keep in memory.</p></div>'
	],
	data: {
		trial_id: 'instruction'
	},
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};
var instructions_block2 = {
	type: 'poldrack-instructions',
	pages: [
		'<div class = centerbox style="height:80vh;text-align:center;"><p class = block-text><font size=24>1 Back</font><br /><br />Let\'s start with the 1-back.<br /><br />The object of the 1-back is to identify when the animal you see is the same or different from the animal you saw <strong><u>1 item back</u></strong>.<br \><br \>In the example below, the current animal is a <strong><u>bee</u></strong>, and 1-back animal was also a <strong><u>bee</u></strong>, so we have a 1-back match!</p><img src="imgs/1back_diagram.svg" style="max-width:500px"></div>'
	],
	data: {
		trial_id: 'instruction'
	},
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};
var instructions_block3 = {
	type: 'poldrack-instructions',
	pages: [
		'<div class = centerbox style="height:80vh;text-align:center;"><p class = block-text><font size=24>1 Back</font><br /><br />You will also identify mis-matches. <br \><br \>In the example below, the current object is a <strong><u>bee</u></strong> but the 1-back animal was a <strong><u>whale</u></strong>, so we have a 1-back mis-match. </p><img src="imgs/1back_diagram_nonmatch.svg" style="max-width:500px"></div>'
	],
	data: {
		trial_id: 'instruction'
	},
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};
var instructions_block4 = {
	type: 'poldrack-instructions',
	pages: [
		'<script>slides();</script><div class = centerbox style="height:80vh"><p class = block-text><font size=24>1 Back</font><br /><br />The animals will be presented one after another in a sequence like the animation below. Can you spot the 1-back matches and mis-matches? <br \><br \><ul id="slides"><li class="slide showing"><img src="stims/'+objects[1]+'" style="max-width:150px"></li> <li class="slide "></li> <li class="slide"><img src="stims/'+objects[1]+'" style="max-width:150px"></li><li class="slide "></li> <li class="slide "><img src="stims/'+objects[3]+'" style="max-width:150px"></li> <li class="slide "></li> <li class="slide"><img src="stims/'+objects[2]+'" style="max-width:150px"></li><li class="slide "> </ul><br /></div>'
	],
	data: {
		trial_id: 'instruction'
	},
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};
var instructions_block5 = {
	type: 'poldrack-instructions',
	pages: [
		'<div class = centerbox style="height:80vh;text-align:center;"><p class = block-text><font size=24>1 Back</font><br /><br />Place your fingers on the <strong><u>right arrow</u></strong> and <strong><u>down arrow</u></strong> keys.<br \><br \><strong><u>MATCH:</u></strong> If you see an object that\'s a 1-back match press the <strong><u>right arrow</u></strong> key.<br /><br /><strong><u>MIS-MATCH:</u></strong> If you see an object that\'s 1-back mis-match press the <strong><u>down arrow</u></strong> key.</p><img src="imgs/arrow_keys.svg" style="max-width:500px"><br /></div>'
	],
	data: {
		trial_id: 'instruction'
	},
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};

// Credit for keyboard vector used in instructions
// Author: Kevin Burke
// https://www.vectorportal.com/StockVectors/Icons/ARROW-KEYS-FREE-VECTOR/9459.aspx


var instruction_node = {
	timeline: [instructions_block, instructions_block2, instructions_block3, instructions_block4, instructions_block5]
}

var end_block = {
	type: 'poldrack-text',
	text: '<div class = "centerbox"><p class = "center-block-text">Thanks for playing! </p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	data: {
		trial_id: "end",
    	exp_id: 'test_n_back'
	},
	timing_response: 180000,
	timing_post_trial: 0,
	on_finish: assessPerformance
};

var start_practice_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = block-text><p class = block-text><font size=24>Practice</font><br /><br />Let\'s practice.<br /><br />During practice you\'ll see if you are correct or incorrect after responding. After practice we\'ll go again but without the correct / incorrect feedback.<br /><br /> Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	timing_post_trial: 1000
};

var update_params_block = {
	type: 'call-function',
	func: update_params,
	data: {
		trial_id: "update_params_block"
	},
	timing_post_trial: 0
}

var update_target_block = {
	type: 'call-function',
	func: update_target,
	data: {
		trial_id: "update_target"
	},
	timing_post_trial: 0
}

var start_test_block = {
	type: 'poldrack-text',
	data: {
		exp_stage: "test",
		trial_id: "delay_text"
	},
	text: getText,
	cont_key: [13],
	timing_response: 900000,
	on_finish: function() {
		block_trial = 0
		stims = []
		trials_left = num_trials + delay
		target_trials = []
		block_acc = 0;
	}
};


// ######################################################
// ######################################################

//#######################
// 1-back practice
practice_trials = []
array = genSet(objects, 1)
for (var i = 0; i < (num_trials+1); i++) {
	var stim = array[i]
	stims.push(stim)
	
	if (i > 0) target = array[i - 1];
	if (stim == target) correct_response = 39;
		else correct_response = 40;
	
	if(i == 0){
		correct_text = "&nbsp;"
		incorrect_text = "&nbsp;"
		timeout_message = "&nbsp;"
		show_stim_with_feedback = false
	} else {		
		correct_text = '<div class = fb_box style="border: 20px solid green"><div class = center-text style="font-size:inherit"><font size = 20>correct</font></div></div>';
		timeout_message = '<div class = fb_box style="border: 20px solid red"><div class = center-text style="font-size:inherit"><font size = 20>too slow</font></div></div>';
		incorrect_text = '<div class = fb_box style="border: 20px solid red"><div class = center-text style="font-size:inherit"><font size = 20>incorrect</font></div></div>';
		show_stim_with_feedback = true
		}
	
	var practice_block = {
		type: 'poldrack-categorize',
		is_html: true,
		stimulus: '<div class = centerbox><div class = center-text><div class = svg><img class="img" src="stims/'+stim+'" style="max-width:150px"></div></div></div>',
		key_answer: correct_response,
		data: {
			trial_id: "stim",
			exp_stage: "practice",
			stim: stim,
			target: target
		},
		correct_text: correct_text,
		incorrect_text: incorrect_text,
		timeout_message: timeout_message,
		timing_feedback_duration: 500,
		show_stim_with_feedback: false,
		response_ends_trial: false,
		choices: [39,40],
		timing_stim: 500,
		timing_response: deadline,
		timing_post_trial: 500
	};
	practice_trials.push(practice_block)
}

//#######################
// All other blocks
var test_block = {
	type: 'poldrack-single-stim',
	is_html: true,
	target: getTarget,
	stimulus: getStim,
	data: getData,
	correct_response: correct_response,
	choices: [39,40],
	timing_stim: 500,
	timing_response: getDeadline,
	timing_post_trial: 0,
	on_finish: function(data) {
			record_acc(data, target)
	}
}; 

var test_node = {
	timeline: [update_target_block, test_block],
	loop_function: function() {
		trials_left -= 1
		if (trials_left === 0) {
			return false
		} else { 
			return true 
		}
	}
}
	
//Set up experiment
var adaptive_n_back_experiment = []

// 		Instructions
adaptive_n_back_experiment.push(instruction_node);

// 		Practice
adaptive_n_back_experiment.push(start_practice_block)
adaptive_n_back_experiment = adaptive_n_back_experiment.concat(practice_trials)

// 		Test blocks
array_2back = []
array_3back = []
for (var b = 1; b <= num_blocks; b++) { 
	array = {
			"1": genSet(objects, 1), 
			"2": genSet(objects, 2), 
			"3": genSet(objects, 3)
			}
	adaptive_n_back_experiment.push(update_params_block)
	adaptive_n_back_experiment.push(start_test_block)
	adaptive_n_back_experiment.push(test_node)
	
	if(b == 3 | b == 6){ // run an attention check on blocks 3 and 6
		adaptive_n_back_experiment.push(attention_node)
	}
}

//		End
adaptive_n_back_experiment.push(end_block)





//#################################################################################################
//#################################################################################################
//#################################################################################################
// Inject a CSS and JS file for custom alerts
//		this way we don't have to modify the index.html file
var link = document.createElement("link");
link.href = "css/jquery.alertable.css";
link.type = "text/css";
link.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(link);

var script = document.createElement('script');
script.setAttribute('src', 'js/jquery.alertable.min.js');
script.setAttribute('type', 'text/javascript');
document.getElementsByTagName('head')[0].appendChild(script);
