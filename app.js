let exercisesData = {};
let popularWorkouts = [];
let warmupExercises = [];

// Load data from data.json file
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        exercisesData = data.exercises;
        popularWorkouts = data.popularWorkouts;
        warmupExercises = data.warmupExercises;
        populateMuscleGroups();
    } catch (error) {
        console.error("Error loading exercises:", error);
    }
}

// Function to randomly select a popular workout
const getRandomWorkout = () => {
    return popularWorkouts[Math.floor(Math.random() * popularWorkouts.length)];
};

// Function to display a random workout
const displayRandomWorkout = () => {
    const randomWorkout = getRandomWorkout();
    const randomWorkoutDisplay = document.getElementById('randomWorkoutDisplay');
    randomWorkoutDisplay.innerHTML = ''; // Clear previous workout

    const workoutNameElement = document.createElement('h3');
    workoutNameElement.innerText = randomWorkout.name;
    workoutNameElement.className = 'workout-text';

    const workoutDetailsElement = document.createElement('p');
    workoutDetailsElement.innerText = randomWorkout.details;
    workoutDetailsElement.className = 'workout-text';

    randomWorkoutDisplay.appendChild(workoutNameElement);
    randomWorkoutDisplay.appendChild(workoutDetailsElement);
};

// Function to generate a workout based on selected muscle groups, length, and format
const generateWorkout = (muscleGroups, workoutLength, format) => {
    const workout = [];
    const warmup = [];
    const exerciseLimit = 2; // Max exercises per muscle group

    // Warmup section: select 2 unique warmup exercises
    while (warmup.length < 2) {
        const randomWarmup = warmupExercises[Math.floor(Math.random() * warmupExercises.length)];
        if (!warmup.includes(randomWarmup)) {
            warmup.push(randomWarmup);
        }
    }

    // Main workout section
    muscleGroups.forEach(group => {
        const groupExercises = exercisesData[group];
        if (groupExercises) {
            const selectedExercises = [];
            while (selectedExercises.length < exerciseLimit && selectedExercises.length < groupExercises.length) {
                const randomExercise = groupExercises[Math.floor(Math.random() * groupExercises.length)];
                
                // Avoid duplicates
                if (!selectedExercises.includes(randomExercise)) {
                    selectedExercises.push(randomExercise);
                }
            }
            workout.push(...selectedExercises);
        }
    });

    // Add format (AMRAP or EMOM) if selected
    if (format === "AMRAP") {
        workout.unshift({ name: "AMRAP", time: `${workoutLength} minutes` });
    } else if (format === "EMOM") {
        workout.unshift({ name: "EMOM", time: `${workoutLength} minutes` });
    }

    return { warmup, workout };
};

// Populate muscle group buttons based on exercisesData
const populateMuscleGroups = () => {
    const muscleGroupsContainer = document.getElementById('muscleGroups');
    muscleGroupsContainer.innerHTML = ''; // Clear previous buttons

    Object.keys(exercisesData).forEach(group => {
        const button = document.createElement('div');
        button.classList.add('option-button');
        button.innerText = group.charAt(0).toUpperCase() + group.slice(1);
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
        });
        muscleGroupsContainer.appendChild(button);
    });
};

// Generate workout button functionality
document.getElementById('generateWorkout').addEventListener('click', () => {
    const workoutLength = parseInt(document.getElementById('workoutLength').value) || 15;
    const selectedGroups = Array.from(document.getElementById('muscleGroups').children)
        .filter(button => button.classList.contains('selected'))
        .map(button => button.innerText.toLowerCase());
    
    // Get selected format
    const format = document.querySelector('input[name="format"]:checked')?.value;

    const { warmup, workout } = generateWorkout(selectedGroups, workoutLength, format);

    // Display warmup exercises in separate section
    const warmupDisplay = document.getElementById('warmupDisplay');
    warmupDisplay.innerHTML = ''; // Clear previous warmups
    warmup.forEach(exercise => {
        const exerciseElement = document.createElement('p');
        exerciseElement.className = 'workout-text';
        exerciseElement.innerText = `${exercise.name} - ${exercise.time || exercise.reps}`;
        warmupDisplay.appendChild(exerciseElement);
    });

    // Display main workout exercises
    const workoutDisplay = document.getElementById('workoutDisplay');
    workoutDisplay.innerHTML = ''; // Clear previous workouts
    if (workout.length > 0) {
        workout.forEach(exercise => {
            const exerciseElement = document.createElement('p');
            exerciseElement.className = 'workout-text';
            exerciseElement.innerText = `${exercise.name} - ${exercise.reps || exercise.time}`;
            workoutDisplay.appendChild(exerciseElement);
        });
        document.getElementById('placeholderText').style.display = 'none';
    } else {
        document.getElementById('placeholderText').style.display = 'block';
    }
});

// Add event listener to random workout button
document.getElementById('randomWorkoutButton').addEventListener('click', displayRandomWorkout);

// Initialize by loading data and populating muscle group buttons
loadData();
