const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
// This is because a method called graphqlHTTP exist in the express-graphql module and you are 
// destructure with another method name that does not exist in the module
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    astFromValue
} = require('graphql')
const app = express()

const exercises = [
    { id: 1, name: 'Strength' },
    { id: 2, name: 'Stretching' },
    { id: 3, name: 'Conditioning' },
    { id: 4, name: 'Powerlifting' },
    { id: 5, name: 'Olympic Weightlifting' },
    { id: 6, name: 'Warmup' },
]

const targetMuscles = [
    { id: 1, name: 'Abs' },
    { id: 2, name: 'Biceps' },
    { id: 3, name: 'Calves' },
    { id: 4, name: 'Chest' },
    { id: 5, name: 'Forearms' },
    { id: 6, name: 'Glutes' },
    { id: 7, name: 'Lats' },
    { id: 8, name: 'Upper back' },
    { id: 9, name: 'Quadriceps' }, 
    { id: 10, name: 'Shoulder' },
    { id: 11, name: 'Triceps' },
    { id: 12, name: 'Hamstrings' },
    { id: 13, name: 'Lower back'}
]

const movementPatterns = [
    { id: 1, pattern: 'Twist' },
    { id: 2, pattern: 'Rotation' },
    { id: 3, pattern: 'Pull' },
    { id: 4, pattern: 'Push' },
    { id: 5, pattern: 'Lunge' },
    { id: 6, pattern: 'Squat' },
]

const equipments = [
    { id: 1, name: 'Band' },
    { id: 2, name: 'Barbell' },
    { id: 3, name: 'Dumbbell' },
    { id: 4, name: 'Machine' },
    { id: 5, name: 'Bodyweight' },
    { id: 6, name: 'Other'},
    { id: 7, name: 'Tiger Tail'}
]

const skillLevels = [
    { id: 1, level: 'Beginner' },
    { id: 2, level: 'Intermediate' },
    { id: 3, level: 'Advanced' }
]

const movements = [
    { id: 1, name: 'Crunch', exerciseType: 1, targetMuscleType: 1, movementPatternType: 1, equipmentType: 1, skillLevelType: 2, description: 'This is crunch' },
    { id: 2, name: 'Barbell Roll-Out', exerciseType: 1, targetMuscleType: 1, movementPatternType: 2, equipmentType: 2, skillLevelType: 2, description: 'This is barbell roll-out' },
    { id: 3, name: 'Seated Hammer Curl', exerciseType: 1, targetMuscleType: 2, movementPatternType: 3, equipmentType: 3, skillLevelType: 1, description: 'This is seated hammer curl' },
    { id: 4, name: 'Machine Bicep Curl', exerciseType: 1, targetMuscleType: 2, movementPatternType: 3, equipmentType: 4, skillLevelType: 1, description: 'This is machine bicep curl' },
    { id: 5, name: 'Calf Press', exerciseType: 1, targetMuscleType: 3, movementPatternType: 4, equipmentType: 4, skillLevelType: 1, description: 'This is calf press' },
    { id: 6, name: 'Incline Push-Up', exerciseType: 1, targetMuscleType: 4, movementPatternType: 4, equipmentType: 5, skillLevelType: 2, description: 'This is incline push-up' },
    { id: 7, name: 'Cable Chest Press', exerciseType: 1, targetMuscleType: 4, movementPatternType: 4, equipmentType: 4, skillLevelType: 1, description: 'This is cable chest press' },
    { id: 8, name: 'Wrist Roller', exerciseType: 1, targetMuscleType: 5, movementPatternType: 2, equipmentType: 6, skillLevelType: 1, description: 'This is wrist roller' },
    { id: 9, name: 'Holman Frogger', exerciseType: 1, targetMuscleType: 6, movementPatternType: 5, equipmentType: 5, skillLevelType: 2, description: 'This is Hoiman Frogger' },
    { id: 10, name: 'Overhead Lat', exerciseType: 2, targetMuscleType: 1, movementPatternType: 3, equipmentType: 6, skillLevelType: 1, description: 'This is overhead lat' },
    { id: 11, name: 'Sled Row', exerciseType: 1, targetMuscleType: 8, movementPatternType: 3, equipmentType: 6, skillLevelType: 1, description: 'This is sled row' },
    { id: 12, name: 'Barbell Squat', exerciseType: 1, targetMuscleType: 9, movementPatternType: 6, equipmentType: 2, skillLevelType: 2, description: 'This is squat' },
    { id: 13, name: 'Dumbbell Clean And Push-Press', exerciseType: 1, targetMuscleType: 10, movementPatternType: 4, equipmentType: 3, skillLevelType: 2, description: 'This is dumbell clean and push-press' },
    { id: 14, name: 'Single-Arm Dumbbell Skullcrusher', exerciseType: 1, targetMuscleType: 11, movementPatternType: 4, equipmentType: 3, skillLevelType: 2, description: 'This is single-arm dumbbell skullcrusher' },
    { id: 15, name: 'Dip Machine', exerciseType: 1, targetMuscleType: 11, movementPatternType: 4, equipmentType: 4, skillLevelType: 2, description: 'This is dip machine' },
    { id: 16, name: 'Spider Curl', exerciseType: 1, targetMuscleType: 2, movementPatternType: 3, equipmentType: 2, skillLevelType: 1, description: 'This is spider curl' },
    { id: 17, name: 'Forearm Tiger Tail', exerciseType: 6, targetMuscleType: 5, movementPatternType: 2, equipmentType: 7, skillLevelType: 1, description: 'This is forearm tiger tail' },
    { id: 18, name: 'Side Lying Clam', exerciseType: 6, targetMuscleType: 6, movementPatternType: 4, equipmentType: 5, skillLevelType: 1, description: 'This is side lying clam' },
    { id: 19, name: 'Single Leg Curl', exerciseType: 1, targetMuscleType: 12, movementPatternType: 3, equipmentType: 4, skillLevelType: 1, description: 'This is single leg curl' },
    { id: 20, name: 'Smith Machine Deadlift', exerciseType: 1, targetMuscleType: 3, movementPatternType: 3, equipmentType: 4, skillLevelType: 2, description: 'This is smith machine deadlift' },
]

