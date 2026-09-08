export const mockCourses = [
  {
    id: "crs_1",
    title: "Foundations of Product Thinking",
    category: "Business",
    status: "Published",
    instructor: "Diego Fernandez",
    enrolled: 341,
    updatedAt: "2026-02-12",
    coverColor: "#ff7a1a",
    modules: [
      {
        id: "mod_1",
        title: "Getting Oriented",
        lessons: [
          { id: "les_1", title: "What product thinking really means", duration: "8 min" },
          { id: "les_2", title: "Mapping the problem space", duration: "12 min" },
        ],
      },
      {
        id: "mod_2",
        title: "From Insight to Roadmap",
        lessons: [
          { id: "les_3", title: "Prioritization frameworks", duration: "15 min" },
        ],
      },
    ],
  },
  {
    id: "crs_2",
    title: "Applied Data Structures",
    category: "Software Engineering",
    status: "Draft",
    instructor: "Michael Osei",
    enrolled: 0,
    updatedAt: "2026-03-01",
    coverColor: "#5c8bff",
    modules: [
      {
        id: "mod_3",
        title: "Arrays & Hashing",
        lessons: [
          { id: "les_4", title: "Two-pointer patterns", duration: "10 min" },
        ],
      },
    ],
  },
  {
    id: "crs_3",
    title: "The Confident Speaker",
    category: "Personal Growth",
    status: "Published",
    instructor: "Amara Okafor",
    enrolled: 189,
    updatedAt: "2026-01-22",
    coverColor: "#34d399",
    modules: [],
  },
];
