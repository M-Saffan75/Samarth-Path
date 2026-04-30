import { globalImages } from '../assets/images/images_file/All_Images'

const Card_info = [
    {
        id: 1,
        type: 'video',
        video: 'https://www.pexels.com/download/video/7424293/',
        schedule: 'evening reflection',
        title: 'Learn & Improve',
        description: 'Let go of stress before sleep and allow your mind to relax peacefully. A calm night helps your body recover and prepares you for a fresh new day.',
    },
    {
        id: 2,
        type: 'image',
        image: globalImages.spiritual_10,
        schedule: 'night calm',
        title: 'Peaceful Mind',
        description: 'Let go of stress before sleep and allow your mind to relax peacefully. A calm night helps your body recover and prepares you for a fresh new day.',
    },
    {
        id: 3,
        type: 'quiz',
        schedule: 'afternoon',
        question: 'Todays wisdom compared the mind of water according to the teaching, what happens when the water is calm?',
        options: [
            { id: 1, text: "it flows faster towards the ocean." },
            { id: 2, text: "it becomes difficult to see through." },
            { id: 3, text: "everything becomes clear." },
            { id: 4, text: "it loses its original strength." },
        ],
        correct_id: 3,
    },
];

export default Card_info;

// import { globalImages } from '../assets/images/images_file/All_Images'

// const Card_info = [
//     {
//         id: 1,
//         type: 'video',
//         video: 'https://www.pexels.com/download/video/7414978/',
//         schedule: 'evening reflection',
//         title: 'Learn & Improve',
//         description: 'Every day is a chance to grow. Reflect on your wins and mistakes to become stronger tomorrow.',
//     },
//     {
//         id: 2,
//         type: 'image',
//         image: globalImages.spiritual_10,
//         schedule: 'night calm',
//         title: 'Peaceful Mind',
//         description: 'Let go of stress before sleep. A relaxed mind brings deeper rest and better energy for the next day.',
//     },
//     {
//         id: 3,
//         type: 'text',
//         image: globalImages.spiritual_9,
//         schedule: 'morning boost',
//         title: 'Fresh Beginnings',
//         description: 'Start your day with calm thoughts. A peaceful mind helps you stay focused and make better choices ahead.',
//     },
//     {
//         id: 4,
//         type: 'image',
//         image: globalImages.spiritual_8,
//         schedule: 'afternoon grind',
//         title: 'Keep Moving',
//         description: 'Progress comes from daily effort. Stay steady with your work even when things feel slow or challenging.',
//     },
//     {
//         id: 5,
//         type: 'video',
//         video: 'https://www.pexels.com/download/video/10139115/',
//         schedule: 'evening reflection',
//         title: 'Grow Daily',
//         description: 'Take time to reflect each day. Learning from your actions helps you improve and move forward stronger.',
//     },
//     {
//         id: 6,
//         type: 'image',
//         image: globalImages.spiritual_7,
//         schedule: 'night calm',
//         title: 'Relax & Reset',
//         description: 'Release the stress of the day. A calm mind at night brings better sleep and fresh energy tomorrow.',
//     },
//     {
//         id: 7,
//         type: 'video',
//         video: 'https://www.pexels.com/download/video/7424293/',
//         schedule: 'daily reminder',
//         title: 'Chase Greatness',
//         description: 'Great things take time. Stay patient, stay focused, and trust the process no matter what.',
//     },
//     // Data.js mein
//     {
//         id: 8,
//         type: 'video',
//         video: 'https://www.pexels.com/download/video/7424284/',
//         schedule: 'evening reflection',
//         title: 'Learn & Improve',
//         description: 'Every day is a chance to grow.',
//     },
//     {
//         id: 9,
//         type: 'video',
//         video: 'https://www.pexels.com/download/video/10535760/',
//         schedule: 'daily reminder',
//         title: 'Chase Greatness',
//         description: 'Great things take time.',
//     },
// ];

// export default Card_info