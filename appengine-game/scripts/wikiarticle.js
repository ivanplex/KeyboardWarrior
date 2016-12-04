$(document).ready(function(){
    $("button").click(function() {
    // var wikipage = encodeURIComponent($('#wikitextbox').val());
    // console.log(wikipage);
    $.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=Stack_Overflow&callback=?",
        // url: "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&page=Stack%20Overflow"
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            console.log(data);
            var markup = data.parse.text["*"];
            var blurb = $('<div></div>').html(markup);

            // remove links as they will not work
            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });

           // remove any references
            blurb.find('sup').remove();

            // remove cite error
            blurb.find('.mw-ext-cite-error').remove();

            $('#div1').html($(blurb).find('p'));
        },
        error: function (errorMessage) {
        }
    });
});
});
