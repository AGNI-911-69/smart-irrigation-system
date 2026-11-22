# idp.pdf

pages: 17
sha256: f9b614bb355fcbc1125d4d7712ecd31c286af39a098254f6104cb117e1da0600

--- page 1 ---
Adamas University | IDP 2026–2027 | Page 1
APPLICATION OF AI IN AGRICULTURE
AI-POWERED SMART IRRIGATION SYSTEM
Project Report of Inter Disciplinary Project
Submitted by
Sl. No. Name of Students Registration No. Roll No.
1
Agni Pratap Pramanik AU/2025/0001992 UG/04/BTCSEDS/2025/018
2
Subhra Dey AU/2025/0002547 UG/04/CSEBS/2025/011
3
Aradhya Bandyopadhyay AU/2025/0004146 UG/04/BTCSEAIML/2025/683
4
Sahana Chakraborty AU/2025/0001201 UG/04/BTCSE/2025/119
5
Shreyasee Bera AU/2025/0001096 UG/04/BTCSE/2025/104
6
Sougata Laha AU/2025/0003848 UG/04/BTCSEDS/2025/033
7
Shrabosty Roy Chowdhury AU/2025/0001034 UG/04/BTCSE/2025/095
8
Shuvam Bag AU/2025/0000164 UG/04/BTCSEAIML/2025/006
9
Pragati Khetrapal AU/2025/0004096 UG/04/BTCSEAIML/2025/679
10 Shubha Ghosh AU/2025/0003757 UG/04/CSECS/2025/595
11 Sahil Raja AU/2025/0000775 UG/04/CSECS/2025/597
12 Dipu Mazumder AU/2025/0004346 UG/04/CSECS/2025/603
13 Rafiuddin AU/2025/0004149 UG/04/BTCSEAIML/2025/684
14 Sajeeb Pal AU/2026/0003327 UG/04/BTCSEAIML/2025/711
Under the supervision of
Mr. Subhra Prokash Dutta
Project Guide
Department of Computer Science and Engineering
School of Engineering and Technology
Adamas University
P.O. Jagannathpur, District – 24 Parganas (North), Kolkata – 700126
Academic Year: 2026–2027

--- page 2 ---
Adamas University | IDP 2026–2027 | Page 2
CERTIFICATE OF RECOMMENDATION
I hereby recommend that the project report prepared under my supervision by the students listed below for the
project entitled “Application of AI in Agriculture: AI-Powered Smart Irrigation System” be accepted in
fulfillment of the requirements for the degree of Bachelor of Technology in Computer Science and
Engineering.
The project proposes a software-based system that applies artificial intelligence and machine learning concepts
to analyse crop, soil and weather-related information and provide irrigation decision support. The report
presents the proposed objectives, design approach, methodology and expected outcomes.
Sl. No. Name of the Student Signature
1
Agni Pratap Pramanik
2
Subhra Dey
3
Aradhya Bandyopadhyay
4
Sahana Chakraborty
5
Shreyasee Bera
6
Sougata Laha
7
Shrabosty Roy Chowdhury
8
Shuvam Bag
9
Pragati Khetrapal
10 Shubha Ghosh
11 Sahil Raja
12 Dipu Mazumder
13 Rafiuddin
14 Sajeeb Pal
Project Guide
Mr. Subhra Prokash Dutta
Designation: ______________________________
Department: Computer Science and Engineering
Signature: _________________________________
Date: _____________________________________

