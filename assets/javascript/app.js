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

        // Uploads train data to the database
        database.ref().push(newTrain);

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
            console.log(childSnapshot.val());

            // Store everything into a variable.
            var trainName = childSnapshot.val().name;
            var trainDestination = childSnapshot.val().destination;
            var trainStart = childSnapshot.val().start;
            var trainFrequency = childSnapshot.val().frequency;

            // train Info
            console.log(trainName);
            console.log(trainDestination);
            console.log(trainStart);
            console.log(trainFrequency);

            //   math for time until next train
            var firstTime = moment(trainStart, "HH:mm").format("HH:mm");
            console.log("First arrival: ", firstTime)


            var tFrequency = parseInt(trainFrequency);
            console.log("train frequency:", tFrequency)

            // Current Time
            var currentTime = moment().format("HH:mm");
            console.log("CURRENT TIME: " + currentTime);

            // first time converted
            var firstTimeConverted = moment(firstTime, "HH:mm")
            console.log(firstTimeConverted);

            // Difference between the times
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            // var diffTime = (currentTime.diff(firstTime));
            console.log("DIFFERENCE IN TIME: " + diffTime);

            // Time apart (remainder)
            var tRemainder = diffTime % tFrequency;
            console.log("remainder: ", tRemainder);

            // Minute Until Train
            var tMinutesTillTrain = tFrequency - tRemainder;
            console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

            // Next Train
            var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("HH:mm");

            // Create the new row
            var newRow = $("<tr>").append(
                $("<td>").text(trainName),
                $("<td>").text(trainDestination),
                $("<td>").text(trainStart),
                $("<td>").text(trainFrequency),
                $("<td>").text(nextTrain),
                $("<td>").text(tMinutesTillTrain)

            );

            // Append the new row to the table
            $("#train-table > tbody").append(newRow);
        });
    }


    $("#currentTime").html("<h2>" + moment().format("HH:mm") + "</h2>")
    displayTrain();

    setInterval(displayTime, 10 * 1000);

    function displayTime() {
        $("tbody").empty();
        $("#currentTime").html("<h2>" + moment().format("HH:mm") + "</h2>");
        displayTrain();
    };


});