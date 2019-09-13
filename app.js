$(document).ready(function () {
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyBb-pUmGtnlMVjDDSlPj1xVI2INyvUAC0g",
        authDomain: "class-ae80d.firebaseapp.com",
        databaseURL: "https://class-ae80d.firebaseio.com",
        projectId: "class-ae80d",
        storageBucket: "",
        messagingSenderId: "781003846057",
        appId: "1:781003846057:web:8803c8c771701c7d5a14b8"
    };

    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
    
    var trainName;
    var destination;
    var firstArrival;
    var frequency;

    $("#add").on("click", function (event) {
        if (($("#trainName").val() == "") || (($("#destination").val() == "") || ($("#frequency").val() == "") || ($("#startTime").val() == ""))) {
            event.preventDefault()
            return
        } else {
            event.preventDefault()

            trainName = $("#trainName").val();
            destination = $("#destination").val();
            firstArrival = $("#startTime").val();
            frequency = $("#frequency").val();
            $("#trainName").val('');
            $("#destination").val('');
            $("#startTime").val('');
            $("#frequency").val('');
            // console.log(trainName,destination,frequency,firstArrival)
        }
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstArrival: firstArrival,
            frequency: frequency,
        });
    })
    var currentTime = moment();
    setInterval(function() {
    $("#currentTime").html(moment().format('MMMM  Do dddd hh:mm:ss A '))        
    }, 1000);
  
    database.ref().on("child_added", function (snapshot) {


        var firstTraineTime = snapshot.val().firstArrival
        var frequency = snapshot.val().frequency

        var firstTimeConverted = moment(firstTraineTime, "hh:mm A").subtract(1, "years");
        // console.log(firstTimeConverted)
        var currentTime = moment();
        // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
        // Difference between the times
        var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
        // console.log("DIFFERENCE IN TIME: " + diffTime);
        // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        // console.log(tRemainder);
        // Minute Until Train
        var tMinutesTillTrain = frequency - tRemainder;
        // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = currentTime.add(tMinutesTillTrain, "minutes").format("hh:mm A");
        // console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

        var tableRow = $("<tr>");
        var tableTrainName = $("<td>").text(snapshot.val().trainName);
        var tableDestination = $("<td>").text(snapshot.val().destination);
        var tableFrequency = $("<td>").text(snapshot.val().frequency);
        var tableNextTraine = $("<td>").text(nextTrain)
        var tableMinutesAway = $("<td>").text(tMinutesTillTrain)


        tableRow.append(tableTrainName, tableDestination, tableFrequency, tableNextTraine, tableMinutesAway)
        $("tbody").append(tableRow)


    })

})