--- page 3 ---
Adamas University | IDP 2026–2027 | Page 3
CERTIFICATE
This is to certify that the project entitled “Application of AI in Agriculture: AI-Powered Smart Irrigation
System” is submitted by the following students of the Department of Computer Science and Engineering,
School of Engineering and Technology, Adamas University.
Sl. No. Name of the Student Registration Number
1
Agni Pratap Pramanik AU/2025/0001992
2
Subhra Dey AU/2025/0002547
3
Aradhya Bandyopadhyay AU/2025/0004146
4
Sahana Chakraborty AU/2025/0001201
5
Shreyasee Bera AU/2025/0001096
6
Sougata Laha AU/2025/0003848
7
Shrabosty Roy Chowdhury AU/2025/0001034
8
Shuvam Bag AU/2025/0000164
9
Pragati Khetrapal AU/2025/0004096
10 Shubha Ghosh AU/2025/0003757
11 Sahil Raja AU/2025/0000775
12 Dipu Mazumder AU/2025/0004346
13 Rafiuddin AU/2025/0004149
14 Sajeeb Pal AU/2026/0003327
The work described in this report has been prepared as an interdisciplinary project under the guidance of the
project mentor. The report documents the proposed design and planned development activities. Any
implementation results will be reported only after the corresponding work has been completed and verified.
Signature of the Project Guide: ______________________________
Name: Mr. Subhra Prokash Dutta
Date: ____________________
Signatures of Students:
Agni Pratap Pramanik: __________________________________________
Subhra Dey: __________________________________________
Aradhya Bandyopadhyay: __________________________________________
Sahana Chakraborty: __________________________________________
Shreyasee Bera: __________________________________________
Sougata Laha: __________________________________________
Shrabosty Roy Chowdhury: __________________________________________
Shuvam Bag: __________________________________________
Pragati Khetrapal: __________________________________________
Shubha Ghosh: __________________________________________

--- page 4 ---
Adamas University | IDP 2026–2027 | Page 4
Sahil Raja: __________________________________________
Dipu Mazumder: __________________________________________
Rafiuddin: __________________________________________
Sajeeb Pal: __________________________________________

--- page 5 ---
Adamas University | IDP 2026–2027 | Page 5
ADAMAS UNIVERSITY
CERTIFICATE OF APPROVAL
This project report entitled “Application of AI in Agriculture: AI-Powered Smart Irrigation System” is
submitted by the students of the Department of Computer Science and Engineering, School of Engineering and
Technology, Adamas University.
The report presents a proposed software-based approach to agricultural irrigation decision support using
artificial intelligence and machine learning. It has been prepared in the prescribed institutional report format
for academic evaluation.
This approval signifies that the report has been reviewed for the purpose of academic submission. It does not
necessarily imply endorsement of every statement, opinion or proposed design detail, nor does it certify that all
proposed features have been implemented or experimentally validated.
Project Guide: ________________________________
Internal Examiner: _____________________________
External Examiner: _____________________________
Date: ________________________________________
Place: Adamas University, Kolkata
FINAL EVALUATION OF PROJECT REPORT
Marks / Grade: ______________________________________________
Remarks: ___________________________________________________

--- page 6 ---
Adamas University | IDP 2026–2027 | Page 6
ACKNOWLEDGMENT
We express our sincere gratitude to Adamas University and the School of Engineering and Technology for
providing us with the opportunity and academic environment to undertake this Interdisciplinary Project.
We are thankful to our project mentor, Mr. Subhra Prokash Dutta, for his guidance, encouragement and
valuable suggestions during the planning of this project. His direction has helped us understand the relevance
of applying artificial intelligence to practical agricultural challenges, particularly the efficient use of water for
irrigation.
We also acknowledge the support of the Department of Computer Science and Engineering, our faculty
members and classmates for their cooperation and feedback. Their support has helped us shape the project idea
and identify the key functional requirements of the proposed system.
Finally, we thank our families and everyone who has encouraged us throughout this academic work. We
understand that the proposed system will require further development, testing and validation, and we are
grateful for the opportunity to learn through this process.
The Project Team
Department of Computer Science and Engineering
Adamas University
Academic Year 2026–2027

--- page 7 ---
Adamas University | IDP 2026–2027 | Page 7
TABLE OF CONTENTS
Sl. No. Topic Page No.
1 Introduction 7
2 Related Work 8
3 Methodology 9
4 Result Analysis 10
5 Discussion 11
6 Conclusion 12
7 Future Work / Recommendations 13
8 References 14
9 Appendices 15
List of Abbreviations
AI – Artificial Intelligence
ML – Machine Learning
UI – User Interface
API – Application Programming Interface
ET – Evapotranspiration
IoT – Internet of Things
KPI – Key Performance Indicator

