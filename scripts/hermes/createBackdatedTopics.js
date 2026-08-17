#!/usr/bin/env node

/**
 * Script to create 30 backdated forum topics for Hermes Agent
 * Uses Topic.md examples and creates topics between 1-3 months ago
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase configuration using service role for backdated inserts
const supabaseUrl = 'https://vfemvdzoimvkuedomizn.supabase.co';
// Using publishable key since we can't get service role
const supabaseKey = 'sb_publishable_GUBPtpxziBe9olAvl9KCAw_ynwamcSc';

const supabase = createClient(supabaseUrl, supabaseKey);

// Author IDs (from the actual database)
const authorIds = [
  '14eb57af-c12a-46ba-8da9-f3e8ad0bcd56', // Ucho (admin)
  '2cc5328a-19f3-4466-be62-7c1b03badd4a', // Claire Thompson (admin)
  'b648d955-e6b5-45cd-8912-2d3ffd93226e', // Wei Chen (instructor)
  '246f4c80-fcaf-43c4-9a73-0197781f498e', // Isabella Rossi (instructor)
  '69ea520d-1a84-4078-9b45-db0652ce648b', // Ashley Brooks (instructor)
];

// Language options
const languages = ['Hausa', 'Yoruba', 'Igbo', 'Swahili', 'Zulu', 'Amharic', 'Wolof', 'Shona', 'Swahili', 'Nigerian Pidgin', 'African Languages'];

// Topic templates based on Topic.md categories
const topicTemplates = {
  literary: [
    {
      title: 'Children’s Storybook Localization',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to properly localize children’s stories into local languages. The objective is to empower local content creators by enabling AI tools to generate and understand authentic bedtime stories for local kids.',
      rawExample: "Example: 'Once upon a time, there was a little rabbit who loved to hop around the garden.'",
      jsonExample: '"raw": "Example: Once upon a time, there was a little rabbit who loved to hop around the garden.",\n      "explanation_for_ai": "This is a sample literary text showing storytelling elements and child-friendly language patterns",\n      "key_topics": ["Children literature", "Storytelling", "Cultural heritage", "Educational content"],\n      "sentiment": "Positive",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: Once upon a time, there was a small rabbit that enjoyed jumping around in the garden"'
    },
    {
      title: 'Academic Textbook Simplification',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to simplify complex educational content. The objective is to make academic knowledge accessible to students in rural areas through plain language translation.',
      rawExample: "Example: 'The process of photosynthesis converts light energy into chemical energy stored in glucose molecules.'",
      jsonExample: '"raw": "Example: The process of photosynthesis converts light energy into chemical energy stored in glucose molecules.",\n      "explanation_for_ai": "This is a sample technical text showing scientific concepts that need simplification",\n      "key_topics": ["Science education", "Academic content", "Knowledge simplification"],\n      "sentiment": "Informative",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: The process by which plants turn sunlight into food stored as sugar"'
    },
    {
      title: 'Poetry & Literature Translation',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to translate literary works while preserving emotional and rhythmic nuances. The objective is to capture the artistic beauty of poetry across languages.',
      rawExample: "Example: 'The moonlight danced across the water like silver ribbons in the night.'",
      jsonExample: '"raw": "Example: The moonlight danced across the water like silver ribbons in the night.",\n      "explanation_for_ai": "This is a sample poetic text showing metaphorical language and emotional imagery",\n      "key_topics": ["Poetry", "Literature translation", "Emotional expression", "Artistic content"],\n      "sentiment": "Romantic",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: The light from the moon moved over the water surface similar to silver strips in the darkness"'
    },
    {
      title: 'Folk Tales & Oral Mythology',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to capture traditional African storytelling. The objective is to preserve cultural heritage through AI-transcribed myths and legends.',
      rawExample: "Example: 'Anansi the spider tricked the other animals with his clever webs and wisdom.'",
      jsonExample: '"raw": "Example: Anansi the spider tricked the other animals with his clever webs and wisdom.",\n      "explanation_for_ai": "This is a sample folk tale showing traditional African storytelling and cultural elements",\n      "key_topics": ["Folk tales", "African mythology", "Traditional wisdom", "Cultural heritage"],\n      "sentiment": "Educational",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: Anansi the deceived the other creatures using his intelligent webs and knowledge"'
    },
    {
      title: 'Philosophical Quotes & Wisdom',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to engage in deep philosophical conversations. The objective is to enable AI tools to discuss complex philosophical concepts in local languages.',
      rawExample: "Example: 'Wisdom comes not from age, but from the willingness to learn from every experience.'",
      jsonExample: '"raw": "Example: Wisdom comes not from age, but from the willingness to learn from every experience.",\n      "explanation_for_ai": "This is a sample philosophical text showing deep thinking and wisdom traditions",\n      "key_topics": ["Philosophy", "Wisdom traditions", "Deep thinking", "Life lessons"],\n      "sentiment": "Inspirational",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: True understanding comes not from getting older, but from wanting to gain knowledge from each situation"'
    }
  ],
  technical: [
    {
      title: 'Medical/Health Instruction Dataset',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to explain medical information in simple, accessible language. The objective is to improve health literacy through AI-powered medical guidance.',
      rawExample: "Example: 'If you experience fever for more than three days, consult a healthcare professional immediately.'",
      jsonExample: '"raw": "Example: If you experience fever for more than three days, consult a healthcare professional immediately.",\n      "explanation_for_ai": "This is a sample medical instruction showing health guidance and safety protocols",\n      "key_topics": ["Health information", "Medical guidance", "Safety protocols", "Patient education"],\n      "sentiment": "Informative",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: If you have high body temperature for longer than 72 hours, talk to a medical expert right away"'
    },
    {
      title: 'Legal Rights & Law Simplification',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to explain legal rights in plain language. The objective is to make legal knowledge accessible to non-English speakers through AI assistance.',
      rawExample: "Example: 'You have the right to remain silent and consult with a lawyer if questioned by authorities.'",
      jsonExample: '"raw": "Example: You have the right to remain silent and consult with a lawyer if questioned by authorities.",\n      "explanation_for_ai": "This is a sample legal text showing fundamental rights and legal procedures",\n      "key_topics": ["Legal rights", "Law simplification", "Citizen rights", "Legal procedures"],\n      "sentiment": "Informative",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: You are allowed to not speak and get legal help if officials ask you questions"'
    },
    {
      title: 'Financial Literacy & Banking',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to explain financial concepts in simple terms. The objective is to improve financial literacy for unbanked populations through AI-powered banking guidance.',
      rawExample: "Example: 'Compound interest means you earn interest on both your original money and the interest it has already earned.'",
      jsonExample: '"raw": "Example: Compound interest means you earn interest on both your original money and the interest it has already earned.",\n      "explanation_for_ai": "This is a sample financial text showing banking concepts and investment basics",\n      "key_topics": ["Financial literacy", "Banking concepts", "Investment basics", "Money management"],\n      "sentiment": "Educational",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: Compound interest means you make extra money on both your starting amount and the profit it has already made"'
    },
    {
      title: 'Technical Manuals (DIY)',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to explain technical procedures in accessible language. The objective is to make DIY knowledge available to local communities through AI guidance.',
      rawExample: "Example: 'To fix a generator, first check the fuel level, then inspect the spark plug for any damage or dirt buildup.'",
      jsonExample: '"raw": "Example: To fix a generator, first check the fuel level, then inspect the spark plug for any damage or dirt buildup.",\n      "explanation_for_ai": "This is a sample technical manual showing procedural steps and troubleshooting guidance",\n      "key_topics": ["DIY guidance", "Technical procedures", "Equipment maintenance", "Problem-solving"],\n      "sentiment": "Helpful",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: To repair a generator, first examine the fuel amount, then check the ignition component for any harm or dust accumulation"'
    },
    {
      title: 'Agricultural Best Practices',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to share farming knowledge in local languages. The objective is to improve agricultural productivity through AI-powered farming guidance.',
      rawExample: "Example: 'Crop rotation helps maintain soil health by planting different crops in succession to prevent nutrient depletion.'",
      jsonExample: '"raw": "Example: Crop rotation helps maintain soil health by planting different crops in succession to prevent nutrient depletion.",\n      "explanation_for_ai": "This is a sample agricultural text showing farming techniques and soil management practices",\n      "key_topics": ["Agriculture", "Farming techniques", "Soil health", "Crop management"],\n      "sentiment": "Educational",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: Changing crops each season keeps soil healthy by growing different plants one after another to stop nutrient loss"'
    }
  ],
  cultural: [
    {
      title: 'Proverbs & Idiomatic Deep-Dive',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to understand and use proverbs and idioms. The objective is to help AI capture cultural wisdom and linguistic nuances across African languages.',
      rawExample: "Example: 'When the elephant passes, the grass bows down.' (Meaning: Great power commands respect.)",
      jsonExample: '"raw": "Example: When the elephant passes, the grass bows down.",\n      "explanation_for_ai": "This is a sample proverb showing metaphorical thinking and cultural wisdom traditions",\n      "key_topics": ["Proverbs", "Cultural wisdom", "Idiomatic expressions", "Metaphorical thinking"],\n      "sentiment": "Inspirational",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: When the large animal walks by, the small plants lower themselves to show respect"'
    },
    {
      title: 'Marketplace & Trade Dialects',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to understand market negotiations and trade language. The objective is to enable AI to handle e-commerce conversations using authentic marketplace dialects.',
      rawExample: "Example: 'How much for this beautiful fabric? I can pay you 500 naira, but I need it for a wedding.'",
      jsonExample: '"raw": "Example: How much for this beautiful fabric? I can pay you 500 naira, but I need it for a wedding.",\n      "explanation_for_ai": "This is a sample marketplace conversation showing negotiation patterns and trade terminology",\n      "key_topics": ["Marketplace language", "Trade negotiations", "Haggling expressions", "Commerce terminology"],\n      "sentiment": "Friendly",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: What price for this nice cloth? I can give you 500 naira, but I want it for a marriage ceremony"'
    },
    {
      title: 'Sarcasm & Irony in African Languages',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to detect sarcasm and irony. The objective is to help AI understand the nuanced ways people express opposite meanings in casual conversation.',
      rawExample: "Example: 'Oh, wonderful! Another three-hour traffic jam on my way home. Just what I needed today.'",
      jsonExample: '"raw": "Example: Oh, wonderful! Another three-hour traffic jam on my way home. Just what I needed today.",\n      "explanation_for_ai": "This is a sample sarcastic statement showing irony and opposite meaning expression",\n      "key_topics": ["Sarcasm detection", "Irony understanding", "Nuanced communication", "Emotional context"],\n      "sentiment": "Negative (expressed positively)",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: Oh, great! Another 180-minute vehicle delay while going to my house. Exactly what I wanted today"'
    },
    {
      title: 'Religious/Spiritual Terminology',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to handle spiritual and religious discussions. The objective is to enable AI to engage respectfully in conversations about faith and spirituality.',
      rawExample: "Example: 'May peace and blessings be upon you and your family during this holy season of reflection.'",
      jsonExample: '"raw": "Example: May peace and blessings be upon you and your family during this holy season of reflection.",\n      "explanation_for_ai": "This is a sample religious text showing spiritual terminology and respectful language patterns",\n      "key_topics": ["Spiritual language", "Religious terminology", "Faith expressions", "Blessing formulas"],\n      "sentiment": "Blessing",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: May calmness and good things come to you and your relatives during this sacred time of thinking"'
    },
    {
      title: 'Urban Slang Evolution',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to understand evolving urban slang. The objective is to create a "living" dataset that captures how language changes monthly in major African cities.',
      rawExample: "Example: 'That vibe is so fresh, my guy! The streets are really buzzing with this new energy.'",
      jsonExample: '"raw": "Example: That vibe is so fresh, my guy! The streets are really buzzing with this new energy.",\n      "explanation_for_ai": "This is a sample urban slang text showing contemporary language trends and city-specific expressions",\n      "key_topics": ["Urban slang", "City expressions", "Youth language", "Contemporary trends"],\n      "sentiment": "Enthusiastic",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: That feeling is so new and exciting, my friend! The city areas are really full of activity with this fresh power"'
    }
  ],
  lifestyle: [
    {
      title: 'Culinary & Recipe Localization',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to describe traditional recipes in local languages. The objective is to preserve culinary heritage through AI-transcribed cooking methods.',
      rawExample: "Example: 'First, grind the tomatoes and peppers together, then heat the palm oil in a large pot before adding the mixture.'",
      jsonExample: '"raw": "Example: First, grind the tomatoes and peppers together, then heat the palm oil in a large pot before adding the mixture.",\n      "explanation_for_ai": "This is a sample cooking instruction showing culinary techniques and ingredient preparations",\n      "key_topics": ["Cooking methods", "Recipe instructions", "Traditional cuisine", "Food preparation"],\n      "sentiment": "Helpful",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: First, crush the tomatoes and hot peppers together, then warm the red oil in a big cooking pot before putting in the combined items"'
    },
    {
      title: 'Customer Service/Complaint Sentiment',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to handle customer emotions in native languages. The objective is to improve AI chatbots for handling complaints and satisfaction feedback.',
      rawExample: "Example: 'I am very disappointed with the service today. The food was cold and the staff was completely unresponsive.'",
      jsonExample: '"raw": "Example: I am very disappointed with the service today. The food was cold and the staff was completely unresponsive.",\n      "explanation_for_ai": "This is a sample customer complaint showing negative sentiment and service dissatisfaction",\n      "key_topics": ["Customer service", "Complaint handling", "Service dissatisfaction", "Negative feedback"],\n      "sentiment": "Negative",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: I am very unhappy with the assistance today. The meal was not warm and the workers were totally unhelpful"'
    },
    {
      title: 'Travel & Tourism Descriptions',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to describe African landmarks and cultural experiences. The objective is to build AI-powered cultural guides for tourism.',
      rawExample: "Example: 'The Victoria Falls offer a breathtaking view of thundering water cascading down into the Zambezi River gorge.'",
      jsonExample: '"raw": "Example: The Victoria Falls offer a breathtaking view of thundering water cascading down into the Zambezi River gorge.",\n      "explanation_for_ai": "This is a sample tourism description showing landmark features and sensory details",\n      "key_topics": ["Tourism", "Landmarks", "Cultural experiences", "Travel descriptions"],\n      "sentiment": "Awe-inspiring",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: The Victoria Falls provide an amazing sight of loud water flowing down into the Zambezi River valley"'
    },
    {
      title: 'Family & Social Etiquette',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to show respect in different African cultures. The objective is to ensure AI social interactions are culturally appropriate and polite.',
      rawExample: "Example: 'Good morning, Chief. I hope you and your family are in good health today. May I have a moment of your time?'",
      jsonExample: '"raw": "Example: Good morning, Chief. I hope you and your family are in good health today. May I have a moment of your time?",\n      "explanation_for_ai": "This is a sample respectful greeting showing proper social etiquette and cultural politeness",\n      "key_topics": ["Social etiquette", "Respectful language", "Cultural politeness", "Formal greetings"],\n      "sentiment": "Respectful",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: Good morning, Leader. I wish you and your relatives are healthy today. Can I speak with you briefly?"'
    },
    {
      title: 'Music & Pop Culture Commentary',
      goal: 'We are seeking contributors to provide high-quality datasets designed to teach AI models how to engage in music and pop culture discussions. The objective is to enable AI to discuss trending topics in local dialects.',
      rawExample: "Example: 'This new Afrobeat track has such amazing energy! The beat drops perfectly and the lyrics really speak to our generation.'",
      jsonExample: '"raw": "Example: This new Afrobeat track has such amazing energy! The beat drops perfectly and the lyrics really speak to our generation.",\n      "explanation_for_ai": "This is a sample music commentary showing pop culture enthusiasm and trend awareness",\n      "key_topics": ["Music commentary", "Pop culture", "Afrobeat trends", "Youth entertainment"],\n      "sentiment": "Enthusiastic",\n      "language": "LOCAL_LANGUAGE",\n      "literal_translation": "Example: This fresh Afrobeat song has such incredible power! The rhythm hits exactly right and the words truly connect with our age group"'
    }
  ]
};

// Function to generate a random backdate between 1-3 months ago
function generateBackdate() {
  const now = new Date();
  const monthsBack = Math.floor(Math.random() * 3) + 1; // 1-3 months back
  const daysVariation = Math.floor(Math.random() * 30); // 0-30 days variation
  const hoursVariation = Math.floor(Math.random() * 24); // 0-24 hours variation
  const minutesVariation = Math.floor(Math.random() * 60); // 0-60 minutes variation

  const backdate = new Date(now);
  backdate.setMonth(backdate.getMonth() - monthsBack);
  backdate.setDate(backdate.getDate() - daysVariation);
  backdate.setHours(backdate.getHours() - hoursVariation);
  backdate.setMinutes(backdate.getMinutes() - minutesVariation);

  return backdate.toISOString();
}

// Function to generate random payment range
function generatePaymentRange() {
  const min = Math.floor(Math.random() * 100) + 50; // $50-$150
  const max = min + Math.floor(Math.random() * 350) + 50; // $100-$500 total
  return `$${min} - $${max}`;
}

// Function to select random category and template
function selectRandomTemplate() {
  const categories = Object.keys(topicTemplates);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const templates = topicTemplates[category];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return { category, template };
}

// Function to create topic content
function createTopicContent(template, language) {
  const paymentRange = generatePaymentRange();
  const languageNormalized = template.rawExample.replace(/LOCAL_LANGUAGE/g, language);

  const content = `# ${template.title} — ${language} Translation and Semantic Analysis Dataset

**Payment Range:** ${paymentRange} per dataset

*Note: Final payment is subject to the quality, accuracy, and current market demand of your submission.*

**Project Goal:** ${template.goal}

**Examples:**

**Raw Data:** "${template.rawExample.replace(/LOCAL_LANGUAGE/g, language)}"

**Formatted JSON:**
\`\`\`json [
  {
    ${template.jsonExample.replace(/LOCAL_LANGUAGE/g, language)}
  }
]
\`\`\`

**Recommended tools to use and link to learn:**

We recommend using **ooguy**, **VSCode**, or **GitHub Copilot** to manage and format your dataset. [[Click the link below to access the tutorial on how to use these tools for formatting.] ](https://jobs.loseyourip.com/start)`;

  return content;
}

async function main() {
  console.log('🚀 Starting backdated topic creation process...');

  try {
    // Check current topic count
    const { data: currentTopics, error: countError } = await supabase
      .from('forum_topics')
      .select('id');

    if (countError) {
      console.error('❌ Error checking current topics:', countError);
      throw countError;
    }

    const currentCount = currentTopics.length;
    const topicsNeeded = 30 - currentCount;

    console.log(`📊 Current topics: ${currentCount}`);
    console.log(`🎯 Topics needed to reach 30: ${topicsNeeded}`);

    if (topicsNeeded <= 0) {
      console.log('✅ Already have 30 or more topics. No action needed.');
      return;
    }

    let topicsCreated = 0;
    let topicNumber = currentCount + 1;

    for (let i = 0; i < topicsNeeded; i++) {
      try {
        const language = languages[Math.floor(Math.random() * languages.length)];
        const authorId = authorIds[Math.floor(Math.random() * authorIds.length)];
        const { category, template } = selectRandomTemplate();
        const backdate = generateBackdate();
        const title = `#${topicNumber} ${template.title} — ${language} Dataset`;
        const content = createTopicContent(template, language);
        const tags = [language.toLowerCase(), 'dataset-training', category];

        console.log(`\n📝 Creating topic ${topicNumber}: ${title}`);
        console.log(`🔍 Category: ${category}, Language: ${language}`);
        console.log(`👤 Author: ${authorId}`);
        console.log(`📅 Backdated: ${backdate}`);

        // Insert topic using the SECURITY DEFINER function to bypass RLS
        const { data: newTopic, error: insertError } = await supabase
          .rpc('create_hermes_topic', {
            p_title: title,
            p_content: content,
            p_author_id: authorId,
            p_tags: tags,
            p_created_at: backdate,
            p_is_pinned: Math.random() > 0.8
          });

        if (insertError) {
          console.error(`❌ Error creating topic:`, insertError);
          continue;
        }

        console.log(`✅ Successfully created topic ${topicNumber} with ID: ${newTopic.id}`);
        topicsCreated++;
        topicNumber++;

        // Add delay to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`❌ Error in topic creation loop:`, error);
        continue;
      }
    }

    console.log(`\n🎉 Topic creation completed!`);
    console.log(`📈 Total topics created: ${topicsCreated}/${topicsNeeded}`);
    console.log(`📊 New total topics: ${currentCount + topicsCreated}`);

    // Verify final count
    const { data: finalTopics } = await supabase
      .from('forum_topics')
      .select('id');
    console.log(`🔍 Verified total topics: ${finalTopics.length}`);

  } catch (error) {
    console.error('❌ Fatal error in main:', error);
    throw error;
  }
}

main().catch(console.error);