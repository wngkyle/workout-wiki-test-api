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
    GraphQLNonNull
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
    { id: 1, name: 'Crunch', exerciseType: 1, targetMusclesType: 1, movementPatternType: 1, equipmentType: 1, skillLevelType: 2, description: 'This is crunch' },
    { id: 2, name: 'Barbell Roll-Out', exerciseType: 1, targetMusclesType: 1, movementPatternType: 2, equipmentType: 2, skillLevelType: 2, description: 'This is barbell roll-out' },
    { id: 3, name: 'Seated Hammer Curl', exerciseType: 1, targetMusclesType: 2, movementPatternType: 3, equipmentType: 3, skillLevelType: 1, description: 'This is seated hammer curl' },
    { id: 4, name: 'Machine Bicep Curl', exerciseType: 1, targetMusclesType: 2, movementPatternType: 3, equipmentType: 4, skillLevelType: 1, description: 'This is machine bicep curl' },
    { id: 5, name: 'Calf Press', exerciseType: 1, targetMusclesType: 3, movementPatternType: 4, equipmentType: 4, skillLevelType: 1, description: 'This is calf press' },
    { id: 6, name: 'Incline Push-Up', exerciseType: 1, targetMusclesType: 4, movementPatternType: 4, equipmentType: 5, skillLevelType: 2, description: 'This is incline push-up' },
    { id: 7, name: 'Cable Chest Press', exerciseType: 1, targetMusclesType: 4, movementPatternType: 4, equipmentType: 4, skillLevelType: 1, description: 'This is cable chest press' },
    { id: 8, name: 'Wrist Roller', exerciseType: 1, targetMusclesType: 5, movementPatternType: 2, equipmentType: 6, skillLevelType: 1, description: 'This is wrist roller' },
    { id: 9, name: 'Holman Frogger', exerciseType: 1, targetMusclesType: 6, movementPatternType: 5, equipmentType: 5, skillLevelType: 2, description: 'This is Hoiman Frogger' },
    { id: 10, name: 'Overhead Lat', exerciseType: 2, targetMusclesType: 1, movementPatternType: 3, equipmentType: 6, skillLevelType: 1, description: 'This is overhead lat' },
    { id: 11, name: 'Sled Row', exerciseType: 1, targetMusclesType: 8, movementPatternType: 3, equipmentType: 6, skillLevelType: 1, description: 'This is sled row' },
    { id: 12, name: 'Barbell Squat', exerciseType: 1, targetMusclesType: 9, movementPatternType: 6, equipmentType: 2, skillLevelType: 2, description: 'This is squat' },
    { id: 13, name: 'Dumbbell Clean And Push-Press', exerciseType: 1, targetMusclesType: 10, movementPatternType: 4, equipmentType: 3, skillLevelType: 2, description: 'This is dumbell clean and push-press' },
    { id: 14, name: 'Single-Arm Dumbbell Skullcrusher', exerciseType: 1, targetMusclesType: 11, movementPatternType: 4, equipmentType: 3, skillLevelType: 2, description: 'This is single-arm dumbbell skullcrusher' },
    { id: 15, name: 'Dip Machine', exerciseType: 1, targetMusclesType: 11, movementPatternType: 4, equipmentType: 4, skillLevelType: 2, description: 'This is dip machine' },
    { id: 16, name: 'Spider Curl', exerciseType: 1, targetMusclesType: 2, movementPatternType: 3, equipmentType: 2, skillLevelType: 1, description: 'This is spider curl' },
    { id: 17, name: 'Forearm Tiger Tail', exerciseType: 6, targetMusclesType: 5, movementPatternType: 2, equipmentType: 7, skillLevelType: 1, description: 'This is forearm tiger tail' },
    { id: 18, name: 'Side Lying Clam', exerciseType: 6, targetMusclesType: 6, movementPatternType: 4, equipmentType: 5, skillLevelType: 1, description: 'This is side lying clam' },
    { id: 19, name: 'Single Leg Curl', exerciseType: 1, targetMusclesType: 12, movementPatternType: 3, equipmentType: 4, skillLevelType: 1, description: 'This is single leg curl' },
    { id: 20, name: 'Smith Machine Deadlift', exerciseType: 1, targetMusclesType: 3, movementPatternType: 3, equipmentType: 4, skillLevelType: 2, description: 'This is smith machine deadlift' },
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
                return movements.filter(movement => targetMuscle.id === movement.targetMusclesType)
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
                return movements.filter(movement => movementPattern.id === movement.targetMusclesType)
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
                return targetMuscles.find(targetMuscle => movement.targetMusclesType === targetMuscle.id)
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


const schema = new GraphQLSchema({
    query: RootQueryType,
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(3000, () => console.log('Server Running'))



