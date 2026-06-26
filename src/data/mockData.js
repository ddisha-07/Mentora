// Mock database and AI responses for Kai L&D platform

export const mockDocuments = [
  {
    id: "doc-1",
    title: "Lockout-Tagout (LOTO) Safety Protocol",
    category: "Safety",
    department: "EHS",
    uploadDate: "2026-03-12",
    status: "Approved",
    author: "Rajesh Kumar (Senior Safety Director)",
    keywords: ["LOTO", "Safety", "Lockout", "Tagout", "Isolation", "Electrical"],
    summary: "This Standard Operating Procedure (SOP) outlines the mandatory safety practices for the Lockout-Tagout (LOTO) system. It ensures all hazardous energy sources are isolated and rendered inoperative before any maintenance, repair, or inspection work is performed on machinery.",
    content: `STANDARD OPERATING PROCEDURE: LOCKOUT-TAGOUT (LOTO)

1. OBJECTIVE
To prevent injury from the unexpected startup or release of stored energy during maintenance operations.

2. APPLICABILITY
Applies to all employees, contractors, and visitors performing service or maintenance where energy isolation is required.

3. CORE PROCEDURES
- Prep: Identify all energy sources (electrical, mechanical, hydraulic, pneumatic, thermal).
- Notify: Alert all affected employees that a LOTO procedure is starting.
- Shutdown: Turn off equipment using standard controls.
- Isolation: Operate all energy isolating devices (breakers, valves, gates) so the equipment is isolated.
- Lock & Tag: Apply individual padlocks and tags to each isolation point.
- Zero State check: Verify that stored energy has been fully dissipated (bleed lines, ground capacitors).
- Verification: Attempt to restart the equipment to verify isolation. Return control to 'off' position.

4. SAFETY EQUIPMENT REQUIRED
- Padlocks (Color-coded for specific departments)
- Tagout labels indicating Date, Time, and Worker Name
- Group Lockboxes for multi-person tasks`
  },
  {
    id: "doc-2",
    title: "Blast Furnace Operations and Startup Guide",
    category: "Operations",
    department: "Iron & Steel Production",
    uploadDate: "2026-01-20",
    status: "Approved",
    author: "Amitabha Bose (Retired Chief Blast Furnace Expert)",
    keywords: ["Blast Furnace", "Operations", "Ironmaking", "Raw Materials", "Startup"],
    summary: "A comprehensive operational guide detailing the chemical, thermal, and mechanical processes involved in blast furnace operations. It covers raw material charging, hot blast controls, slag management, and standard startup procedures, compiled from 30+ years of operational experience.",
    content: `BLAST FURNACE OPERATIONS AND STARTUP GUIDE

1. OVERVIEW
The blast furnace is a chemical reactor where iron ore is reduced to molten metallic iron (hot metal). Understanding the temperature zones, gas flow, and raw material distribution is critical for safe operations.

2. RAW MATERIAL CHARGING
Iron ore, coke, and flux (limestone) are charged at the top. Coke serves as the reducing agent, energy source, and support structure for the burden.

3. THERMAL ZONES
- Top Zone (200-400°C): Drying and preheating of burden.
- Shaft Zone (400-1000°C): Indirect reduction of iron oxides by CO gas.
- Cohesive Zone (1000-1400°C): Softening and melting of ore begins.
- Tuyere/Raceway Zone (1400-2000°C): Coke combustion with hot blast oxygen, producing carbon monoxide.
- Hearth Zone (1400-1600°C): Collection of liquid iron and slag.

4. SAFE STARTUP PROCEDURES
- Check water cooling systems on tuyeres and stave coolers.
- Dry the furnace refractory lining thoroughly using warm air over 72 hours.
- Charge the coke blanket and blowing-in burden.
- Blast-on under low pressure and low volume, gradually ramping up parameters.
- Monitor top gas composition (CO/CO2 ratio) to ensure stable reduction chemistry.`
  },
  {
    id: "doc-3",
    title: "Welding Safety and Technical Certification Manual",
    category: "Training",
    department: "Mechanical Maintenance",
    uploadDate: "2026-05-04",
    status: "Approved",
    author: "Vikram Singh (Senior Welder Specialist)",
    keywords: ["Welding", "SMAW", "GMAW", "Safety", "PPE", "Certification"],
    summary: "This manual outlines the technical requirements, welding techniques (SMAW, GMAW, GTAW), quality inspection criteria, and critical safety rules required for obtaining the Level-II Welding Technician Certification.",
    content: `WELDING SAFETY AND CERTIFICATION MANUAL

1. INTRODUCTION
Welding operations present hazards including electrical shock, radiation, fumes, gases, and fire. Adherence to safety standards is a prerequisite for site operations.

2. PERSONAL PROTECTIVE EQUIPMENT (PPE)
- Welding helmet with auto-darkening shade (minimum shade 10-14 depending on current).
- Leather welding jacket and heat-resistant welding gloves.
- Steel-toed safety boots.
- Safety glasses with side shields under the helmet.
- Respirator (N95 or particulate filter) when welding coated materials.

3. TECH SPECIFICATIONS
- Shielded Metal Arc Welding (SMAW): Manual process using consumable electrode. Excellent for outdoor wind conditions.
- Gas Metal Arc Welding (GMAW / MIG): High productivity, continuous wire feed. Requires shielding gas (Argon/CO2 mix).
- Gas Tungsten Arc Welding (GTAW / TIG): High quality, non-consumable tungsten electrode. Slow but precise.

4. QUALITY CRITERIA
- Welds must undergo visual testing (VT) for cracks, undercut, and porosity.
- Radiographic Testing (RT) or Ultrasonic Testing (UT) is required for pressure vessel and structural welds.`
  },
  {
    id: "doc-4",
    title: "Electrical Maintenance Fundamentals & Troubleshooting",
    category: "Electrical",
    department: "Electrical Maintenance",
    uploadDate: "2026-02-15",
    status: "Approved",
    author: "S. Raghavan (Lead Electrical Engineer)",
    keywords: ["Electrical", "Transformers", "Motors", "Troubleshooting", "Preventative Maintenance"],
    summary: "Focuses on preventative maintenance procedures for industrial electric motors, power transformers, and switchgear. Includes troubleshooting flowcharts for common electrical faults, power quality issues, and thermal imaging rules.",
    content: `ELECTRICAL MAINTENANCE & TROUBLESHOOTING GUIDE

1. PREVENTATIVE MAINTENANCE CHECKS
- Weekly: Visual inspection of switchgear panels, dust cleaning, and checking warning indicators.
- Monthly: Infrared thermographic scan of cable terminations, breakers, and contacts to identify hot spots (indicates loose connections).
- Quarterly: Dissolved Gas Analysis (DGA) and dielectric testing of transformer oil.
- Annual: Insulation Resistance (IR / Megger) testing of motor windings.

2. TROUBLESHOOTING COMMON MOTOR FAULTS
- Motor fails to start: Check fuses, overload relays, control transformer voltage, and LOTO tags. Verify shaft is free to rotate.
- Overheating: Check current draw (overload), supply voltage balance, ambient cooling airflow blockage, and bearing condition.
- High vibration: Check mechanical alignment, loose mounting bolts, or worn bearings. Use vibration analyzer.`
  }
];