--- page 8 ---
Adamas University | IDP 2026–2027 | Page 8
1. INTRODUCTION
1.1 Background
Agriculture depends on timely and adequate water availability. Irrigation that is insufficient can affect plant
growth, while excessive or poorly timed irrigation can waste water, increase operating costs and contribute to
waterlogging or nutrient loss. Irrigation decisions are influenced by several factors, including crop type and
growth stage, soil characteristics, recent rainfall, temperature, humidity and local weather forecasts.
Artificial intelligence (AI) and machine learning (ML) can support agricultural decision-making by identifying
patterns in data and estimating conditions that are difficult to assess consistently through manual observation
alone. A software-based decision-support tool can combine information about crops, soil and weather to
provide understandable irrigation guidance. Such a tool is intended to assist farmers; it does not replace local
agricultural expertise or field verification.
1.2 Problem Statement
In many farming situations, irrigation decisions are made using fixed schedules, personal experience or
occasional field inspection. These approaches may not respond quickly to changing weather or differences
between crops and fields. Farmers may therefore irrigate when it is not necessary or delay irrigation when
crops require water. The project addresses the need for an accessible digital system that organises relevant
information and generates timely, crop-aware irrigation recommendations.
1.3 Aim
The aim is to design a software-based AI-powered smart irrigation system that analyses available soil and
weather information, considers the selected crop, and presents irrigation recommendations through a farmer￾friendly web dashboard.
1.4 Objectives
• Develop a web-based interface through which farmers can register, log in and access a dashboard.
• Allow farmers to select a crop so that recommendations can account for crop-specific requirements.
• Use location-related weather information as an input to irrigation decision support.
• Define an AI/ML-based analysis approach for relevant soil, crop and weather variables.
• Present clear recommendations about whether irrigation is required, when it may be required and an
estimated water requirement, subject to model capability and data availability.
• Provide an administrative interface for managing farmer accounts and relevant system information.
• Plan visual summaries of weather, soil information and irrigation history.
1.5 Scope
The current scope is a proposed software prototype. Physical sensors, automated pumps and direct field
actuation are not part of the confirmed scope. The system will depend on available data sources and user￾provided or externally obtained information. The exact technology stack, dataset, model type and deployment
platform are yet to be finalised.

--- page 9 ---
Adamas University | IDP 2026–2027 | Page 9
2. RELATED WORK
Research in precision agriculture has explored the use of sensing, data analysis, remote observation and
decision-support tools to improve farm management. Irrigation scheduling is a particularly important
application because water demand varies with crop type, soil properties, weather and growth stage.
2.1 Irrigation Scheduling and Crop Water Requirement
The Food and Agriculture Organization (FAO) provides widely used guidance for estimating crop water
requirements. The FAO-56 approach describes reference evapotranspiration and crop coefficients as a basis for
estimating crop evapotranspiration. This framework demonstrates why irrigation planning should consider
weather conditions and crop characteristics rather than relying only on a fixed calendar.
2.2 Machine Learning in Agriculture
Machine learning methods can learn relationships from historical or labelled data and use those relationships
to estimate outcomes for new observations. In agriculture, potential applications include crop monitoring, yield
estimation, disease identification and irrigation decision support. The quality of such systems depends on
representative data, appropriate input variables, validation and careful interpretation of model outputs.
2.3 Decision Support and Digital Agriculture
Digital agriculture systems commonly combine data collection, processing, visualisation and
recommendations. A farmer-facing dashboard can make complex information easier to interpret by displaying
current conditions, trends and suggested actions. For a practical system, the interface should communicate
uncertainty, show the time and source of data, and avoid presenting estimates as guaranteed outcomes.
2.4 Research Gap and Project Motivation
The proposed project is motivated by the need for a simple, integrated software interface that brings crop
selection, location-based weather information and irrigation guidance together. The project will focus on a
manageable student prototype and will not claim to solve every challenge in precision agriculture. Its
contribution is the planned integration of accessible information and an AI/ML-oriented recommendation
workflow in a single dashboard.
2.5 Summary
The reviewed concepts support the project’s direction: crop water demand is affected by weather and crop
characteristics; data-driven methods may assist prediction; and clear visualisation is important for farmer
adoption. The final model and dataset must be selected and evaluated during implementation.

