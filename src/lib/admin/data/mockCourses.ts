export const mockCourses = [
 {
 id: "crs_1",
 title: "Machine Learning Fundamentals",
 category: "AI & Machine Learning",
 description: "Learn the foundations of machine learning from linear regression to neural networks with fun, bite-sized missions.",
 status: "Published",
 level: "Beginner",
 duration: "6 Weeks",
 enrolled: 1248,
 updatedAt: "2026-02-12",
 coverColor: "#ff7a1a",
 thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80",
 modules: [
 {
 id: "mod_1",
 title: "Foundations & Linear Models",
 tagline: "The 90-Second Power Bite to teach computers how to predict things!",
 content: {
 title: "What is Machine Learning, Really?",
 readTime: "90 sec read",
 tagline: "Like teaching a dog tricks, but with math!",
 summary: "Traditional programming is like a rigid cookbook recipe: you write every single step. Machine Learning is like showing a smart kid 1,000 photos of cats and dogs until they can spot one instantly without needing explicit rules!",
 keyTakeaways: [
 "Computers learn patterns from examples, not hand-coded rules.",
 "Features = Inputs (e.g. gaming hours), Labels = Outputs (e.g. pizza slices).",
 "Cost function measures how wrong the computer's guess is—lower is better!"
 ]
 },
 video: {
 title: "Neural Networks & Deep Learning Essentials",
 youtubeId: "aircAruvnKk",
 channel: "3Blue1Brown",
 duration: "19 min",
 summary: "Visually stunning explanation of how artificial neurons activate and learn.",
 alternates: [
 { id: "alt_1_1", title: "Gradient Descent: How Neural Networks Learn", youtubeId: "IHZwWFHWa-w", channel: "3Blue1Brown", duration: "21 min", summary: "Steepest descent down high-dimensional loss landscapes and weight updates." },
 { id: "alt_1_2", title: "Transformers & Attention Mechanism Visualized", youtubeId: "i_LwzRVP7bg", channel: "3Blue1Brown", duration: "26 min", summary: "Self-attention matrices, query-key-value vectors, and multi-head attention." },
 { id: "alt_1_3", title: "Let's Build GPT from Scratch", youtubeId: "kCc8FmEb1nY", channel: "Andrej Karpathy", duration: "1h 56m", summary: "Deep technical masterclass building an autoregressive transformer from raw matrix operations." },
 { id: "alt_1_4", title: "Machine Learning Fundamentals & Cost Functions", youtubeId: "Ilg3gGewQ5U", channel: "StatQuest with Josh Starmer", duration: "14 min", summary: "Introduction to training sets, validation, and empirical error optimization." },
 { id: "alt_1_5", title: "Decision Trees & Random Forests Explained", youtubeId: "Gv9_4yMHFhI", channel: "StatQuest with Josh Starmer", duration: "17 min", summary: "Recursive splitting, Gini impurity, and ensemble forest aggregation." },
 { id: "alt_1_6", title: "Linear Regression Clearly Explained", youtubeId: "7eh4d6sabA0", channel: "StatQuest with Josh Starmer", duration: "16 min", summary: "Least squares line fitting, R-squared, and residual error minimization." },
 ]
 },
 flashcards: [
 {
 id: "fc_1_1",
 question: "What does Gradient Descent actually do?",
 answer: "It's like hiking down a foggy mountain by feeling the steepest downward slope with your boots until you hit the lowest valley (minimum error).",
 tag: "Core Concepts"
 },
 {
 id: "fc_1_2",
 question: "What is the difference between Features and Labels?",
 answer: "Features are the clues/inputs (e.g. square footage of a house); Labels are the target answer you want to predict (e.g. house price).",
 tag: "Beginner"
 },
 {
 id: "fc_1_3",
 question: "Why do we divide data into Training and Testing sets?",
 answer: "To prevent the model from memorizing the exam answers! We test on fresh unseen data to prove real intelligence.",
 tag: "Best Practice"
 }
 ],
 dialogue: {
 mentorName: "Byte the AI Coach ",
 mentorAvatar: "",
 tagline: "Ask me anything! No question is too silly.",
 suggestedQuestions: [
 "Give me a funny analogy for cost functions",
 "Why not just write if-else statements?",
 "What is the #1 rookie mistake in ML?"
 ],
 qaList: [
 {
 question: "Why not just write 10,000 if-else statements?",
 answer: "Because the real world has infinite chaotic edge cases! Try writing if-else rules for recognizing handwriting—you'd go crazy in an hour."
 },
 {
 question: "Give me a funny analogy for cost functions",
 answer: "Think of the cost function as your overly honest friend who shouts how far off your golf shot was from the hole. The smaller the yell, the closer you are to winning!"
 }
 ]
 },
 passGate: {
 type: "quiz",
 quiz: {
 title: "Module 1 Knowledge Duel ",
 passingScore: 100,
 questions: [
 {
 id: "q_1",
 question: "If a model predicts 8 slices of pizza were eaten, but the truth was 10 slices, what is the raw error?",
 options: ["+2 slices", "18 slices", "Zero error", "Infinity"],
 correctAnswer: 0,
 funFact: "Spot on! The model underestimated by 2 slices. Minimizing this error is the core goal of training."
 },
 {
 id: "q_2",
 question: "Which of these best describes 'Supervised Learning'?",
 options: [
 "A human watches the computer 24/7 without bathroom breaks",
 "Training with labeled inputs and known correct answers",
 "Letting the computer roam free on the internet",
 "Programming without any data"
 ],
 correctAnswer: 1,
 funFact: "Bingo! You give the model both the puzzle and the solution key so it discovers the underlying pattern."
 }
 ]
 },
 task: {
 missionTitle: " Day 1 Daily Task: Calculate Prediction Error by Hand ",
 xpReward: 100,
 estimatedTime: "15 mins",
 dailyGoal: "Calculate basic prediction difference and understand why minimizing error is the secret to all AI models.",
 instructions: "Write a short 5-line script using sample data to calculate how many units were predicted vs actually observed.",
 checklist: [
 "Step 1: Set up sample data (e.g., input values vs observed outcomes)",
 "Step 2: Calculate error difference (actual_value - predicted_value)",
 "Step 3: Average the errors to compute the Mean Error score"
 ],
 dailyTip: "Don't worry about complex math! A loss function is just checking how many units off your guess was."
 }
 },
 lessons: [
 { id: "les_1", title: "Linear Regression & Loss Functions", duration: "12 min" },
 { id: "les_2", title: "Gradient Descent Optimization", duration: "18 min" },
 ],
 },
 {
 id: "mod_2",
 title: "Neural Networks & Classification",
 tagline: "Connecting artificial synapses to classify complex patterns!",
 content: {
 title: "Neural Networks: The Digital Brain",
 readTime: "2 min read",
 tagline: "Layers of neurons playing a giant game of telephone!",
 summary: "A neural network is just layers of simple mathematical filters. The first layer spots edges, the next spots shapes, the next spots whiskers, and the output layer screams: 'IT'S A CAT!'",
 funAnalogy: " Gaming Analogy: Each neuron is like a player on a raid team: one watches health, one deals damage, one casts shields. When their signals combine, they defeat the boss!",
 keyTakeaways: [
 "Weights = importance knobs you twist during training.",
 "Activation functions introduce non-linearity so networks can solve curved problems.",
 "Backpropagation is how neurons share blame when the network guesses wrong."
 ]
 },
 video: {
 title: "Gradient Descent, How Neural Networks Learn",
 youtubeId: "IHZwWFHWa-w",
 channel: "3Blue1Brown",
 duration: "21 min",
 summary: "Watch calculus come alive visually as neural network weights converge."
 },
 flashcards: [
 {
 id: "fc_2_1",
 question: "Why do we need Non-Linear Activation Functions (like ReLU)?",
 answer: "Without non-linearity, stacking 100 layers of neural networks collapses into just one big linear equation. Non-linearity lets it learn curved, real-world boundaries!",
 tag: "Neural Networks"
 },
 {
 id: "fc_2_2",
 question: "What is Overfitting in plain English?",
 answer: "When a student memorizes the exact textbook questions by heart, but fails miserably when asked the same concept with different numbers!",
 tag: "Concepts"
 }
 ],
 dialogue: {
 mentorName: "Byte the AI Coach ",
 mentorAvatar: "",
 tagline: "Deep learning made fun and easy.",
 suggestedQuestions: [
 "Explain Backpropagation like I'm 10",
 "What happens if learning rate is too high?"
 ],
 qaList: [
 {
 question: "What happens if learning rate is too high?",
 answer: "It's like trying to parallel park a car with a rocket booster—you'll overshoot the parking spot into the next city!"
 }
 ]
 },
 passGate: {
 type: "task",
 quiz: {
 title: "Module 2 Brain Teaser ",
 passingScore: 100,
 questions: [
 {
 id: "q_2_1",
 question: "What does the ReLU activation function do to negative numbers?",
 options: ["Turns them to zero", "Multiplies by 100", "Squares them", "Deletes the computer"],
 correctAnswer: 0,
 funFact: "Correct! ReLU says: If x > 0 return x, otherwise return 0. Ultra simple and blazingly fast."
 }
 ]
 },
 task: {
 missionTitle: " Day 2 Daily Task: Build Your First Mini-Perceptron ️",
 xpReward: 120,
 estimatedTime: "15 mins",
 dailyGoal: "Build a single decision neuron that returns YES (1) or NO (0) based on simple inputs.",
 instructions: "Implement a 6-line Python function that checks if weighted inputs pass a threshold score.",
 checklist: [
 "Step 1: Set 2 sample inputs (e.g., study_hours = 8, practice_tests = 3)",
 "Step 2: Multiply each input by its importance weight and sum them up",
 "Step 3: If total score > 10, return 'Pass'; otherwise return 'Study More'"
 ],
 dailyTip: "Think of a perceptron like a light switch: when enough signal flows in, it flips ON!"
 }
 },
 lessons: [
 { id: "les_3", title: "Building your first Perceptron", duration: "15 min" },
 ],
 },
 ],
 resources: {
 flashcards: [
 { id: "fc_1", question: "What is the goal of Gradient Descent?", answer: "To iteratively minimize the cost function by adjusting model weights in the direction of negative gradients.", tag: "Beginner" },
 { id: "fc_2", question: "What distinguishes L1 and L2 Regularization?", answer: "L1 (Lasso) encourages sparsity by penalizing absolute weights, while L2 (Ridge) shrinks weights smoothly toward zero.", tag: "Concepts" }
 ],
 cheatSheet: {
 title: "Machine Learning Foundations Cheat Sheet",
 sections: [
 {
 heading: "1. Linear Model Hypothesis & Cost Optimization",
 points: [
 "Linear hypothesis: h_θ(x) = θ^T x = θ₀ + θ₁x₁ + ... + θ_n x_n.",
 "Mean Squared Error (MSE): J(θ) = 1/(2m) Σ (h_θ(x^(i)) - y^(i))^2.",
 "Gradient descent update: θ_j := θ_j - α (1/m) Σ (h_θ(x^(i)) - y^(i)) x_j^(i).",
 "Always feature scale (z = (x - μ) / σ) to ensure circular loss contours and fast convergence."
 ],
 code: "import numpy as np\ndef mse_loss(y_true, y_pred):\n return np.mean((y_true - y_pred) ** 2)"
 },
 {
 heading: "2. Loss Optimization & Gradient Stability",
 points: [
 "Use Adam optimizer (lr=1e-3) with cosine learning rate decay for smooth convergence.",
 "Clip gradients (torch.nn.utils.clip_grad_norm_ <= 1.0) to prevent exploding gradient NaN crashes.",
 "Binary Cross-Entropy Loss: L = -[y log(p) + (1-y) log(1-p)]; Softmax Cross-Entropy for multiclass."
 ],
 code: "import torch\ntorch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)"
 },
 {
 heading: "3. Overfitting, Bias-Variance & Regularization",
 points: [
 "L1 Regularization (Lasso): Adds λ Σ|θ_j|; creates sparse models by driving uninformative weights to zero.",
 "L2 Regularization (Ridge): Adds λ Σ θ_j^2; shrinks weights smoothly towards zero without sparsity.",
 "Dropout (p=0.2 to 0.5): Randomly zeroes activations during training to prevent co-adaptation."
 ],
 code: "from sklearn.linear_model import Ridge\nridge = Ridge(alpha=1.0).fit(X_train, y_train)"
 },
 {
 heading: "4. Model Evaluation & Validation Protocol",
 points: [
 "Never evaluate on training data; split data into Train (70%), Validation (15%), and Test (15%).",
 "On imbalanced datasets, never use Accuracy: prioritize Precision, Recall, and F1-Score.",
 "Apply K-Fold Cross Validation (k=5) to obtain unbiased generalization error estimates."
 ]
 }
 ]
 },
 videos: [
 {
 id: "vid_1",
 title: "Neural Networks & Deep Learning Essentials",
 youtubeId: "aircAruvnKk",
 channel: "3Blue1Brown",
 duration: "19 min",
 summary: "Visual intuitions explaining neurons, activation functions, and feedforward propagation.",
 alternates: [
 { id: "alt_1_1", title: "Gradient Descent: How Neural Networks Learn", youtubeId: "IHZwWFHWa-w", channel: "3Blue1Brown", duration: "21 min", summary: "Steepest descent down high-dimensional loss landscapes and weight updates." },
 { id: "alt_1_2", title: "Transformers & Attention Mechanism Visualized", youtubeId: "i_LwzRVP7bg", channel: "3Blue1Brown", duration: "26 min", summary: "Self-attention matrices, query-key-value vectors, and multi-head attention." },
 { id: "alt_1_3", title: "Let's Build GPT from Scratch", youtubeId: "kCc8FmEb1nY", channel: "Andrej Karpathy", duration: "1h 56m", summary: "Deep technical masterclass building an autoregressive transformer from raw matrix operations." },
 { id: "alt_1_4", title: "Machine Learning Fundamentals & Cost Functions", youtubeId: "Ilg3gGewQ5U", channel: "StatQuest with Josh Starmer", duration: "14 min", summary: "Introduction to training sets, validation, and empirical error optimization." },
 { id: "alt_1_5", title: "Decision Trees & Random Forests Explained", youtubeId: "Gv9_4yMHFhI", channel: "StatQuest with Josh Starmer", duration: "17 min", summary: "Recursive splitting, Gini impurity, and ensemble forest aggregation." },
 { id: "alt_1_6", title: "Linear Regression Clearly Explained", youtubeId: "7eh4d6sabA0", channel: "StatQuest with Josh Starmer", duration: "16 min", summary: "Least squares line fitting, R-squared, and residual error minimization." },
 ]
 }
 ],
 dialogueQuestions: [
 { id: "dq_1", question: "Can you explain linear regression simply?", answer: "Imagine drawing the single straight line that best fits through scattered points on a graph.", category: "Foundations" }
 ]
 },
 },
 {
 id: "crs_2",
 title: "Full-Stack Web Development with React",
 category: "Web Development",
 description: "Master modern web development from HTML/CSS basics to building full-stack React applications with state management and backend APIs.",
 status: "Draft",
 level: "Intermediate",
 duration: "10 Weeks",
 enrolled: 892,
 updatedAt: "2026-03-01",
 coverColor: "#5c8bff",
 thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=80",
 modules: [
 {
 id: "mod_3",
 title: "Modern React & Component State",
 tagline: "Build dynamic, reactive user interfaces with zero headaches!",
 content: {
 title: "React State: The Living Memory of UI",
 readTime: "90 sec read",
 tagline: "Like a restaurant order board that instantly updates the kitchen!",
 summary: "In vanilla JS, you have to manually hunt down DOM elements and change their innerText like a stressed waiter running back and forth. In React, you just change the 'state' variable, and React re-draws the screen automatically!",
 funAnalogy: " Burger Kitchen: When a customer orders extra pickles, you don't rebuild the entire restaurant—you just flip the state flag `hasPickles = true` and the grill serves the updated burger!",
 keyTakeaways: [
 "UI = f(State): The screen is a direct reflection of current state.",
 "Never mutate state directly (`state.count++` is forbidden!). Use `setCount(count + 1)`.",
 "Components are reusable Lego bricks."
 ]
 },
 video: {
 title: "Full-Stack Web Development Complete Course",
 youtubeId: "bMknfKXIFA8",
 channel: "freeCodeCamp.org",
 duration: "1h 30m",
 summary: "Step-by-step full stack course with component architecture and API integration.",
 alternates: [
 { id: "alt_2_1", title: "React Crash Course for Beginners", youtubeId: "SqcY0GlETPk", channel: "Web Dev Simplified", duration: "42 min", summary: "Hands-on component lifecycle, props, and clean JSX structures." },
 { id: "alt_2_2", title: "React useState & Hooks in 100 Seconds", youtubeId: "O6P86uwfdR0", channel: "Fireship", duration: "2 min", summary: "State management, functional components, and reactive UI cycles." },
 { id: "alt_2_3", title: "Next.js 14 App Router in 100 Seconds", youtubeId: "wm5gMKuwSYk", channel: "Fireship", duration: "3 min", summary: "Server components, streaming SSR, and file-based routing." },
 { id: "alt_2_4", title: "Learn useEffect In 13 Minutes", youtubeId: "4pO-HcG2igk", channel: "Web Dev Simplified", duration: "13 min", summary: "Side-effects, dependency arrays, cleanup listeners, and lifecycle hooks." },
 { id: "alt_2_5", title: "TypeScript in 100 Seconds", youtubeId: "d56mG7DezGs", channel: "Fireship", duration: "2 min", summary: "Type annotations, compile-time safety, interfaces, and compiler output." },
 { id: "alt_2_6", title: "JavaScript Event Loop Visualized", youtubeId: "cuHDQhDhvPE", channel: "Lydia Hallie", duration: "15 min", summary: "Call stack, microtask queue, macrotask queue, and render phases." },
 ]
 },
 flashcards: [
 {
 id: "fc_3_1",
 question: "Why must React State be treated as Immutable?",
 answer: "So React can do lightning-fast shallow reference checks (===). If the memory reference hasn't changed, React knows it doesn't need to waste CPU re-rendering!",
 tag: "React Core"
 },
 {
 id: "fc_3_2",
 question: "What is the difference between Props and State?",
 answer: "Props are like genes passed down from parents (read-only); State is like your current mood (managed internally and can change anytime).",
 tag: "Basics"
 }
 ],
 dialogue: {
 mentorName: "Pixel the React Guru ",
 mentorAvatar: "",
 tagline: "No boring theory, just clean code vibes.",
 suggestedQuestions: [
 "Why is my component re-rendering in an infinite loop?",
 "When should I use useMemo?",
 "What makes hooks so special?"
 ],
 qaList: [
 {
 question: "Why does my component re-render in an infinite loop?",
 answer: "You probably called `setState()` directly inside the component body instead of inside an event handler or `useEffect`! Every time it renders, it sets state, which triggers another render... forever!"
 }
 ]
 },
 passGate: {
 type: "quiz",
 quiz: {
 title: "React State Mastery Check ",
 passingScore: 100,
 questions: [
 {
 id: "q_r1",
 question: "Which code snippet correctly updates a count state in React?",
 options: [
 "count = count + 1",
 "setCount(count + 1)",
 "document.getElementById('count').innerText++",
 "React.forceUpdateCount()"
 ],
 correctAnswer: 1,
 funFact: "Spot on! `setCount` informs React to schedule a re-render with the new value."
 },
 {
 id: "q_r2",
 question: "Can a child component directly modify the props given by its parent?",
 options: [
 "Yes, by using props.value = 'new'",
 "No, props are read-only and immutable",
 "Only on Tuesdays",
 "Yes, if you use jQuery"
 ],
 correctAnswer: 1,
 funFact: "100% correct! Data flows downwards. To change parent state, the child calls a callback prop."
 }
 ]
 },
 task: {
 missionTitle: " Day 1 Daily Task: Build a Quick Counter Button ",
 xpReward: 100,
 estimatedTime: "15 mins",
 dailyGoal: "Create a simple interactive button using useState that increases count on click.",
 instructions: "Build a friendly 10-line React counter component with +1 and Reset buttons.",
 checklist: [
 "Step 1: Declare state `const [count, setCount] = useState(0)`",
 "Step 2: Add an `onClick={() => setCount(c => c + 1)}` button",
 "Step 3: Add a Reset button to set count back to 0 and verify UI updates"
 ],
 dailyTip: "State is like a whiteboard: every time you update it, React redraws the screen with the new number!"
 }
 },
 lessons: [
 { id: "les_4", title: "Component Design & Custom Hooks", duration: "20 min" },
 ],
 },
 ],
 resources: {
 flashcards: [
 { id: "fc_3", question: "Why is immutability preferred for React state?", answer: "It enables shallow reference checks so React knows precisely when to re-render without traversing the entire object graph.", tag: "Intermediate" }
 ],
 cheatSheet: {
 title: "React & Next.js Architecture Cheat Sheet",
 sections: [
 {
 heading: "1. Core Component Rules & Immutability",
 points: [
 "Keep components pure: given identical props and state, return identical JSX without side effects.",
 "Never mutate state directly: always return a new object or array copy via spread (`...prev`) or setter.",
 "Pass data down via props; notify parents of user intent by invoking callback props."
 ],
 code: "const [items, setItems] = useState<Item[]>([]);\nconst addItem = (item: Item) => setItems(prev => [...prev, item]);"
 },
 {
 heading: "2. Hook Lifecycles & Dependency Arrays",
 points: [
 "useEffect dependency array must include every reactive value referenced inside the effect closure.",
 "Always return a cleanup function in useEffect to abort in-flight fetch requests or timers.",
 "Use useMemo / useCallback only when passing callbacks to memoized children or computing heavy transforms (>5,000 items)."
 ],
 code: "useEffect(() => {\n const controller = new AbortController();\n fetchData({ signal: controller.signal });\n return () => controller.abort();\n}, [fetchData]);"
 },
 {
 heading: "3. Server Components vs Client Boundaries",
 points: [
 "Default to Server Components for data fetching, secrets, and direct database queries without client JS cost.",
 "Use 'use client' only at leaf interactive boundaries: onClick, useState, useEffect, browser APIs.",
 "Pass server-fetched data down to client components as JSON-serializable props."
 ],
 code: "// Next.js Server Component\nexport default async function Page() {\n const data = await db.query();\n return <InteractiveView initialData={data} />;\n}"
 },
 {
 heading: "4. Performance, Keys & Error Boundaries",
 points: [
 "Never use array index as list key if items are filtered, deleted, or reordered; use stable unique entity IDs.",
 "Wrap asynchronous child components in ErrorBoundary to isolate runtime crashes without page drops.",
 "Utilize startTransition for non-urgent UI updates to keep inputs responsive."
 ]
 }
 ]
 },
 videos: [
 {
 id: "vid_2",
 title: "Full-Stack Web Development Complete Course",
 youtubeId: "bMknfKXIFA8",
 channel: "freeCodeCamp.org",
 duration: "1h 30m",
 summary: "Step-by-step full stack course with component architecture and API integration.",
 alternates: [
 { id: "alt_2_1", title: "React Crash Course for Beginners", youtubeId: "SqcY0GlETPk", channel: "Web Dev Simplified", duration: "42 min", summary: "Hands-on component lifecycle, props, and clean JSX structures." },
 { id: "alt_2_2", title: "React useState & Hooks in 100 Seconds", youtubeId: "O6P86uwfdR0", channel: "Fireship", duration: "2 min", summary: "State management, functional components, and reactive UI cycles." },
 { id: "alt_2_3", title: "Next.js 14 App Router in 100 Seconds", youtubeId: "wm5gMKuwSYk", channel: "Fireship", duration: "3 min", summary: "Server components, streaming SSR, and file-based routing." },
 { id: "alt_2_4", title: "Learn useEffect In 13 Minutes", youtubeId: "4pO-HcG2igk", channel: "Web Dev Simplified", duration: "13 min", summary: "Side-effects, dependency arrays, cleanup listeners, and lifecycle hooks." },
 { id: "alt_2_5", title: "TypeScript in 100 Seconds", youtubeId: "d56mG7DezGs", channel: "Fireship", duration: "2 min", summary: "Type annotations, compile-time safety, interfaces, and compiler output." },
 { id: "alt_2_6", title: "JavaScript Event Loop Visualized", youtubeId: "cuHDQhDhvPE", channel: "Lydia Hallie", duration: "15 min", summary: "Call stack, microtask queue, macrotask queue, and render phases." },
 ]
 }
 ],
 dialogueQuestions: [
 { id: "dq_2", question: "What is the difference between client and server components?", answer: "Server components render on the server with zero client bundle impact, while client components enable interactivity.", category: "Architecture" }
 ]
 },
 },
 {
 id: "crs_3",
 title: "Data Structures & Algorithms",
 category: "Computer Science",
 description: "Ace technical interviews and build efficient software with a deep understanding of core data structures, algorithms, and complexity analysis.",
 status: "Published",
 level: "Intermediate",
 duration: "8 Weeks",
 enrolled: 2341,
 updatedAt: "2026-01-22",
 coverColor: "#34d399",
 thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
 modules: [
 {
 id: "mod_4",
 title: "Algorithmic Paradigms & Big-O",
 tagline: "Make your code 1,000x faster by thinking in logarithms!",
 content: {
 title: "Big-O: The Speed Limit of the Universe",
 readTime: "90 sec read",
 tagline: "Why O(N²) will make your server catch on fire!",
 summary: "Big-O doesn't measure seconds on a clock—it measures how your algorithm slows down when your user base explodes from 10 people to 10,000,000 people!",
 funAnalogy: " Phonebook Analogy: Looking up 'Smith' by checking every single page one by one is O(N). Flipping the phonebook directly to the middle and cutting in half each time is O(log N). O(log N) takes 20 steps even for 1,000,000 names!",
 keyTakeaways: [
 "O(1): Constant time (instant, like picking up a book on your desk).",
 "O(log N): Binary Search (divide and conquer masterclass).",
 "O(N²): Nested loops (beware of catastrophic slowdowns!)."
 ]
 },
 video: {
 title: "Algorithms and Data Structures Tutorial",
 youtubeId: "8hly31xKli0",
 channel: "freeCodeCamp.org",
 duration: "5h 15m",
 summary: "Complete foundational algorithmic masterclass with visual execution."
 },
 flashcards: [
 {
 id: "fc_4_1",
 question: "Why is Hash Table lookup average-case O(1)?",
 answer: "A hash function computes the exact memory address in one calculation, jumping directly to the data bucket like a pigeonhole!",
 tag: "Data Structures"
 },
 {
 id: "fc_4_2",
 question: "What is the worst-case runtime of QuickSort?",
 answer: "O(N²), which happens if the pivot chosen is consistently the smallest or largest element (e.g. already sorted array with bad pivot choice).",
 tag: "Algorithms"
 }
 ],
 dialogue: {
 mentorName: "Algo, The Puzzle Master ",
 mentorAvatar: "",
 tagline: "Cracking algorithmic patterns together.",
 suggestedQuestions: [
 "When should I choose BFS over DFS?",
 "What is dynamic programming in plain English?",
 "Why is space complexity often overlooked?"
 ],
 qaList: [
 {
 question: "What is dynamic programming in plain English?",
 answer: "Remembering past answers so you never repeat work! If 1+1+1+1+1 = 5, and I add another +1, you don't count from 1 again—you just say 5 + 1 = 6!"
 }
 ]
 },
 passGate: {
 type: "quiz",
 quiz: {
 title: "Big-O Arena Duel ",
 passingScore: 100,
 questions: [
 {
 id: "q_d1",
 question: "If an algorithm takes 20 operations for 1,000,000 elements, which complexity is it likely?",
 options: ["O(log N)", "O(N²)", "O(2^N)", "O(N!)"],
 correctAnswer: 0,
 funFact: "Brilliant! 2^20 is approx 1,048,576, so log2(1,000,000) is just under 20. That is the magic of logarithms!"
 }
 ]
 },
 task: {
 missionTitle: " Day 1 Daily Task: Find a Target Sum in an Array ",
 xpReward: 120,
 estimatedTime: "15 mins",
 dailyGoal: "Find two numbers in an array that add up to a target number using a simple dictionary/object.",
 instructions: "Write a clean function that loops through numbers and checks if the missing difference is already stored.",
 checklist: [
 "Step 1: Create an empty object `seen = {}` to store numbers",
 "Step 2: For each number `x`, check if `target - x` is already in `seen`",
 "Step 3: If found, return the pair; otherwise store `seen[x] = true`"
 ],
 dailyTip: "A dictionary lookup is instant (O(1)), meaning you don't need two nested loops!"
 }
 },
 lessons: [
 { id: "les_5", title: "Divide & Conquer, Dynamic Programming", duration: "25 min" },
 ],
 },
 ],
 resources: {
 flashcards: [
 { id: "fc_4", question: "What is the amortized time complexity of dynamic array appends?", answer: "O(1) amortized because doubling capacity happens infrequently (logarithmic frequency).", tag: "Intermediate" }
 ],
 cheatSheet: {
 title: "DSA Big-O & Paradigms Cheat Sheet",
 sections: [
 {
 heading: "1. Big-O Complexity & Data Structure Invariants",
 points: [
 "Hash Table: O(1) avg lookup/insertion; O(N) worst-case under pathological collisions.",
 "Balanced Binary Search Tree: O(log N) search, insertion, and deletion guaranteed.",
 "Dynamic Array: O(1) amortized append, O(N) reallocation when capacity doubled.",
 "Merge Sort: O(N log N) guaranteed; QuickSort: O(N log N) avg, O(N²) worst."
 ],
 code: "function binarySearch(arr: number[], target: number): number {\n let l = 0, r = arr.length - 1;\n while (l <= r) {\n const m = l + ((r - l) >> 1);\n if (arr[m] === target) return m;\n arr[m] < target ? l = m + 1 : r = m - 1;\n }\n return -1;\n}"
 },
 {
 heading: "2. Two Pointers & Sliding Window",
 points: [
 "Two Pointers: Use on sorted arrays to locate target pairs or partition values in O(N) time and O(1) space.",
 "Sliding Window (Variable Size): Expand right pointer to incorporate elements; contract left pointer when constraint violated.",
 "Fast & Slow Pointers (Floyd's Tortoise and Hare): Detect linked list cycles and find middle nodes in O(N) time."
 ],
 code: "function maxSubArrayLen(nums: number[], k: number): number {\n const map = new Map<number, number>([[0, -1]]);\n let sum = 0, maxLen = 0;\n for (let i = 0; i < nums.length; i++) {\n sum += nums[i];\n if (map.has(sum - k)) maxLen = Math.max(maxLen, i - map.get(sum - k)!);\n if (!map.has(sum)) map.set(sum, i);\n }\n return maxLen;\n}"
 },
 {
 heading: "3. Graph & Tree Traversal Standards",
 points: [
 "Breadth-First Search (BFS): Queue-based FIFO traversal; guarantees shortest path on unweighted graphs.",
 "Depth-First Search (DFS): Stack / recursion traversal; optimal for exhaustive search, topological sort, and cycle detection.",
 "Always maintain a visited set/boolean array to prevent infinite loops in cyclic graphs."
 ],
 code: "function bfs(adj: number[][], src: number, dst: number): number {\n const q: [number, number][] = [[src, 0]], vis = new Set([src]);\n while (q.length) {\n const [u, d] = q.shift()!;\n if (u === dst) return d;\n for (const v of adj[u] || []) if (!vis.has(v)) { vis.add(v); q.push([v, d + 1]); }\n }\n return -1;\n}"
 },
 {
 heading: "4. Dynamic Programming & State Transitions",
 points: [
 "Identify Overlapping Subproblems and Optimal Substructure before writing recursion.",
 "Top-Down with Memoization: Cache subproblem results using a hash map or 2D array.",
 "Bottom-Up Tabulation: Build solutions iteratively from base cases; optimize memory to O(1) when state depends only on previous row."
 ]
 }
 ]
 },
 videos: [
 {
 id: "vid_3",
 title: "Algorithms and Data Structures Tutorial",
 youtubeId: "8hly31xKli0",
 channel: "freeCodeCamp.org",
 duration: "5h 15m",
 summary: "Complete foundational algorithmic masterclass with visual execution.",
 alternates: [
 { id: "alt_3_1", title: "Big-O Notation in 100 Seconds", youtubeId: "g2o22C3CRfU", channel: "Fireship", duration: "2 min", summary: "Time and space complexity curves, asymptotic bounds, and efficiency trade-offs." },
 { id: "alt_3_2", title: "Two Pointers & Sliding Window Patterns", youtubeId: "8hly31xKli0", channel: "NeetCode", duration: "18 min", summary: "Eliminating nested loops and achieving O(N) linear time on arrays." },
 { id: "alt_3_3", title: "Binary Tree Traversals: BFS vs DFS", youtubeId: "t0Cq6tVNRBA", channel: "NeetCode", duration: "22 min", summary: "Pre-order, in-order, post-order, level-order, and recursion trees." },
 { id: "alt_3_4", title: "Dynamic Programming Masterclass", youtubeId: "oBt53YbR9Kk", channel: "freeCodeCamp.org", duration: "1h 15m", summary: "Subproblem overlap, memoization caching, and bottom-up tabulation." },
 { id: "alt_3_5", title: "Graph Algorithms for Technical Interviews", youtubeId: "7fujbpJ0LB4", channel: "freeCodeCamp.org", duration: "1h 10m", summary: "Adjacency lists, topological sort, cycle detection, and connectivity." },
 { id: "alt_3_6", title: "Dijkstra's Shortest Path Algorithm", youtubeId: "cWNEl4HE2OE", channel: "WilliamFiset", duration: "25 min", summary: "Priority queue relaxation, graph weights, and greedy optimality." },
 ]
 }
 ],
 dialogueQuestions: [
 { id: "dq_3", question: "When should I choose BFS over DFS?", answer: "Use BFS when searching for the shortest path in unweighted graphs or level-order tree traversal.", category: "Algorithms" }
 ]
 },
 },
];