export const multilingualResponses = {
  en: {
    intent: {
      welding: "Learning Recommendation",
      manual: "Document Summary",
      furnace: "Knowledge Search / General Learning",
      startup: "Troubleshooting / FAQ",
      electrical: "Learning Recommendation",
      onboarding: "General Learning / FAQ",
      ml: "Machine Learning Explanation",
      loto: "Safety Protocol / SOP"
    },
    tools: {
      welding: "Learning Recommendation Tool & Vector Search",
      manual: "Document Summarization Tool",
      furnace: "Company Document Repository Search",
      startup: "FAQ Database & Expert Insights",
      electrical: "LMS Syllabus Mapping Tool",
      onboarding: "HRMS Onboarding Path Planner",
      ml: "AI & Cognitive Core Educator",
      loto: "EHS Isolation SOP Parser"
    },
    answers: {
      welding: {
        ans: `A new welding technician should complete the following structured training program:
1. **Safety First (EHS Onboarding):** Mandatory PPE usage (welding helmet shade 10-14, leather jacket, safety glasses, steel-toed boots) and respirator requirements.
2. **Technical Process Training:** Practical courses on SMAW (Shielded Metal Arc Welding) for outdoor maintenance and GMAW (MIG welding) for high-productivity indoor welding.
3. **Quality Standards Certification:** Review visual inspection criteria (Visual Testing - VT) and pass physical weld quality tests (RT/UT).`,
        source: "Welding Safety and Technical Certification Manual",
        learning: ["Industrial Safety Fundamentals", "Welding Shielding Gases", "SMAW Level-II Certification"],
        topics: ["Welding PPE", "SMAW Welding", "Non-Destructive Testing (NDT)", "Quality Inspection"]
      },
      manual: {
        ans: `Summary of the Welding & Maintenance Technical Manual:
- **Core Hazards:** Details key electrical shock, radiation (UV/IR), toxic fumes, and fire risks.
- **Mandatory Gear:** Lists the essential safety gear (welding helmet with auto-darkening shade, fire-resistant leather jacket, insulated gloves).
- **Core Methods:** Explains SMAW (stick), GMAW (MIG), and GTAW (TIG) processes.
- **Inspection Rules:** Explains the quality standards (Visual, Radiographic, and Ultrasonic inspections) required for structural joints.`,
        source: "Welding Safety and Technical Certification Manual",
        learning: ["SMAW & GMAW Process Practice", "Quality Inspection Criteria", "Safety Fundamentals"],
        topics: ["Visual Weld Inspections", "Radiographic Testing (RT)", "Safety Helmet Shades"]
      },
      furnace: {
        ans: `Blast furnace operation is a continuous reduction process that converts iron ore into molten pig iron:
1. **Charging:** Iron ore, coke (coal), and limestone are loaded into the top.
2. **Hot Blast:** High-temperature air (over 1000°C) is blown into the bottom through tuyeres.
3. **Chemical Reduction:** Coke burns, creating carbon monoxide (CO) gas, which rises and strips oxygen from the falling iron ore.
4. **Melting:** In the cohesive zone, materials soften and melt. Molten iron and slag collect in the hearth and are tapped out periodically.`,
        source: "Blast Furnace Operations and Startup Guide",
        learning: ["Cohesive Zone Chemistry", "Tuyere Maintenance", "Slag Separation"],
        topics: ["Iron Reduction Chemistry", "Refractory Linings", "Slag Runner Safety"]
      },
      startup: {
        ans: `Common mistakes during Blast Furnace startup (blowing-in) compiled from expert insights:
- **Insufficient Refractory Drying:** Rushing the startup without drying the refractory lining for at least 72 hours leads to thermal shock and lining cracks.
- **Poor Coolant Inspections:** Failing to pressure-test the cooling stave systems, resulting in dangerous water leaks inside the hearth.
- **Rapid Blast Volume Ramping:** Increasing blast pressure and air volume too quickly before the coke bed stabilizes can cause gas channeling and furnace hangs.
- **Neglecting Gas Ratios:** Not monitoring the CO/CO2 ratio in top gas, which indicates unstable reduction.`,
        source: "Blast Furnace Operations and Startup Guide",
        learning: ["Blast Furnace Startup SOP", "Cooling Stave Refurbishment", "Top Gas Ratios Analysis"],
        topics: ["Refractory Safety", "Water Cooling Inspections", "Gas Channeling Prevention", "Thermal Shock"]
      },
      electrical: {
        ans: `Recommended learning resources for an Electrical Engineer:
- **Courses:** High Voltage Electrical Safety, Infrared Thermography Basics.
- **Documents & SOPs:** Electrical Maintenance Fundamentals, Lockout-Tagout (LOTO) Safety Protocol.
- **Assessments:** Electrical Fault Diagnosis Exam, Insulation Resistance (IR / Megger) Testing.`,
        source: "Electrical Maintenance Fundamentals & Troubleshooting Guide",
        learning: ["High Voltage Isolation", "Switchgear Maintenance", "Thermal Imaging Checks"],
        topics: ["Transformer Dissolved Gas Analysis", "Megger Insulation Testing", "Thermographic Scanning"]
      },
      onboarding: {
        ans: `Welcome aboard! As a new employee, you should begin your learning journey as follows:
1. **Day 1-3 (Compliance):** Complete general workplace safety onboarding, LOTO basics, and IT security.
2. **Week 1 (Departmental):** Review specific SOP manuals for your department and complete initial equipment safety modules.
3. **Week 2 (Practical):** Shadow a senior technician and undergo the practical evaluation before accessing the shop floor.`,
        source: "HR Onboarding and Training Policy Guidelines",
        learning: ["General Workplace Safety", "Industrial LOTO Basics", "IT Security Awareness"],
        topics: ["Company Policies", "Onboarding Checklist", "Safety Training Refresher"]
      },
      ml: {
        ans: `**Machine Learning (ML)** is a subfield of artificial intelligence where computers learn from data rather than being explicitly programmed.

### How it works in simple terms:
1. **Gathering Data:** You feed the computer examples (e.g., thousands of pictures of cats and dogs).
2. **Finding Patterns:** The ML algorithm analyzes the data to find patterns (e.g., cats have pointy ears, dogs have different snouts).
3. **Making Predictions:** When shown a new picture, the computer uses these patterns to predict whether it is a cat or a dog.
4. **Learning and Improving:** The more data it processes, the more accurate its predictions become over time.

Think of it like learning to play a video game: you start by making mistakes, but by observing what works and what doesn't, you get better with practice.`,
        source: "Introduction to Artificial Intelligence & Machine Learning",
        learning: ["Introduction to Artificial Intelligence", "Supervised Learning Basics"],
        topics: ["Supervised Learning", "Neural Networks", "Data Training"]
      },
      loto: {
        ans: `Lockout-Tagout (LOTO) is a critical safety protocol used to ensure that machines are properly shut off and not started up again prior to the completion of maintenance or servicing work.

**Core Steps of the LOTO Procedure:**
1. **Preparation:** Identify all energy sources (electrical, mechanical, hydraulic, pneumatic, thermal, chemical).
2. **Notification:** Inform all affected employees that a LOTO procedure is about to begin.
3. **Shutdown:** Turn off the machinery or equipment using standard operating controls.
4. **Isolation:** Disconnect or isolate the equipment from all energy sources (e.g., flip breakers, close valves).
5. **Lockout/Tagout:** Apply individual padlocks and tags to each energy isolation point.
6. **Zero State Verification (Dissipation):** Ensure all stored or residual energy is fully dissipated or bled off (e.g., ground capacitors, bleed hydraulic lines).
7. **Verification of Isolation:** Attempt to restart the equipment using normal controls to confirm isolation is successful. Ensure controls are returned to the 'off' position before starting work.`,
        source: "Lockout-Tagout (LOTO) Safety Protocol",
        learning: ["Industrial Safety Fundamentals", "Zero Energy State Verification", "Group Lockout Procedures"],
        topics: ["Energy Isolation", "Safety Padlocks", "Zero State Check"]
      }
    }
  },
  hi: {
    intent: {
      welding: "Learning Recommendation",
      manual: "Document Summary",
      furnace: "Knowledge Search / General Learning",
      startup: "Troubleshooting / FAQ",
      electrical: "Learning Recommendation",
      onboarding: "General Learning / FAQ",
      loto: "सुरक्षा प्रोटोकॉल / SOP"
    },
    tools: {
      welding: "लर्निंग रिकमेंडेशन टूल और वेक्टर सर्च",
      manual: "दस्तावेज़ सारांश उपकरण",
      furnace: "कंपनी दस्तावेज़ रिपॉजिटरी खोज",
      startup: "FAQ डेटाबेस और विशेषज्ञ अंतर्दृष्टि",
      electrical: "LMS सिलेबस मैपिंग टूल",
      onboarding: "HRMS ऑनबोर्डिंग पाथ प्लानर",
      loto: "EHS अलगाव SOP पार्सर"
    },
    answers: {
      welding: {
        ans: `एक नए वेल्डिंग तकनीशियन को निम्नलिखित व्यवस्थित प्रशिक्षण कार्यक्रम पूरा करना चाहिए:
1. **सुरक्षा सर्वप्रथम (EHS ऑनबोर्डिंग):** अनिवार्य पीपीई उपयोग (वेल्डिंग हेलमेट शेड 10-14, चमड़े की जैकेट, सुरक्षा चश्मा, स्टील-टो जूते) और श्वासयंत्र आवश्यकताएं।
2. **तकनीकी प्रक्रिया प्रशिक्षण:** आउटडोर रखरखाव के लिए SMAW (शील्डेड मेटल आर्क वेल्डिंग) और इनडोर वेल्डिंग के लिए GMAW (MIG वेल्डिंग) पर व्यावहारिक पाठ्यक्रम।
3. **गुणवत्ता मानक प्रमाणन:** दृश्य निरीक्षण मानदंडों (विजुअल टेस्टिंग - VT) की समीक्षा करें और वेल्ड गुणवत्ता परीक्षण (RT/UT) पास करें।`,
        source: "वेल्डिंग सुरक्षा और तकनीकी प्रमाणन नियमावली",
        learning: ["औद्योगिक सुरक्षा मूल बातें", "वेल्डिंग परिरक्षण गैसें", "SMAW स्तर-II प्रमाणन"],
        topics: ["वेल्डिंग पीपीई", "SMAW वेल्डिंग", "गैर-विनाशकारी परीक्षण (NDT)", "गुणवत्ता निरीक्षण"]
      },
      manual: {
        ans: `वेल्डिंग और रखरखाव तकनीकी मैनुअल का सारांश:
- **मुख्य खतरे:** बिजली के झटके, विकिरण (UV/IR), जहरीले धुएं और आग के जोखिमों का विवरण।
- **अनिवार्य गियर:** आवश्यक सुरक्षा उपकरण (ऑटो-डार्कनिंग शेड वाला वेल्डिंग हेलमेट, अग्निरोधक जैकेट, इंसुलेटेड दस्ताने)।
- **मुख्य विधियाँ:** SMAW (स्टिक), GMAW (MIG), और GTAW (TIG) प्रक्रियाओं की व्याख्या।
- **निरीक्षण नियम:** गुणवत्ता मानकों (विजुअल, रेडियोग्राफिक, अल्ट्रासोनिक निरीक्षण) की व्याख्या करता है।`,
        source: "वेल्डिंग सुरक्षा और तकनीकी प्रमाणन नियमावली",
        learning: ["SMAW और GMAW प्रक्रिया अभ्यास", "गुणवत्ता निरीक्षण मानदंड", "सुरक्षा की बुनियादी बातें"],
        topics: ["विजुअल वेल्ड निरीक्षण", "रेडियोग्राफिक परीक्षण (RT)", "सुरक्षा हेलमेट शेड्स"]
      },
      furnace: {
        ans: `ब्लास्ट फर्नेस (धमन भट्टी) संचालन एक सतत रासायनिक प्रक्रिया है जो लौह अयस्क को पिघले हुए लोहे में बदलती है:
1. **चार्जिंग:** लौह अयस्क, कोक (कोयला), और चूना पत्थर को ऊपर से डाला जाता है।
2. **हॉट ब्लास्ट:** नीचे से ट्यूयर के माध्यम से उच्च तापमान वाली हवा (1000°सी से अधिक) फूंकी जाती है।
3. **रासायनिक अपचयन:** कोक जलता है और कार्बन मोनोऑक्साइड (CO) बनाता है, जो अयस्क से ऑक्सीजन निकालता है।
4. **पिघलना:** पिघला हुआ लोहा और धातुमल (स्लैग) भट्टी के नीचे एकत्र होते हैं और समय-समय पर निकाले जाते हैं।`,
        source: "ब्लास्ट फर्नेस संचालन और स्टार्टअप गाइड",
        learning: ["कोहेसिव ज़ोन रसायन विज्ञान", "ट्यूयर रखरखाव", "धातुमल पृथक्करण"],
        topics: ["आयरन रिडक्शन केमिस्ट्री", "रिफ्रैक्टरी लाइनिंग", "स्लैग रनर सेफ्टी"]
      },
      startup: {
        ans: `विशेषज्ञों के अनुभवों से संकलित ब्लास्ट फर्नेस स्टार्टअप के दौरान की जाने वाली सामान्य गलतियाँ:
- **दुर्दम्य ईंटों (रिफ्रैक्टरी) को अपर्याप्त सुखाना:** 72 घंटे तक सुखाए बिना स्टार्टअप करने से दरारें पड़ सकती हैं।
- **खराब शीतलक निरीक्षण:** वॉटर कूलिंग सिस्टम का दबाव परीक्षण न करना, जिससे भट्टी के अंदर पानी लीक हो सकता है।
- **तीव्र ब्लास्ट रॅम्पिंग:** कोक बेड स्थिर होने से पहले हवा का दबाव बहुत तेजी से बढ़ाना।
- **गैस अनुपात की उपेक्षा:** गैस के CO/CO2 अनुपात की निगरानी न करना।`,
        source: "ब्लास्ट फर्नेस संचालन और स्टार्टअप गाइड",
        learning: ["ब्लास्ट फर्नेस स्टार्टअप SOP", "कूलिंग स्टेव नवीनीकरण", "गैस अनुपात विश्लेषण"],
        topics: ["रिफ्रैक्टरी सुरक्षा", "कूलिंग सिस्टम निरीक्षण", "गैस चैनलिंग रोकथाम", "थर्मल शॉक"]
      },
      electrical: {
        ans: `एक इलेक्ट्रिकल इंजीनियर के लिए अनुशंसित संसाधन:
- **पाठ्यक्रम:** हाई वोल्टेज इलेक्ट्रिकल सेफ्टी, इन्फ्रारेड थर्मोग्राफी बेसिक्स।
- **दस्तावेज़ और एसओपी:** इलेक्ट्रिकल मेंटेनेंस फंडामेंटल्स, लॉकआउट-टैगआउट (LOTO) सुरक्षा प्रोटोकॉल।
- **मूल्यांकन:** इलेक्ट्रिकल फॉल्ट डायग्नोसिस परीक्षा, इंसुलेशन रेजिस्टेंस (मेगर) परीक्षण।`,
        source: "इलेक्ट्रिकल मेंटेनेंस फंडामेंटल्स और समस्या निवारण",
        learning: ["हाई वोल्टेज आइसोलेशन", "स्विचगियर रखरखाव", "थर्मल इमेजिंग जांच"],
        topics: ["ट्रांसफार्मर गैस विश्लेषण", "मेगर इंसुलेशन परीक्षण", "थर्मोग्राफिक स्कैनिंग"]
      },
      onboarding: {
        ans: `आपका स्वागत है! एक नए कर्मचारी के रूप में, आपको अपनी सीखने की यात्रा इस प्रकार शुरू करनी चाहिए:
1. **दिन 1-3 (अनुपालन):** सामान्य कार्यस्थल सुरक्षा ऑनबोर्डिंग, लोतो (LOTO) मूल बातें, और आईटी सुरक्षा मॉड्यूल।
2. **सप्ताह 1 (विभागीय):** अपने विभाग के लिए विशिष्ट एसओपी मैनुअल की समीक्षा करें।
3. **सप्ताह 2 (प्रायोगिक):** एक वरिष्ठ तकनीशियन के मार्गदर्शन में कार्य करें और व्यावहारिक मूल्यांकन परीक्षा पास करें।`,
        source: "HR ऑनबोर्डिंग और प्रशिक्षण नीति दिशानिर्देश",
        learning: ["सामान्य कार्यस्थल सुरक्षा", "औद्योगिक लोतो मूल बातें", "आईटी सुरक्षा जागरूकता"],
        topics: ["कंपनी नीतियां", "ऑनबोर्डिंग चेकलिस्ट", "सुरक्षा प्रशिक्षण"]
      },
      loto: {
        ans: `लॉकआउट-टैगआउट (LOTO) एक महत्वपूर्ण सुरक्षा प्रोटोकॉल है जो यह सुनिश्चित करता है कि रखरखाव या सर्विसिंग कार्य पूरा होने से पहले मशीनें ठीक से बंद हो जाएं और दोबारा चालू न हों।

**लोतो (LOTO) प्रक्रिया के मुख्य चरण:**
1. **तैयारी (Preparation):** सभी ऊर्जा स्रोतों (बिजली, यांत्रिक, हाइड्रोलिक, वायवीय, थर्मल) की पहचान करें।
2. **अधिसूचना (Notification):** सभी प्रभावित कर्मचारियों को सूचित करें कि LOTO प्रक्रिया शुरू होने वाली है।
3. **शटडाउन (Shutdown):** मानक नियंत्रणों का उपयोग करके उपकरण बंद करें।
4. **अलगाव (Isolation):** सभी ऊर्जा पृथक करने वाले उपकरणों (ब्रेकर, वाल्व, गेट) को बंद करें ताकि उपकरण पूरी तरह से अलग हो जाए।
5. **लॉकआउट/टैगआउट (Lockout/Tagout):** प्रत्येक अलगाव बिंदु पर व्यक्तिगत पैडलॉक और टैग लगाएं।
6. **शून्य स्थिति जांच (Zero State Check):** सत्यापित करें कि संचित ऊर्जा पूरी तरह से समाप्त हो गई है (लाइनों को खाली करें, कैपेसिटर को डिस्चार्ज करें)।
7. **सत्यापन (Verification):** अलगाव की पुष्टि करने के लिए उपकरण को फिर से चालू करने का प्रयास करें। काम शुरू करने से पहले नियंत्रण को 'ऑफ' स्थिति में वापस लाएं।`,
        source: "लॉकआउट-टैगआउट (LOTO) सुरक्षा प्रोटोकॉल",
        learning: ["औद्योगिक सुरक्षा मूल बातें", "शून्य ऊर्जा स्थिति सत्यापन", "समूह लॉकआउट प्रक्रियाएं"],
        topics: ["ऊर्जा अलगाव", "सुरक्षा ताले", "शून्य स्थिति जांच"]
      }
    }
  },
  mr: {
    intent: {
      welding: "Learning Recommendation",
      manual: "Document Summary",
      furnace: "Knowledge Search / General Learning",
      startup: "Troubleshooting / FAQ",
      electrical: "Learning Recommendation",
      onboarding: "General Learning / FAQ",
      loto: "सुरक्षा प्रोटोकॉल / SOP"
    },
    tools: {
      welding: "लर्निंग रिकमेंडेशन आणि वेक्टर सर्च टूल",
      manual: "दस्तऐवज सारांश साधन",
      furnace: "कंपनी दस्तऐवज भांडार शोध",
      startup: "FAQ डेटाबेस आणि तज्ञ अंतर्दृष्टी",
      electrical: "LMS अभ्यासक्रम मॅपिंग टूल",
      onboarding: "HRMS ऑनबोर्डिंग मार्ग नियोजक",
      loto: "EHS अलगाव SOP पार्सर"
    },
    answers: {
      welding: {
        ans: `नवीन वेल्डिंग तंत्रज्ञाने खालील प्रशिक्षण पूर्ण केले पाहिजे:
1. **सुरक्षा प्रथम (EHS ऑनबोर्डिंग):** पीपीईचा वापर (वेल्डिंग हेल्मेट शेड १०-१४, लेदर जॅकेट, सुरक्षा बूट) आणि रेस्पिरेटर.
2. **तांत्रिक प्रशिक्षण:** बाहेरील कामांसाठी SMAW वेल्डिंग आणि इनडोअर कामांसाठी GMAW (MIG) वेल्डिंगचे प्रात्यक्षिक.
3. **गुणवत्ता चाचणी:** विजुअल इन्स्पेक्शन निकष (VT) आणि वेल्ड दर्जा चाचणी (RT/UT) उत्तीर्ण होणे.`,
        source: "वेल्डिंग सुरक्षा आणि तांत्रिक प्रमाणपत्र मॅन्युअल",
        learning: ["औद्योगिक सुरक्षा मूलभूत तत्त्वे", "वेल्डिंग शिल्डिंग वायू", "SMAW लेव्हल-II प्रमाणपत्र"],
        topics: ["वेल्डिंग पीपीई", "SMAW वेल्डिंग", "नॉन-डिस्ट्रक्टिव्ह टेस्टिंग (NDT)", "गुणवत्ता तपासणी"]
      },
      manual: {
        ans: `वेल्डिंग आणि देखभाल तांत्रिक मॅन्युअलचा सारांश:
- **धोके:** विजेचा धक्का, अतिनील किरणे, विषारी वायू आणि आगीच्या धोक्यांची माहिती.
- **सुरक्षा गियर:** ऑटो-डार्कनिंग शेड वेल्डिंग हेल्मेट, अग्निरोधक जॅकेट, हातमोजे.
- **पद्धती:** SMAW, GMAW आणि GTAW प्रक्रियांचे स्पष्टीकरण.
- **तपासणी:** वेल्डिंगच्या दर्जासाठी रेडियोग्राफिक आणि अल्ट्रासोनिक तपासणी आवश्यक.`,
        source: "वेल्डिंग सुरक्षा आणि तांत्रिक प्रमाणपत्र मॅन्युअल",
        learning: ["SMAW आणि GMAW प्रक्रिया सराव", "गुणवत्ता तपासणी निकष", "सुरक्षेची मूलभूत तत्त्वे"],
        topics: ["व्हिज्युअल वेल्ड तपासणी", "रेडियोग्राफिक चाचणी (RT)", "सुरक्षा हेल्मेट शेड्स"]
      },
      furnace: {
        ans: `ब्लास्ट फर्नेसचे कार्य ही एक सतत चालणारी प्रक्रिया आहे जी लोखंडाच्या धातूचे वितळलेल्या लोखंडात रूपांतर करते:
1. **चार्जिंग:** लोहखनिज, कोक (कोळसा), आणि चुनखडी वरून टाकली जाते.
2. **हॉट ब्लास्ट:** ट्युअर्समधून गरम हवा (१०००°C पेक्षा जास्त) खाली सोडली जाते.
3. **अपचयन क्रिया:** कोक जळतो आणि कार्बन मोनोऑक्साइड (CO) वायू तयार होतो.
4. **वितळणे:** वितळलेले लोखंड खालच्या भागात गोळा होते आणि वेळोवेळी बाहेर काढले जाते.`,
        source: "ब्लास्ट फर्नेस ऑपरेशन्स आणि स्टार्टअप मार्गदर्शक",
        learning: ["कोहेसिव्ह झोन रसायनशास्त्र", "ट्युअर्स देखभाल", "स्लॅग वेगळे करणे"],
        topics: ["लोखंड अपचयन रसायनशास्त्र", "रिफ्रॅक्टरी लायनिंग", "स्लॅग रनर सुरक्षा"]
      },
      startup: {
        ans: `ब्लास्ट फर्नेस स्टार्टअप (ब्लोइंग-इन) दरम्यान तज्ञांनी सांगितलेल्या सामान्य चुका:
- **रिफ्रॅक्टरी कोरडे न करणे:** ७२ तास रिफ्रॅक्टरी लायनिंग कोरडी न करता भट्टी सुरू केल्यास तडे जातात.
- **अपूरे वॉटर कूलिंग चेक:** कूलिंग सिस्टिमची चाचणी न घेतल्याने आत पाणी गळती होऊ शकते.
- **घाईघाईने हवेचा दाब वाढवणे:** कोक बेड स्थिर होण्यापूर्वी हवेचा दाब वाढवणे.
- **CO/CO2 प्रमाणाकडे दुर्लक्ष:** वायू प्रमाणावर लक्ष न ठेवणे.`,
        source: "ब्लास्ट फर्नेस ऑपरेशन्स आणि स्टार्टअप मार्गदर्शक",
        learning: ["ब्लास्ट फर्नेस स्टार्टअप SOP", "कूलिंग स्टेव नूतनीकरण", "वायू गुणोत्तर विश्लेषण"],
        topics: ["रिफ्रॅक्टरी सुरक्षा", "कूलिंग सिस्टम तपासणी", "गॅस चॅनेलिंग प्रतिबंध", "थर्मल शॉक"]
      },
      electrical: {
        ans: `इलेक्ट्रिकल इंजिनिअरसाठी शिफारस केलेली संसाधने:
- **कोर्सेस:** हाय व्होल्टेज इलेक्ट्रिकल सेफ्टी, इन्फ्रारेड थर्मोग्राफी बेसिक्स.
- **दस्तऐवज आणि SOP:** इलेक्ट्रिकल मेंटेनन्स फंडामेंटल्स, लॉकआउट-टैगआउट (LOTO) सुरक्षा प्रोटोकॉल.
- **चाचण्या:** इलेक्ट्रिकल फॉल्ट डायग्नोसिस परीक्षा, इन्सुलेशन रेझिस्टन्स (मेगर) चाचणी.`,
        source: "इलेक्ट्रिकल मेंटेनन्स फंडामेंटल्स आणि ट्रबलशूटिंग",
        learning: ["हाय व्होल्टेज आयसोलेशन", "स्विचगियर देखभाल", "थर्मल इमेजिंग चाचण्या"],
        topics: ["ट्रान्सफॉर्मर गॅस विश्लेषण", "मेगर इन्सुलेशन चाचणी", "थर्मोग्राफिक स्कॅनिंग"]
      },
      onboarding: {
        ans: `स्वागत आहे! नवीन कर्मचारी म्हणून तुम्ही तुमचा प्रवास याप्रमाणे सुरू करावा:
1. **दिवस १-३ (अनुपालन):** सामान्य कामाच्या ठिकाणची सुरक्षितता, लोटो (LOTO) मूलभूत गोष्टी आणि आयटी सुरक्षा.
2. **आठवडा १ (विभागीय):** तुमच्या विभागाचे SOP मार्गदर्शक वाचा.
3. **आठवडा २ (प्रात्यक्षिक):** ज्येष्ठ तंत्रज्ञांच्या मार्गदर्शनाखाली प्रात्यक्षिक चाचणी उत्तीर्ण व्हा.`,
        source: "HR ऑनबोर्डिंग आणि प्रशिक्षण धोरण मार्गदर्शक",
        learning: ["सामान्य कामाची जागा सुरक्षितता", "औद्योगिक लोटो मूलभूत नियम", "आयटी सुरक्षा जागरूकता"],
        topics: ["companyची धोरणे", "ऑनबोर्डिंग चेकलिस्ट", "सुरक्षा प्रशिक्षण"]
      },
      loto: {
        ans: `लॉकआऊट-टॅगआऊट (LOTO) हा एक अत्यंत महत्त्वाचा सुरक्षा प्रोटोकॉल आहे ज्याचा वापर देखभाल किंवा दुरुस्तीचे काम पूर्ण होण्यापूर्वी मशीन व्यवस्थित बंद केल्या आहेत आणि पुन्हा सुरू होणार नाहीत याची खात्री करण्यासाठी केला जातो.

**LOTO प्रक्रियेचे मुख्य टप्पे:**
1. **तयारी (Preparation):** सर्व ऊर्जा स्त्रोत (विद्युत, यांत्रिक, हायड्रॉलिक, वायवीय, थर्मल) ओळखा.
2. **सूचना (Notification):** सर्व संबंधित कर्मचाऱ्यांना सूचित करा की LOTO प्रक्रिया सुरू होणार आहे.
3. **शटडाऊन (Shutdown):** मानक नियंत्रण वापरून उपकरण बंद करा.
4. **अलगाव (Isolation):** उपकरणाला सर्व ऊर्जा स्त्रोतांपासून विलग करा (उदा. ब्रेकर्स बंद करा, वाल्व्ह बंद करा).
5. **लॉकआऊट/टॅगआऊट (Lockout/Tagout):** प्रत्येक आयसोलेशन पॉईंटवर वैयक्तिक कुलूप आणि टॅग लावा.
6. **शून्य ऊर्जा तपासणी (Zero State Check):** सर्व साठवलेली किंवा अवशिष्ट ऊर्जा पूर्णपणे निघून गेली असल्याची खात्री करा.
7. **सत्यापन (Verification):** आयसोलेशन यशस्वी झाल्याची खात्री करण्यासाठी उपकरण सुरू करण्याचा प्रयत्न करा. काम सुरू करण्यापूर्वी नियंत्रणे 'ऑफ' स्थितीत परत करा.`,
        source: "लॉकआऊट-टॅगआऊट (LOTO) सुरक्षा प्रोटोकॉल",
        learning: ["औद्योगिक सुरक्षा मूलभूत तत्त्वे", "शून्य ऊर्जा स्थिती पडताळणी", "गट लॉकआऊट प्रक्रिया"],
        topics: ["ऊर्जा विलग करणे", "सुरक्षा कुलूप", "शून्य ऊर्जा तपासणी"]
      }
    }
  },
  bn: {
    intent: {
      welding: "Learning Recommendation",
      manual: "Document Summary",
      furnace: "Knowledge Search / General Learning",
      startup: "Troubleshooting / FAQ",
      electrical: "Learning Recommendation",
      onboarding: "General Learning / FAQ",
      loto: "নিরাপত্তা প্রোটোকল / SOP"
    },
    tools: {
      welding: "লার্নিং রিকমেন্ডেশন ও ভেক্টর সার্চ টুল",
      manual: "নথি সংক্ষিপ্তকরণ টুল",
      furnace: "কোম্পানি ডকুমেন্টেশন ডাটাবেস অনুসন্ধান",
      startup: "এফএকিউ ও বিশেষজ্ঞ জ্ঞান ভাণ্ডার",
      electrical: "এলএমএস সিলেবাস ম্যাপিং টুল",
      onboarding: "এইচআরএমএস অনবোর্ডিং পথ পরিকল্পনাকারী",
      loto: "EHS আইসোলেশন SOP পার্সার"
    },
    answers: {
      welding: {
        ans: `একজন নতুন ওয়েল্ডিং টেকনিশিয়ানকে निम्नलिखित প্রশিক্ষণ সম্পন্ন করতে হবে:
1. **নিরাপত্তা প্রথমে (EHS অনবোর্ডিং):** ওয়েল্ডিং হেলমেট (শেড ১০-১৪), চামড়ার জ্যাকেট, নিরাপত্তা জুতো এবং মাস্ক পরিধান করা বাধ্যতামূলক।
2. **প্রযুক্তিগত প্রশিক্ষণ:** আউটডোর রক্ষণাবেক্ষণের জন্য SMAW এবং ইনডোর কাজের জন্য GMAW (MIG) ওয়েল্ডিংয়ের ব্যবহারিক কোর্স।
3. **মান নিয়ন্ত্রণ শংসাপত্র:** ভিজ্যুয়াল টেস্টিং (VT) এবং ওয়েল্ড কোয়ালিটি টেস্ট (RT/UT) পাস করা।`,
        source: "ওয়েল্ডিং নিরাপত্তা এবং কারিগরি শংসাপত্র ম্যানুয়াল",
        learning: ["শিল্প নিরাপত্তা মূল নীতি", "ওয়েল্ডিং শিল্ডিং গ্যাস", "SMAW লেভেল-II সার্টিফিকেশন"],
        topics: ["ওয়েল্ডিং পিপিই", "SMAW ওয়েল্ডিং", "নন-ডেস্ট্রাকটিভ টেস্টিং (NDT)", "মান পরিদর্শন"]
      },
      manual: {
        ans: `ওয়েল্ডিং এবং রক্ষণাবেক্ষণ প্রযুক্তিগত ম্যানুয়ালের সংক্ষিপ্তসার:
- **মূল বিপদসমূহ:** বৈদ্যুতিক শক, অতিবেগুনি বিকিরণ, বিষাক্ত ধোঁয়া এবং আগুনের ঝুঁকি।
- **আবশ্যকীয় গিয়ার:** স্বয়ংক্রিয়-অন্ধকার ওয়েল্ডিং হেলমেট, আগুন-প্রতিরোধী চামড়ার জ্যাকেট এবং গ্লাভস।
- **পদ্ধতিসমূহ:** SMAW (স্টিক), GMAW (MIG), এবং GTAW (TIG) প্রক্রিয়া।
- **পরীক্ষা:** ওয়েল্ডের গুণমান নিশ্চিত করতে রেডোগ্রাফিক ও আল্ট্রাসোনিক পরীক্ষা প্রয়োজন।`,
        source: "ওয়েল্ডিং নিরাপত্তা এবং কারিগরি শংসাপত্র ম্যানুয়াল",
        learning: ["SMAW ও GMAW প্রক্রিয়া অনুশীলন", "মান পরিদর্শন মানদণ্ড", "নিরাপত্তা নীতি"],
        topics: ["ভিজ্যুয়াল ওয়েল্ড পরিদর্শন", "রেডিওগ্রাফিক পরীক্ষা (RT)", "নিরাপত্তা হেলমেট শেড"]
      },
      furnace: {
        ans: `ব্লাস্ট ফার্নেস পরিচালনা একটি অবিচ্ছিন্ন প্রক্রিয়া যা আকরিক লোহাকে তরল লোহায় রূপান্তরিত করে:
1. **আকরিক ঢালাই:** লোহা আকরিক, কোক (কয়লা) এবং চুন পাথর ওপর থেকে ফেলা হয়।
2. **হট ব্লাস্ট:** নিচে টিয়ার্সের মাধ্যমে অতি উষ্ণ বাতাস (১০০০° সেলসিয়াসের ওপর) ফুঁকে দেওয়া হয়।
3. **রাসায়নিক বিয়োজন:** কোক পুড়ে কার্বন মনোক্সাইড (CO) তৈরি করে যা লোহা আকরিক থেকে অক্সিজেন সরিয়ে নেয়।
4. **গলন:** গলিত লোহা ফার্নেসের নিচে জমা হয় এবং নির্দিষ্ট সময় পরপর বের করে নেওয়া হয়।`,
        source: "ব্লাস্ট ফার্নেস পরিচালনা ও স্টার্টআপ গাইড",
        learning: ["কোহেসিভ জোন কেমিস্ট্রি", "টিয়ার্স রক্ষণাবেক্ষণ", "স্ল্যাগ পৃথকীকরণ"],
        topics: ["আয়রন রিডাকশন কেমিস্ট্রি", "রিফ্র্যাক্টরি লাইনিং", "স্ল্যাগ রানার নিরাপত্তা"]
      },
      startup: {
        ans: `বিশেষজ্ঞদের অভিজ্ঞতার ভিত্তিতে ব্লাস্ট ফার্নেস স্টার্টআপের সময় হওয়া সাধারণ ভুলসমূহ:
- **অপ্রতুল রিফ্র্যাক্টরি শুকানো:** অন্তত ৭২ ঘণ্টা রিফ্র্যাক্টরি লাইনিং না শুকিয়ে चालू করলে ফাটল দেখা দেয়।
- **দুর্বল কুলিং সিস্টেম পরীক্ষা:** ওয়াটার কুলিং সিস্টেমের চাপ পরীক্ষা না করা, যাতে ভেতরে জল লিক হতে পারে।
- **দ্রুত ব্লাস্ট ভলিউম বাড়ানো:** কোক বেড স্থিতিশীল হওয়ার আগেই বাতাসের চাপ বাড়ানো।
- **গ্যাস অনুপাত উপেক্ষা:** গ্যাসের CO/CO2 অনুপাত পর্যবেক্ষণ না করা।`,
        source: "ব্লাস্ট ফার্নেস পরিচালনা ও স্টার্টআপ গাইড",
        learning: ["ব্লাস্ট ফার্নেস স্টার্টআপ SOP", "কুলিং স্টেভ সংস্কার", "টপ গ্যাস অনুপাত বিশ্লেষণ"],
        topics: ["রিফ্র্যাক্টরি নিরাপত্তা", "ওয়াটার কুলিং পরিদর্শন", "গ্যাস চ্যানেল প্রতিরোধ", "থার্মাল শক"]
      },
      electrical: {
        ans: `একজন ইলেকট্রিক্যাল ইঞ্জিনিয়ারের জন্য প্রস্তাবিত সংস্থান:
- **কোর্স:** হাই ভোল্টেজ ইলেকট্রিক্যাল সেফটি, ইনফ্রারেড থার্মোগ্রাফি বেসিকস।
- **নথি ও এসওপি:** ইলেকট্রিক্যাল মেইনটেন্যান্স ফান্ডামেন্টালস, লকআউট-তাতআউট (LOTO) নিরাপত্তা প্রোটোকল।
- **মূল্যায়ন:** ইলেকট্রিক্যাল ফল্ট ডায়াগনোসিস পরীক্ষা, ইনসুলেশন রেজিস্ট্যান্স (মেগার) পরীক্ষা।`,
        source: "বৈদ্যুतिक রক্ষণাবেক্ষণ ও ত্রুটি সমাধান নির্দেশিকা",
        learning: ["হাই ভোল্টেজ আইসোলেশন", "সুইচগিয়ার রক্ষণাবেক্ষণ", "থার্মাল ইমেজিং পরীক্ষা"],
        topics: ["ট্রান্সফরমার গ্যাস বিশ্লেষণ", "মেগার ইনসুলেশন টেস্ট", "থার্মোগ্রাফিক স্ক্যানিং"]
      },
      onboarding: {
        ans: `আপনাকে স্বাগত! নতুন কর্মী হিসাবে আপনার শেখার যাত্রা এইভাবে শুরু করা উচিত:
1. **দিন ১-৩ (নীতিমালা):** সাধারণ কর্মক্ষেত্রের নিরাপত্তা অনবোর্ডিং, লোতো (LOTO) প্রাথমিক বিষয়াবলী এবং আইটি নিরাপত্তা।
2. **সপ্তাহ ১ (বিভাগীয়):** আপনার বিভাগের নির্দিষ্ট এসওপি ম্যানুয়ালগুলো পর্যালোচনা করুন।
3. **সপ্তাহ ২ (ব্যবহারিক):** একজন সিনিয়র কর্মীর অধীনে কাজ করুন এবং ব্যবহারিক পরীক্ষায় অংশ নিন।`,
        source: "এইচআর অনবোর্ডিং এবং প্রশিক্ষণ নীতি নির্দেশিকা",
        learning: ["সাধারণ কর্মক্ষেত্র নিরাপত্তা", "শিল্প লোতো প্রাথমিক ধারণা", "আইটি নিরাপত্তা সচেতনতা"],
        topics: ["কোম্পানির নীতিমালা", "অনবোর্ডিং তালিকা", "নিরাপত্তা প্রশিক্ষণ"]
      },
      loto: {
        ans: `লকআউট-ট্যাগআউট (LOTO) একটি অত্যন্ত গুরুত্বপূর্ণ নিরাপত্তা প্রোটোকল যা নিশ্চিত করে যে রক্ষণাবেক্ষণ বা সার্ভিসিং কাজ সম্পন্ন হওয়ার আগে মেশিনগুলি সঠিকভাবে বন্ধ আছে এবং পুনরায় चालू হবে না।

**LOTO প্রক্রিয়ার মূল ধাপসমূহ:**
1. **প্রস্তুতি (Preparation):** সমস্ত শক্তির উৎস (বৈদ্যুতিক, যান্ত্রিক, জলবাহী, বায়বীয়, তাপীয়) চিহ্নিত করুন।
2. **বিজ্ঞপ্তি (Notification):** সমস্ত প্রভাবিত কর্মচারীদের অবহিত করুন যে একটি LOTO প্রক্রিয়া শুরু হতে চলেছে।
3. **শাটডাউন (Shutdown):** মানক নিয়ন্ত্রণ ব্যবহার করে সরঞ্জাম বন্ধ করুন।
4. **আইসোলেশন (Isolation):** সরঞ্জামটিকে সমস্ত শক্তির উৎস থেকে বিচ্ছিন্ন করুন (যেমন ব্রেকার বন্ধ করা, ভালভ বন্ধ করা)।
5. **লকআউট/ট্যাগআউট (Lockout/Tagout):** প্রতিটি বিচ্ছিন্নকরণ পয়েন্টে পৃথক প্যাডলক এবং ট্যাগ প্রয়োগ করুন।
6. **শূন্য শক্তি পরীক্ষা (Zero State Check):** সমস্ত সঞ্চিত বা অবশিষ্ট শক্তি সম্পূর্ণরূপে নিষ্কাশित হয়েছে তা নিশ্চিত করুন।
7. **যাচাইকরণ (Verification):** বিচ্ছিন্নকরণ সফল হয়েছে তা নিশ্চিত করতে সরঞ্জামটি পুনরায় চালু করার চেষ্টা করুন। কাজ শুরু করার আগে নিয়ন্ত্রণগুলি 'অফ' অবস্থানে ফিরিয়ে আনুন।`,
        source: "লকআউট-ট্যাগআউট (LOTO) নিরাপত্তা প্রোটোকল",
        learning: ["শিল্প নিরাপত্তা মূল নীতি", "শূন্য শক্তি অবস্থা যাচাইকরণ", "গ্রুপ লকআউট পদ্ধতি"],
        topics: ["শক্তি বিচ্ছিন্নকরণ", "নিরাপত্তা প্যাডলক", "শূন্য শক্তি পরীক্ষা"]
      }
    }
  },
  pa: {
    intent: {
      welding: "Learning Recommendation",
      manual: "Document Summary",
      furnace: "Knowledge Search / General Learning",
      startup: "Troubleshooting / FAQ",
      electrical: "Learning Recommendation",
      onboarding: "General Learning / FAQ",
      loto: "ਸੁਰੱਖਿਆ ਪ੍ਰੋਟੋਕੋਲ / SOP"
    },
    tools: {
      welding: "ਸਿਖਲਾਈ ਸਿਫਾਰਸ਼ ਟੂਲ ਅਤੇ ਵੈਕਟਰ ਖੋਜ",
      manual: "ਦਸਤਾਵੇਜ਼ ਸੰਖੇਪ ਟੂਲ",
      furnace: "ਕੰਪਨੀ ਦਸਤਾਵੇਜ਼ ਰਿਪੋਜ਼ਟਰੀ ਖੋਜ",
      startup: "FAQ ਡਾਟਾਬੇਸ ਅਤੇ ਮਾਹਰ ਜਾਣਕਾਰੀ",
      electrical: "LMS ਸਿਲੇਬਸ ਮੈਪਿੰਗ ਟੂਲ",
      onboarding: "HRMS ਆਨਬੋਰਡਿੰਗ ਮਾਰਗ ਯੋਜਨਾਕਾਰ",
      loto: "EHS ਆਈਸੋਲੇਸ਼ਨ SOP ਪਾਰਸਰ"
    },
    answers: {
      welding: {
        ans: `ਇੱਕ ਨਵੇਂ ਵੈਲਡਿੰਗ ਟੈਕਨੀਸ਼ੀਅਨ ਨੂੰ ਹੇਠ ਲਿਖੇ ਸਿਖਲਾਈ ਪ੍ਰੋਗਰਾਮ ਪੂਰੇ ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ:
1. **ਸੁਰੱਖਿਆ ਪਹਿਲਾਂ (EHS ਆਨਬੋਰਡਿੰਗ):** ਲਾਜ਼ਮੀ PPE ਵਰਤੋਂ (ਵੈਲਡਿੰਗ ਹੈਲਮੇਟ ਸ਼ੇਡ 10-14, ਚਮੜੇ ਦੀ ਜੈਕਟ, ਸੁਰੱਖਿਆ ਬੂਟ) ਅਤੇ ਮਾਸਕ।
2. **ਤਕਨੀਕੀ ਸਿਖਲਾਈ:** ਬਾਹਰੀ ਰੱਖ-ਰਖਾਅ ਲਈ SMAW ਵੈਲਡਿੰਗ ਅਤੇ ਅੰਦਰੂਨੀ ਕੰਮਾਂ ਲਈ GMAW (MIG) ਵੈਲਡਿੰਗ ਦੇ ਵਿਹਾਰਕ ਕੋਰਸ।
3. **ਗੁਣਵੱਤਾ ਮਿਆਰ ਪ੍ਰਮਾਣੀਕਰਣ:** ਵਿਜ਼ੂਅਲ ਟੈਸਟਿੰਗ (VT) ਨਿਯਮਾਂ ਦੀ ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਵੈਲਡ ਗੁਣਵੱਤਾ ਟੈਸਟ (RT/UT) ਪਾਸ ਕਰੋ।`,
        source: "ਵੈਲਡਿੰਗ ਸੁਰੱਖਿਆ ਅਤੇ ਤਕਨੀਕੀ ਪ੍ਰਮਾਣੀਕਰਣ ਮੈਨੂਅਲ",
        learning: ["ਉਦਯੋਗਿਕ ਸੁਰੱਖਿਆ ਦੇ ਮੂਲ ਨਿਯਮ", "ਵੈਲਡਿੰਗ ਸ਼ੀਲਡਿੰਗ ਗੈਸਾਂ", "SMAW ਲੈਵਲ-II ਸਰਟੀਫਿਕੇਟ"],
        topics: ["ਵੈਲਡਿੰਗ PPE", "SMAW ਵੈਲਡਿੰਗ", "ਗੈਰ-ਵਿਨਾਸ਼ਕਾਰੀ ਟੈਸਟਿੰਗ (NDT)", "ਗੁਣਵੱਤਾ ਨਿਰੀਖਣ"]
      },
      manual: {
        ans: `ਵੈਲਡਿੰਗ ਅਤੇ ਰੱਖ-ਰਖਾਅ ਤਕਨੀਕੀ ਮੈਨੂਅਲ ਦਾ ਸੰਖੇਪ ਸਾਰ:
- **ਮੁੱਖ ਖ਼ਤਰੇ:** ਬਿਜਲੀ ਦੇ ਝਟਕੇ, ਰੇਡੀਏਸ਼ਨ (UV/IR), ਜ਼ਹਿਰੀਲਾ ਧੂੰਆਂ ਅਤੇ ਅੱਗ ਦੇ ਜੋਖਮ।
- **ਲਾਜ਼ਮੀ ਉਪਕਰਣ:** ਆਟੋ-ਡਾਰਕਨਿੰਗ ਸ਼ੇਡ ਵਾਲਾ ਵੈਲਡਿੰਗ ਹੈਲਮੇਟ, ਅੱਗ-ਰੋਧਕ ਚਮੜੇ ਦੀ ਜੈਕਟ, ਦਸਤਾਨੇ।
- **ਮੁੱਖ ਵਿਧੀਆਂ:** SMAW (ਸਟਿਕ), GMAW (MIG), ਅਤੇ GTAW (TIG) ਪ੍ਰਕਿਰਿਆਵਾਂ ਦੀ ਵਿਆਖਿਆ।
- **ਨਿਰੀਖਣ ਨਿਯਮ:** ਵੈਲਡਿੰਗ ਦੀ ਗੁਣਵੱਤਾ ਲਈ ਰੇਡੀਓਗ੍ਰਾਫਿਕ ਅਤੇ ਅਲਟਰਾਸੋਨਿਕ ਜਾਂਚ ਜ਼ਰੂਰੀ ਹੈ।`,
        source: "ਵੈਲਡਿੰਗ ਸੁਰੱਖਿਆ ਅਤੇ ਤਕਨੀਕੀ ਪ੍ਰਮਾਣੀਕਰਣ ਮੈਨੂਅਲ",
        learning: ["SMAW ਅਤੇ GMAW ਪ੍ਰਕਿਰਿਆ ਅਭਿਆਸ", "ਗੁਣਵੱਤਾ ਨਿਰੀਖਣ ਮਾਪਦੰਡ", "ਸੁਰੱਖਿਆ ਦੇ ਮੂਲ ਨਿਯਮ"],
        topics: ["ਵਿਜ਼ੂਅਲ ਵੈਲਡ ਨਿਰੀਖਣ", "ਰੇਡੀਓਗ੍ਰਾਫਿਕ ਟੈਸਟਿੰਗ (RT)", "ਸੁਰੱਖਿਆ ਹੈਲਮੇਟ ਸ਼ੇਡਜ਼"]
      },
      furnace: {
        ans: `ਬਲਾਸਟ ਫਰਨੇਸ ਦਾ ਕੰਮ ਇੱਕ ਨਿਰੰਤਰ ਰਸਾਇਣਕ ਪ੍ਰਕਿਰਿਆ ਹੈ ਜੋ ਲੋਹੇ ਦੀ ਕੱਚੀ ਧਾਤ ਨੂੰ ਪਿਘਲੇ ਹੋਏ ਲੋਹੇ ਵਿੱਚ ਬਦਲਦੀ ਹੈ:
1. **ਚਾਰਜਿੰਗ:** ਲੋਹੇ ਦੀ ਕੱਚੀ ਧਾਤ, ਕੋਕ (ਕੋਲਾ) ਅਤੇ ਚੂਨਾ ਪੱਥਰ ਉੱਪਰੋਂ ਪਾਏ ਜਾਂਦੇ ਹਨ।
2. **ਹੌਟ ਬਲਾਸਟ:** ਟਿਊਰਸ ਰਾਹੀਂ ਹੇਠਾਂ ਤੋਂ ਉੱਚ ਤਾਪਮਾਨ ਵਾਲੀ ਹਵਾ (1000°C ਤੋਂ ਵੱਧ) ਫੂਕੀ ਜਾਂਦੀ ਹੈ।
3. **ਰਸਾਇਣਕ ਘਟਾਓ:** ਕੋਕ ਬਲਦਾ ਹੈ ਅਤੇ ਕਾਰਬਨ ਮੋਨੋਆਕਸਾਈਡ (CO) ਗੈਸ ਬਣਾਉਂਦਾ ਹੈ ਜੋ ਲੋਹੇ ਦੀ ਧਾਤ ਤੋਂ ਆਕਸੀਜਨ ਨੂੰ ਵੱਖ ਕਰਦੀ ਹੈ।
4. **ਪਿਘਲਣਾ:** ਪਿਘਲਿਆ ਹੋਇਆ ਲੋਹਾ ਅਤੇ ਸਲੈਗ ਹੇਠਾਂ ਇਕੱਠੇ ਹੁੰਦੇ ਹਨ ਅਤੇ ਸਮੇਂ-ਸਮੇਂ 'ਤੇ ਬਾਹਰ ਕੱਢੇ ਜਾਂਦੇ ਹਨ।`,
        source: "ਬਲਾਸਟ ਫਰਨੇਸ ਓਪਰੇਸ਼ਨ ਅਤੇ ਸਟਾਰਟਅੱਪ ਗਾਈਡ",
        learning: ["ਕੋਹੇਸਿਵ ਜ਼ੋਨ ਕੈਮਿਸਟਰੀ", "ਟਿਊਰ ਰੱਖ-ਰਖਾਅ", "ਸਲੈਗ ਵੱਖ ਕਰਨਾ"],
        topics: ["ਲੋਹਾ ਘਟਾਉਣ ਦੀ ਰਸਾਇਣ", "ਰਿਫ੍ਰੈਕਟਰੀ ਲਾਈਨਿੰਗ", "ਸਲੈਗ ਰਨਰ ਸੁਰੱਖਿਆ"]
      },
      startup: {
        ans: `ਮਾਹਰਾਂ ਦੇ ਤਜ਼ਰਬਿਆਂ ਤੋਂ ਇਕੱਠੀਆਂ ਕੀਤੀਆਂ ਗਈਆਂ ਬਲਾਸਟ ਫਰਨੇਸ ਸਟਾਰਟਅੱਪ ਦੌਰਾਨ ਆਮ ਗਲਤੀਆਂ:
- **ਰਿਫ੍ਰੈਕਟਰੀ ਨੂੰ ਸਹੀ ਤਰ੍ਹਾਂ ਨਾ ਸੁਕਾਉਣਾ:** 72 ਘੰਟੇ ਲਾਈਨਿੰਗ ਨੂੰ ਸੁਕਾਏ ਬਿਨਾਂ ਸਟਾਰਟ ਕਰਨ ਨਾਲ ਤਰੇੜਾਂ ਆ ਸਕਦੀਆਂ ਹਨ।
- **ਮਾੜੀ ਕੂਲਿੰਗ ਜਾਂਚ:** ਕੂਲਿੰਗ ਸਿਸਟਮ ਦਾ ਦਬਾਅ ਟੈਸਟ ਨਾ ਕਰਨਾ, ਜਿਸ ਨਾਲ ਅੰਦਰ ਪਾਣੀ ਲੀਕ ਹੋ ਸਕਦਾ ਹੈ।
- **ਤੇਜ਼ੀ ਨਾਲ ਹਵਾ ਦਾ ਦਬਾਅ ਵਧਾਉਣਾ:** ਕੋਕ ਬੈੱਡ ਸਥਿਰ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਹਵਾ ਦਾ ਦਬਾਅ ਤੇਜ਼ੀ ਨਾਲ ਵਧਾਉਣਾ।
- **ਗੈਸ ਅਨੁਪਾਤ ਦੀ ਅਣਦੇਖੀ:** ਚੋਟੀ ਦੀ ਗੈਸ ਵਿੱਚ CO/CO2 ਅਨੁਪਾਤ ਦੀ ਨਿਗਰਾਨੀ ਨਾ ਕਰਨਾ।`,
        source: "ਬਲਾਸਟ ਫਰਨੇਸ ਓਪਰੇਸ਼ਨ ਅਤੇ ਸਟਾਰਟਅੱਪ ਗਾਈਡ",
        learning: ["ਬਲਾਸਟ ਫਰਨੇਸ ਸਟਾਰਟਅੱਪ SOP", "ਕੂਲਿੰਗ ਸਟੇਵ ਨਵੀਨੀਕਰਨ", "ਗੈਸ ਅਨੁਪਾਤ ਵਿਸ਼ਲੇਸ਼ਣ"],
        topics: ["ਰਿਫ੍ਰੈਕਟਰੀ ਸੁਰੱਖਿਆ", "ਕੂਲਿੰਗ ਸਿਸਟਮ ਨਿਰੀਖਣ", "ਗੈਸ ਚੈਨਲਿੰਗ ਰੋਕਥਾਮ", "ਥਰਮਲ ਸ਼ੌਕ"]
      },
      electrical: {
        ans: `ਇੱਕ ਇਲੈਕਟ੍ਰੀਕਲ ਇੰਜੀਨੀਅਰ ਲਈ ਸਿਫਾਰਸ਼ ਕੀਤੇ ਸਰੋਤ:
- **ਕੋਰਸ:** ਹਾਈ ਵੋਲਟੇਜ ਇਲੈਕਟ੍ਰੀਕਲ ਸੁਰੱਖਿਆ, ਇਨਫਰਾਰੈੱਡ ਥਰਮੋਗ੍ਰਾਫੀ ਦੇ ਮੂਲ ਨਿਯਮ।
- **ਦਸਤਾਵੇਜ਼ ਅਤੇ SOP:** ਇਲੈਕਟ੍ਰੀਕਲ ਮੇਨਟੇਨੈਂਸ ਦੇ ਮੂਲ ਨਿਯਮ, ਲਾਕਆਊਟ-ਟੈਗਆਊਟ (LOTO) ਸੁਰੱਖਿਆ ਪ੍ਰੋਟੋਕੋਲ।
- **ਮੁਲਾਂਕਣ:** ਇਲੈਕਟ੍ਰੀਕਲ ਫਾਲਟ ਨਿਦਾਨ ਪ੍ਰੀਖਿਆ, ਇਨਸੂਲੇਸ਼ਨ ਪ੍ਰਤੀਰੋਧ (ਮੈਗਰ) ਟੈਸਟਿੰਗ।`,
        source: "ਇਲੈਕਟ੍ਰੀਕਲ ਮੇਨਟੇਨੈਂਸ ਦੇ ਮੂਲ ਨਿਯਮ ਅਤੇ ਸਮੱਸਿਆ ਨਿਪਟਾਰਾ ਗਾਈਡ",
        learning: ["ਹਾਈ ਵੋਲਟੇਜ ਆਈਸੋਲੇਸ਼ਨ", "ਸਵਿੱਚਗੀਅਰ ਰੱਖ-ਰਖਾਅ", "ਥਰਮਲ ਇਮੇਜਿੰਗ ਜਾਂਚ"],
        topics: ["ਟ੍ਰਾਂਸਫਾਰਮਰ ਗੈਸ ਵਿਸ਼ਲੇਸ਼ਣ", "ਮੈਗਰ ਇਨਸੂਲੇਸ਼ਨ ਟੈਸਟਿੰਗ", "ਥਰਮੋਗ੍ਰਾਫਿਕ ਸਕੈਨਿੰਗ"]
      },
      onboarding: {
        ans: `ਜੀ ਆਇਆਂ ਨੂੰ! ਇੱਕ ਨਵੇਂ ਕਰਮਚਾਰੀ ਵਜੋਂ, ਤੁਹਾਨੂੰ ਆਪਣੀ ਸਿੱਖਣ ਦੀ ਯਾਤਰਾ ਇਸ ਤਰ੍ਹਾਂ ਸ਼ੁਰੂ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ:
1. **ਦਿਨ 1-3 (ਪਾਲਣਾ):** ਆਮ ਕੰਮ ਵਾਲੀ ਥਾਂ ਦੀ ਸੁਰੱਖਿਆ ਆਨਬੋਰਡਿੰਗ, ਲੋਟੋ (LOTO) ਦੇ ਮੂਲ ਨਿਯਮ, ਅਤੇ ਆਈਟੀ ਸੁਰੱਖਿਆ।
2. **ਹਫ਼ਤਾ 1 (ਵਿਭਾਗੀ):** ਆਪਣੇ ਵਿਭਾਗ ਲਈ ਖਾਸ SOP ਮੈਨੂਅਲ ਦੀ ਸਮੀਖਿਆ ਕਰੋ।
3. **ਹਫ਼ਤਾ 2 (ਵਿਹਾਰਕ):** ਕਿਸੇ ਸੀਨੀਅਰ ਟੈਕਨੀਸ਼ੀਅਨ ਦੀ ਨਿਗਰਾਨੀ ਹੇਠ ਕੰਮ ਕਰੋ ਅਤੇ ਵਿਹਾਰਕ ਮੁਲਾਂਕਣ ਪਾਸ ਕਰੋ।`,
        source: "HR ਆਨਬੋਰਡਿੰਗ ਅਤੇ ਸਿਖਲਾਈ ਨੀਤੀ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼",
        learning: ["ਆਮ ਕੰਮ ਵਾਲੀ ਥਾਂ ਸੁਰੱਖਿਆ", "ਉਦਯੋਗਿਕ ਲੋਟੋ ਮੂਲ ਨਿਯਮ", "ਆਈਟੀ ਸੁਰੱਖਿਆ ਜਾਗਰੂਕਤਾ"],
        topics: ["ਕੰਪਨੀ ਦੀਆਂ ਨੀਤੀਆਂ", "ਆਨਬੋਰਡਿੰਗ ਚੈੱਕਲਿਸਟ", "ਸੁਰੱਖਿਆ ਸਿਖਲਾਈ"]
      },
      loto: {
        ans: `ਲਾਕਆਊਟ-ਟੈਗਆਊਟ (LOTO) ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਸੁਰੱਖਿਆ ਪ੍ਰੋਟੋਕੋਲ ਹੈ ਜੋ ਇਹ ਯਕੀਨੀ ਬਣਾਉਂਦਾ ਹੈ ਕਿ ਰੱਖ-ਰਖਾਅ ਜਾਂ ਸਰਵਿਸਿੰਗ ਦਾ ਕੰਮ ਪੂਰਾ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਮਸ਼ੀਨਾਂ ਸਹੀ ਤਰ੍ਹਾਂ ਬੰਦ ਹੋ ਜਾਣ ਅਤੇ ਦੁਬਾਰਾ ਚਾਲੂ ਨਾ ਹੋਣ।

**LOTO ਪ੍ਰਕਿਰਿਆ ਦੇ ਮੁੱਖ ਪੜਾਅ:**
1. **ਤਿਆਰੀ (Preparation):** ਸਾਰੇ ਊਰਜਾ ਸਰੋਤਾਂ (ਬਿਜਲੀ, ਮਕੈਨੀਕਲ, ਹਾਈਡ੍ਰੌਲਿਕ, ਨਿਊਮੈਟਿਕ, ਥਰਮਲ) ਦੀ ਪਛਾਣ ਕਰੋ।
2. **ਸੂਚਨਾ (Notification):** ਸਾਰੇ ਪ੍ਰਭਾਵਿਤ ਕਰਮਚਾਰੀਆਂ ਨੂੰ ਸੂਚਿਤ ਕਰੋ ਕਿ LOTO ਪ੍ਰਕਿਰਿਆ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲੀ ਹੈ।
3. **ਸ਼ੱਟਡਾਊਨ (Shutdown):** ਮਿਆਰੀ ਨਿਯੰਤਰਣਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਉਪਕਰਨ ਬੰਦ ਕਰੋ।
4. **ਆਈਸੋਲੇਸ਼ਨ (Isolation):** ਉਪਕਰਨ ਨੂੰ ਸਾਰੇ ਊਰਜਾ ਸਰੋਤਾਂ ਤੋਂ ਵੱਖ ਕਰੋ (ਜਿਵੇਂ ਬ੍ਰੇਕਰ ਬੰਦ ਕਰਨਾ, ਵਾਲਵ ਬੰਦ ਕਰਨਾ)।
5. **ਲਾਕਆਊਟ/ਟੈਗਆਊਟ (Lockout/Tagout):** ਹਰੇਕ ਆਈਸੋਲੇਸ਼ਨ ਪੁਆਇੰਟ 'ਤੇ ਨਿੱਜੀ ਤਾਲੇ ਅਤੇ ਟੈਗ ਲਗਾਓ।
6. **ਜ਼ੀਰੋ ਊਰਜਾ ਜਾਂਚ (Zero State Check):** ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਸਾਰੀ ਸਟੋਰ ਕੀਤੀ ਜਾਂ ਬਾਕੀ ਬਚੀ ਊਰਜਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਖ਼ਤਮ ਹੋ ਗਈ ਹੈ।
7. **ਪੁਸ਼ਟੀਕਰਨ (Verification):** ਆਈਸੋਲੇਸ਼ਨ ਦੀ ਪੁਸ਼ਟੀ ਕਰਨ ਲਈ ਉਪਕਰਨ ਨੂੰ ਦੁਬਾਰਾ ਚਾਲੂ ਕਰਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਕੰਮ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਨਿਯੰਤਰਣ ਨੂੰ 'ਆਫ' ਸਥਿਤੀ 'ਤੇ ਵਾਪਸ ਲਿਆਓ।`,
        source: "ਲਾਕਆਊਟ-ਟੈਗਆਊਟ (LOTO) ਸੁਰੱਖਿਆ ਪ੍ਰੋਟੋਕੋਲ",
        learning: ["ਉਦਯੋਗਿਕ ਸੁਰੱਖਿਆ ਦੇ ਮੂਲ ਨਿਯਮ", "ਜ਼ੀਰੋ ਊਰਜਾ ਸਥਿਤੀ ਪੁਸ਼ਟੀਕਰਨ", "ਗਰੁੱਪ ਲਾਕਆਊਟ ਪ੍ਰਕਿਰਿਆਵਾਂ"],
        topics: ["ਊਰਜਾ ਆਈਸੋਲੇਸ਼ਨ", "ਸੁਰੱਖਿਆ ਤਾਲੇ", "ਜ਼ੀਰੋ ਊਰਜਾ ਜਾਂਚ"]
      }
    }
  },
  te: {
    intent: {
      welding: "Learning Recommendation",
      manual: "Document Summary",
      furnace: "Knowledge Search / General Learning",
      startup: "Troubleshooting / FAQ",
      electrical: "Learning Recommendation",
      onboarding: "General Learning / FAQ",
      loto: "భద్రతా ప్రోటోకాల్ / SOP"
    },
    tools: {
      welding: "లర్నింగ్ రికమండేషన్ మరియు వెక్టర్ శోధన సాధనం",
      manual: "డాక్యుమెంట్ సమ్మరైజేషన్ టూల్",
      furnace: "కంపెనీ డాక్యుమెంట్ల రిపోజిటరీ శోధన",
      startup: "FAQ డేటాబేస్ మరియు నిపుణుల సలహాలు",
      electrical: "LMS సిలబస్ మ్యాపింగ్ టూల్",
      onboarding: "HRMS ఆన్‌బోర్डिंग పాత్ ప్లానర్"
    },
    answers: {
      welding: {
        ans: `కొత్త వెల్డింగ్ టెక్నీషియన్ క్రింది శిక్షణను పూర్తి చేయాలి:
1. **భద్రతే మొదటిది (EHS ఆన్‌బోర్డింగ్):** వెల్డింగ్ హెల్మెట్ (షేడ్ 10-14), తోలు జాకెట్, భద్రతా బూట్లు మరియు మాస్క్ ధరించడం తప్పనిసరి.
2. **సాంకేతిక శిక్షణ:** అవుట్‌డోర్ పనుల కోసం SMAW వెల్డింగ్ మరియు ఇండోర్ పనుల కోసం GMAW (MIG) వెల్డింగ్‌పై ప్రాక్టికల్ కోర్సులు.
3. **నాణ్యతా ప్రమాణాల ధృవీకరణ:** విజువల్ ఇన్‌స్పెక్షన్ నిబంధనలను (VT) సమీక్షించి, వెల్డింగ్ క్వాలిటీ టెస్ట్ (RT/UT) పాస్ కావాలి.`,
        source: "వెల్డింగ్ భద్రత మరియు సాంకేతిక ధృవీకరణ మాన్యువల్",
        learning: ["పారిశ్రామిక భద్రత బేసిక్స్", "వెల్డింగ్ షీల్డింగ్ వాయువులు", "SMAW లెవlevel-II సర్టిఫికేట్"],
        topics: ["వెల్డింగ్ పిపిఇ", "SMAW వెల్డింగ్", "నాన్-డిస్ట్రక్టివ్ టెస్టింగ్ (NDT)", "నాణ్యత తనిఖీ"]
      },
      manual: {
        ans: `వెల్డింగ్ మరియు మెయింటెనెన్స్ సాంకేతిక మాన్యువల్ యొక్క సారాంశం:
- **ప్రధాన ప్రమాదాలు:** విద్యుత్ ఘాతము, రేడియేషన్ (UV/IR), విష వాయువులు మరియు అగ్ని ప్రమాదాల వివరాలు.
- **తప్పనిసరి గేర్:** ఆటో-డార్క్ వెల్డింగ్ హెల్మెట్, నిప్పు నిరోధక తోలు జాకెట్ మరియు చేతి తొడుగులు.
- **పద్ధతులు:** SMAW (స్టిక్), GMAW (MIG), మరియు GTAW (TIG) పద్ధతులు.
- **తనిఖీ నియమాలు:** వెల్డింగ్ నాణ్యతను నిర్ధారించడానికి రేడియో గ్రాఫిక్ మరియు అల్ట్రాసోనిక్ పరీక్షలు అవసరం.`,
        source: "వెల్డింగ్ భద్రత మరియు సాంకేతిక ధృవీకరణ మాన్యువల్",
        learning: ["SMAW మరియు GMAW ప్రాక్టీస్", "నాణ్యత తనిఖీ ప్రమాణాలు", "భద్రతా సూత్రాలు"],
        topics: ["విజువల్ వెల్డ్ తనిఖీలు", "రేడియో గ్రాఫిక్ టెస్టింగ్ (RT)", "సేఫ్టీ హెల్మెట్ షేడ్స్"]
      },
      furnace: {
        ans: `బ్లాస్ట్ ఫర్నేస్ ఆపరేషన్ అనేది ఇనుప ఖనిజాన్ని ద్రవ ఇనుముగా మార్చే నిరంతర ప్రక్రియ:
1. **చార్జింగ్:** ఇనుప ఖనిజం, కోక్ (బొగ్గు), మరియు సున్నపురాయి పైనుంచి వేస్తారు.
2. **హాట్ బ్లాสต์:** కింద ఉన్న ట్యూయర్స్ ద్వారా ఆక్సిజన్ అధిక ఉష్ణోగ్రత గల గాలిని (1000°C పైగా) పంపుతారు.
3. **రసాయన క్షయకరణం:** కోక్ మండి కార్బన్ మోనాక్సైడ్ (CO) వాయువును ఉత్పత్తి చేస్తుంది, ఇది ఇనుప ఖనిజం నుండి ఆక్సిజన్‌ను వేరు చేస్తుంది.
4. **కరగడం:** ద్రవ ఇనుము ఫర్నేస్ అడుగున సేకరించబడి క్రమానుగతంగా బయటకు తీయబడుతుంది.`,
        source: "బ్లాస్ట్ ఫర్నేస్ ఆపరేషన్స్ మరియు స్టార్టప్ గైడ్",
        learning: ["ఫర్నేస్ కెమిస్ట్రీ", "ట్యూయర్స్ నిర్వహణ", "స్లాగ్ విభజన"],
        topics: ["ఐరన్ రిడక్షన్ కెమిస్ట్రీ", "రిఫ్రాక్టరీ లైనింగ్లు", "స్లాగ్ రన్నర్ సేఫ్టీ"]
      },
      startup: {
        ans: `నిపుణుల అనుభవం నుండి బ్లాస్ట్ ఫర్నేస్ స్టార్టప్ సమయంలో జరిగే సాధారణ తప్పులు:
- **లైనింగ్ సరిగ్గా ఆరబెట్టకపోవడం:** 72 గంటల పాటు రిఫ్రాక్టరీ లైనింగ్‌ను ఆరబెట్టకుండా స్టార్ట్ చేస్తే పగుళ్లు ఏర్పడతాయి.
- **కూలింగ్ సిస్టమ్ తనిఖీ లోపం:** వాటర్ కూలింగ్ సిస్టమ్‌ను పరీక్షించకపోవడం వల్ల లోపల నీటి లీకేజీలు సంభవించవచ్చు.
- **బ్లాสต์ వాల్యూమ్‌ను వేగంగా పెంచడం:** కోక్ బెడ్ స్థిరపడక ముందే గాలి ఒత్తిడిని పెంచడం.
- **గ్యాస్ నిష్పత్తిని విస్మరించడం:** గ్యాస్‌లోని CO/CO2 నిష్పత్తిని పర్యవేక్షించకపోవడం.`,
        source: "బ్లాస్ట్ ఫర్నేస్ ఆపరేషన్స్ మరియు స్టార్టప్ గైడ్",
        learning: ["బ్లాస్ట్ ఫర్నేస్ స్టార్టప్ SOP", "కూలింగ్ స్టేవ్ పునరుద్ధరణ", "గ్యాస్ నిష్పత్తి విశ్లేషణ"],
        topics: ["రిఫ్రాక్టరీ భద్రత", "వాటర్ కూలింగ్ తనిఖీ", "గ్యాస్ లీకేజ్ నివారణ", "థర్మల్ షాక్"]
      },
      electrical: {
        ans: `ఎలక్ట్రికల్ ఇంజనీర్ కోసం సిఫార్సు చేయబడిన వనరులు:
- **కోర్సులు:** హై వోల్టేజ్ ఎలక్ట్రికల్ సేఫ్టీ, ఇన్‌ఫ్రారెడ్ థర్మోగ్రఫీ బేసిక్స్.
- **పత్రాలు & SOP:** ఎలక్ట్రికల్ మెయింటెనెన్స్ ఫండమెంటల్స్, లాకౌట్-ట్యాగౌట్ (LOTO) భద్రతా ప్రోటోకాల్.
- **అసెస్మెంట్లు:** ఎలక్ట్రికల్ ఫాల్ట్ డయాగ్నోసిస్ పరీక్ష, ఇన్సులేషన్ రెసిస్టెన్స్ (మెగ్గర్) పరీక్ష.`,
        source: "ఎలక్ట్రికల్ మెయింటెనెన్స్ ఫండమెంటల్స్ మరియు ట్రబుల్షూటింగ్",
        learning: ["హై వోల్టేజ్ ఐసోలేషన్", "స్విచ్‌గేర్ మెయింటెనెన్స్", "థర్మల్ ఇమేజింగ్ తనిఖీలు"],
        topics: ["ట్రాన్స్‌ఫార్మర్ గ్యాస్ విశ్లేషణ", "మెగ్గర్ ఇన్సులేషన్ పరీక్ష", "థర్మోగ్రాఫిక్ స్కానింగ్"]
      },
      onboarding: {
        ans: `స్వాగతం! ఒక కొత్త ఉద్యోగిగా, మీరు మీ అభ్యాస ప్రయాణాన్ని ఇలా ప్రారంభించాలి:
1. **రోజు 1-3 (ఆచరణ):** సాధారణ కార్యాలయ భద్రతా ఆన్‌బోర్డింగ్, లోతో (LOTO) బేసిక్స్ మరియు ఐటీ సెక్యూరిటీ.
2. **వారం 1 (విభాగపు):** మీ విభాగానికి సంబంధించిన నిర్దిష్ట ఎస్ఓపి మాన్యువల్స్ చదవండి.
3. **వారం 2 (ప్రాక్టికల్):** సీనియర్ టెక్నీషియన్ పర్యవేక్షణలో పనిచేసి ప్రాక్టికల్ అసెస్‌మెంట్ పాస్ కావాలి.`,
        source: "HR ఆన్‌బోర్డింగ్ మరియు శిక్షణ విధాన మార్గదర్శకాలు",
        learning: ["సాధారణ కార్యాలయ భద్రత", "పారిశ్రామిక లోతో బేసిక్స్", "ఐటీ సెక్యూరిటీ అవగాహన"],
        topics: ["కంపెనీ విధానాలు", "ఆన్‌బోర్డింగ్ చెక్‌లిస్ట్", "భద్రతా శిక్షణ"]
      },
      loto: {
        ans: `లాకౌట్-ట్యాగౌట్ (LOTO) అనేది ఒక ముఖ్యమైన భద్రతా ప్రోటోకాల్, ఇది నిర్వహణ లేదా సర్వీసింగ్ పనులు పూర్తి కావడానికి ముందే యంత్రాలు సరిగ్గా ఆపివేయబడ్డాయని మరియు మళ్లీ ప్రారంభం కాకుండా చూసుకోవడానికి ఉపయోగించబడుతుంది.

**LOTO ప్రక్రియ యొక్క ప్రధాన దశలు:**
1. **సన్నాహం (Preparation):** అన్ని శక్తి వనరులను (విద్యుత్, యాంత్రిక, హైడ్రాలిక్, న్యూమాటిక్, థర్మల్) గుర్తించండి.
2. **సమాచారం (Notification):** LOTO ప్రక్రియ ప్రారంభం కాబోతోందని ప్రభావిత ఉద్యోగులందరికీ తెలియజేయండి.
3. **షట్డౌన్ (Shutdown):** ప్రామాణిక నియంత్రణలను ఉపయోగించి పరికరాలను ఆపివేయండి.
4. **ఐసోలేషన్ (Isolation):** పరికరాన్ని అన్ని శక్తి వనరుల నుండి వేరు చేయండి (ఉదా. బ్రేకర్లు ఆఫ్ చేయడం, వాల్వ్‌లు మూసివేయడం).
5. **లాకౌట్/ట్యాగౌట్ (Lockout/Tagout):** ప్రతి ఐసోలేషన్ పాయింట్ వద్ద వ్యక్తిగత ప్యాడ్‌లాక్‌లు మరియు ట్యాగ్‌లను అమర్చండి.
6. **శూన్య శక్తి తనిఖీ (Zero State Check):** నిల్వ చేయబడిన లేదా మిగిలిపోయిన శక్తి పూర్తిగా తొలగించబడిందని నిర్ధారించుకోండి.
7. **ధృవీకరణ (Verification):** ఐసోలేషన్ విజయవంతమైందని నిర్ధారించడానికి పరికరాలను మళ్లీ ప్రారంభించడానికి ప్రయత్నించండి. పని ప్రారంభించే ముందు నియంత్రణలను 'ఆఫ్' స్థానానికి మార్చండి.`,
        source: "లాకౌట్-ట్యాగౌట్ (LOTO) భద్రతా ప్రోటోకాల్",
        learning: ["పారిశ్రామిక భద్రత సూత్రాలు", "శూన్య శక్తి స్థితి ధృవీకరణ", "గ్రూప్ లాకౌట్ విధానాలు"],
        topics: ["శక్తి ఐసోలేషన్", "భద్రతా తాళాలు", "శూన్య శక్తి తనిఖీ"]
      }
    }
  }
};