--- page 10 ---
Adamas University | IDP 2026–2027 | Page 10
3. METHODOLOGY
3.1 Proposed System Overview
The proposed system is a web-based decision-support application. A farmer creates an account, selects a crop
and provides or confirms the relevant location. The application obtains available weather information and uses
soil-related inputs, where available, together with crop information to generate an irrigation recommendation.
Results are displayed on the farmer dashboard. An administrator can manage user and reference information.
3.2 Proposed Workflow
Stage Description
1. User access Farmer registration and login.
2. Farm context Select crop and provide the location associated with the field.
3. Data acquisition Retrieve available weather information and obtain soil-related
inputs from an agreed data source.
4. Data preparation Check missing values, units, ranges and timestamps; prepare
model inputs.
5. AI/ML analysis Apply a selected rule-based baseline and/or trained ML model,
depending on data availability and project implementation.
6. Recommendation Estimate irrigation need and present timing guidance and a
water-quantity estimate only where sufficient inputs support it.
7. Dashboard Display the recommendation, relevant conditions, charts and
available irrigation history.
3.3 Data Inputs
• Crop information: selected crop and, if available, growth stage.
• Weather information: temperature, humidity, rainfall and forecast data, depending on the selected source.
• Soil information: soil moisture or other relevant soil properties, only when reliable values are available.
• Historical information: past recommendations or irrigation records, if collected during development.
3.4 Model Development Approach
The specific algorithm has not yet been selected. During development, the team should first establish a
transparent baseline using agronomic thresholds or a documented water-balance approach. If a suitable
labelled dataset is available, candidate machine-learning models can then be trained and compared. A model
should not be described as trained or accurate until the training, validation and testing process has actually
been completed.
3.5 Software Modules
• Authentication module: farmer registration and login.
• Farmer dashboard: summary of field context, weather and recommendations.
• Crop selection module: selection of the crop being managed.
• Weather module: location-based weather retrieval, subject to API and connectivity availability.
• Recommendation module: processing of available inputs and presentation of irrigation guidance.
• Admin module: management of farmer accounts and system reference data.
• Analytics module: charts for available weather, soil and irrigation-history records.
3.6 Technology Status
The programming language, framework, database, weather API, hosting platform and ML library are not
finalised at the report preparation stage. These choices will be made after reviewing team skills, development
time, data availability and deployment requirements.

--- page 11 ---
Adamas University | IDP 2026–2027 | Page 11

--- page 12 ---
Adamas University | IDP 2026–2027 | Page 12
4. RESULT ANALYSIS
At the time of preparing this report, the project is in the planning and design stage. A working application,
trained model and measured performance results have not yet been produced. Therefore, this section records
the expected outputs and the evaluation plan rather than claiming experimental findings.
4.1 Expected System Outputs
• A farmer account interface with registration and login screens.
• A dashboard showing the selected crop and available location-based weather information.
• A structured view of available soil and weather inputs.
• An irrigation status message indicating whether irrigation is recommended, when supported by the input
data.
• An estimated water requirement only if the selected calculation or model has sufficient crop, soil and field
information.
• Charts showing trends from data actually collected or retrieved by the application.
• An administrative interface for managing user and reference information.
4.2 Proposed Evaluation Criteria
Evaluation Area What will be checked Evidence to record
Functional testing Whether each implemented module works as
intended. Test cases and pass/fail results.
Data quality Missing, invalid, stale or inconsistent inputs. Data checks and error logs.
Model evaluation Prediction performance on held-out data, if an
ML model is trained.
Appropriate metrics, baseline comparison and
test split.
Usability Whether farmers can understand the screens
and recommendations. Feedback from a small user review.
Reliability Handling of API failure, unavailable data and
invalid entries. Observed error-handling behaviour.
4.3 Model Metrics (If Applicable)
The final metric depends on the prediction task. For a regression model that estimates water quantity, suitable
measures may include mean absolute error (MAE) and root mean squared error (RMSE). For a classification
model that predicts irrigation need, precision, recall, F1-score and a confusion matrix may be appropriate.
Metrics must be calculated from a clearly separated test set and reported with the dataset and target definition.
4.4 Expected Benefits
The expected benefit is improved organisation of irrigation-related information and more consistent decision
support. Actual water savings, yield improvement or cost reduction cannot be claimed until field-relevant
testing has been conducted.