const ExercisesType = new GraphQLObjectType({
    name: 'Exercises',
    description: 'Types of exercises (e.g. strength, powerlifting, conditioning.....)',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        movements: {
            type: new GraphQLList(MovementsType),
            resolve: (exercise) => {
                return movements.filter(movement => exercise.id === movement.exerciseType)
            }
        }
    })
})

const TargetMusclesType = new GraphQLObjectType({
    name: 'TargetMuscles',
    description: 'Types of Target Muscles (e.g. bicep, tricep, chest.....)',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        movements: {
            type: new GraphQLList(MovementsType),
            resolve: (targetMuscle) => {
                return movements.filter(movement => targetMuscle.id === movement.targetMuscleType)
            }
        }
    })
})

const MovementPatternsType = new GraphQLObjectType({
    name: 'MovementPattern',
    description: 'Types of movement patterns (e.g. push, pull, rotation.....)',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        pattern: { type: GraphQLNonNull(GraphQLString) },
        movements: {
            type: new GraphQLList(MovementsType),
            resolve: (movementPattern) => {
                return movements.filter(movement => movementPattern.id === movement.targetMuscleType)
            }
        }
    })
})

const EquipmentsType = new GraphQLObjectType({
    name: 'Equipment',
    description: 'Types of equipment (e.g. machine, dumbbell, barbell.....)',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        movements: {
            type: new GraphQLList(MovementsType),
            resolve: (equipment) => {
                return movements.filter(movement => equipment.id === movement.equipmentType)
            }
        }
    })
})

const SkillLevelsType = new GraphQLObjectType({
    name: 'SkillLevel',
    description: "Difficulty level of the movement (beginner, intermediate, and advanced",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        level: { type: GraphQLNonNull(GraphQLString) },
        movements: {
            type: new GraphQLList(MovementsType),
            resolve: (level) => {
                return movements.filter(movement => level.id === movement.skillLevelType)
            }
        }
    })
})

const MovementsType = new GraphQLObjectType({
    name: "Movement",
    description: "This represents a single movement with its description",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        exercise: {
            type: ExercisesType,
            resolve: (movement) => {
                return exercises.find(exercises => movement.exerciseType === exercises.id)
            } 
        },
        targetMuscle: {
            type: TargetMusclesType,
            resolve: (movement) => {
                return targetMuscles.find(targetMuscle => movement.targetMuscleType === targetMuscle.id)
            }
        },
        movementPattern: {
            type: MovementPatternsType,
            resolve: (movement) => {
                return movementPatterns.find(movementPattern => movement.movementPatternType === movementPattern.id)
            }
        },
        equipment: {
            type: EquipmentsType,
            resolve: (movement) => {
                return equipments.find(equipment => movement.equipmentType === equipment.id)
            }
        },
        skillLevel: {
            type: SkillLevelsType,
            resolve: (movement) => {
                return skillLevels.find(skillLevel => movement.skillLevelType === skillLevel.id)
            }
        },
        description: { type: GraphQLNonNull(GraphQLString) }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        movements: {
            type: new GraphQLList(MovementsType),
            description: 'List of all movements',
            resolve: () => movements
        },
        exercises: {
            type: new GraphQLList(ExercisesType),
            description: 'List of all Exercises',
            resolve: () => exercises
        },
        targetMuscles: {
            type: new GraphQLList(TargetMusclesType),
            description: 'List of all target muscles',
            resolve: () => targetMuscles
        },
        movementPatterns: {
            type: new GraphQLList(MovementPatternsType),
            description: 'List of all movement pattern',
            resolve: () => movementPatterns 
        },
        equipments: {
            type: new GraphQLList(EquipmentsType),
            description: 'List of all equipments',
            resolve: () => equipments
        },
        skillLevels: {
            type: new GraphQLList(SkillLevelsType),
            description: 'List of all skill levels',
            resolve: () => skillLevels
        }
    })
})

