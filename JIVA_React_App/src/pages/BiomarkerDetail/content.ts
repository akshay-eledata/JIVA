// Educational content per biomarker. The patient's actual value / status /
// range is dynamic (from the API); this file holds only the static
// "what it is / why it matters" copy, covering the full JIVA catalog.
//
// Entries are defined by readable name(s); the lookup key is normalized
// automatically, so aliases just work. Biomarkers without an entry fall back
// to a generic template on the page.

export interface BiomarkerContent {
    aka?: string;
    whatItIs: string;
    whyItMatters: string;
    lowMeans?: string;
    highMeans?: string;
    tips?: string;
}

export const normalizeKey = (name: string): string =>
    (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

const ENTRIES: { names: string[]; content: BiomarkerContent }[] = [
    // ─────────────────────────── Blood ───────────────────────────
    {
        names: ['WBC', 'White blood cells'],
        content: {
            aka: 'White Blood Cell count, Leukocytes',
            whatItIs: 'White blood cells are your immune system’s first responders. This count measures how many are circulating in a set volume of blood.',
            whyItMatters: 'The total tracks how actively your body is fighting infection or dealing with inflammation, and helps flag immune or bone-marrow problems.',
            lowMeans: 'A low count can follow a viral infection, certain medications, autoimmune conditions, or reduced marrow production, and can leave you more prone to infection.',
            highMeans: 'A high count usually reflects an active infection, inflammation, physical stress, or smoking; markedly high values warrant prompt review.',
            tips: 'Persistent abnormal counts should be interpreted alongside the differential (neutrophils, lymphocytes) and repeated to confirm the trend.',
        },
    },
    {
        names: ['RBC', 'Red blood cells'],
        content: {
            aka: 'Red Blood Cell count',
            whatItIs: 'Red blood cells carry oxygen using the hemoglobin inside them. This count measures how many are present per volume of blood.',
            whyItMatters: 'Together with hemoglobin and hematocrit it defines your oxygen-carrying capacity and helps classify anemia.',
            lowMeans: 'A low count points toward anemia from iron/B12/folate deficiency, blood loss, or reduced production.',
            highMeans: 'A high count can come from dehydration, altitude, smoking, or over-production of red cells.',
            tips: 'Interpret with MCV, hemoglobin and iron studies to find the underlying cause.',
        },
    },
    {
        names: ['Hemoglobin', 'Hgb', 'Hb'],
        content: {
            aka: 'Hgb, Hb',
            whatItIs: 'Hemoglobin is the iron-rich protein packed inside your red blood cells. It binds oxygen in your lungs and carries it to every tissue in the body, then ferries carbon dioxide back to be exhaled.',
            whyItMatters: 'Hemoglobin is the single best measure of your blood’s oxygen-carrying capacity. It is the primary test used to screen for anemia (too little) and, less often, polycythemia (too much), and it puts everyday symptoms like fatigue, breathlessness, or dizziness into context.',
            lowMeans: 'A low hemoglobin means your blood is carrying less oxygen than ideal — the definition of anemia. Common causes include iron, vitamin B12, or folate deficiency, blood loss (including heavy periods), chronic inflammation, or reduced production. It often shows up as tiredness, pale skin, cold hands, headaches, or shortness of breath with exertion.',
            highMeans: 'A high hemoglobin most often reflects dehydration (concentrated blood), living at high altitude, smoking, or sleep apnea. Less commonly it signals a bone-marrow condition that over-produces red cells.',
            tips: 'For low readings, prioritise iron-rich foods (lean red meat, lentils, spinach, pumpkin seeds) paired with vitamin C to boost absorption, and ensure enough B12 and folate. Staying well hydrated keeps readings accurate. Re-test after any change to confirm the trend.',
        },
    },
    {
        names: ['Hematocrit', 'HCT'],
        content: {
            aka: 'HCT, packed cell volume',
            whatItIs: 'Hematocrit is the percentage of your blood volume made up of red blood cells.',
            whyItMatters: 'It mirrors hemoglobin as a measure of oxygen-carrying capacity and hydration status.',
            lowMeans: 'A low hematocrit accompanies anemia or over-hydration.',
            highMeans: 'A high hematocrit suggests dehydration or increased red-cell production (altitude, smoking, marrow conditions).',
            tips: 'Read alongside hemoglobin and RBC; hydration can shift it up or down.',
        },
    },
    {
        names: ['MCV'],
        content: {
            aka: 'Mean Corpuscular Volume',
            whatItIs: 'MCV is the average size of your red blood cells.',
            whyItMatters: 'Cell size helps pinpoint the cause of anemia: small cells suggest iron deficiency, large cells suggest B12/folate deficiency.',
            lowMeans: 'Low (microcytic) cells most often mean iron deficiency or thalassemia.',
            highMeans: 'High (macrocytic) cells point to B12 or folate deficiency, alcohol use, or thyroid issues.',
            tips: 'Use it with iron studies, B12 and folate to guide the work-up.',
        },
    },
    {
        names: ['MCH'],
        content: {
            aka: 'Mean Corpuscular Hemoglobin',
            whatItIs: 'MCH is the average amount of hemoglobin inside each red blood cell.',
            whyItMatters: 'It supports MCV in classifying anemia by how much oxygen-carrying pigment each cell holds.',
            lowMeans: 'Low MCH typically accompanies iron-deficiency anemia (pale cells).',
            highMeans: 'High MCH is seen with B12/folate deficiency and macrocytic anemias.',
            tips: 'Interpreted together with MCV and MCHC, not in isolation.',
        },
    },
    {
        names: ['MCHC'],
        content: {
            aka: 'Mean Corpuscular Hemoglobin Concentration',
            whatItIs: 'MCHC is the concentration of hemoglobin within a given volume of red cells.',
            whyItMatters: 'It flags whether red cells are normally coloured, pale, or over-concentrated.',
            lowMeans: 'Low MCHC (hypochromia) is common in iron deficiency.',
            highMeans: 'High MCHC is uncommon and can indicate hereditary spherocytosis or a lab artefact.',
            tips: 'A supporting index — use with the rest of the CBC.',
        },
    },
    {
        names: ['RDW'],
        content: {
            aka: 'Red cell Distribution Width',
            whatItIs: 'RDW measures how much your red blood cells vary in size.',
            whyItMatters: 'A wide spread is an early clue to mixed or evolving anemias.',
            highMeans: 'High RDW suggests a mix of cell sizes — often early iron, B12, or folate deficiency.',
            tips: 'Rising RDW with a changing MCV helps distinguish nutritional anemias.',
        },
    },
    {
        names: ['Platelets'],
        content: {
            aka: 'Thrombocytes',
            whatItIs: 'Platelets are cell fragments that clump together to stop bleeding and form clots.',
            whyItMatters: 'They balance bleeding and clotting risk and reflect marrow production and inflammation.',
            lowMeans: 'Low platelets (thrombocytopenia) can raise bleeding/bruising risk — from immune causes, medications, infections, or marrow issues.',
            highMeans: 'High platelets can be reactive (inflammation, iron deficiency) or, less often, a marrow disorder.',
            tips: 'Extreme values in either direction need medical review.',
        },
    },
    {
        names: ['Neutrophils'],
        content: {
            whatItIs: 'Neutrophils are the most common white blood cell and the front line against bacterial infection.',
            whyItMatters: 'Their share of white cells helps distinguish bacterial infection and inflammation from other causes.',
            lowMeans: 'Low neutrophils increase infection risk and can follow viral illness, medications, or marrow suppression.',
            highMeans: 'High neutrophils typically mean acute bacterial infection, inflammation, or physical stress.',
            tips: 'Read as part of the white-cell differential.',
        },
    },
    {
        names: ['Lymphocytes'],
        content: {
            whatItIs: 'Lymphocytes are white cells that drive your adaptive immune response and antibody production.',
            whyItMatters: 'They shift with viral infections and immune conditions.',
            lowMeans: 'Low lymphocytes can follow steroids, infection, or immune suppression.',
            highMeans: 'High lymphocytes often reflect a viral infection or, rarely, a lymphoid condition.',
            tips: 'Interpret with the full differential and clinical picture.',
        },
    },
    {
        names: ['Monocytes'],
        content: {
            whatItIs: 'Monocytes are white cells that clear debris and mature into tissue macrophages.',
            whyItMatters: 'They rise in chronic infection, inflammation, and recovery phases.',
            highMeans: 'Elevated monocytes accompany chronic infections, inflammation, or recovery from illness.',
            tips: 'A supporting differential value.',
        },
    },
    {
        names: ['Eosinophils'],
        content: {
            whatItIs: 'Eosinophils are white cells involved in allergy and parasite defence.',
            whyItMatters: 'They flag allergic and parasitic conditions.',
            highMeans: 'High eosinophils suggest allergies, asthma, drug reactions, or parasitic infection.',
            tips: 'Correlate with allergy or exposure history.',
        },
    },
    {
        names: ['Basophils'],
        content: {
            whatItIs: 'Basophils are the rarest white cells and release histamine in allergic and inflammatory reactions.',
            whyItMatters: 'Persistently high levels can occasionally signal marrow conditions.',
            highMeans: 'Elevated basophils can occur with allergy, inflammation, or (rarely) marrow disorders.',
            tips: 'Rarely abnormal in isolation.',
        },
    },
    {
        names: ['Ferritin'],
        content: {
            whatItIs: 'Ferritin is the protein that stores iron, so blood ferritin reflects your total iron reserves.',
            whyItMatters: 'It is the best single marker of iron stores and an early warning for deficiency before anemia appears.',
            lowMeans: 'Low ferritin means depleted iron stores — the earliest sign of iron deficiency, often from diet, blood loss, or heavy periods.',
            highMeans: 'High ferritin can reflect iron overload, but also rises with inflammation, infection, or liver stress even when iron is normal.',
            tips: 'Pair iron-rich foods with vitamin C; investigate the source if low, and check inflammation before assuming overload if high.',
        },
    },
    {
        names: ['Serum iron'],
        content: {
            whatItIs: 'Serum iron measures the iron currently circulating bound to transport proteins.',
            whyItMatters: 'It contributes to the iron-studies picture used to diagnose deficiency or overload.',
            lowMeans: 'Low serum iron supports iron-deficiency (especially with low ferritin and high TIBC).',
            highMeans: 'High serum iron can indicate overload or excessive supplementation.',
            tips: 'Interpret with ferritin, TIBC and transferrin saturation, not alone (it fluctuates through the day).',
        },
    },
    {
        names: ['TIBC'],
        content: {
            aka: 'Total Iron-Binding Capacity',
            whatItIs: 'TIBC reflects how much iron your blood’s transport proteins could carry — essentially the number of empty iron "seats".',
            whyItMatters: 'It rises when iron is scarce and falls when iron is plentiful, helping classify iron disorders.',
            highMeans: 'High TIBC suggests iron deficiency (the body makes more transport to grab scarce iron).',
            lowMeans: 'Low TIBC can accompany iron overload, inflammation, or malnutrition.',
            tips: 'Best read together with serum iron and ferritin.',
        },
    },
    {
        names: ['Transferrin saturation'],
        content: {
            whatItIs: 'Transferrin saturation is the percentage of iron-transport capacity that is actually filled with iron.',
            whyItMatters: 'It shows how well-supplied your iron transport is and is key to spotting overload.',
            lowMeans: 'Low saturation indicates iron deficiency.',
            highMeans: 'High saturation (often >45%) can be an early sign of iron overload/hemochromatosis.',
            tips: 'A high result warrants further iron-overload work-up.',
        },
    },

    // ─────────────────────────── Metabolic ───────────────────────────
    {
        names: ['Fasting glucose', 'Glucose (Fasting)'],
        content: {
            aka: 'Fasting blood sugar',
            whatItIs: 'Fasting glucose is your blood sugar after not eating for several hours.',
            whyItMatters: 'It is a core screen for pre-diabetes and diabetes and reflects how well your body manages sugar at rest.',
            highMeans: 'Values of 100–125 mg/dL indicate pre-diabetes and ≥126 (confirmed) diabetes, reflecting insulin resistance or insufficient insulin.',
            lowMeans: 'Low glucose can cause shakiness or lightheadedness and may follow fasting, medications, or (rarely) hormonal issues.',
            tips: 'Fibre-rich meals, movement after eating, and weight management improve fasting glucose; confirm elevated values with HbA1c.',
        },
    },
    {
        names: ['Glycated Hemoglobin (HbA1c)', 'HbA1c'],
        content: {
            aka: 'HbA1c, A1c',
            whatItIs: 'HbA1c is the fraction of your hemoglobin coated in sugar, reflecting your average blood sugar over the past 2–3 months.',
            whyItMatters: 'Because it averages months of readings, it is the gold-standard marker for diagnosing and monitoring pre-diabetes and diabetes.',
            highMeans: '5.7–6.4% signals pre-diabetes and ≥6.5% diabetes; the higher it is, the greater the long-term risk to eyes, nerves, kidneys and heart.',
            tips: 'Reducing refined carbs and added sugar, regular activity, and weight loss lower HbA1c over months; re-test at roughly 3-month intervals.',
        },
    },
    {
        names: ['Uric acid'],
        content: {
            whatItIs: 'Uric acid is a waste product from breaking down purines (found in some foods and body tissues).',
            whyItMatters: 'High levels can crystallise in joints (gout) and are linked to metabolic and kidney risk.',
            highMeans: 'High uric acid raises the risk of gout attacks and kidney stones and often clusters with insulin resistance.',
            lowMeans: 'Low uric acid is usually harmless.',
            tips: 'Limit alcohol (especially beer), sugary drinks and high-purine foods; stay hydrated and manage weight.',
        },
    },
    {
        names: ['Fasting insulin'],
        content: {
            whatItIs: 'Fasting insulin is the amount of insulin your pancreas is producing at rest.',
            whyItMatters: 'It reveals insulin resistance years before glucose rises — a high value means your body needs extra insulin to keep sugar normal.',
            highMeans: 'High fasting insulin indicates insulin resistance, a driver of weight gain, pre-diabetes, PCOS and cardiovascular risk.',
            lowMeans: 'Low insulin with high glucose can indicate reduced insulin production and needs medical review.',
            tips: 'Strength training, reduced refined carbs, and weight loss are the most effective ways to lower it.',
        },
    },

    // ─────────────────────────── Heart ───────────────────────────
    {
        names: ['Total cholesterol'],
        content: {
            whatItIs: 'Total cholesterol sums all the cholesterol carried in your blood (LDL, HDL and part of triglycerides).',
            whyItMatters: 'It is a quick snapshot of cardiovascular risk, though the LDL/HDL breakdown matters more.',
            highMeans: 'High total cholesterol can raise heart-disease risk, but always interpret it with HDL, LDL and triglycerides.',
            tips: 'Focus on the sub-fractions; fibre, healthy fats and activity improve the overall profile.',
        },
    },
    {
        names: ['LDL cholesterol (calculated)', 'LDL Cholesterol', 'LDL cholesterol'],
        content: {
            aka: '“bad” cholesterol',
            whatItIs: 'LDL carries cholesterol from the liver to tissues; excess can deposit in artery walls.',
            whyItMatters: 'LDL is a primary, causal driver of atherosclerosis — lowering it lowers heart-attack and stroke risk.',
            highMeans: 'High LDL means more cholesterol available to build plaque in your arteries over time.',
            tips: 'Soluble fibre (oats, legumes, psyllium), less saturated/trans fat, activity, and weight loss lower LDL; some people need medication.',
        },
    },
    {
        names: ['HDL cholesterol', 'HDL Cholesterol'],
        content: {
            aka: '“good” cholesterol',
            whatItIs: 'HDL ferries excess cholesterol back to the liver for disposal.',
            whyItMatters: 'Higher HDL is generally protective against heart disease.',
            lowMeans: 'Low HDL — common with insulin resistance and inactivity — reduces this protective clean-up.',
            tips: 'Aerobic exercise, olive oil, nuts, oily fish and quitting smoking raise HDL.',
        },
    },
    {
        names: ['Triglycerides'],
        content: {
            whatItIs: 'Triglycerides are the main fat circulating in your blood, used for energy.',
            whyItMatters: 'High levels track with insulin resistance and add to cardiovascular risk, especially alongside low HDL.',
            highMeans: 'High triglycerides usually reflect excess sugar/refined carbs, alcohol, or insulin resistance; very high levels can inflame the pancreas.',
            tips: 'Cut sugary drinks, refined carbs and alcohol; omega-3s and activity lower triglycerides quickly.',
        },
    },
    {
        names: ['hs-CRP'],
        content: {
            aka: 'high-sensitivity C-reactive protein',
            whatItIs: 'hs-CRP is a sensitive marker of low-grade inflammation in the body.',
            whyItMatters: 'Chronic low-level inflammation contributes to heart disease, so hs-CRP refines cardiovascular risk beyond cholesterol.',
            highMeans: 'Higher hs-CRP signals more systemic inflammation — from infection, obesity, smoking, or metabolic stress; <1 is low risk, >3 higher.',
            tips: 'Anti-inflammatory eating, activity, weight loss and not smoking lower it; a recent infection can transiently spike it.',
        },
    },
    {
        names: ['ApoB'],
        content: {
            aka: 'Apolipoprotein B',
            whatItIs: 'ApoB counts the actual number of artery-clogging particles (each LDL/VLDL carries one ApoB).',
            whyItMatters: 'It is often a better predictor of heart risk than LDL cholesterol because it counts particles, not just their cargo.',
            highMeans: 'High ApoB means many atherogenic particles are present, raising plaque-formation risk.',
            tips: 'The same steps that lower LDL lower ApoB; it is a key target when LDL and triglycerides disagree.',
        },
    },
    {
        names: ['Lp(a)', 'Lipoprotein(a)'],
        content: {
            aka: 'Lipoprotein(a)',
            whatItIs: 'Lp(a) is an LDL-like particle whose level is mostly set by your genes.',
            whyItMatters: 'High Lp(a) is an independent, inherited risk factor for heart attack, stroke and aortic valve disease.',
            highMeans: 'A high value flags elevated genetic cardiovascular risk that persists even with good cholesterol.',
            tips: 'Diet changes it little; focus on aggressively controlling all other risk factors and inform blood relatives to get tested.',
        },
    },
    {
        names: ['Direct LDL'],
        content: {
            whatItIs: 'Direct LDL measures LDL cholesterol directly rather than estimating it, useful when triglycerides are high.',
            whyItMatters: 'It gives an accurate LDL value in situations where the calculated LDL is unreliable.',
            highMeans: 'A high value carries the same plaque-building risk as calculated LDL.',
            tips: 'Managed the same way as LDL cholesterol.',
        },
    },
    {
        names: ['Small dense LDL (sdLDL)'],
        content: {
            whatItIs: 'Small dense LDL is the smaller, denser subtype of LDL that slips into artery walls more easily.',
            whyItMatters: 'These particles are more atherogenic than large, buoyant LDL, so they sharpen risk assessment.',
            highMeans: 'High sdLDL — often driven by high triglycerides and insulin resistance — signals a more dangerous lipid pattern.',
            tips: 'Lowering triglycerides (less sugar/refined carbs, more activity) shifts LDL toward the safer, larger type.',
        },
    },
    {
        names: ['LDL particle number', 'LDL-P'],
        content: {
            whatItIs: 'LDL particle number counts how many LDL particles are in your blood.',
            whyItMatters: 'Risk tracks with the number of particles; many small particles can carry "normal" cholesterol yet still be dangerous.',
            highMeans: 'A high particle count means more chances for LDL to enter artery walls, even if LDL cholesterol looks acceptable.',
            tips: 'Reducing triglycerides and insulin resistance lowers particle number; mirrors ApoB.',
        },
    },
    {
        names: ['Direct HDL'],
        content: {
            aka: '“good” cholesterol (direct)',
            whatItIs: 'Direct HDL measures protective HDL cholesterol directly.',
            whyItMatters: 'Higher HDL supports cholesterol clean-up and is generally protective.',
            lowMeans: 'Low HDL reduces protective transport of cholesterol back to the liver.',
            tips: 'Exercise, healthy fats and not smoking raise HDL.',
        },
    },
    {
        names: ['Large HDL (functional)'],
        content: {
            whatItIs: 'Large HDL is the mature HDL subfraction thought to be most effective at removing cholesterol.',
            whyItMatters: 'A healthy proportion of large HDL suggests better "reverse cholesterol transport".',
            lowMeans: 'Low large-HDL can indicate less effective cholesterol clean-up despite a normal total HDL.',
            tips: 'Aerobic exercise and omega-3s support healthier HDL subfractions.',
        },
    },
    {
        names: ['VLDL cholesterol'],
        content: {
            aka: 'Very-Low-Density Lipoprotein',
            whatItIs: 'VLDL is a triglyceride-rich particle made by the liver; it is the main carrier of triglycerides.',
            whyItMatters: 'It contributes to plaque and tracks closely with triglyceride levels.',
            highMeans: 'High VLDL usually means high triglycerides from excess sugar, refined carbs, or alcohol.',
            tips: 'Lower it the same way as triglycerides.',
        },
    },
    {
        names: ['Homocysteine'],
        content: {
            whatItIs: 'Homocysteine is an amino acid your body recycles using B vitamins (B6, B12, folate).',
            whyItMatters: 'Elevated levels are linked to cardiovascular and cognitive risk and often signal a B-vitamin/methylation issue.',
            highMeans: 'High homocysteine suggests low B6/B12/folate or impaired methylation, adding to heart and brain risk.',
            tips: 'Adequate folate, B12 and B6 (leafy greens, legumes, eggs, fish) typically lower it; optimal is under about 8.',
        },
    },
    {
        names: ['NT-proBNP'],
        content: {
            whatItIs: 'NT-proBNP is released by the heart when its walls are stretched or under strain.',
            whyItMatters: 'It is a key marker for detecting and monitoring heart failure.',
            highMeans: 'High NT-proBNP suggests the heart is working under increased pressure; levels rise with age and kidney impairment too.',
            tips: 'An elevated result warrants cardiac evaluation (echocardiogram, clinical review).',
        },
    },
    {
        names: ['TG/HDL ratio (calculated)'],
        content: {
            whatItIs: 'The TG/HDL ratio divides triglycerides by HDL cholesterol.',
            whyItMatters: 'It is a simple, powerful surrogate for insulin resistance and small-dense-LDL burden.',
            highMeans: 'A high ratio (above ~2–3) points to insulin resistance and an atherogenic lipid pattern.',
            tips: 'Lower triglycerides and raise HDL through activity and fewer refined carbs to improve it.',
        },
    },
    {
        names: ['ApoE genotype'],
        content: {
            aka: 'Apolipoprotein E genotype',
            whatItIs: 'ApoE genotype is an inherited gene variant (e2/e3/e4) that influences how you handle cholesterol and neurological risk.',
            whyItMatters: 'The e4 variant is associated with higher LDL response to saturated fat and increased Alzheimer’s risk; e2 is generally protective.',
            highMeans: 'Carrying an e4 allele suggests it is especially worth optimising diet, exercise, lipids and metabolic health.',
            tips: 'Genotype is fixed, but its risk is modifiable — prioritise cardiovascular and brain-healthy habits.',
        },
    },

    // ─────────────────────────── Liver ───────────────────────────
    {
        names: ['Albumin'],
        content: {
            whatItIs: 'Albumin is the most abundant protein your liver makes; it keeps fluid in blood vessels and carries hormones and drugs.',
            whyItMatters: 'It reflects liver synthesis, nutrition, and inflammation status.',
            lowMeans: 'Low albumin can indicate liver disease, malnutrition, inflammation, or kidney protein loss.',
            highMeans: 'High albumin usually just reflects dehydration.',
            tips: 'Adequate protein intake and treating any underlying inflammation help normalise it.',
        },
    },
    {
        names: ['Total protein'],
        content: {
            whatItIs: 'Total protein sums albumin and globulins in your blood.',
            whyItMatters: 'It gives a broad view of nutrition, liver function, and immune protein levels.',
            lowMeans: 'Low total protein can reflect malnutrition, liver or kidney issues.',
            highMeans: 'High total protein can occur with chronic inflammation or certain immune conditions.',
            tips: 'Interpreted with the albumin/globulin split.',
        },
    },
    {
        names: ['Alkaline phosphatase', 'ALP'],
        content: {
            aka: 'ALP',
            whatItIs: 'ALP is an enzyme found mainly in the liver, bile ducts and bone.',
            whyItMatters: 'It helps detect bile-flow problems and bone turnover.',
            highMeans: 'High ALP can point to blocked bile ducts, liver issues, or increased bone activity (growth, healing, bone disease).',
            tips: 'Pair with GGT to tell whether a rise is liver- or bone-related.',
        },
    },
    {
        names: ['ALT'],
        content: {
            aka: 'Alanine aminotransferase',
            whatItIs: 'ALT is an enzyme released when liver cells are stressed or damaged.',
            whyItMatters: 'It is one of the most specific markers of liver injury, including fatty liver.',
            highMeans: 'High ALT (often with an ALT>AST pattern) commonly reflects fatty liver from insulin resistance, alcohol, medications, or viral hepatitis.',
            tips: 'Weight loss, less alcohol and sugar, and treating insulin resistance usually bring ALT down.',
        },
    },
    {
        names: ['AST'],
        content: {
            aka: 'Aspartate aminotransferase',
            whatItIs: 'AST is an enzyme found in the liver and also in muscle and heart tissue.',
            whyItMatters: 'It supports ALT in assessing liver stress; the AST/ALT ratio adds context.',
            highMeans: 'High AST can reflect liver injury, but also muscle strain or intense exercise.',
            tips: 'Interpret with ALT and GGT; avoid heavy exercise just before testing.',
        },
    },
    {
        names: ['Total bilirubin'],
        content: {
            whatItIs: 'Bilirubin is a yellow pigment from the normal breakdown of old red blood cells, processed by the liver.',
            whyItMatters: 'It reflects liver processing and red-cell turnover.',
            highMeans: 'High bilirubin can cause jaundice and may indicate liver/bile issues or increased red-cell breakdown; mild elevations (Gilbert’s) are benign.',
            tips: 'Fractionate into direct/indirect to find the cause.',
        },
    },
    {
        names: ['Direct bilirubin'],
        content: {
            aka: 'Conjugated bilirubin',
            whatItIs: 'Direct bilirubin is the liver-processed form ready to be excreted in bile.',
            whyItMatters: 'A rise points specifically to liver or bile-duct problems.',
            highMeans: 'High direct bilirubin suggests impaired bile flow or liver cell dysfunction.',
            tips: 'Evaluate with ALP, GGT and imaging if persistently high.',
        },
    },
    {
        names: ['Indirect bilirubin'],
        content: {
            aka: 'Unconjugated bilirubin',
            whatItIs: 'Indirect bilirubin is the form not yet processed by the liver.',
            whyItMatters: 'It rises with increased red-cell breakdown or benign genetic variants.',
            highMeans: 'High indirect bilirubin suggests faster red-cell turnover (hemolysis) or Gilbert’s syndrome, which is harmless.',
            tips: 'Correlate with hemoglobin and reticulocytes if hemolysis is suspected.',
        },
    },
    {
        names: ['GGT'],
        content: {
            aka: 'Gamma-glutamyl transferase',
            whatItIs: 'GGT is a liver/bile-duct enzyme sensitive to alcohol and bile-flow problems.',
            whyItMatters: 'It confirms whether a high ALP is liver-related and flags alcohol or fatty-liver stress.',
            highMeans: 'High GGT points to bile-duct issues, alcohol intake, medications, or fatty liver.',
            tips: 'Reducing alcohol usually lowers GGT within weeks.',
        },
    },
    {
        names: ['LDH'],
        content: {
            aka: 'Lactate dehydrogenase',
            whatItIs: 'LDH is an enzyme present in nearly every tissue, released when cells are damaged.',
            whyItMatters: 'It is a broad, non-specific marker of tissue turnover or injury.',
            highMeans: 'High LDH can reflect injury to liver, muscle, blood cells or other tissues.',
            tips: 'Non-specific — interpreted alongside more targeted tests.',
        },
    },
    {
        names: ['Amylase'],
        content: {
            whatItIs: 'Amylase is a digestive enzyme, mostly from the pancreas and salivary glands, that breaks down starch.',
            whyItMatters: 'It helps detect pancreatic inflammation.',
            highMeans: 'High amylase can indicate pancreatitis or salivary-gland problems.',
            tips: 'Usually interpreted together with lipase for the pancreas.',
        },
    },
    {
        names: ['Lipase'],
        content: {
            whatItIs: 'Lipase is a pancreatic enzyme that digests fats.',
            whyItMatters: 'It is more specific than amylase for pancreatic inflammation.',
            highMeans: 'High lipase strongly suggests pancreatitis and warrants prompt evaluation.',
            tips: 'A markedly high value with abdominal pain needs urgent care.',
        },
    },
    {
        names: ['PT/INR'],
        content: {
            aka: 'Prothrombin time / INR',
            whatItIs: 'PT/INR measures how quickly your blood clots, which depends on liver-made clotting factors.',
            whyItMatters: 'It assesses clotting function, liver synthesis, and is used to monitor blood thinners.',
            highMeans: 'A high INR means slower clotting — from anticoagulants, vitamin K deficiency, or reduced liver function.',
            tips: 'If not on blood thinners, a rising INR can signal liver or vitamin-K issues.',
        },
    },
    {
        names: ['H. pylori IgG'],
        content: {
            whatItIs: 'This antibody test checks for past or present infection with H. pylori, a stomach bacterium.',
            whyItMatters: 'H. pylori is a common cause of ulcers, gastritis, and some stomach cancers.',
            highMeans: 'A positive result indicates exposure to H. pylori; active infection may need treatment, especially with symptoms.',
            tips: 'Discuss confirmatory testing and eradication therapy with a clinician if positive.',
        },
    },
    {
        names: ['Anti-gliadin IgA'],
        content: {
            whatItIs: 'Anti-gliadin IgA is an antibody against gliadin, a component of gluten.',
            whyItMatters: 'It is one screen for gluten sensitivity and celiac disease.',
            highMeans: 'A positive result suggests a gluten-related immune response and warrants further celiac testing.',
            tips: 'Do not start a gluten-free diet before confirmatory testing, as it can mask results.',
        },
    },
    {
        names: ['Anti-transglutaminase IgA', 'tTG-IgA'],
        content: {
            aka: 'tTG-IgA',
            whatItIs: 'Anti-transglutaminase IgA is the most specific blood screen for celiac disease.',
            whyItMatters: 'A positive result strongly suggests celiac disease (a gluten-triggered autoimmune condition).',
            highMeans: 'Elevated tTG-IgA warrants specialist referral and usually an intestinal biopsy to confirm celiac disease.',
            tips: 'Keep eating gluten until testing is complete so results stay accurate.',
        },
    },
    {
        names: ['Fecal calprotectin'],
        content: {
            whatItIs: 'Fecal calprotectin is a stool protein released by white cells in the gut lining.',
            whyItMatters: 'It distinguishes inflammatory bowel disease from non-inflammatory causes of gut symptoms.',
            highMeans: 'High calprotectin indicates active intestinal inflammation (e.g. IBD) and needs gastroenterology follow-up.',
            tips: 'Borderline results are often re-checked in a few weeks.',
        },
    },

    // ─────────────────────────── Kidney ───────────────────────────
    {
        names: ['Serum creatinine', 'Creatinine'],
        content: {
            whatItIs: 'Creatinine is a waste product from muscle activity that your kidneys filter out.',
            whyItMatters: 'It is the main marker of kidney filtering function (used to estimate eGFR).',
            highMeans: 'High creatinine suggests reduced kidney filtration, dehydration, or high muscle mass/intense exercise.',
            lowMeans: 'Low creatinine can reflect low muscle mass.',
            tips: 'Stay hydrated; a persistent rise needs kidney evaluation.',
        },
    },
    {
        names: ['BUN'],
        content: {
            aka: 'Blood Urea Nitrogen',
            whatItIs: 'BUN measures urea, a nitrogen waste product from protein metabolism cleared by the kidneys.',
            whyItMatters: 'With creatinine it assesses kidney function and hydration.',
            highMeans: 'High BUN can reflect dehydration, high protein intake, or reduced kidney function.',
            tips: 'Read as the BUN/creatinine ratio for context.',
        },
    },
    {
        names: ['Urinalysis (EGO)', 'Urinalysis'],
        content: {
            whatItIs: 'Urinalysis examines your urine’s chemistry and cells for signs of kidney, urinary, or metabolic issues.',
            whyItMatters: 'It screens broadly for infection, blood, protein, glucose and more in one quick test.',
            highMeans: 'Abnormal findings (protein, blood, glucose, leukocytes) each point to specific follow-up.',
            tips: 'Any abnormal result should be interpreted in the clinical context and often repeated.',
        },
    },

    // ─────────────────────────── Electrolytes ───────────────────────────
    {
        names: ['Calcium'],
        content: {
            whatItIs: 'Calcium in blood supports bones, nerves, muscles and clotting; it is tightly regulated by hormones.',
            whyItMatters: 'Abnormal levels can affect the heart, nerves and bones and point to parathyroid, vitamin D, or kidney issues.',
            highMeans: 'High calcium can stem from overactive parathyroid glands or other conditions and may cause fatigue or kidney stones.',
            lowMeans: 'Low calcium can cause cramps or tingling and often relates to vitamin D or parathyroid problems.',
            tips: 'Interpret with albumin, vitamin D and PTH.',
        },
    },
    {
        names: ['Magnesium', 'Magnesium (Serum)'],
        content: {
            whatItIs: 'Magnesium is a mineral essential for hundreds of enzyme reactions, including energy, nerve and insulin function.',
            whyItMatters: 'Even mild deficiency can worsen insulin resistance, blood pressure, sleep and muscle cramps.',
            lowMeans: 'Low magnesium is common and can cause cramps, poor sleep, and reduced insulin sensitivity.',
            highMeans: 'High magnesium is uncommon, usually related to supplements or kidney impairment.',
            tips: 'Leafy greens, nuts, seeds, legumes and dark chocolate are rich sources; glycinate supplements are well tolerated.',
        },
    },
    {
        names: ['Potassium'],
        content: {
            whatItIs: 'Potassium is an electrolyte critical for heart rhythm, nerve signals and muscle contraction.',
            whyItMatters: 'Both high and low levels can dangerously affect the heart.',
            highMeans: 'High potassium can disturb heart rhythm and often relates to kidney function or medications.',
            lowMeans: 'Low potassium can cause weakness and arrhythmias, often from fluid loss or diuretics.',
            tips: 'Marked abnormalities need prompt medical attention.',
        },
    },
    {
        names: ['Sodium'],
        content: {
            whatItIs: 'Sodium is the main electrolyte controlling your body’s fluid balance.',
            whyItMatters: 'It reflects hydration and hormonal regulation of water.',
            highMeans: 'High sodium usually signals dehydration.',
            lowMeans: 'Low sodium can come from over-hydration, certain medications, or hormonal issues and may cause confusion if severe.',
            tips: 'Balance fluids; significant shifts need evaluation.',
        },
    },
    {
        names: ['Chloride'],
        content: {
            whatItIs: 'Chloride is an electrolyte that partners with sodium to manage fluid and acid-base balance.',
            whyItMatters: 'It helps assess hydration and acid-base disorders.',
            highMeans: 'High chloride can accompany dehydration or acid-base imbalance.',
            lowMeans: 'Low chloride can follow vomiting or certain metabolic states.',
            tips: 'Interpreted with sodium and CO2.',
        },
    },
    {
        names: ['Phosphorus'],
        content: {
            whatItIs: 'Phosphorus works with calcium to build bone and power cellular energy.',
            whyItMatters: 'Levels reflect kidney, parathyroid and vitamin D status.',
            highMeans: 'High phosphorus is often linked to reduced kidney function.',
            lowMeans: 'Low phosphorus can follow malnutrition or certain hormonal conditions.',
            tips: 'Interpret with calcium, PTH and kidney function.',
        },
    },
    {
        names: ['CO2', 'Carbon Dioxide (Bicarbonate)', 'Bicarbonate'],
        content: {
            aka: 'Bicarbonate',
            whatItIs: 'This measures bicarbonate, which buffers acid in your blood.',
            whyItMatters: 'It reveals acid-base balance and metabolic or respiratory disturbances.',
            highMeans: 'High CO2 can reflect fluid loss or breathing-related acid-base changes.',
            lowMeans: 'Low CO2 can indicate metabolic acidosis from various causes.',
            tips: 'Read within the full electrolyte panel.',
        },
    },

    // ─────────────────────────── Thyroid ───────────────────────────
    {
        names: ['TSH'],
        content: {
            aka: 'Thyroid-Stimulating Hormone',
            whatItIs: 'TSH is the pituitary’s signal telling your thyroid how much hormone to make.',
            whyItMatters: 'It is the most sensitive first-line test of thyroid function.',
            highMeans: 'High TSH usually means an underactive thyroid (hypothyroidism) — fatigue, weight gain, cold intolerance.',
            lowMeans: 'Low TSH usually means an overactive thyroid (hyperthyroidism) — palpitations, weight loss, anxiety.',
            tips: 'Confirm abnormal TSH with free T4/T3 and thyroid antibodies.',
        },
    },
    {
        names: ['Free T3 (fT3)', 'Free T3'],
        content: {
            aka: 'Free triiodothyronine',
            whatItIs: 'Free T3 is the active thyroid hormone that drives your metabolism.',
            whyItMatters: 'It shows how much usable thyroid hormone is available to tissues.',
            highMeans: 'High free T3 supports an overactive thyroid.',
            lowMeans: 'Low free T3 can reflect underactive thyroid or poor conversion of T4 to T3.',
            tips: 'Selenium and adequate nutrition support healthy T4→T3 conversion.',
        },
    },
    {
        names: ['Free T4 (fT4)', 'Free T4'],
        content: {
            aka: 'Free thyroxine',
            whatItIs: 'Free T4 is the main thyroid hormone in circulation, a reserve converted to active T3.',
            whyItMatters: 'With TSH it confirms and grades thyroid dysfunction.',
            highMeans: 'High free T4 indicates an overactive thyroid.',
            lowMeans: 'Low free T4 with high TSH confirms hypothyroidism.',
            tips: 'Interpreted together with TSH.',
        },
    },
    {
        names: ['Anti-TPO antibodies', 'TPO Antibodies'],
        content: {
            aka: 'Thyroid peroxidase antibodies',
            whatItIs: 'Anti-TPO antibodies are immune proteins that attack a thyroid enzyme.',
            whyItMatters: 'They are the hallmark of autoimmune thyroid disease (Hashimoto’s).',
            highMeans: 'High anti-TPO indicates autoimmune thyroid activity, which can progress to hypothyroidism over time.',
            tips: 'Selenium may help lower antibodies; monitor thyroid function periodically.',
        },
    },
    {
        names: ['Anti-thyroglobulin (Anti-Tg)', 'Thyroglobulin Antibodies (TgAb)'],
        content: {
            aka: 'TgAb',
            whatItIs: 'Anti-thyroglobulin antibodies target a thyroid storage protein.',
            whyItMatters: 'They support a diagnosis of autoimmune thyroid disease alongside anti-TPO.',
            highMeans: 'A positive result adds evidence of autoimmune thyroid activity.',
            tips: 'Used with anti-TPO and thyroid function tests.',
        },
    },

    // ─────────────────────────── Nutrients ───────────────────────────
    {
        names: ['Vitamin D (25-OH)', 'Vitamin D'],
        content: {
            aka: '25-hydroxyvitamin D',
            whatItIs: 'Vitamin D is a hormone-like vitamin your skin makes from sunlight; this test measures your stored form.',
            whyItMatters: 'It supports bone, immune, mood, and metabolic health, and deficiency is very common.',
            lowMeans: 'Low vitamin D (<30) is widespread and linked to fatigue, poor immunity, bone loss and worse insulin sensitivity.',
            tips: 'Sensible sun exposure, fatty fish and D3 supplementation (with K2) restore levels; retest after ~3 months. Optimal is roughly 40–60.',
        },
    },
    {
        names: ['Vitamin B12'],
        content: {
            whatItIs: 'Vitamin B12 is essential for nerve function, red-cell production, and DNA synthesis.',
            whyItMatters: 'Deficiency causes fatigue, nerve symptoms and a specific anemia; it is common in vegetarians and older adults.',
            lowMeans: 'Low B12 can cause tiredness, tingling, memory issues and macrocytic anemia.',
            tips: 'Animal foods, fortified foods, or sublingual B12 restore levels; metformin and low stomach acid deplete it. Optimal is above ~500.',
        },
    },
    {
        names: ['Folate / B9', 'Folate'],
        content: {
            aka: 'Vitamin B9',
            whatItIs: 'Folate is a B vitamin vital for DNA synthesis, red-cell formation and methylation.',
            whyItMatters: 'It works with B12 to keep homocysteine and red cells healthy and is critical in pregnancy.',
            lowMeans: 'Low folate can cause macrocytic anemia and raised homocysteine.',
            tips: 'Leafy greens, legumes and citrus are rich sources; methylfolate is a well-absorbed supplement.',
        },
    },
    {
        names: ['Vitamin B6'],
        content: {
            aka: 'Pyridoxine (P5P)',
            whatItIs: 'Vitamin B6 is a cofactor for over 100 enzyme reactions, including neurotransmitter and homocysteine metabolism.',
            whyItMatters: 'It supports mood, nerve function and B-vitamin methylation pathways.',
            lowMeans: 'Low B6 can contribute to raised homocysteine, mood changes and nerve symptoms.',
            tips: 'Poultry, fish, potatoes, chickpeas and bananas provide B6; very high supplement doses can harm nerves.',
        },
    },
    {
        names: ['Zinc'],
        content: {
            whatItIs: 'Zinc is a trace mineral crucial for immunity, wound healing, hormones and taste.',
            whyItMatters: 'Deficiency impairs immune function, skin, and testosterone production.',
            lowMeans: 'Low zinc can cause frequent infections, poor healing, hair loss and low libido.',
            highMeans: 'Excess zinc (usually from supplements) can deplete copper.',
            tips: 'Oysters, meat, pumpkin seeds and legumes are rich sources; balance with copper if supplementing long-term.',
        },
    },
    {
        names: ['Copper'],
        content: {
            whatItIs: 'Copper is a trace mineral needed for iron metabolism, connective tissue and antioxidant enzymes.',
            whyItMatters: 'It must stay balanced with zinc; both deficiency and excess cause problems.',
            lowMeans: 'Low copper can cause anemia and neurological issues, sometimes from excess zinc.',
            highMeans: 'High copper can reflect inflammation, supplements, or (rarely) genetic overload.',
            tips: 'Monitor the zinc:copper ratio when supplementing either.',
        },
    },
    {
        names: ['Selenium'],
        content: {
            whatItIs: 'Selenium is a trace mineral essential for antioxidant defence and thyroid hormone conversion.',
            whyItMatters: 'It supports thyroid function and can lower thyroid antibodies.',
            lowMeans: 'Low selenium can impair thyroid conversion and antioxidant capacity.',
            highMeans: 'Too much selenium is toxic — keep supplements modest.',
            tips: 'Two Brazil nuts a day cover most needs; do not exceed 400 mcg/day.',
        },
    },
    {
        names: ['Omega-3 index (EPA+DHA)'],
        content: {
            whatItIs: 'The Omega-3 Index measures the EPA+DHA content of your red-cell membranes.',
            whyItMatters: 'Higher levels are linked to lower cardiovascular risk and better brain and inflammatory health.',
            lowMeans: 'A low index (<4%) indicates insufficient omega-3s and higher cardiovascular risk.',
            tips: 'Aim for a target of 8–12% with oily fish (salmon, sardines) 2–3×/week or a quality fish/algae oil.',
        },
    },
    {
        names: ['Vitamin A'],
        content: {
            aka: 'Retinol',
            whatItIs: 'Vitamin A supports vision, immune function, skin and cell growth.',
            whyItMatters: 'Both deficiency and excess have consequences, so balance matters.',
            lowMeans: 'Low vitamin A can affect night vision and immunity.',
            highMeans: 'High vitamin A (usually from supplements) can be toxic to the liver and, in pregnancy, the fetus.',
            tips: 'Colourful vegetables (beta-carotene) are a safe source; be cautious with high-dose retinol supplements.',
        },
    },
    {
        names: ['Vitamin E'],
        content: {
            aka: 'Alpha-tocopherol',
            whatItIs: 'Vitamin E is a fat-soluble antioxidant that protects cell membranes.',
            whyItMatters: 'It supports antioxidant defence and skin/immune health.',
            lowMeans: 'Low vitamin E is uncommon but can affect nerves and immunity.',
            tips: 'Nuts, seeds and vegetable oils provide vitamin E; avoid mega-dosing supplements.',
        },
    },
    {
        names: ['Vitamin K2'],
        content: {
            aka: 'Menaquinone (MK-7)',
            whatItIs: 'Vitamin K2 directs calcium into bones and away from arteries.',
            whyItMatters: 'It supports bone strength and arterial health, and complements vitamin D.',
            lowMeans: 'Low K2 may allow calcium to deposit in soft tissues rather than bone.',
            tips: 'Fermented foods (natto), some cheeses, and MK-7 supplements (paired with vitamin D) support K2 status.',
        },
    },
    {
        names: ['Active B12 (holotranscobalamin)', 'Holotranscobalamin'],
        content: {
            aka: 'HoloTC, active B12',
            whatItIs: 'Active B12 measures the fraction of vitamin B12 actually available to your cells.',
            whyItMatters: 'It detects B12 insufficiency earlier and more accurately than total B12.',
            lowMeans: 'Low active B12 signals functional B12 deficiency even if total B12 looks borderline.',
            tips: 'Confirm with methylmalonic acid if uncertain; supplement with B12 if low.',
        },
    },
    {
        names: ['RBC folate'],
        content: {
            whatItIs: 'RBC folate reflects your folate stores over the past few months, not just recent intake.',
            whyItMatters: 'It is a more stable measure of long-term folate status than serum folate.',
            lowMeans: 'Low RBC folate indicates a longer-standing folate shortfall.',
            tips: 'Leafy greens, legumes and citrus, or methylfolate, replenish stores.',
        },
    },
    {
        names: ['Intact PTH', 'PTH'],
        content: {
            aka: 'Parathyroid hormone',
            whatItIs: 'PTH is the hormone that regulates blood calcium by acting on bone, kidney and vitamin D.',
            whyItMatters: 'It is essential for interpreting calcium and vitamin D abnormalities and bone health.',
            highMeans: 'High PTH can be a response to low vitamin D/calcium or an overactive parathyroid gland.',
            lowMeans: 'Low PTH can follow high calcium or parathyroid problems.',
            tips: 'Always interpret with calcium and vitamin D together.',
        },
    },

    // ─────────────────────────── Immune / Inflammatory ───────────────────────────
    {
        names: ['IL-6', 'Interleukin-6'],
        content: {
            aka: 'Interleukin-6',
            whatItIs: 'IL-6 is a signalling protein (cytokine) that drives inflammation.',
            whyItMatters: 'Chronically elevated IL-6 is linked to cardiovascular, metabolic and age-related disease.',
            highMeans: 'High IL-6 reflects active or chronic inflammation from infection, obesity, or immune conditions.',
            tips: 'Anti-inflammatory lifestyle (activity, weight loss, omega-3s, sleep) helps lower it.',
        },
    },
    {
        names: ['TNF-alpha'],
        content: {
            aka: 'Tumor necrosis factor-alpha',
            whatItIs: 'TNF-alpha is a potent inflammatory cytokine.',
            whyItMatters: 'It is central to chronic inflammatory and autoimmune conditions.',
            highMeans: 'High TNF-alpha indicates active inflammation and is a target of some autoimmune therapies.',
            tips: 'Address underlying inflammation; interpret with other inflammatory markers.',
        },
    },
    {
        names: ['Fibrinogen'],
        content: {
            whatItIs: 'Fibrinogen is a clotting protein that also rises with inflammation.',
            whyItMatters: 'High levels increase clotting tendency and cardiovascular risk.',
            highMeans: 'High fibrinogen reflects inflammation and a more clot-prone state.',
            tips: 'Not smoking, activity and treating inflammation help lower it.',
        },
    },
    {
        names: ['ESR'],
        content: {
            aka: 'Erythrocyte sedimentation rate',
            whatItIs: 'ESR measures how fast red cells settle, which rises with inflammation.',
            whyItMatters: 'It is a simple, non-specific marker of inflammation used to monitor many conditions.',
            highMeans: 'A high ESR indicates inflammation somewhere in the body but does not localise it.',
            tips: 'Interpreted with CRP and the clinical picture.',
        },
    },
    {
        names: ['ANA screen'],
        content: {
            aka: 'Antinuclear antibody',
            whatItIs: 'The ANA screen detects antibodies against your own cell nuclei.',
            whyItMatters: 'It is a first-line screen for autoimmune diseases like lupus.',
            highMeans: 'A positive ANA (especially at higher titres) can suggest autoimmune disease, though many healthy people test weakly positive.',
            tips: 'A positive result needs clinical context and often more specific autoantibody testing.',
        },
    },
    {
        names: ['Rheumatoid factor', 'Rheumatoid Factor (RF)'],
        content: {
            aka: 'RF',
            whatItIs: 'Rheumatoid factor is an antibody often present in rheumatoid arthritis and other conditions.',
            whyItMatters: 'It supports the diagnosis of inflammatory arthritis.',
            highMeans: 'A high RF raises suspicion of rheumatoid arthritis, but can occur with other conditions or in healthy people.',
            tips: 'Interpret with symptoms, anti-CCP and imaging.',
        },
    },
    {
        names: ['Complement C3'],
        content: {
            whatItIs: 'C3 is part of the complement system, a group of proteins that support immune defence.',
            whyItMatters: 'Levels change in autoimmune and inflammatory diseases.',
            lowMeans: 'Low C3 can occur when complement is consumed in active autoimmune disease (e.g. lupus flares).',
            highMeans: 'High C3 can reflect acute inflammation.',
            tips: 'Read with C4 and autoimmune markers.',
        },
    },
    {
        names: ['Complement C4'],
        content: {
            whatItIs: 'C4 is another complement protein in the immune cascade.',
            whyItMatters: 'It helps assess autoimmune activity alongside C3.',
            lowMeans: 'Low C4 can indicate active autoimmune disease or an inherited deficiency.',
            tips: 'Interpreted together with C3.',
        },
    },
    {
        names: ['Lymphocyte differential'],
        content: {
            whatItIs: 'This is the absolute count of lymphocytes, immune cells central to your adaptive defences.',
            whyItMatters: 'It shifts with infections and immune conditions.',
            lowMeans: 'Low lymphocytes can follow steroids, stress, or immune suppression.',
            highMeans: 'High lymphocytes often reflect viral infection.',
            tips: 'Interpreted within the full white-cell differential.',
        },
    },
    {
        names: ['D-dimer'],
        content: {
            whatItIs: 'D-dimer is a fragment released when a blood clot breaks down.',
            whyItMatters: 'It helps rule out abnormal clotting (like DVT or pulmonary embolism).',
            highMeans: 'A high D-dimer can indicate active clot formation and breakdown, though it also rises with inflammation, infection and age.',
            tips: 'A high value with symptoms needs urgent evaluation to exclude clots.',
        },
    },
    {
        names: ['8-OHdG (oxidative DNA damage)'],
        content: {
            whatItIs: '8-OHdG is a marker of oxidative damage to your DNA from free radicals.',
            whyItMatters: 'It reflects overall oxidative stress, which contributes to ageing and chronic disease.',
            highMeans: 'High 8-OHdG suggests elevated oxidative stress from factors like poor metabolic health, smoking, or inflammation.',
            tips: 'Antioxidant-rich foods, activity, good sleep and not smoking help lower oxidative stress.',
        },
    },

    // ─────────────────────────── Hormonal / Reproductive ───────────────────────────
    {
        names: ['Total testosterone', 'Testosterone Total'],
        content: {
            whatItIs: 'Total testosterone measures all testosterone in your blood, both bound and free.',
            whyItMatters: 'It affects energy, libido, muscle, mood, and (in women) can indicate PCOS when high.',
            lowMeans: 'Low testosterone (mainly in men) can cause fatigue, low libido, and loss of muscle.',
            highMeans: 'High testosterone in women can signal PCOS; in men it may reflect supplementation.',
            tips: 'Strength training, sleep, weight management and treating insulin resistance support healthy levels.',
        },
    },
    {
        names: ['Free testosterone', 'Testosterone Free'],
        content: {
            whatItIs: 'Free testosterone is the small, unbound fraction that is biologically active.',
            whyItMatters: 'It often reflects symptoms better than total testosterone, especially when SHBG is abnormal.',
            lowMeans: 'Low free testosterone can cause low-testosterone symptoms even if total looks normal.',
            highMeans: 'High free testosterone in women drives acne, excess hair and cycle issues (PCOS pattern).',
            tips: 'Depends on both total testosterone and SHBG.',
        },
    },
    {
        names: ['Estradiol (E2)'],
        content: {
            aka: 'E2',
            whatItIs: 'Estradiol is the main form of estrogen, central to reproductive and bone health.',
            whyItMatters: 'It regulates the menstrual cycle in women and contributes to bone and cardiovascular health in both sexes.',
            lowMeans: 'Low estradiol (e.g. menopause) can cause hot flushes, bone loss and cycle changes.',
            highMeans: 'High estradiol can reflect cycle phase or, in men, excess aromatisation.',
            tips: 'Interpret against menstrual-cycle phase and menopausal status.',
        },
    },
    {
        names: ['FSH'],
        content: {
            aka: 'Follicle-stimulating hormone',
            whatItIs: 'FSH from the pituitary drives egg and sperm development.',
            whyItMatters: 'It helps assess fertility and menopausal/ovarian-reserve status.',
            highMeans: 'High FSH suggests declining ovarian reserve or menopause (in women) or testicular issues (in men).',
            tips: 'Interpret with LH, estradiol and AMH.',
        },
    },
    {
        names: ['LH'],
        content: {
            aka: 'Luteinizing hormone',
            whatItIs: 'LH from the pituitary triggers ovulation and testosterone production.',
            whyItMatters: 'The LH:FSH ratio and level help diagnose PCOS, menopause, and pituitary issues.',
            highMeans: 'High LH (with a high LH:FSH ratio) is a classic PCOS pattern; very high with high FSH suggests menopause.',
            tips: 'Read alongside FSH and the cycle phase.',
        },
    },
    {
        names: ['Prolactin'],
        content: {
            whatItIs: 'Prolactin is a pituitary hormone best known for milk production.',
            whyItMatters: 'Elevated levels can disrupt periods, fertility and libido.',
            highMeans: 'High prolactin can come from stress, medications, or a benign pituitary tumour, and can suppress other sex hormones.',
            tips: 'Persistently high levels warrant repeat testing and possible pituitary imaging.',
        },
    },
    {
        names: ['SHBG'],
        content: {
            aka: 'Sex hormone-binding globulin',
            whatItIs: 'SHBG is a protein that binds sex hormones, controlling how much is free and active.',
            whyItMatters: 'It sets your free testosterone and estrogen levels and is suppressed by insulin.',
            lowMeans: 'Low SHBG (often from high insulin/insulin resistance) raises free androgens — a key PCOS feature.',
            highMeans: 'High SHBG lowers free hormone availability.',
            tips: 'Improving insulin sensitivity raises SHBG and lowers free androgens.',
        },
    },
    {
        names: ['Total PSA'],
        content: {
            aka: 'Prostate-specific antigen',
            whatItIs: 'PSA is a protein made by the prostate; blood levels rise with prostate conditions.',
            whyItMatters: 'It screens for prostate enlargement, inflammation and cancer in men.',
            highMeans: 'High PSA can reflect benign enlargement, infection, or prostate cancer and needs urological assessment.',
            tips: 'Avoid ejaculation and vigorous cycling before testing; interpret trends over time.',
        },
    },
    {
        names: ['Free PSA'],
        content: {
            whatItIs: 'Free PSA is the unbound fraction of PSA; its percentage helps interpret a raised total PSA.',
            whyItMatters: 'A higher %free PSA makes prostate cancer less likely, refining risk.',
            highMeans: 'A high %free PSA is reassuring; a low %free with elevated total PSA increases cancer suspicion.',
            tips: 'Used together with total PSA to decide on further testing.',
        },
    },
    {
        names: ['Progesterone'],
        content: {
            whatItIs: 'Progesterone is a hormone that prepares the uterus for pregnancy and balances estrogen.',
            whyItMatters: 'It confirms ovulation and supports early pregnancy and cycle health.',
            lowMeans: 'Low progesterone in the luteal phase can indicate anovulation or luteal-phase issues.',
            tips: 'Timing relative to the cycle is essential for interpretation.',
        },
    },
    {
        names: ['DHEA-S'],
        content: {
            aka: 'Dehydroepiandrosterone sulfate',
            whatItIs: 'DHEA-S is an adrenal hormone and a precursor to sex hormones.',
            whyItMatters: 'It reflects adrenal output and contributes to androgen levels.',
            highMeans: 'High DHEA-S can contribute to PCOS-type androgen excess or adrenal conditions.',
            lowMeans: 'Low DHEA-S can reflect adrenal fatigue-type patterns or ageing.',
            tips: 'Interpret with the full hormone panel and stress markers.',
        },
    },
    {
        names: ['AMH'],
        content: {
            aka: 'Anti-Müllerian hormone',
            whatItIs: 'AMH reflects the number of eggs remaining in the ovaries (ovarian reserve).',
            whyItMatters: 'It helps assess fertility potential and is often elevated in PCOS.',
            lowMeans: 'Low AMH suggests reduced ovarian reserve (declines naturally with age).',
            highMeans: 'High AMH is common in PCOS (many small follicles).',
            tips: 'Interpret against age and the wider reproductive picture.',
        },
    },
    {
        names: ['Morning cortisol', 'Morning Serum Cortisol'],
        content: {
            whatItIs: 'Cortisol is your main stress hormone; it naturally peaks in the morning.',
            whyItMatters: 'It regulates metabolism, blood pressure and the stress response; chronic elevation harms sleep and insulin sensitivity.',
            highMeans: 'High morning cortisol can reflect stress, poor sleep, or (rarely) adrenal/pituitary conditions.',
            lowMeans: 'Low morning cortisol can indicate adrenal insufficiency and needs evaluation.',
            tips: 'Sleep, stress management, and reducing evening caffeine/alcohol help normalise cortisol.',
        },
    },
    {
        names: ['Evening cortisol'],
        content: {
            whatItIs: 'Evening cortisol should be low as part of a healthy daily rhythm.',
            whyItMatters: 'A high evening value suggests a disrupted stress-hormone rhythm that impairs sleep and recovery.',
            highMeans: 'Elevated evening cortisol points to chronic stress or circadian disruption.',
            tips: 'Wind-down routines, limiting screens and stimulants at night, and stress reduction help.',
        },
    },
    {
        names: ['IGF-1'],
        content: {
            aka: 'Insulin-like growth factor 1',
            whatItIs: 'IGF-1 reflects growth-hormone activity and supports tissue growth and repair.',
            whyItMatters: 'It is used to assess growth-hormone status and is age-dependent.',
            lowMeans: 'Low IGF-1 can reflect low growth-hormone output or poor nutrition.',
            highMeans: 'High IGF-1 can indicate excess growth hormone and warrants review.',
            tips: 'Always interpret against age-specific ranges.',
        },
    },
    {
        names: ['GH (fasting)', 'Growth hormone'],
        content: {
            aka: 'Growth hormone',
            whatItIs: 'Growth hormone supports growth, metabolism and repair; it is released in pulses, mostly during sleep.',
            whyItMatters: 'A single fasting value is limited because GH is pulsatile — IGF-1 is often more informative.',
            highMeans: 'A persistently high GH can indicate excess secretion and needs specialist assessment.',
            tips: 'Quality sleep and exercise support healthy GH rhythms; interpret with IGF-1.',
        },
    },
];

const CONTENT: Record<string, BiomarkerContent> = {};
for (const entry of ENTRIES) {
    for (const n of entry.names) CONTENT[normalizeKey(n)] = entry.content;
}

export const getBiomarkerContent = (name: string): BiomarkerContent | null =>
    CONTENT[normalizeKey(name)] || null;