--- page 13 ---
Adamas University | IDP 2026–2027 | Page 13
5. DISCUSSION
5.1 Significance
The project addresses a practical agricultural problem: irrigation decisions need to respond to changing crop
and environmental conditions. A software dashboard can make relevant information more accessible and help
users consider several factors together. The project also provides an opportunity to apply computer science
concepts such as data acquisition, preprocessing, model development, database design, user-interface
development and software testing.
5.2 Key Design Considerations
• Data availability: recommendations are only as useful as the quality and relevance of the input data.
• Local relevance: weather and soil conditions vary by location, season and field; a general model may not
transfer reliably to every region.
• Crop specificity: crop water needs differ, and growth stage can materially affect irrigation demand.
• Explainability: users should be able to see which inputs influenced a recommendation.
• Connectivity: rural internet access may be intermittent, so the application should handle unavailable
services gracefully.
• Language and usability: simple wording and clear units are important for accessibility.
• Privacy: account details and location-related information should be collected only as needed and handled
responsibly.
5.3 Limitations
The current proposal does not include confirmed sensor hardware or automatic pump control. The soil-data
collection method has not been finalised. The technology stack, dataset and ML algorithm are also undecided.
Without reliable field-level soil and crop data, the system may only provide indicative guidance rather than
precise irrigation quantities. Weather APIs may have coverage, rate-limit or connectivity constraints.
5.4 Risk Mitigation
• Start with a small, clearly defined prototype and a limited number of crops.
• Use a transparent baseline before introducing a complex ML model.
• Validate input ranges, units and timestamps before generating outputs.
• Show data freshness and indicate when information is missing.
• Label outputs as estimates and advise users to consider local conditions.
• Keep a record of test cases, model versions and evaluation results.
5.5 Discussion Summary
The proposed system is feasible as a student software prototype if its scope is controlled. Its technical
credibility will depend on transparent data sources, realistic claims, suitable validation and a user interface that
communicates the limits of its recommendations.

--- page 14 ---
Adamas University | IDP 2026–2027 | Page 14
6. CONCLUSION
This report presents the proposal for an AI-powered Smart Irrigation System under the broader theme
“Application of AI in Agriculture.” The proposed solution is a software-based web application intended to
support farmers by bringing crop selection, location-based weather information, soil-related data and irrigation
guidance into one interface.
The planned system includes farmer registration and login, a farmer dashboard, crop selection, weather
information, an irrigation recommendation interface, an administrative dashboard and data visualisation. The
intended AI/ML component will analyse relevant inputs to support decisions about whether irrigation may be
required, when it may be appropriate and, where sufficient information exists, an estimated water requirement.
The project is currently at the planning stage. The programming technologies, dataset, model and
implementation details remain to be finalised. Consequently, no measured accuracy, water savings or crop￾yield improvement is claimed in this report. These outcomes must be assessed after development and testing.
The project has helped define a practical application of AI in agriculture and a structured development path.
The next phase should focus on selecting reliable data sources, building a minimum viable application,
validating the recommendation logic and evaluating usability. With careful implementation and field-relevant
validation, the system may become a useful decision-support prototype for more informed irrigation planning.
Key Learning Outcomes
• Understanding how agricultural decisions can be supported by data-driven software.
• Identifying the importance of crop, soil and weather variables in irrigation planning.
• Recognising the need for data quality, model validation and responsible presentation of predictions.
• Planning an integrated web application with user, admin, analytics and recommendation modules.
• Learning to distinguish a proposed feature from a feature that has been implemented and tested.

