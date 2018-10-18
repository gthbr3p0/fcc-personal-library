$( document ).ready(function() {
  var items = [];
  var itemsRaw = [];
  var item;
  var newStr;
  
  $.getJSON('/api/books', function(data) {
    //var items = [];
    itemsRaw = data;
    $.each(data, function(i, val) {
      items.push('<li class="bookItem" id="' + i + '"><a><i class="fas fa-book"></i>&ensp;' + val.title + ' - ' + val.commentcount + ' comments</a></li>');
      return ( i !== 14 );
    });
    if (items.length >= 15) {
      items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    }
    $('<ul/>', {
      'class': 'listWrapper menu-list', 'style': 'list-style-type: none; margin-left: 0; margin-bottom: 1em;',
      html: items.join('')
      }).appendTo('#display');
  });
  
  var comments = [];
  $('#display').on('click','li.bookItem',function() {
    $("#detailTitle").html('<b>'+itemsRaw[this.id].title+'</b> (id: '+itemsRaw[this.id]._id+')');
    $.getJSON('/api/books/'+itemsRaw[this.id]._id, function(data) {
      comments = [];
      $.each(data.comments, function(i, val) {
        comments.push('<li>' +val+ '</li>');
      });
      comments.push('<form id="newCommentForm" style="margin-top: 1em"><div class="field"><div class="control"><input style="" type="text" class="form-control input" id="commentToAdd" name="comment" placeholder="New Comment"></div></div></form>');
      comments.push('<div class="field is-grouped"><div class="control"><button class="button is-info addComment" id="'+ data._id+'">Add Comment</button></div>');
      comments.push('<div class="control"><button class="button is-danger deleteBook" id="'+ data._id+'">Delete Book</button></div></div>');
      $('#detailComments').html(comments.join(''));
    });
  });
  
  $('#bookDetail').on('click','button.deleteBook',function() {
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'delete',
      success: function(data) {
        //update list
        $('#detailComments').html('<p style="color: red;">'+data+'<p><p>Refresh the page</p>');
      }
    });
  });  
  
  $('#bookDetail').on('click','button.addComment',function() {
    var newComment = $('#commentToAdd').val();
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        comments.unshift(newComment); //adds new comment to top of list
        $('#detailComments').html(comments.join(''));
      }
    });
  });
  
  $('#newBook').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
  });
  
  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
  }); 
  
});