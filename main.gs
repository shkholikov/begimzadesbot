function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var token = getBotToken();  // Read the bot token from script properties

  if (contents.message) {
    var chatId = contents.message.chat.id;
    
    if (contents.message.text === '/start') {
      sendWelcomeMessage(chatId, token);
    } else if (contents.message.contact) {
      // If the message contains contact information, log it
      var phoneNumber = contents.message.contact.phone_number;
      var userId = contents.message.contact.user_id;
      var username = contents.message.from.username;
      var firstName = contents.message.from.first_name;
      var lastName = contents.message.from.last_name || '';

      // Check if the user is already registered
      if (isUserRegistered(userId)) {
        sendTextMessage(chatId, "You are already registered, looking forward to sharing more information soon!", token);
      } else {
        // Log user details to Google Sheets
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        sheet.appendRow([new Date(), userId, username, firstName, lastName, phoneNumber]);

        // Notify the user that they've been registered
        sendTextMessage(chatId, "You have been registered successfully!", token);
      }

      // Remove the keyboard after registration
      removeKeyboard(chatId, token);
    }
  } else if (contents.callback_query) {
    var userId = contents.callback_query.from.id;
    var chatId = contents.callback_query.message.chat.id;

    // Check if the user is already registered on button click
    if (isUserRegistered(userId)) {
      sendTextMessage(chatId, "You are already registered, looking forward to sharing more information soon!", token);
    } else {
      requestPhoneNumber(chatId, token);
    }
  }
}

function getBotToken() {
  return PropertiesService.getScriptProperties().getProperty('TELEGRAM_BOT_TOKEN');
}

function sendWelcomeMessage(chatId, token) {
  var url = "https://api.telegram.org/bot" + token + "/sendMessage";
  var payload = {
    'chat_id': chatId,
    'text': "Welcome to my Blog! Want to join my wait list? Let's click on the button below to register and share your phone number.",
    'reply_markup': {
      'inline_keyboard': [
        [
          {
            'text': 'Register',  // Keep text minimal to reduce button size
            'callback_data': 'register'
          }
        ]
      ]
    }
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);
}

function sendTextMessage(chatId, text, token) {
  var url = "https://api.telegram.org/bot" + token + "/sendMessage";
  var payload = {
    'chat_id': chatId,
    'text': text
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);
}

function requestPhoneNumber(chatId, token) {
  var url = "https://api.telegram.org/bot" + token + "/sendMessage";
  var payload = {
    'chat_id': chatId,
    'text': "Please share your phone number to complete registration.",
    'reply_markup': {
      'one_time_keyboard': true,
      'resize_keyboard': true,
      'keyboard': [
        [
          {
            'text': 'Share my phone number',
            'request_contact': true
          }
        ]
      ]
    }
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);
}

function removeKeyboard(chatId, token) {
  var url = "https://api.telegram.org/bot" + token + "/sendMessage";
  var payload = {
    'chat_id': chatId,
    'text': "Thank you!",
    'reply_markup': {
      'remove_keyboard': true
    }
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);
}

function isUserRegistered(userId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  // Check if userId is already in the sheet
  for (var i = 0; i < data.length; i++) {
    if (data[i][1] == userId) {
      return true;  // User is already registered
    }
  }
  
  return false;  // User is not registered
}
