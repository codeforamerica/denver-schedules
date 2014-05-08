// ===========================
// SHOW OR HIDE A DIV ON CLICK
// ===========================

$(document).ready(function(){
 
        $(".slidingDiv").hide();
        $(".show_hide").show();
 
    $('.show_hide').click(function(){
    	$(".slidingDiv").slideToggle();
    	var currentClass = $("#filter-chev").attr('class');
    	if(currentClass === "glyphicon glyphicon-chevron-down") {
    		$("#filter-chev").attr("class", "glyphicon glyphicon-chevron-up");
    	}
    	else {
    		$("#filter-chev").attr('class', "glyphicon glyphicon-chevron-down");
    	}
    });
 
});
 