--- page 15 ---
Adamas University | IDP 2026–2027 | Page 15
7. FUTURE WORK / RECOMMENDATIONS
The following activities are recommended for the next development phase. They are proposed enhancements
and should be treated as future work until completed.
7.1 Finalise Requirements
Confirm the target users, initial crop set, geographical scope, data-entry process and minimum viable feature
set. Define exactly what the system will recommend and what information it requires.
7.2 Select Data Sources
Identify a reliable weather data provider and an appropriate agricultural or soil dataset. Record source, licence,
geographic coverage, update frequency, units and missing-data limitations.
7.3 Choose the Technology Stack
Select the frontend, backend, database, model-development environment and hosting platform based on team
skills and time constraints. Keep the initial architecture simple.
7.4 Develop a Baseline Recommendation Method
Implement a transparent agronomic or rule-based baseline. Document assumptions and avoid producing
precise water quantities unless field area, crop requirements and relevant conditions are available.
7.5 Train and Validate an ML Model
If a suitable dataset is available, define the prediction target, split data into training, validation and test sets,
compare candidate models and report suitable metrics. Avoid data leakage.
7.6 Improve Farmer Usability
Use plain language, clear units, responsive design and accessible visualisations. Consider local-language
support and guidance explaining why a recommendation is shown.
7.7 Add Optional Manual Soil Entry
Evaluate whether farmers should be allowed to enter soil observations manually when sensor data is
unavailable. If included, label user-entered values and validate them.
7.8 Evaluate in Real Conditions
Conduct controlled testing and, where feasible, compare recommendations with expert guidance or observed
field conditions. Measure usability and any water-use impact before making benefit claims.
7.9 Extend the System
Possible later extensions include sensor integration, crop growth-stage awareness, notifications, multilingual
support, offline-friendly operation and automated irrigation control, subject to safety and hardware validation.

--- page 16 ---
Adamas University | IDP 2026–2027 | Page 16
8. REFERENCES
1. Allen, Richard G., Luis S. Pereira, Dirk Raes, and Martin Smith. Crop Evapotranspiration: Guidelines for
Computing Crop Water Requirements. FAO Irrigation and Drainage Paper 56. Rome: Food and
Agriculture Organization of the United Nations, 1998.
2. Food and Agriculture Organization of the United Nations. “AQUASTAT – FAO’s Global Information
System on Water and Agriculture.” Accessed November 22, 2026. https://www.fao.org/aquastat/.
3. Liakos, Konstantinos G., Patrizia Busato, Dimitrios Moshou, Simon Pearson, and Dionysis Bochtis.
“Machine Learning in Agriculture: A Review.” Sensors 18, no. 8 (2018): 2674.
https://doi.org/10.3390/s18082674.
4. Kamilaris, Andreas, and Francesc X. Prenafeta-Boldú. “Deep Learning in Agriculture: A Survey.”
Computers and Electronics in Agriculture 147 (2018): 70–90.
https://doi.org/10.1016/j.compag.2018.02.016.
5. Jägermeyr, Jonas, et al. “Water Savings Potentials of Irrigation Systems: Global Simulation of Processes
and Linkages.” Hydrology and Earth System Sciences 19 (2015): 3073–3091.
https://doi.org/10.5194/hess-19-3073-2015.
6. World Bank. “What Is Climate-Smart Agriculture?” Accessed November 22, 2026.
https://www.worldbank.org/en/topic/climate-smart-agriculture.
Note: These references provide background on crop water requirements, water management and machine
learning in agriculture. The team should verify the final bibliographic details and add any datasets, APIs,
software documentation or papers actually used during implementation. References should be updated to
reflect sources consulted in the completed project.

--- page 17 ---
Adamas University | IDP 2026–2027 | Page 17
9. APPENDICES
Appendix A: Proposed High-Level System Flow
Farmer opens the web application
↓
Farmer registers or logs in
↓
Farmer selects crop and field location
↓
System retrieves available weather information
↓
System receives available soil-related inputs
↓
Input validation and preprocessing
↓
AI/ML or baseline decision logic analyses the inputs
↓
Dashboard displays irrigation guidance and supporting information
Appendix B: Proposed Functional Modules
Module Purpose Status at report preparation
Authentication Farmer registration and login Planned
Farmer dashboard Display crop, weather and recommendations Planned
Crop selection Choose crop type Planned
Weather information Show location-based weather data Planned
Recommendation Provide irrigation decision support Planned
Admin dashboard Manage accounts and reference data Planned
Analytics Visualise available historical information Planned
Appendix C: Information to Be Finalised During Development
• Final technology stack and architecture.
• Weather API and its terms of use.
• Soil and crop dataset, source and licence.
• Machine-learning target, algorithm and evaluation method.
• Method for obtaining soil data (manual input, public dataset or future sensor integration).
• Final screenshots, test cases, model results and user feedback.
• Guide designation and any institutional identifiers required for final submission.
Appendix D: Submission Note
This report is a planning-stage project report. Before final submission, the team should replace or supplement
planned descriptions with evidence from the actual implementation, insert genuine screenshots and test results
where available, confirm all student names and institutional details, and obtain the required signatures.
