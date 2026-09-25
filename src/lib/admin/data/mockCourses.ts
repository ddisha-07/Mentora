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
          mentorName: "Byte the AI Coach 🤖",
          mentorAvatar: "🤖",
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
            title: "Module 1 Knowledge Duel 🎯",
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
            missionTitle: "📅 Day 1 Daily Task: Calculate Prediction Error by Hand 📊",
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
          funAnalogy: "🎮 Gaming Analogy: Each neuron is like a player on a raid team: one watches health, one deals damage, one casts shields. When their signals combine, they defeat the boss!",
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
          mentorName: "Byte the AI Coach 🤖",
          mentorAvatar: "🤖",
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
            title: "Module 2 Brain Teaser 🎯",
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
            missionTitle: "📅 Day 2 Daily Task: Build Your First Mini-Perceptron 🛠️",
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
      {
        id: "mod_3",
        title: "Cost Functions & Gradient Descent",
        tagline: "Rolling down the error mountain to find the optimal mathematical valley!",
        content: {
          title: "The Mechanics of Gradient Descent",
          readTime: "2 min read",
          tagline: "Like feeling your way down a foggy mountain slope with your feet!",
          summary: "A cost function measures total prediction error across all data points. Gradient Descent calculates the slope (derivative) of that error and takes small steps downward until it reaches the global minimum.",
          funAnalogy: "🏔️ Mountain Hiker: You are blindfolded on a foggy hill. To reach the lake at the bottom, you test the slope in each direction and take a step downward. The step size is your learning rate!",
          keyTakeaways: [
            "Learning rate controls step size: too large causes overshooting, too small takes forever.",
            "Stochastic Gradient Descent (SGD) computes updates per batch for speed.",
            "Convex loss surfaces guarantee a single global minimum."
          ]
        },
        video: {
          title: "Gradient Descent: Step-by-Step Visualized",
          youtubeId: "sDv4f4s2SB8",
          channel: "StatQuest with Josh Starmer",
          duration: "23 min",
          summary: "Clear step-by-step mathematical intuition of gradient calculations and step sizing."
        },
        flashcards: [
          { id: "fc_3_1", question: "What happens if the learning rate is too large?", answer: "The model overshoots the minimum and the loss function diverges (explodes towards infinity).", tag: "Optimization" },
          { id: "fc_3_2", question: "What is the difference between Batch GD and Mini-Batch GD?", answer: "Batch GD uses all data points for each step; Mini-Batch uses small random subsets (e.g. 32 or 64 samples) for faster training.", tag: "Optimization" }
        ],
        dialogue: {
          mentorName: "Byte the AI Coach 🤖",
          mentorAvatar: "🤖",
          tagline: "Mastering optimization together.",
          suggestedQuestions: ["Why do we use Adam optimizer instead of pure GD?", "Can gradient descent get stuck in local minima?"],
          qaList: [
            { question: "Can gradient descent get stuck in local minima?", answer: "In high dimensions, saddle points are much more common than true local minima! Momentum helps roll right through them." }
          ]
        },
        passGate: {
          type: "quiz",
          quiz: {
            title: "Gradient Descent Duel 🎯",
            passingScore: 70,
            questions: [
              {
                id: "q_gd_1",
                question: "Which hyperparameter controls the step size in Gradient Descent?",
                options: ["Learning Rate (alpha)", "Number of layers", "Dataset size", "Loss threshold"],
                correctAnswer: 0,
                funFact: "Spot on! The learning rate scales the gradient to ensure controlled steps down the error surface."
              },
              {
                id: "q_gd_2",
                question: "What does the slope of the cost function equal when you reach the minimum?",
                options: ["Zero", "One", "Infinity", "-100"],
                correctAnswer: 0,
                funFact: "At the exact bottom of a curve, the tangent line is completely flat (derivative = 0)."
              }
            ]
          }
        },
        lessons: [
          { id: "les_gd1", title: "Learning Rates & Convergence", duration: "14 min" }
        ]
      },
      {
        id: "mod_4",
        title: "Overfitting & Regularization",
        tagline: "Preventing your model from memorizing answers instead of learning patterns!",
        content: {
          title: "Bias-Variance Tradeoff & Regularization",
          readTime: "3 min read",
          tagline: "How to avoid building a machine that only works on yesterday's data.",
          summary: "Overfitting happens when a model learns noise and specific quirks in the training data rather than the underlying pattern. Regularization techniques (L1/L2 and Dropout) penalize complexity to force simpler, more robust models.",
          funAnalogy: "📚 Cramming Student: An overfitted model is like a student who memorizes page 42 word-for-word, but fails when the test question rephrases the question!",
          keyTakeaways: [
            "High Bias = Underfitting (model is too simple, like a straight line through a curve).",
            "High Variance = Overfitting (model is overly complex and wiggles through every outlier).",
            "L1 (Lasso) drives uninformative weights to zero, while L2 (Ridge) shrinks weights smoothly."
          ]
        },
        video: {
          title: "Regularization Part 1: Ridge (L2) Regression",
          youtubeId: "Q81RR3yKn30",
          channel: "StatQuest with Josh Starmer",
          duration: "16 min",
          summary: "How adding a penalty to the loss function prevents runaway parameters."
        },
        flashcards: [
          { id: "fc_reg_1", question: "What does L1 Regularization (Lasso) uniquely do?", answer: "It produces sparse models by shrinking weights of unhelpful features completely to zero.", tag: "Regularization" },
          { id: "fc_reg_2", question: "Why do we always maintain a separate Test Set?", answer: "To assess unbiased generalization performance on data the model has never encountered before.", tag: "Validation" }
        ],
        dialogue: {
          mentorName: "Byte the AI Coach 🤖",
          mentorAvatar: "🤖",
          tagline: "Ask me how to keep models generalizable.",
          suggestedQuestions: ["When should I pick L1 over L2?", "How does Dropout work in neural networks?"],
          qaList: [
            { question: "How does Dropout work?", answer: "Dropout randomly deactivates a fraction of neurons during each training step, forcing the network to not rely on any single neuron!" }
          ]
        },
        passGate: {
          type: "quiz",
          quiz: {
            title: "Generalization Gate 🎯",
            passingScore: 70,
            questions: [
              {
                id: "q_ov_1",
                question: "What is the primary symptom of an overfitted model?",
                options: [
                  "Near 100% accuracy on training data, but poor accuracy on validation/test data",
                  "Training loss increases forever",
                  "The model runs 10x slower",
                  "GPU memory drops to zero"
                ],
                correctAnswer: 0,
                funFact: "A huge divergence between training loss and validation loss is the classic fingerprint of overfitting."
              }
            ]
          }
        },
        lessons: [
          { id: "les_reg1", title: "L1 and L2 Penalties in Action", duration: "18 min" }
        ]
      },
      {
        id: "mod_5",
        title: "Backpropagation & Deep Synapses",
        tagline: "The chain rule engine powering modern multi-layer neural networks!",
        content: {
          title: "Backpropagation: Credit Assignment in AI",
          readTime: "3 min read",
          tagline: "Tracing the chain of blame all the way back to the input weights!",
          summary: "Backpropagation uses the calculus chain rule to calculate how much each individual weight in every layer contributed to the overall error. It then nudges every weight in the correct direction.",
          funAnalogy: "🏆 Orchestra Rehearsal: If the symphony makes a sour chord, the conductor listens carefully to single out which violin or flute was flat and instructs only that section to tune up!",
          keyTakeaways: [
            "The Chain Rule allows gradient propagation backward through dozens of composite functions.",
            "Vanishing gradients happen when activations squeeze derivatives to near zero (mitigated by ReLU and ResNets).",
            "Modern frameworks (PyTorch, TensorFlow) use automatic differentiation graphs."
          ]
        },
        video: {
          title: "Backpropagation Calculus Visualized",
          youtubeId: "Ilg3gGewQ5U",
          channel: "3Blue1Brown",
          duration: "14 min",
          summary: "The beautiful calculus behind multi-layer backpropagation made visually intuitive."
        },
        flashcards: [
          { id: "fc_bp_1", question: "What is the Vanishing Gradient problem?", answer: "When gradients become exponentially small as they propagate backward through deep layers, halting learning in early layers.", tag: "Deep Learning" },
          { id: "fc_bp_2", question: "Why did ReLU largely replace Sigmoid in hidden layers?", answer: "ReLU's derivative is 1 for positive values, avoiding the saturation and vanishing gradients that plague Sigmoid.", tag: "Deep Learning" }
        ],
        dialogue: {
          mentorName: "Byte the AI Coach 🤖",
          mentorAvatar: "🤖",
          tagline: "Demystifying deep learning math.",
          suggestedQuestions: ["Can you explain the chain rule simply?", "How do residual connections fix vanishing gradients?"],
          qaList: [
            { question: "Can you explain the chain rule simply?", answer: "If car speed changes 2x with pedal push, and fuel burn changes 3x with speed, then fuel burn changes 2 * 3 = 6x with pedal push! We multiply the partial derivatives along the path." }
          ]
        },
        passGate: {
          type: "quiz",
          quiz: {
            title: "Backpropagation Mastery Gate 🎯",
            passingScore: 70,
            questions: [
              {
                id: "q_bp_1",
                question: "Which mathematical rule forms the mathematical foundation of backpropagation?",
                options: ["The Chain Rule of Calculus", "Pythagorean Theorem", "Bayes Theorem", "Euclidean Distance"],
                correctAnswer: 0,
                funFact: "The chain rule allows us to differentiate composite functions layer-by-layer."
              }
            ]
          }
        },
        lessons: [
          { id: "les_bp1", title: "Chain Rule and Computation Graphs", duration: "20 min" }
        ]
      },
      {
        id: "mod_6",
        title: "Convolutional Vision & Feature Maps",
        tagline: "Teaching computers how to recognize shapes, textures, and objects in images!",
        content: {
          title: "Convolutional Neural Networks (CNNs)",
          readTime: "3 min read",
          tagline: "Sliding mathematical magnifying glasses across pixel matrices!",
          summary: "Instead of treating every pixel independently, CNNs slide small spatial filters (kernels) over images to detect edges, curves, and textures regardless of where they appear in the frame (spatial invariance).",
          funAnalogy: "🔍 Cookie Cutter: A 3x3 filter slides across the dough of pixels. Wherever it matches the shape of a vertical edge or a circle, it stamps a bright point on the feature map!",
          keyTakeaways: [
            "Convolutions preserve spatial relationships between neighboring pixels.",
            "Max Pooling downsamples feature maps to reduce computation and prevent overfitting.",
            "Deeper layers detect high-level semantic objects (faces, cars) by combining low-level edges."
          ]
        },
        video: {
          title: "How Convolutional Neural Networks Work",
          youtubeId: "KuXjwB4LzSA",
          channel: "Brandon Rohrer",
          duration: "18 min",
          summary: "Visual explanation of kernels, strides, padding, and pooling layers."
        },
        flashcards: [
          { id: "fc_cnn_1", question: "What is the purpose of Max Pooling?", answer: "Reduces spatial dimensions (height & width) of feature maps while retaining the most prominent signals.", tag: "Computer Vision" },
          { id: "fc_cnn_2", question: "What is Spatial Invariance in CNNs?", answer: "The ability to detect a feature (like a cat's ear) regardless of whether it appears in the top-left or bottom-right corner.", tag: "Computer Vision" }
        ],
        dialogue: {
          mentorName: "Byte the AI Coach 🤖",
          mentorAvatar: "🤖",
          tagline: "Exploring computer vision frontiers.",
          suggestedQuestions: ["Why are convolutions faster than dense layers on images?", "What is transfer learning?"],
          qaList: [
            { question: "What is transfer learning?", answer: "Taking a giant model trained on 14 million images (like ResNet) and fine-tuning just the top layer on your specific medical or security dataset!" }
          ]
        },
        passGate: {
          type: "quiz",
          quiz: {
            title: "Vision Architecture Gate 🎯",
            passingScore: 70,
            questions: [
              {
                id: "q_cnn_1",
                question: "Why are CNNs vastly superior to standard fully-connected networks for image classification?",
                options: [
                  "They exploit local spatial correlation and dramatically reduce parameter counts via shared weights",
                  "They don't use matrices",
                  "They only work on black and white images",
                  "They require zero training"
                ],
                correctAnswer: 0,
                funFact: "Shared filter weights allow CNNs to process millions of pixels with a tiny fraction of the parameters."
              }
            ]
          }
        },
        lessons: [
          { id: "les_cnn1", title: "Kernels, Strides and Pooling", duration: "16 min" }
        ]
      },
      {
        id: "mod_7",
        title: "Transformers & Attention Mechanism",
        tagline: "The revolutionary architecture underpinning modern LLMs and generative AI!",
        content: {
          title: "Self-Attention: The Engine of Modern AI",
          readTime: "4 min read",
          tagline: "Every word in a sentence looks at every other word to understand context!",
          summary: "Unlike older sequential RNNs that processed text left-to-right, Transformers process entire sequences simultaneously. The self-attention mechanism assigns dynamic weights (Query, Key, Value) between all tokens in a prompt.",
          funAnalogy: "🍸 Cocktail Party: When someone shouts your name across a crowded room, you instantly pay attention to that speaker while tuning out the rest of the chatter. That is selective attention!",
          keyTakeaways: [
            "Query, Key, and Value vectors calculate similarity matrices between every token pair.",
            "Multi-Head Attention allows the model to attend to different aspects (syntax, tone, factual reference) simultaneously.",
            "Positional encodings provide sequence order without needing sequential recurrence."
          ]
        },
        video: {
          title: "Attention in Transformers, Visually Explained",
          youtubeId: "i_LwzRVP7bg",
          channel: "3Blue1Brown",
          duration: "26 min",
          summary: "Intuitive visual masterclass on attention matrices, queries, keys, and values."
        },
        flashcards: [
          { id: "fc_tr_1", question: "What formula defines Scaled Dot-Product Attention?", answer: "Softmax((Q * K^T) / sqrt(d_k)) * V", tag: "Transformers" },
          { id: "fc_tr_2", question: "Why do Transformers parallelize much better than LSTMs?", answer: "Because they do not process tokens sequentially step-by-step; all token embeddings are processed simultaneously via matrix multiplications.", tag: "Transformers" }
        ],
        dialogue: {
          mentorName: "Byte the AI Coach 🤖",
          mentorAvatar: "🤖",
          tagline: "Ask me anything about LLM architectures.",
          suggestedQuestions: ["Why is the square root of d_k division necessary?", "What is the difference between an encoder and decoder?"],
          qaList: [
            { question: "Why divide by sqrt(d_k)?", answer: "For large dimensions, dot products grow huge, which pushes the softmax function into regions with tiny gradients. Scaling preserves healthy gradient flow!" }
          ]
        },
        passGate: {
          type: "quiz",
          quiz: {
            title: "Transformer Attention Duel 🎯",
            passingScore: 70,
            questions: [
              {
                id: "q_tr_1",
                question: "What enables Transformers to understand token order without using sequential recurrence?",
                options: ["Positional Encodings", "Random initialization", "Alphabetic sorting", "Zero padding"],
                correctAnswer: 0,
                funFact: "Sinusoidal or learned positional encodings are added to token vectors so the network knows the word positions."
              }
            ]
          }
        },
        lessons: [
          { id: "les_tr1", title: "Self-Attention Matrices & Multi-Head Heads", duration: "25 min" }
        ]
      },
      {
        id: "mod_8",
        title: "Model Evaluation & Production Gate",
        tagline: "Measuring real-world performance, latency, and deploying with zero downtime!",
        content: {
          title: "Evaluating AI Models in Production",
          readTime: "3 min read",
          tagline: "Why 99% accuracy can still mean your model is a total disaster!",
          summary: "On imbalanced datasets (e.g. cancer detection where 99.9% of scans are benign), a naive model that predicts 'healthy' for everyone has 99.9% accuracy, but is completely useless! We master Precision, Recall, F1-Score, and ROC-AUC.",
          funAnalogy: "🚨 Smoke Alarm: A good smoke alarm has high recall (it MUST ring if there's smoke, even if it occasionally false-alarms when you burn toast). In medical diagnosis, high recall saves lives!",
          keyTakeaways: [
            "Precision = Of all predicted positives, how many were actually correct?",
            "Recall = Of all actual positives, how many did the model successfully catch?",
            "F1-Score is the harmonic mean balancing Precision and Recall.",
            "Deploy with canary rollouts and monitor for data drift in production."
          ]
        },
        video: {
          title: "ROC and AUC, Clearly Explained!",
          youtubeId: "4jRBRDbJemM",
          channel: "StatQuest with Josh Starmer",
          duration: "16 min",
          summary: "Receiver Operating Characteristic curves and Area Under Curve explained simply."
        },
        flashcards: [
          { id: "fc_ev_1", question: "When should you prioritize Recall over Precision?", answer: "When false negatives are catastrophic (e.g. disease screening or fraud detection).", tag: "Evaluation" },
          { id: "fc_ev_2", question: "What is Concept Drift in production ML?", answer: "When statistical properties of real-world inputs change over time (e.g. consumer trends), degrading model performance.", tag: "MLOps" }
        ],
        dialogue: {
          mentorName: "Byte the AI Coach 🤖",
          mentorAvatar: "🤖",
          tagline: "Your MLOps and production guide.",
          suggestedQuestions: ["How do we detect data drift in production?", "What is an ROC curve?"],
          qaList: [
            { question: "What is an ROC curve?", answer: "It plots True Positive Rate vs False Positive Rate across all possible classification thresholds from 0.0 to 1.0!" }
          ]
        },
        passGate: {
          type: "quiz",
          quiz: {
            title: "Production Certification Gate 🏆",
            passingScore: 70,
            questions: [
              {
                id: "q_ev_1",
                question: "In fraud detection where 99.9% of transactions are legitimate, which metric is the WORST choice to evaluate performance?",
                options: ["Raw Accuracy", "Precision", "Recall", "F1-Score"],
                correctAnswer: 0,
                funFact: "A dummy model predicting 'never fraud' gets 99.9% accuracy while letting all criminals through!"
              },
              {
                id: "q_ev_2",
                question: "What metric is the harmonic mean of Precision and Recall?",
                options: ["F1-Score", "Mean Squared Error", "Cross-Entropy", "R-squared"],
                correctAnswer: 0,
                funFact: "F1-Score penalizes extreme imbalances between precision and recall."
              }
            ]
          }
        },
        lessons: [
          { id: "les_ev1", title: "Confusion Matrices and Precision-Recall Curves", duration: "18 min" }
        ]
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
            code: "import numpy as np\ndef mse_loss(y_true, y_pred):\n    return np.mean((y_true - y_pred) ** 2)"
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
    status: "Published",
    level: "Intermediate",
    duration: "10 Weeks",
    enrolled: 892,
    updatedAt: "2026-03-01",
    coverColor: "#5c8bff",
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=80",
    modules: [
      {
        id: "mod_react_1",
        title: "Modern React & Component State",
        tagline: "Build dynamic, reactive user interfaces with zero headaches!",
        content: {
          title: "React State: The Living Memory of UI",
          readTime: "90 sec read",
          tagline: "Like a restaurant order board that instantly updates the kitchen!",
          summary: "In vanilla JS, you have to manually hunt down DOM elements and change their innerText like a stressed waiter running back and forth. In React, you just change the 'state' variable, and React re-draws the screen automatically!",
          funAnalogy: "🍔 Burger Kitchen: When a customer orders extra pickles, you don't rebuild the entire restaurant—you just flip the state flag `hasPickles = true` and the grill serves the updated burger!",
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
          mentorName: "Pixel the React Guru ⚡",
          mentorAvatar: "⚡",
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
            title: "React State Mastery Check 🎯",
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
            missionTitle: "📅 Day 1 Daily Task: Build a Quick Counter Button 🔘",
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
      {
        id: "mod_react_2",
        title: "Custom Hooks, Lifecycles & Async State",
        tagline: "Build maintainable full-stack apps with custom hooks and async REST data fetching!",
        content: {
          title: "Custom Hooks & Async State Synchronization",
          readTime: "2 min read",
          tagline: "Extract reusable logic cleanly across your entire frontend codebase!",
          summary: "Custom hooks let you share stateful logic between components without sharing state itself. We combine useEffect, useMemo, and AbortController to fetch backend REST APIs cleanly without race conditions or memory leaks.",
          funAnalogy: "🔌 Power Adapters: A custom hook is like a universal travel adapter. Any component can plug into it to get the exact data voltage it needs without knowing the internal electrical wiring!",
          keyTakeaways: [
            "Hooks must start with 'use' and follow the Rules of Hooks (never call inside loops or conditionals).",
            "Always cleanup event listeners and abort pending network requests in useEffect returns.",
            "Separate business logic into custom hooks to keep presentation components thin and testable."
          ]
        },
        video: {
          title: "React Custom Hooks & Async Data Fetching Masterclass",
          youtubeId: "4pO-HcG2igk",
          channel: "Web Dev Simplified",
          duration: "25 min",
          summary: "Learn how to build reusable custom hooks with proper cleanup, loading states, and error handling."
        },
        flashcards: [
          { id: "fc_r2_1", question: "What is the primary benefit of a Custom React Hook?", answer: "It allows you to extract and reuse stateful logic (like fetching, form handling, or window resizing) across multiple components without duplicating code.", tag: "React Hooks" },
          { id: "fc_r2_2", question: "Why must useEffect cleanup functions abort fetch requests?", answer: "To prevent race conditions where a slow outdated network response overrides a newer user query or triggers a memory leak warning.", tag: "Performance" },
          { id: "fc_r2_3", question: "What is the difference between useMemo and useCallback?", answer: "useMemo caches the result of a calculation; useCallback caches the function definition itself to prevent unnecessary child re-renders.", tag: "Optimization" }
        ],
        dialogue: {
          mentorName: "Pixel the React Guru ⚡",
          mentorAvatar: "⚡",
          tagline: "Mastering hooks and modern async patterns together.",
          suggestedQuestions: [
            "When is useCallback actually necessary?",
            "How do I prevent stale closures in custom hooks?"
          ],
          qaList: [
            { question: "When is useCallback actually necessary?", answer: "Only when passing a callback to a memoized child component (wrapped in React.memo) or when the callback is a dependency in another hook's array!" },
            { question: "How do I prevent stale closures in custom hooks?", answer: "Always include every reactive variable inside your dependency array, or use functional state updates like setCount(prev => prev + 1)!" }
          ]
        },
        passGate: {
          type: "quiz",
          quiz: {
            title: "Hooks & Component Architecture Gate 🎯",
            passingScore: 70,
            questions: [
              {
                id: "q_r2_1",
                question: "What is the consequence of placing useState inside an if-statement?",
                options: [
                  "React loses track of hook order between renders, causing state corruption and runtime crashes",
                  "The component runs 10x faster",
                  "CSS stylesheets will fail to compile",
                  "The state variable becomes globally shared across all browser tabs"
                ],
                correctAnswer: 0,
                funFact: "React relies on stable call order between renders to associate hook state with internal fiber nodes!"
              },
              {
                id: "q_r2_2",
                question: "Which hook should you use to cache a computationally expensive array filter operation?",
                options: ["useMemo", "useCallback", "useRef", "useId"],
                correctAnswer: 0,
                funFact: "useMemo caches the calculated value and only recomputes when dependencies change."
              }
            ]
          },
          task: {
            missionTitle: "Build a useDebounce Custom Hook 🛠️",
            xpReward: 120,
            estimatedTime: "15 mins",
            dailyGoal: "Build a custom hook that delays updating a search value until the user stops typing.",
            instructions: "Create a 12-line custom hook that sets a timeout and cleans it up when the input value changes.",
            checklist: [
              "Step 1: Declare state for debouncedValue initialized to input value",
              "Step 2: Inside useEffect, create a setTimeout to update debouncedValue after delay ms",
              "Step 3: Return a cleanup function clearTimeout(timer) to abort on fast keystrokes"
            ],
            dailyTip: "Debouncing prevents hundreds of API calls while a user is typing in a search bar!"
          }
        },
        lessons: [
          { id: "les_r2_1", title: "Building Custom Hooks", duration: "18 min" },
          { id: "les_r2_2", title: "Race Conditions and AbortController", duration: "14 min" }
        ]
      },
      {
        id: "mod_react_3",
        title: "Full-Stack Next.js 14, Server Actions & Production",
        tagline: "Build enterprise full-stack web applications with Next.js App Router and server actions!",
        content: {
          title: "Full-Stack Architecture: Server Components & Actions",
          readTime: "3 min read",
          tagline: "Zero-bundle-size server components and type-safe server actions!",
          summary: "Next.js App Router unifies client and server. Server Components render directly on the server with zero client bundle impact and direct database access. Server Actions allow seamless form mutations without writing dedicated API boilerplate.",
          funAnalogy: "🍽️ Chef vs Waiter: A Server Component is like food prepped and plated in the kitchen before serving—customers receive ready meals without needing kitchen ovens at their table!",
          keyTakeaways: [
            "React Server Components (RSC) execute exclusively on the server with zero JavaScript sent to client.",
            "Server Actions provide RPC-style type-safe database mutations directly from JSX forms.",
            "Use 'use client' only when browser APIs, event listeners (onClick), or React state are required."
          ]
        },
        video: {
          title: "Next.js 14 App Router in 100 Seconds",
          youtubeId: "wm5gMKuwSYk",
          channel: "Fireship",
          duration: "15 min",
          summary: "Learn App Router, Server Components, Route Handlers, and deploying production Next.js apps."
        },
        flashcards: [
          { id: "fc_r3_1", question: "What is the key advantage of React Server Components (RSC)?", answer: "They render on the server and send pure HTML and RSC payload to the browser with zero client-side JavaScript bundle overhead.", tag: "Next.js" },
          { id: "fc_r3_2", question: "Where do Next.js Server Actions execute?", answer: "Strictly on the server, allowing direct database queries, secrets access, and secure authentication checks without exposing API keys.", tag: "Full-Stack" },
          { id: "fc_r3_3", question: "What directive marks an interactive client boundary in Next.js App Router?", answer: "'use client' placed at the very top of the file before imports.", tag: "Architecture" }
        ],
        dialogue: {
          mentorName: "Pixel the React Guru ⚡",
          mentorAvatar: "⚡",
          tagline: "Your guide to modern enterprise full-stack development.",
          suggestedQuestions: [
            "Why use Server Components over traditional client-side fetching?",
            "How do Server Actions handle authentication?"
          ],
          qaList: [
            { question: "Why use Server Components over traditional client-side fetching?", answer: "Server Components fetch data right next to the database with zero network waterfall latency, zero client JS bundle, and automatic streaming SSR!" },
            { question: "How do Server Actions handle authentication?", answer: "Server Actions execute on the server with access to HTTP-only session cookies and headers, allowing seamless session verification via adminAuth!" }
          ]
        },
        passGate: {
          type: "quiz",
          quiz: {
            title: "Full-Stack Production Certification Gate 🏆",
            passingScore: 70,
            questions: [
              {
                id: "q_r3_1",
                question: "Which of the following is TRUE about React Server Components in Next.js?",
                options: [
                  "They do not increase the client JavaScript bundle size",
                  "They can use useState and useEffect hooks",
                  "They run in the browser after hydration",
                  "They cannot access backend databases or file systems"
                ],
                correctAnswer: 0,
                funFact: "Server components run on the server and stream lightweight UI representations with zero bundle cost!"
              },
              {
                id: "q_r3_2",
                question: "What directive must be added to a file that needs to use onClick event handlers or browser state?",
                options: ["'use client'", "'use server'", "'use strict'", "'use interactive'"],
                correctAnswer: 0,
                funFact: "'use client' marks the boundary where React hydrates interactive client code."
              }
            ]
          }
        },
        lessons: [
          { id: "les_r3_1", title: "App Router and Server Components", duration: "25 min" },
          { id: "les_r3_2", title: "Server Actions and Form Handling", duration: "20 min" }
        ]
      }
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
            code: "useEffect(() => {\n  const controller = new AbortController();\n  fetchData({ signal: controller.signal });\n  return () => controller.abort();\n}, [fetchData]);"
          },
          {
            heading: "3. Server Components vs Client Boundaries",
            points: [
              "Default to Server Components for data fetching, secrets, and direct database queries without client JS cost.",
              "Use 'use client' only at leaf interactive boundaries: onClick, useState, useEffect, browser APIs.",
              "Pass server-fetched data down to client components as JSON-serializable props."
            ],
            code: "// Next.js Server Component\nexport default async function Page() {\n  const data = await db.query();\n  return <InteractiveView initialData={data} />;\n}"
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
          funAnalogy: "📞 Phonebook Analogy: Looking up 'Smith' by checking every single page one by one is O(N). Flipping the phonebook directly to the middle and cutting in half each time is O(log N). O(log N) takes 20 steps even for 1,000,000 names!",
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
          mentorName: "Algo, The Puzzle Master 🧩",
          mentorAvatar: "🧩",
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
            title: "Big-O Arena Duel 🎯",
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
            missionTitle: "📅 Day 1 Daily Task: Find a Target Sum in an Array 🧩",
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
      {
        id: "mod_dsa_2",
        title: "Trees, Graphs & Traversal Paradigms",
        tagline: "Navigate interconnected data with Breadth-First and Depth-First Search!",
        content: {
          title: "Graph Traversal: Navigating the Connected Universe",
          readTime: "2 min read",
          tagline: "From social networks to Google Maps: graphs run modern tech!",
          summary: "Trees and graphs represent relationships. BFS explores layer-by-layer using a queue, guaranteeing the shortest path in unweighted graphs. DFS plunges deep using recursion or a stack, ideal for cycle detection and topological sorting.",
          funAnalogy: "🌊 Ripple vs Spelunker: BFS is like a pebble dropped in water creating outward expanding ripple rings. DFS is like a cave explorer following a single winding cavern until hitting a dead end before backtracking!",
          keyTakeaways: [
            "BFS uses a Queue (FIFO) and discovers the shortest path in unweighted graphs.",
            "DFS uses a Stack / Recursion (LIFO) and is perfect for cycle detection and backtracking.",
            "Always maintain a visited Set to prevent infinite loops in cyclic graphs."
          ]
        },
        video: {
          title: "Graph Algorithms for Technical Interviews",
          youtubeId: "7fujbpJ0LB4",
          channel: "freeCodeCamp.org",
          duration: "35 min",
          summary: "Learn BFS, DFS, adjacency lists, and connected components with visual whiteboard walkthroughs."
        },
        flashcards: [
          { id: "fc_d2_1", question: "Why does BFS guarantee the shortest path in unweighted graphs?", answer: "Because it explores all vertices at distance k before exploring any vertex at distance k+1.", tag: "Graphs" },
          { id: "fc_d2_2", question: "What is the time complexity of BFS/DFS on an adjacency list?", answer: "O(V + E) where V is the number of vertices and E is the number of edges.", tag: "Complexity" },
          { id: "fc_d2_3", question: "How do you detect a cycle in a directed graph using DFS?", answer: "Track vertices in the current recursion call stack (or 3-color state: unvisited, visiting, visited). If you hit a 'visiting' node, a cycle exists!", tag: "Advanced" }
        ],
        dialogue: {
          mentorName: "Algo, The Puzzle Master 🧩",
          mentorAvatar: "🧩",
          tagline: "Mastering graph traversals together.",
          suggestedQuestions: [
            "When should I use BFS vs DFS?",
            "How do I represent graphs in memory?"
          ],
          qaList: [
            { question: "When should I use BFS vs DFS?", answer: "Use BFS when searching for the shortest path or nearest neighbor. Use DFS for game trees, topological sorting, maze solutions, and exhaustive puzzle searches!" },
            { question: "How do I represent graphs in memory?", answer: "Adjacency lists (Map<Node, List<Node>>) are best for sparse graphs O(V+E). Adjacency matrices are only preferred for ultra-dense graphs where edge checks must be O(1)!" }
          ]
        },
        passGate: {
          type: "quiz",
          quiz: {
            title: "Graph & Tree Traversal Gate 🎯",
            passingScore: 70,
            questions: [
              {
                id: "q_d2_1",
                question: "Which data structure is fundamentally required to implement Breadth-First Search iteratively?",
                options: ["Queue (FIFO)", "Stack (LIFO)", "Binary Heap", "Hash Set"],
                correctAnswer: 0,
                funFact: "Queue FIFO ordering ensures nodes are visited strictly in order of their distance from the source!"
              },
              {
                id: "q_d2_2",
                question: "What catastrophic failure occurs if you run BFS/DFS on a graph with cycles without a visited set?",
                options: [
                  "Infinite loop and Out-of-Memory / Call Stack Overflow crash",
                  "Graph becomes automatically sorted",
                  "All edge weights become zero",
                  "The compiler deletes the source file"
                ],
                correctAnswer: 0,
                funFact: "Without a visited set, cycles cause traversals to bounce back and forth between vertices forever!"
              }
            ]
          },
          task: {
            missionTitle: "Implement Breadth-First Search on a Tree 🛠️",
            xpReward: 120,
            estimatedTime: "15 mins",
            dailyGoal: "Implement level-order traversal on a binary tree using a queue.",
            instructions: "Write a clean 10-line BFS function that pushes root to queue and processes node children level by level.",
            checklist: [
              "Step 1: If root is null, return empty array",
              "Step 2: Initialize queue with root: `const queue = [root]`",
              "Step 3: While queue is not empty, shift current node, record value, and push left/right children"
            ],
            dailyTip: "BFS level-order traversal is the foundation of network routing and social distance calculations!"
          }
        },
        lessons: [
          { id: "les_d2_1", title: "Trees, Heaps and Balanced BSTs", duration: "20 min" },
          { id: "les_d2_2", title: "BFS and DFS Traversal Patterns", duration: "22 min" }
        ]
      },
      {
        id: "mod_dsa_3",
        title: "Dynamic Programming, Memoization & Production Gates",
        tagline: "Eliminate exponential O(2^N) runtimes and solve hard interview benchmarks!",
        content: {
          title: "Dynamic Programming: Breaking Hard Problems into Subproblems",
          readTime: "3 min read",
          tagline: "Remembering past answers so you never repeat work!",
          summary: "Dynamic Programming applies to problems with Overlapping Subproblems and Optimal Substructure. We explore Top-Down Memoization (caching recursion) and Bottom-Up Tabulation (iterative arrays), reducing exponential runtimes to linear O(N) or polynomial bounds.",
          funAnalogy: "📝 Math Shortcut: If someone asks what 1+1+1+1+1 is, you count 5. If they add another '+ 1', you don't start from zero—you remember 5, add 1, and shout 6!",
          keyTakeaways: [
            "Overlapping Subproblems: Recursion calls the same state multiple times.",
            "Memoization: Store results in a hash table or array during recursion.",
            "Tabulation: Iteratively fill a DP table from base cases up to the target answer."
          ]
        },
        video: {
          title: "Dynamic Programming - Learn to Solve Algorithmic Problems",
          youtubeId: "oBt53YbR9Kk",
          channel: "freeCodeCamp.org",
          duration: "40 min",
          summary: "Comprehensive guide to memoization and tabulation patterns with visual recurrence relations."
        },
        flashcards: [
          { id: "fc_d3_1", question: "What two properties must a problem have for Dynamic Programming to apply?", answer: "1. Optimal Substructure (optimal solution contains optimal solutions to subproblems) and 2. Overlapping Subproblems (subproblems recur repeatedly).", tag: "DP" },
          { id: "fc_d3_2", question: "What is the difference between Memoization and Tabulation?", answer: "Memoization is Top-Down with recursion and caching; Tabulation is Bottom-Up starting from base cases with iterative loops.", tag: "DP Paradigms" },
          { id: "fc_d3_3", question: "How does DP reduce the Fibonacci calculation from O(2^N) to O(N)?", answer: "By computing each Fibonacci number once and reusing the previous two values instead of branching exponentially.", tag: "Complexity" }
        ],
        dialogue: {
          mentorName: "Algo, The Puzzle Master 🧩",
          mentorAvatar: "🧩",
          tagline: "Your guide to mastering dynamic programming and competitive problem solving.",
          suggestedQuestions: [
            "How do I recognize a DP problem in an interview?",
            "When can I optimize DP space to O(1)?"
          ],
          qaList: [
            { question: "How do I recognize a DP problem in an interview?", answer: "Look for keywords like 'Find maximum/minimum cost', 'Count total number of ways', or decisions where choices at step k depend on optimal choices made at step k-1!" },
            { question: "When can I optimize DP space to O(1)?", answer: "Whenever your current state only depends on the previous 1 or 2 rows (like Fibonacci or House Robber), you only need two scalar variables instead of a full N-element array!" }
          ]
        },
        passGate: {
          type: "quiz",
          quiz: {
            title: "Production Algorithmic Certification Gate 🏆",
            passingScore: 70,
            questions: [
              {
                id: "q_d3_1",
                question: "What is the time complexity of naive recursive Fibonacci without memoization?",
                options: ["O(2^N) exponential time", "O(N) linear time", "O(log N) logarithmic time", "O(1) constant time"],
                correctAnswer: 0,
                funFact: "Naive Fibonacci branches into two calls at every depth, creating an exponential call tree of 2^N operations!"
              },
              {
                id: "q_d3_2",
                question: "In the 0/1 Knapsack problem, why does the greedy approach fail while Dynamic Programming succeeds?",
                options: [
                  "Greedy choices cannot undo decisions when weight limits leave unusable empty space; DP evaluates all combinations optimally",
                  "Greedy algorithms cannot sort items",
                  "Dynamic programming is only for sorting numbers",
                  "Computers cannot calculate fractions"
                ],
                correctAnswer: 0,
                funFact: "0/1 Knapsack requires global optimality over discrete subsets, which DP solves via overlapping subproblems!"
              }
            ]
          }
        },
        lessons: [
          { id: "les_d3_1", title: "Memoization vs Tabulation Strategies", duration: "25 min" },
          { id: "les_d3_2", title: "Knapsack, Subsequences and Space Optimization", duration: "25 min" }
        ]
      }
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
            code: "function binarySearch(arr: number[], target: number): number {\n  let l = 0, r = arr.length - 1;\n  while (l <= r) {\n    const m = l + ((r - l) >> 1);\n    if (arr[m] === target) return m;\n    arr[m] < target ? l = m + 1 : r = m - 1;\n  }\n  return -1;\n}"
          },
          {
            heading: "2. Two Pointers & Sliding Window",
            points: [
              "Two Pointers: Use on sorted arrays to locate target pairs or partition values in O(N) time and O(1) space.",
              "Sliding Window (Variable Size): Expand right pointer to incorporate elements; contract left pointer when constraint violated.",
              "Fast & Slow Pointers (Floyd's Tortoise and Hare): Detect linked list cycles and find middle nodes in O(N) time."
            ],
            code: "function maxSubArrayLen(nums: number[], k: number): number {\n  const map = new Map<number, number>([[0, -1]]);\n  let sum = 0, maxLen = 0;\n  for (let i = 0; i < nums.length; i++) {\n    sum += nums[i];\n    if (map.has(sum - k)) maxLen = Math.max(maxLen, i - map.get(sum - k)!);\n    if (!map.has(sum)) map.set(sum, i);\n  }\n  return maxLen;\n}"
          },
          {
            heading: "3. Graph & Tree Traversal Standards",
            points: [
              "Breadth-First Search (BFS): Queue-based FIFO traversal; guarantees shortest path on unweighted graphs.",
              "Depth-First Search (DFS): Stack / recursion traversal; optimal for exhaustive search, topological sort, and cycle detection.",
              "Always maintain a visited set/boolean array to prevent infinite loops in cyclic graphs."
            ],
            code: "function bfs(adj: number[][], src: number, dst: number): number {\n  const q: [number, number][] = [[src, 0]], vis = new Set([src]);\n  while (q.length) {\n    const [u, d] = q.shift()!;\n    if (u === dst) return d;\n    for (const v of adj[u] || []) if (!vis.has(v)) { vis.add(v); q.push([v, d + 1]); }\n  }\n  return -1;\n}"
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