function checkIndexes(args) {
    allIndexes = []
    // Exercise
    if ((exercises.find((exercise) => exercise.name === args.exercise)) === undefined) {
        exercises.push( { id: exercises.length + 1, name: args.exercise })
        allIndexes.push(exercises.length)
    } else {
        allIndexes.push(exercises.findIndex((exercise) => exercise.name === args.exercise) + 1)
    }
    // Target Muscle
    if ((targetMuscles.find((targetMuscle) => targetMuscle.name === args.targetMuscle)) === undefined) {
        targetMuscles.push( { id: targetMuscles.length + 1, name: args.targetMuscle })
        allIndexes.push(targetMuscles.length)
    } else {
        allIndexes.push(targetMuscles.findIndex((targetMuscle) => targetMuscle.name === args.targetMuscle) + 1)
    }
    // Movement Pattern 
    if ((movementPatterns.find((movementPattern) => movementPattern.pattern === args.movementPattern)) === undefined) {
        movementPatterns.push( { id: movementPatterns.length + 1, pattern: args.movementPattern })
        allIndexes.push(movementPatterns.length)
    } else {
        allIndexes.push(movementPatterns.findIndex((movementPattern) => movementPattern.pattern === args.movementPattern) + 1)
    }
    // Equipment 
    if ((equipments.find((equipment) => equipment.name === args.equipment)) === undefined) {
        equipments.push( { id: equipments.length + 1, name: args.equipment })
        allIndexes.push(equipments.length)
    } else {
        allIndexes.push(equipments.findIndex((equipment) => equipment.name === args.equipment) + 1)
    }
    // Skill Level
    if ((skillLevels.find((skillLevel) => skillLevel.level === args.skillLevel)) === undefined) {
        skillLevels.push( { id: skillLevels.length + 1, level: args.skillLevel })
        allIndexes.push(skillLevels.length)
    } else {
        allIndexes.push(skillLevels.findIndex((skillLevel) => skillLevel.level === args.skillLevel) + 1)
    }
    
    return allIndexes
}

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: "Root Mutation",
    fields: () => ({
        addMovement: {
            type: MovementsType,
            description: 'Add a movement',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                exercise: { type: GraphQLNonNull(GraphQLString) },
                targetMuscle: { type: GraphQLNonNull(GraphQLString)},
                movementPattern: { type: GraphQLNonNull(GraphQLString)},
                equipment: { type: GraphQLNonNull(GraphQLString)},
                skillLevel: { type: GraphQLNonNull(GraphQLString)},
            },
            resolve: (parent, args) => {
                allIndexes = checkIndexes(args)
                const movement = { id: movements.length + 1, name: args.name, exerciseType: allIndexes[0], targetMuscleType: allIndexes[1], movementPatternType: allIndexes[2], equipmentType: allIndexes[3], skillLevelType: allIndexes[4] }
                movements.push(movement)
                return movement
            }
        },
        addExercise: {
            type: ExercisesType,
            description: 'Add an exercise',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                if ((exercises.find((exercise) => exercise.name === args.name)) === undefined) {
                    const exercise = { id: exercises.length + 1, name: args.name }
                    exercises.push(exercise)
                    return exercise
                } else {
                   return exercises[exercises.findIndex((exercise) => exercise.name === args.name)]
                } 
            }
        },
        addTargetMuscle: {
            type: TargetMusclesType,
            description: 'Add an target muscle',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                if ((targetMuscles.find((targetMuscle) => targetMuscle.name === args.name)) === undefined) {
                    const targetMuscle = { id: targetMuscles.length + 1, name: args.name } 
                    targetMuscles.push(targetMuscle)
                    return targetMuscle
                } else {
                    return targetMuscles[targetMuscles.findIndex((targetMuscle) => targetMuscle.name === args.name)]
                }
            }
        },
        addMovementPattern: {
            type: MovementPatternsType,
            description: 'Add an movement pattern',
            args: {
                pattern: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                if ((movementPatterns.find((movementPattern) => movementPattern.pattern === args.pattern)) === undefined) {
                    const movementPattern = { id: movementPatterns.length + 1, pattern: args.pattern } 
                    targetMuscles.push(movementPattern)
                    return movementPattern
                } else {
                    return movementPatterns[movementPatterns.findIndex((movementPattern) => movementPattern.pattern === args.pattern)]
                }
            }
        },
        addEquipment: {
            type: EquipmentsType,
            description: "Add an equipment",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                if ((equipments.find((equipment) => equipment.name === args.name)) === undefined) {
                    const equipment = { id: equipments.length + 1, name: args.name } 
                    targetMuscles.push(equipment)
                    return equipment
                } else {
                    return equipments[equipments.findIndex((equipment) => equipment.name === args.name)]
                }
            }
        },
        addDescription: {
            type: MovementsType,
            description: "Add a description",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                movementIndex = movements.findIndex((movement) => movement.name === args.name)
                if (movementIndex === -1) {
                    return null
                }
                movements[movementIndex].description = args.description
                return movements[movementIndex]
            }
        }
    })
})


const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(3000, () => console.log('Server Running'))