// Client-side auto language detector using regex unicode ranges
export const detectLanguage = (text) => {
  if (!text) return "en";
  
  const lower = text.toLowerCase();
  if (lower.includes("hindi") || lower.includes("हिंदी") || lower.includes("हिन्दी")) {
    return "hi";
  }
  if (lower.includes("marathi") || lower.includes("मराठी")) {
    return "mr";
  }
  if (lower.includes("bengali") || lower.includes("বাংলা") || lower.includes("बंगाली")) {
    return "bn";
  }
  if (lower.includes("punjabi") || lower.includes("ਪੰਜਾਬੀ") || lower.includes("पंजाबी")) {
    return "pa";
  }
  if (lower.includes("telugu") || lower.includes("తెలుగు") || lower.includes("तेలుగు")) {
    return "te";
  }
  if (lower.includes("english") || lower.includes("अंग्रेजी") || lower.includes("इंग्रजी") || lower.includes("ਅੰਗਰੇਜ਼ੀ")) {
    return "en";
  }

  // Hindi & Marathi (Devanagari): range \u0900-\u097F
  if (/[\u0900-\u097F]/.test(text)) {
    // If it contains Marathi specific words or we just fall back, Devanagari covers both.
    // Let's do a simple check for Marathi verbs/common words or default to 'hi' / 'mr'.
    // Since Marathi uses Devanagari, let's check for marathi specific words like "शिकण्याचा", "झाले", "करा", "काढणे"
    if (/शिकण्याचा|चालणारी|वितळलेल्या|झाले|केले|पद्धती|मार्ग/.test(text)) {
      return "mr";
    }
    return "hi";
  }
  
  // Bengali: range \u0980-\u09FF
  if (/[\u0980-\u09FF]/.test(text)) {
    return "bn";
  }
  
  // Punjabi: range \u0A00-\u0A7F
  if (/[\u0A00-\u0A7F]/.test(text)) {
    return "pa";
  }
  
  // Telugu: range \u0C00-\u0C7F
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return "te";
  }
  
  // Tamil: range \u0B80-\u0BFF (added support just in case)
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return "ta";
  }

  return "en"; // Default to English
};

