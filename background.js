'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {urlContains: 'webpage.html'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

//Replace {urlContains: 'webpage.html'} to {hostEquals: 'www.example.com'}
//Tested with webpage.html in local
