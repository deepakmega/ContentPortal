var AWS = require('aws-sdk');
Parse.serverURL = 'http://localhost:1337/parse';
AWS.config.update({
  accessKeyId: 'zzz',
  secretAccessKey: 'xxx+EC6F+xx',
  region: 'us-west-2'
});
var GCMPlatformApplicationArn = 'xxx';
var topics = [1, 2, 3, 4, 5];

var topicARNs = {
  2: 'arn:aws:sns:us-wesxxva',
  1: 'arn:aws:sns:us-wxx16:DotNet',
  4: 'arn:awsxxMobile',
  3: 'arn:aws:sns:uxx:Sql',
  5: 'arn:aws:sns:us-xx116:Web'
}
var sns = new AWS.SNS();

Parse.Cloud.define('createGCMPlatformEndpoint', function(req, res) {
  console.log("Create endpoint Called");
  var deviceToken = req.params.deviceToken;
  if(deviceToken) {
    sns.createPlatformEndpoint({
      PlatformApplicationArn: GCMPlatformApplicationArn,
        Token: deviceToken
      }, function(err, data) {
      if (err) {
        console.log(err.stack);
        return res.error('Could not create endpoint');
      }
      else {
        return res.success(data.EndpointArn);
      }
    });
  }
  else {
    return res.error('Device token not specified.');
  }
});

Parse.Cloud.define('subscribeEndpointARN', function(req, res) {
  console.log("Subscribe called "+ req.params.channels);
  var subscriptions = JSON.parse(req.params.channels);
  var endpointARN = req.params.endpointARN;

  console.log("Subscribe called ", subscriptions, endpointARN);

  var query = new Parse.Query("SNSEndpointSubscription");
  query.equalTo("EndpointARN", endpointARN);
  query.find({
   success: callbackSNSEndpointSubscriptionQuery(subscriptions, endpointARN),
   error: function() {
     console.error("Could not query SNSEndpointSubscription");
   }
 });
});

var callbackSNSEndpointSubscriptionQuery = function(subscriptions, endpointARN) {
  return function(existingSubscriptions) {

    var subTopics = [];
    var subscribedTopicsDictionary = {};
    for (var i = 0; i < existingSubscriptions.length; ++i) {
        subTopics.push(parseInt(existingSubscriptions[i].get("CategoryId")));
        subscribedTopicsDictionary[parseInt(existingSubscriptions[i].get("CategoryId"))] = existingSubscriptions[i];
    }

    for(var topic in topics) {
      if(subscriptions.indexOf(topics[topic]) > -1 && subTopics.indexOf(topics[topic]) < 0) {

        console.log("Subscribing endpoint [%s] to topic [%d].", endpointARN, topics[topic]);
        var params = {
          Protocol: 'application', /* required */
          TopicArn: topicARNs[topics[topic]], /* required */
          Endpoint: endpointARN
        };

        sns.subscribe(params, callbackSNSSubscribe(topics[topic], endpointARN));
      }
      else if (subscriptions.indexOf(topics[topic]) < 0 && subTopics.indexOf(topics[topic]) > -1) {
          subscribedTopicsDictionary[topics[topic]].destroy({});
          var params = {
            SubscriptionArn: subscribedTopicsDictionary[topics[topic]].get("SubscriptionARN") /* required */
          };
          sns.unsubscribe(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });
          console.log("Unsubscribed endpoint [%s] to topic [%d].", endpointARN, topics[topic]);
      }
    }
  }
};

var callbackSNSSubscribe = function(topicIdParam, endpointARN) {
    return function(err, data) {
      if (err) {
         console.log(err, err.stack); // an error occurred
         console.error("AWS SNS Subscribe Errror " + error.code + " : " + error.message);
      }
      else {
        // successful response
        var SNSEndpointSubscription = Parse.Object.extend("SNSEndpointSubscription");
        var snsEndpointSubscription = new SNSEndpointSubscription();
        snsEndpointSubscription.save({
          EndpointARN: endpointARN,
          SubscriptionARN: data['SubscriptionArn'],
          CategoryId: parseInt(topicIdParam)
          }, {
          success: function(snsEndpointSubscription) {
            // The object was saved successfully.
            console.log("Successfully subscribed: " + snsEndpointSubscription);
          },
          error: function(snsEndpointSubscription, error) {
            // The save failed.
            // error is a Parse.Error with an error code and message.
            console.error("Got an error saving to SNSEndpointSubscription " + error.code + " : " + error.message);
          }
        });
      }
    }
};