export const getResponseForQuery = (queryText, context) => {
  const query = queryText.toLowerCase().trim();
  let detectedLang = detectLanguage(queryText);

  // If context is a two-letter language code, override language selection
  if (context && typeof context === 'string' && context.length === 2) {
    detectedLang = context;
  }

  const translations = multilingualResponses[detectedLang] || multilingualResponses["en"];
  const defaults = multilingualResponses["en"];

  const extractKey = (txt) => {
    if (!txt) return null;
    const q = txt.toLowerCase().trim();
    if (q.includes("welding") || q.includes("वेल्डिंग") || q.includes("ওয়েল্ডিং") || q.includes("ਵੈਲਡਿੰਗ") || q.includes("వెల్డింగ్")) {
      return "welding";
    } else if (q.includes("summarize") || q.includes("manual") || q.includes("ਸਾਰ") || q.includes("सारांश") || q.includes("সংক্ষিপ্ত") || q.includes("సారాంశం")) {
      return "manual";
    } else if (q.includes("blast furnace") || q.includes("operation") || q.includes("ब्लास्ट फर्नेस") || q.includes("ਧਮਨ ਭੱਠੀ") || q.includes("ধমন ভट्टी") || q.includes("ఫర్నేస్")) {
      return "furnace";
    } else if (q.includes("startup") || q.includes("mistakes") || q.includes("ਗਲਤੀਆਂ") || q.includes("गलतियां") || q.includes("ভুল") || q.includes("తప్పులు")) {
      return "startup";
    } else if (q.includes("electrical") || q.includes("बिजली") || q.includes("ਇਲੈਕਟ੍ਰੀਕਲ") || q.includes("বৈद्यੁতিক") || q.includes("ఎలక్ట్రికల్")) {
      return "electrical";
    } else if (q.includes("begin") || q.includes("new employee") || q.includes("learning journey") || q.includes("onboarding") || q.includes("roadmap") || q.includes("ऑनबोर्डिंग") || q.includes("रोडमैप") || q.includes("ਔਨਬੋਰਡਿੰਗ") || q.includes("రోడ్‌మ్యాప్") || q.includes("ਸ਼ੁਰੂ") || q.includes("शुरू") || q.includes("ਸ਼ੁਰੂ") || q.includes("ప్రారంభ")) {
      return "onboarding";
    } else if (q.includes("machine learning") || q.includes("ml")) {
      return "ml";
    } else if (q.includes("loto") || q.includes("lockout") || q.includes("tagout") || q.includes("लोटो") || q.includes("लॉकाउट") || q.includes("ਲੋਟੋ") || q.includes("లోటో")) {
      return "loto";
    }
    return null;
  };

  let key = extractKey(query);

  // If no key matches but this is a language request, extract topic from the context (previous queries)
  if (!key && context) {
    const isLanguageQuery = query.includes("hindi") || query.includes("हिंदी") || query.includes("हिन्दी") ||
                            query.includes("marathi") || query.includes("मराठी") ||
                            query.includes("bengali") || query.includes("বাংলা") || query.includes("बंगाली") ||
                            query.includes("punjabi") || query.includes("ਪੰਜਾਬੀ") || query.includes("पंजाबी") ||
                            query.includes("telugu") || query.includes("తెలుగు") || query.includes("తేలుగు") ||
                            query.includes("english") || query.includes("अंग्रेजी") || query.includes("इंग्रजी") || query.includes("ਅੰਗਰੇਜ਼ੀ") ||
                            query.includes("translate") || query.includes("भाषा") || query.includes("अनुवाद") || query.includes("ভাষান্তর") || query.includes("ਅਨੁਵਾਦ") || query.includes("అనువాదం");
    if (isLanguageQuery) {
      if (Array.isArray(context)) {
        // search backwards for the first query that matches a topic key
        for (let i = context.length - 1; i >= 0; i--) {
          const k = extractKey(context[i]);
          if (k) {
            key = k;
            break;
          }
        }
      } else if (typeof context === 'string' && context.length > 2) {
        key = extractKey(context);
      }
    }
  }

  if (key) {
    return {
      intent: translations.intent[key] || defaults.intent[key],
      tool: translations.tools[key] || defaults.tools[key],
      ... (translations.answers[key] || defaults.answers[key])
    };
  }

  // Fallback response with proper detected language mapping
  const getFallbackText = (lang) => {
    switch (lang) {
      case "hi":
        return `मुझे आपकी खोज से संबंधित जानकारी हमारे नॉलेज बेस में मिली है। सर्वोत्तम परिणामों के लिए, आप इन प्रश्नों को आज़मा सकते हैं:
- "Explain Lockout-Tagout."
- "Explain blast furnace operation."
- "What PPE is required before furnace maintenance?"`;
      case "mr":
        return `मला तुमच्या प्रश्नाशी संबंधित माहिती सापडली आहे. सर्वोत्तम उत्तरासाठी कृपया आमच्या सुचवलेल्या प्रश्नांपैकी एक निवडा:
- "Explain Lockout-Tagout."
- "Explain blast furnace operation."`;
      case "bn":
        return `আমি আমাদের তথ্যভাণ্ডারে আপনার প্রশ্নের উত্তর খুঁজে পেয়েছি। সেরা ফলাফলের জন্য এই প্রশ্নগুলি চেষ্টা করুন:
- "Explain Lockout-Tagout."
- "Explain blast furnace operation."`;
      case "pa":
        return `ਮੈਨੂੰ ਤੁਹਾਡੀ ਖੋਜ ਨਾਲ ਸਬੰਧਤ ਜਾਣਕਾਰੀ ਗਿਆਨ ਕੋਸ਼ ਵਿੱਚ ਮਿਲੀ ਹੈ। ਵਧੀਆ ਨਤੀਜਿਆਂ ਲਈ, ਤੁਸੀਂ ਇਹਨਾਂ ਪ੍ਰਸ਼ਨਾਂ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰ ਸਕਦੇ ਹੋ:
- "Explain Lockout-Tagout."
- "Explain blast furnace operation."`;
      case "te":
        return `మీ శోధనకు సంబంధించిన సమాచారం మా నాలెడ్జ్ బేస్‌లో లభించింది. ఉత్తమ ఫలితాల కోసం, ఈ క్రింది ప్రశ్నలను ప్రయత్నించండి:
- "Explain Lockout-Tagout."
- "Explain blast furnace operation."`;
      default:
        return `I found matches in the Mentora L&D Knowledge Base, but I couldn't find a direct answer to your exact question.

To get the most relevant details, you can try asking about one of our core topics:
* **Lockout-Tagout (LOTO)** safety procedures
* **Blast Furnace Operations** and thermal safety checks
* **Welding Techniques** and dielectric testing
* **Onboarding Roadmap** for new maintenance engineers

Alternatively, try uploading a manual or SOP document using the attachment icon below, and I will summarize it or answer questions directly from it!`;
    }
  };

  return {
    intent: detectedLang === "en" ? "Knowledge Search" : "सामान्य खोज",
    tool: detectedLang === "en" ? "Cognitive Knowledge Search" : "ਸੰਗਿਆਨਾਤਮਕ ਖੋਜ",
    ans: getFallbackText(detectedLang),
    source: detectedLang === "en" ? "Corporate L&D Catalog" : "ਕਾਰਪੋਰੇਟ ਗਿਆਨ ਡਾਇਰੈਕਟਰੀ",
    learning: detectedLang === "en" 
      ? ["Industrial Safety Fundamentals", "General SOP Overview"]
      : ["ਸੁਰੱਖਿਆ ਦੇ ਮੂਲ ਨਿਯਮ", "ਆਮ SOP ਸਮੀਖਿਆ"],
    topics: ["LOTO Safety", "Electrical Safety", "Welding Safety"]
  };
};
