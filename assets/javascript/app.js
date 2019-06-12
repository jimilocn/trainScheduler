$(document).ready(function () { // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyAmMDBmWISfEGP-cK4fjxwl7Ic8_zT8F3w",
        authDomain: "trainschedulereal.firebaseapp.com",
        databaseURL: "https://trainschedulereal.firebaseio.com",
        projectId: "trainschedulereal",
        storageBucket: "",
        messagingSenderId: "977976704944",
        appId: "1:977976704944:web:fc7d710a5dbc7c61"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    //   
    var audioElement = document.createElement("audio");
    // attaches the sources for the newly created audio element. audio was taken from youtube clip https://www.youtube.com/watch?v=2QSW80F7xfk
    audioElement.setAttribute("src", "assets/sound/Japanese Music.mp3");
    // plays the new audio
    audioElement.play();

    $(".play-button").on("click", function () {
        audioElement.play()
    });
    $(".pause-button").on("click", function () {
        audioElement.pause()
    });



    // 2. Button for adding train
    $("#add-train-btn").on("click", function (event) {
        event.preventDefault();

        clearInterval(setIntervalId);
   
        // Grabs user input
        var trainName = $("#train-name-input").val().trim();
        var trainDestination = $("#destination-input").val().trim();
        var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("HH:mm");
        var trainFrequency = $("#frequency-input").val().trim();

        // Creates local "temporary" object for holding train data
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            start: trainStart,
            frequency: trainFrequency
        };
        if (trainName.length > 0 && trainDestination.length > 0 && trainStart.length > 0 && trainFrequency.length > 0) {


            // Uploads train data to the database
            database.ref().push(newTrain);
            $("tbody").empty();
            displayTime();

        }
        // Logs everything to console
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.start);
        console.log(newTrain.frequency);

        //   alert("Train successfully added");

        // Clears all of the text-boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#start-input").val("");
        $("#frequency-input").val("");
    });

    // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
    function displayTrain() {

        database.ref().on("child_added", function (childSnapshot) {


            // snapshot value called key childSnapshot.key


            // Store everything into a variable.
            var trainName = childSnapshot.val().name;
            var trainDestination = childSnapshot.val().destination;
            var trainStart = childSnapshot.val().start;
            var trainFrequency = childSnapshot.val().frequency;



            //   math for time until next train
            var firstTime = moment(trainStart, "HH:mm").format("hh:mm a");



            var tFrequency = parseInt(trainFrequency);


            // Current Time
            var currentTime = moment().format("HH:mm");



            // Difference between the times
            var diffTime = moment().diff(moment(trainStart, "HH:mm"), "minutes");
            // var diffTime = (currentTime.diff(firstTime));


            // Time apart (remainder)
            var tRemainder = diffTime % tFrequency;


            // Minute Until Train
            var tMinutesTillTrain = tFrequency - tRemainder;


            // Next Train
            var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm a");

            // Create the new row
            var newRow = $("<tr>")
            var removeX = $("<td>");
            removeX.attr("class", "delete")
            removeX.attr("data-key", childSnapshot.key)

            if (diffTime > 0) {

                newRow.append(
                    $("<td>").text(trainName),
                    $("<td>").text(trainDestination),
                    $("<td>").text(firstTime),
                    $("<td>").text(trainFrequency + " mins"),
                    $("<td>").text(nextTrain),
                    $("<td>").text(tMinutesTillTrain + " mins"),
                    removeX.html("&#9746;")

                );
                newRow.attr("data-value", trainName);
                newRow.attr("class", trainName);
                $("#train-table > tbody").append(newRow);
            } else {

                newRow.append(
                    $("<td>").text(trainName),
                    $("<td>").text(trainDestination),
                    $("<td>").text(firstTime),
                    $("<td>").text(trainFrequency + " mins"),
                    $("<td>").text(firstTime),
                    $("<td>").text(-1 * diffTime + " mins"),
                    removeX.html("&#9746;")
                );
                newRow.attr("data-value", trainName);
                newRow.attr("class", trainName);
                $("#train-table > tbody").append(newRow);

            }





        });
    };

    
    $(document).on("click", ".delete", function () {
        var snapshotKey = $(this).attr("data-key");

        database.ref().child(snapshotKey).remove();
      

        displayTime();

    });

    $("#currentTime").html("<h2>" + moment().format("hh:mm a") + "</h2>")
    displayTrain();

    var setIntervalId = setInterval(displayTime, 10 * 1000);

    function displayTime() {
        $("tbody").empty();
        setInterval(displayTime, 10 * 1000);
        $("#currentTime").html("<h2>" + moment().format("hh:mm a") + "</h2>");
        displayTrain();
    };


});