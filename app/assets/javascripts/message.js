$(function(){ 

    var buildHTML = function(message) {
      if (message.image) {
        var image = `<img class="chat-main-message-text__image" src="${message.image}">` 
      }else{
        var image = ""
      }
       var html =`
            <div class="chat-main-message" data-id="${message.id}">
                <div class="chat-main-message-top">
                    <div class="chat-main-message-top-name">
                      ${message.user_name}
                    </div>
                    <div class="chat-main-message-top-date">
                      ${message.created_at}
                    </div>
                  </div>
                <div class="chat-main-message-text">
                  ${image}
                  ${message.content}
                </div>
              </div>
            </div>`
          return html;
      };

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: "json",
      processData: false,
      contentType: false
    })

    .done(function(data){
      var html = buildHTML(data);
      $('.chat-main').append(html);
      $('.chat-main').animate({scrollTop: $('.chat-main')[0].scrollHeight});
      $('form')[0].reset();
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    })
    .always(function(){
      $(".chat-bottom-message-submit").prop('disabled',false);
    });
  });

  var reloadMessages = function() {
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    last_message_id = $('.chat-main-message:last').data("id");
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      console.table(messages)
      if (messages.length !== 0) {
      var insertHTML = '';
      $.each(messages, function(i, message) {
        insertHTML += buildHTML(message)
      });
      //メッセージが入ったHTMLに、入れ物ごと追加
      $('.chat-main-message').append(insertHTML);
      $('.chat-main-message').animate({ scrollTop: $('.chat-main-message')[0].scrollHeight});
      $("#new_message")[0].reset();
      $(".chat-bottom-message-submit").prop("disabled", false);
    }
    })
    .fail(function() {
      alert();
    });
  };

  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
      setInterval(reloadMessages, 7000);
  }
});